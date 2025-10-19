import React, { useState } from 'react';
import { useLifeData } from '../../hooks/useLifeData';
import type { LifeData, ActivityData } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { MINUTES_IN_DAY, CATEGORY_MAP } from '../../constants';

interface OnboardingViewProps {
    onComplete: (data: LifeData) => void;
}

const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
    // FIX: Replaced setLifeData with the more specific saveOnboardingData function.
    const { lifeData, saveOnboardingData } = useLifeData();
    const [localData, setLocalData] = useState(lifeData);
    
    const handleActivityChange = (name: string, hours: number) => {
        const minutes = hours * 60;
        const newActivities = localData.activities.map(act =>
            act.name === name ? { ...act, minutesPerDay: minutes } : act
        );
        updateUnallocated(newActivities);
    };

    const updateUnallocated = (activities: ActivityData[]) => {
        const totalAllocated = activities
            .filter(a => a.name !== 'Unallocated')
            .reduce((sum, act) => sum + act.minutesPerDay, 0);
        
        const unallocatedMinutes = Math.max(0, MINUTES_IN_DAY - totalAllocated);
        
        const finalActivities = activities.map(act => 
            act.name === 'Unallocated' ? {...act, minutesPerDay: unallocatedMinutes} : act
        );
        setLocalData(prev => ({ ...prev, activities: finalActivities }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // FIX: Use the specific updater function from the context.
        saveOnboardingData(localData);
        onComplete(localData);
    };
    
    const unallocatedHours = (localData.activities.find(a => a.name === 'Unallocated')?.minutesPerDay ?? 0) / 60;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
            <Card className="w-full max-w-2xl">
                <h2 className="text-3xl font-bold text-center mb-2 text-white">Your Life, by the Numbers</h2>
                <p className="text-center text-gray-400 mb-6">Let's set up your baseline. How do you spend a typical day?</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Current Age</label>
                            <input
                                type="number"
                                value={localData.currentAge}
                                onChange={e => setLocalData({ ...localData, currentAge: parseInt(e.target.value, 10) || 0 })}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                required
                                min="1"
                                max="100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Target Age</label>
                            <input
                                type="number"
                                value={localData.targetAge}
                                onChange={e => setLocalData({ ...localData, targetAge: parseInt(e.target.value, 10) || 0 })}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                required
                                min={localData.currentAge + 1}
                                max="120"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {localData.activities.filter(a => a.name !== 'Unallocated').map(activity => (
                             <div key={activity.name}>
                                 <label className="block text-sm font-medium text-gray-300 mb-1" style={{color: CATEGORY_MAP[activity.name].color}}>
                                     {activity.name} (hours per day)
                                 </label>
                                 <input
                                     type="number"
                                     step="0.5"
                                     value={activity.minutesPerDay / 60}
                                     onChange={e => handleActivityChange(activity.name, parseFloat(e.target.value) || 0)}
                                     className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                     required
                                     min="0"
                                     max="24"
                                 />
                             </div>
                        ))}
                    </div>

                    <div className="text-center bg-gray-700 p-3 rounded-md">
                        <p className="font-semibold">
                            Unallocated time: <span className="font-bold text-lg" style={{color: CATEGORY_MAP['Unallocated'].color}}>{unallocatedHours.toFixed(1)} hours/day</span>
                        </p>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full text-lg">
                            Visualize My Life
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default OnboardingView;