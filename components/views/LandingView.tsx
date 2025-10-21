
import React from 'react';
import Button from '../ui/Button';

interface LandingViewProps {
    onStart: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onStart }) => {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5" aria-hidden="true"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-60" aria-hidden="true"></div>
            <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40" aria-hidden="true"></div>
            <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse opacity-50" aria-hidden="true"></div>
            
            <div className="relative z-10">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-6 animate-fade-in-down leading-tight">
                    See your life in time.
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-in-up leading-relaxed px-4">
                    Change it in minutes. Visualize your weeks, understand your habits, and build a more intentional future with the 3D Time Optimizer.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
                <Button 
                    onClick={onStart} 
                    size="lg"
                    className="text-lg px-8 py-4 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
                >
                    Start Free
                </Button>
                    <p className="text-sm text-gray-400">No signup required • Start in seconds</p>
                </div>
                
                {/* Feature highlights */}
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in-up animation-delay-600">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">3D Visualization</h3>
                        <p className="text-gray-400 text-sm">See your entire life as an interactive 3D grid</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Time Optimization</h3>
                        <p className="text-gray-400 text-sm">Simulate how small changes impact your lifetime</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Smart Planning</h3>
                        <p className="text-gray-400 text-sm">Plan your days, weeks, and years intelligently</p>
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down { 
                    animation: fade-in-down 0.8s ease-out forwards; 
                }
                .animate-fade-in-up { 
                    animation: fade-in-up 0.8s ease-out 0.2s forwards; 
                    opacity: 0;
                }
                .animation-delay-400 {
                    animation-delay: 0.4s;
                }
                .animation-delay-600 {
                    animation-delay: 0.6s;
                }
                .bg-grid-pattern {
                    background-image:
                        linear-gradient(to right, rgba(139, 92, 246, 0.05) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(139, 92, 246, 0.05) 1px, transparent 1px);
                    background-size: 60px 60px;
                }
            `}</style>
        </main>
    );
};

export default LandingView;
