import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Trophy,
  BookOpen,
  Gamepad2,
  Layers,
  Video,
  Award,
  AlertTriangle,
  Flame,
  Check,
  Star,
  Circle,
  Clock,
  TrendingUp,
  Eye,
  Brain,
} from 'lucide-react';
import { progressManager } from '../utils/progressManager';
import { pointsManager } from '../utils/pointsManager';
import { PointsBreakdown, PointsState } from '../types/points';
import { ModuleRecord, ModuleStatus, UserProgressState, MainViewTab } from '../types/game';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { CompletionCelebrationModal } from './CompletionCelebrationModal';
import { ResetProgressModal } from './ResetProgressModal';
import { soundManager } from '../utils/audio';

interface MyProgressViewProps {
  onNavigateToTab: (tab: MainViewTab, levelId?: number, chapterId?: string) => void;
}

export const MyProgressView: React.FC<MyProgressViewProps> = ({ onNavigateToTab }) => {
  useScrollReveal();
  const [progressState, setProgressState] = useState<UserProgressState>(progressManager.getState());
  const [pointsBreakdown, setPointsBreakdown] = useState<PointsBreakdown>(() => pointsManager.getBreakdown());
  const [pointsState, setPointsState] = useState<PointsState>(() => pointsManager.getState());
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'FOUNDATION' | 'MECHANICS' | 'ANALYSIS' | 'PRACTICE'>('ALL');

  useEffect(() => {
    progressManager.checkAndCompleteCertification();
    const unsubscribeProgress = progressManager.subscribe((state) => {
      setProgressState(state);
    });
    const unsubscribePoints = pointsManager.subscribe((pState) => {
      setPointsBreakdown(pointsManager.getBreakdown());
      setPointsState(pState);
    });
    return () => {
      unsubscribeProgress();
      unsubscribePoints();
    };
  }, []);

  const stats = progressManager.getStats();
  const videoStats = progressManager.getVideoStats();
  const modules = progressManager.getModules();
  const is100Percent = stats.percentage === 100;

  const theoryPercent = pointsBreakdown.maxTheory > 0
    ? Math.min(100, Math.max(0, Math.round((pointsBreakdown.theoryScore / pointsBreakdown.maxTheory) * 100)))
    : 0;
  const visualizePercent = pointsBreakdown.maxVisualize > 0
    ? Math.min(100, Math.max(0, Math.round((pointsBreakdown.visualizeScore / pointsBreakdown.maxVisualize) * 100)))
    : 0;
  const gamePercent = pointsBreakdown.maxGame > 0
    ? Math.min(100, Math.max(0, Math.round((pointsBreakdown.gameScore / pointsBreakdown.maxGame) * 100)))
    : 0;
  const quizDisplayScore = pointsState.quizScore < 0 ? pointsState.quizScore : pointsBreakdown.quizScore;
  const quizPercent = pointsBreakdown.maxQuiz > 0
    ? Math.min(100, Math.max(0, Math.round((Math.max(0, quizDisplayScore) / pointsBreakdown.maxQuiz) * 100)))
    : 0;

  const categoryCards = [
    {
      id: 'visualize',
      label: 'Visualize',
      icon: Eye,
      iconContainerClass: 'bg-purple-500/10 text-purple-400 border-purple-500/25',
      score: `${pointsBreakdown.visualizeScore} / ${pointsBreakdown.maxVisualize}`,
      percent: visualizePercent,
      description: 'Complete visualizations & videos',
      onClick: () => {
        soundManager.playSelect();
        onNavigateToTab('VIDEO');
      },
    },
    {
      id: 'game',
      label: 'Game',
      icon: Gamepad2,
      iconContainerClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25',
      score: `${pointsBreakdown.gameScore} / ${pointsBreakdown.maxGame}`,
      percent: gamePercent,
      description: 'Complete game levels',
      onClick: () => {
        soundManager.playSelect();
        onNavigateToTab('GAME');
      },
    },
    {
      id: 'quiz',
      label: 'Quiz',
      icon: Brain,
      iconContainerClass: 'bg-blue-500/10 text-blue-400 border-blue-500/25',
      score: `${quizDisplayScore} / ${pointsBreakdown.maxQuiz}`,
      percent: quizPercent,
      description: 'Answer quiz questions',
      onClick: () => {
        soundManager.playSelect();
        onNavigateToTab('QUIZ');
      },
    },
  ];

  const filteredModules = activeFilter === 'ALL'
    ? modules
    : modules.filter((m) => m.category === activeFilter);

  const handleReset = () => {
    soundManager.playReset();
    progressManager.resetProgress();
    setShowResetConfirm(false);
  };

  const renderStatusBadge = (status: ModuleStatus) => {
    switch (status) {
      case 'MASTERED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>Mastered</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
            <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
            <span>Completed</span>
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#EFF6FF] dark:bg-blue-950/50 text-[#2563EB] dark:text-[#3B82F6] border border-[#DBEAFE] dark:border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-[#3B82F6] animate-pulse" />
            <span>In Progress</span>
          </span>
        );
      case 'NOT_STARTED':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full bg-slate-50 dark:bg-[#0F172A] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-blue-500/20">
            <Circle className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            <span>Not Started</span>
          </span>
        );
    }
  };

  const handleModuleClick = (module: ModuleRecord) => {
    soundManager.playSelect();
    progressManager.startModule(module.id);
    onNavigateToTab(module.targetTab, module.targetLevelId, module.targetChapterId);
  };

  const handleContinueNext = () => {
    soundManager.playPrimaryClick();
    if (stats.nextModule) {
      handleModuleClick(stats.nextModule);
    } else {
      onNavigateToTab('GAME', 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 font-sans text-slate-900 dark:text-white animate-page-enter pb-24">
      {/* Top Utility Header with Reset Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#2563EB] dark:text-[#3B82F6] bg-[#EFF6FF] dark:bg-blue-950/60 px-2.5 py-1 rounded-md border border-[#DBEAFE] dark:border-blue-500/30">
            Curriculum Progress Tracker
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Last synced: {new Date(progressState.lastActiveTimestamp).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* 1. Overall Completion Card - Exact Reference Layout */}
      <div className="bg-white dark:bg-[#0B132B]/80 border border-slate-200 dark:border-blue-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] mb-6 reveal-on-scroll">
        {/* Top Progress Header */}
        <div className="flex items-center gap-3.5 sm:gap-4 mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#9333EA] flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/25">
            <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight animate-heading-enter">
              Linear Search <span className="bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">Learning Progress</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Track your journey through Linear Search concepts, sequential scan algorithms, problem solving, complexity, and practical applications.
            </p>
          </div>
        </div>

        {/* Overall Completion Section */}
        <div className="pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
                  OVERALL COMPLETION
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 font-mono">
                  {stats.completed} of {stats.total} Modules
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Complete all learning activities to master Linear Search and earn 100 points.
              </p>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#2563EB] dark:text-[#3B82F6] font-sans self-end sm:self-auto">
              {stats.percentage}%
            </div>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-full h-3 overflow-hidden mt-3">
            <div
              className="bg-gradient-to-r from-blue-600 via-[#2563EB] to-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Linear Search Topic Score Card - Exact Reference Layout */}
      <div className="bg-white dark:bg-[#0B132B]/80 border border-slate-200 dark:border-blue-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] mb-8 reveal-on-scroll">
        {/* Header: Trophy + Linear Search Topic Score + Total Points Star Container */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#9333EA] flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/25">
              <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-white stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Linear Search Topic Score
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Earned points are calculated from completed, persisted activities.
              </p>
            </div>
          </div>

          {/* Right: Star Icon & Total Points Box */}
          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-100 dark:bg-[#060B17] border border-slate-200 dark:border-blue-500/20 flex items-center justify-center shrink-0 shadow-inner">
              <Star className="w-6 h-6 sm:w-7 sm:h-7 fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.7)]" />
            </div>
            <div className="text-right">
              <div className="flex items-baseline justify-end gap-1.5 leading-none font-mono">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] dark:text-[#3B82F6] font-sans">
                  {pointsBreakdown.totalPoints}
                </span>
                <span className="text-lg sm:text-xl font-bold text-slate-400 dark:text-slate-400">
                  / 100
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold font-mono tracking-wider text-slate-400 dark:text-slate-500 uppercase mt-1">
                TOTAL POINTS
              </div>
            </div>
          </div>
        </div>

        {/* 3 Category Cards in 1 Row on Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 mt-6">
          {categoryCards.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={cat.onClick}
                className={`bg-slate-50/80 dark:bg-[#070E1E]/80 border border-slate-200/90 dark:border-blue-500/20 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs transition-all duration-200 ${
                  cat.onClick ? 'cursor-pointer hover:border-blue-400 dark:hover:border-blue-500/40 hover:-translate-y-0.5' : ''
                }`}
              >
                <div>
                  {/* Top: Icon + Label + Score */}
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${cat.iconContainerClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {cat.label}
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight mt-0.5 font-sans">
                        {cat.score}
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Progress Bar + Percentage */}
                  <div className="flex items-center gap-2.5 mt-4">
                    <div className="flex-1 bg-slate-200 dark:bg-slate-800/80 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#2563EB] dark:bg-[#3B82F6] h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${cat.percent}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold font-mono text-[#2563EB] dark:text-[#3B82F6] shrink-0">
                      {cat.percent}%
                    </span>
                  </div>
                </div>

                {/* Bottom Description */}
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-3 pt-2">
                  {cat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 100% Completion Golden Banner if Completed */}
      {is100Percent && (
        <div
          id="progress-100-percent-banner"
          className="mb-8 p-5 bg-gradient-to-r from-[#EFF6FF] to-blue-100/60 dark:from-blue-950/50 dark:to-blue-900/40 border border-[#DBEAFE] dark:border-blue-500/30 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 animate-editorial-scale"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#2563EB] dark:bg-[#3B82F6] text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="text-xs font-bold font-mono text-[#2563EB] dark:text-[#3B82F6] uppercase tracking-wider">
                ★ Congratulations! 100% Curriculum Completed
              </div>
              <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                You Have Mastered All 12 Linear Search Modules & Activities
              </div>
            </div>
          </div>

          <button
            id="btn-open-certificate-from-progress"
            onClick={() => {
              soundManager.playModalOpen();
              setShowCertificateModal(true);
            }}
            className="btn-modern-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all"
          >
            <Award className="w-4 h-4" />
            <span>View Certificate</span>
          </button>
        </div>
      )}

      {/* Video Learning Lessons Progress Card */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-blue-500/25 rounded-2xl p-5 mb-8 shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] reveal-on-scroll">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#EFF6FF] dark:bg-blue-950/50 text-[#2563EB] dark:text-[#3B82F6] border border-[#DBEAFE] dark:border-blue-500/30">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                VIDEO LESSONS
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                2 VIDEOS ({videoStats.completed} / 2 Completed)
              </h4>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playNav();
              onNavigateToTab('VIDEO');
            }}
            className="text-xs font-semibold text-[#2563EB] dark:text-[#3B82F6] hover:text-[#1D4ED8] dark:hover:text-[#3B82F6] flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-colors"
          >
            <span>Open Video Section</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-blue-500/15">
          {/* Lesson 1 status */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-blue-500/20">
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
              Lesson 01: What is Linear Search?
            </span>
            {videoStats.isIntroCompleted ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Completed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <Circle className="w-3 h-3" /> Not completed
              </span>
            )}
          </div>

          {/* Lesson 2 status */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-blue-500/20">
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
              Lesson 02: How Does Linear Search Work?
            </span>
            {videoStats.isCollisionCompleted ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Completed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <Circle className="w-3 h-3" /> Not completed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-blue-500/20 pb-3 mb-6">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {(['ALL', 'FOUNDATION', 'MECHANICS', 'ANALYSIS', 'PRACTICE'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundManager.playTab();
                setActiveFilter(cat);
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeFilter === cat
                ? 'bg-[#2563EB] dark:bg-[#3B82F6] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-[#0F172A] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#172033]'
                }`}
            >
              {cat === 'ALL' ? 'All Modules' : cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Showing {filteredModules.length} of {modules.length} modules
        </div>
      </div>

      {/* Module Ledger Cards List */}
      <div className="space-y-3.5">
        {filteredModules.map((m, idx) => {
          const isDone = m.status === 'COMPLETED' || m.status === 'MASTERED';
          const isInProgress = m.status === 'IN_PROGRESS';
          const staggerClass = idx < 6 ? `stagger-${idx + 1}` : '';

          return (
            <div
              key={m.id}
              id={`progress-module-${m.id}`}
              className={`bg-white dark:bg-[#111827] border rounded-2xl p-5 sm:p-6 transition-all duration-200 shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] reveal-on-scroll ${staggerClass} ${isDone
                ? 'border-slate-200 dark:border-blue-500/20 hover:border-slate-300 dark:hover:border-blue-500/40'
                : isInProgress
                  ? 'border-[#DBEAFE] dark:border-blue-400/50 ring-1 ring-blue-200 dark:ring-blue-500/30'
                  : 'border-slate-200 dark:border-blue-500/20 hover:border-slate-300 dark:hover:border-blue-500/40'
                }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left metadata & title */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-blue-500/30 text-slate-700 dark:text-slate-300 rounded-md">
                      {m.code}
                    </span>
                    <span className="text-xs font-semibold text-[#2563EB] dark:text-[#3B82F6] uppercase font-mono">
                      {m.category}
                    </span>
                    {renderStatusBadge(m.status)}
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {m.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {m.description}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#0F172A] px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-blue-500/20 inline-block font-sans">
                    <span className="font-bold text-slate-700 dark:text-slate-200">Criteria:</span>
                    <span>{m.criteriaDescription}</span>
                  </div>
                </div>

                {/* Right Action & Progress Meter */}
                <div className="flex flex-col sm:items-end justify-between gap-3 shrink-0 sm:border-l sm:border-slate-100 dark:sm:border-blue-500/15 sm:pl-6">
                  <div className="w-full sm:w-36 text-right">
                    <div className="flex justify-between items-center text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">
                      <span>Progress</span>
                      <span className="text-slate-900 dark:text-white font-mono">{m.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${m.status === 'MASTERED'
                          ? 'bg-amber-500'
                          : m.status === 'COMPLETED'
                            ? 'bg-emerald-600'
                            : 'bg-[#2563EB] dark:bg-[#3B82F6]'
                          }`}
                        style={{ width: `${m.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <button
                    id={`btn-open-module-${m.id}`}
                    onClick={() => handleModuleClick(m)}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer transition-all ${isDone
                      ? 'btn-modern-secondary'
                      : 'btn-modern-primary'
                      }`}
                  >
                    <span>{isDone ? 'Review Module' : isInProgress ? 'Resume Activity' : 'Start Module'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Centered Confirmation Modal for Reset */}
      <ResetProgressModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleReset}
      />

      {/* 100% Completion Certificate Modal */}
      <CompletionCelebrationModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        onNavigateToLab={() => onNavigateToTab('LAB')}
        onNavigateToProgress={() => setShowCertificateModal(false)}
      />
    </div>
  );
};

export default MyProgressView;
