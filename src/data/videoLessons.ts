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
    title: 'INTRODUCTION TO HASHING',
    nowPlayingTitle: 'INTRODUCTION TO HASHING',
    description: 'Learn the basics of hashing, hash functions, hash tables, and how a key is mapped to an index.',
    topics: [
      'Hash Function Basics',
      'Index Mapping Calculation',
      'Modulo Operation',
      'Fast Direct Access',
    ],
    videoSrc: '/videos/introduction.mp4',
    filename: 'introduction.mp4',
  },
  {
    id: 'lesson-02',
    lessonNumber: 'LESSON 02',
    title: 'COLLISION',
    nowPlayingTitle: 'COLLISION',
    description: 'Understand why collisions happen and how collision resolution techniques help store collided keys correctly.',
    topics: [
      'Why Collisions Occur',
      'Separate Chaining',
      'Open Addressing & Linear Probing',
      'Collision Resolution Workflow',
    ],
    videoSrc: '/videos/collision.mp4',
    filename: 'collision.mp4',
  },
];
