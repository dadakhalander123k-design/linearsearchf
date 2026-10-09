import React, { useState, useEffect } from 'react';
import {
  Award,
  BookOpen,
  Sparkles,
  Gamepad2,
  HelpCircle,
  ShieldAlert,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { pointsManager } from '../utils/pointsManager';
import { PointsBreakdown, PointsActivityEvent } from '../types/points';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const PointsView: React.FC = () => {
  useScrollReveal();
  const [breakdown, setBreakdown] = useState<PointsBreakdown>(() => pointsManager.getBreakdown());
  const [history, setHistory] = useState<PointsActivityEvent[]>(() => pointsManager.getHistory());

  useEffect(() => {
    const unsub = pointsManager.subscribe(() => {
      setBreakdown(pointsManager.getBreakdown());
      setHistory(pointsManager.getHistory());
    });
    return unsub;
  }, []);

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diffSec = Math.max(0, Math.floor((now - timestamp) / 1000));

    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;

    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const categoryRows = [
    {
      id: 'theory',
      label: `Theory (Max ${breakdown.maxTheory})`,
      score: breakdown.theoryScore,
      scoreText: `+${breakdown.theoryScore}`,
      icon: BookOpen,
      iconContainerClass:
        'bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-[#3B82F6] border-blue-100 dark:border-blue-500/20',
      isPenalty: false,
    },
    {
      id: 'visualize',
      label: `Visualization (Max ${breakdown.maxVisualize})`,
      score: breakdown.visualizeScore,
      scoreText: `+${breakdown.visualizeScore}`,
      icon: Sparkles,
      iconContainerClass:
        'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-500/20',
      isPenalty: false,
    },
    {
      id: 'game',
      label: `Games (Max ${breakdown.maxGame})`,
      score: breakdown.gameScore,
      scoreText: `+${breakdown.gameScore}`,
      icon: Gamepad2,
      iconContainerClass:
        'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20',
      isPenalty: false,
    },
    {
      id: 'quiz',
      label: `Quiz (Max ${breakdown.maxQuiz})`,
      score: breakdown.quizScore,
      scoreText:
        breakdown.quizScore > 0
          ? `+${breakdown.quizScore}`
          : breakdown.quizScore < 0
            ? `${breakdown.quizScore}`
            : '+0',
      icon: HelpCircle,
      iconContainerClass:
        'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-500/20',
      isPenalty: false,
    },
    {
      id: 'penalties',
      label: 'Penalties',
      score: breakdown.penaltiesTotal,
      scoreText: breakdown.penaltiesTotal > 0 ? `-${breakdown.penaltiesTotal}` : '0',
      icon: ShieldAlert,
      iconContainerClass:
        'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20',
      isPenalty: true,
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-page-enter font-sans select-none">
      {/* =========================================================================
          1. HEADER CARD (Matching Screenshot 1)
          ========================================================================= */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-blue-500/20 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            {/* Pill: CENTRAL POINTS SYSTEM */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] dark:bg-blue-950/60 border border-[#DBEAFE] dark:border-blue-500/30 text-[#2563EB] dark:text-[#3B82F6] text-[11px] font-bold font-mono uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>CENTRAL POINTS SYSTEM</span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-white tracking-tight">
              Points
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Overall score earned across Theory modules, Quiz challenges, Visualizations, and Game levels.
            </p>
          </div>

          {/* Right Card: Compact TOTAL POINTS Box */}
          <div className="w-full sm:w-auto shrink-0 bg-[#EFF6FF]/70 dark:bg-blue-950/30 border border-[#DBEAFE] dark:border-blue-500/30 rounded-2xl p-5 sm:p-6 text-center sm:text-right shadow-2xs min-w-[210px]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#3B82F6] font-mono">
              TOTAL POINTS
            </div>
            <div className="mt-1 flex items-baseline justify-center sm:justify-end gap-1 font-mono">
              <span className="text-4xl sm:text-5xl font-black text-[#0F172A] dark:text-white tracking-tight">
                {breakdown.totalPoints}
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-500 dark:text-slate-400">
                {' '}/ 100
              </span>
            </div>
            <div className="mt-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
              {breakdown.totalPoints} / 100 Points
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. TWO-COLUMN SECTION: BREAKDOWN & SCORING RULES (Matching Screenshot 2)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Points Breakdown Card */}
        <div className="lg:col-span-7 bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-blue-500/20 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header: Trending icon + Points Breakdown + Categorized */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-blue-500/15">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#EFF6FF] dark:bg-blue-950/50 text-[#2563EB] dark:text-[#3B82F6] border border-[#DBEAFE] dark:border-blue-500/30">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-[#0F172A] dark:text-white">
                  Points Breakdown
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                Categorized
              </span>
            </div>

            {/* Category Rows in exact order */}
            <div className="divide-y divide-slate-100 dark:divide-blue-500/10">
              {categoryRows.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.id}
                    className="py-3 flex items-center justify-between gap-3 text-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-xl border flex items-center justify-center shrink-0 ${cat.iconContainerClass}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {cat.label}
                      </span>
                    </div>

                    <span
                      className={`font-mono font-bold text-sm shrink-0 ${
                        (cat.isPenalty && cat.score > 0) || cat.score < 0
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-[#0F172A] dark:text-white'
                      }`}
                    >
                      {cat.scoreText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total Row: Stronger Divider, Bold Navy "Total", Bold Blue Score */}
          <div className="pt-4 border-t border-slate-200 dark:border-blue-500/25 flex items-center justify-between mt-1">
            <span className="text-base font-extrabold text-[#0F172A] dark:text-white">
              Total
            </span>
            <span className="text-base sm:text-lg font-black font-mono text-[#2563EB] dark:text-[#3B82F6]">
              {breakdown.totalPoints}
            </span>
          </div>
        </div>

        {/* Right Column: SCORING RULES Card */}
        <div className="lg:col-span-5 bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-blue-500/20 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header: Outlined Award Icon + SCORING RULES */}
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-blue-500/15">
              <div className="p-2 rounded-xl bg-[#EFF6FF] dark:bg-blue-950/50 text-[#2563EB] dark:text-[#3B82F6] border border-[#DBEAFE] dark:border-blue-500/30">
                <Award className="w-4 h-4" />
              </div>
              <span className="font-mono font-bold text-xs tracking-wider text-[#0F172A] dark:text-white uppercase">
                SCORING RULES
              </span>
            </div>

            {/* Rules list with thin separators */}
            <div className="divide-y divide-slate-100 dark:divide-blue-500/10 text-xs">
              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-slate-600 dark:text-slate-400">
                  Complete Theory module (12 × +2)
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                  +2 (max 24)
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-slate-600 dark:text-slate-400">
                  Complete Visualize module (2 × +3)
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                  +3 (max 6)
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-slate-600 dark:text-slate-400">
                  Complete Game level (5 × +10)
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                  +10 (max 50)
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-slate-600 dark:text-slate-400">
                  Quiz question correct
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                  +2
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-slate-600 dark:text-slate-400">
                  Quiz question incorrect
                </span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400 shrink-0">
                  -1
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-slate-600 dark:text-slate-400">
                  Quiz Category Cap
                </span>
                <span className="font-mono font-bold text-[#0F172A] dark:text-white shrink-0">
                  Max 20
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-slate-600 dark:text-slate-400">
                  Use Hint (per actual use)
                </span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400 shrink-0">
                  -2
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-slate-600 dark:text-slate-400">
                  Use Guided Solve (per actual use)
                </span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400 shrink-0">
                  -3
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-slate-600 dark:text-slate-400">
                  Total Score Scale
                </span>
                <span className="font-mono font-bold text-[#0F172A] dark:text-white shrink-0">
                  0 - 100 Points
                </span>
              </div>
            </div>
          </div>

          {/* Explanatory note at bottom */}
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-blue-500/15">
            Completion rewards are awarded once per unique module or level. Hints and Guided Solves deduct points for every actual use, including repeated uses in the same level. The total reflects all earned points and deductions.
          </p>
        </div>
      </div>

      {/* =========================================================================
          3. RECENT ACTIVITY CARD (Matching Screenshot 3)
          ========================================================================= */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-blue-500/20 rounded-3xl p-6 sm:p-7 shadow-xs">
        {/* Header: Clock Icon + Recent Activity + Event Count */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-blue-500/15">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#EFF6FF] dark:bg-blue-950/50 text-[#2563EB] dark:text-[#3B82F6] border border-[#DBEAFE] dark:border-blue-500/30">
              <Clock className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white">
              Recent Activity
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
            {history.length} {history.length === 1 ? 'event' : 'events'}
          </span>
        </div>

        {/* Activity Items */}
        {history.length === 0 ? (
          <div className="py-10 text-center text-slate-500 dark:text-slate-400 space-y-1">
            <p className="text-sm font-medium">No activity recorded yet.</p>
            <p className="text-xs">
              Complete Theory modules, watch videos, beat game levels, or answer quiz questions to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-3 mt-4">
            {history.map((evt) => {
              const isPositive = evt.pointsChange > 0;

              return (
                <div
                  key={evt.id}
                  className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 dark:bg-blue-950/20 border border-slate-200/70 dark:border-blue-500/15 flex items-center justify-between gap-3 text-xs sm:text-sm"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Left Points Badge */}
                    <div
                      className={`w-10 h-7 rounded-lg border font-mono font-bold text-xs flex items-center justify-center shrink-0 ${
                        isPositive
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isPositive ? `+${evt.pointsChange}` : evt.pointsChange}
                    </div>

                    {/* Middle: Event Description & Category Label */}
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white truncate">
                        {evt.description}
                      </div>
                      <div className="text-[10px] font-mono tracking-wider text-slate-400 uppercase mt-0.5">
                        {evt.categoryLabel}
                      </div>
                    </div>
                  </div>

                  {/* Right: Relative Timestamp */}
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500 shrink-0">
                    {formatTimestamp(evt.timestamp)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
