import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  BookOpen,
  Gamepad2,
  Check,
  Star,
  Layers,
  ChevronRight,
  ListOrdered,
  Trophy,
  Home,
} from 'lucide-react';
import { progressManager } from '../utils/progressManager';
import { soundManager } from '../utils/audio';
import { useScrollReveal } from '../hooks/useScrollReveal';

export interface QuizViewProps {
  onNavigateToTheory: (chapterId?: string) => void;
  onNavigateToQuest: (levelId?: number) => void;
  onNavigateToProgress: () => void;
  onNavigateToHome?: () => void;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  correctAnswerText: string;
  explanation: string;
  exampleSnippet?: string;
  techniqueCode: string;
  targetChapterId?: string;
  targetLevelId?: number;
}

export interface StudentAnswerRecord {
  questionId: number;
  selectedOptionIndex: number;
  selectedAnswerText: string;
  correctOptionIndex: number;
  correctAnswerText: string;
  isCorrect: boolean;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is Linear Search?',
    options: [
      'A method of sorting elements',
      'A method of searching elements one by one',
      'A method of reversing an array',
      'A method of deleting elements',
    ],
    correctIndex: 1,
    correctAnswerText: 'A method of searching elements one by one',
    explanation:
      'Linear Search is a searching technique that checks elements one by one, starting from the beginning of the collection, until the target element is found or all elements have been checked.',
    techniqueCode: 'SEARCH-01',
    targetChapterId: 'theory-01',
  },
  {
    id: 2,
    question: 'Where does Linear Search usually start?',
    options: [
      'From the last element',
      'From the middle element',
      'From the first element',
      'From a random element',
    ],
    correctIndex: 2,
    correctAnswerText: 'From the first element',
    explanation:
      'Linear Search normally begins with the first element and proceeds sequentially toward the end of the array. Each element is compared with the target in order.',
    techniqueCode: 'SEARCH-02',
    targetChapterId: 'theory-02',
  },
  {
    id: 3,
    question: 'Which array can be searched using Linear Search?',
    options: [
      'Only sorted arrays',
      'Only reversed arrays',
      'Only arrays with unique elements',
      'Both sorted and unsorted arrays',
    ],
    correctIndex: 3,
    correctAnswerText: 'Both sorted and unsorted arrays',
    explanation:
      'Linear Search can operate on both sorted and unsorted arrays because it simply checks elements sequentially. Unlike binary search, it does not depend on the array being sorted.',
    techniqueCode: 'SEARCH-03',
    targetChapterId: 'theory-01',
  },
  {
    id: 4,
    question: 'Consider the array [10, 20, 30, 40, 50]. What happens first when searching for 30?',
    options: [
      'Check 50',
      'Check 30',
      'Check 10',
      'Check 40',
    ],
    correctIndex: 2,
    correctAnswerText: 'Check 10',
    explanation:
      'When searching for 30, Linear Search begins with the first element, 10. It then compares 10, followed by 20, and then 30 until the target is found.',
    techniqueCode: 'SEARCH-04',
    targetChapterId: 'theory-03',
  },
  {
    id: 5,
    question: 'In the array [5, 10, 15, 20], how many elements are checked to find 15?',
    options: [
      '1',
      '2',
      '3',
      '4',
    ],
    correctIndex: 2,
    correctAnswerText: '3',
    explanation:
      'The search checks 5 first, then 10, and finally 15. Therefore, the target is found after 3 comparisons.',
    techniqueCode: 'SEARCH-05',
    targetChapterId: 'theory-03',
  },
  {
    id: 6,
    question: 'What happens if the searched element is not found?',
    options: [
      'The search continues forever',
      'The algorithm reports that the element is not present',
      'The array is automatically sorted',
      'The first element is deleted',
    ],
    correctIndex: 1,
    correctAnswerText: 'The algorithm reports that the element is not present',
    explanation:
      'If Linear Search checks every element without finding the target, the algorithm concludes that the target is not present in the array and returns an appropriate “not found” result.',
    techniqueCode: 'SEARCH-06',
    targetChapterId: 'theory-04',
  },
  {
    id: 7,
    question: 'What is the best case for Linear Search?',
    options: [
      'The element is the first element',
      'The element is the last element',
      'The element is not present',
      'The array is empty',
    ],
    correctIndex: 0,
    correctAnswerText: 'The element is the first element',
    explanation:
      'The best case occurs when the target is the first element. Only one comparison is required, giving Linear Search a best-case time complexity of O(1).',
    techniqueCode: 'SEARCH-07',
    targetChapterId: 'theory-05',
  },
  {
    id: 8,
    question: 'What is the worst-case time complexity of Linear Search?',
    options: [
      'O(1)',
      'O(log n)',
      'O(n)',
      'O(n²)',
    ],
    correctIndex: 2,
    correctAnswerText: 'O(n)',
    explanation:
      'In the worst case, Linear Search checks every element before finding the target or determining that it is absent. Therefore, its worst-case time complexity is O(n).',
    techniqueCode: 'SEARCH-08',
    targetChapterId: 'theory-05',
  },
  {
    id: 9,
    question: 'Consider [12, 25, 7, 18, 30]. How many elements are checked when searching for 30?',
    options: [
      '1',
      '3',
      '4',
      '5',
    ],
    correctIndex: 3,
    correctAnswerText: '5',
    explanation:
      'Because 30 is the final element, Linear Search must check 12, 25, 7, 18, and finally 30. Therefore, 5 elements are checked.',
    techniqueCode: 'SEARCH-09',
    targetChapterId: 'theory-03',
  },
  {
    id: 10,
    question: 'What does Linear Search do when it finds the target element?',
    options: [
      'It stops the search',
      'It sorts the array',
      'It deletes the element',
      'It starts again from the beginning',
    ],
    correctIndex: 0,
    correctAnswerText: 'It stops the search',
    explanation:
      'When Linear Search finds the target element, it immediately stops searching and returns the position or result associated with that element.',
    techniqueCode: 'SEARCH-10',
    targetChapterId: 'theory-02',
  },
];

