import React, { Suspense, useState, useMemo } from 'react';
import { useLifeData } from '../../hooks/useLifeData.tsx';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';
import ControlPanel from '../dashboard/ControlPanel';
import LifeOrb3D from '../dashboard/LifeOrb3D';
import MetricsPanel from '../dashboard/MetricsPanel';
import TinyNudges from '../dashboard/TinyNudges';
import type { Delta } from '../../types';
import Button from '../ui/Button';

interface DashboardViewProps {
    onLogout: () => void;
    onNavigateToSettings: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onLogout, onNavigateToSettings }) => {
    const { lifeData, updateActivity, baseActivities } = useLifeData();
    const { user } = useAuth();
    const [deltas, setDeltas] = useState<Delta[]>([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleDeleteAccount = async () => {
        if (!user) return;

        // CRITICAL: This function currently only deletes the user's profile data
        // and signs them out. It DOES NOT delete the user from Supabase Auth.
        // To fully delete a user, you must call a Supabase Edge Function
        // from the client, which can then use the service_role key to delete
        // the user from auth.users.

        // Example Edge Function call:
        // const { error } = await supabase.functions.invoke('delete-user')
        // if (error) console.error("Failed to delete user:", error)

        console.log("Deleting profile data for user:", user.id);
        await supabase.from('profiles').delete().eq('id', user.id);

        await onLogout();
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
                            className="bg-white/10 rounded-full px-4 py-2 text-sm w-64"
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
                                    <li className="border-b border-gray-700 py-2">New suggestion: Try reading for 15 more minutes!</li>
                                    <li className="py-2">You've reached a 7-day streak for exercise!</li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <button onClick={onNavigateToSettings} className="p-2 rounded-full hover:bg-white/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                    <Button onClick={onLogout} variant="secondary" className="px-4 py-2 text-sm border border-white/20">
                        Logout
                    </Button>
                </div>
            </header>
            
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="p-8 bg-gray-800 rounded-lg shadow-2xl max-w-sm text-center">
                        <h3 className="text-xl font-bold text-white mb-4">Are you sure?</h3>
                        <p className="text-gray-400 mb-6">This action is irreversible. All your data will be permanently deleted.</p>
                        <div className="flex justify-center space-x-4">
                            <Button onClick={() => setShowDeleteConfirm(false)} variant="secondary">
                                Cancel
                            </Button>
                            <Button onClick={handleDeleteAccount} variant="danger">
                                Yes, Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Dashboard */}
            <div className="flex-grow grid grid-cols-1 xl:grid-cols-12 gap-0 relative">
                {/* Left Panel - Controls */}
                <div className="xl:col-span-3 bg-black/30 backdrop-blur-sm p-4 overflow-y-auto border-r border-white/10">
                    <ControlPanel 
                        activities={activeActivities}
                        baseActivities={baseActivities}
                        onSliderChange={handleSliderChange} 
                    />
                </div>
                
                {/* Center Panel - 3D Orb */}
                <div className="xl:col-span-6 h-[50vh] xl:h-full relative flex flex-col items-center justify-center">
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
                <div className="xl:col-span-3 bg-black/30 backdrop-blur-sm p-4 overflow-y-auto border-l border-white/10 space-y-6">
                    <MetricsPanel deltas={deltas} yearsLeft={lifeData.targetAge - lifeData.currentAge} lifeExpectancyChange={lifeExpectancyChange} />
                    <TinyNudges deltas={deltas} />
                </div>
            </div>
        </div>
    );
};

export default DashboardView;