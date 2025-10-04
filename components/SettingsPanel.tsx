
import React from 'react';
import type { Settings, PromptCategory } from '../types';
import { ALL_PROMPT_CATEGORIES } from '../types';

interface SettingsPanelProps {
  settings: Settings;
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (newSettings: Settings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, isOpen, onClose, onSettingsChange }) => {
  if (!isOpen) {
    return null;
  }

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      temperature: parseFloat(e.target.value),
    });
  };

  const handleCategoryChange = (category: PromptCategory) => {
    const currentCategories = settings.selectedCategories;
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];
    
    // Ensure at least one category is always selected
    if (newCategories.length > 0) {
        onSettingsChange({
            ...settings,
            selectedCategories: newCategories,
        });
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-40 transition-opacity"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 shadow-2xl z-50 flex flex-col p-6 border-l border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-slate-200">Settings</h3>
          <button 
            onClick={onClose} 
            className="p-1 text-slate-400 hover:text-white transition-colors"
            aria-label="Close settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-8">
          {/* Temperature Setting */}
          <div>
            <label htmlFor="temperature" className="block text-lg font-semibold text-slate-300 mb-2">
              Creativity (Temperature)
            </label>
            <p className="text-sm text-slate-500 mb-4">
              Lower values are more predictable, higher values are more creative.
            </p>
            <div className="flex items-center gap-4">
                <input
                    type="range"
                    id="temperature"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.temperature}
                    onChange={handleTemperatureChange}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <span className="font-mono text-slate-300 bg-slate-800 px-2 py-1 rounded-md w-16 text-center">
                    {settings.temperature.toFixed(1)}
                </span>
            </div>
          </div>

          {/* Categories Setting */}
          <div>
            <h4 className="text-lg font-semibold text-slate-300 mb-2">
              Generated Prompts
            </h4>
            <p className="text-sm text-slate-500 mb-4">
              Select which prompt categories to generate. At least one must be selected.
            </p>
            <div className="space-y-3">
                {ALL_PROMPT_CATEGORIES.map(category => (
                    <label key={category} className="flex items-center p-3 bg-slate-800 rounded-md cursor-pointer hover:bg-slate-700/50 transition-colors">
                        <input
                            type="checkbox"
                            checked={settings.selectedCategories.includes(category)}
                            onChange={() => handleCategoryChange(category)}
                            className="w-5 h-5 bg-slate-900 border-slate-600 rounded text-cyan-500 focus:ring-cyan-600 focus:ring-2"
                        />
                        <span className="ml-3 text-slate-300">{category}</span>
                    </label>
                ))}
            </div>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="mt-6 w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-500 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
