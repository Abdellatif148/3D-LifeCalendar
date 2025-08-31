import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface NavigationProps {
    onNavigate: (view: string) => void;
    currentView?: string;
}

const Navigation: React.FC<NavigationProps> = ({ onNavigate, currentView = 'landing' }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { name: 'Product', view: 'product' },
        { name: 'Features', view: 'features' },
        { name: 'Pricing', view: 'pricing' },
        { name: 'API', view: 'api' },
        { name: 'Company', view: 'company' },
        { name: 'Careers', view: 'careers' },
        { name: 'Contact', view: 'contact' },
        { name: 'Blog', view: 'blog' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <button 
                        onClick={() => onNavigate('landing')}
                        className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 hover:scale-105 transition-transform"
                    >
                        3D Time Optimizer
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <button
                                key={item.view}
                                onClick={() => onNavigate(item.view)}
                                className={`text-sm font-medium transition-colors hover:text-cyan-400 ${
                                    currentView === item.view ? 'text-cyan-400' : 'text-white/80'
                                }`}
                            >
                                {item.name}
                            </button>
                        ))}
                        <button
                            onClick={() => onNavigate('app')}
                            className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-medium rounded-full hover:scale-105 transition-transform"
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-white hover:text-cyan-400 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden py-4 border-t border-white/10"
                    >
                        <div className="flex flex-col space-y-4">
                            {navItems.map((item) => (
                                <button
                                    key={item.view}
                                    onClick={() => {
                                        onNavigate(item.view);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`text-left px-4 py-2 text-sm font-medium transition-colors hover:text-cyan-400 ${
                                        currentView === item.view ? 'text-cyan-400' : 'text-white/80'
                                    }`}
                                >
                                    {item.name}
                                </button>
                            ))}
                            <button
                                onClick={() => {
                                    onNavigate('app');
                                    setIsMenuOpen(false);
                                }}
                                className="mx-4 mt-4 px-4 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-medium rounded-full text-center"
                            >
                                Get Started
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;