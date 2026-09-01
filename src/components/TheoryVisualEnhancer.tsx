import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowDown,
  Play,
  RotateCcw,
  Check,
  AlertTriangle,
  Zap,
  Cpu,
  Search,
  Layers,
  Sparkles,
  Copy,
  CheckCheck,
  Folder,
  Globe,
  Clock,
  TrendingUp,
  Code2,
  FileCode,
  Sliders,
  Scale,
  ListOrdered,
  HelpCircle,
  XCircle,
  CheckCircle2,
} from 'lucide-react';

interface TheoryVisualEnhancerProps {
  chapterId: string;
}

export const TheoryVisualEnhancer: React.FC<TheoryVisualEnhancerProps> = ({ chapterId }) => {
  // Module 01 interactive simulator
  const [m1CurrentIdx, setM1CurrentIdx] = useState<number>(0);
  const [m1Searching, setM1Searching] = useState<boolean>(false);
  const m1Array = [12, 7, 23, 9, 16, 4];
  const m1Target = 9;

  const runM1Simulation = () => {
    if (m1Searching) return;
    setM1Searching(true);
    setM1CurrentIdx(0);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setM1CurrentIdx(step);
      if (step >= 3 || m1Array[step] === m1Target) {
        clearInterval(interval);
        setM1Searching(false);
      }
    }, 600);
  };

  // Module 02 interactive simulator
  const [m2Step, setM2Step] = useState<number>(0);
  const m2Array = [29, 10, 14, 37, 13];
  const m2Target = 37;

  // Module 03 interactive step trace
  const [m3Step, setM3Step] = useState<number>(0);
  const m3Array = [12, 45, 78, 23, 56];
  const m3Target = 23;

  // Module 05 interactive complexity calculator
  const [m5Size, setM5Size] = useState<number>(100);

  // Module 11 interactive edge case selection
  const [m11Case, setM11Case] = useState<'empty' | 'single' | 'duplicates' | 'absent'>('duplicates');

  // =========================================================================
  // MODULE 01: WHAT IS LINEAR SEARCH?
  // =========================================================================
  if (chapterId === 'theory-01' || chapterId === 'what-is-hashing') {
    return (
      <div className="space-y-4 font-sans text-slate-900 dark:text-white animate-fadeIn">
        <div className="bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/20 rounded-2xl p-5 sm:p-6 shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-purple-500/15 pb-3 mb-4">
            <div className="text-xs font-bold uppercase text-indigo-600 dark:text-purple-400 tracking-wider flex items-center gap-1.5 font-mono">
              <Search className="w-4 h-4" />
              <span>Interactive Visual Array Search (Target = 9)</span>
            </div>
            <button
              onClick={runM1Simulation}
              disabled={m1Searching}
              className="px-3.5 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] dark:bg-purple-600 dark:hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{m1Searching ? 'Scanning...' : 'Run Simulation'}</span>
            </button>
          </div>

          {/* Array visualization */}
          <div className="flex flex-col items-center gap-3 py-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
              {m1Array.map((val, idx) => {
                const isInspecting = idx === m1CurrentIdx;
                const isPassed = idx < m1CurrentIdx;
                const isMatch = idx === 3 && m1CurrentIdx >= 3;

                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    {/* Status Badge */}
                    <span className="text-[10px] font-mono font-bold h-4 flex items-center">
                      {isMatch ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-0.5">
                          <Check className="w-3 h-3 stroke-[3]" /> FOUND
                        </span>
                      ) : isInspecting ? (
                        <span className="text-indigo-600 dark:text-purple-400 animate-pulse font-bold">
                          CHECKING
                        </span>
                      ) : isPassed ? (
                        <span className="text-slate-400 dark:text-slate-500">PASSED</span>
                      ) : (
                        <span className="text-transparent">—</span>
                      )}
                    </span>

                    {/* Array Cell */}
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center font-mono font-bold text-base transition-all duration-300 ${
                        isMatch
                          ? 'bg-[#DCFCE7] dark:bg-emerald-950/70 border-2 border-[#22C55E] dark:border-emerald-400 text-[#16A34A] dark:text-emerald-300 shadow-md scale-110'
                          : isInspecting
                          ? 'bg-indigo-50 dark:bg-purple-950/70 border-2 border-[#4F46E5] dark:border-purple-400 text-[#4F46E5] dark:text-purple-300 shadow-md scale-105 ring-2 ring-indigo-300/40'
                          : isPassed
                          ? 'bg-slate-100 dark:bg-[#080D1F] border border-slate-300 dark:border-purple-500/20 text-slate-400 dark:text-slate-500 opacity-60'
                          : 'bg-white dark:bg-[#0E152E] border-2 border-slate-200 dark:border-purple-500/30 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {val}
                    </div>

                    {/* Index Label */}
                    <span
                      className={`text-xs font-mono font-bold ${
                        isMatch
                          ? 'text-[#16A34A] dark:text-emerald-400 font-extrabold'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      [{idx}]
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Step info message */}
            <div className="mt-3 text-xs font-mono bg-slate-50 dark:bg-[#080D1F] border border-slate-200 dark:border-purple-500/20 p-3 rounded-xl w-full text-center">
              {m1CurrentIdx < 3 ? (
                <span className="text-slate-600 dark:text-slate-300">
                  Step {m1CurrentIdx + 1}: Inspecting index [{m1CurrentIdx}] (value {m1Array[m1CurrentIdx]}). {m1Array[m1CurrentIdx]} ≠ 9 → Advance to next slot.
                </span>
              ) : (
                <span className="text-emerald-700 dark:text-emerald-300 font-bold">
                  Step 4: Inspecting index [3] (value 9). 9 == 9 → MATCH FOUND! Returns index 3 (early exit).
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MODULE 02: HOW LINEAR SEARCH WORKS
  // =========================================================================
  if (chapterId === 'theory-02' || chapterId === 'hash-function') {
    return (
      <div className="space-y-4 font-sans text-slate-900 dark:text-white animate-fadeIn">
        <div className="bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/20 rounded-2xl p-5 sm:p-6 shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-purple-500/15 pb-3 mb-4">
            <div className="text-xs font-bold uppercase text-indigo-600 dark:text-purple-400 tracking-wider flex items-center gap-1.5 font-mono">
              <ListOrdered className="w-4 h-4" />
              <span>Step-by-Step Traversal on [29, 10, 14, 37, 13] (Target = 37)</span>
            </div>
            <button
              onClick={() => setM2Step((prev) => (prev < 3 ? prev + 1 : 0))}
              className="px-3.5 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] dark:bg-purple-600 dark:hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>{m2Step < 3 ? `Advance to Step ${m2Step + 2}` : 'Reset Simulation'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3 py-4 flex-wrap">
            {m2Array.map((val, idx) => {
              const isCurrent = idx === m2Step;
              const isDone = idx < m2Step;
              const isFound = idx === 3 && m2Step === 3;

              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <span className="text-[11px] font-mono font-bold h-4">
                    {isFound ? (
                      <span className="text-emerald-600 dark:text-emerald-400">FOUND</span>
                    ) : isCurrent ? (
                      <span className="text-indigo-600 dark:text-purple-400 animate-bounce">POINTER</span>
                    ) : isDone ? (
                      <span className="text-slate-400 dark:text-slate-500">MISMATCH</span>
                    ) : (
                      ''
                    )}
                  </span>
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center font-mono font-extrabold text-base border-2 transition-all ${
                      isFound
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-500 text-emerald-700 dark:text-emerald-300 scale-110 shadow-md'
                        : isCurrent
                        ? 'bg-indigo-50 dark:bg-purple-950/70 border-indigo-600 dark:border-purple-400 text-indigo-700 dark:text-purple-300 scale-105 shadow-md'
                        : 'bg-white dark:bg-[#0E152E] border-slate-200 dark:border-purple-500/30 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {val}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500">[{idx}]</span>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 dark:bg-[#080D1F] border border-slate-200 dark:border-purple-500/20 p-3.5 rounded-xl text-xs font-mono text-center">
            {m2Step === 0 && 'Step 1: Check arr[0] = 29 == 37 → False. Increment pointer i = 1.'}
            {m2Step === 1 && 'Step 2: Check arr[1] = 10 == 37 → False. Increment pointer i = 2.'}
            {m2Step === 2 && 'Step 3: Check arr[2] = 14 == 37 → False. Increment pointer i = 3.'}
            {m2Step === 3 && 'Step 4: Check arr[3] = 37 == 37 → True! Early exit and return index 3.'}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MODULE 03: DETAILED STEP-BY-STEP TRACE
  // =========================================================================
  if (chapterId === 'theory-03' || chapterId === 'hash-table') {
    return (
      <div className="space-y-4 font-sans text-slate-900 dark:text-white animate-fadeIn">
        <div className="bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/20 rounded-2xl p-5 sm:p-6 shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-purple-500/15 pb-3 mb-4">
            <span className="text-xs font-bold uppercase text-indigo-600 dark:text-purple-400 font-mono flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Step-by-Step Execution Matrix</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setM3Step((prev) => Math.max(0, prev - 1))}
                disabled={m3Step === 0}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold disabled:opacity-40 cursor-pointer"
              >
                Prev Step
              </button>
              <button
                onClick={() => setM3Step((prev) => Math.min(3, prev + 1))}
                disabled={m3Step === 3}
                className="px-3 py-1 bg-[#4F46E5] dark:bg-purple-600 text-white rounded-lg text-xs font-semibold disabled:opacity-40 cursor-pointer"
              >
                Next Step
              </button>
              <button
                onClick={() => setM3Step(0)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Trace Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-purple-500/20 text-slate-500 dark:text-slate-400">
                  <th className="py-2 px-3">Step</th>
                  <th className="py-2 px-3">Index (i)</th>
                  <th className="py-2 px-3">Element Value</th>
                  <th className="py-2 px-3">Target Key</th>
                  <th className="py-2 px-3">Comparison</th>
                  <th className="py-2 px-3">Result & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-purple-500/10">
                {[
                  { step: 1, idx: 0, val: 12, comp: '12 == 23', res: 'Mismatch → Advance i', match: false },
                  { step: 2, idx: 1, val: 45, comp: '45 == 23', res: 'Mismatch → Advance i', match: false },
                  { step: 3, idx: 2, val: 78, comp: '78 == 23', res: 'Mismatch → Advance i', match: false },
                  { step: 4, idx: 3, val: 23, comp: '23 == 23', res: 'MATCH FOUND → Return 3', match: true },
                ].map((row, rIdx) => {
                  const isActive = m3Step === rIdx;
                  return (
                    <tr
                      key={rIdx}
                      className={`transition-colors ${
                        isActive
                          ? row.match
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 font-bold text-emerald-800 dark:text-emerald-300'
                            : 'bg-indigo-50 dark:bg-purple-950/50 font-bold text-indigo-900 dark:text-purple-300'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <td className="py-2.5 px-3">Step {row.step}</td>
                      <td className="py-2.5 px-3">i = {row.idx}</td>
                      <td className="py-2.5 px-3">arr[{row.idx}] = {row.val}</td>
                      <td className="py-2.5 px-3">23</td>
                      <td className="py-2.5 px-3">{row.comp}</td>
                      <td className="py-2.5 px-3">
                        <span className={row.match ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                          {row.res}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MODULE 05: TIME COMPLEXITY SIMULATOR
  // =========================================================================
  if (chapterId === 'theory-05' || chapterId === 'what-is-a-collision') {
    return (
      <div className="space-y-4 font-sans text-slate-900 dark:text-white animate-fadeIn">
        <div className="bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/20 rounded-2xl p-5 sm:p-6 shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-purple-500/15 pb-3 mb-4">
            <span className="text-xs font-bold uppercase text-indigo-600 dark:text-purple-400 font-mono flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>Interactive Time Complexity Simulator</span>
            </span>
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-purple-400">
              n = {m5Size.toLocaleString()} elements
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300 block mb-1">
                Adjust Dataset Size (n):
              </label>
              <input
                type="range"
                min="10"
                max="1000000"
                step="50"
                value={m5Size}
                onChange={(e) => setM5Size(Number(e.target.value))}
                className="w-full accent-indigo-600 dark:accent-purple-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              {/* Best Case */}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 block font-mono">
                  Best Case (O(1))
                </span>
                <span className="text-xl font-black text-emerald-800 dark:text-emerald-300 font-mono">
                  1 comparison
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                  Target found at index [0]
                </span>
              </div>

              {/* Average Case */}
              <div className="p-4 bg-indigo-50 dark:bg-purple-950/40 border border-indigo-200 dark:border-purple-500/30 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-purple-300 block font-mono">
                  Average Case (O(n))
                </span>
                <span className="text-xl font-black text-indigo-800 dark:text-cyan-300 font-mono">
                  {((m5Size + 1) / 2).toLocaleString()} comparisons
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                  (n + 1) / 2 comparisons
                </span>
              </div>

              {/* Worst Case */}
              <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-300 block font-mono">
                  Worst Case (O(n))
                </span>
                <span className="text-xl font-black text-rose-800 dark:text-rose-300 font-mono">
                  {m5Size.toLocaleString()} comparisons
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                  Target at [n-1] or absent
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MODULE 11: EDGE CASES INTERACTIVE EXPLORER
  // =========================================================================
  if (chapterId === 'theory-11' || chapterId === 'core-advantages') {
    return (
      <div className="space-y-4 font-sans text-slate-900 dark:text-white animate-fadeIn">
        <div className="bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/20 rounded-2xl p-5 sm:p-6 shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="text-xs font-bold uppercase text-indigo-600 dark:text-purple-400 font-mono mb-4 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>Interactive Edge Cases Behavior Explorer</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setM11Case('empty')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                m11Case === 'empty'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-[#080D1F] text-slate-700 dark:text-slate-300'
              }`}
            >
              Empty Array (n = 0)
            </button>
            <button
              onClick={() => setM11Case('single')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                m11Case === 'single'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-[#080D1F] text-slate-700 dark:text-slate-300'
              }`}
            >
              Single Item (n = 1)
            </button>
            <button
              onClick={() => setM11Case('duplicates')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                m11Case === 'duplicates'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-[#080D1F] text-slate-700 dark:text-slate-300'
              }`}
            >
              Duplicate Keys
            </button>
            <button
              onClick={() => setM11Case('absent')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                m11Case === 'absent'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-[#080D1F] text-slate-700 dark:text-slate-300'
              }`}
            >
              Absent Key
            </button>
          </div>

          {/* Case Detail Card */}
          <div className="p-4 bg-slate-50 dark:bg-[#080D1F] border border-slate-200 dark:border-purple-500/20 rounded-xl space-y-2 text-xs font-mono">
            {m11Case === 'empty' && (
              <>
                <div className="font-bold text-indigo-600 dark:text-purple-400">Input: arr = [], target = 5, n = 0</div>
                <div className="text-slate-700 dark:text-slate-300">
                  Execution: Loop condition (0 &lt; 0) is false on entry. Loop terminates immediately without any memory reads.
                </div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">Return: -1 (Safe exit, zero exceptions)</div>
              </>
            )}
            {m11Case === 'single' && (
              <>
                <div className="font-bold text-indigo-600 dark:text-purple-400">Input: arr = [9], target = 9, n = 1</div>
                <div className="text-slate-700 dark:text-slate-300">
                  Execution: Performs exactly 1 comparison (arr[0] == 9). Match found immediately.
                </div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">Return: 0 (Instant O(1) response)</div>
              </>
            )}
            {m11Case === 'duplicates' && (
              <>
                <div className="font-bold text-indigo-600 dark:text-purple-400">Input: arr = [4, 7, 4, 9, 4], target = 4</div>
                <div className="text-slate-700 dark:text-slate-300">
                  Standard Mode: Returns first occurrence index [0]. Multi-Match Mode: Collects indices [0, 2, 4].
                </div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">Return: Index 0 (First match guarantee)</div>
              </>
            )}
            {m11Case === 'absent' && (
              <>
                <div className="font-bold text-indigo-600 dark:text-purple-400">Input: arr = [10, 20, 30], target = 99</div>
                <div className="text-slate-700 dark:text-slate-300">
                  Execution: Evaluates index 0, index 1, index 2. None equal 99. Loop boundary (3 &lt; 3) triggers loop exit.
                </div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">Return: -1 (Target not found)</div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MODULE 12: LINEAR VS BINARY COMPARISON TABLE
  // =========================================================================
  if (chapterId === 'theory-12' || chapterId === 'limitations-tradeoffs') {
    return (
      <div className="space-y-4 font-sans text-slate-900 dark:text-white animate-fadeIn">
        <div className="bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/20 rounded-2xl p-5 sm:p-6 shadow-xs dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="text-xs font-bold uppercase text-indigo-600 dark:text-purple-400 font-mono mb-4 flex items-center gap-1.5">
            <Scale className="w-4 h-4" />
            <span>Head-to-Head Comparison: Linear Search vs. Binary Search</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-purple-500/20 text-slate-500 dark:text-slate-400">
                  <th className="py-2 px-3">Feature / Metric</th>
                  <th className="py-2 px-3 text-indigo-600 dark:text-purple-400 font-bold">Linear Search</th>
                  <th className="py-2 px-3 text-cyan-600 dark:text-cyan-400 font-bold">Binary Search</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-purple-500/10 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-2.5 px-3 font-semibold">Worst-Case Time</td>
                  <td className="py-2.5 px-3 text-rose-600 dark:text-rose-400 font-bold">O(n) (Linear)</td>
                  <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">O(log n) (Logarithmic)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold">Data Prerequisite</td>
                  <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">None (Unsorted, Duplicates)</td>
                  <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400 font-bold">Strictly Sorted Array Required</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold">Data Structures</td>
                  <td className="py-2.5 px-3">Arrays, Linked Lists, Streams, Files</td>
                  <td className="py-2.5 px-3">Arrays (Requires O(1) random index access)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold">Auxiliary Space</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">O(1) Extra Memory</td>
                  <td className="py-2.5 px-3 font-bold">O(1) Iterative / O(log n) Recursive</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold">Best Used For</td>
                  <td className="py-2.5 px-3">Small or unsorted datasets, single searches</td>
                  <td className="py-2.5 px-3">Large sorted datasets with frequent queries</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
