
import React from 'react';

interface ExampleIdeasProps {
  onSelectExample: (idea: string) => void;
}

const examples = [
  {
    title: "AI Travel Planner",
    description: "A mobile app that uses AI to create personalized travel itineraries.",
  },
  {
    title: "Eco-Friendly Cleaning",
    description: "A direct-to-consumer brand for sustainable, zero-waste cleaning products.",
  },
  {
    title: "Creative Business School",
    description: "An online course platform for creative professionals to learn business skills.",
  },
  {
    title: "Smart Home Gardening",
    description: "A subscription box service for indoor plants that includes smart sensors to monitor plant health."
  }
];

const ExampleIdeas: React.FC<ExampleIdeasProps> = ({ onSelectExample }) => {
  return (
    <div className="my-10">
      <h3 className="text-xl font-bold text-center text-slate-300 mb-2">Not Sure Where to Start?</h3>
      <p className="text-center text-slate-500 mb-6">Pick an example idea to see how it works.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {examples.map((example) => (
          <button
            key={example.title}
            onClick={() => onSelectExample(example.description)}
            className="bg-slate-800 border border-slate-700 rounded-lg p-5 text-left flex flex-col justify-between transition-all hover:border-cyan-500/50 hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
          >
            <div>
              <h4 className="font-bold text-slate-200">{example.title}</h4>
              <p className="text-sm text-slate-400 mt-2">{example.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExampleIdeas;
