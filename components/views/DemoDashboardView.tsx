import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import LifeOrb3D from '../dashboard/LifeOrb3D';
import AnimatedNumber from '../ui/AnimatedNumber';

const DemoDashboardView: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const [yearsGained, setYearsGained] = useState(3);
    const [dominantColor, setDominantColor] = useState('Work/Study');

    const handleSliderChange = (value: string) => {
        const readingHours = parseFloat(value);
        setYearsGained(Math.round(readingHours * 1.5));
        if (readingHours > 2) {
            setDominantColor('Reading');
        } else {
            setDominantColor('Work/Study');
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white min-h-screen flex">
            {/* Mobile Sidebar Toggle */}
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black/50 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>

            {/* Left Sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ duration: 0.3 }}
                        className="w-64 bg-black/20 p-4 absolute lg:relative z-40 h-full"
                    >
                        <div className="flex items-center mb-10">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#22D3EE] to-[#8B5CF6] rounded-full"></div>
                            <h1 className="ml-2 text-xl font-bold">LifeCalendar</h1>
                        </div>
                        <h3 className="text-lg font-bold mb-4">Demo Guide</h3>
                        <ul className="space-y-2">
                            <li><button onClick={() => toast('See your life in blocks of time.')} className="w-full text-left p-2 rounded-lg hover:bg-white/10">Overview</button></li>
                            <li><button onClick={() => toast('Add or edit daily habits.')} className="w-full text-left p-2 rounded-lg hover:bg-white/10">Habits</button></li>
                            <li><button onClick={() => toast('Adjust hours → instantly see life impact.')} className="w-full text-left p-2 rounded-lg hover:bg-white/10">Simulation</button></li>
                            <li><button onClick={() => toast('Detailed charts of time lost/gained.')} className="w-full text-left p-2 rounded-lg hover:bg-white/10">Reports</button></li>
                            <li><button onClick={() => toast('Customize lifespan, goals, and colors.')} className="w-full text-left p-2 rounded-lg hover:bg-white/10">Settings</button></li>
                        </ul>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Navbar */}
                <header className="bg-black/20 p-4 flex justify-between items-center">
                    <nav className="flex space-x-4">
                        <a href="#" className="hover:text-white">Overview</a>
                        <a href="#" className="hover:text-white">Habits</a>
                        <a href="#" className="hover:text-white">Simulation</a>
                        <a href="#" className="hover:text-white">Reports</a>
                        <a href="#" className="hover:text-white">Settings</a>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">Demo Mode</span>
                        <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                    </div>
                </header>

                <main className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Panel */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero Block */}
                        <div className="relative bg-black/20 p-8 rounded-2xl h-80 flex items-center justify-center">
                            <div className="absolute inset-0">
                                <LifeOrb3D currentAge={22} targetAge={80} dominantColorActivity={dominantColor} />
                            </div>
                            <div className="relative z-10 text-center">
                                <h3 className="text-4xl font-bold">You’ve lived <AnimatedNumber to={6570} /> days.</h3>
                                <p className="text-xl text-white/80">~<AnimatedNumber to={19000} /> remain (if you live to 80).</p>
                            </div>
                        </div>

                        {/* Habits Simulation Panel */}
                        <div className="bg-black/20 p-8 rounded-2xl">
                            <h4 className="text-lg font-bold mb-4">Habits Simulation</h4>
                            <div className="space-y-4">
                                <div>
                                    <label>Reading</label>
                                    <input type="range" min="0" max="5" defaultValue="1" step="0.5" className="w-full" onChange={(e) => handleSliderChange(e.target.value)} />
                                </div>
                            </div>
                            <p className="text-center mt-4 text-lg">You gain <span className="text-green-400 font-bold">+{yearsGained} years</span> if you keep this change.</p>
                        </div>
                    </div>

                    {/* Right side charts */}
                    <div className="lg:col-span-1 space-y-8">
                        <motion.div whileHover={{ scale: 1.05 }} className="bg-black/20 p-4 rounded-2xl">
                            <h5 className="font-bold mb-2">Where your time goes</h5>
                            {/* Pie chart mockup */}
                            <div className="w-full h-32 flex items-center justify-center">
                                <div className="w-24 h-24 bg-gray-700 rounded-full relative">
                                    <div className="absolute w-full h-full rounded-full clip-half bg-cyan-400"></div>
                                    <div className="absolute w-full h-full rounded-full clip-quarter bg-purple-500"></div>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} className="bg-black/20 p-4 rounded-2xl">
                            <h5 className="font-bold mb-2">% of life spent</h5>
                            {/* Progress ring mockup */}
                            <div className="w-full h-32 flex items-center justify-center">
                                <div className="w-24 h-24 rounded-full border-8 border-gray-700">
                                    <div className="w-full h-full rounded-full border-8 border-t-cyan-400 transform rotate-45"></div>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} className="bg-black/20 p-4 rounded-2xl">
                            <h5 className="font-bold mb-2">Lifetime hours</h5>
                            {/* Bar chart mockup */}
                            <div className="w-full h-32 flex items-end justify-between">
                                <div className="w-1/4 h-1/2 bg-cyan-400"></div>
                                <div className="w-1/4 h-3/4 bg-purple-500"></div>
                                <div className="w-1/4 h-1/3 bg-gray-700"></div>
                            </div>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DemoDashboardView;
