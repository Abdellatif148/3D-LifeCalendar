import React, { Suspense, useState, useMemo } from 'react';
import { useLifeData } from '../../hooks/useLifeData';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabaseClient';
import ControlPanel from '../dashboard/ControlPanel';
import LifeOrb3D from '../dashboard/LifeOrb3D';
import MetricsPanel from '../dashboard/MetricsPanel';
import type { Delta } from '../../types';
import Button from '../ui/Button';

interface DashboardViewProps {
    onLogout: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onLogout }) => {
    const { lifeData, updateActivity, baseActivities } = useLifeData();
    const { user } = useAuth();
    const [deltas, setDeltas] = useState<Delta[]>([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
        return lifeData.activities.map(act => {
            const totalMinutes = act.minutesPerDay;
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return {
                ...act,
                displayTime: `${hours}h ${minutes}m`
            };
        });
    }, [lifeData.activities]);

    const dominantFutureActivity = useMemo(() => {
        const futureActivities = lifeData.activities.filter(a => a.name !== 'Sleep' && a.name !== 'Unallocated');
        if(futureActivities.length === 0) return 'Unallocated';
        return futureActivities.reduce((max, act) => act.minutesPerDay > max.minutesPerDay ? act : max).name;
    }, [lifeData.activities]);

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
                    <Button onClick={onLogout} variant="secondary" className="px-4 py-2 text-sm border border-white/20">
                        Logout
                    </Button>
                    <Button onClick={() => setShowDeleteConfirm(true)} variant="danger" className="px-4 py-2 text-sm">
                        Delete Account
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
                <div className="xl:col-span-6 h-[50vh] xl:h-full relative">
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
                         />
                    </Suspense>
                </div>
                
                {/* Right Panel - Metrics */}
                <div className="xl:col-span-3 bg-black/30 backdrop-blur-sm p-4 overflow-y-auto border-l border-white/10">
                    <MetricsPanel deltas={deltas} yearsLeft={lifeData.targetAge - lifeData.currentAge}/>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;