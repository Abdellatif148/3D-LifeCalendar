import React, { useMemo } from 'react';
import Card from '../ui/Card';
import type { Delta } from '../../types';

interface MetricsPanelProps {
    deltas: Delta[];
    yearsLeft: number;
    lifeExpectancyChange: number;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ deltas, yearsLeft, lifeExpectancyChange }) => {
    const isPositive = lifeExpectancyChange >= 0;
    const impactColor = isPositive ? 'text-green-400' : 'text-red-400';
    const impactBgColor = isPositive ? 'bg-green-400/20' : 'bg-red-400/20';
    const impactBorderColor = isPositive ? 'border-green-400/30' : 'border-red-400/30';

    const totalDeltaHours = useMemo(() => {
        return deltas.reduce((sum, delta) => sum + delta.deltaMinutes, 0) / 60;
    }, [deltas]);
    return (
        <Card>
                <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                    Lifetime Impact
                </h3>
                
                <div className={`text-center p-4 rounded-lg ${impactBgColor} border ${impactBorderColor} mb-4`}>
                    <p className="text-sm text-gray-300">Your Life Expectancy</p>
                    <p className="text-2xl font-bold text-white mb-2">
                        {(yearsLeft + lifeExpectancyChange).toFixed(1)} years
                    </p>
                    <p className={`text-lg font-semibold ${impactColor}`}>
                        ({isPositive ? '+' : ''}{lifeExpectancyChange.toFixed(1)} year gain)
                    </p>
                </div>
                
                {deltas.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-300">Daily Changes:</h4>
                        {deltas.map(delta => (
                            <div key={delta.name} className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">{delta.name}</span>
                                <span className={delta.deltaMinutes > 0 ? 'text-green-400' : 'text-yellow-400'}>
                                    {delta.deltaMinutes > 0 ? '+' : ''}{(delta.deltaMinutes / 60).toFixed(1)}h
                                </span>
                            </div>
                        ))}
                        <div className="border-t border-gray-600 pt-2 mt-2">
                            <div className="flex justify-between items-center text-sm font-semibold">
                                <span className="text-white">Total Daily Change:</span>
                                <span className={totalDeltaHours > 0 ? 'text-green-400' : totalDeltaHours < 0 ? 'text-red-400' : 'text-gray-400'}>
                                    {totalDeltaHours > 0 ? '+' : ''}{totalDeltaHours.toFixed(1)}h
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="mt-4 p-3 bg-gray-700/30 rounded-lg">
                    <p className="text-xs text-gray-400 text-center">
                        💡 Small daily changes compound into years of life gained or lost
                    </p>
                </div>
        </Card>
    );
};

export default MetricsPanel;