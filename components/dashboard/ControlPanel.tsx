import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import Slider from '../ui/Slider';
import PieChart from '../ui/PieChart';
import Button from '../ui/Button';
import { CATEGORY_MAP, MINUTES_IN_DAY } from '../../constants';
import type { ActivityData, CategoryName, Delta } from '../../types';

interface ControlPanelProps {
    activities: (ActivityData & { displayTime: string })[];
    onSliderChange: (name: CategoryName, deltaMinutes: number) => void;
    deltas: Delta[];
    yearsLeft: number;
}

const ControlPanel: React.FC<ControlPanelProps> = React.memo(({ activities, onSliderChange, deltas, yearsLeft }) => {
    const pieData = useMemo(() => activities
        .filter(act => act.minutesPerDay > 0)
        .map(act => ({
            name: act.name,
            value: act.minutesPerDay,
            color: CATEGORY_MAP[act.name].color,
        })), [activities]);

    const goalableActivities = activities.filter(a => a.name !== 'Unallocated' && a.name !== 'Sleep');
    const [goalActivity, setGoalActivity] = useState<CategoryName>(goalableActivities[0]?.name || 'Exercise');
    const [goalMinutes, setGoalMinutes] = useState<number>(30);

    const { annualHoursGained, lifetimeDaysGained, totalDeltaMinutes } = useMemo(() => {
        const totalDeltaMinutes = deltas.reduce((sum, delta) => sum + delta.deltaMinutes, 0);
        const annualHoursGained = Math.abs((totalDeltaMinutes * 365) / 60);
        const lifetimeDaysGained = Math.abs((annualHoursGained * yearsLeft) / 24);
        return { totalDeltaMinutes, annualHoursGained, lifetimeDaysGained };
    }, [deltas, yearsLeft]);

    const gainOrLossText = totalDeltaMinutes >= 0 ? 'Gained' : 'Lost';
    const gainOrLossColor = totalDeltaMinutes >= 0 ? 'text-accent-500' : 'text-red-500';

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();
        onSliderChange(goalActivity, goalMinutes);
    };

    const handleRemoveGoal = (name: CategoryName) => {
        onSliderChange(name, 0);
    };

    return (
        <div className="space-y-6">
            <Card variant="elevated" padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Daily Breakdown</h3>
                <div className="flex flex-col items-center gap-6 mb-6">
                    <PieChart data={pieData} size={160} />
                </div>
                <div className="space-y-3">
                    {activities.map(act => (
                        <div key={act.name} className="flex justify-between items-center py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                            <span className="flex items-center gap-3">
                                <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: CATEGORY_MAP[act.name].color }}></span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{act.name}</span>
                            </span>
                            <div className="flex items-center gap-4 text-sm">
                               <span className="font-semibold text-gray-600 dark:text-gray-300 w-12 text-right">{((act.minutesPerDay / MINUTES_IN_DAY) * 100).toFixed(1)}%</span>
                               <span className="font-semibold text-gray-900 dark:text-white w-16 text-right">{act.displayTime}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
                    <h4 className="text-base font-semibold text-center text-gray-900 dark:text-white mb-4">Lifetime Impact</h4>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Annual Hours {gainOrLossText}</p>
                            <p className={`text-2xl font-bold ${gainOrLossColor}`}>{annualHoursGained.toFixed(1)}</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Lifetime Days {gainOrLossText}</p>
                            <p className={`text-2xl font-bold ${gainOrLossColor}`}>{lifetimeDaysGained.toFixed(1)}</p>
                        </div>
                    </div>
                </div>
            </Card>

            <Card variant="elevated" padding="lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Goal Setting</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Simulate a daily change to see its long-term impact on your life.</p>
                <form onSubmit={handleAddGoal} className="space-y-4">
                    <select
                        value={goalActivity}
                        onChange={(e) => setGoalActivity(e.target.value as CategoryName)}
                        className="input-clean"
                    >
                        {goalableActivities.map(act => (
                            <option key={act.name} value={act.name}>{act.name}</option>
                        ))}
                    </select>
                    <Slider
                        label="Time Change"
                        valueLabel={`${goalMinutes >= 0 ? '+' : ''}${goalMinutes} min`}
                        title={`${goalMinutes >= 0 ? '+' : ''}${goalMinutes} minutes`}
                        color={CATEGORY_MAP[goalActivity].color}
                        min={-120}
                        max={120}
                        step={5}
                        value={goalMinutes}
                        onChange={(e) => setGoalMinutes(parseInt(e.target.value, 10))}
                    />
                    <Button type="submit" fullWidth>Add/Update Goal</Button>
                </form>
                {deltas && deltas.length > 0 && (
                    <div className="mt-6 space-y-3">
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Active Goals:</h4>
                        <div className="space-y-2">
                            {deltas.map(delta => (
                                <div key={delta.name} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <span className="flex items-center gap-3">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_MAP[delta.name].color }}></span>
                                        <span className="text-sm text-gray-900 dark:text-white">
                                            {delta.name}: <span className="font-semibold">{delta.deltaMinutes > 0 ? '+' : ''}{delta.deltaMinutes} min</span>
                                        </span>
                                    </span>
                                    <button 
                                        onClick={() => handleRemoveGoal(delta.name)} 
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                                        title="Remove goal"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
});

ControlPanel.displayName = 'ControlPanel';

export default ControlPanel;