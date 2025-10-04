
import React from 'react';
import type { HistoryItem } from '../types';

interface HistoryPanelProps {
  history: HistoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, isOpen, onClose, onSelect, onClear }) => {
  if (!isOpen) {
    return null;
  }

  const handleSelect = (item: HistoryItem) => {
    onSelect(item);
    onClose();
  };
  
  const handleClear = () => {
    if(window.confirm('Are you sure you want to clear the entire history? This cannot be undone.')) {
        onClear();
    }
  }

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
          <h3 className="text-2xl font-bold text-slate-200">Generation History</h3>
          <button 
            onClick={onClose} 
            className="p-1 text-slate-400 hover:text-white transition-colors"
            aria-label="Close history"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {history.length > 0 ? (
          <>
            <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-3">
              {history.map((item) => (
                <div key={item.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <p className="font-semibold text-slate-300 truncate" title={item.idea}>
                    {item.idea}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-slate-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                    <button 
                      onClick={() => handleSelect(item)}
                      className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={handleClear}
              className="mt-6 w-full bg-red-800/50 text-red-300 font-bold py-2 px-4 rounded-lg hover:bg-red-800/80 transition-colors"
            >
              Clear History
            </button>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-slate-500">
            <p>Your generation history is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
