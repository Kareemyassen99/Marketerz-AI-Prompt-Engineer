
import React from 'react';
import type { GeneratedPrompt } from '../types';
import PromptCard from './PromptCard';

interface PromptOutputDisplayProps {
  idea: string;
  prompts: GeneratedPrompt[];
  onRegenerate: (category: string) => void;
  regeneratingCategory: string | null;
}

const PromptOutputDisplay: React.FC<PromptOutputDisplayProps> = ({ idea, prompts, onRegenerate, regeneratingCategory }) => (
  <div className="mt-10 space-y-6">
    <h3 className="text-2xl font-bold text-center text-slate-300">Your Engineered Prompts</h3>
    {prompts.map((prompt, index) => (
      <PromptCard 
        key={index}
        idea={idea} 
        promptData={prompt}
        onRegenerate={onRegenerate}
        isRegenerating={regeneratingCategory === prompt.category}
      />
    ))}
  </div>
);

export default PromptOutputDisplay;
