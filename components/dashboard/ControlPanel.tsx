
import React from 'react';
import Card from '../ui/Card';
import Slider from '../ui/Slider';
import { CATEGORY_MAP } from '../../constants';
import type { ActivityData, CategoryName } from '../../types';

interface ControlPanelProps {
    activities: (ActivityData & { displayTime: string })[];
    baseActivities: ActivityData[];
    onSliderChange: (name: CategoryName, deltaMinutes: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ activities, baseActivities, onSliderChange }) => {
    
    return (
        <div className="space-y-6">
            <Card>
                <h3 className="text-lg font-bold mb-4">Daily Schedule</h3>
                <ul className="space-y-2">
                    {activities.map(act => (
                        <li key={act.name} className="flex justify-between items-center text-sm">
                            <span className="flex items-center">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: CATEGORY_MAP[act.name].color }}></span>
                                {act.name}
                            </span>
                            <span className="font-semibold">{act.displayTime}</span>
                        </li>
                    ))}
                </ul>
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
