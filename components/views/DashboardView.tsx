import React, { Suspense, useState, useMemo } from 'react';
import { useLifeData } from '../../hooks/useLifeData';
import ControlPanel from '../dashboard/ControlPanel';
import LifeOrb3D from '../dashboard/LifeOrb3D';
import MetricsPanel from '../dashboard/MetricsPanel';
import type { Delta } from '../../types';
import Button from '../ui/Button';

interface DashboardViewProps {
    onReset: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onReset }) => {
    const { lifeData, updateActivity, baseActivities } = useLifeData();
    const [deltas, setDeltas] = useState<Delta[]>([]);

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
                <Button onClick={onReset} variant="secondary" className="px-4 py-2 text-sm border border-white/20">
                    Reset Baseline
                </Button>
            </header>
            
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