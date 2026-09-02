import React, { useState, useEffect } from 'react';
import { LevelConfig, TechniqueType } from './types/game';
import { GAME_LEVELS } from './data/levels';
import { soundManager } from './utils/audio';
import { MainViewTab } from './types/game';
import { SidebarNav } from './components/SidebarNav';
import { TopHeader } from './components/TopHeader';
import { HomePage } from './components/HomePage';
import { LevelProgressBar } from './components/LevelProgressBar';
import { LinearSearchGameplay } from './components/LinearSearchGameplay';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { SandboxMode } from './components/SandboxMode';
import { LearnLinearSearchSection } from './components/LearnLinearSearchSection';
import { VideoTutorialsView } from './components/VideoTutorialsView';
import { MyProgressView } from './components/MyProgressView';
import { QuizView } from './components/QuizView';
import { QuestCompletionView } from './components/QuestCompletionView';
import { CompletionCelebrationModal } from './components/CompletionCelebrationModal';
import { ResetProgressModal } from './components/ResetProgressModal';
import { AIBotFloatingButton } from './components/AIBotFloatingButton';
import { Sparkles } from 'lucide-react';
import { progressManager } from './utils/progressManager';
import { useScrollReveal } from './hooks/useScrollReveal';

export default function App() {
  // Navigation View State (Defaults to HOME landing page)
  const [activeTab, setActiveTab] = useState<MainViewTab>('HOME');
  const [activeTheoryTopic, setActiveTheoryTopic] = useState<string>('what-is-hashing');
  const [show100Celebration, setShow100Celebration] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState<boolean>(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setDesktopSidebarOpen((prev) => !prev);
    }
  };

  // Close sidebar on outside click across desktop and mobile
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
      const isSidebarOpen = isDesktop ? desktopSidebarOpen : mobileSidebarOpen;
      if (!isSidebarOpen) return;

      const isInsideSidebar = target.closest('#app-sidebar-container') || target.closest('#app-sidebar-navigation');
      const isToggleButton = target.closest('#btn-sidebar-toggle');

      if (!isInsideSidebar && !isToggleButton) {
        if (isDesktop) {
          setDesktopSidebarOpen(false);
        } else {
          setMobileSidebarOpen(false);
        }
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [desktopSidebarOpen, mobileSidebarOpen]);

  // Game Configuration State
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>(() => {
    const state = progressManager.getState();
    return state.levelsCompleted;
  });
  const [score, setScore] = useState<number>(() => {
    return progressManager.getState().totalScore;
  });
  const [streak, setStreak] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Trigger scroll-to-reveal animations on tab and level changes
  useScrollReveal([activeTab, currentLevelIndex]);

  // Monitor for progress updates and 100% completion event across the application
  useEffect(() => {
    const syncProgress = () => {
      const stats = progressManager.getStats();
      const state = progressManager.getState();
      setCompletedLevels([...state.levelsCompleted]);
      setScore(state.totalScore);
      if (stats.percentage === 100 && !state.hasCelebrated100Percent) {
        setShow100Celebration(true);
        progressManager.setCelebrationAcknowledged();
      }
    };

    syncProgress();
    const unsubscribe = progressManager.subscribe(() => {
      syncProgress();
    });
    return unsubscribe;
  }, []);

  // Strict 5/5 game completion status
  const isAllLevelsCompleted = [1, 2, 3, 4, 5].every(
    (lvl) => completedLevels.includes(lvl) || progressManager.getState().levelsCompleted.includes(lvl)
  );

  // Active Level State
  const currentLevel: LevelConfig = GAME_LEVELS[Math.min(currentLevelIndex, 4)] || GAME_LEVELS[0];
  // Modals & Interactive Overlays
  const [showLevelCompleteModal, setShowLevelCompleteModal] = useState<boolean>(false);

  // Sandbox pre-configuration
  const [sandboxTechnique, setSandboxTechnique] = useState<TechniqueType>('linear');

  // Initialize level
  const initLevel = (levelIdx: number) => {
    setCurrentLevelIndex(levelIdx);
    setShowLevelCompleteModal(false);
  };

  const handleNextLevel = () => {
    setShowLevelCompleteModal(false);
    if (currentLevelIndex < GAME_LEVELS.length - 1) {
      const nextIndex = currentLevelIndex + 1;
      setCurrentLevelIndex(nextIndex);
    } else {
      // All 5 levels completed! Move to Level 6: Completion Milestone
      setCurrentLevelIndex(5);
    }
  };

  // Smart Resume / Continue Learning Action
  const handleContinueLearning = () => {
    const stats = progressManager.getStats();
    const nextMod = stats.nextModule;

    if (!nextMod || nextMod.id === 'fn-01-basics' || nextMod.id === 'fn-02-modulo') {
      setActiveTheoryTopic(nextMod?.targetChapterId || 'theory-01');
      setActiveTab('THEORY');
      return;
    }

    if (nextMod.id === 'fn-10-completion') {
      if (isAllLevelsCompleted) {
        setCurrentLevelIndex(5);
        setActiveTab('GAME');
      } else {
        const targetLvl = Math.min(completedLevels.length, 4);
        setCurrentLevelIndex(targetLvl);
        initLevel(targetLvl);
        setActiveTab('GAME');
      }
      return;
    }

    if (nextMod.targetTab === 'GAME' || (nextMod.targetLevelId && nextMod.targetLevelId >= 1)) {
      const targetLvl = (nextMod.targetLevelId || 1) - 1;
      if (targetLvl >= 5 && !isAllLevelsCompleted) {
        const safeLvl = Math.min(completedLevels.length, 4);
        setCurrentLevelIndex(safeLvl);
        initLevel(safeLvl);
      } else {
        setCurrentLevelIndex(targetLvl);
        if (targetLvl < 5) initLevel(targetLvl);
      }
      setActiveTab('GAME');
      return;
    }

    if (nextMod.id === 'fn-09-quiz' || nextMod.targetChapterId === 'knowledge-quiz') {
      setActiveTab('QUIZ');
      return;
    }

    if (nextMod.targetTab === 'LEARN' || nextMod.targetTab === 'THEORY') {
      setActiveTheoryTopic(nextMod.targetChapterId || 'theory-01');
      setActiveTab('THEORY');
      return;
    }

    // Default fallback
    setActiveTab('GAME');
  };

  // Direct trigger to Theory from Topic card
  const handleNavigateToTheory = (chapterId?: string) => {
    if (chapterId) {
      setActiveTheoryTopic(chapterId);
    }
    setActiveTab('THEORY');
  };

  const handleNavigateToQuest = (levelId?: number) => {
    if (levelId) {
      if (levelId === 6 && !isAllLevelsCompleted) {
        const safeLvl = Math.min(completedLevels.length, 4);
        setCurrentLevelIndex(safeLvl);
        initLevel(safeLvl);
      } else {
        setCurrentLevelIndex(levelId - 1);
        if (levelId <= 5) initLevel(levelId - 1);
      }
    }
    setActiveTab('GAME');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-[#F8FAFC] font-sans flex antialiased selection:bg-[#2563EB] dark:selection:bg-[#3B82F6] selection:text-white transition-colors duration-300">
      {/* Sticky Left Sidebar Navigation */}
      <SidebarNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          setMobileSidebarOpen(false);
        }}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        isDesktopOpen={desktopSidebarOpen}
        onToggleDesktopCollapse={() => setDesktopSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          desktopSidebarOpen ? 'lg:pl-64' : 'lg:pl-0'
        }`}
      >
        {/* Top Header Bar */}
        <TopHeader
          activeTab={activeTab}
          currentLevelId={currentLevelIndex >= 5 && isAllLevelsCompleted ? 6 : currentLevel.id}
          score={score}
          streak={streak}
          technique={currentLevel.technique}
          isMuted={isMuted}
          onToggleMute={() => {
            const next = !isMuted;
            setIsMuted(next);
            soundManager.setMuted(next);
          }}
          speed={speed}
          onChangeSpeed={(sp) => setSpeed(sp)}
          onResetLevel={() => initLevel(currentLevelIndex)}
          onResetAllProgress={() => setShowResetModal(true)}
          onToggleMobileSidebar={handleToggleSidebar}
          isDesktopSidebarOpen={desktopSidebarOpen}
          isMobileSidebarOpen={mobileSidebarOpen}
        />

        {/* Page Main Content Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-[76px] sm:pt-[84px] pb-8 flex flex-col gap-6">
          <div
            key={activeTab}
            className="w-full flex-1 flex flex-col gap-6 animate-page-enter"
          >
            {/* 1. HOME LANDING PAGE */}
            {activeTab === 'HOME' && (
              <HomePage
                onContinueLearning={handleContinueLearning}
                onExploreTopics={() => {
                  setActiveTheoryTopic('theory-01');
                  setActiveTab('THEORY');
                }}
                onNavigateToTab={(tab, targetOption) => {
                  if (tab === 'THEORY') {
                    if (typeof targetOption === 'string') {
                      setActiveTheoryTopic(targetOption);
                    }
                    setActiveTab('THEORY');
                  } else if (tab === 'GAME' || tab === 'QUEST') {
                    if (typeof targetOption === 'number') {
                      if (targetOption === 6 && !isAllLevelsCompleted) {
                        const safeLvl = Math.min(completedLevels.length, 4);
                        setCurrentLevelIndex(safeLvl);
                        initLevel(safeLvl);
                      } else {
                        setCurrentLevelIndex(targetOption - 1);
                        if (targetOption <= 5) initLevel(targetOption - 1);
                      }
                    }
                    setActiveTab('GAME');
                  } else if (tab === 'LAB') {
                    setActiveTab('LAB');
                  } else if (tab === 'QUIZ') {
                    setActiveTab('QUIZ');
                  } else if (tab === 'PROGRESS') {
                    setActiveTab('PROGRESS');
                  }
                }}
              />
            )}

            {/* 2. THEORY SECTION */}
            {activeTab === 'THEORY' && (
              <LearnLinearSearchSection
                initialTopic={activeTheoryTopic}
                onStartLevel={(lvlId) => {
                  if (lvlId === 6 && !isAllLevelsCompleted) {
                    const safeLvl = Math.min(completedLevels.length, 4);
                    setCurrentLevelIndex(safeLvl);
                    initLevel(safeLvl);
                  } else {
                    setCurrentLevelIndex(lvlId - 1);
                    if (lvlId <= 5) initLevel(lvlId - 1);
                  }
                  setActiveTab('GAME');
                }}
                onOpenSandbox={(tech) => {
                  if (tech) setSandboxTechnique(tech);
                  setActiveTab('LAB');
                }}
              />
            )}

            {/* 2.5. VIDEO LEARNING SECTION */}
            {activeTab === 'VIDEO' && (
              <VideoTutorialsView />
            )}

            {/* 3. GAME PLAY SECTION */}
            {(activeTab === 'GAME' || activeTab === 'QUEST') && (
              <div className="flex flex-col gap-6 animate-page-enter">
                {/* Level Stepper Bar */}
                <LevelProgressBar
                  currentLevelId={currentLevelIndex >= 5 ? 6 : currentLevel.id}
                  completedLevels={completedLevels}
                  onSelectLevel={(lvlId) => {
                    soundManager.playClick();
                    setCurrentLevelIndex(lvlId - 1);
                    if (lvlId <= 5) {
                      initLevel(lvlId - 1);
                    }
                  }}
                  onOpenLab={() => setActiveTab('LAB')}
                  isCompletionActive={currentLevelIndex >= 5}
                />

                {/* Level 6: Quest Completion & Mastery Certificate */}
                {currentLevelIndex >= 5 ? (
                  <QuestCompletionView
                    onReplayLevel={(lvlId) => {
                      setCurrentLevelIndex(lvlId - 1);
                      initLevel(lvlId - 1);
                    }}
                    onOpenTheory={() => {
                      setActiveTheoryTopic('what-is-hashing');
                      setActiveTab('THEORY');
                    }}
                    onOpenSandbox={() => {
                      setActiveTab('LAB');
                    }}
                    onOpenQuiz={() => {
                      setActiveTab('QUIZ');
                    }}
                    onOpenProgress={() => {
                      setActiveTab('PROGRESS');
                    }}
                  />
                ) : (
                  <div key={`game-level-${currentLevel.id}`} className="flex flex-col gap-6 animate-chapter-switch">
                    {/* Level Title & Subtitle Banner */}
                    <div className="text-center max-w-2xl mx-auto font-sans">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFF6FF] dark:bg-blue-950/60 border border-[#DBEAFE] dark:border-blue-500/30 text-[#2563EB] dark:text-[#3B82F6] text-xs font-bold mb-2 uppercase font-mono rounded-lg">
                        <Sparkles className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#3B82F6]" />
                        <span>Level {currentLevel.id < 10 ? `0${currentLevel.id}` : currentLevel.id} • {currentLevel.title}</span>
                      </div>
                      <h2 className="text-2xl sm:text-4xl font-bold font-display text-slate-900 dark:text-white tracking-tight animate-heading-enter">
                        {currentLevel.subtitle}
                      </h2>
                    </div>

                    {/* Linear Search 5-Level Progressive Learning Gameplay */}
                    <LinearSearchGameplay
                      key={`linear-search-level-${currentLevel.id}`}
                      level={currentLevel}
                      onLevelComplete={(lvlId, _lvlScore) => {
                        progressManager.markLevelCompleted(lvlId, 100, true);
                        setShowLevelCompleteModal(true);
                      }}
                      onScoreUpdate={(delta) => setScore((s) => s + delta)}
                      onStreakUpdate={(st) => setStreak(st)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* 4. LAB WORKBENCH SECTION */}
            {activeTab === 'LAB' && (
              <SandboxMode
                initialTechnique={sandboxTechnique}
                onExit={() => {
                  setCurrentLevelIndex(5);
                  setActiveTab('GAME');
                }}
                onOpenTheory={() => {
                  setActiveTheoryTopic('theory-01');
                  setActiveTab('THEORY');
                }}
              />
            )}

            {/* 5. QUIZ EXAMINATION SECTION */}
            {activeTab === 'QUIZ' && (
              <QuizView
                onNavigateToTheory={handleNavigateToTheory}
                onNavigateToQuest={handleNavigateToQuest}
                onNavigateToProgress={() => setActiveTab('PROGRESS')}
                onNavigateToHome={() => setActiveTab('HOME')}
              />
            )}

            {/* 6. PROGRESS AUDIT SECTION */}
            {activeTab === 'PROGRESS' && (
              <MyProgressView
                onNavigateToTab={(tab, levelId, chapterId) => {
                  if (tab === 'THEORY' || tab === 'LEARN') {
                    if (chapterId) setActiveTheoryTopic(chapterId);
                    setActiveTab('THEORY');
                  } else if (tab === 'QUEST' || tab === 'GAME') {
                    if (levelId) setCurrentLevelIndex(levelId - 1);
                    setActiveTab('GAME');
                  } else if (tab === 'LAB' || tab === 'SANDBOX') {
                    setActiveTab('LAB');
                  } else if (tab === 'QUIZ' || tab === 'EXAM') {
                    setActiveTab('QUIZ');
                  } else {
                    setActiveTab(tab as MainViewTab);
                  }
                }}
              />
            )}
          </div>
        </main>
      </div>

      {/* Level Completion Modal */}
      {showLevelCompleteModal && (
        <LevelCompleteModal
          level={currentLevel}
          score={score}
          onNextLevel={handleNextLevel}
          onOpenLab={() => {
            setShowLevelCompleteModal(false);
            setActiveTab('LAB');
          }}
          onReplayLevel={() => {
            setShowLevelCompleteModal(false);
            initLevel(currentLevelIndex);
          }}
          hasNextLevel={currentLevelIndex < GAME_LEVELS.length - 1}
        />
      )}

      {/* 100% Curriculum Completion Celebration Modal */}
      <CompletionCelebrationModal
        isOpen={show100Celebration}
        onClose={() => setShow100Celebration(false)}
        onNavigateToLab={() => {
          setShow100Celebration(false);
          setActiveTab('LAB');
        }}
        onNavigateToProgress={() => {
          setShow100Celebration(false);
          setActiveTab('PROGRESS');
        }}
      />

      {/* Centered Reset Progress Confirmation Modal */}
      <ResetProgressModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={() => {
          progressManager.resetProgress();
          setScore(0);
          setStreak(0);
          setCompletedLevels([]);
          setCurrentLevelIndex(0);
          initLevel(0);
          setShowResetModal(false);
        }}
      />

      {/* Global AI Bot Floating Icon */}
      <AIBotFloatingButton />
    </div>
  );
}
