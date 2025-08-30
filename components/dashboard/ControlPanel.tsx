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
                <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                    Your Life Orb
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                    Each glowing particle represents one week of your life. Watch how small changes reshape your entire future.
                </p>
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Legend</h4>
                    {activities.map(act => (
                        <div key={act.name} className="flex justify-between items-center text-sm">
                            <span className="flex items-center">
                                <span 
                                    className="w-3 h-3 rounded-full mr-3 shadow-lg" 
                                    style={{ 
                                        backgroundColor: CATEGORY_MAP[act.name].color,
                                        boxShadow: `0 0 8px ${CATEGORY_MAP[act.name].color}40`
                                    }}
                                ></span>
                                <span className="text-gray-300">{act.name}</span>
                            </span>
                            <span className="font-semibold text-white">{act.displayTime}</span>
                        </div>
                    ))}
                </div>
            </Card>
            
            <Card>
                <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    Micro-Change Simulator
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                    Adjust your daily routine and watch your life orb transform in real-time. Small changes create massive lifetime impact.
                </p>
                <div className="space-y-6">
                    {activities.filter(a => a.name !== 'Unallocated' && a.name !== 'Sleep').map(act => {
                        const baseValue = baseActivities.find(a => a.name === act.name)?.minutesPerDay ?? 0;
                        const currentValue = act.minutesPerDay;
                        const delta = currentValue - baseValue;

                        const hours = Math.abs(delta) / 60;
                        const sign = delta >= 0 ? '+' : '-';
                        const valueLabel = delta === 0 ? '0 min' : `${sign}${hours.toFixed(1)}h`;
                        
                        return (
                            <div key={act.name} className="space-y-2">
                                <Slider
                                    label={act.name}
                                    valueLabel={valueLabel}
                                    color={CATEGORY_MAP[act.name].color}
                                    min={-120}
                                    max={120}
                                    step={15}
                                    value={delta}
                                    onChange={(e) => onSliderChange(act.name, parseInt(e.target.value))}
                                />
                                <p className="text-xs text-gray-500 pl-1">
                                    {CATEGORY_MAP[act.name].description}
                                </p>
                            </div>
                        );
                    })}
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/20">
                    <p className="text-xs text-gray-400 text-center">
                        🎯 Adjust sliders below to see how small changes reshape your life orb.
                    </p>
                </div>

                <div className="flex space-x-4 mt-6">
                    <Button onClick={() => {}} variant="secondary" className="w-full">Reset to Default</Button>
                    <Button onClick={() => {}} className="w-full">Suggest Optimal Routine</Button>
                </div>
            </Card>
        </div>
    );
};

export default ControlPanel;