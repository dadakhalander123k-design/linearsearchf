import React from 'react';
import { Check, Circle, Star, Trophy, Layers, Lock } from 'lucide-react';
import { progressManager } from '../utils/progressManager';
import { soundManager } from '../utils/audio';

interface LevelProgressBarProps {
  currentLevelId: number;
  completedLevels: number[];
  onSelectLevel: (levelId: number) => void;
  onOpenLab?: () => void;
  isCompletionActive?: boolean;
}

export const LevelProgressBar: React.FC<LevelProgressBarProps> = ({
  currentLevelId,
  completedLevels,
  onSelectLevel,
  onOpenLab,
  isCompletionActive = false,
}) => {
  const pState = progressManager.getState();

  const steps = [
    { id: 1, code: '01', name: 'Find Number' },
    { id: 2, code: '02', name: 'Find Quickly' },
    { id: 3, code: '03', name: 'Is It There?' },
    { id: 4, code: '04', name: 'Comparisons' },
    { id: 5, code: '05', name: 'Master' },
  ];

  const isAllQuestCompleted = [1, 2, 3, 4, 5].every(
    (id) => completedLevels.includes(id) || pState.levelsCompleted.includes(id) || pState.levelsMastered.includes(id)
  );
  const isLevel6Active = currentLevelId === 6 || isCompletionActive;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 flex flex-col items-center">
      <div className="w-full flex items-center justify-between relative font-sans">
        {/* Connecting Line */}
        <div className="absolute left-6 right-6 top-4.5 h-[2px] bg-slate-200 dark:bg-purple-500/25 -z-0" />

        {steps.map((step) => {
          const isMastered = pState.levelsMastered.includes(step.id);
          const isCompleted = completedLevels.includes(step.id) || pState.levelsCompleted.includes(step.id) || isMastered;
          const isCurrent = currentLevelId === step.id && !isLevel6Active;

          return (
            <button
              key={step.id}
              id={`step-progress-node-${step.id}`}
              onClick={() => {
                soundManager.playSelect();
                onSelectLevel(step.id);
              }}
              className="group flex flex-col items-center gap-2 relative z-10 focus:outline-hidden cursor-pointer"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 border-2 ${
                  isCurrent
                    ? 'bg-indigo-600 dark:bg-purple-600 text-white border-indigo-600 dark:border-purple-500 shadow-md dark:shadow-[0_0_15px_rgba(124,58,237,0.4)] ring-4 ring-indigo-100 dark:ring-purple-500/20 scale-110'
                    : isCompleted
                    ? 'bg-white dark:bg-[#0B1228] text-indigo-600 dark:text-purple-400 border-indigo-600 dark:border-purple-500 shadow-xs hover:bg-indigo-50 dark:hover:bg-purple-950/40'
                    : 'bg-white dark:bg-[#080D1F] text-slate-400 dark:text-slate-500 border-slate-300 dark:border-purple-500/30 hover:border-slate-400 dark:hover:border-purple-400'
                }`}
              >
                {isMastered ? (
                  <Star className="w-4 h-4 fill-indigo-600 text-indigo-600 dark:fill-purple-400 dark:text-purple-400" />
                ) : isCompleted ? (
                  <Check className="w-4 h-4 text-indigo-600 dark:text-purple-400 stroke-[3]" />
                ) : isCurrent ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 stroke-[1.5]" />
                )}
              </div>

              <div className="text-center">
                <span className={`text-[10px] font-mono font-bold block ${isCurrent ? 'text-indigo-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  {step.code}
                </span>
                <span
                  className={`text-[11px] font-semibold hidden sm:block max-w-[85px] leading-tight transition-colors ${
                    isCurrent
                      ? 'text-indigo-700 dark:text-purple-300 font-bold'
                      : isCompleted
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {step.name}
                </span>
              </div>
            </button>
          );
        })}

        {/* Completion Step Node */}
        <button
          id="step-progress-node-completion"
          onClick={() => {
            soundManager.playSelect();
            onSelectLevel(6);
          }}
          className="group flex flex-col items-center gap-2 relative z-10 focus:outline-hidden cursor-pointer"
          title="Completion Milestone"
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 border-2 ${
              isLevel6Active
                ? 'bg-amber-500 text-white border-amber-500 shadow-md ring-4 ring-amber-100 dark:ring-amber-500/20 scale-110'
                : isAllQuestCompleted
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-500 dark:border-amber-400 shadow-xs hover:bg-amber-100 dark:hover:bg-amber-900/40'
                : 'bg-slate-100 dark:bg-[#080D1F] text-slate-400 dark:text-slate-500 border-slate-300 dark:border-purple-500/30'
            }`}
          >
            {isAllQuestCompleted || isLevel6Active ? (
              <Trophy className={`w-4 h-4 ${isLevel6Active ? 'text-white' : 'text-amber-500 dark:text-amber-400'}`} />
            ) : (
              <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            )}
          </div>
          <div className="text-center">
            <span className={`text-[10px] font-mono font-bold block ${isLevel6Active ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>
              06
            </span>
            <span
              className={`text-[11px] font-semibold hidden sm:block max-w-[85px] leading-tight transition-colors ${
                isLevel6Active
                  ? 'text-amber-700 dark:text-amber-300 font-bold'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              Completion
            </span>
          </div>
        </button>
      </div>

      {/* Optional Lab Action immediately below completion/progress section */}
      {(isLevel6Active || isAllQuestCompleted) && onOpenLab && (
        <div className="mt-4 pt-2 flex justify-center animate-fadeIn">
          <button
            id="btn-stepper-open-lab"
            onClick={() => {
              soundManager.playSelect();
              onOpenLab();
            }}
            className="btn-modern-secondary px-4 py-2 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs hover:shadow-md transition-all"
            title="Open Interactive Lab (Optional)"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-purple-400" />
            <span>LAB</span>
          </button>
        </div>
      )}
    </div>
  );
};
