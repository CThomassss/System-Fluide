/**
 * Stores quiz results in localStorage so they can be saved to the DB
 * once the user has an active session (after email confirmation / login).
 */

const KEY = "sf_pending_quiz";

export interface PendingQuizData {
  sex: string;
  goal: string;
  age: number;
  height: number;
  weight: number;
  activity_level: string;
  training_data: string | null; // JSON: { d: "...", ex: "..." }
  bmr: number;
  tdee: number;
  target_calories: number;
  first_name?: string;
  last_name?: string;
}

export function savePendingQuiz(data: PendingQuizData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // localStorage not available
  }
}

export function getPendingQuiz(): PendingQuizData | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearPendingQuiz() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // localStorage not available
  }
}
