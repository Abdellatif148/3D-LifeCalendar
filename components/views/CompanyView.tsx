import React from 'react';
import { motion } from 'framer-motion';
import Navigation from '../ui/Navigation';

interface CompanyViewProps {
    onNavigate: (view: string) => void;
}

const CompanyView: React.FC<CompanyViewProps> = ({ onNavigate }) => {
    const team = [
        {
            name: 'Alex Chen',
            role: 'CEO & Founder',
            bio: 'Former Google engineer passionate about time optimization and human potential.',
            image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
            name: 'Sarah Johnson',
            role: 'CTO',
            bio: 'Ex-Tesla software architect specializing in 3D visualization and real-time systems.',
            image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
            name: 'Marcus Rodriguez',
            role: 'Head of Design',
            bio: 'Award-winning UX designer from Apple, focused on making complex data beautiful.',
            image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
            name: 'Dr. Emily Watson',
            role: 'Chief Science Officer',
            bio: 'Behavioral psychologist and researcher in habit formation and time perception.',
            image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400'
        }
    ];

    const values = [
        {
            icon: '🎯',
            title: 'Purpose-Driven',
            description: 'We believe every moment matters and should be lived with intention.'
        },
        {
            icon: '🚀',
            title: 'Innovation First',
            description: 'We push the boundaries of what\'s possible in data visualization and user experience.'
        },
        {
            icon: '🤝',
            title: 'Human-Centered',
            description: 'Technology should serve humanity, not the other way around.'
        },
        {
            icon: '🌱',
            title: 'Continuous Growth',
            description: 'We\'re committed to helping people grow and optimize their lives every day.'
        }
    ];

    return (
        <div className="bg-[#0F172A] text-white min-h-screen">
            <Navigation onNavigate={onNavigate} currentView="company" />
            
            {/* Hero Section */}
            <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 via-purple-900/30 to-black">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-extrabold text-white mb-6"
                    >
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">3D Time Optimizer</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-white/80 max-w-3xl mx-auto"
                    >
                        We're on a mission to help people visualize, understand, and optimize their most precious resource: time.
                    </motion.p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 bg-[#0F172A]">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
                            <p className="text-white/80 text-lg mb-6">
                                Time is the one resource we can never get back, yet most people have no clear picture of how they're spending it or how small changes could transform their lives.
                            </p>
                            <p className="text-white/80 text-lg mb-6">
                                We created 3D Time Optimizer to make time tangible, visual, and actionable. By turning abstract concepts into beautiful 3D visualizations, we help people make better decisions about their daily habits.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                    <span>Founded in 2024 by time optimization experts</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                    <span>Backed by leading productivity researchers</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span>Trusted by 50,000+ users worldwide</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-md border border-white/10">
                            <div className="text-center">
                                <div className="text-6xl mb-4">⏰</div>
                                <h3 className="text-2xl font-bold text-white mb-4">The Time Crisis</h3>
                                <p className="text-white/70">
                                    The average person lives 4,000 weeks. Most spend them unconsciously, 
                                    never realizing how small daily changes could add years to their life.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 bg-gradient-to-r from-purple-900/20 to-cyan-900/20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-white mb-12">Our Values</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-4xl mb-4">{value.icon}</div>
                                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                                <p className="text-white/70">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 bg-[#0F172A]">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-white mb-12">Meet Our Team</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/5 p-6 rounded-2xl backdrop-blur-md border border-white/10 text-center hover:border-white/20 transition-all duration-300"
                            >
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                                />
                                <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                                <p className="text-cyan-400 text-sm mb-3">{member.role}</p>
                                <p className="text-white/70 text-sm">{member.bio}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gradient-to-r from-cyan-900/20 to-purple-900/20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-cyan-400 mb-2">50K+</div>
                            <p className="text-white/70">Active Users</p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-purple-400 mb-2">2M+</div>
                            <p className="text-white/70">Life Weeks Visualized</p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-green-400 mb-2">15K+</div>
                            <p className="text-white/70">Years Optimized</p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-yellow-400 mb-2">98%</div>
                            <p className="text-white/70">User Satisfaction</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CompanyView;