
import React, { useState } from 'react';
import type { GeneratedPrompt, SharedPromptData } from '../types';
import { generateImage } from '../services/geminiService';

interface PromptCardProps {
  idea: string;
  promptData: GeneratedPrompt;
  onRegenerate: (category: string) => void;
  isRegenerating: boolean;
}

const CategoryIcon: React.FC<{ category: string }> = ({ category }) => {
  // FIX: Replaced JSX.Element with React.ReactNode to resolve namespace error.
  const iconMap: { [key: string]: React.ReactNode } = {
    'Strategy': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" /></svg>,
    'Creative Copy': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>,
    'Technical Spec': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" /></svg>,
    'Social Hooks': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>,
    'Image Prompt': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm1.5-6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" /></svg>,
  };
  return iconMap[category] || <div className="w-6 h-6"></div>;
};

const PromptCard: React.FC<PromptCardProps> = ({ idea, promptData, onRegenerate, isRegenerating }) => {
  const { category, purpose, tokensHint, expectedOutputSize, prompt } = promptData;
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const shareData: SharedPromptData = {
      idea: idea,
      prompt: promptData,
    };
    try {
      const jsonString = JSON.stringify(shareData);
      const base64Data = btoa(jsonString); // Encode to Base64
      const url = `${window.location.origin}${window.location.pathname}#share=${base64Data}`;
      
      navigator.clipboard.writeText(url).then(() => {
        setShared(true);
        setTimeout(() => setShared(false), 2500);
      });
    } catch (e) {
      console.error("Failed to create share link:", e);
      alert("Could not create a shareable link.");
    }
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    setImageError(null);
    setGeneratedImage(null);
    try {
        const base64Image = await generateImage(prompt);
        setGeneratedImage(`data:image/jpeg;base64,${base64Image}`);
    } catch (err) {
        setImageError(err instanceof Error ? err.message : 'An unknown error occurred during image generation.');
    } finally {
        setIsGeneratingImage(false);
    }
  };


  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:border-cyan-500/50">
      <div className="p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2 bg-slate-700 rounded-full text-cyan-400">
            <CategoryIcon category={category} />
          </div>
          <h4 className="text-xl font-bold text-slate-100">{category}</h4>
        </div>

        <p className="text-slate-400 italic mb-4">“{purpose}”</p>
        
        <div className="flex flex-col sm:flex-row gap-4 text-sm mb-5">
          <div className="flex-1 bg-slate-700/50 p-3 rounded-md">
            <p className="font-semibold text-slate-300">Tokens Hint</p>
            <p className="text-slate-400">{tokensHint}</p>
          </div>
          <div className="flex-1 bg-slate-700/50 p-3 rounded-md">
            <p className="font-semibold text-slate-300">Expected Output Size</p>
            <p className="text-slate-400">{expectedOutputSize}</p>
          </div>
        </div>
        
        <div className="relative">
           <div className="absolute top-2 right-2 flex items-center gap-2">
            <button
              onClick={() => onRegenerate(category)}
              disabled={isRegenerating || isGeneratingImage}
              className="p-2 bg-slate-600 rounded-md hover:bg-slate-500 text-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Regenerate this prompt"
            >
              {isRegenerating ? (
                <svg className="animate-spin h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0c3.221-3.221 3.221-8.456 0-11.667a8.25 8.25 0 0 0-11.667 0c-3.221 3.221-3.221 8.456 0 11.667Zm10.607-1.06-3.182-3.182m0 0-3.181 3.182m3.181-3.182 3.182 3.182" />
                </svg>
              )}
            </button>
            <button
              onClick={handleShare}
              disabled={isRegenerating || shared || isGeneratingImage}
              className="p-2 bg-slate-600 rounded-md hover:bg-slate-500 text-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Copy share link"
            >
                {shared ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-400"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                  </svg>
                )}
            </button>
            <button
              onClick={handleCopy}
              disabled={isRegenerating || isGeneratingImage}
              className="p-2 bg-slate-600 rounded-md hover:bg-slate-500 text-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Copy prompt"
            >
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 0 1-2.25 2.25h-1.5a2.25 2.25 0 0 1-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" /></svg>
              )}
            </button>
          </div>
          <pre className="bg-slate-900 p-4 rounded-md overflow-x-auto">
            <code className="text-slate-300 text-sm whitespace-pre-wrap font-mono">
              {prompt}
            </code>
          </pre>
        </div>
      </div>
      {category === 'Image Prompt' && (
        <div className="p-5 border-t border-slate-700 space-y-4">
            {generatedImage && (
                <div>
                    <h5 className="text-base font-semibold text-slate-300 mb-2">Generated Image:</h5>
                    <img src={generatedImage} alt="AI generated image based on the prompt" className="rounded-lg w-full border-2 border-slate-600" />
                </div>
            )}
            {isGeneratingImage && (
                <div className="flex items-center justify-center gap-2 text-slate-400 h-10">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating your image...</span>
                </div>
            )}
            {imageError && (
                <div className="text-red-300 text-sm text-center p-3 bg-red-900/50 rounded-md border border-red-700">
                    <p><strong className="font-semibold">Image Generation Failed:</strong> {imageError}</p>
                </div>
            )}
            {!isGeneratingImage && (
                <button
                    onClick={handleGenerateImage}
                    disabled={isRegenerating}
                    className="w-full flex items-center justify-center gap-2 bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-500 transition-all duration-300 disabled:bg-slate-700 disabled:cursor-not-allowed"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm1.5-6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                    </svg>
                    <span>{generatedImage ? 'Regenerate Image' : 'Generate Image'}</span>
                </button>
            )}
        </div>
      )}
    </div>
  );
};

export default PromptCard;
