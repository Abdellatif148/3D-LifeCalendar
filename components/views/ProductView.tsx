import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '../ui/Navigation';
import LifeOrb3D from '../dashboard/LifeOrb3D';

interface ProductViewProps {
    onNavigate: (view: string) => void;
}

const ProductView: React.FC<ProductViewProps> = ({ onNavigate }) => {
    return (
        <div className="bg-[#0F172A] text-white min-h-screen">
            <Navigation onNavigate={onNavigate} currentView="product" />
            
            {/* Hero Section */}
            <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 via-purple-900/30 to-black">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-4xl mx-auto">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-extrabold text-white mb-6"
                        >
                            Transform Time Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Tangible Reality</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-white/80 mb-8"
                        >
                            The world's first 3D life calendar that turns your habits into a living, breathing visualization of your future.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Product Demo */}
            <section className="py-16 bg-[#0F172A]">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-6">See Your Life as Never Before</h2>
                            <div className="space-y-4 text-white/80">
                                <p>Every week of your life becomes a glowing particle in 3D space. Past weeks fade to gray, your current week pulses with energy, and your future radiates with the colors of your dominant activities.</p>
                                <p>This isn't just another productivity app - it's a profound shift in how you perceive and optimize your time.</p>
                            </div>
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                                    <span>Interactive 3D visualization</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                                    <span>Real-time habit simulation</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                    <span>Lifetime impact calculations</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-96">
                            <LifeOrb3D currentAge={25} targetAge={80} dominantColorActivity="Work/Study" enableZoom={true} />
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 bg-gradient-to-r from-purple-900/20 to-cyan-900/20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center text-white mb-12">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">📊</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">1. Input Your Life</h3>
                            <p className="text-white/70">Tell us your age and how you spend your 24 hours. We'll create your personal life orb.</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🎛️</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">2. Simulate Changes</h3>
                            <p className="text-white/70">Adjust your daily habits with intuitive sliders and watch your life orb transform in real-time.</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">📅</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">3. Export Nudges</h3>
                            <p className="text-white/70">Turn insights into action with personalized calendar reminders that guide you toward your optimized life.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-[#0F172A]">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to See Your Life in 3D?</h2>
                    <p className="text-white/70 mb-8 max-w-2xl mx-auto">
                        Join thousands who've transformed their relationship with time.
                    </p>
                    <button
                        onClick={() => onNavigate('app')}
                        className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
                    >
                        Start Your Journey
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ProductView;