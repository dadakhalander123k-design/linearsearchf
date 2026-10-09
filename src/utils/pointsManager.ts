import {
  POINTS_CONFIG,
  PointsActivityEvent,
  PointsBreakdown,
  PointsNotification,
  PointsState,
} from '../types/points';
import { progressManager } from './progressManager';

const POINTS_STORAGE_KEY = 'algo_quest_points_system_v3';

const INITIAL_POINTS_STATE: PointsState = {
  version: 3,
  completedTheoryIds: [],
  completedVisualizeIds: [],
  completedGameLevelIds: [],
  answeredQuizQuestionIds: [],
  quizScore: 0,
  hintPenaltiesTotal: 0,
  hintUsesCount: 0,
  guidedSolvePenaltiesTotal: 0,
  guidedSolveUsesCount: 0,
  totalPoints: 0,
  history: [],
};

type PointsListener = (state: PointsState) => void;
type PointsNotificationListener = (notification: PointsNotification) => void;

class PointsManager {
  private state: PointsState;
  private listeners: Set<PointsListener> = new Set();
  private notificationListeners: Set<PointsNotificationListener> = new Set();
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
              answeredQuizQuestionIds: [],
              quizScore: Number(v2Parsed.quizScore) || 0,
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
        let answeredQuizIds: number[] = Array.isArray(parsed.answeredQuizQuestionIds)
          ? parsed.answeredQuizQuestionIds
          : [];

        // If answeredQuizIds is not yet populated, check existing quiz answers in localStorage
        if (answeredQuizIds.length === 0 && typeof window !== 'undefined') {
          try {
            const rawAnswers = localStorage.getItem('hash_quest_quiz_answers_v4');
            if (rawAnswers) {
              const parsedAns = JSON.parse(rawAnswers);
              if (parsedAns && typeof parsedAns === 'object') {
                answeredQuizIds = Object.keys(parsedAns).map(Number).filter((n) => !isNaN(n) && n > 0);
              }
            }
          } catch {
            // Ignore
          }
        }

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
          answeredQuizQuestionIds: answeredQuizIds,
          quizScore: Number(parsed.quizScore) || 0,
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
    const theory = 0; // Learn/Theory contributes 0 points to Linear Search
    const quiz = Math.min(POINTS_CONFIG.MAX_QUIZ, this.state.quizScore);
    const visualize = Math.min(
      POINTS_CONFIG.MAX_VISUALIZE,
      this.state.completedVisualizeIds.length * POINTS_CONFIG.VISUALIZE_PER_MODULE
    );
    const game = Math.min(
      POINTS_CONFIG.MAX_GAME,
      this.state.completedGameLevelIds.length * POINTS_CONFIG.GAME_PER_LEVEL
    );

    const gross = quiz + visualize + game;
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

  public onNotification(listener: PointsNotificationListener): () => void {
    this.notificationListeners.add(listener);
    return () => {
      this.notificationListeners.delete(listener);
    };
  }

