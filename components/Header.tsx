
import React from 'react';

interface HeaderProps {
    onToggleHistory: () => void;
    onToggleSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleHistory, onToggleSettings }) => (
  <header className="text-center relative">
     <div className="absolute top-0 right-0 flex items-center gap-2">
        <button
            onClick={onToggleSettings}
            className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
            aria-label="Open settings"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.226l.554-.225a2.25 2.25 0 0 1 2.158 0l.554.225c.55.219 1.02.684 1.11 1.226l.099.596a2.25 2.25 0 0 0 1.258 2.119l.547.273a2.25 2.25 0 0 1 0 3.192l-.547.273a2.25 2.25 0 0 0-1.258 2.119l-.099.596c-.09.542-.56 1.007-1.11 1.226l-.554-.225a2.25 2.25 0 0 1-2.158 0l-.554-.225c-.55-.219-1.02-.684-1.11-1.226l-.099-.596a2.25 2.25 0 0 0-1.258-2.119l-.547-.273a2.25 2.25 0 0 1 0-3.192l.547-.273a2.25 2.25 0 0 0 1.258-2.119l.099-.596Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
        </button>
        <button
            onClick={onToggleHistory}
            className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
            aria-label="View history"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        </button>
    </div>
    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-600">
      Marketerz Prompt Engineer
    </h1>
    <h2 className="mt-2 text-lg text-slate-400">Turn Your Ideas into AI-Ready Prompts</h2>
  </header>
);

export default Header;
