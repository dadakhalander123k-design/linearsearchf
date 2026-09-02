import React from 'react';
import { GameState, LevelConfig } from '../types/game';
import { Info, Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface ExplanationPanelProps {
  level: LevelConfig;
  gameState: GameState;
  currentKey: number | null;
  calculatedIndex: number | null;
  targetIndex: number | null;
  probingIndex: number | null;
  isProbing: boolean;
  probeStepNumber: number;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  level,
  gameState,
  currentKey,
  calculatedIndex,
  targetIndex,
  probingIndex,
  isProbing,
  probeStepNumber,
}) => {
  let title = 'STEP 1: COMPUTE MODULO REMAINDER';
  let message = 'Calculate the remainder formula to find the target array index for this key.';
  let icon = <Info className="w-4 h-4 text-[#2563EB]" />;

  if (gameState === 'INDEX_FOUND' || (calculatedIndex !== null && !isProbing)) {
    title = `Target Found: Slot [${calculatedIndex < 10 ? `0${calculatedIndex}` : calculatedIndex}]`;
    message = `Key ${currentKey} maps to Index ${calculatedIndex}. Drag the key card or click the slot to complete insertion!`;
    icon = <ArrowRight className="w-4 h-4 text-[#2563EB]" />;
  } else if (gameState === 'COLLISION_PAUSE') {
    title = 'Collision Encountered!';
    message = `Index ${calculatedIndex} already contains a value. Both keys resolve to the exact same memory bucket.`;
    icon = <AlertTriangle className="w-4 h-4 text-rose-600" />;
  } else if (isProbing || gameState === 'PROBING_INTERACTION') {
    title = `Collision Resolution: ${level.title}`;
    if (level.technique === 'linear') {
      message = `Slot occupied. Linear probing checks sequential neighbors (+1) until an empty cell is located.`;
    } else if (level.technique === 'quadratic') {
      message = `Slot occupied. Quadratic probing leaps by square intervals (+1, +4, +9) to prevent clustering.`;
    } else if (level.technique === 'double_hashing') {
      message = `Slot occupied. Double hashing computes a unique non-zero jump interval h2(k) for this key.`;
    }
    icon = <Sparkles className="w-4 h-4 text-[#2563EB]" />;
  } else if (gameState === 'CHAIN_CONNECTING') {
    title = 'Separate Chaining Attachment';
    message = `Both keys share Index ${calculatedIndex}. They are linked sequentially into the slot's chain bucket.`;
    icon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
  }

  return (
    <div className="w-full max-w-5xl mx-auto font-sans">
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-blue-500/25 rounded-2xl p-4 sm:p-5 shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] dark:bg-blue-950/50 border border-[#DBEAFE] dark:border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
            {icon}
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 dark:text-white mb-0.5">
              {title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
