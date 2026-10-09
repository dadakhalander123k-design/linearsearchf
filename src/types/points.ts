export const POINTS_CONFIG = {
  THEORY_PER_MODULE: 2,
  MAX_THEORY: 24,
  TOTAL_THEORY_MODULES: 12,

  QUIZ_CORRECT: 2,
  QUIZ_WRONG: -1,
  MAX_QUIZ: 20,

  VISUALIZE_PER_MODULE: 3,
  MAX_VISUALIZE: 6,
  TOTAL_VISUALIZE_MODULES: 2,

  GAME_PER_LEVEL: 10,
  MAX_GAME: 50,
  TOTAL_GAME_LEVELS: 5,

  HINT_PENALTY: 2,
  GUIDED_SOLVE_PENALTY: 3,

  MAX_TOTAL_POINTS: 100,
} as const;

export interface PointsActivityEvent {
  id: string;
  type: string;
  description: string;
  categoryLabel: string; // e.g. 'HINT USED', 'GUIDED SOLVE USED', 'GAME COMPLETED', 'THEORY COMPLETED', 'QUIZ CORRECT', 'QUIZ INCORRECT', 'VISUALIZATION COMPLETED'
  pointsChange: number; // e.g. -2, -3, +9, +3, +2, -1, +4
  timestamp: number;
}

export interface PointsBreakdown {
  theoryScore: number; // 0 to 36
  maxTheory: number; // 36
  visualizeScore: number; // 0 to 8
  maxVisualize: number; // 8
  gameScore: number; // 0 to 36
  maxGame: number; // 36
  quizScore: number; // 0 to 20
  maxQuiz: number; // 20
  penaltiesTotal: number; // hintPenalties + guidedSolvePenalties
  hintPenalties: number; // Total points deducted by hints (e.g. 4)
  hintUsesCount: number; // Number of hint clicks
  guidedSolvePenalties: number; // Total points deducted by guided solve (e.g. 6)
  guidedSolveUsesCount: number; // Number of guided solve activations
  totalPoints: number; // Can be negative! e.g. -2, 0, 4, 72
  maxTotalPoints: number; // 100
}

export interface PointsNotification {
  id: string;
  pointsChange: number;
  title: string;
  message: string;
  type: 'reward' | 'penalty';
  timestamp: number;
}

export interface PointsState {
  version: number;
  completedTheoryIds: string[];
  completedVisualizeIds: string[];
  completedGameLevelIds: number[];
  answeredQuizQuestionIds: number[];
  quizScore: number;
  hintPenaltiesTotal: number;
  hintUsesCount: number;
  guidedSolvePenaltiesTotal: number;
  guidedSolveUsesCount: number;
  totalPoints: number;
  history: PointsActivityEvent[];
}

