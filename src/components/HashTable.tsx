import React from 'react';
import { TableSlot, TechniqueType } from '../types/game';
import { HashCell } from './HashCell';
import { ArrowRight, Link as LinkIcon, Layers } from 'lucide-react';

interface HashTableProps {
  slots: TableSlot[];
  technique: TechniqueType;
  targetIndex: number | null;
  probingIndex: number | null;
  collidedIndex: number | null;
  incomingKey: number | null;
  onCellClick: (index: number) => void;
  onDropKey: (index: number) => void;
  tableSize: number;
}

export const HashTable: React.FC<HashTableProps> = ({
  slots,
  technique,
  targetIndex,
  probingIndex,
  collidedIndex,
  incomingKey,
  onCellClick,
  onDropKey,
  tableSize,
}) => {
  const isChaining = technique === 'chaining';

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-4">
      {/* Modern Table Card Container with Dimensional Shadow & Border */}
      <div className="w-full bg-white dark:bg-[#0B1228] border-2 border-indigo-100/90 dark:border-purple-500/25 rounded-2xl p-5 sm:p-7 overflow-hidden shadow-md shadow-indigo-900/5 dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all">
        {/* Table Header Bar with Royal Blue Accents */}
        <div className="flex flex-wrap items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-purple-500/15 gap-2 font-sans">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-purple-950/60 border border-indigo-100 dark:border-purple-500/30 flex items-center justify-center text-indigo-600 dark:text-purple-300 shadow-2xs">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Hash Table Array (Capacity = {tableSize})
            </h3>
            <span className="text-xs bg-indigo-50/60 dark:bg-[#080D1F] px-2.5 py-0.5 rounded-lg border border-indigo-100 dark:border-purple-500/20 text-indigo-700 dark:text-purple-300 font-mono font-bold shadow-2xs">
              Index 00 .. {tableSize - 1 < 10 ? `0${tableSize - 1}` : tableSize - 1}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 dark:bg-[#080D1F] border border-slate-200/80 dark:border-purple-500/20 shadow-2xs">
              <span className="w-2.5 h-2.5 bg-indigo-600 dark:bg-purple-600 rounded-xs shadow-2xs" /> Occupied
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-purple-950/50 border border-indigo-200/80 dark:border-purple-500/30 text-indigo-700 dark:text-cyan-300 font-semibold shadow-2xs">
              <span className="w-2.5 h-2.5 bg-indigo-600 dark:bg-cyan-400 rounded-xs shadow-2xs" /> Target / Probe
            </span>
            {isChaining && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 dark:bg-purple-950/40 border border-slate-200 dark:border-purple-500/20 text-slate-700 dark:text-purple-300 font-semibold shadow-2xs">
                <span className="w-2.5 h-2.5 bg-indigo-200 dark:bg-purple-900/60 rounded-xs" /> Linked List
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Slots Row with subtle container padding */}
        <div className="w-full bg-slate-50/70 dark:bg-transparent border border-slate-200/70 dark:border-transparent rounded-xl p-2.5 sm:p-3.5 overflow-x-auto pb-4 pt-3">
          <div className="flex items-start justify-center gap-2.5 sm:gap-3.5 min-w-max px-1">
            {slots.map((slot) => {
              const isTarget = targetIndex === slot.index;
              const isProbingTarget = probingIndex === slot.index;
              const isCollided = collidedIndex === slot.index;

              return (
                <HashCell
                  key={slot.index}
                  slot={slot}
                  technique={technique}
                  isTarget={isTarget}
                  isProbingTarget={isProbingTarget}
                  isCollided={isCollided}
                  incomingKey={incomingKey}
                  onCellClick={onCellClick}
                  onDropKey={onDropKey}
                />
              );
            })}
          </div>
        </div>

        {/* Separate Chaining Visual Detailed Overview */}
        {isChaining && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-purple-500/15 font-sans">
            <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase font-mono">
              <LinkIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-purple-400" />
              <span>Linked Buckets Overview:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {slots
                .filter((s) => s.items.length > 0)
                .map((s) => (
                  <div
                    key={s.index}
                    className="flex items-center gap-2 p-2.5 bg-slate-50/80 dark:bg-black border border-slate-200 dark:border-purple-900/40 rounded-xl text-xs overflow-x-auto shadow-2xs"
                  >
                    <span className="font-bold text-white bg-indigo-600 dark:bg-[#0F1733] dark:border dark:border-purple-500/30 px-2 py-0.5 rounded-md shrink-0 font-mono shadow-xs">
                      [{s.index < 10 ? `0${s.index}` : s.index}]
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 shrink-0">:</span>
                    <div className="flex items-center gap-1.5 shrink-0 font-mono">
                      {s.items.map((item, idx) => (
                        <React.Fragment key={item.id || idx}>
                          {idx > 0 && <ArrowRight className="w-3 h-3 text-indigo-600 dark:text-purple-400 shrink-0" />}
                          <span className="px-2.5 py-0.5 bg-white dark:bg-black border border-indigo-200/80 dark:border-purple-500/30 rounded-md font-bold text-slate-900 dark:text-white shadow-2xs">
                            {item.value}
                          </span>
                        </React.Fragment>
                      ))}
                      <span className="text-slate-400 dark:text-slate-500 text-[10px] ml-1">→ NULL</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
