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
    const { lifeData, setLifeData } = useLifeData();
    const [localData, setLocalData] = useState(lifeData);
    const [step, setStep] = useState(1);
    
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
        setLifeData(localData);
        onComplete(localData);
    };

    const totalHours = localData.activities.reduce((sum, act) => sum + act.minutesPerDay, 0) / 60;
    const isBalanced = Math.abs(totalHours - 24) < 0.1;
    const progressPercentage = Math.min((totalHours / 24) * 100, 100);
    
    const unallocatedHours = (localData.activities.find(a => a.name === 'Unallocated')?.minutesPerDay ?? 0) / 60;

    if (step === 1) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-cyan-400 via-purple-600 to-gray-900">
                <div className="flex flex-col lg:flex-row items-center max-w-6xl w-full gap-8">
                    {/* Left side - Illustration */}
                    <div className="lg:w-1/2 text-center">
                        <div className="relative">
                            <div className="text-8xl mb-4 animate-float">🕰️</div>
                            <div className="absolute -top-4 -right-4 text-4xl animate-float-delayed">✨</div>
                            <div className="absolute -bottom-4 -left-4 text-3xl animate-float-slow">🧊</div>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Time becomes tangible</h2>
                        <p className="text-gray-200">Watch your habits transform into a living, breathing orb of possibility.</p>
                    </div>
                    
                    {/* Right side - Age inputs */}
                    <div className="lg:w-1/2">
                        <Card className="max-w-md mx-auto">
                            <h2 className="text-2xl font-bold text-center mb-6 text-white">Let's start with the basics</h2>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">How old are you now?</label>
                                    <input
                                        type="number"
                                        value={localData.currentAge || ''}
                                        onChange={e => setLocalData({ ...localData, currentAge: parseInt(e.target.value, 10) || 0 })}
                                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white text-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
                                        placeholder="25"
                                        min="1"
                                        max="100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">What age do you want to plan until?</label>
                                    <input
                                        type="number"
                                        value={localData.targetAge || ''}
                                        onChange={e => setLocalData({ ...localData, targetAge: parseInt(e.target.value, 10) || 0 })}
                                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white text-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all"
                                        placeholder="80"
                                        min={localData.currentAge + 1}
                                        max="120"
                                    />
                                </div>
                            </div>

                            <Button 
                                onClick={() => setStep(2)} 
                                className="w-full mt-8 text-lg"
                                disabled={!localData.currentAge || !localData.targetAge || localData.targetAge <= localData.currentAge}
                            >
                                Next: Daily Time Split
                            </Button>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900">
            <div className="flex flex-col lg:flex-row items-center max-w-6xl w-full gap-8">
                {/* Left side - Clock illustration */}
                <div className="lg:w-1/2 text-center">
                    <div className="relative mb-6">
                        <div className="text-6xl animate-pulse-slow">⏰</div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 border-4 border-cyan-400/30 rounded-full animate-spin-slow"></div>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Balance your 24 hours</h2>
                    <p className="text-gray-300">Every minute counts. Let's see where your time really goes.</p>
                </div>
                
                {/* Right side - Time allocation */}
                <div className="lg:w-1/2">
                    <Card className="max-w-md mx-auto">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Daily Time Split</h2>
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <svg className="w-24 h-24 transform -rotate-90">
                                    <circle
                                        cx="48"
                                        cy="48"
                                        r="40"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        className="text-gray-700"
                                    />
                                    <circle
                                        cx="48"
                                        cy="48"
                                        r="40"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={`${progressPercentage * 2.51} 251`}
                                        className={isBalanced ? "text-green-400" : "text-yellow-400"}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className={`text-sm font-bold ${isBalanced ? "text-green-400" : "text-yellow-400"}`}>
                                        {totalHours.toFixed(1)}h
                                    </span>
                                </div>
                            </div>
                            {!isBalanced && (
                                <p className="text-yellow-400 text-sm">Must equal 24 hours to continue</p>
                            )}
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {localData.activities.filter(a => a.name !== 'Unallocated').map(activity => (
                                <div key={activity.name}>
                                    <label className="block text-sm font-medium mb-2" style={{color: CATEGORY_MAP[activity.name].color}}>
                                        {activity.name}
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range"
                                            min="0"
                                            max="16"
                                            step="0.5"
                                            value={activity.minutesPerDay / 60}
                                            onChange={e => handleActivityChange(activity.name, parseFloat(e.target.value))}
                                            className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                            style={{
                                                background: `linear-gradient(to right, ${CATEGORY_MAP[activity.name].color} 0%, ${CATEGORY_MAP[activity.name].color} ${(activity.minutesPerDay / 60 / 16) * 100}%, #4B5563 ${(activity.minutesPerDay / 60 / 16) * 100}%, #4B5563 100%)`
                                            }}
                                        />
                                        <span className="text-white font-semibold w-12 text-right">
                                            {(activity.minutesPerDay / 60).toFixed(1)}h
                                        </span>
                                    </div>
                                </div>
                            ))}

                            <div className="text-center bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                                <p className="text-sm text-gray-300">
                                    Unallocated time: <span className="font-bold text-lg" style={{color: CATEGORY_MAP['Unallocated'].color}}>{unallocatedHours.toFixed(1)} hours/day</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-1">Commuting, chores, and other daily activities</p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button 
                                    type="button" 
                                    onClick={() => setStep(1)} 
                                    variant="secondary" 
                                    className="flex-1"
                                >
                                    Back
                                </Button>
                                <Button 
                                    type="submit" 
                                    className="flex-1 text-lg glow-effect"
                                    disabled={!isBalanced}
                                >
                                    Generate My Life Orb
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(10deg); }
                }
                
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-8px) rotate(-5deg); }
                }
                
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                .animate-float { animation: float 3s ease-in-out infinite; }
                .animate-float-delayed { animation: float-delayed 4s ease-in-out infinite; }
                .animate-float-slow { animation: float-slow 5s ease-in-out infinite; }
                .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
                .animate-spin-slow { animation: spin-slow 8s linear infinite; }
                
                .glow-effect {
                    box-shadow: 0 0 20px rgba(34, 211, 238, 0.4);
                }
                
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: currentColor;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 0 10px rgba(0,0,0,0.3);
                }
                
                input[type="range"]::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: currentColor;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 0 10px rgba(0,0,0,0.3);
                }
            `}</style>
        </div>
    );
};

export default OnboardingView;