
import type { Settings, PromptCategory } from '../types';
import { ALL_PROMPT_CATEGORIES } from '../types';

const SETTINGS_KEY = 'marketerz_prompt_settings';

export const DEFAULT_SETTINGS: Settings = {
  temperature: 0.7,
  selectedCategories: [...ALL_PROMPT_CATEGORIES],
};

export const loadSettings = (): Settings => {
  try {
    const settingsJson = localStorage.getItem(SETTINGS_KEY);
    if (!settingsJson) {
      return DEFAULT_SETTINGS;
    }
    const savedSettings = JSON.parse(settingsJson);
    // Validate and merge with defaults to handle partial/old settings from previous versions
    return {
      temperature: typeof savedSettings.temperature === 'number' ? savedSettings.temperature : DEFAULT_SETTINGS.temperature,
      selectedCategories: Array.isArray(savedSettings.selectedCategories) && savedSettings.selectedCategories.length > 0 ? savedSettings.selectedCategories : DEFAULT_SETTINGS.selectedCategories,
    };
  } catch (error) {
    console.error("Failed to parse settings from localStorage", error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: Settings): void => {
  try {
    const settingsJson = JSON.stringify(settings);
    localStorage.setItem(SETTINGS_KEY, settingsJson);
  } catch (error) {
    console.error("Failed to save settings to localStorage", error);
  }
};
