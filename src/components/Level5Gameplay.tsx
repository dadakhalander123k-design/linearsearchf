import React, { useState } from 'react';
import { ArrowRight, Sparkles, Award, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface Level5Challenge {
  id: number;
  title: string;
  tag: string;
  array: number[];
  target: number;
  expectedComparisons: number;
  isAbsent?: boolean;
}

interface Level5GameplayProps {
  onLevelComplete: (levelId: number, score: number) => void;
  onScoreUpdate: (delta: number) => void;
  onStreakUpdate: (streak: number) => void;
}

export const Level5Gameplay: React.FC<Level5GameplayProps> = ({
  onLevelComplete,
  onScoreUpdate,
  onStreakUpdate,
}) => {
  const challenges: Level5Challenge[] = [
    { id: 1, title: 'Challenge 1: Sequential Traversal', tag: 'GENERAL SEARCH', array: [18, 42, 7, 31, 65], target: 31, expectedComparisons: 4 },
    { id: 2, title: 'Challenge 2: Best Case Look-Up', tag: 'BEST CASE O(1)', array: [72, 14, 38, 51, 90], target: 72, expectedComparisons: 1 },
    { id: 3, title: 'Challenge 3: Late Target Scan', tag: 'LATE TARGET', array: [11, 24, 37, 48, 59, 63], target: 63, expectedComparisons: 6 },
    { id: 4, title: 'Challenge 4: Absent Target Handling', tag: 'TARGET ABSENT O(n)', array: [13, 26, 39, 52, 65], target: 40, expectedComparisons: 5, isAbsent: true },
  ];

  const [phase, setPhase] = useState<'challenges' | 'concept_q1' | 'concept_q2' | 'final_master' | 'final_question'>('challenges');
  const [challengeIndex, setChallengeIndex] = useState<number>(0);
  const [pointer, setPointer] = useState<number>(0);
  const [comparisons, setComparisons] = useState<number>(0);
  const [status, setStatus] = useState<'searching' | 'challenge_completed'>('searching');
  const [feedback, setFeedback] = useState<string>('Execute the Linear Search sequence.');

  // Final Master Challenge
  const finalMasterArray = [23, 41, 12, 67, 35, 89, 54];
  const finalMasterTarget = 35;
  const [masterPointer, setMasterPointer] = useState<number>(0);
  const [masterComparisons, setMasterComparisons] = useState<number>(0);
  const [masterStatus, setMasterStatus] = useState<'searching' | 'completed'>('searching');

  // Conceptual Questions
  const [q1Selected, setQ1Selected] = useState<number | null>(null);
  const [q2Selected, setQ2Selected] = useState<number | null>(null);
  const [finalQSelected, setFinalQSelected] = useState<string | null>(null);

  const currentChallenge = challenges[challengeIndex];

  // Challenge check
  const handleCheck = (clickedIndex?: number) => {
    if (status !== 'searching') return;

    if (clickedIndex !== undefined && clickedIndex !== pointer) {
      soundManager.playError();
      setFeedback('Linear Search must check elements sequentially from left to right.');
      return;
    }

    const currentVal = currentChallenge.array[pointer];
    const nextComparisons = comparisons + 1;
    setComparisons(nextComparisons);

    if (currentVal === currentChallenge.target) {
      soundManager.playCalcSuccess();
      setStatus('challenge_completed');
      setFeedback(`✓ Target ${currentChallenge.target} found in ${nextComparisons} comparison${nextComparisons > 1 ? 's' : ''}!`);
      onScoreUpdate(30);
      onStreakUpdate(challengeIndex + 1);
    } else if (pointer >= currentChallenge.array.length - 1) {
      soundManager.playClick();
      setStatus('challenge_completed');
      setFeedback(`✓ Checked all ${nextComparisons} elements: Target ${currentChallenge.target} NOT FOUND.`);
      onScoreUpdate(30);
      onStreakUpdate(challengeIndex + 1);
    } else {
      soundManager.playClick();
      setPointer((prev) => prev + 1);
      setFeedback(`${currentVal} ≠ ${currentChallenge.target}. Checking next element...`);
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
      setFeedback(`Challenge ${nextIdx + 1}: ${challenges[nextIdx].title}`);
    } else {
      soundManager.playSelect();
      setPhase('concept_q1');
    }
  };

  const handleMasterCheck = (clickedIndex?: number) => {
    if (masterStatus !== 'searching') return;

    if (clickedIndex !== undefined && clickedIndex !== masterPointer) {
      soundManager.playError();
      return;
    }

    const currentVal = finalMasterArray[masterPointer];
    const nextComparisons = masterComparisons + 1;
    setMasterComparisons(nextComparisons);

    if (currentVal === finalMasterTarget) {
      soundManager.playCalcSuccess();
      setMasterStatus('completed');
      onScoreUpdate(50);
      onStreakUpdate(5);
    } else {
      soundManager.playClick();
      setMasterPointer((prev) => prev + 1);
    }
  };

  // 1. Progressive Challenges
  if (phase === 'challenges') {
    const isChallengeDone = status === 'challenge_completed';

    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 animate-page-enter">
        <div className="bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/20 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-purple-500/15">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold font-mono">
                CHALLENGE {challengeIndex + 1} OF 4
              </span>
              <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 dark:bg-purple-950/60 text-indigo-700 dark:text-purple-300 rounded-md border border-indigo-200 dark:border-purple-500/30 uppercase font-mono">
                {currentChallenge.tag}
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-400">COMPARISONS:</span>
              <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg font-bold text-sm shadow-xs">
                {comparisons}
              </span>
            </div>
          </div>

          <div className="pt-4 pb-2 flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {currentChallenge.title}
            </h3>
            <div className="font-mono text-xs font-bold bg-slate-100 dark:bg-[#080D1F] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-purple-500/30">
              Target: <span className="text-indigo-600 dark:text-purple-400 text-sm font-extrabold">{currentChallenge.target}</span>
            </div>
          </div>

          <div className="pt-4 pb-2">
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 sm:gap-3">
              {currentChallenge.array.map((val, idx) => {
                const isChecked = idx < pointer || (idx === pointer && isChallengeDone);
                const isCurrent = idx === pointer && !isChallengeDone;
                const isMatch = val === currentChallenge.target && isChallengeDone;
                const isMismatch = isChecked && !isMatch;

                return (
                  <button
                    key={idx}
                    id={`lvl5-array-cell-${idx}`}
                    onClick={() => handleCheck(idx)}
                    disabled={isChallengeDone || idx < pointer}
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
                        <span className="text-emerald-600 dark:text-emerald-400">FOUND ✓</span>
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

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-purple-500/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{feedback}</span>
            </div>

            {!isChallengeDone ? (
              <button
                id="btn-lvl5-check-next"
                onClick={() => handleCheck()}
                className="btn-modern-primary px-5 py-2.5 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm w-full sm:w-auto justify-center"
              >
                <span>Compare [{pointer}] with {currentChallenge.target}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="btn-lvl5-next-challenge"
                onClick={handleNextChallenge}
                className="btn-modern-primary bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md w-full sm:w-auto justify-center"
              >
                <span>{challengeIndex < challenges.length - 1 ? 'Next Challenge' : 'Master Conceptual Checks'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. Concept Check 1
  if (phase === 'concept_q1') {
    const q1Options = [
      { id: 0, text: 'The first element (Index 0)', isCorrect: true },
      { id: 1, text: 'The middle element', isCorrect: false },
      { id: 2, text: 'The largest element', isCorrect: false },
      { id: 3, text: 'A random element chosen dynamically', isCorrect: false },
    ];

    return (
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 animate-page-enter">
        <div className="bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/20 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-purple-500/15 pb-4">
            <span className="px-3 py-1 bg-indigo-50 dark:bg-purple-950/60 text-indigo-700 dark:text-purple-300 rounded-lg text-xs font-bold font-mono border border-indigo-200 dark:border-purple-500/30">
              MASTER CONCEPT CHECK 1/2
            </span>
            <span className="text-xs font-mono text-slate-500">Algorithm Foundation</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Where does Linear Search always begin?
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {q1Options.map((opt) => {
              const isSelected = q1Selected === opt.id;
              return (
                <button
                  key={opt.id}
                  id={`btn-concept-q1-${opt.id}`}
                  onClick={() => {
                    setQ1Selected(opt.id);
                    if (opt.isCorrect) {
                      soundManager.playCalcSuccess();
                    } else {
                      soundManager.playError();
                    }
                  }}
                  className={`p-4 rounded-xl border text-sm font-semibold transition-all text-left flex items-center justify-between cursor-pointer ${
                    isSelected && opt.isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                      : isSelected && !opt.isCorrect
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-800 dark:text-rose-200'
                      : 'bg-white dark:bg-[#0B1228] border-slate-200 dark:border-purple-500/20 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
                  }`}
                >
                  <span>{opt.text}</span>
                  {isSelected && opt.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {isSelected && !opt.isCorrect && <XCircle className="w-5 h-5 text-rose-500" />}
                </button>
              );
            })}
          </div>

          {q1Selected !== null && q1Options.find((o) => o.id === q1Selected)?.isCorrect && (
            <div className="pt-4 border-t border-slate-100 dark:border-purple-500/15 flex justify-end">
              <button
                id="btn-concept-q1-next"
                onClick={() => {
                  soundManager.playSelect();
                  setPhase('concept_q2');
                }}
                className="btn-modern-primary px-6 py-2.5 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. Concept Check 2
  if (phase === 'concept_q2') {
    const q2Options = [
      { id: 0, text: 'The search stops immediately and returns the position', isCorrect: true },
      { id: 1, text: 'It continues checking the remaining array elements', isCorrect: false },
      { id: 2, text: 'It restarts searching from the first element', isCorrect: false },
      { id: 3, text: 'It sorts the remaining array', isCorrect: false },
    ];

    return (
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 animate-page-enter">
        <div className="bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/20 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-purple-500/15 pb-4">
            <span className="px-3 py-1 bg-indigo-50 dark:bg-purple-950/60 text-indigo-700 dark:text-purple-300 rounded-lg text-xs font-bold font-mono border border-indigo-200 dark:border-purple-500/30">
              MASTER CONCEPT CHECK 2/2
            </span>
            <span className="text-xs font-mono text-slate-500">Stopping Conditions</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            What happens immediately after Linear Search finds the target?
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {q2Options.map((opt) => {
              const isSelected = q2Selected === opt.id;
              return (
                <button
                  key={opt.id}
                  id={`btn-concept-q2-${opt.id}`}
                  onClick={() => {
                    setQ2Selected(opt.id);
                    if (opt.isCorrect) {
                      soundManager.playCalcSuccess();
                    } else {
                      soundManager.playError();
                    }
                  }}
                  className={`p-4 rounded-xl border text-sm font-semibold transition-all text-left flex items-center justify-between cursor-pointer ${
                    isSelected && opt.isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200'
                      : isSelected && !opt.isCorrect
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-800 dark:text-rose-200'
                      : 'bg-white dark:bg-[#0B1228] border-slate-200 dark:border-purple-500/20 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
                  }`}
                >
                  <span>{opt.text}</span>
                  {isSelected && opt.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {isSelected && !opt.isCorrect && <XCircle className="w-5 h-5 text-rose-500" />}
                </button>
              );
            })}
          </div>

          {q2Selected !== null && q2Options.find((o) => o.id === q2Selected)?.isCorrect && (
            <div className="pt-4 border-t border-slate-100 dark:border-purple-500/15 flex justify-end">
              <button
                id="btn-concept-q2-next"
                onClick={() => {
                  soundManager.playSelect();
                  setPhase('final_master');
                }}
                className="btn-modern-primary px-6 py-2.5 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Proceed to Final Master Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4. Final Master Challenge
  if (phase === 'final_master') {
    const isMasterFinished = masterStatus === 'completed';

    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 animate-page-enter">
        <div className="bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/20 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-purple-500/15">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-amber-500 text-white rounded-lg text-xs font-bold font-mono shadow-xs">
                FINAL MASTER CHALLENGE
              </span>
              <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Target: <span className="font-mono text-indigo-600 dark:text-purple-400 text-lg font-extrabold px-2 py-0.5 bg-indigo-50 dark:bg-purple-900/40 rounded-md border border-indigo-200 dark:border-purple-500/30">{finalMasterTarget}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-400">COMPARISONS:</span>
              <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg font-bold text-sm shadow-xs">
                {masterComparisons}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <div className="text-xs font-bold uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-between">
              <span>Array Sequence: [23, 41, 12, 67, 35, 89, 54]</span>
              <span className="text-indigo-600 dark:text-purple-400">Pointer: Index {masterPointer}</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3">
              {finalMasterArray.map((val, idx) => {
                const isChecked = idx < masterPointer || (idx === masterPointer && isMasterFinished);
                const isCurrent = idx === masterPointer && !isMasterFinished;
                const isMatch = val === finalMasterTarget && isMasterFinished;
                const isMismatch = isChecked && !isMatch;

                return (
                  <button
                    key={idx}
                    id={`master-array-cell-${idx}`}
                    onClick={() => handleMasterCheck(idx)}
                    disabled={isMasterFinished || idx < masterPointer}
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
                        <span className="text-emerald-600 dark:text-emerald-400">FOUND ✓</span>
                      ) : isMismatch ? (
                        <span className="text-slate-400">≠ {finalMasterTarget}</span>
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

          {/* Audit Results */}
          {isMasterFinished && (
            <div className="p-5 bg-indigo-50/60 dark:bg-purple-950/40 border border-indigo-200 dark:border-purple-500/30 rounded-2xl space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-purple-300 uppercase font-mono tracking-wider">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-purple-400" />
                <span>Search Audit Results</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                <div className="bg-white dark:bg-[#0B1228] p-3 rounded-xl border border-slate-200 dark:border-purple-500/20">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Status</span>
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">TARGET FOUND</span>
                </div>
                <div className="bg-white dark:bg-[#0B1228] p-3 rounded-xl border border-slate-200 dark:border-purple-500/20">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Comparisons</span>
                  <span className="text-sm font-extrabold text-indigo-600 dark:text-purple-400">5</span>
                </div>
                <div className="bg-white dark:bg-[#0B1228] p-3 rounded-xl border border-slate-200 dark:border-purple-500/20">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Position</span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">5 (Index 4)</span>
                </div>
                <div className="bg-white dark:bg-[#0B1228] p-3 rounded-xl border border-slate-200 dark:border-purple-500/20">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Search Type</span>
                  <span className="text-sm font-extrabold text-indigo-600 dark:text-cyan-400">SUCCESSFUL</span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-purple-500/15 flex justify-between items-center">
            <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
              {!isMasterFinished ? 'Click each element in sequence to complete the search.' : 'Search complete! Proceed to the final master validation question.'}
            </div>

            {!isMasterFinished ? (
              <button
                id="btn-master-check-next"
                onClick={() => handleMasterCheck()}
                className="btn-modern-primary px-5 py-2.5 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Compare [{masterPointer}] with {finalMasterTarget}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="btn-master-proceed-final-q"
                onClick={() => {
                  soundManager.playSelect();
                  setPhase('final_question');
                }}
                className="btn-modern-primary px-6 py-2.5 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md animate-bounce"
              >
                <span>Final Validation Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 5. Final Validation Question
  if (phase === 'final_question') {
    const finalOptions = [
      { id: 'a', text: 'It always searches starting from the middle element.', isCorrect: false },
      { id: 'b', text: 'It checks elements sequentially until the target is found or the sequence ends.', isCorrect: true },
      { id: 'c', text: 'It requires the input data to be sorted in advance.', isCorrect: false },
      { id: 'd', text: 'It checks random elements simultaneously.', isCorrect: false },
    ];

    return (
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 animate-page-enter">
        <div className="bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/20 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-purple-500/15 pb-4">
            <span className="px-3 py-1 bg-amber-500 text-white rounded-lg text-xs font-bold font-mono shadow-xs">
              FINAL MASTERY VALIDATION
            </span>
            <span className="text-xs font-mono text-slate-500">Linear Search Synthesis</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Which statement best describes Linear Search?
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {finalOptions.map((opt) => {
              const isSelected = finalQSelected === opt.id;
              return (
                <button
                  key={opt.id}
                  id={`btn-final-q-${opt.id}`}
                  onClick={() => {
                    setFinalQSelected(opt.id);
                    if (opt.isCorrect) {
                      soundManager.playCalcSuccess();
                    } else {
                      soundManager.playError();
                    }
                  }}
                  className={`p-4 rounded-xl border text-sm font-semibold transition-all text-left flex items-center justify-between cursor-pointer ${
                    isSelected && opt.isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-xs'
                      : isSelected && !opt.isCorrect
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-800 dark:text-rose-200'
                      : 'bg-white dark:bg-[#0B1228] border-slate-200 dark:border-purple-500/20 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
                  }`}
                >
                  <span><strong>{opt.id.toUpperCase()}.</strong> {opt.text}</span>
                  {isSelected && opt.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {isSelected && !opt.isCorrect && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                </button>
              );
            })}
          </div>

          {finalQSelected === 'b' && (
            <div className="pt-6 border-t border-slate-100 dark:border-purple-500/15 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold font-mono flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>All 5 Learning Levels & Concept Verifications Mastered!</span>
              </div>

              <button
                id="btn-complete-level-5"
                onClick={() => {
                  soundManager.playLevelVictory();
                  onLevelComplete(5, 100);
                }}
                className="btn-modern-primary bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md animate-bounce"
              >
                <Award className="w-4 h-4" />
                <span>Unlock Level 06 // Quest Completion</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
