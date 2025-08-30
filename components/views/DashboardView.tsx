import React, { Suspense, useState, useMemo } from 'react';
import { useLifeData } from '../../hooks/useLifeData.tsx';
import { useAuth } from '../../hooks/useAuth';
import ControlPanel from '../dashboard/ControlPanel';
import LifeOrb3D from '../dashboard/LifeOrb3D';
import MetricsPanel from '../dashboard/MetricsPanel';
import TinyNudges from '../dashboard/TinyNudges';
import type { Delta } from '../../types';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

interface DashboardViewProps {
    onNavigateToSettings: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateToSettings }) => {
    const { lifeData, updateActivity, baseActivities, loading: lifeDataLoading } = useLifeData();
    const { user, signOut } = useAuth();
    const [deltas, setDeltas] = useState<Delta[]>([]);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleSliderChange = (name: string, deltaMinutes: number) => {
        const baseValue = baseActivities.find(a => a.name === name)?.minutesPerDay ?? 0;
        const newMinutes = baseValue + deltaMinutes;
        updateActivity(name as any, newMinutes);

        setDeltas(prevDeltas => {
            const otherDeltas = prevDeltas.filter(d => d.name !== name);
            if (deltaMinutes !== 0) {
                 return [...otherDeltas, { name: name as any, deltaMinutes }];
            }
            return otherDeltas;
        });
    };

    const handleResetToDefault = () => {
        setDeltas([]);
        baseActivities.forEach(activity => {
            updateActivity(activity.name, activity.minutesPerDay);
        });
    };

    const activeActivities = useMemo(() => {
        return lifeData.activities
            .filter(act => act.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(act => {
                const totalMinutes = act.minutesPerDay;
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;
                return {
                    ...act,
                    displayTime: `${hours}h ${minutes}m`
                };
            });
    }, [lifeData.activities, searchTerm]);

    const dominantFutureActivity = useMemo(() => {
        const futureActivities = lifeData.activities.filter(a => a.name !== 'Sleep' && a.name !== 'Unallocated');
        if(futureActivities.length === 0) return 'Unallocated';
        return futureActivities.reduce((max, act) => act.minutesPerDay > max.minutesPerDay ? act : max).name;
    }, [lifeData.activities]);

    const lifeExpectancyChange = useMemo(() => {
        const totalDelta = deltas.reduce((sum, delta) => sum + delta.deltaMinutes, 0);
        // Simplified calculation: 1 hour change per day = 1 year change in life expectancy
        return totalDelta / 60;
    }, [deltas]);

    if (lifeDataLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Loading your life data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900/30 to-black">
            {/* Header */}
            <header className="flex-shrink-0 bg-black/50 backdrop-blur-sm z-20 p-4 flex justify-between items-center border-b border-white/10">
                <div>
                    <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                        3D Time Optimizer
                    </h1>
                    <p className="text-sm text-gray-400">Your life as a living orb of time</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input
                            type="search"
                            placeholder="Search..."
                            className="bg-white/10 rounded-full px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="p-2 rounded-full hover:bg-white/10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        </button>
                        {notificationsOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg p-4">
                                <h4 className="font-bold mb-2">Notifications</h4>
                                <ul>
                                    <li className="border-b border-gray-700 py-2 text-sm">Welcome to your 3D Time Optimizer!</li>
                                    <li className="py-2 text-sm">Adjust the sliders to see how small changes impact your life.</li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <button onClick={onNavigateToSettings} className="p-2 rounded-full hover:bg-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                    <Button onClick={handleLogout} variant="secondary" className="px-4 py-2 text-sm">
                        Logout
                    </Button>
                </div>
            </header>
            
            {/* Main Dashboard */}
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
                {/* Left Panel - Controls */}
                <div className="lg:col-span-3 bg-black/30 backdrop-blur-sm p-4 overflow-y-auto border-r border-white/10">
                    <ControlPanel 
                        activities={activeActivities}
                        baseActivities={baseActivities}
                        onSliderChange={handleSliderChange}
                        onResetToDefault={handleResetToDefault}
                    />
                </div>
                
                {/* Center Panel - 3D Orb */}
                <div className="lg:col-span-6 h-[50vh] lg:h-full relative flex flex-col items-center justify-center">
                    {/* Timeline Bar */}
                    <div className="w-3/4 mb-4">
                        <div className="h-2 bg-gray-700 rounded-full">
                            <div className="h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" style={{ width: `${(lifeData.currentAge / lifeData.targetAge) * 100}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                            <span>Now: {lifeData.currentAge}</span>
                            <span>Target: {lifeData.targetAge}</span>
                        </div>
                    </div>

                    <Suspense fallback={
                        <div className="flex items-center justify-center h-full bg-gradient-to-b from-gray-900 to-black">
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-white">Generating your Life Orb...</p>
                            </div>
                        </div>
                    }>
                        <LifeOrb3D 
                            currentAge={lifeData.currentAge} 
                            targetAge={lifeData.targetAge}
                            dominantColorActivity={dominantFutureActivity}
                            density={1 + lifeExpectancyChange / 10}
                         />
                    </Suspense>
                </div>
                
                {/* Right Panel - Metrics */}
                <div className="lg:col-span-3 bg-black/30 backdrop-blur-sm p-4 overflow-y-auto border-l border-white/10 space-y-6">
                    <MetricsPanel deltas={deltas} yearsLeft={lifeData.targetAge - lifeData.currentAge} lifeExpectancyChange={lifeExpectancyChange} />
                    <TinyNudges deltas={deltas} />
                </div>
            </div>
        </div>
    );
};

export default DashboardView;