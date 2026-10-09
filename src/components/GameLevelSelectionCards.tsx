import React from 'react';
import { 
  Play, 
  RotateCcw, 
  Lock, 
  CheckCircle2, 
  Trophy, 
  Sparkles, 
  Layers, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Code2,
  Hash,
  FlaskConical,
  Sliders
} from 'lucide-react';
import { GAME_LEVELS } from '../data/levels';
import { progressManager } from '../utils/progressManager';
import { soundManager } from '../utils/audio';
import { POINTS_CONFIG } from '../types/points';

interface GameLevelSelectionCardsProps {
  completedLevels: number[];
  currentLevelIndex: number;
  onSelectLevel: (levelIndex: number) => void;
  onOpenCompletion?: () => void;
  onOpenLab?: () => void;
}

export const GameLevelSelectionCards: React.FC<GameLevelSelectionCardsProps> = ({
  completedLevels,
  currentLevelIndex,
  onSelectLevel,
  onOpenCompletion: _onOpenCompletion,
  onOpenLab,
}) => {
  const pState = progressManager.getState();

  // Strict sequential unlocking check:
  // Level 1 (index 0) is always unlocked
  // Level 2 (index 1) requires Level 1 completed
  // Level 3 (index 2) requires Level 2 completed
  // Level 4 (index 3) requires Level 3 completed
  // Level 5 (index 4) requires Level 4 completed
  const isLevelUnlocked = (lvlId: number): boolean => {
    if (lvlId === 1) return true;
    const prevLvlId = lvlId - 1;
    return (
      completedLevels.includes(prevLvlId) ||
      pState.levelsCompleted.includes(prevLvlId) ||
      pState.levelsMastered.includes(prevLvlId)
    );
  };

  const isLevelCompleted = (lvlId: number): boolean => {
    return (
      completedLevels.includes(lvlId) ||
      pState.levelsCompleted.includes(lvlId) ||
      pState.levelsMastered.includes(lvlId)
    );
  };

  // Strict check: all 4 levels completed
  const isAllLevelsCompleted = [1, 2, 3, 4].every((lvlId) => isLevelCompleted(lvlId));

  const totalCompletedCount = [1, 2, 3, 4].filter((lvlId) => isLevelCompleted(lvlId)).length;

  return (
    <section 
      id="game-level-selection-section"
      className="w-full flex flex-col gap-8 animate-fadeIn font-sans"
      aria-label="Game Level Selection"
    >
      {/* 1. Header Banner & Progress Overview */}
      <div className="w-full rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-blue-500/20 shadow-xs p-6 sm:p-8 relative overflow-hidden transition-all">
        {/* Subtle decorative background gradient accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] dark:bg-blue-950/60 border border-[#DBEAFE] dark:border-blue-500/30 text-[#2563EB] dark:text-[#3B82F6] text-xs font-bold uppercase font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Challenges • 4 Levels</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
              Linear Search Game Levels
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Choose a level to begin your sequential search challenge. Master step-by-step element comparisons, index verification, absent targets, and Big-O algorithmic complexity.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex flex-row md:flex-col items-center md:items-end gap-3 w-full md:w-auto justify-between md:justify-center pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-blue-500/20">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-[#2563EB] dark:text-[#3B82F6]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase font-mono">
                  Curriculum Progress
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {totalCompletedCount} of 4 Levels Completed
                </div>
              </div>
            </div>

            {isAllLevelsCompleted && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold animate-pulse">
                <Trophy className="w-3.5 h-3.5" />
                <span>All Levels Mastered!</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar Line */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 font-mono">
            <span>Overall Completion</span>
            <span className="font-bold text-[#2563EB] dark:text-[#3B82F6]">
              {Math.round((totalCompletedCount / 4) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#2563EB] to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${(totalCompletedCount / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. GAME LEVEL CARDS GRID (FOUR LEVELS: 1, 2, 3 [old 4], 4 [old 5]) */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        id="level-cards-container"
      >
        {/* Four Existing Game Level Cards */}
        {GAME_LEVELS.slice(0, 4).map((lvl, index) => {
          const unlocked = isLevelUnlocked(lvl.id);
          const completed = isLevelCompleted(lvl.id);
          const isCurrent = currentLevelIndex === index;

          // Clean title display (strip "Level X: " prefix if present for sleek badge separation)
          const cleanTitle = lvl.title.replace(/^Level\s*\d+:\s*/i, '');
          const levelCode = lvl.id < 10 ? `LEVEL 0${lvl.id}` : `LEVEL ${lvl.id}`;

          return (
            <div
              key={`level-card-${lvl.id}`}
              id={`level-card-${lvl.id}`}
              className={`group flex flex-col justify-between rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                completed
                  ? 'bg-white dark:bg-[#111827] border-emerald-300/80 dark:border-emerald-500/30 hover:border-emerald-400 shadow-xs hover:shadow-md'
                  : unlocked
                  ? isCurrent
                    ? 'bg-white dark:bg-[#111827] border-[#2563EB] dark:border-[#3B82F6] ring-2 ring-blue-500/20 shadow-md scale-[1.01]'
                    : 'bg-white dark:bg-[#111827] border-slate-200/90 dark:border-blue-500/20 hover:border-blue-300 dark:hover:border-blue-500/40 shadow-xs hover:shadow-lg hover:-translate-y-1'
                  : 'bg-slate-50/80 dark:bg-[#0B1120]/70 border-slate-200/70 dark:border-slate-800/80 opacity-80 select-none'
              }`}
            >
              {/* Top Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between gap-2 mb-3">
                  {/* Prominent Level Badge */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold tracking-wider uppercase ${
                      completed
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                        : unlocked
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#3B82F6] border border-blue-200 dark:border-blue-500/30'
                        : 'bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300/60 dark:border-slate-700/60'
                    }`}
                  >
                    <Hash className="w-3 h-3" />
                    <span>{levelCode}</span>
                  </div>

                  {/* Status Indicator Tag */}
                  <div>
                    {completed ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-sans">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    ) : unlocked ? (
                      isCurrent ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 dark:bg-blue-900/40 text-[#2563EB] dark:text-[#3B82F6] animate-pulse">
                          <Zap className="w-3.5 h-3.5" />
                          In Progress
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          Available
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        <Lock className="w-3 h-3" />
                        Locked
                      </span>
                    )}
                  </div>
                </div>

                {/* Level Title */}
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-[#2563EB] dark:group-hover:text-[#3B82F6] transition-colors">
                  {cleanTitle}
                </h2>

                {/* Level Subtitle / Concept Tag */}
                <div className="mt-1 text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <span>{lvl.subtitle}</span>
                </div>

                {/* Short Basic Information / Preview */}
                <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed min-h-[44px]">
                  {lvl.introExplanation || lvl.techniqueSummary}
                </p>

                {/* Technical Specs & Details + Points Reward Badge */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-slate-400" />
                      {lvl.tableSize} Elements
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 flex items-center gap-1 truncate max-w-[200px]" title={lvl.formulaDisplay || lvl.h1Formula}>
                      <Code2 className="w-3 h-3 text-slate-400" />
                      {lvl.h1Formula || lvl.formulaDisplay}
                    </span>
                    {lvl.moduleCode && (
                      <span className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-bold">
                        {lvl.moduleCode}
                      </span>
                    )}
                  </div>

                  {/* Points Reward Badge */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-bold font-sans shadow-2xs">
                    <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
                    <span>+{POINTS_CONFIG.GAME_PER_LEVEL} pts</span>
                  </span>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="p-6 pt-0 mt-2">
                {unlocked ? (
                  <button
                    id={`btn-play-level-${lvl.id}`}
                    onClick={() => {
                      soundManager.playClick();
                      onSelectLevel(index);
                    }}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-offset-2 ${
                      completed
                        ? 'bg-slate-100 hover:bg-emerald-600 dark:bg-slate-800 dark:hover:bg-emerald-600 text-slate-700 hover:text-white dark:text-slate-300 dark:hover:text-white focus:ring-emerald-500'
                        : 'bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-blue-600 text-white shadow-blue-500/20 hover:shadow-md focus:ring-blue-500'
                    }`}
                  >
                    {completed ? (
                      <>
                        <RotateCcw className="w-4 h-4" />
                        <span>REPLAY LEVEL {lvl.id}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>PLAY LEVEL {lvl.id}</span>
                      </>
                    )}
                    <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ) : (
                  <div
                    id={`btn-locked-level-${lvl.id}`}
                    className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-slate-400 dark:text-slate-500 bg-slate-200/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 cursor-not-allowed"
                    title={`Complete Level ${lvl.id - 1} to unlock this challenge`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>LOCKED • Complete Level 0{lvl.id - 1}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. BOTTOM ROW / FOOTER AREA: LAB CARD */}
      <div 
        id="lab-card-bottom-row"
        className="w-full"
      >
        <div
          id="card-lab-workbench"
          className="group flex flex-col md:flex-row items-stretch md:items-center justify-between rounded-2xl border transition-all duration-300 relative overflow-hidden bg-white dark:bg-[#111827] border-slate-200/90 dark:border-blue-500/20 hover:border-blue-400 dark:hover:border-blue-400/50 shadow-xs hover:shadow-lg p-6 sm:p-7 gap-6"
        >
          {/* Left / Info Section */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2.5">
              {/* Prominent LAB Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold tracking-wider uppercase bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#3B82F6] border border-blue-200 dark:border-blue-500/30">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>LAB</span>
              </div>

              {/* Status Indicator Tag */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-sans">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                Interactive Workbench
              </span>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-[#2563EB] dark:group-hover:text-[#3B82F6] transition-colors">
              Interactive Lab
            </h2>

            {/* Subtitle */}
            <div className="mt-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              Practice Circular Linked List operations in the interactive laboratory.
            </div>

            {/* Short Basic Information */}
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
              Build custom arrays, configure target values, and step through sequential comparisons in the interactive laboratory.
            </p>

            {/* Technical Specs & Details */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px] font-mono">
              <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-slate-400" />
                3 - 12 Elements
              </span>
              <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Code2 className="w-3 h-3 text-slate-400" />
                Step Execution
              </span>
              <span className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-bold">
                SANDBOX
              </span>
            </div>
          </div>

          {/* Right / Button Section */}
          <div className="shrink-0 flex items-center w-full md:w-auto">
            <button
              id="btn-open-lab-card"
              onClick={() => {
                soundManager.playSelect();
                if (onOpenLab) {
                  onOpenLab();
                }
              }}
              className="w-full md:w-auto px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-offset-2 bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-blue-600 text-white shadow-blue-500/20 hover:shadow-md focus:ring-blue-500"
            >
              <FlaskConical className="w-4 h-4" />
              <span>OPEN LAB</span>
              <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
