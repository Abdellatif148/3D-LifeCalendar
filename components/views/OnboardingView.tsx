import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLifeData } from '../../hooks/useLifeData';
import type { LifeData, ActivityData } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { MINUTES_IN_DAY, CATEGORY_MAP } from '../../constants';

interface OnboardingViewProps {
    onComplete: (data: LifeData) => void;
}

const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
    const { markOnboardingComplete } = useAuth();
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        saveOnboardingData(localData);
        await markOnboardingComplete();
        onComplete(localData);
    };
    
    const unallocatedHours = (localData.activities.find(a => a.name === 'Unallocated')?.minutesPerDay ?? 0) / 60;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
            <Card variant="elevated" padding="xl" className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Your Life, by the Numbers</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Let's set up your baseline. How do you spend a typical day?</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Age</label>
                            <input
                                type="number"
                                value={localData.currentAge}
                                onChange={e => setLocalData({ ...localData, currentAge: parseInt(e.target.value, 10) || 0 })}
                                className="input-clean"
                                required
                                min="1"
                                max="100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Age</label>
                            <input
                                type="number"
                                value={localData.targetAge}
                                onChange={e => setLocalData({ ...localData, targetAge: parseInt(e.target.value, 10) || 0 })}
                                className="input-clean"
                                required
                                min={localData.currentAge + 1}
                                max="120"
                            />
                        </div>
                    </div>

                    <div className="space-y-5">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Time Allocation</h3>
                        {localData.activities.filter(a => a.name !== 'Unallocated').map(activity => (
                             <div key={activity.name} className="space-y-2">
                                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" style={{color: CATEGORY_MAP[activity.name].color}}>
                                     {activity.name} (hours per day)
                                 </label>
                                 <input
                                     type="number"
                                     step="0.5"
                                     value={activity.minutesPerDay / 60}
                                     onChange={e => handleActivityChange(activity.name, parseFloat(e.target.value) || 0)}
                                     className="input-clean"
                                     required
                                     min="0"
                                     max="24"
                                 />
                             </div>
                        ))}
                    </div>

                    <Card variant="outlined" padding="lg" className="text-center">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            Unallocated time: <span className="text-2xl font-bold" style={{color: CATEGORY_MAP['Unallocated'].color}}>{unallocatedHours.toFixed(1)} hours/day</span>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">This includes commuting, chores, and other daily activities</p>
                    </Card>

                    <Button type="submit" size="xl" fullWidth>
                        Visualize My Life
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default OnboardingView;