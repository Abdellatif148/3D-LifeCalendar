import React, { Suspense, useState, useMemo } from 'react';
import { useLifeData } from '../../hooks/useLifeData';
import ControlPanel from '../dashboard/ControlPanel';
import LifeGrid3D from '../dashboard/LifeGrid3D';
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
        <div className="flex flex-col h-screen overflow-hidden">
            <header className="flex-shrink-0 bg-gray-900/80 backdrop-blur-sm z-20 p-3 flex justify-between items-center border-b border-gray-700">
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">3D Time Optimizer</h1>
                <Button onClick={onReset} variant="secondary" className="px-4 py-2 text-sm">
                    Reset Baseline
                </Button>
            </header>
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
                <div className="lg:col-span-3 bg-gray-900/50 p-4 overflow-y-auto z-10">
                    <ControlPanel 
                        activities={activeActivities}
                        baseActivities={baseActivities}
                        onSliderChange={handleSliderChange} 
                        deltas={deltas}
                    />
                </div>
                <div className="lg:col-span-6 h-[50vh] lg:h-full relative">
                    <Suspense fallback={<div className="flex items-center justify-center h-full">Loading 3D View...</div>}>
                        <LifeGrid3D 
                            currentAge={lifeData.currentAge} 
                            targetAge={lifeData.targetAge}
                            dominantColorActivity={dominantFutureActivity}
                         />
                    </Suspense>
                </div>
                <div className="lg:col-span-3 bg-gray-900/50 p-4 overflow-y-auto z-10">
                    <MetricsPanel deltas={deltas} yearsLeft={lifeData.targetAge - lifeData.currentAge}/>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;