  private triggerNotification(notification: PointsNotification) {
    this.notificationListeners.forEach((fn) => {
      try {
        fn(notification);
      } catch {
        // Safe dispatch
      }
    });
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
   * Complete Theory Module: 0 Points (Theory contributes zero points in Linear Search)
   */
  public recordTheoryCompleted(moduleId: string, _title?: string): boolean {
    if (!moduleId || this.state.completedTheoryIds.includes(moduleId)) {
      return false; // Already tracked
    }
    this.state.completedTheoryIds.push(moduleId);
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
    const pointsAdded = POINTS_CONFIG.VISUALIZE_PER_MODULE;

    this.addHistoryEvent({
      id: `video_${videoId}_${Date.now()}`,
      type: 'VISUALIZE_COMPLETED',
      description: title ? `Completed Visualization: ${title}` : `Completed Visualization Module ${parseInt(vidNumber, 10)}`,
      categoryLabel: 'VISUALIZATION COMPLETED',
      pointsChange: pointsAdded,
      timestamp: Date.now(),
    });

    this.recalculateTotal();
    this.saveState();

    this.triggerNotification({
      id: `toast_video_${videoId}_${Date.now()}`,
      pointsChange: pointsAdded,
      title: `+${pointsAdded} Points`,
      message: 'Visualization Completed',
      type: 'reward',
      timestamp: Date.now(),
    });

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

    const pointsAdded = POINTS_CONFIG.GAME_PER_LEVEL;

    this.addHistoryEvent({
      id: `game_${levelId}_${Date.now()}`,
      type: 'GAME_COMPLETED',
      description: `Completed Game Level ${levelId}`,
      categoryLabel: 'GAME COMPLETED',
      pointsChange: pointsAdded,
      timestamp: Date.now(),
    });

    this.recalculateTotal();
    this.saveState();

    this.triggerNotification({
      id: `toast_game_${levelId}_${Date.now()}`,
      pointsChange: pointsAdded,
      title: `+${pointsAdded} Points`,
      message: 'Game Level Completed',
      type: 'reward',
      timestamp: Date.now(),
    });

    return true;
  }

  /**
   * Quiz Question Answer:
   * - Correct: +2 Points
   * - Wrong: -1 Point
   * - Category Cap: Max 20 Points
   * Prevents duplicate scoring for the same question.
   */
  public recordQuizAnswer(questionId: number, isCorrect: boolean): boolean {
    if (!Array.isArray(this.state.answeredQuizQuestionIds)) {
      this.state.answeredQuizQuestionIds = [];
    }

    // 1. Prevent duplicate scoring for this question
    if (this.state.answeredQuizQuestionIds.includes(questionId)) {
      return false;
    }

    const debounceKey = `quiz_${questionId}`;
    if (this.isDebounced(debounceKey, 200)) return false;

    const prevQuiz = this.state.quizScore;
    let targetQuiz: number;
    let actualDelta: number;

    if (isCorrect) {
      targetQuiz = Math.min(POINTS_CONFIG.MAX_QUIZ, prevQuiz + POINTS_CONFIG.QUIZ_CORRECT);
      actualDelta = targetQuiz - prevQuiz;
    } else {
      targetQuiz = prevQuiz + POINTS_CONFIG.QUIZ_WRONG; // -1 point
      actualDelta = POINTS_CONFIG.QUIZ_WRONG; // -1
    }

    // If cap prevented any points from being added (e.g. already at Max 20)
    if (isCorrect && actualDelta <= 0) {
      this.state.answeredQuizQuestionIds.push(questionId);
      this.saveState();
      return false; // No points added due to cap; avoid misleading toast
    }

    this.state.answeredQuizQuestionIds.push(questionId);
    this.state.quizScore = targetQuiz;
    this.recalculateTotal();

    const desc = isCorrect ? 'Correct Answer!' : 'Incorrect Answer';
    const title = actualDelta > 0
      ? `+${actualDelta} ${actualDelta === 1 ? 'Point' : 'Points'}`
      : `${actualDelta} ${Math.abs(actualDelta) === 1 ? 'Point' : 'Points'}`;

    this.addHistoryEvent({
      id: `quiz_${questionId}_${Date.now()}`,
      type: isCorrect ? 'QUIZ_CORRECT' : 'QUIZ_WRONG',
      description: isCorrect ? `Correct Quiz Answer (Q${questionId})` : `Incorrect Quiz Answer (Q${questionId})`,
      categoryLabel: isCorrect ? 'QUIZ CORRECT' : 'QUIZ INCORRECT',
      pointsChange: actualDelta,
      timestamp: Date.now(),
    });

    this.saveState();

    this.triggerNotification({
      id: `toast_quiz_${questionId}_${Date.now()}`,
      pointsChange: actualDelta,
      title,
      message: desc,
      type: isCorrect ? 'reward' : 'penalty',
      timestamp: Date.now(),
    });

    return true;
  }

  /**
   * Quiz Question Timeout or Unanswered: 0 Points
   * Prevents duplicate scoring for this question.
   */
  public recordQuizTimeout(questionId: number): boolean {
    if (!Array.isArray(this.state.answeredQuizQuestionIds)) {
      this.state.answeredQuizQuestionIds = [];
    }

    if (this.state.answeredQuizQuestionIds.includes(questionId)) {
      return false;
    }

    this.state.answeredQuizQuestionIds.push(questionId);

    this.addHistoryEvent({
      id: `quiz_timeout_${questionId}_${Date.now()}`,
      type: 'QUIZ_TIMEOUT',
      description: `Question Q${questionId} Timed Out (0 pts)`,
      categoryLabel: 'QUIZ TIMEOUT',
      pointsChange: 0,
      timestamp: Date.now(),
    });

    this.saveState();

    this.triggerNotification({
      id: `toast_quiz_timeout_${questionId}_${Date.now()}`,
      pointsChange: 0,
      title: '0 Points',
      message: `Question ${questionId} Timed Out`,
      type: 'penalty',
      timestamp: Date.now(),
    });

    return true;
  }

  /**
   * Resets quiz question tracking and quiz score on quiz retake.
   */
  public resetQuizAttempt() {
    this.state.answeredQuizQuestionIds = [];
    this.state.quizScore = 0;
    this.recalculateTotal();
    this.saveState();
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

    this.triggerNotification({
      id: `toast_hint_${Date.now()}`,
      pointsChange: -POINTS_CONFIG.HINT_PENALTY,
      title: `-${POINTS_CONFIG.HINT_PENALTY} Points`,
      message: 'Hint Used',
      type: 'penalty',
      timestamp: Date.now(),
    });

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

    this.triggerNotification({
      id: `toast_guided_${Date.now()}`,
      pointsChange: -POINTS_CONFIG.GUIDED_SOLVE_PENALTY,
      title: `-${POINTS_CONFIG.GUIDED_SOLVE_PENALTY} Points`,
      message: 'Guided Solve Used',
      type: 'penalty',
      timestamp: Date.now(),
    });

    return true;
  }

  /**
   * Returns current Points breakdown according to the 100-point curriculum
   */
  public getBreakdown(): PointsBreakdown {
    const theoryScore = 0; // Learn/Theory contributes 0 points to Linear Search
    const quizScore = this.state.quizScore;
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
