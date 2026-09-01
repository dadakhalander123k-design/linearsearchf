import React, { useState } from 'react';
import {
  LayoutGrid,
  BookOpen,
  Sparkles,
  Gamepad2,
  HelpCircle,
  TrendingUp,
  X,
} from 'lucide-react';
import { MainViewTab } from '../types/game';
import { progressManager } from '../utils/progressManager';
import { soundManager } from '../utils/audio';

export interface SidebarNavProps {
  activeTab: MainViewTab;
  onChangeTab: (tab: MainViewTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  isDesktopOpen?: boolean;
  onToggleDesktopCollapse?: () => void;
  onOpenHelpModal?: () => void;
  onOpenSettingsModal?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onChangeTab,
  isOpenMobile = false,
  onCloseMobile,
  isDesktopOpen = true,
  onToggleDesktopCollapse,
}) => {
  const [stats, setStats] = React.useState(() => progressManager.getStats());
  const [isProgressHovered, setIsProgressHovered] = useState(false);

  React.useEffect(() => {
    const unsub = progressManager.subscribe(() => {
      setStats(progressManager.getStats());
    });
    return unsub;
  }, []);

  const navItems = [
    {
      id: 'HOME' as MainViewTab,
      label: 'Overview',
      icon: LayoutGrid,
      badge: 'Overview',
      badgeClass: 'bg-slate-100 dark:bg-purple-950/40 text-slate-600 dark:text-purple-300 border border-slate-200 dark:border-purple-500/20',
    },
    {
      id: 'THEORY' as MainViewTab,
      label: 'Learn',
      icon: BookOpen,
      badge: `${stats.theory.completed} / 12`,
      badgeClass: 'bg-[#EEF2FF] dark:bg-purple-950/50 text-[#4F46E5] dark:text-purple-300 border border-[#E0E7FF] dark:border-purple-500/20',
    },
    {
      id: 'VIDEO' as MainViewTab,
      label: 'Visualize',
      icon: Sparkles,
      badge: `${stats.video.completed} / 2`,
      badgeClass: 'bg-[#EEF2FF] dark:bg-purple-950/50 text-[#4F46E5] dark:text-purple-300 border border-[#E0E7FF] dark:border-purple-500/20',
    },
    {
      id: 'GAME' as MainViewTab,
      label: 'Game',
      icon: Gamepad2,
      badge: `${stats.game.completed} / 5`,
      badgeClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-500/20',
    },
    {
      id: 'QUIZ' as MainViewTab,
      label: 'Quiz',
      icon: HelpCircle,
      badge: stats.quiz.isSubmitted ? 'Completed' : '10 Qs',
      badgeClass: 'bg-[#EEF2FF] dark:bg-purple-900/40 text-[#4F46E5] dark:text-purple-300 border border-[#E0E7FF] dark:border-purple-500/20',
    },
    {
      id: 'PROGRESS' as MainViewTab,
      label: 'Progress',
      icon: TrendingUp,
      badge: `${stats.percentage}%`,
      badgeClass: 'bg-[#EEF2FF] dark:bg-purple-800/40 text-[#4F46E5] dark:text-purple-200 font-bold border border-[#E0E7FF] dark:border-purple-500/30',
    },
  ];

  const handleSelect = (tab: MainViewTab) => {
    soundManager.playNav();
    onChangeTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleClose = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
    if (onToggleDesktopCollapse) {
      onToggleDesktopCollapse();
    }
  };

  const content = (
    <aside
      id="app-sidebar-navigation"
      className="w-64 h-full flex flex-col bg-white dark:bg-[#070B18] border-r border-[#E5E7EB] dark:border-purple-500/20 select-none shadow-xs transition-colors duration-300"
    >
      {/* Top Sidebar Header with Close Button (No duplicate branding) */}
      <div className="p-4 sm:p-5 border-b border-[#E5E7EB] dark:border-purple-500/15 flex items-center justify-end">
        {/* Close Button in Top-Right Corner of Navigation */}
        <button
          id="btn-sidebar-close"
          onClick={handleClose}
          className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100/80 hover:bg-slate-200/80 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 border border-slate-200/90 dark:border-purple-500/30 rounded-xl transition-all duration-150 cursor-pointer shadow-xs flex items-center justify-center shrink-0"
          aria-label="Close navigation menu"
          title="Close Navigation (✕)"
        >
          <X className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Navigation Item List */}
      <div
        className="px-3 py-4 space-y-1 overflow-y-auto"
        onMouseEnter={() => setIsProgressHovered(true)}
        onMouseLeave={() => setIsProgressHovered(false)}
      >
        {/* SINGLE NAVIGATION MENU HEADING */}
        <div className="px-3 pb-2 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase font-mono">
          NAVIGATION MENU
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'GAME' && activeTab === 'QUEST');

          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id.toLowerCase()}`}
              onClick={() => handleSelect(item.id)}
              className={`group w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#EEF2FF] dark:bg-purple-950/40 text-[#4F46E5] dark:text-[#C4B5FD] font-semibold shadow-xs dark:shadow-[0_0_14px_rgba(124,58,237,0.18)] border border-[#C7D2FE] dark:border-purple-500/30'
                  : 'text-[#475569] dark:text-slate-400 hover:bg-[#F5F7FF] dark:hover:bg-purple-950/20 hover:text-[#4F46E5] dark:hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-1.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#4F46E5] dark:bg-purple-600 text-white shadow-xs'
                      : 'bg-[#F8FAFC] dark:bg-purple-950/30 text-[#64748B] dark:text-slate-400 group-hover:text-[#4F46E5] dark:group-hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-sans">{item.label}</span>
              </div>

              {/* Detailed progress values are hidden by default and smoothly fade in on hover */}
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition-opacity duration-200 ease-in-out ${item.badgeClass} ${
                  isProgressHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                {item.badge}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Fixed Left Sidebar with smooth collapse transition */}
      <div
        id="app-sidebar-container"
        className={`hidden lg:block fixed top-0 left-0 bottom-0 h-screen z-30 transition-all duration-300 ease-in-out ${
          isDesktopOpen
            ? 'w-64 opacity-100 translate-x-0 pointer-events-auto'
            : 'w-0 opacity-0 -translate-x-full pointer-events-none overflow-hidden'
        }`}
      >
        {content}
      </div>

      {/* Mobile Drawer Overlay - Fixed to viewport */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 dark:bg-black/70 backdrop-blur-xs animate-fadeIn"
            onClick={onCloseMobile}
          />
          <div
            id="app-sidebar-container"
            className="relative z-10 w-64 h-full bg-white dark:bg-[#070B18] shadow-xl animate-slideRight"
          >
            {content}
          </div>
        </div>
      )}
    </>
  );
};
