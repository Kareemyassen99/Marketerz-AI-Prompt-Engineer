
import type { SessionData } from '../types';

const SESSION_KEY = 'marketerz_prompt_session';

export const loadSession = (): SessionData | null => {
  try {
    const sessionJson = localStorage.getItem(SESSION_KEY);
    if (!sessionJson) {
      return null;
    }
    const session = JSON.parse(sessionJson);
    // Basic validation to ensure the loaded data has the expected shape
    if (typeof session.idea === 'string' && Array.isArray(session.prompts)) {
      return session;
    }
    return null;
  } catch (error) {
    console.error("Failed to parse session from localStorage", error);
    return null;
  }
};

export const saveSession = (sessionData: SessionData): void => {
  try {
    const sessionJson = JSON.stringify(sessionData);
    localStorage.setItem(SESSION_KEY, sessionJson);
  } catch (error)
  {
    console.error("Failed to save session to localStorage", error);
  }
};

export const clearSession = (): void => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error("Failed to clear session from localStorage", error);
  }
};
