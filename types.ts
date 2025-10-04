export interface GeneratedPrompt {
  category: string;
  purpose: string;
  tokensHint: string;
  expectedOutputSize: string;
  prompt: string;
}

export interface HistoryItem {
  id: string;
  idea: string;
  prompts: GeneratedPrompt[];
  timestamp: string; // ISO String
}

export interface SessionData {
  idea: string;
  prompts: GeneratedPrompt[];
}

export interface SharedPromptData {
  idea: string;
  prompt: GeneratedPrompt;
}

export interface PromptTemplate {
  title: string;
  description: string;
  template: string;
  category: PromptCategory;
}

export const ALL_PROMPT_CATEGORIES = ['Strategy', 'Creative Copy', 'Technical Spec', 'Social Hooks', 'Image Prompt', 'Video Prompt'] as const;
export type PromptCategory = typeof ALL_PROMPT_CATEGORIES[number];

export interface Settings {
  temperature: number;
  selectedCategories: PromptCategory[];
}
