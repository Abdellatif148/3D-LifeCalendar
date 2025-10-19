import React from 'react';
import Button from '../ui/Button';

interface LandingViewProps {
  onStart: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4 bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900">
      <div className="relative z-10">
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4 animate-fade-in-down">
          See your life in time.
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8 animate-fade-in-up">
          Change it in minutes. Visualize your weeks, understand your habits,
          and build a more intentional future with the 3D Time Optimizer.
        </p>
        <Button onClick={onStart} className="text-lg">
          Start Free
        </Button>
      </div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      {/* FIX: Removed the 'jsx' prop from the <style> tag.
                This syntax is specific to libraries like styled-jsx
                and is not supported in a standard React setup, causing a type error. */}
      <style>{`
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }
                .animate-fade-in-up { animation: fade-in-up 0.8s ease-out 0.2s forwards; }
                .bg-grid-pattern {
                    background-image:
                        linear-gradient(to right, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
                    background-size: 40px 40px;
                }
            `}</style>
    </div>
  );
};

export default LandingView;