const QUIZ_STORAGE_ANSWERS_KEY = 'hash_quest_quiz_answers_v4';
const QUIZ_STORAGE_SUBMITTED_KEY = 'hash_quest_quiz_submitted_v4';

export const QuizView: React.FC<QuizViewProps> = ({
  onNavigateToTheory,
  onNavigateToQuest,
  onNavigateToProgress,
  onNavigateToHome,
}) => {
  useScrollReveal();

  // Load persisted student answers
  const [studentAnswers, setStudentAnswers] = useState<Record<number, StudentAnswerRecord>>(() => {
    try {
      const stored = localStorage.getItem(QUIZ_STORAGE_ANSWERS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return {};
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(() => {
    try {
      const storedSub = localStorage.getItem(QUIZ_STORAGE_SUBMITTED_KEY);
      if (storedSub !== null) {
        return storedSub === 'true';
      }
      return progressManager.getState().quizSubmitted || false;
    } catch {
      return false;
    }
  });

  // Subscribe to progressManager for reset synchronization
  useEffect(() => {
    const unsub = progressManager.subscribe((pState) => {
      if (!pState.quizSubmitted) {
        setIsSubmitted(false);
        try {
          const stored = localStorage.getItem(QUIZ_STORAGE_ANSWERS_KEY);
          if (!stored) {
            setStudentAnswers({});
            setViewMode('STEP_BY_STEP');
          }
        } catch {
          // Ignore
        }
      }
    });
    return unsub;
  }, []);

  // Navigation within Quiz (0-indexed current question)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  // Temporary selection before confirming/submitting the question
  const [pendingSelection, setPendingSelection] = useState<number | null>(null);
  // View mode: 'STEP_BY_STEP' or 'FULL_REVIEW'
  const [viewMode, setViewMode] = useState<'STEP_BY_STEP' | 'FULL_REVIEW'>(() => {
    return isSubmitted ? 'FULL_REVIEW' : 'STEP_BY_STEP';
  });

  // Current question helper
  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex] || QUIZ_QUESTIONS[0];
  const currentAnswerRecord = studentAnswers[currentQuestion.id];
  const isCurrentQuestionAnswered = currentAnswerRecord !== undefined;

  // Synchronize selection with current question record
  useEffect(() => {
    if (currentAnswerRecord !== undefined) {
      setPendingSelection(currentAnswerRecord.selectedOptionIndex);
    } else {
      setPendingSelection(null);
    }
  }, [currentQuestionIndex, currentAnswerRecord]);

  // Persist answers to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(QUIZ_STORAGE_ANSWERS_KEY, JSON.stringify(studentAnswers));
    } catch {
      // Ignore storage errors
    }
  }, [studentAnswers]);

  // Calculate score deterministically from stored answers
  const { score, totalQuestions, percentage, correctAnswersCount } = useMemo(() => {
    let correct = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      const rec = studentAnswers[q.id];
      if (rec && rec.isCorrect) {
        correct++;
      }
    });
    const total = QUIZ_QUESTIONS.length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    return {
      score: correct,
      totalQuestions: total,
      percentage: pct,
      correctAnswersCount: correct,
    };
  }, [studentAnswers]);

  // Get result tier based on final score
  const getResultTier = (correctCount: number) => {
    if (correctCount >= 8) {
      return {
        level: 'EXCELLENT',
        emoji: '🟢',
        title: '8–10: 🟢 Excellent — Linear Search Master!',
        badgeText: '🟢 EXCELLENT — LINEAR SEARCH MASTER!',
        badgeClass: 'bg-emerald-700 text-white border-emerald-900',
        cardClass: 'border-emerald-700 bg-emerald-50/80',
        summary:
          'Outstanding achievement! You scored in the top tier and have mastered all primary Linear Search concepts, execution traces, and complexity tradeoffs.',
        isMastered: true,
      };
    } else if (correctCount >= 6) {
      return {
        level: 'GOOD',
        emoji: '🟡',
        title: '6–7: 🟡 Good — Review a little and try again.',
        badgeText: '🟡 GOOD — REVIEW & PRACTICE',
        badgeClass: 'bg-amber-500 text-[#181818] border-amber-600',
        cardClass: 'border-amber-600 bg-amber-50/80',
        summary:
          'Solid foundation! You understand the key concepts. Review the detailed technical rationales below and try again to achieve Linear Search Master status.',
        isMastered: false,
      };
    } else {
      return {
        level: 'KEEP_LEARNING',
        emoji: '🔴',
        title: '0–5: 🔴 Keep Learning — Review the theory and visualization.',
        badgeText: '🔴 KEEP LEARNING — REVIEW THEORY',
        badgeClass: 'bg-red-600 text-white border-red-800',
        cardClass: 'border-red-600 bg-red-50/80',
        summary:
          'Keep practicing! Review the step-by-step Theory modules and try interactive simulations in the Visualizer.',
        isMastered: false,
      };
    }
  };

  const tier = getResultTier(score);

  // Handle student selecting an option (before or during answering)
  const handleSelectOption = (optionIndex: number) => {
    if (isCurrentQuestionAnswered && isSubmitted) return;
    soundManager.playQuizSelect();
    setPendingSelection(optionIndex);
  };

  // Handle confirming answer for current question (Records answer without revealing final result screen)
  const handleConfirmAnswer = () => {
    if (pendingSelection === null || isCurrentQuestionAnswered) return;

    const q = currentQuestion;
    const isCorrect = pendingSelection === q.correctIndex;
    const selectedText = q.options[pendingSelection] || '';

    const newRecord: StudentAnswerRecord = {
      questionId: q.id,
      selectedOptionIndex: pendingSelection,
      selectedAnswerText: selectedText,
      correctOptionIndex: q.correctIndex,
      correctAnswerText: q.correctAnswerText,
      isCorrect,
    };

    const updatedAnswers = {
      ...studentAnswers,
      [q.id]: newRecord,
    };

    setStudentAnswers(updatedAnswers);

    // Play appropriate interaction sound
    if (isCorrect) {
      soundManager.playQuizCorrect();
    } else {
      soundManager.playQuizWrong();
    }
  };

  // Handle submitting the entire examination ONLY when user clicks "Complete & Review"
  const handleSubmitExamination = () => {
    const totalAnswered = Object.keys(studentAnswers).length;
    if (totalAnswered < QUIZ_QUESTIONS.length) {
      soundManager.playError();
      const firstUnansweredIndex = QUIZ_QUESTIONS.findIndex((quest) => studentAnswers[quest.id] === undefined);
      if (firstUnansweredIndex >= 0) {
        setCurrentQuestionIndex(firstUnansweredIndex);
      }
      return;
    }

    setIsSubmitted(true);
    try {
      localStorage.setItem(QUIZ_STORAGE_SUBMITTED_KEY, 'true');
    } catch {
      // Ignore storage errors
    }

    // Synchronize with progressManager
    const rawScoresMap: Record<number, number> = {};
    (Object.values(studentAnswers) as StudentAnswerRecord[]).forEach((rec) => {
      rawScoresMap[rec.questionId] = rec.selectedOptionIndex;
    });

    progressManager.recordQuizCompletion(rawScoresMap, score, QUIZ_QUESTIONS.length);

    if (score >= 6) {
      soundManager.playQuizComplete();
    } else {
      soundManager.playQuizWrong();
    }
  };

  // Handle resetting the quiz completely
  const handleResetQuiz = () => {
    soundManager.playReset();
    setStudentAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
    setPendingSelection(null);
    setViewMode('STEP_BY_STEP');

    try {
      localStorage.removeItem(QUIZ_STORAGE_ANSWERS_KEY);
      localStorage.setItem(QUIZ_STORAGE_SUBMITTED_KEY, 'false');
    } catch {
      // Ignore
    }

    progressManager.resetQuizAttempt();
  };

  const answeredCount = Object.keys(studentAnswers).length;
  const allAnswered = answeredCount === QUIZ_QUESTIONS.length;

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-4 font-sans text-slate-900 dark:text-white animate-page-enter">
      {/* Header Banner */}
      <div className="border border-slate-200 dark:border-blue-500/20 rounded-2xl pb-6 mb-6 bg-white dark:bg-[#111827] p-6 sm:p-8 shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] reveal-on-scroll">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-blue-950/60 border border-indigo-100 dark:border-blue-500/30 text-indigo-700 dark:text-blue-300 rounded-lg text-xs font-semibold uppercase tracking-wider font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-blue-400" />
            <span>Knowledge Assessment</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Simple Linear Search Quiz (10 Questions)
            </span>
            {isSubmitted && (
              <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-md text-xs font-semibold">
                Completed
              </span>
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight animate-heading-enter">
          Linear Search Knowledge Check
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl mt-1 leading-relaxed">
          Test your understanding of sequential searching, best/worst case complexities, element comparison, and early termination.
        </p>

        {/* Question Index Tabs / Progress Tracker */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-blue-500/15">
          <div className="flex items-center justify-between gap-2 mb-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-blue-400" />
              <span>
                Progress: <strong className="text-indigo-600 dark:text-blue-300 font-mono">{answeredCount}</strong> / {totalQuestions} Answered
              </span>
            </div>
            {isSubmitted && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundManager.playNav();
                    setViewMode(viewMode === 'STEP_BY_STEP' ? 'FULL_REVIEW' : 'STEP_BY_STEP');
                  }}
                  className="text-xs font-semibold text-indigo-600 dark:text-blue-400 hover:text-indigo-700 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>{viewMode === 'STEP_BY_STEP' ? 'Switch to Full Review' : 'Switch to Step Mode'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Question Index Pills */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const rec = studentAnswers[q.id];
              const isAnswered = rec !== undefined;
              const isCurrent = currentQuestionIndex === idx && viewMode === 'STEP_BY_STEP';

              let pillStyle = 'bg-slate-50 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-blue-500/20 hover:bg-slate-100 dark:hover:bg-[#172033]';
              if (isCurrent) {
                pillStyle = 'bg-[#2563EB] dark:bg-blue-600 text-white border-[#2563EB] dark:border-blue-500 font-bold shadow-xs dark:shadow-[0_0_12px_rgba(59,130,246,0.4)]';
              } else if (isAnswered) {
                if (rec.isCorrect) {
                  pillStyle = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30 font-semibold';
                } else {
                  pillStyle = 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-500/30 font-semibold';
                }
              }

              return (
                <button
                  key={q.id}
                  id={`btn-quiz-jump-${q.id}`}
                  onClick={() => {
                    soundManager.playNav();
                    setCurrentQuestionIndex(idx);
                    setViewMode('STEP_BY_STEP');
                  }}
                  className={`py-2 text-center text-xs font-mono rounded-lg border transition-all cursor-pointer ${pillStyle}`}
                  title={`Question ${idx + 1}`}
                >
                  <span>Q{idx + 1}</span>
                  {isAnswered && (
                    <span className="block text-[10px] leading-tight mt-0.5">
                      {rec.isCorrect ? '✓' : '✕'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quiz Assessment Completed Section (Shown when submitted or in review mode) */}
      {isSubmitted && (
        <div
          id="quiz-result-card"
          className="mb-8 p-6 sm:p-10 lg:p-12 bg-white dark:bg-[#111827] border border-slate-200 dark:border-blue-500/25 rounded-3xl shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] flex flex-col items-center justify-center text-center animate-editorial-scale transition-all"
        >
          {/* 1. Top Achievement Trophy Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#00A86B] dark:bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 dark:shadow-emerald-950/50 mx-auto mb-4 sm:mb-5">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-[2.2]" />
          </div>

          {/* 2. Achievement Badge */}
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-[#00A86B]/40 dark:border-emerald-500/40 bg-[#E6F8F0] dark:bg-emerald-950/60 text-[#008A54] dark:text-emerald-300 font-mono text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-3 sm:mb-4">
            ★ OUTSTANDING MASTERY (GRADE A+) ★
          </div>

          {/* 3. Main Completion Heading */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B192C] dark:text-white tracking-tight uppercase mb-3">
            QUIZ ASSESSMENT COMPLETED
          </h2>

          {/* 4. Supporting Description */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed font-normal mb-6 sm:mb-8">
            Incredible performance! You demonstrated thorough command of Linear Search traversal, edge cases, and algorithmic complexities.
          </p>

          {/* 5. Large Highlighted Score Card */}
          <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white dark:bg-[#0F172A] border-2 border-indigo-200/70 dark:border-blue-500/40 rounded-3xl shadow-[0_8px_30px_rgba(37,99,235,0.08)] dark:shadow-[0_8px_30px_rgba(59,130,246,0.18)] flex flex-col items-center justify-center text-center mb-6 sm:mb-8">
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.2em] text-[#2563EB] dark:text-blue-300 uppercase mb-2">
              FINAL HIGHLIGHTED SCORE
            </span>
            <div className="text-5xl sm:text-6xl font-black text-[#00A86B] dark:text-emerald-400 font-sans tracking-tight leading-none my-2">
              {percentage}%
            </div>
            <div className="mt-3 px-4 py-1.5 rounded-xl bg-slate-50 dark:bg-blue-950/40 border border-slate-200 dark:border-blue-500/30 text-slate-700 dark:text-slate-300 font-mono text-xs sm:text-sm font-semibold">
              {score} / {totalQuestions} Questions Correct
            </div>
          </div>

          {/* 6. Summary Statistics Cards (CORRECT, INCORRECT, ACCURACY - STRICTLY NO XP) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-2xl mx-auto">
            {/* CORRECT CARD */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-blue-500/30 shadow-xs flex flex-col items-center justify-center text-center">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-1.5">
                CORRECT
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#00A86B] dark:text-emerald-400 font-mono flex items-center justify-center gap-1.5">
                <Check className="w-5 h-5 stroke-[2.5]" />
                {score}
              </span>
            </div>

            {/* INCORRECT CARD */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-blue-500/30 shadow-xs flex flex-col items-center justify-center text-center">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-1.5">
                INCORRECT
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-rose-500 dark:text-rose-400 font-mono">
                {totalQuestions - score}
              </span>
            </div>

            {/* ACCURACY CARD */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-blue-500/30 shadow-xs flex flex-col items-center justify-center text-center">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-1.5">
                ACCURACY
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                {percentage}%
              </span>
            </div>
          </div>

          {/* 7. Action Buttons (Retake Quiz & Back to Home) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mt-8 w-full max-w-md mx-auto">
            {/* 1. Retake Quiz (Primary Action) */}
            <button
              id="btn-quiz-retake"
              type="button"
              onClick={handleResetQuiz}
              className="w-full sm:w-auto px-6 sm:px-7 py-3 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-sans text-sm font-semibold shadow-md shadow-blue-500/20 dark:shadow-[0_4px_16px_rgba(59,130,246,0.35)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.2]" />
              <span>Retake Quiz</span>
            </button>

            {/* 2. Back to Home (Secondary Action) */}
            <button
              id="btn-quiz-back-to-home"
              type="button"
              onClick={() => {
                soundManager.playNav();
                if (onNavigateToHome) {
                  onNavigateToHome();
                }
              }}
              className="w-full sm:w-auto px-6 sm:px-7 py-3 rounded-2xl bg-white hover:bg-slate-50 dark:bg-[#0F172A] dark:hover:bg-[#172033] text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-blue-500/30 font-sans text-sm font-semibold shadow-xs transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4 stroke-[2.2] text-[#2563EB] dark:text-blue-300" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW MODE 1: STEP BY STEP QUESTION FLOW */}
      {viewMode === 'STEP_BY_STEP' && (
        <div className="space-y-6">
          <div
            key={currentQuestion.id}
            id={`quiz-step-card-${currentQuestion.id}`}
            className={`p-6 sm:p-8 border rounded-2xl transition-all bg-white dark:bg-[#111827] shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] animate-chapter-switch ${isCurrentQuestionAnswered
              ? currentAnswerRecord?.isCorrect
                ? 'border-emerald-300 dark:border-emerald-500/40 ring-1 ring-emerald-200 dark:ring-emerald-500/30'
                : 'border-rose-300 dark:border-rose-500/40 ring-1 ring-rose-200 dark:ring-rose-500/30'
              : 'border-slate-200 dark:border-blue-500/20'
              }`}
          >
            {/* Question Header */}
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-blue-500/15">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-indigo-600 dark:bg-blue-600 text-white rounded-md text-xs font-bold font-mono shadow-xs">
                  Question {currentQuestionIndex + 1 < 10 ? `0${currentQuestionIndex + 1}` : currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <span className="text-xs font-semibold text-indigo-600 dark:text-blue-300 font-mono">{currentQuestion.techniqueCode}</span>
              </div>

              {isCurrentQuestionAnswered && (
                <div>
                  {currentAnswerRecord?.isCorrect ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 rounded-lg">
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Correct</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-950/60 text-xs font-bold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 rounded-lg">
                      <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                      <span>Incorrect</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Question Statement */}
            <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-6 leading-snug break-words">
              {currentQuestion.question}
            </p>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((opt, optIdx) => {
                const isSelected = pendingSelection === optIdx;
                let optStyle =
                  'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-blue-500/25 hover:border-indigo-300 dark:hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-[#172033] text-slate-800 dark:text-slate-200';

                if (isCurrentQuestionAnswered) {
                  if (optIdx === currentQuestion.correctIndex) {
                    optStyle =
                      'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-bold ring-2 ring-emerald-400 dark:ring-emerald-500/40';
                  } else if (isSelected && !currentAnswerRecord?.isCorrect) {
                    optStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-950 dark:text-rose-200 font-bold';
                  } else {
                    optStyle = 'bg-white dark:bg-[#0F172A] opacity-40 border-slate-200 dark:border-blue-500/20 text-slate-400 dark:text-slate-500';
                  }
                } else if (isSelected) {
                  optStyle =
                    'bg-indigo-50/80 dark:bg-blue-950/60 border-indigo-600 dark:border-blue-400 text-indigo-900 dark:text-blue-200 font-semibold ring-2 ring-indigo-500 dark:ring-blue-500/30';
                }

                return (
                  <button
                    key={optIdx}
                    id={`quiz-q${currentQuestion.id}-opt${optIdx}`}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={isCurrentQuestionAnswered && isSubmitted}
                    style={{ animationDelay: `${(optIdx + 1) * 60}ms` }}
                    className={`w-full p-4 text-left text-sm font-sans rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer animate-chapter-switch ${optStyle}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border text-xs font-bold font-mono ${isSelected
                        ? isCurrentQuestionAnswered
                          ? optIdx === currentQuestion.correctIndex
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-rose-600 text-white border-rose-600'
                          : 'bg-[#2563EB] dark:bg-blue-600 text-white border-[#2563EB] dark:border-blue-500'
                        : 'bg-slate-100 dark:bg-[#111827] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-blue-500/30'
                        }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1 pt-0.5 leading-relaxed break-words">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Answer Confirmation / Next Button Bar */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-blue-500/15 flex flex-wrap items-center justify-between gap-3">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => {
                  soundManager.playNav();
                  setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
                }}
                className={`btn-modern-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 transition-all ${currentQuestionIndex === 0 ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
                  }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {!isCurrentQuestionAnswered ? (
                <button
                  id="btn-confirm-answer"
                  disabled={pendingSelection === null}
                  onClick={handleConfirmAnswer}
                  className={`btn-modern-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${pendingSelection !== null ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed pointer-events-none'
                    }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Answer</span>
                </button>
              ) : currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  id="btn-next-question"
                  onClick={() => {
                    soundManager.playClick();
                    setCurrentQuestionIndex((prev) => prev + 1);
                  }}
                  className="btn-modern-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="btn-finish-quiz"
                  onClick={handleSubmitExamination}
                  className="btn-modern-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Complete & Review</span>
                </button>
              )}
            </div>

            {/* Technical Explanation Panel (visible once answered) */}
            {isCurrentQuestionAnswered && (
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-blue-500/15 bg-slate-50 dark:bg-[#0F172A] rounded-xl p-4 sm:p-5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-blue-400" />
                  <span>Technical Explanation:</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3 font-normal text-sm">
                  {currentQuestion.explanation}
                </p>

                {currentQuestion.exampleSnippet && (
                  <div className="mb-3 p-3 bg-white dark:bg-[#111827] border border-slate-200 dark:border-blue-500/30 rounded-lg font-mono text-xs text-indigo-700 dark:text-blue-300 font-semibold">
                    Example: {currentQuestion.exampleSnippet}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                  {currentQuestion.targetChapterId && (
                    <button
                      onClick={() => {
                        soundManager.playNav();
                        onNavigateToTheory(currentQuestion.targetChapterId);
                      }}
                      className="text-indigo-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Review in Theory Guide →</span>
                    </button>
                  )}
                  {currentQuestion.targetLevelId && (
                    <button
                      onClick={() => {
                        soundManager.playNav();
                        onNavigateToQuest(currentQuestion.targetLevelId);
                      }}
                      className="text-slate-700 dark:text-slate-300 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Gamepad2 className="w-3.5 h-3.5 text-indigo-600 dark:text-blue-400" />
                      <span>Practice in Quest Level {currentQuestion.targetLevelId} →</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: COMPREHENSIVE AUDIT REVIEW */}
      {viewMode === 'FULL_REVIEW' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-blue-500/20">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-indigo-600 dark:text-blue-400" />
              <span>Full Question-by-Question Review</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold font-mono">
              {score} of {totalQuestions} Correct
            </span>
          </div>

          <div className="space-y-4">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const rec = studentAnswers[q.id];
              const isAnswered = rec !== undefined;
              const isCorrect = rec?.isCorrect || false;

              return (
                <div
                  key={q.id}
                  id={`quiz-review-card-${q.id}`}
                  className={`p-5 sm:p-6 border rounded-2xl transition-all bg-white dark:bg-[#111827] shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] ${isAnswered
                    ? isCorrect
                      ? 'border-emerald-300 dark:border-emerald-500/40 ring-1 ring-emerald-200 dark:ring-emerald-500/30'
                      : 'border-rose-300 dark:border-rose-500/40 ring-1 ring-rose-200 dark:ring-rose-500/30'
                    : 'border-slate-200 dark:border-blue-500/20 opacity-75'
                    }`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-100 dark:border-blue-500/15">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-indigo-600 dark:bg-blue-600 text-white rounded-md text-xs font-bold font-mono">
                        Question {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-indigo-600 dark:text-blue-300 font-mono">{q.techniqueCode}</span>
                    </div>

                    <div>
                      {isAnswered ? (
                        isCorrect ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 rounded-md">
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Correct
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-50 dark:bg-rose-950/60 text-xs font-bold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 rounded-md">
                            <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Incorrect
                          </span>
                        )
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-[#0F172A] rounded-md text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Unanswered
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <p className="text-base font-bold text-slate-900 dark:text-white mb-4 leading-snug">
                    {q.question}
                  </p>

                  {/* Stored Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs font-mono">
                    <div className={`p-3 rounded-xl border ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/30 text-emerald-950 dark:text-emerald-200' : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-500/30 text-rose-950 dark:text-rose-200'}`}>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-sans">
                        Your Submission:
                      </div>
                      <div className="font-bold text-sm">
                        {rec ? `${String.fromCharCode(65 + rec.selectedOptionIndex)}: ${rec.selectedAnswerText}` : 'No Answer Submitted'}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border bg-slate-50 dark:bg-[#0F172A] border-slate-200 dark:border-blue-500/20 text-slate-900 dark:text-white">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-sans">
                        Correct Answer:
                      </div>
                      <div className="font-bold text-sm text-emerald-800 dark:text-emerald-300">
                        {String.fromCharCode(65 + q.correctIndex)}: {q.correctAnswerText}
                      </div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="bg-slate-50 dark:bg-[#0F172A] p-4 rounded-xl border border-slate-200 dark:border-blue-500/20 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-1.5">
                      <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-blue-400" />
                      <span>Technical Explanation:</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-2 font-normal text-sm">
                      {q.explanation}
                    </p>

                    {q.exampleSnippet && (
                      <div className="mb-2 p-2.5 bg-white dark:bg-[#111827] border border-slate-200 dark:border-blue-500/30 rounded-lg font-mono text-xs text-indigo-700 dark:text-blue-300 font-semibold">
                        Example: {q.exampleSnippet}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                      {q.targetChapterId && (
                        <button
                          onClick={() => {
                            soundManager.playNav();
                            onNavigateToTheory(q.targetChapterId);
                          }}
                          className="text-indigo-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Review in Theory Guide →</span>
                        </button>
                      )}
                      {q.targetLevelId && (
                        <button
                          onClick={() => {
                            soundManager.playNav();
                            onNavigateToQuest(q.targetLevelId);
                          }}
                          className="text-slate-700 dark:text-slate-300 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Gamepad2 className="w-3.5 h-3.5 text-indigo-600 dark:text-blue-400" />
                          <span>Practice in Quest Level {q.targetLevelId} →</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizView;
