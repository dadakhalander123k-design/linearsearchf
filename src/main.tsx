import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './utils/themeContext.tsx';
import './index.css';

// Execute complete progress reset
const RESET_FLAG_KEY = 'algolearn_full_progress_reset_v1';
if (typeof window !== 'undefined' && !localStorage.getItem(RESET_FLAG_KEY)) {
  try {
    const keysToRemove = [
      'hash_quest_field_notes_progress_v2',
      'algo_quest_points_system_v3',
      'algo_quest_points_system_v2',
      'hash_quest_quiz_answers_v4',
      'hash_quest_quiz_submitted_v4',
      'hash_quest_quiz_answers_v3',
      'hash_quest_quiz_submitted_v3',
      'cll_progress_v1',
      'cll_progress',
      'cll_quiz_answers_v1',
      'cll_quiz_submitted_v1',
      'cll_quiz_answers',
      'cll_quiz_submitted',
      'hash_quest_field_notes_progress',
    ];
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    localStorage.setItem(RESET_FLAG_KEY, 'true');
  } catch {
    // Ignore storage errors
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);

