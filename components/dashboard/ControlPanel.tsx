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

const ControlPanel: React.FC<ControlPanelProps> = ({ activities, onSliderChange, deltas, yearsLeft }) => {
    const pieData = activities
        .filter(act => act.minutesPerDay > 0)
        .map(act => ({
            name: act.name,
            value: act.minutesPerDay,
            color: CATEGORY_MAP[act.name].color,
        }));

    const goalableActivities = activities.filter(a => a.name !== 'Unallocated' && a.name !== 'Sleep');
    const [goalActivity, setGoalActivity] = useState<CategoryName>(goalableActivities[0]?.name || 'Exercise');
    const [goalMinutes, setGoalMinutes] = useState<number>(30);

    const { annualHoursGained, lifetimeDaysGained, totalDeltaMinutes } = useMemo(() => {
        const totalDeltaMinutes = deltas.reduce((sum, delta) => sum + delta.deltaMinutes, 0);
        const annualHoursGained = (totalDeltaMinutes * 365) / 60;
        const lifetimeDaysGained = (annualHoursGained * yearsLeft) / 24;
        return { totalDeltaMinutes, annualHoursGained, lifetimeDaysGained };
    }, [deltas, yearsLeft]);

    const gainOrLossText = totalDeltaMinutes >= 0 ? 'Gained' : 'Reallocated';
    const gainOrLossColor = totalDeltaMinutes >= 0 ? 'text-green-400' : 'text-yellow-400';

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();
        onSliderChange(goalActivity, goalMinutes);
    };

    const handleRemoveGoal = (name: CategoryName) => {
        onSliderChange(name, 0);
    };

    return (
        <div className="space-y-6">
            <Card>
                <h3 className="text-lg font-bold mb-4">Daily Breakdown</h3>
                 <div className="flex flex-col items-center gap-4 mb-4">
                    <PieChart data={pieData} size={140} />
                </div>
                <ul className="space-y-2">
                    {activities.map(act => (
                        <li key={act.name} className="flex justify-between items-center text-sm">
                            <span className="flex items-center">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: CATEGORY_MAP[act.name].color }}></span>
                                {act.name}
                            </span>
                            <div className="flex items-center gap-4">
                               <span className="font-semibold text-gray-300 w-16 text-right">{((act.minutesPerDay / MINUTES_IN_DAY) * 100).toFixed(1)}%</span>
                               <span className="font-semibold w-20 text-right">{act.displayTime}</span>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="border-t border-gray-700 mt-4 pt-4 space-y-3">
                    <h4 className="text-md font-bold text-center">Lifetime Impact</h4>
                    <div className="flex justify-around">
                         <div className="text-center">
                            <p className="text-xs text-gray-400">Annual Hours {gainOrLossText}</p>
                            <p className={`text-2xl font-bold ${gainOrLossColor}`}>{annualHoursGained.toFixed(1)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-400">Lifetime Days {gainOrLossText}</p>
                            <p className={`text-2xl font-bold ${gainOrLossColor}`}>{lifetimeDaysGained.toFixed(1)}</p>
                        </div>
                    </div>
                </div>
            </Card>

            <Card>
                <h3 className="text-lg font-bold mb-4">Goal Setting</h3>
                <p className="text-sm text-gray-400 mb-4">Simulate a daily change to see its long-term impact on your life.</p>
                <form onSubmit={handleAddGoal} className="space-y-4">
                    <select
                        value={goalActivity}
                        onChange={(e) => setGoalActivity(e.target.value as CategoryName)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
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
                    <Button type="submit" className="w-full">Add/Update Goal</Button>
                </form>
                {deltas && deltas.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <h4 className="font-semibold text-sm">Active Goals:</h4>
                        <ul className="space-y-1">
                            {deltas.map(delta => (
                                <li key={delta.name} className="flex justify-between items-center text-sm bg-gray-700/50 p-2 rounded-md">
                                    <span className="flex items-center">
                                        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: CATEGORY_MAP[delta.name].color }}></span>
                                        {delta.name}: <span className="font-bold ml-1">{delta.deltaMinutes > 0 ? '+' : ''}{delta.deltaMinutes} min</span>
                                    </span>
                                    <button onClick={() => handleRemoveGoal(delta.name)} className="text-gray-400 hover:text-red-500 font-bold transition-colors">
                                        &#x2715;
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ControlPanel;