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
      className="max-w-2xl mx-auto w-full bg-[#EFF6FF]/70 dark:bg-[#111827]/90 border border-[#DBEAFE] dark:border-blue-500/25 rounded-2xl p-4 font-sans text-slate-900 dark:text-slate-100 transition-all duration-300 shadow-2xs dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
    >
      <div className="flex items-center justify-between gap-2 mb-2 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[#2563EB] dark:text-[#3B82F6] text-xs font-bold leading-none">✦</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#3B82F6]">
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
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold font-mono rounded-lg bg-white dark:bg-[#0F172A] text-[#2563EB] dark:text-[#3B82F6] border border-[#DBEAFE] dark:border-blue-500/40 shadow-xs hover:border-[#2563EB] dark:hover:border-blue-400 transition-all cursor-default select-none"
          title="AI Assistant (Preview)"
          aria-label="AI Help Placeholder"
        >
          <Sparkles className="w-3 h-3 text-[#2563EB] dark:text-[#3B82F6]" />
          <span>✦ AI HELP</span>
        </button>
      </div>
      <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium pl-3 border-l-2 border-[#2563EB] dark:border-[#3B82F6]">
        {guideText}
      </p>
    </div>
  );
};
