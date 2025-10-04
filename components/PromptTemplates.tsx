import React, { useState } from 'react';
import type { PromptTemplate, PromptCategory } from '../types';
import { ALL_PROMPT_CATEGORIES } from '../types';

interface PromptTemplatesProps {
  onSelectTemplate: (template: string) => void;
}

const templates: PromptTemplate[] = [
  {
    title: "New Product Launch",
    description: "A structured template for launching a new product, covering the target audience, key features, and marketing channels.",
    template: `Launch campaign for a new product.\n\nProduct Name: [Your Product Name]\nTarget Audience: [Describe your ideal customer]\nKey Features: \n- [Feature 1 and its benefit]\n- [Feature 2 and its benefit]\n- [Feature 3 and its benefit]\nUnique Selling Proposition: [What makes your product different?]\nPrimary Marketing Channels: [e.g., Instagram, Email Marketing, Content Blog]`,
    category: 'Strategy'
  },
  {
    title: "Social Media Content Series",
    description: "Plan a cohesive series of posts for a social media platform. Define the theme, post types, and call to action.",
    template: `A 5-part content series for social media.\n\nPlatform: [e.g., TikTok, LinkedIn, Instagram]\nCampaign Theme: [e.g., 'Behind the Scenes', 'Customer Success Stories']\nContent Formats: [e.g., Short-form video, Carousel posts, Infographics]\nKey Message: [The core message you want to communicate]\nCall to Action: [What should the audience do after seeing the content?]`,
    category: 'Social Hooks'
  },
  {
    title: "Brand Awareness Campaign",
    description: "Outline a campaign focused on increasing brand recognition and reaching a new audience segment.",
    template: `Brand awareness campaign strategy.\n\nBrand Name: [Your Brand]\nCore Brand Message: [Your brand's mission or value proposition]\nNew Audience Segment: [Describe the new audience you want to reach]\nCampaign Hook: [A creative angle or big idea for the campaign]\nKey Performance Indicators (KPIs): [e.g., Reach, Impressions, Website Traffic]`,
    category: 'Strategy'
  },
    {
    title: "A/B Test Ad Copy",
    description: "Generate variations of ad copy to test which message resonates best with your audience.",
    template: `A/B test for ad copy on [Platform, e.g., Facebook Ads].\n\nProduct: [Product Name]\nTarget Audience: [Describe Audience]\nKey Benefit to Highlight: [Main benefit]\nAd Copy Variation A (Control): [Your initial ad copy]\nAd Copy Variation B (Hypothesis): [Your new ad copy with one key change]\nMetric for Success: [e.g., Click-Through Rate (CTR), Conversion Rate]`,
    category: 'Creative Copy'
  },
  {
    title: "Landing Page Specification",
    description: "Create a technical specification for a new landing page, detailing all required sections and functionality.",
    template: `Technical specification for a new landing page.\n\nPage Goal: [e.g., Collect email sign-ups for a webinar]\n\nSections Required:\n- Hero Section: [Headline, Sub-headline, CTA Button Text]\n- Features/Benefits Section: [List 3-5 key features and their benefits]\n- Social Proof Section: [e.g., Customer testimonials, logos of companies]\n- About Us Section: [Brief company description]\n- Sign-up Form: [Fields required: Name, Email]\n\nTechnical Notes: [e.g., Must be mobile-responsive, Page load speed under 2 seconds]`,
    category: 'Technical Spec'
  },
  {
    title: "Image Generation for Ad",
    description: "Craft a detailed prompt for an AI image generator to create a compelling visual for an advertisement.",
    template: `AI image generation prompt for an ad campaign.\n\nStyle: [e.g., Photorealistic, Cinematic, 3D Render, illustration]\nSubject: [Detailed description of the main subject]\nScene: [Describe the background, lighting, and environment]\nMood/Atmosphere: [e.g., Energetic and vibrant, Calm and serene, Mysterious]\nColor Palette: [e.g., Warm tones, Cool blues, Monochromatic]\nAspect Ratio: [e.g., 16:9 for banners, 1:1 for social media posts]\nNegative Prompts: [Things to avoid, e.g., text, blurry background]`,
    category: 'Image Prompt'
  },
  {
    title: "Cinematic Video Ad",
    description: "Create a scene-by-scene script for a short, engaging video advertisement.",
    template: `Short video ad script (30 seconds).\n\nProduct: [Your Product]\nTarget Audience: [Describe Audience]\n\nScene 1 (0-5s):\n- Visuals: [Describe a captivating opening shot]\n- Voiceover/Text: [A strong hook or question]\n\nScene 2 (5-20s):\n- Visuals: [Show the product in action, demonstrating its key benefit]\n- Voiceover/Text: [Explain the problem and how the product solves it]\n\nScene 3 (20-25s):\n- Visuals: [Show a happy customer or a satisfying result]\n- Voiceover/Text: [Reinforce the main benefit]\n\nScene 4 (25-30s):\n- Visuals: [Product shot with clear branding and logo]\n- Voiceover/Text: [Clear Call to Action, e.g., 'Shop Now', 'Learn More']`,
    category: 'Video Prompt'
  },
  {
    title: "Unboxing Video Concept",
    description: "Structure an 'unboxing' style video to showcase a product's packaging and first impressions.",
    template: `Unboxing video concept for [Product Name].\n\nKey Message: Highlight the premium experience and key features from the moment it's opened.\nMusic/Voiceover Style: [e.g., Upbeat, calm, voiceover with key points]\n\nShot 1: The box arrives. Show the branded packaging.\nShot 2: The unboxing process. Slow, satisfying shots of opening the package.\nShot 3: The 'reveal' of the product inside. Focus on the main product.\nShot 4: Close-ups of key features or included accessories.\nShot 5: Final shot of the product set up and ready to use, with a call to action overlay.`,
    category: 'Video Prompt'
  }
];

