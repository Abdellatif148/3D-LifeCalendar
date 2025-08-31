import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '../ui/Navigation';
import CubeGridPreview from '../ui/CubeGridPreview';
import LifeOrb3D from '../dashboard/LifeOrb3D';

interface FeaturesViewProps {
    onNavigate: (view: string) => void;
}

const FeaturesView: React.FC<FeaturesViewProps> = ({ onNavigate }) => {
    const features = [
        {
            icon: '🌌',
            title: '3D Life Visualization',
            description: 'See your entire life as a beautiful 3D orb where each particle represents one week of your existence.',
            details: ['Interactive 3D navigation', 'Real-time particle updates', 'Color-coded activity mapping']
        },
        {
            icon: '⚡',
            title: 'Real-Time Simulation',
            description: 'Adjust your daily habits and instantly see how they reshape your entire future.',
            details: ['Live habit adjustment', 'Instant visual feedback', 'Compound effect visualization']
        },
        {
            icon: '📊',
            title: 'Lifetime Impact Analysis',
            description: 'Understand how small daily changes create massive lifetime transformations.',
            details: ['Life expectancy calculations', 'Time allocation insights', 'Habit impact metrics']
        },
        {
            icon: '📱',
            title: 'Smart Nudge System',
            description: 'Export personalized calendar reminders that gently guide you toward your optimized life.',
            details: ['Calendar integration', 'Customizable reminders', 'Progress tracking']
        },
        {
            icon: '🔒',
            title: 'Secure & Private',
            description: 'Your life data is encrypted and stored securely with enterprise-grade protection.',
            details: ['End-to-end encryption', 'GDPR compliant', 'Data ownership control']
        },
        {
            icon: '📈',
            title: 'Progress Analytics',
            description: 'Track your optimization journey with detailed analytics and insights.',
            details: ['Habit tracking', 'Goal achievement metrics', 'Long-term trend analysis']
        }
    ];

    return (
        <div className="bg-[#0F172A] text-white min-h-screen">
            <Navigation onNavigate={onNavigate} currentView="features" />
            
            {/* Hero Section */}
            <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 via-purple-900/30 to-black">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-extrabold text-white mb-6"
                    >
                        Powerful Features for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Life Optimization</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-white/80 max-w-3xl mx-auto"
                    >
                        Every feature is designed to help you understand, visualize, and optimize your most precious resource: time.
                    </motion.p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 bg-[#0F172A]">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/5 p-8 rounded-2xl backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 group"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-white/70 mb-4">{feature.description}</p>
                                <ul className="space-y-2">
                                    {feature.details.map((detail, i) => (
                                        <li key={i} className="flex items-center text-sm text-white/60">
                                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3"></div>
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Interactive Demo */}
            <section className="py-16 bg-gradient-to-r from-purple-900/20 to-cyan-900/20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-white mb-4">Experience the Magic</h2>
                        <p className="text-white/70 max-w-2xl mx-auto">
                            See how your life transforms when you make small, intentional changes to your daily routine.
                        </p>
                    </div>
                    <div className="bg-white/5 rounded-3xl p-8 backdrop-blur-md border border-white/10">
                        <CubeGridPreview />
                        <div className="text-center mt-6">
                            <p className="text-white/70 mb-4">Interactive preview of your life calendar</p>
                            <button
                                onClick={() => onNavigate('app')}
                                className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
                            >
                                Try It Now
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technical Specs */}
            <section className="py-16 bg-[#0F172A]">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-white mb-12">Technical Excellence</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-2xl mb-2">⚡</div>
                            <h3 className="font-bold text-white mb-2">Lightning Fast</h3>
                            <p className="text-sm text-white/70">Optimized WebGL rendering for smooth 60fps interactions</p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl mb-2">📱</div>
                            <h3 className="font-bold text-white mb-2">Mobile Ready</h3>
                            <p className="text-sm text-white/70">Responsive design that works perfectly on all devices</p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl mb-2">🔐</div>
                            <h3 className="font-bold text-white mb-2">Enterprise Security</h3>
                            <p className="text-sm text-white/70">Bank-level encryption and privacy protection</p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl mb-2">☁️</div>
                            <h3 className="font-bold text-white mb-2">Cloud Sync</h3>
                            <p className="text-sm text-white/70">Access your life data anywhere, anytime</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Feature Demo */}
            <section className="py-16 bg-gradient-to-r from-purple-900/20 to-cyan-900/20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-white mb-4">Interactive 3D Experience</h2>
                        <p className="text-white/70 max-w-2xl mx-auto">
                            Experience the magic of seeing your life in 3D. Each particle represents one week of your existence.
                        </p>
                    </div>
                    <div className="bg-white/5 rounded-3xl p-8 backdrop-blur-md border border-white/10">
                        <div className="h-96 mb-6">
                            <LifeOrb3D currentAge={30} targetAge={85} dominantColorActivity="Hobbies" enableZoom={true} />
                        </div>
                        <div className="text-center">
                            <p className="text-white/70 mb-4">Try dragging to rotate • Scroll to zoom • Watch the particles dance</p>
                            <button
                                onClick={() => onNavigate('app')}
                                className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
                            >
                                Create Your Own Orb
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProductView;