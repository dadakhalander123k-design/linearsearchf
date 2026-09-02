import React, { useState } from 'react';
import { ArrowRight, HelpCircle, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface Level4Challenge {
  type: 'general' | 'best_case' | 'worst_case_last' | 'worst_case_absent';
  array: number[];
  target: number;
  question: string;
  options: { id: string; label: string; isCorrect: boolean }[];
  explanation: string;
}

interface Level4GameplayProps {
  onLevelComplete: (levelId: number, score: number) => void;
  onScoreUpdate: (delta: number) => void;
  onStreakUpdate: (streak: number) => void;
}

export const Level4Gameplay: React.FC<Level4GameplayProps> = ({
  onLevelComplete,
  onScoreUpdate,
  onStreakUpdate,
}) => {
  const challenges: Level4Challenge[] = [
    {
      type: 'general',
      array: [15, 27, 39, 44, 62, 81],
      target: 44,
      question: 'How many comparisons were required to find target 44?',
      options: [
        { id: 'a', label: '2 Comparisons', isCorrect: false },
        { id: 'b', label: '3 Comparisons', isCorrect: false },
        { id: 'c', label: '4 Comparisons', isCorrect: true },
        { id: 'd', label: '6 Comparisons', isCorrect: false },
      ],
      explanation: '4 comparisons were required because 44 is at position 4 (index 3).',
    },
    {
      type: 'best_case',
      array: [50, 21, 73, 14, 88],
      target: 50,
      question: 'Why is this search considered the Best Case in Linear Search?',
      options: [
        { id: 'a', label: 'Target is the very 1st element (1 comparison — O(1))', isCorrect: true },
        { id: 'b', label: 'The array elements are in sorted order', isCorrect: false },
        { id: 'c', label: 'Linear search jumped directly without checking index 0', isCorrect: false },
        { id: 'd', label: 'The array has an odd number of items', isCorrect: false },
      ],
      explanation: 'This is the best case because the target is at index 0, stopping after exactly 1 comparison (O(1)).',
    },
    {
      type: 'worst_case_last',
      array: [10, 20, 30, 40, 50],
      target: 50,
      question: 'When the target is the last element in an array of size n, how many comparisons are needed?',
      options: [
        { id: 'a', label: 'n comparisons (Worst Case — O(n))', isCorrect: true },
        { id: 'b', label: '1 comparison', isCorrect: false },
        { id: 'c', label: 'n / 2 comparisons', isCorrect: false },
        { id: 'd', label: '0 comparisons', isCorrect: false },
      ],
      explanation: 'When the target is the last element, Linear Search must compare every single element in the array: O(n).',
    },
    {
      type: 'worst_case_absent',
      array: [10, 20, 30, 40, 50],
      target: 99,
      question: 'Why does an unsuccessful search also take the worst-case number of comparisons?',
      options: [
        { id: 'a', label: 'It must check all n elements to verify the target is absent', isCorrect: true },
        { id: 'b', label: 'It automatically loops back to the start twice', isCorrect: false },
        { id: 'c', label: 'It divides the array into two halves', isCorrect: false },
        { id: 'd', label: 'Unsuccessful searches take only 1 comparison', isCorrect: false },
      ],
      explanation: 'An unsuccessful search must check all n elements before concluding the item is not present (O(n)).',
    },
  ];

  const [challengeIndex, setChallengeIndex] = useState<number>(0);
  const [pointer, setPointer] = useState<number>(0);
  const [comparisons, setComparisons] = useState<number>(0);
  const [status, setStatus] = useState<'searching' | 'question_active' | 'challenge_completed'>('searching');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('Search through the array element by element.');

  const currentChallenge = challenges[challengeIndex];
  const isSearching = status === 'searching';
  const isQuestionActive = status === 'question_active' || status === 'challenge_completed';
  const isChallengeDone = status === 'challenge_completed';
  const isAllChallengesComplete = challengeIndex >= challenges.length - 1 && isChallengeDone;

  const handleCheck = (clickedIndex?: number) => {
    if (status !== 'searching') return;

    if (clickedIndex !== undefined && clickedIndex !== pointer) {
      soundManager.playError();
      setFeedback('Check elements in sequential order.');
      return;
    }

    const currentVal = currentChallenge.array[pointer];
    const nextComparisons = comparisons + 1;
    setComparisons(nextComparisons);

    if (currentVal === currentChallenge.target) {
      soundManager.playCalcSuccess();
      setStatus('question_active');
      setFeedback('Search finished! Now answer the analysis question below.');
    } else if (pointer >= currentChallenge.array.length - 1) {
      soundManager.playClick();
      setStatus('question_active');
      setFeedback('Reached the end of the array. Now answer the analysis question below.');
    } else {
      soundManager.playClick();
      setPointer((prev) => prev + 1);
      setFeedback(`Comparison ${nextComparisons}: ${currentVal} ≠ ${currentChallenge.target}.`);
    }
  };

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    const opt = currentChallenge.options.find((o) => o.id === optionId);

    if (opt?.isCorrect) {
      soundManager.playCalcSuccess();
      setStatus('challenge_completed');
      setFeedback(`Correct! ${currentChallenge.explanation}`);
      onScoreUpdate(50);
      onStreakUpdate(challengeIndex + 1);
    } else {
      soundManager.playError();
      setFeedback('Not quite. Review the comparison count and try again!');
    }
  };

  const handleNextChallenge = () => {
    if (challengeIndex < challenges.length - 1) {
      soundManager.playSelect();
      const nextIdx = challengeIndex + 1;
      setChallengeIndex(nextIdx);
      setPointer(0);
      setComparisons(0);
      setStatus('searching');
      setSelectedOption(null);
      setFeedback(`Challenge ${nextIdx + 1}: Search for target ${challenges[nextIdx].target}.`);
    } else {
      soundManager.playLevelVictory();
      onLevelComplete(4, 100);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 animate-page-enter">
      <div className="bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/20 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-purple-500/15">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-indigo-50 dark:bg-purple-950/60 border border-indigo-200 dark:border-purple-500/30 text-indigo-700 dark:text-purple-300 rounded-lg text-xs font-bold font-mono">
              CHALLENGE {challengeIndex + 1} OF {challenges.length}
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
              Target:{' '}
              <span className="font-mono text-indigo-600 dark:text-purple-400 text-lg font-extrabold px-2 py-0.5 bg-indigo-50 dark:bg-purple-900/40 rounded-md border border-indigo-200 dark:border-purple-500/30">
                {currentChallenge.target}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-400">COMPARISONS:</span>
            <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg font-bold text-sm shadow-xs">
              {comparisons}
            </span>
          </div>
        </div>

        {/* Array Visual */}
        <div className="pt-6 pb-2">
          <div className="text-xs font-bold uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-between">
            <span>Array Scan</span>
            <span className="text-indigo-600 dark:text-purple-400">Pointer: Index {pointer}</span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 sm:gap-3">
            {currentChallenge.array.map((val, idx) => {
              const isChecked = idx < pointer || (idx === pointer && !isSearching);
              const isCurrent = idx === pointer && isSearching;
              const isMatch = val === currentChallenge.target && !isSearching;
              const isMismatch = isChecked && !isMatch;

              return (
                <button
                  key={idx}
                  id={`lvl4-array-cell-${idx}`}
                  onClick={() => handleCheck(idx)}
                  disabled={!isSearching || idx < pointer}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 select-none ${
                    isMatch
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-md scale-105 ring-4 ring-emerald-500/20'
                      : isMismatch
                      ? 'bg-slate-50 dark:bg-[#080D1F] border-slate-300 dark:border-purple-500/20 text-slate-400 dark:text-slate-500 opacity-80'
                      : isCurrent
                      ? 'bg-indigo-50/70 dark:bg-purple-950/40 border-indigo-600 dark:border-purple-500 text-indigo-900 dark:text-white shadow-md scale-105 ring-4 ring-indigo-500/20 cursor-pointer'
                      : 'bg-white dark:bg-[#0B1228] border-slate-200 dark:border-purple-500/20 text-slate-700 dark:text-slate-300 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 mb-1">
                    [{idx}]
                  </span>
                  <span className="text-lg sm:text-xl font-bold font-mono">{val}</span>
                  <div className="mt-1 text-[9px] font-mono font-bold">
                    {isMatch ? (
                      <span className="text-emerald-600 dark:text-emerald-400">FOUND</span>
                    ) : isMismatch ? (
                      <span className="text-slate-400">≠ {currentChallenge.target}</span>
                    ) : isCurrent ? (
                      <span className="text-indigo-600 dark:text-purple-300 animate-pulse">CHECK</span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600">WAIT</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Analysis Question Options */}
        {isQuestionActive && (
          <div className="mt-6 p-4 sm:p-5 bg-indigo-50/70 dark:bg-purple-950/40 border border-indigo-200 dark:border-purple-500/30 rounded-xl space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-purple-200 uppercase font-mono tracking-wider">
              <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-purple-400" />
              <span>Algorithm Analysis Question</span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {currentChallenge.question}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentChallenge.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                const showSuccess = isSelected && opt.isCorrect;
                const showError = isSelected && !opt.isCorrect;

                return (
                  <button
                    key={opt.id}
                    id={`lvl4-opt-${opt.id}`}
                    onClick={() => handleOptionSelect(opt.id)}
                    disabled={isChallengeDone}
                    className={`text-left p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      showSuccess
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-xs'
                        : showError
                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-800 dark:text-rose-200'
                        : isChallengeDone && opt.isCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                        : 'bg-white dark:bg-[#0B1228] border-slate-200 dark:border-purple-500/20 text-slate-800 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-purple-400'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {showSuccess && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                    {showError && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Controls */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-purple-500/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{feedback}</span>
          </div>

          {isSearching && (
            <button
              id="btn-lvl4-check-next"
              onClick={() => handleCheck()}
              className="btn-modern-primary px-5 py-2.5 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm w-full sm:w-auto justify-center"
            >
              <span>
                Compare [{pointer}] with {currentChallenge.target}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {isChallengeDone && (
            <button
              id="btn-lvl4-next-challenge"
              onClick={handleNextChallenge}
              className="btn-modern-primary bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md w-full sm:w-auto justify-center"
            >
              <span>{isAllChallengesComplete ? 'Complete Level 4' : 'Next Challenge'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
