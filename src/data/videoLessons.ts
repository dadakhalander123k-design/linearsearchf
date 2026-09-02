export interface LessonItem {
  id: 'lesson-01' | 'lesson-02';
  lessonNumber: string;
  title: string;
  nowPlayingTitle: string;
  description: string;
  topics: string[];
  videoSrc: string;
  filename: string;
}

export const VIDEO_LESSONS: LessonItem[] = [
  {
    id: 'lesson-01',
    lessonNumber: 'LESSON 01',
    title: 'WHAT IS LINEAR SEARCH',
    nowPlayingTitle: 'WHAT IS LINEAR SEARCH',
    description: 'Learn the basic idea of Linear Search, how it checks elements sequentially, and when it is useful for finding a target value.',
    topics: [
      'Linear Search Basics',
      'Sequential Searching',
      'Target Element',
      'Array Traversal',
    ],
    videoSrc: '/videos/introductiontols.mp4',
    filename: 'introductiontols.mp4',
  },
  {
    id: 'lesson-02',
    lessonNumber: 'LESSON 02',
    title: 'HOW DOES LINEAR SEARCH WORK?',
    nowPlayingTitle: 'HOW DOES LINEAR SEARCH WORK?',
    description: 'Follow the step-by-step process of Linear Search as each element is compared with the target until the value is found or the list ends.',
    topics: [
      'Start from the First Element',
      'Compare with Target',
      'Move Sequentially',
      'Stop When Found',
    ],
    videoSrc: '/videos/whatisls.mp4',
    filename: 'whatisls.mp4',
  },
];
