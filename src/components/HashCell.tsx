import React, { useState } from 'react';
import { ArrowRight, Link as LinkIcon, ShieldAlert, ArrowDown } from 'lucide-react';
import { TableSlot, TechniqueType } from '../types/game';
import { soundManager } from '../utils/audio';

interface HashCellProps {
  slot: TableSlot;
  technique: TechniqueType;
  isTarget: boolean;
  isProbingTarget: boolean;
  isCollided: boolean;
  incomingKey: number | null;
  onCellClick: (index: number) => void;
  onDropKey: (index: number) => void;
}

export const HashCell: React.FC<HashCellProps> = ({
  slot,
  technique,
  isTarget,
  isProbingTarget,
  isCollided,
  incomingKey,
  onCellClick,
  onDropKey,
}) => {
  const [isDragHover, setIsDragHover] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragHover) {
      soundManager.playDragTarget();
      setIsDragHover(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragHover(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragHover(false);
    onDropKey(slot.index);
  };

  const isOccupied = slot.items.length > 0;
  const isChaining = technique === 'chaining';

  // Dimensional cell styling with soft background gradients in Light Mode, and clean deep card background in Dark Mode
  let cellClass = isOccupied
    ? 'bg-gradient-to-b from-[#EFF6FF]/70 via-white to-slate-50/90 dark:bg-[#111827] dark:bg-none border-2 border-[#DBEAFE]/90 dark:border-blue-500/40 shadow-xs hover:border-[#2563EB] dark:hover:border-blue-400 hover:shadow-sm'
    : 'bg-gradient-to-b from-white via-slate-50/60 to-slate-100/70 dark:bg-[#111827] dark:bg-none border-2 border-slate-200/90 dark:border-blue-900/60 shadow-2xs hover:border-[#2563EB] dark:hover:border-blue-500/50 hover:bg-slate-50/50';

  if (isCollided) {
    cellClass =
      'bg-gradient-to-b from-rose-50/95 via-rose-50/80 to-rose-100/60 dark:bg-[#111827] dark:bg-none border-2 border-rose-500 shadow-md ring-3 ring-rose-200 dark:ring-rose-500/40 animate-shake';
  } else if (isDragHover) {
    cellClass =
      'bg-gradient-to-b from-[#EFF6FF] via-[#EFF6FF]/70 to-white dark:bg-[#111827] dark:bg-none border-2 border-[#2563EB] dark:border-blue-400 shadow-lg ring-3 ring-[#DBEAFE] dark:ring-blue-500/50 scale-[1.04]';
  } else if (isTarget || isProbingTarget) {
    cellClass =
      'bg-gradient-to-b from-[#EFF6FF] via-[#EFF6FF]/60 to-white dark:bg-[#111827] dark:bg-none border-2 border-[#2563EB] dark:border-blue-400 shadow-md ring-3 ring-[#DBEAFE]/80 dark:ring-blue-500/40 scale-[1.03]';
  }

  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0 min-w-[84px] sm:min-w-[98px] font-mono">
      {/* Slot Index Header Badge with Depth */}
      <div className="flex items-center">
        <span
          className={`text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-lg border transition-all duration-200 shadow-2xs ${
            isTarget || isProbingTarget
              ? 'bg-[#2563EB] dark:bg-[#3B82F6] text-white border-[#2563EB] dark:border-blue-500 shadow-xs'
              : 'bg-white dark:bg-[#0F172A] text-[#2563EB] dark:text-slate-200 border-2 border-[#DBEAFE]/80 dark:border-blue-900/60'
          }`}
        >
          [{slot.index < 10 ? `0${slot.index}` : slot.index}]
        </span>
      </div>

      {/* Main Hash Slot Box */}
      <div
        id={`hash-cell-${slot.index}`}
        onClick={() => onCellClick(slot.index)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full min-h-[116px] sm:min-h-[128px] p-2 rounded-xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer select-none ${cellClass}`}
      >
        {/* Cell Content */}
        {!isOccupied ? (
          <div className="flex flex-col items-center justify-center text-center p-1 w-full h-full">
            {isTarget ? (
              <span className="text-[11px] font-bold text-[#2563EB] dark:text-[#3B82F6] bg-[#EFF6FF] dark:bg-[#0F172A] border border-[#DBEAFE] dark:border-blue-500/60 px-2 py-1 rounded-md uppercase tracking-wider shadow-2xs">
                Drop Here
              </span>
            ) : (
              <div className="flex flex-col items-center justify-center py-3">
                <span className="text-xs text-slate-400 dark:text-slate-300 font-mono font-medium">Empty</span>
                <span className="w-4 h-0.5 bg-slate-200 dark:bg-blue-500/40 rounded-full mt-1" />
              </div>
            )}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-1.5">
            {/* Primary Key Element in Slot - Dimensional Royal Blue Block */}
            <div className="w-full flex items-center justify-center">
              <div
                className={`w-full py-2.5 px-1.5 text-center font-mono font-black text-sm sm:text-base rounded-lg border transition-all duration-200 shadow-xs ${
                  isCollided
                    ? 'bg-rose-600 text-white border-rose-700 dark:border-rose-500 shadow-sm'
                    : 'bg-[#2563EB] dark:bg-[#3B82F6] text-white border-[#2563EB]/60 dark:border-blue-500 shadow-sm'
                }`}
              >
                {slot.items[0]?.value}
              </div>
            </div>

            {/* Collision Indicator inside Cell */}
            {isCollided && incomingKey !== null && (
              <div className="w-full bg-rose-100/90 dark:bg-[#0F172A] border border-rose-300 dark:border-rose-500/60 rounded-md p-1 text-center shadow-2xs">
                <div className="text-[10px] font-bold text-rose-800 dark:text-rose-300 flex items-center justify-center gap-1 uppercase">
                  <ShieldAlert className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                  Collision!
                </div>
                <div className="text-[10px] font-mono text-rose-900 dark:text-rose-200 font-bold">
                  {incomingKey} vs {slot.items[0]?.value}
                </div>
              </div>
            )}

            {/* If Separate Chaining: Render Chained Linked Nodes */}
            {isChaining && slot.items.length > 1 && (
              <div className="w-full flex flex-col items-center gap-1 pt-1.5 border-t border-slate-200/90 dark:border-blue-500/20">
                <div className="flex items-center gap-1 text-[9px] font-mono font-bold text-[#2563EB] dark:text-[#3B82F6] uppercase">
                  <LinkIcon className="w-2.5 h-2.5 text-[#2563EB] dark:text-[#3B82F6]" />
                  <span>Chain (+{slot.items.length - 1})</span>
                </div>

                <div className="w-full flex flex-col gap-1.5">
                  {slot.items.slice(1).map((item, idx) => (
                    <div key={item.id || idx} className="flex items-center gap-1 w-full justify-center">
                      <ArrowDown className="w-2.5 h-2.5 text-[#2563EB] dark:text-[#3B82F6] shrink-0" />
                      <div className="flex-1 py-1 px-1.5 bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white border border-[#DBEAFE] dark:border-blue-500/40 rounded-md text-center font-mono font-bold text-xs shadow-2xs transition-all hover:border-[#2563EB] dark:hover:border-blue-400">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
