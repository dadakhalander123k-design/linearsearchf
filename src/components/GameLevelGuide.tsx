import React from 'react';
import { Sparkles } from 'lucide-react';

interface GameLevelGuideProps {
  levelId: number;
}

const LEVEL_GUIDES: Record<number, string> = {
  1: 'Calculate key % table size. Use the remainder as the bucket index, then place the key there.',
  2: 'Calculate the index. If the bucket is occupied, connect the new key to the existing chain.',
  3: 'Calculate the index. If the bucket is full, check the next bucket until you find an empty position.',
  4: 'Calculate the index. If it is occupied, try square-based jumps until you find the next valid position.',
  5: 'Use the first hash to find the starting position. Use the second hash to determine the jump.',
};

export const GameLevelGuide: React.FC<GameLevelGuideProps> = ({ levelId }) => {
  const guideText =
    LEVEL_GUIDES[levelId] ||
    'Calculate the index and place the key in the correct slot according to the level rules.';

  return (
    <div
      key={`guide-level-${levelId}`}
      id={`game-level-guide-${levelId}`}
      className="max-w-2xl mx-auto w-full bg-indigo-50/70 dark:bg-[#0B1228]/90 border border-indigo-100 dark:border-purple-500/25 rounded-2xl p-4 font-sans text-slate-900 dark:text-slate-100 transition-all duration-300 shadow-2xs dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
    >
      <div className="flex items-center justify-between gap-2 mb-2 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-indigo-600 dark:text-purple-400 text-xs font-bold leading-none">✦</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-purple-300">
            Level Guide
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold tracking-widest hidden sm:inline">
            • Level 0{levelId}
          </span>
        </div>

        {/* Small Non-functional AI Placeholder Button */}
        <button
          id="btn-game-ai-placeholder"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            // Non-functional visual placeholder as instructed
          }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold font-mono rounded-lg bg-white dark:bg-[#080D1F] text-indigo-700 dark:text-purple-300 border border-indigo-200 dark:border-purple-500/40 shadow-xs dark:shadow-[0_0_12px_rgba(124,58,237,0.25)] hover:border-indigo-300 dark:hover:border-purple-400 dark:hover:shadow-[0_0_16px_rgba(168,85,247,0.4)] transition-all cursor-default select-none"
          title="AI Assistant (Preview)"
          aria-label="AI Help Placeholder"
        >
          <Sparkles className="w-3 h-3 text-indigo-600 dark:text-purple-400" />
          <span>✦ AI HELP</span>
        </button>
      </div>
      <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium pl-3 border-l-2 border-indigo-400 dark:border-purple-500">
        {guideText}
      </p>
    </div>
  );
};
