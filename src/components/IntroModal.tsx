import React from 'react';
import { Play, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface IntroModalProps {
  onStartGame: () => void;
  onOpenLearn?: () => void;
}

export const IntroModal: React.FC<IntroModalProps> = ({ onStartGame, onOpenLearn }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-editorial-fade font-sans">
      <div className="bg-white dark:bg-[#0B1228] w-full max-w-md border border-slate-200 dark:border-purple-500/30 rounded-2xl shadow-xl dark:shadow-[0_0_30px_rgba(124,58,237,0.3)] overflow-hidden p-6 sm:p-8 flex flex-col items-center text-center">
        {/* App Icon */}
        <div className="w-14 h-14 bg-indigo-600 dark:bg-purple-600 text-white rounded-2xl flex items-center justify-center font-bold text-3xl mb-3 shadow-md shadow-indigo-200 dark:shadow-[0_0_20px_rgba(124,58,237,0.5)]">
          #
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-purple-950/50 border border-indigo-100 dark:border-purple-500/30 text-indigo-700 dark:text-purple-300 text-xs font-semibold rounded-lg font-sans mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-purple-400" />
          <span>INTERACTIVE HASHING ENGINE</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          Welcome to Hash Quest
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5 font-normal">
          Learn how Hash Tables and Collision Resolution algorithms operate in computer memory through active modulus arithmetic, key dragging, probing jumps, and real-time stress testing.
        </p>

        {/* Fundamental Hash Formula Card */}
        <div className="w-full bg-slate-50 dark:bg-[#050816] border border-slate-200 dark:border-purple-500/25 rounded-xl p-4 mb-6 text-left shadow-xs">
          <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1 font-mono">
            Core Mathematical Law
          </div>
          <div className="text-xl font-bold font-mono text-indigo-600 dark:text-cyan-400">
            h(k) = k mod m
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compute the remainder, find the slot, resolve collisions, and achieve O(1) instantaneous lookup.
          </div>
        </div>

        {/* Start Game CTAs */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            id="btn-start-game-intro"
            onClick={() => {
              soundManager.playPrimaryClick();
              onStartGame();
            }}
            className="w-full btn-modern-primary py-3 px-6 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Quest (Level 01)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {onOpenLearn && (
            <button
              id="btn-intro-open-field-guide"
              onClick={() => {
                soundManager.playSecondaryClick();
                onOpenLearn();
              }}
              className="w-full btn-modern-secondary py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-purple-400" />
              <span>Explore Theory Curriculum</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
