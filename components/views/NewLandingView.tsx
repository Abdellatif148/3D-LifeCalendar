import React from 'react';
import { motion } from 'framer-motion';
import LifeOrb3D from '../dashboard/LifeOrb3D';
import CubeGridPreview from '../ui/CubeGridPreview';
import ParticleBackground from '../ui/ParticleBackground';
import Navigation from '../ui/Navigation';

interface NewLandingViewProps {
    onStart: () => void;
    onNavigate: (view: string) => void;
}

const NewLandingView: React.FC<NewLandingViewProps> = ({ onStart, onNavigate }) => {
    return (
        <div className="bg-[#0F172A] text-white min-h-screen">
            <Navigation onNavigate={onNavigate} currentView="landing" />
            
            {/* Hero Section */}
            <section className="relative w-full h-screen flex items-center justify-center overflow-hidden pt-16">
                <ParticleBackground />
                <div className="absolute inset-0 aurora-background opacity-70"></div>
                <div className="absolute inset-0 bg-black/30"></div>

                <div className="relative z-10 container mx-auto px-4 flex flex-col lg:flex-row items-center h-full">
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
                        >
                            See your life in time. Change it in minutes.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mt-4 text-lg sm:text-xl text-white/80 max-w-lg"
                        >
                            An interactive calendar that shows how your habits steal or gift you years.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
                        >
                            <button 
                                onClick={onStart} 
                                className="px-8 py-3 bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-white font-bold rounded-full pulse-glow transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-400/50"
                            >
                                Start Free
                            </button>
                            <button 
                                onClick={onStart} 
                                className="px-8 py-3 border-2 border-white/50 text-white font-bold rounded-full transition-all hover:bg-white/10 hover:border-white focus:outline-none focus:ring-4 focus:ring-white/50"
                            >
                                Login
                            </button>
                        </motion.div>
                    </div>
                    <div className="hidden lg:block lg:w-1/2">
                        <LifeOrb3D currentAge={25} targetAge={80} dominantColorActivity="Work/Study" enableZoom={false} />
                    </div>
                </div>
            </section>

            {/* Feature Section */}
            <section className="py-20 bg-[#0F172A]">
                <div className="container mx-auto px-4">
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Feature 1 */}
                        <motion.div
                            className="bg-white/5 p-8 rounded-2xl shadow-lg backdrop-blur-md border border-white/10"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.8 }}
                            whileHover={{ scale: 1.05, rotateZ: 1 }}
                        >
                            <CubeGridPreview />
                            <h3 className="text-2xl font-bold text-white mt-6">Your Life in Blocks</h3>
                            <p className="mt-4 text-white/70">
                                Every week of your life as a single block. See what’s gone, what’s left, and where it’s going.
                            </p>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div
                            className="bg-white/5 p-8 rounded-2xl shadow-lg backdrop-blur-md border border-white/10"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            whileHover={{ scale: 1.05, rotateZ: -1 }}
                        >
                            <div className="w-full h-48 bg-black/20 rounded-lg p-4">
                                <div className="text-center space-y-3">
                                    <p className="text-lg text-red-400 font-semibold">-1h Social Media</p>
                                <div className="w-full h-2 bg-gray-600 rounded-full my-4">
                                    <div className="w-1/2 h-full bg-red-400 rounded-full"></div>
                                </div>
                                    <p className="text-lg text-green-400 font-semibold">+1h Reading</p>
                                <div className="w-full h-2 bg-gray-600 rounded-full my-4">
                                    <div className="w-3/4 h-full bg-green-400 rounded-full"></div>
                                </div>
                                    <p className="text-sm text-cyan-400">= +2.5 years gained</p>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mt-6">Simulate Habits</h3>
                            <p className="mt-4 text-white/70">
                                Small nudges compound into decades. Watch how tiny shifts ripple through your life.
                            </p>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div
                            className="bg-white/5 p-8 rounded-2xl shadow-lg backdrop-blur-md border border-white/10"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            whileHover={{ scale: 1.05, rotateZ: 1 }}
                        >
                            <div className="w-full h-48 bg-black/20 rounded-lg p-4 flex items-center justify-center">
                                <div className="bg-white/10 p-4 rounded-lg text-left w-full max-w-xs">
                                    <p className="font-bold">Read 20min/day</p>
                                    <p className="text-sm text-white/60">Tomorrow, 8:00 AM</p>
                                    <div className="flex items-center mt-2">
                                        <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                                        <p className="text-sm">Google Calendar</p>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mt-6">Tiny Nudges</h3>
                            <p className="mt-4 text-white/70">
                                Export personalized nudges to your phone. Stay on track with gentle reminders.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-[#0F172A]">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Your life is made of weeks. Don't waste them.</h2>
                    <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
                        Start optimizing your time today and watch how small changes create massive lifetime impact.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <button 
                            onClick={onStart} 
                            className="px-8 py-3 bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-white font-bold rounded-full pulse-glow transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-400/50"
                        >
                            Start Free
                        </button>
                        <button 
                            onClick={onStart} 
                            className="px-8 py-3 border-2 border-white/50 text-white font-bold rounded-full transition-all hover:bg-white/10 hover:border-white focus:outline-none focus:ring-4 focus:ring-white/50"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#0F172A] border-t border-white/10 py-8">
                <div className="container mx-auto px-4 text-center text-white/60">
                    <div className="flex flex-wrap justify-center space-x-4 sm:space-x-6 mb-4 text-sm">
                        <button onClick={() => onNavigate('product')} className="hover:text-white transition-colors">Product</button>
                        <button onClick={() => onNavigate('features')} className="hover:text-white transition-colors">Features</button>
                        <button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">Pricing</button>
                        <button onClick={() => onNavigate('api')} className="hover:text-white transition-colors">API</button>
                        <button onClick={() => onNavigate('company')} className="hover:text-white transition-colors">Company</button>
                        <button onClick={() => onNavigate('careers')} className="hover:text-white transition-colors">Careers</button>
                        <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">Contact</button>
                        <button onClick={() => onNavigate('blog')} className="hover:text-white transition-colors">Blog</button>
                    </div>
                    <p className="text-sm">© 2025 3D Time Optimizer. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default NewLandingView;
