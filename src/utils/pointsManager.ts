import {
  POINTS_CONFIG,
  PointsActivityEvent,
  PointsBreakdown,
  PointsState,
} from '../types/points';
import { progressManager } from './progressManager';

const POINTS_STORAGE_KEY = 'algo_quest_points_system_v3';

const INITIAL_POINTS_STATE: PointsState = {
  version: 3,
  completedTheoryIds: [],
  completedVisualizeIds: [],
  completedGameLevelIds: [],
  quizScore: 0,
  hintPenaltiesTotal: 0,
  hintUsesCount: 0,
  guidedSolvePenaltiesTotal: 0,
  guidedSolveUsesCount: 0,
  totalPoints: 0,
  history: [],
};

type PointsListener = (state: PointsState) => void;

class PointsManager {
  private state: PointsState;
  private listeners: Set<PointsListener> = new Set();
  private lastActionTimestamps: Map<string, number> = new Map();

  constructor() {
    this.state = this.loadState();
    this.syncWithExistingProgress();
  }

  private loadState(): PointsState {
    if (typeof window === 'undefined') return { ...INITIAL_POINTS_STATE };
    try {
      const stored = localStorage.getItem(POINTS_STORAGE_KEY);
      if (!stored) {
        // Fallback check for v2 migration
        const v2Stored = localStorage.getItem('algo_quest_points_system_v2');
        if (v2Stored) {
          const v2Parsed = JSON.parse(v2Stored);
          if (v2Parsed) {
            return {
              version: 3,
              completedTheoryIds: Array.isArray(v2Parsed.completedTheoryIds)
                ? Array.from(new Set(v2Parsed.completedTheoryIds))
                : [],
              completedVisualizeIds: Array.isArray(v2Parsed.completedVisualizeIds)
                ? Array.from(new Set(v2Parsed.completedVisualizeIds))
                : [],
              completedGameLevelIds: Array.isArray(v2Parsed.completedGameLevelIds)
                ? Array.from(new Set(v2Parsed.completedGameLevelIds))
                : [],
              quizScore: Math.max(0, Math.min(POINTS_CONFIG.MAX_QUIZ, Number(v2Parsed.quizScore) || 0)),
              hintPenaltiesTotal: Math.max(0, Number(v2Parsed.hintPenaltiesTotal) || 0),
              hintUsesCount: Math.max(0, Number(v2Parsed.hintUsesCount) || 0),
              guidedSolvePenaltiesTotal: Math.max(0, Number(v2Parsed.guidedSolvePenaltiesTotal) || 0),
              guidedSolveUsesCount: Math.max(0, Number(v2Parsed.guidedSolveUsesCount) || 0),
              totalPoints: Number(v2Parsed.totalPoints) || 0,
              history: [],
            };
          }
        }
        return { ...INITIAL_POINTS_STATE };
      }

      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed.totalPoints === 'number') {
        return {
          version: 3,
          completedTheoryIds: Array.isArray(parsed.completedTheoryIds)
            ? Array.from(new Set(parsed.completedTheoryIds))
            : [],
          completedVisualizeIds: Array.isArray(parsed.completedVisualizeIds)
            ? Array.from(new Set(parsed.completedVisualizeIds))
            : [],
          completedGameLevelIds: Array.isArray(parsed.completedGameLevelIds)
            ? Array.from(new Set(parsed.completedGameLevelIds))
            : [],
          quizScore: Math.max(0, Math.min(POINTS_CONFIG.MAX_QUIZ, Number(parsed.quizScore) || 0)),
          hintPenaltiesTotal: Math.max(0, Number(parsed.hintPenaltiesTotal) || 0),
          hintUsesCount: Math.max(0, Number(parsed.hintUsesCount) || 0),
          guidedSolvePenaltiesTotal: Math.max(0, Number(parsed.guidedSolvePenaltiesTotal) || 0),
          guidedSolveUsesCount: Math.max(0, Number(parsed.guidedSolveUsesCount) || 0),
          totalPoints: Number(parsed.totalPoints) || 0,
          history: Array.isArray(parsed.history) ? parsed.history : [],
        };
      }
      return { ...INITIAL_POINTS_STATE };
    } catch {
      return { ...INITIAL_POINTS_STATE };
    }
  }

  /**
   * Safely imports previously completed progress without resetting anything
   */
  private syncWithExistingProgress() {
    try {
      const pState = progressManager.getState();
      let changed = false;

      // Sync theory modules
      if (Array.isArray(pState.completedTheoryChapters)) {
        for (const chapId of pState.completedTheoryChapters) {
          if (!this.state.completedTheoryIds.includes(chapId)) {
            this.state.completedTheoryIds.push(chapId);
            changed = true;
          }
        }
      }

      // Sync video lessons
      if (Array.isArray(pState.completedVideos)) {
        for (const vidId of pState.completedVideos) {
          if (!this.state.completedVisualizeIds.includes(vidId)) {
            this.state.completedVisualizeIds.push(vidId);
            changed = true;
          }
        }
      }

      // Sync game levels
      if (Array.isArray(pState.levelsCompleted)) {
        for (const lvlId of pState.levelsCompleted) {
          if (typeof lvlId === 'number' && !this.state.completedGameLevelIds.includes(lvlId)) {
            this.state.completedGameLevelIds.push(lvlId);
            changed = true;
          }
        }
      }

      const prevTotal = this.state.totalPoints;
      this.recalculateTotal();
      if (changed || this.state.totalPoints !== prevTotal) {
        this.saveState();
      }
    } catch {
      // Ignore sync errors
    }
  }

  private saveState() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(POINTS_STORAGE_KEY, JSON.stringify(this.state));
      this.notifyListeners();
    } catch {
      // Ignore write errors
    }
  }

  /**
   * Recalculates total points without clamping negative balances to zero.
   * Total = Theory + Quiz + Visualize + Games - (Hint Penalties + Guided Solve Penalties)
   * Example: 0 - 2 = -2. If -2 + 6 = 4.
   */
  private recalculateTotal() {
    const theory = Math.min(
      POINTS_CONFIG.MAX_THEORY,
      this.state.completedTheoryIds.length * POINTS_CONFIG.THEORY_PER_MODULE
    );
    const quiz = Math.max(0, Math.min(POINTS_CONFIG.MAX_QUIZ, this.state.quizScore));
    const visualize = Math.min(
      POINTS_CONFIG.MAX_VISUALIZE,
      this.state.completedVisualizeIds.length * POINTS_CONFIG.VISUALIZE_PER_MODULE
    );
    const game = Math.min(
      POINTS_CONFIG.MAX_GAME,
      this.state.completedGameLevelIds.length * POINTS_CONFIG.GAME_PER_LEVEL
    );

    const gross = theory + quiz + visualize + game;
    const deductions = this.state.hintPenaltiesTotal + this.state.guidedSolvePenaltiesTotal;

    // Do NOT clamp to zero! Negative balances are fully supported.
    this.state.totalPoints = Math.min(POINTS_CONFIG.MAX_TOTAL_POINTS, gross - deductions);
  }

  private addHistoryEvent(event: PointsActivityEvent) {
    if (!Array.isArray(this.state.history)) {
      this.state.history = [];
    }
    // Prepend so newest events appear first
    this.state.history.unshift(event);
  }

  public subscribe(listener: PointsListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const copy = this.getState();
    this.listeners.forEach((fn) => {
      try {
        fn(copy);
      } catch {
        // Safe dispatch
      }
    });
  }

  public getState(): PointsState {
    return JSON.parse(JSON.stringify(this.state));
  }

  public getTotalPoints(): number {
    return this.state.totalPoints;
  }

  public getHistory(): PointsActivityEvent[] {
    return Array.isArray(this.state.history) ? [...this.state.history] : [];
  }

  private isDebounced(actionKey: string, cooldownMs = 200): boolean {
    const now = Date.now();
    const last = this.lastActionTimestamps.get(actionKey) || 0;
    if (now - last < cooldownMs) {
      return true;
    }
    this.lastActionTimestamps.set(actionKey, now);
    return false;
  }

  // =========================================================================
  // ACTIONS
  // =========================================================================

  /**
   * Complete Theory Module (First time only): +3 Points (Max 36)
   */
  public recordTheoryCompleted(moduleId: string, title?: string): boolean {
    if (!moduleId || this.state.completedTheoryIds.includes(moduleId)) {
      return false; // Already awarded
    }
    this.state.completedTheoryIds.push(moduleId);

    // Format module number cleanly, e.g. "theory-01" -> "1"
    const modNumber = moduleId.replace(/\D/g, '') || '1';
    this.addHistoryEvent({
      id: `theory_${moduleId}_${Date.now()}`,
      type: 'THEORY_COMPLETED',
      description: title ? `Completed Theory: ${title}` : `Completed Theory Module ${parseInt(modNumber, 10)}`,
      categoryLabel: 'THEORY COMPLETED',
      pointsChange: POINTS_CONFIG.THEORY_PER_MODULE,
      timestamp: Date.now(),
    });

    this.recalculateTotal();
    this.saveState();
    return true;
  }

  /**
   * Complete Visualize / Video Module (First time only): +4 Points (Max 8)
   */
  public recordVideoCompleted(videoId: string, title?: string): boolean {
    if (!videoId || this.state.completedVisualizeIds.includes(videoId)) {
      return false; // Already awarded
    }
    this.state.completedVisualizeIds.push(videoId);

    const vidNumber = videoId.replace(/\D/g, '') || '1';
    this.addHistoryEvent({
      id: `video_${videoId}_${Date.now()}`,
      type: 'VISUALIZE_COMPLETED',
      description: title ? `Completed Visualization: ${title}` : `Completed Visualization Module ${parseInt(vidNumber, 10)}`,
      categoryLabel: 'VISUALIZATION COMPLETED',
      pointsChange: POINTS_CONFIG.VISUALIZE_PER_MODULE,
      timestamp: Date.now(),
    });

    this.recalculateTotal();
    this.saveState();
    return true;
  }

  /**
   * Complete Game Level (First time only): +9 Points (Max 36)
   */
  public recordGameCompleted(levelId: number): boolean {
    if (!levelId || this.state.completedGameLevelIds.includes(levelId)) {
      return false; // Already awarded
    }
    this.state.completedGameLevelIds.push(levelId);

    this.addHistoryEvent({
      id: `game_${levelId}_${Date.now()}`,
      type: 'GAME_COMPLETED',
      description: `Completed Game Level ${levelId}`,
      categoryLabel: 'GAME COMPLETED',
      pointsChange: POINTS_CONFIG.GAME_PER_LEVEL,
      timestamp: Date.now(),
    });

    this.recalculateTotal();
    this.saveState();
    return true;
  }

  /**
   * Quiz Question Answer:
   * - Correct: +2 Points
   * - Wrong: -1 Point
   * - Clamped: 0 to 20 Points for quiz category
   */
  public recordQuizAnswer(questionId: number, isCorrect: boolean): boolean {
    const debounceKey = `quiz_${questionId}_${isCorrect}`;
    if (this.isDebounced(debounceKey, 200)) return false;

    if (isCorrect) {
      this.state.quizScore = Math.min(
        POINTS_CONFIG.MAX_QUIZ,
        this.state.quizScore + POINTS_CONFIG.QUIZ_CORRECT
      );
    } else {
      this.state.quizScore = Math.max(
        0,
        this.state.quizScore + POINTS_CONFIG.QUIZ_WRONG
      );
    }

    this.addHistoryEvent({
      id: `quiz_${questionId}_${Date.now()}`,
      type: isCorrect ? 'QUIZ_CORRECT' : 'QUIZ_WRONG',
      description: isCorrect ? `Correct Quiz Answer (Q${questionId})` : `Incorrect Quiz Answer (Q${questionId})`,
      categoryLabel: isCorrect ? 'QUIZ CORRECT' : 'QUIZ INCORRECT',
      pointsChange: isCorrect ? POINTS_CONFIG.QUIZ_CORRECT : POINTS_CONFIG.QUIZ_WRONG,
      timestamp: Date.now(),
    });

    this.recalculateTotal();
    this.saveState();
    return true;
  }

  /**
   * Hint Used: -2 Points per genuine click
   * Accumulates with repeated uses.
   */
  public recordHintUsed(context?: string): boolean {
    const debounceKey = `hint_${context || 'act'}`;
    if (this.isDebounced(debounceKey, 150)) return false;

    this.state.hintPenaltiesTotal += POINTS_CONFIG.HINT_PENALTY;
    this.state.hintUsesCount += 1;

    this.addHistoryEvent({
      id: `hint_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type: 'HINT_USED',
      description: context ? `Used Hint: ${context}` : 'Used Hint',
      categoryLabel: 'HINT USED',
      pointsChange: -POINTS_CONFIG.HINT_PENALTY,
      timestamp: Date.now(),
    });

    this.recalculateTotal();
    this.saveState();
    return true;
  }

  /**
   * Guided Solve Used: -3 Points per genuine activation
   * Accumulates with repeated uses.
   */
  public recordGuidedSolveUsed(levelId?: number, context?: string): boolean {
    const debounceKey = `guided_${levelId || 'lvl'}_${context || 'act'}`;
    if (this.isDebounced(debounceKey, 150)) return false;

    this.state.guidedSolvePenaltiesTotal += POINTS_CONFIG.GUIDED_SOLVE_PENALTY;
    this.state.guidedSolveUsesCount += 1;

    const desc = levelId
      ? context
        ? `Used Guided Solve: Level ${levelId} (${context})`
        : `Used Guided Solve: Level ${levelId}`
      : 'Used Guided Solve';

    this.addHistoryEvent({
      id: `guided_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type: 'GUIDED_SOLVE_USED',
      description: desc,
      categoryLabel: 'GUIDED SOLVE USED',
      pointsChange: -POINTS_CONFIG.GUIDED_SOLVE_PENALTY,
      timestamp: Date.now(),
    });

    this.recalculateTotal();
    this.saveState();
    return true;
  }

  /**
   * Returns current Points breakdown according to the 100-point curriculum
   */
  public getBreakdown(): PointsBreakdown {
    const theoryScore = Math.min(
      POINTS_CONFIG.MAX_THEORY,
      this.state.completedTheoryIds.length * POINTS_CONFIG.THEORY_PER_MODULE
    );
    const quizScore = Math.max(0, Math.min(POINTS_CONFIG.MAX_QUIZ, this.state.quizScore));
    const visualizeScore = Math.min(
      POINTS_CONFIG.MAX_VISUALIZE,
      this.state.completedVisualizeIds.length * POINTS_CONFIG.VISUALIZE_PER_MODULE
    );
    const gameScore = Math.min(
      POINTS_CONFIG.MAX_GAME,
      this.state.completedGameLevelIds.length * POINTS_CONFIG.GAME_PER_LEVEL
    );

    const hintPenalties = this.state.hintPenaltiesTotal;
    const guidedSolvePenalties = this.state.guidedSolvePenaltiesTotal;
    const penaltiesTotal = hintPenalties + guidedSolvePenalties;

    return {
      theoryScore,
      maxTheory: POINTS_CONFIG.MAX_THEORY,
      visualizeScore,
      maxVisualize: POINTS_CONFIG.MAX_VISUALIZE,
      gameScore,
      maxGame: POINTS_CONFIG.MAX_GAME,
      quizScore,
      maxQuiz: POINTS_CONFIG.MAX_QUIZ,
      penaltiesTotal,
      hintPenalties,
      hintUsesCount: this.state.hintUsesCount,
      guidedSolvePenalties,
      guidedSolveUsesCount: this.state.guidedSolveUsesCount,
      totalPoints: this.state.totalPoints,
      maxTotalPoints: POINTS_CONFIG.MAX_TOTAL_POINTS,
    };
  }
}

export const pointsManager = new PointsManager();
