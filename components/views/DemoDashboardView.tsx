import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ParticleBackground from '../ui/ParticleBackground';
import AnimatedNumber from '../ui/AnimatedNumber';

const DemoDashboardView: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="bg-[#0F172A] text-white min-h-screen flex">
            <ParticleBackground />
            {/* Sidebar */}
            <motion.div
                initial={{ width: 288 }}
                animate={{ width: isSidebarOpen ? 288 : 80 }}
                transition={{ duration: 0.3 }}
                className="bg-black/20 h-screen p-4 flex flex-col"
            >
                {/* Logo */}
                <div className="flex items-center justify-center mb-10">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#22D3EE] to-[#8B5CF6] rounded-full"></div>
                    <AnimatePresence>
                        {isSidebarOpen && <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="ml-2 text-xl font-bold">LifeCalendar</motion.h1>}
                    </AnimatePresence>
                </div>

                {/* Nav Items */}
                <nav className="flex-grow">
                    <ul>
                        <li className="mb-4"><a href="#" className="flex items-center p-2 rounded-lg hover:bg-white/10"><span className="w-6 h-6 mr-4">🏠</span> {isSidebarOpen && 'Dashboard'}</a></li>
                        <li className="mb-4"><a href="#" className="flex items-center p-2 rounded-lg hover:bg-white/10"><span className="w-6 h-6 mr-4">🏃</span> {isSidebarOpen && 'Habits'}</a></li>
                        <li className="mb-4"><a href="#" className="flex items-center p-2 rounded-lg hover:bg-white/10"><span className="w-6 h-6 mr-4">🧱</span> {isSidebarOpen && 'Life Blocks'}</a></li>
                        <li className="mb-4"><a href="#" className="flex items-center p-2 rounded-lg hover:bg-white/10"><span className="w-6 h-6 mr-4">📈</span> {isSidebarOpen && 'Reports'}</a></li>
                        <li className="mb-4"><a href="#" className="flex items-center p-2 rounded-lg hover:bg-white/10"><span className="w-6 h-6 mr-4">⚙️</span> {isSidebarOpen && 'Settings'}</a></li>
                    </ul>
                </nav>

                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-white/10">
                    {isSidebarOpen ? 'Collapse' : 'Expand'}
                </button>
            </motion.div>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {/* Top Navbar */}
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">👋 Welcome back, Demo</h2>
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                    </div>
                </header>

                {/* Dashboard Sections will go here */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Life in Weeks Card */}
                    <motion.div whileHover={{ scale: 1.05, rotateZ: 1 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 p-6 rounded-2xl">
                        <h4 className="text-lg font-bold">Life in Weeks</h4>
                        <div className="w-full h-32 bg-black/20 rounded-lg my-4">
                            {/* Mini 3D grid preview placeholder */}
                        </div>
                        <p>You’ve lived <AnimatedNumber to={936} /> weeks out of 4160 (22%).</p>
                    </motion.div>

                    {/* Remaining Time Card */}
                    <motion.div whileHover={{ scale: 1.05, rotateZ: -1 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/5 p-6 rounded-2xl">
                        <h4 className="text-lg font-bold">Remaining Time</h4>
                        <div className="w-full h-32 flex items-center justify-center my-4">
                            <p className="text-3xl font-bold">≈ <AnimatedNumber to={3200} /> weeks left</p>
                        </div>
                        <p>(if living to 80)</p>
                    </motion.div>

                    {/* Current Habits Impact Card */}
                    <motion.div whileHover={{ scale: 1.05, rotateZ: 1 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white/5 p-6 rounded-2xl">
                        <h4 className="text-lg font-bold">Current Habits Impact</h4>
                        <div className="w-full h-32 flex flex-col justify-center my-4">
                            <p className="text-red-400">Scrolling: -3 years</p>
                            <p className="text-green-400">Reading: +2 years</p>
                        </div>
                    </motion.div>
                </div>

                {/* Simulate Habits Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white/5 p-6 rounded-2xl mb-8">
                    <h4 className="text-lg font-bold mb-4">Simulate Habits</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block mb-2">Sleep</label>
                            <input type="range" min="4" max="10" defaultValue="7" step="0.5" className="w-full" />
                        </div>
                        <div>
                            <label className="block mb-2">Screen Time</label>
                            <input type="range" min="0" max="8" defaultValue="3" step="0.5" className="w-full" />
                        </div>
                        <div>
                            <label className="block mb-2">Exercise</label>
                            <input type="range" min="0" max="3" defaultValue="0.5" step="0.25" className="w-full" />
                        </div>
                    </div>
                    <div className="text-right mt-4">
                        <button onClick={() => toast.success('Feature available in Pro.')} className="px-6 py-2 border border-white/20 rounded-lg hover:bg-white/10">Save Simulation</button>
                    </div>
                </motion.div>

                {/* Micro Nudges Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white/5 p-6 rounded-2xl">
                        <h4 className="text-lg font-bold">Upcoming Reminders</h4>
                        <ul className="mt-4 space-y-2">
                            <li>📅 “Read 20 min” → Today 8PM</li>
                            <li>📅 “No phone 1h before bed” → Tonight 11PM</li>
                        </ul>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white/5 p-6 rounded-2xl">
                        <h4 className="text-lg font-bold">Export Calendar</h4>
                        <button onClick={() => toast.success('Feature available in Pro.')} className="mt-4 px-6 py-2 border border-white/20 rounded-lg hover:bg-white/10 w-full">Export to iCal / Google Calendar</button>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-white/5 p-6 rounded-2xl">
                        <h4 className="text-lg font-bold">AI Suggestion</h4>
                        <p className="mt-4">“If you cut 30min of scrolling daily, you gain +1.8 years over lifetime.”</p>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default DemoDashboardView;
