import React from 'react';
import {
  ArrowRight,
  Target,
  Puzzle,
  Lightbulb,
  BookOpen,
  Star,
  Search,
  Key,
  List,
  Check,
  Flag,
  Clock,
  TrendingUp,
  Code2,
  Zap,
  Folder,
  Globe,
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { useScrollReveal } from '../hooks/useScrollReveal';

export interface HomePageProps {
  onContinueLearning: () => void;
  onExploreTopics: () => void;
  onNavigateToTab: (
    tab: 'THEORY' | 'VIDEO' | 'GAME' | 'QUEST' | 'LAB' | 'QUIZ' | 'PROGRESS',
    targetOption?: string | number
  ) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onExploreTopics,
  onNavigateToTab,
}) => {
  // Hook for smooth reveal animation on scroll
  useScrollReveal();

  const handleStartLearning = () => {
    soundManager.playPrimaryClick();
    onExploreTopics();
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 sm:gap-7 font-sans text-slate-900 dark:text-slate-100 animate-page-enter pb-10 select-text">
      {/* =========================================================================
          SECTION 01: HERO SECTION & LINEAR SEARCH DIAGRAM
          ========================================================================= */}
      <section className="reveal-on-scroll bg-white dark:bg-[#111827] p-6 sm:p-10 rounded-2xl border border-slate-200/90 dark:border-blue-500/20 shadow-xs dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Side: Curriculum Label, Main Heading, & Educational Description */}
          <div className="lg:col-span-6 flex flex-col gap-3.5">
            {/* Small Curriculum Label */}
            <div className="flex items-center">
              <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-[#2563EB] dark:text-[#3B82F6] uppercase">
                THEORY CURRICULUM &nbsp;•&nbsp; MODULE 01 &nbsp;•&nbsp; CHAPTER 01
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-[1.12]">
              Linear Search<br />
              <span>Fundamentals</span>
            </h1>

            {/* Educational Description */}
            <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
              Learn how linear search works by checking each element one by one until the target is found or
              the list ends.
            </p>
          </div>

          {/* Right Side: Visual Linear Search Illustration */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center lg:items-end">
            <div className="relative flex flex-col items-center max-w-full">
              {/* Top Search Icon and Connector Arrow */}
              <div className="relative w-full flex justify-end pr-8 sm:pr-10 mb-1">
                {/* Search Magnifying Glass Icon Badge - Styled directly after reference squircle */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#6366F1] text-white flex items-center justify-center shadow-md shrink-0 z-10">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.4] text-white drop-shadow-xs" />
                </div>

                {/* Connector Line pointing downward to target element (9 at index 3) */}
                <div className="absolute top-6 right-[60px] sm:right-[68px] w-36 sm:w-44 h-12 pointer-events-none z-0">
                  <svg className="w-full h-full" viewBox="0 0 160 48" fill="none">
                    <path
                      d="M 150 0 C 130 0, 10 0, 10 32"
                      stroke="#4F46E5"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      strokeLinecap="round"
                      className="dark:stroke-[#3B82F6]"
                    />
                    {/* Downward Arrowhead pointing directly at index 3 cell */}
                    <path
                      d="M 5 28 L 10 38 L 15 28"
                      stroke="#2563EB"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="dark:stroke-[#3B82F6]"
                    />
                  </svg>
                </div>
              </div>

              {/* Horizontal Array Cells (12, 7, 23, 9, 16, 4) */}
              <div className="flex items-center gap-2 sm:gap-2.5 pt-1">
                {/* Cell 0: 12 */}
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-white dark:bg-[#172033] border-2 border-[#DBEAFE] dark:border-blue-500/40 flex items-center justify-center shadow-xs">
                  <span className="font-mono font-bold text-sm sm:text-base text-[#2563EB] dark:text-[#3B82F6]">12</span>
                </div>

                {/* Cell 1: 7 */}
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-white dark:bg-[#172033] border-2 border-[#DBEAFE] dark:border-blue-500/40 flex items-center justify-center shadow-xs">
                  <span className="font-mono font-bold text-sm sm:text-base text-[#2563EB] dark:text-[#3B82F6]">7</span>
                </div>

                {/* Cell 2: 23 */}
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-white dark:bg-[#172033] border-2 border-[#DBEAFE] dark:border-blue-500/40 flex items-center justify-center shadow-xs">
                  <span className="font-mono font-bold text-sm sm:text-base text-[#2563EB] dark:text-[#3B82F6]">23</span>
                </div>

                {/* Cell 3: 9 (TARGET MATCH - Highlighted in Green) */}
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-[#DCFCE7] dark:bg-emerald-950/60 border-2 border-[#4ADE80] dark:border-emerald-500 flex items-center justify-center shadow-sm ring-2 ring-emerald-400/20 dark:ring-emerald-500/20">
                  <span className="font-mono font-extrabold text-sm sm:text-base text-[#16A34A] dark:text-emerald-400">9</span>
                </div>

                {/* Cell 4: 16 */}
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-white dark:bg-[#172033] border-2 border-[#DBEAFE] dark:border-blue-500/40 flex items-center justify-center shadow-xs">
                  <span className="font-mono font-bold text-sm sm:text-base text-[#2563EB] dark:text-[#3B82F6]">16</span>
                </div>

                {/* Cell 5: 4 */}
                <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-white dark:bg-[#172033] border-2 border-[#DBEAFE] dark:border-blue-500/40 flex items-center justify-center shadow-xs">
                  <span className="font-mono font-bold text-sm sm:text-base text-[#2563EB] dark:text-[#3B82F6]">4</span>
                </div>
              </div>

              {/* Index Labels Underneath (0, 1, 2, 3, 4, 5) */}
              <div className="flex items-center gap-2 sm:gap-2.5 mt-2.5">
                <span className="w-11 sm:w-13 text-center font-mono text-xs sm:text-sm font-bold text-[#0F172A] dark:text-slate-300">0</span>
                <span className="w-11 sm:w-13 text-center font-mono text-xs sm:text-sm font-bold text-[#0F172A] dark:text-slate-300">1</span>
                <span className="w-11 sm:w-13 text-center font-mono text-xs sm:text-sm font-bold text-[#0F172A] dark:text-slate-300">2</span>
                <span className="w-11 sm:w-13 text-center font-mono text-xs sm:text-sm font-bold text-[#16A34A] dark:text-emerald-400">3</span>
                <span className="w-11 sm:w-13 text-center font-mono text-xs sm:text-sm font-bold text-[#0F172A] dark:text-slate-300">4</span>
                <span className="w-11 sm:w-13 text-center font-mono text-xs sm:text-sm font-bold text-[#0F172A] dark:text-slate-300">5</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            HERO INFORMATION CARDS (3 Cards)
            ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-blue-500/15">
          {/* Card 1: Core Idea */}
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-blue-500/20 rounded-2xl p-4.5 flex items-start gap-3.5 shadow-2xs hover:border-[#2563EB] dark:hover:border-blue-500/40 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-[#EFF6FF] dark:bg-blue-950/70 border border-[#DBEAFE] dark:border-blue-500/30 flex items-center justify-center text-[#2563EB] dark:text-[#3B82F6] shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">Core Idea</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Check each element sequentially until the target is found.
              </p>
            </div>
          </div>

          {/* Card 2: Key Formula */}
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-blue-500/20 rounded-2xl p-4.5 flex items-start gap-3.5 shadow-2xs hover:border-[#2563EB] dark:hover:border-blue-500/40 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-[#EFF6FF] dark:bg-blue-950/70 border border-[#DBEAFE] dark:border-blue-500/30 flex items-center justify-center text-[#2563EB] dark:text-[#3B82F6] shrink-0 font-serif font-bold text-xl">
              <span>Σ</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">Key Formula</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Compare each element with target in order.
              </p>
            </div>
          </div>

          {/* Card 3: Main Challenge */}
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-blue-500/20 rounded-2xl p-4.5 flex items-start gap-3.5 shadow-2xs hover:border-[#2563EB] dark:hover:border-blue-500/40 transition-all">
            <div className="w-11 h-11 rounded-2xl bg-[#EFF6FF] dark:bg-blue-950/70 border border-[#DBEAFE] dark:border-blue-500/30 flex items-center justify-center text-[#2563EB] dark:text-[#3B82F6] shrink-0">
              <Puzzle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F172A] dark:text-white">Main Challenge</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Linear time complexity for large datasets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02: 1. THE MAIN IDEA
          ========================================================================= */}
      <section className="reveal-on-scroll bg-white dark:bg-[#111827] p-6 sm:p-9 rounded-2xl border border-slate-200/90 dark:border-blue-500/20 shadow-xs dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
        {/* Section Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-full bg-[#EFF6FF] dark:bg-blue-950/70 border border-[#DBEAFE] dark:border-blue-500/30 flex items-center justify-center text-[#2563EB] dark:text-[#3B82F6]">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] dark:text-white">
            1. The Main Idea
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Question & Explanation */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            <h3 className="text-base sm:text-lg font-bold text-[#2563EB] dark:text-[#3B82F6] leading-snug">
              How does linear<br />
              search work?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We start from the first element and compare each item with the target until we find a match or
              reach the end.
            </p>
          </div>

          {/* Right Column: 4-Step Process Diagram */}
          <div className="lg:col-span-8 bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200/80 dark:border-blue-500/20 rounded-2xl p-5 sm:p-6">
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 items-start sm:flex sm:flex-nowrap sm:items-center sm:justify-between sm:gap-2">
              {/* Step 1: Start */}
              <div className="flex flex-col items-center text-center w-full sm:w-auto sm:flex-1 sm:min-w-[85px]">
                <div className="w-13 h-13 rounded-full bg-white dark:bg-[#172033] border border-[#DBEAFE] dark:border-blue-500/30 text-[#2563EB] dark:text-[#3B82F6] flex items-center justify-center shadow-xs mb-2.5 shrink-0">
                  <Key className="w-6 h-6 text-[#2563EB] dark:text-[#3B82F6] -rotate-45" />
                </div>
                <span className="text-sm font-bold text-[#0F172A] dark:text-white">Start</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Begin from the first element</span>
              </div>

              {/* Arrow 1 */}
              <ArrowRight className="w-4 h-4 text-[#4F46E5] dark:text-[#6366F1] shrink-0 hidden sm:block" />

              {/* Step 2: Compare */}
              <div className="flex flex-col items-center text-center w-full sm:w-auto sm:flex-1 sm:min-w-[85px]">
                <div className="w-13 h-13 rounded-full bg-white dark:bg-[#172033] border border-[#DBEAFE] dark:border-blue-500/30 text-[#2563EB] dark:text-[#3B82F6] flex items-center justify-center shadow-xs mb-2.5 shrink-0">
                  <List className="w-6 h-6 text-[#2563EB] dark:text-[#3B82F6]" />
                </div>
                <span className="text-sm font-bold text-[#0F172A] dark:text-white">Compare</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Check current element</span>
              </div>

              {/* Arrow 2 */}
              <ArrowRight className="w-4 h-4 text-[#4F46E5] dark:text-[#6366F1] shrink-0 hidden sm:block" />

              {/* Step 3: Match? */}
              <div className="flex flex-col items-center text-center w-full sm:w-auto sm:flex-1 sm:min-w-[85px]">
                <div className="w-13 h-13 rounded-full bg-white dark:bg-[#172033] border-2 border-[#4ADE80] dark:border-emerald-500 text-[#16A34A] dark:text-emerald-400 flex items-center justify-center shadow-xs mb-2.5 shrink-0">
                  <Check className="w-6 h-6 text-[#16A34A] dark:text-emerald-400 stroke-[2.5]" />
                </div>
                <span className="text-sm font-bold text-[#0F172A] dark:text-white">Match?</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Is element equal to target?</span>
              </div>

              {/* Arrow 3 */}
              <ArrowRight className="w-4 h-4 text-[#4F46E5] dark:text-[#6366F1] shrink-0 hidden sm:block" />

              {/* Step 4: Result */}
              <div className="flex flex-col items-center text-center w-full sm:w-auto sm:flex-1 sm:min-w-[85px]">
                <div className="w-13 h-13 rounded-full bg-white dark:bg-[#172033] border border-[#DBEAFE] dark:border-blue-500/30 text-[#2563EB] dark:text-[#3B82F6] flex items-center justify-center shadow-xs mb-2.5 shrink-0">
                  <Flag className="w-5 h-5 fill-[#2563EB] text-[#2563EB] dark:fill-[#3B82F6] dark:text-[#3B82F6]" />
                </div>
                <span className="text-sm font-bold text-[#0F172A] dark:text-white">Result</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Found = return index, else -1</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 03: 2. CONCEPT ROADMAP
          ========================================================================= */}
      <section className="reveal-on-scroll bg-white dark:bg-[#111827] p-6 sm:p-9 rounded-2xl border border-slate-200/90 dark:border-blue-500/20 shadow-xs dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
        {/* Section Header */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-full bg-[#EFF6FF] dark:bg-blue-950/70 border border-[#DBEAFE] dark:border-blue-500/30 flex items-center justify-center text-[#2563EB] dark:text-[#3B82F6]">
            <BookOpen className="w-4 h-4" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] dark:text-white">
            2. Concept Roadmap
          </h2>
        </div>

        {/* 5-Stage Progression */}
        <div className="relative">
          {/* Connected Dashed Line Across the 5 Steps (desktop) */}
          <div className="hidden md:block absolute top-5 left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-[#DBEAFE] dark:border-blue-500/30 z-0" />

          <div className="flex flex-col items-center md:grid md:grid-cols-5 md:gap-4 md:items-start relative z-10">
            {/* Stage 01: What is Linear Search? */}
            <div
              onClick={() => {
                soundManager.playSelect();
                onNavigateToTab('THEORY', 'theory-01');
              }}
              className="flex flex-col items-center text-center group cursor-pointer w-full max-w-[220px] md:max-w-none"
            >
              <div className="w-10 h-10 rounded-full bg-[#DBEAFE] dark:bg-blue-950 text-[#1D4ED8] dark:text-[#3B82F6] border-2 border-white dark:border-[#111827] shadow-xs flex items-center justify-center font-mono font-extrabold text-xs mb-3 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                01
              </div>
              <div className="w-12 h-12 rounded-full bg-[#EFF6FF] dark:bg-[#172033] border border-[#DBEAFE] dark:border-blue-500/30 flex items-center justify-center text-[#2563EB] dark:text-[#3B82F6] mb-2.5 shadow-2xs group-hover:border-[#2563EB] transition-all">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white leading-snug">
                What is Linear <br className="hidden md:inline" /> Search?
              </h3>
            </div>

            {/* Mobile Connector Line: 01 -> 02 */}
            <div className="md:hidden w-0.5 h-6 border-l-2 border-dashed border-[#DBEAFE] dark:border-blue-500/40 my-2" />

            {/* Stage 02: Search Algorithm */}
            <div
              onClick={() => {
                soundManager.playSelect();
                onNavigateToTab('THEORY', 'theory-02');
              }}
              className="flex flex-col items-center text-center group cursor-pointer w-full max-w-[220px] md:max-w-none"
            >
              <div className="w-10 h-10 rounded-full bg-[#DBEAFE] dark:bg-blue-950 text-[#1D4ED8] dark:text-[#3B82F6] border-2 border-white dark:border-[#111827] shadow-xs flex items-center justify-center font-mono font-extrabold text-xs mb-3 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                02
              </div>
              <div className="w-12 h-12 rounded-full bg-[#EFF6FF] dark:bg-[#172033] border border-[#DBEAFE] dark:border-blue-500/30 flex items-center justify-center text-[#2563EB] dark:text-[#3B82F6] mb-2.5 shadow-2xs group-hover:border-[#2563EB] transition-all">
                <List className="w-5 h-5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white leading-snug">
                Search <br className="hidden md:inline" /> Algorithm
              </h3>
            </div>

            {/* Mobile Connector Line: 02 -> 03 */}
            <div className="md:hidden w-0.5 h-6 border-l-2 border-dashed border-[#DBEAFE] dark:border-blue-500/40 my-2" />

            {/* Stage 03: Time Complexity */}
            <div
              onClick={() => {
                soundManager.playSelect();
                onNavigateToTab('THEORY', 'theory-05');
              }}
              className="flex flex-col items-center text-center group cursor-pointer w-full max-w-[220px] md:max-w-none"
            >
              <div className="w-10 h-10 rounded-full bg-[#DBEAFE] dark:bg-blue-950 text-[#1D4ED8] dark:text-[#3B82F6] border-2 border-white dark:border-[#111827] shadow-xs flex items-center justify-center font-mono font-extrabold text-xs mb-3 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                03
              </div>
              <div className="w-12 h-12 rounded-full bg-[#EFF6FF] dark:bg-[#172033] border border-[#DBEAFE] dark:border-blue-500/30 flex items-center justify-center text-[#2563EB] dark:text-[#3B82F6] mb-2.5 shadow-2xs group-hover:border-[#2563EB] transition-all">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white leading-snug">
                Time <br className="hidden md:inline" /> Complexity
              </h3>
            </div>

            {/* Mobile Connector Line: 03 -> 04 */}
            <div className="md:hidden w-0.5 h-6 border-l-2 border-dashed border-[#DBEAFE] dark:border-blue-500/40 my-2" />

            {/* Stage 04: Best, Worst & Average Case */}
            <div
              onClick={() => {
                soundManager.playSelect();
                onNavigateToTab('THEORY', 'theory-05');
              }}
              className="flex flex-col items-center text-center group cursor-pointer w-full max-w-[220px] md:max-w-none"
            >
              <div className="w-10 h-10 rounded-full bg-[#DBEAFE] dark:bg-blue-950 text-[#1D4ED8] dark:text-[#3B82F6] border-2 border-white dark:border-[#111827] shadow-xs flex items-center justify-center font-mono font-extrabold text-xs mb-3 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                04
              </div>
              <div className="w-12 h-12 rounded-full bg-[#EFF6FF] dark:bg-[#172033] border border-[#DBEAFE] dark:border-blue-500/30 flex items-center justify-center text-[#2563EB] dark:text-[#3B82F6] mb-2.5 shadow-2xs group-hover:border-[#2563EB] transition-all">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white leading-snug">
                Best, Worst &amp; <br className="hidden md:inline" /> Average Case
              </h3>
            </div>

            {/* Mobile Connector Line: 04 -> 05 */}
            <div className="md:hidden w-0.5 h-6 border-l-2 border-dashed border-[#DBEAFE] dark:border-blue-500/40 my-2" />

            {/* Stage 05: Implementation Examples */}
            <div
              onClick={() => {
                soundManager.playSelect();
                onNavigateToTab('THEORY', 'theory-07');
              }}
              className="flex flex-col items-center text-center group cursor-pointer w-full max-w-[220px] md:max-w-none"
            >
              <div className="w-10 h-10 rounded-full bg-[#DBEAFE] dark:bg-blue-950 text-[#1D4ED8] dark:text-[#3B82F6] border-2 border-white dark:border-[#111827] shadow-xs flex items-center justify-center font-mono font-extrabold text-xs mb-3 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                05
              </div>
              <div className="w-12 h-12 rounded-full bg-[#EFF6FF] dark:bg-[#172033] border border-[#DBEAFE] dark:border-blue-500/30 flex items-center justify-center text-[#6366F1] dark:text-[#7C5CFC] mb-2.5 shadow-2xs group-hover:border-[#6366F1] transition-all">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white leading-snug">
                Implementation <br className="hidden md:inline" /> Examples
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 04: 3. WHY THIS TOPIC MATTERS
          ========================================================================= */}
      <section className="reveal-on-scroll bg-white dark:bg-[#111827] p-6 sm:p-9 rounded-2xl border border-slate-200/90 dark:border-blue-500/20 shadow-xs dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
        {/* Section Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-full bg-[#EFF6FF] dark:bg-blue-950/70 border border-[#DBEAFE] dark:border-blue-500/30 flex items-center justify-center text-[#2563EB] dark:text-[#3B82F6]">
            <Star className="w-4 h-4" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] dark:text-white">
            3. Why This Topic Matters
          </h2>
        </div>

        {/* 3 Value Cards Matching Exact Reference */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Simple & Easy (Subtle Purple Tint) */}
          <div className="bg-[#FAF8FF] dark:bg-[#172033] border border-[#EDE9FE] dark:border-blue-500/25 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-2xs">
            <div className="w-11 h-11 rounded-full bg-[#6366F1] text-white flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white mb-1.5">Simple &amp; Easy</h3>
              <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Easy to understand and implement for small datasets.
              </p>
            </div>
          </div>

          {/* Card 2: No Extra Space (Light mode green tint) */}
          <div className="bg-[#F0FDF4] dark:bg-[#172033] border border-[#DCFCE7] dark:border-blue-500/25 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-2xs">
            <div className="w-11 h-11 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-xs">
              <Folder className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white mb-1.5">No Extra Space</h3>
              <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Does not require any additional memory or data structures.
              </p>
            </div>
          </div>

          {/* Card 3: Real-World Use (Subtle Royal-Blue/Violet Tint) */}
          <div className="bg-[#EFF6FF] dark:bg-[#172033] border border-[#DBEAFE] dark:border-blue-500/25 rounded-2xl p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-2xs">
            <div className="w-11 h-11 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-xs">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white mb-1.5">Real-World Use</h3>
              <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Used in small lists, unsorted data, and quick lookups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 05: 4. READY TO START?
          ========================================================================= */}
      <section className="reveal-on-scroll bg-gradient-to-r from-[#EFF6FF] via-[#F8FAFF] to-[#EFF6FF] dark:from-[#111827] dark:via-[#172033] dark:to-[#111827] border border-[#DBEAFE] dark:border-blue-500/30 p-6 sm:p-8 rounded-2xl shadow-xs dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Side: Educational Rocket Visual & Supporting Text */}
          <div className="flex items-center gap-5 sm:gap-6">
            {/* 3D Diagonal Rocket Illustration matching exact Reference Image (Static) */}
            <div className="w-18 h-18 sm:w-22 sm:h-22 shrink-0 flex items-center justify-center relative select-none">
              <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
                <defs>
                  {/* Gradients for 3D Shading */}
                  <linearGradient id="rocketBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="65%" stopColor="#F8FAFC" />
                    <stop offset="100%" stopColor="#CBD5E1" />
                  </linearGradient>
                  <linearGradient id="purpleNoseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1D4ED8" />
                    <stop offset="60%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                  <linearGradient id="purpleFinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1D4ED8" />
                    <stop offset="60%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                  <linearGradient id="exhaustBeamGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFEDD5" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#FED7AA" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </linearGradient>
                  <radialGradient id="cloudGrad" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="70%" stopColor="#F1F5F9" />
                    <stop offset="100%" stopColor="#E2E8F0" />
                  </radialGradient>
                  <radialGradient id="cloudShadowGrad" cx="40%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#E2E8F0" />
                    <stop offset="100%" stopColor="#CBD5E1" />
                  </radialGradient>
                </defs>

                {/* --- BILLOWING FLUFFY 3D CLOUDS (Background layers) --- */}
                <g>
                  {/* Deep shadow cloud base */}
                  <circle cx="24" cy="98" r="16" fill="#DBEAFE" opacity="0.45" />
                  <circle cx="44" cy="100" r="16" fill="#E2E8F0" opacity="0.8" />
                  <circle cx="68" cy="94" r="14" fill="#E2E8F0" opacity="0.7" />

                  {/* Mid-ground fluffy clouds */}
                  <circle cx="16" cy="90" r="14" fill="url(#cloudGrad)" />
                  <circle cx="34" cy="82" r="18" fill="url(#cloudGrad)" />
                  <circle cx="56" cy="84" r="17" fill="url(#cloudGrad)" />
                  <circle cx="76" cy="92" r="14" fill="url(#cloudGrad)" />
                  <circle cx="46" cy="96" r="16" fill="url(#cloudGrad)" />

                  {/* Highlights on cloud tops */}
                  <ellipse cx="32" cy="74" rx="9" ry="4.5" fill="#FFFFFF" opacity="0.9" />
                  <ellipse cx="54" cy="76" rx="8" ry="4" fill="#FFFFFF" opacity="0.9" />
                </g>

                {/* --- EXHAUST PLUME STREAM (Connecting engine to cloud base) --- */}
                <g>
                  <path
                    d="M 52 68 Q 36 82 28 92 Q 44 80 58 62 Z"
                    fill="url(#exhaustBeamGrad)"
                  />
                  {/* Small bright core flame */}
                  <path
                    d="M 50 67 Q 40 76 34 82 Q 44 75 54 63 Z"
                    fill="#FDBA74"
                    opacity="0.9"
                  />
                  <path
                    d="M 49 67 Q 43 72 38 77 Q 45 72 52 64 Z"
                    fill="#F97316"
                  />
                </g>

                {/* --- ROCKET STRUCTURE (Oriented ~45deg diagonally) --- */}
                <g transform="rotate(45, 68, 52)">
                  {/* Left Purple Fin (flared out) */}
                  <path
                    d="M 54 58 C 42 64 38 74 42 78 C 50 76 56 70 58 64 Z"
                    fill="url(#purpleFinGrad)"
                  />

                  {/* Right Purple Fin (flared down/back) */}
                  <path
                    d="M 82 58 C 94 64 98 74 94 78 C 86 76 80 70 78 64 Z"
                    fill="url(#purpleFinGrad)"
                  />

                  {/* Red Engine Base / Mounting Ring */}
                  <path
                    d="M 56 68 L 80 68 L 77 74 L 59 74 Z"
                    fill="#EF4444"
                  />
                  {/* Orange Flame Emitter Nozzle */}
                  <path
                    d="M 62 74 Q 68 82 68 83 Q 68 82 74 74 Z"
                    fill="#F97316"
                  />

                  {/* Rocket Fuselage Body */}
                  <path
                    d="M 68 16 C 52 30 52 60 56 68 L 80 68 C 84 60 84 30 68 16 Z"
                    fill="url(#rocketBodyGrad)"
                    stroke="#E2E8F0"
                    strokeWidth="0.5"
                  />

                  {/* Purple Nosecone */}
                  <path
                    d="M 68 16 C 60 23 55 31 54 37 L 82 37 C 81 31 76 23 68 16 Z"
                    fill="url(#purpleNoseGrad)"
                  />

                  {/* Purple Dorsal Spine Fin */}
                  <path
                    d="M 66 37 Q 68 56 65 67 L 71 67 Q 68 56 70 37 Z"
                    fill="url(#purpleFinGrad)"
                  />

                  {/* 3D Purple Porthole / Window */}
                  <circle cx="68" cy="46" r="8" fill="url(#purpleNoseGrad)" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="68" cy="46" r="5" fill="#1E40AF" />
                  <circle cx="66" cy="44" r="1.75" fill="#FFFFFF" opacity="0.9" />
                </g>
              </svg>
            </div>

            {/* Title & Description */}
            <div className="flex flex-col gap-1">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] dark:text-white">
                4. Ready to Start?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
                Begin with the fundamental idea behind linear search:<br className="hidden sm:inline" />
                checking elements one by one.
              </p>
            </div>
          </div>

          {/* Right Side: Start Learning Button */}
          <button
            id="btn-home-start-learning"
            onClick={handleStartLearning}
            className="btn-modern-primary w-full md:w-auto px-8 py-4 text-white font-bold text-sm sm:text-base rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer shrink-0 group hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>
    </div>
  );
};
