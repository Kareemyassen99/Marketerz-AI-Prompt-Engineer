
import React from 'react';

interface IdeaInputFormProps {
  idea: string;
  setIdea: (idea: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const IdeaInputForm: React.FC<IdeaInputFormProps> = ({ idea, setIdea, onGenerate, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };
  
  return (
    <div className="my-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g., A new eco-friendly subscription box for indoor plants..."
          className="w-full h-32 p-4 bg-slate-800 border-2 border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 placeholder-slate-500 resize-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !idea.trim()}
          className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all duration-300 disabled:bg-slate-700 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Engineering...
            </>
          ) : (
            'Generate Prompts'
          )}
        </button>
      </form>
    </div>
  );
};

export default IdeaInputForm;
