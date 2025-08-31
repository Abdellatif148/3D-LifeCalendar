import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '../ui/Navigation';

interface CareersViewProps {
    onNavigate: (view: string) => void;
}

const CareersView: React.FC<CareersViewProps> = ({ onNavigate }) => {
    const openings = [
        {
            title: 'Senior Frontend Engineer',
            department: 'Engineering',
            location: 'Remote / San Francisco',
            type: 'Full-time',
            description: 'Join our team building the future of 3D data visualization with React, Three.js, and WebGL.',
            requirements: ['5+ years React experience', 'Three.js/WebGL expertise', 'Performance optimization skills']
        },
        {
            title: 'Product Designer',
            department: 'Design',
            location: 'Remote / New York',
            type: 'Full-time',
            description: 'Design beautiful, intuitive interfaces that make complex time data accessible to everyone.',
            requirements: ['3+ years product design', 'Figma expertise', 'Data visualization experience']
        },
        {
            title: 'Data Scientist',
            department: 'Research',
            location: 'Remote',
            type: 'Full-time',
            description: 'Develop algorithms that turn life data into actionable insights and predictions.',
            requirements: ['PhD in relevant field', 'Python/R expertise', 'Machine learning experience']
        },
        {
            title: 'DevOps Engineer',
            department: 'Infrastructure',
            location: 'Remote',
            type: 'Full-time',
            description: 'Scale our infrastructure to support millions of users and real-time 3D rendering.',
            requirements: ['AWS/GCP experience', 'Kubernetes expertise', 'Performance monitoring']
        }
    ];

    const benefits = [
        '🏠 100% Remote-first culture',
        '💰 Competitive salary + equity',
        '🏥 Premium health insurance',
        '🌴 Unlimited PTO policy',
        '📚 $2,000 learning budget',
        '💻 Top-tier equipment',
        '🎯 Quarterly team retreats',
        '🚀 Stock option program'
    ];

    return (
        <div className="bg-[#0F172A] text-white min-h-screen">
            <Navigation onNavigate={onNavigate} currentView="careers" />
            
            {/* Hero Section */}
            <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 via-purple-900/30 to-black">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-extrabold text-white mb-6"
                    >
                        Join Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Mission</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-white/80 max-w-3xl mx-auto mb-8"
                    >
                        Help us build the future of time optimization and human potential. Work with cutting-edge technology while making a meaningful impact on people's lives.
                    </motion.p>
                    <button
                        onClick={() => onNavigate('contact')}
                        className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
                    >
                        Get In Touch
                    </button>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 bg-gradient-to-r from-purple-900/20 to-cyan-900/20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-white mb-12">Why Work With Us</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/5 p-4 rounded-xl backdrop-blur-md border border-white/10 text-center"
                            >
                                <p className="text-white/80">{benefit}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-16 bg-[#0F172A]">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-white mb-12">Open Positions</h2>
                    <div className="max-w-4xl mx-auto space-y-6">
                        {openings.map((job, index) => (
                            <motion.div
                                key={job.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/5 p-8 rounded-2xl backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
                                        <div className="flex flex-wrap gap-3 text-sm">
                                            <span className="px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full">{job.department}</span>
                                            <span className="px-3 py-1 bg-purple-400/20 text-purple-400 rounded-full">{job.location}</span>
                                            <span className="px-3 py-1 bg-green-400/20 text-green-400 rounded-full">{job.type}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onNavigate('contact')}
                                        className="mt-4 md:mt-0 px-6 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-medium rounded-full hover:scale-105 transition-transform"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                                <p className="text-white/70 mb-4">{job.description}</p>
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-2">Requirements:</h4>
                                    <ul className="space-y-1">
                                        {job.requirements.map((req, i) => (
                                            <li key={i} className="flex items-center text-sm text-white/60">
                                                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3"></div>
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Culture Section */}
            <section className="py-16 bg-gradient-to-r from-cyan-900/20 to-purple-900/20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-8">Our Culture</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white/5 p-6 rounded-xl backdrop-blur-md border border-white/10">
                            <div className="text-3xl mb-4">🌍</div>
                            <h3 className="text-lg font-bold text-white mb-2">Global Impact</h3>
                            <p className="text-white/70 text-sm">We're building tools that help millions optimize their most precious resource.</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-xl backdrop-blur-md border border-white/10">
                            <div className="text-3xl mb-4">🧠</div>
                            <h3 className="text-lg font-bold text-white mb-2">Continuous Learning</h3>
                            <p className="text-white/70 text-sm">We invest heavily in our team's growth and development.</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-xl backdrop-blur-md border border-white/10">
                            <div className="text-3xl mb-4">⚖️</div>
                            <h3 className="text-lg font-bold text-white mb-2">Work-Life Balance</h3>
                            <p className="text-white/70 text-sm">We practice what we preach - optimizing time for meaningful work and life.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CareersView;