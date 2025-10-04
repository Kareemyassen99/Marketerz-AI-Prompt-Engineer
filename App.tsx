
import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { GeneratedPrompt, HistoryItem, Settings, SharedPromptData } from './types';
import { generateMarketingPrompts, generateSinglePrompt } from './services/geminiService';
import * as historyService from './services/historyService';
import * as sessionService from './services/sessionService';
import * as settingsService from './services/settingsService';
import Header from './components/Header';
import IdeaInputForm from './components/IdeaInputForm';
import PromptTemplates from './components/PromptTemplates';
import PromptOutputDisplay from './components/PromptOutputDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import HistoryPanel from './components/HistoryPanel';
import AutoSaveIndicator from './components/AutoSaveIndicator';
import SettingsPanel from './components/SettingsPanel';
import ExampleIdeas from './components/ExampleIdeas';

type SaveStatus = 'idle' | 'saving' | 'saved';

const App: React.FC = () => {
  const [idea, setIdea] = useState<string>('');
  const [prompts, setPrompts] = useState<GeneratedPrompt[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>(settingsService.DEFAULT_SETTINGS);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [regeneratingCategory, setRegeneratingCategory] = useState<string | null>(null);


  const saveTimeoutRef = useRef<number | null>(null);
  const isInitialLoad = useRef(true);

  // Load history, session, settings, or shared link data on initial render
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const base64Data = hash.substring('#share='.length);
        const decodedJson = atob(base64Data);
        const sharedData: SharedPromptData = JSON.parse(decodedJson);
        if (sharedData.idea && sharedData.prompt) {
          setIdea(sharedData.idea);
          setPrompts([sharedData.prompt]);
          // Clean the URL hash
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
          isInitialLoad.current = false;
          return; // Exit early to prevent loading a session over the shared data
        }
      } catch (e) {
        console.error("Failed to parse shared link data:", e);
        // Clean the bad hash
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
    
    // Default loading behavior if not a share link
    setHistory(historyService.getHistory());
    setSettings(settingsService.loadSettings());
    const savedSession = sessionService.loadSession();
    if (savedSession) {
      setIdea(savedSession.idea);
      setPrompts(savedSession.prompts);
    }
    isInitialLoad.current = false;
  }, []);

  // Auto-save effect
  useEffect(() => {
    if (isInitialLoad.current) return;

    if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
    }
    setSaveStatus('saving');
    saveTimeoutRef.current = window.setTimeout(() => {
        sessionService.saveSession({ idea, prompts });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000); // Reset status after 2 seconds
    }, 1000); // Debounce saves by 1 second

    return () => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
    };
  }, [idea, prompts]);


  const handleGenerate = useCallback(async () => {
    if (!idea.trim()) {
      setError('Please enter an idea before generating prompts.');
      return;
    }
    if (settings.selectedCategories.length === 0) {
      setError('Please select at least one prompt category in the settings panel.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setPrompts([]);

    try {
      const generatedPrompts = await generateMarketingPrompts(idea, settings);
      setPrompts(generatedPrompts);

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: `${new Date().toISOString()}-${Math.random()}`,
        idea,
        prompts: generatedPrompts,
        timestamp: new Date().toISOString(),
      };
      const updatedHistory = historyService.addToHistory(newHistoryItem);
      setHistory(updatedHistory);

    } catch (err) {
      setError(err instanceof Error ? `Failed to generate prompts: ${err.message}` : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [idea, settings]);

  const handleRegeneratePrompt = useCallback(async (category: string) => {
    setRegeneratingCategory(category);
    setError(null);

    try {
      const newPrompt = await generateSinglePrompt(idea, category);
      
      const updatedPrompts = prompts.map(p => p.category === category ? newPrompt : p);
      setPrompts(updatedPrompts);
      
      const updatedHistory = historyService.updateLatestHistoryItem(updatedPrompts);
      setHistory(updatedHistory);

// FIX: Added missing curly braces to the catch block to fix syntax error.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during regeneration.');
      console.error(err);
    } finally {
      setRegeneratingCategory(null);
    }
  }, [idea, prompts]);

  const handleSelectExample = (exampleIdea: string) => {
    setIdea(exampleIdea);
    setError(null);
    setPrompts([]);
  };

  const handleSelectTemplate = (templateString: string) => {
    setIdea(templateString);
    setError(null);
    setPrompts([]);
  };

  const handleToggleHistory = () => {
    setShowHistory(prev => !prev);
  };
  
  const handleToggleSettings = () => {
    setShowSettings(prev => !prev);
  };

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
    settingsService.saveSettings(newSettings);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setIdea(item.idea);
    setPrompts(item.prompts);
    setError(null);
    window.scrollTo(0, 0);
  };

  const handleClearHistory = () => {
    historyService.clearHistory();
    setHistory([]);
  };

  const handleClearSession = () => {
    if (window.confirm('Are you sure you want to clear your current session? This will remove your unsaved idea and generated prompts.')) {
      sessionService.clearSession();
      setIdea('');
      setPrompts([]);
      setError(null);
      // Briefly show status to confirm clearing
      setSaveStatus('idle'); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto relative">
        <Header onToggleHistory={handleToggleHistory} onToggleSettings={handleToggleSettings} />
        <main className="mt-8">
          <p className="text-center text-slate-400 mb-6">
            Enter a marketing idea, and we'll engineer distinct prompts optimized for a variety of generative AI tasks.
          </p>
          <PromptTemplates onSelectTemplate={handleSelectTemplate} />
          <ExampleIdeas onSelectExample={handleSelectExample} />
          <IdeaInputForm
            idea={idea}
            setIdea={setIdea}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
          {error && <ErrorMessage message={error} />}
          {isLoading && <LoadingSpinner />}
          {!isLoading && prompts.length > 0 && (
            <PromptOutputDisplay
              idea={idea} 
              prompts={prompts} 
              onRegenerate={handleRegeneratePrompt}
              regeneratingCategory={regeneratingCategory}
            />
          )}
        </main>
        <footer className="text-center mt-12 text-slate-500 text-sm">
            <div className="flex flex-col items-center gap-2">
                <div className="flex justify-center items-center gap-4 flex-wrap">
                    <AutoSaveIndicator status={saveStatus} />
                    {(idea.trim() || prompts.length > 0) && (
                        <button
                            onClick={handleClearSession}
                            className="text-xs text-slate-500 hover:text-red-400 transition-colors underline"
                            title="Clear current idea and prompts"
                        >
                            Clear Session
                        </button>
                    )}
                </div>
                <p>By Marketerz AI</p>
                <a href="https://linktr.ee/Marketerz" target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-400 transition-colors">
                    Find us at https://linktr.ee/Marketerz
                </a>
            </div>
        </footer>
      </div>
       <HistoryPanel 
        isOpen={showHistory}
        history={history}
        onClose={handleToggleHistory}
        onSelect={handleSelectHistoryItem}
        onClear={handleClearHistory}
      />
      <SettingsPanel
        isOpen={showSettings}
        settings={settings}
        onClose={handleToggleSettings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
};

export default App;