const PromptTemplates: React.FC<PromptTemplatesProps> = ({ onSelectTemplate }) => {
  const [filter, setFilter] = useState<PromptCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter(template => {
    const categoryMatch = filter === 'All' || template.category === filter;
    
    const query = searchQuery.trim().toLowerCase();
    const searchMatch = query === '' ||
      template.title.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query);

    return categoryMatch && searchMatch;
  });

  const filterButtonClasses = (isActive: boolean) => 
    `text-xs font-semibold py-2 px-4 rounded-full transition-colors duration-200 ${
      isActive
        ? 'bg-indigo-600 text-white shadow-md'
        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
    }`;

  return (
    <div className="my-10">
      <h3 className="text-xl font-bold text-center text-slate-300 mb-2">Start with a Template</h3>
      <p className="text-center text-slate-500 mb-6">Need inspiration? Use a structured template to guide your idea.</p>
      
      <div className="relative mb-6 max-w-lg mx-auto">
        <input
          type="search"
          placeholder="Search templates by keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-800 border-2 border-slate-700 rounded-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 placeholder-slate-500"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => setFilter('All')}
          className={filterButtonClasses(filter === 'All')}
        >
          All Templates
        </button>
        {ALL_PROMPT_CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={filterButtonClasses(filter === category)}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <div key={template.title} className="bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col justify-between transition-all hover:border-indigo-500/50">
              <div>
                <h4 className="font-bold text-slate-200">{template.title}</h4>
                <p className="text-sm text-slate-400 mt-2 mb-4">{template.description}</p>
                <span className="text-xs font-medium bg-slate-700 text-cyan-400 py-1 px-2 rounded-md">{template.category}</span>
              </div>
              <button
                onClick={() => onSelectTemplate(template.template)}
                className="w-full mt-auto bg-slate-700 text-slate-200 font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 transition-colors text-sm pt-4"
              >
                Use Template
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-4 bg-slate-800 rounded-lg">
          <p className="text-slate-400">No templates found matching your criteria.</p>
          <button 
            onClick={() => {
              setFilter('All');
              setSearchQuery('');
            }} 
            className="mt-4 text-indigo-400 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default PromptTemplates;