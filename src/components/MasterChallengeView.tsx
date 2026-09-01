import React from 'react';
import { Sparkles, Trophy, ArrowRight, Check, Star } from 'lucide-react';
import { TechniqueType } from '../types/game';
import { progressManager } from '../utils/progressManager';
import { soundManager } from '../utils/audio';

interface MasterChallengeViewProps {
  onStartChallenge: (technique: TechniqueType, title: string, keys: number[], challengeId: string) => void;
  onOpenSandbox: () => void;
  onExit: () => void;
}

export const MasterChallengeView: React.FC<MasterChallengeViewProps> = ({
  onStartChallenge,
  onOpenSandbox,
  onExit,
}) => {
  const pState = progressManager.getState();

  const challenges = [
    {
      id: 'chal-chaining',
      code: 'EXAM-01',
      title: 'Separate Chaining Mastery',
      technique: 'chaining' as TechniqueType,
      keys: [12, 22, 32, 42, 52, 7],
      difficulty: 'FOUNDATION',
      desc: 'Insert 6 keys that form multiple deep linked list buckets with zero data loss.',
    },
    {
      id: 'chal-linear',
      code: 'EXAM-02',
      title: 'Linear Probing Gauntlet',
      technique: 'linear' as TechniqueType,
      keys: [28, 38, 48, 58, 9, 19],
      difficulty: 'INTERMEDIATE',
      desc: 'Navigate dense cluster collisions and table wrap-arounds at index 9 → 0.',
    },
    {
      id: 'chal-quadratic',
      code: 'EXAM-03',
      title: 'Quadratic Jump Calculations',
      technique: 'quadratic' as TechniqueType,
      keys: [15, 25, 35, 45, 55],
      difficulty: 'ADVANCED',
      desc: 'Jump over slots using 1², 2², 3² squares without landing on occupied cells.',
    },
    {
      id: 'chal-double',
      code: 'EXAM-04',
      title: 'Double Hashing Dual Engine',
      technique: 'double_hashing' as TechniqueType,
      keys: [13, 23, 33, 43, 63],
      difficulty: 'EXPERT',
      desc: 'Calculate primary hash h1 and dynamic step size h2 for each colliding key.',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 animate-page-enter font-sans">
      {/* Hero Header */}
      <div className="border-b border-slate-200 dark:border-purple-500/20 pb-6 mb-8 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-indigo-50 dark:bg-purple-950/60 text-indigo-700 dark:text-purple-300 border border-indigo-100 dark:border-purple-500/30 text-xs font-semibold rounded-md font-mono">
            EXAMINATION // LEVEL 06
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            COMPLETED: {pState.masterChallengesCompleted.length} / 4 GAUNTLETS
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Hash Master Challenge Gauntlet
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl mt-2 font-normal leading-relaxed">
          Prove your mastery across all collision resolution techniques under high table load. Pick a challenge to test your calculating, probing, and insertion mechanics.
        </p>
      </div>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {challenges.map((chal) => {
          const isDone = pState.masterChallengesCompleted.includes(chal.id);

          return (
            <div
              key={chal.id}
              id={`btn-start-challenge-${chal.id}`}
              onClick={() => {
                soundManager.playSelect();
                onStartChallenge(chal.technique, chal.title, chal.keys, chal.id);
              }}
              className={`p-6 modern-card border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                isDone
                  ? 'bg-slate-50/70 dark:bg-[#0B1228] border-indigo-200 dark:border-purple-500/40 shadow-xs'
                  : 'bg-white dark:bg-[#0B1228] border-slate-200 dark:border-purple-500/20 hover:border-slate-300 dark:hover:border-purple-500/45 hover:-translate-y-0.5 shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono bg-indigo-600 dark:bg-purple-600 text-white px-2 py-0.5 rounded-md">
                      {chal.code}
                    </span>
                    <span className="text-[11px] font-semibold text-indigo-600 dark:text-purple-300 uppercase tracking-wider font-mono">
                      {chal.difficulty}
                    </span>
                  </div>
                  {isDone && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/30">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> CLEARED
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-xl text-slate-900 dark:text-white tracking-tight mb-2">
                  {chal.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {chal.desc}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-purple-500/15 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  KEYS: [{chal.keys.join(', ')}]
                </span>
                <span className="text-xs font-semibold text-indigo-600 dark:text-purple-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  {isDone ? 'Replay' : 'Start'} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          id="btn-master-open-sandbox"
          onClick={() => {
            soundManager.playSecondaryClick();
            onOpenSandbox();
          }}
          className="btn-modern-secondary py-2.5 px-5 text-sm font-semibold flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-purple-400" />
          <span>Open Lab Workbench</span>
        </button>
        <button
          id="btn-master-return-game"
          onClick={() => {
            soundManager.playPrimaryClick();
            onExit();
          }}
          className="btn-modern-primary py-2.5 px-5 text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Check className="w-4 h-4" />
          <span>Return to Story Quest</span>
        </button>
      </div>
    </div>
  );
};
