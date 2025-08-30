import React from 'react';
import { motion } from 'framer-motion';
import LifeOrb3D from '../dashboard/LifeOrb3D';
import CubeGridPreview from '../ui/CubeGridPreview';
import ParticleBackground from '../ui/ParticleBackground';

interface NewLandingViewProps {
    onStart: () => void;
    onSeeDemo: () => void;
}

const NewLandingView: React.FC<NewLandingViewProps> = ({ onStart, onSeeDemo }) => {
    return (
        <div className="bg-[#0F172A] text-white min-h-screen">
            {/* Hero Section */}
            <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
                <ParticleBackground />
                <div className="absolute inset-0 aurora-background opacity-70"></div>
                <div className="absolute inset-0 bg-black/30"></div>

                <div className="relative z-10 container mx-auto px-4 flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-6xl font-extrabold text-white"
                        >
                            See your life in time. Change it in minutes.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mt-4 text-xl text-white/80"
                        >
                            An interactive calendar that shows how your habits steal or gift you years.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mt-8 flex justify-center lg:justify-start space-x-4"
                        >
                            <button onClick={onStart} className="px-8 py-3 bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-white font-bold rounded-full pulse-glow transition-transform hover:scale-105">
                                Start Free
                            </button>
                            <button onClick={onSeeDemo} className="px-8 py-3 border-2 border-white/50 text-white font-bold rounded-full transition-all hover:bg-white/10 hover:border-white">
                                See Demo
                            </button>
                        </motion.div>
                    </div>
                    <div className="lg:w-1/2 h-full flex items-center justify-center">
                        <div className="w-full h-[50vh] lg:h-[80vh]">
                            <LifeOrb3D currentAge={25} targetAge={80} dominantColorActivity="Work/Study" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Section */}
            <section className="py-20 bg-[#0F172A]">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-12">
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
                                <p className="text-center text-lg text-red-400">-1h TikTok</p>
                                <div className="w-full h-2 bg-gray-600 rounded-full my-4">
                                    <div className="w-1/2 h-full bg-red-400 rounded-full"></div>
                                </div>
                                <p className="text-center text-lg text-green-400">+2 years Reading</p>
                                <div className="w-full h-2 bg-gray-600 rounded-full my-4">
                                    <div className="w-3/4 h-full bg-green-400 rounded-full"></div>
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
                    <h2 className="text-4xl font-extrabold text-white">Your life is made of weeks. Don’t waste them.</h2>
                    <div className="mt-8 flex justify-center space-x-4">
                        <button onClick={onStart} className="px-8 py-3 bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-white font-bold rounded-full pulse-glow transition-transform hover:scale-105">
                            Start Free
                        </button>
                        <button onClick={onSeeDemo} className="px-8 py-3 border-2 border-white/50 text-white font-bold rounded-full transition-all hover:bg-white/10 hover:border-white">
                            See Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#0F172A] border-t border-white/10 py-8">
                <div className="container mx-auto px-4 text-center text-white/60">
                    <div className="flex justify-center space-x-6 mb-4">
                        <a>Product</a>
                        <a>Features</a>
                        <a>Pricing</a>
                        <a>API</a>
                        <a>Company</a>
                        <a>Careers</a>
                        <a>Contact</a>
                        <a>Blog</a>
                    </div>
                    <p>© 2025 LifeCalendar. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default NewLandingView;
