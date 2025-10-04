
import type { HistoryItem } from '../types';

const HISTORY_KEY = 'marketerz_prompt_history';

export const getHistory = (): HistoryItem[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    if (!historyJson) {
      return [];
    }
    const history = JSON.parse(historyJson);
    if (Array.isArray(history)) {
      return history;
    }
    return [];
  } catch (error) {
    console.error("Failed to parse history from localStorage", error);
    return [];
  }
};

export const addToHistory = (newItem: HistoryItem): HistoryItem[] => {
  const currentHistory = getHistory();
  const newHistory = [newItem, ...currentHistory];
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    return newHistory;
  } catch (error) {
    console.error("Failed to save history to localStorage", error);
    return currentHistory;
  }
};

export const updateLatestHistoryItem = (updatedPrompts: HistoryItem['prompts']): HistoryItem[] => {
    const currentHistory = getHistory();
    if (currentHistory.length > 0) {
        currentHistory[0].prompts = updatedPrompts;
        try {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(currentHistory));
        } catch (error) {
            console.error("Failed to update history in localStorage", error);
        }
    }
    return currentHistory;
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Failed to clear history from localStorage", error);
  }
};
