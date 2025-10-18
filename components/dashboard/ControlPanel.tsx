import React, { useState } from 'react';
import Card from '../ui/Card';
import Slider from '../ui/Slider';
import PieChart from '../ui/PieChart';
import Button from '../ui/Button';
import { CATEGORY_MAP, MINUTES_IN_DAY } from '../../constants';
import type { ActivityData, CategoryName, Delta } from '../../types';

interface ControlPanelProps {
    activities: (ActivityData & { displayTime: string })[];
    baseActivities: ActivityData[];
    onSliderChange: (name: CategoryName, deltaMinutes: number) => void;
    deltas: Delta[];
}

const ControlPanel: React.FC<ControlPanelProps> = ({ activities, baseActivities, onSliderChange, deltas }) => {
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
            </Card>

            <Card>
                <h3 className="text-lg font-bold mb-4">Goal Setting</h3>
                <p className="text-sm text-gray-400 mb-4">Define a specific goal to see its impact. This will adjust the simulator below.</p>
                <form onSubmit={handleAddGoal} className="space-y-3">
                    <div className="flex gap-2">
                        <select
                            value={goalActivity}
                            onChange={(e) => setGoalActivity(e.target.value as CategoryName)}
                            className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        >
                            {goalableActivities.map(act => (
                                <option key={act.name} value={act.name}>{act.name}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            value={goalMinutes}
                            onChange={(e) => setGoalMinutes(parseInt(e.target.value, 10) || 0)}
                            className="w-24 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            step={5}
                            min={-120}
                            max={120}
                        />
                        <span className="flex items-center text-gray-400">min</span>
                    </div>
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
            
            <Card>
                <h3 className="text-lg font-bold mb-4">Micro-Change Simulator</h3>
                <p className="text-sm text-gray-400 mb-4">Adjust your daily routine and see the lifetime impact instantly. Each slider adds or subtracts up to 2 hours per day.</p>
                <div className="space-y-4">
                    {activities.filter(a => a.name !== 'Unallocated' && a.name !== 'Sleep').map(act => {
                        const baseValue = baseActivities.find(a => a.name === act.name)?.minutesPerDay ?? 0;
                        const currentValue = act.minutesPerDay;
                        const delta = currentValue - baseValue;

                        const valueLabel = `${delta > 0 ? '+' : ''}${delta} min`;
                        
                        return (
                            <Slider
                                key={act.name}
                                label={act.name}
                                valueLabel={valueLabel}
                                color={CATEGORY_MAP[act.name].color}
                                min={-120}
                                max={120}
                                step={5}
                                value={delta}
                                onChange={(e) => onSliderChange(act.name, parseInt(e.target.value))}
                            />
                        );
                    })}
                </div>
            </Card>
        </div>
    );
};

export default ControlPanel;