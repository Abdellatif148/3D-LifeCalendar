import React from 'react';
import Button from '../ui/Button';

interface LandingViewProps {
    onStart: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onStart }) => {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" aria-hidden="true"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-2 h-2 bg-primary-400 rounded-full animate-float opacity-60" aria-hidden="true"></div>
            <div className="absolute top-40 right-20 w-1 h-1 bg-accent-400 rounded-full animate-float opacity-40" style={{ animationDelay: '2s' }} aria-hidden="true"></div>
            <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-primary-300 rounded-full animate-float opacity-50" style={{ animationDelay: '4s' }} aria-hidden="true"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center">
                <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                    <div className="space-y-6">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                            See your life in{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">
                                time
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Transform your weeks into wisdom. Visualize your habits, understand your patterns, and build a more intentional future with our 3D Time Optimizer.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <Button 
                            onClick={onStart} 
                            size="xl"
                            className="shadow-glow hover:shadow-glow-lg"
                        >
                            Start Your Journey
                        </Button>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Free forever • No signup required
                        </p>
                    </div>
                </div>
                
                {/* Feature Grid */}
                <div className="mt-24 max-w-6xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3D Visualization</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Experience your entire life as an interactive 3D grid, making time tangible and meaningful
                            </p>
                        </div>
                        
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Smart Optimization</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Discover how small daily changes compound into life-changing transformations over time
                            </p>
                        </div>
                        
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Intelligent Planning</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Plan your days, weeks, and years with AI-powered insights and beautiful interfaces
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                .bg-grid-pattern {
                    background-image:
                        linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px);
                    background-size: 60px 60px;
                }
            `}</style>
        </main>
    );
};

export default LandingView;