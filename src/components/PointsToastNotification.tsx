import React, { useState, useEffect } from 'react';
import { Award, AlertCircle, X, CheckCircle2 } from 'lucide-react';
import { pointsManager } from '../utils/pointsManager';
import { PointsNotification } from '../types/points';

interface ActiveToast extends PointsNotification {
  visible: boolean;
}

export const PointsToastNotification: React.FC = () => {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);

  useEffect(() => {
    const unsub = pointsManager.onNotification((notification) => {
      const newToast: ActiveToast = {
        ...notification,
        visible: true,
      };

      setToasts((prev) => {
        // Keep at most 3 recent notifications to prevent cluttering the viewport
        const filtered = prev.slice(-2);
        return [...filtered, newToast];
      });

      // Auto dismiss after 2.8 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== notification.id));
      }, 2800);
    });

    return unsub;
  }, []);

  const handleDismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div
      id="points-toast-container"
      className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-xs sm:max-w-sm w-full pointer-events-none select-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const isReward = toast.type === 'reward';

        return (
          <div
            key={toast.id}
            id={`points-toast-${toast.id}`}
            className={`pointer-events-auto transform transition-all duration-300 ease-out translate-y-0 opacity-100 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#111827] border shadow-lg backdrop-blur-md flex items-center justify-between gap-3 ${
              isReward
                ? 'border-emerald-200/90 dark:border-emerald-500/30 shadow-emerald-500/10'
                : 'border-rose-200/90 dark:border-rose-500/30 shadow-rose-500/10'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Left Indicator Icon Badge */}
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                  isReward
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30'
                }`}
              >
                {isReward ? (
                  <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
                ) : (
                  <AlertCircle className="w-5 h-5 stroke-[2.2]" />
                )}
              </div>

              {/* Message Content */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`font-mono font-black text-sm tracking-tight ${
                      isReward
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {toast.title}
                  </span>
                  <span className="text-slate-300 dark:text-slate-600 font-bold text-xs">
                    —
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {toast.message}
                  </span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => handleDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-blue-950/40 transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
