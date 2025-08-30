import React, { useMemo } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import type { Delta } from '../../types';

interface MetricsPanelProps {
    deltas: Delta[];
    yearsLeft: number;
    lifeExpectancyChange: number;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ deltas, yearsLeft, lifeExpectancyChange }) => {
    const isPositive = lifeExpectancyChange >= 0;
    const impactColor = isPositive ? 'text-green-400' : 'text-red-400';

    return (
        <div className="space-y-6">
            <Card>
                <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                    Lifetime Impact
                </h3>
                <div className="text-center">
                    <p className="text-sm text-gray-300">Your Life Expectancy</p>
                    <p className={`text-4xl font-black ${impactColor}`}>
                        {yearsLeft.toFixed(1)} years → {(yearsLeft + lifeExpectancyChange).toFixed(1)} years
                    </p>
                    <p className={`text-lg font-semibold ${impactColor}`}>
                        ({isPositive ? '+' : ''}{lifeExpectancyChange.toFixed(1)} year gain)
                    </p>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full my-4">
                    <div className={`h-2 rounded-full ${isPositive ? 'bg-green-400' : 'bg-red-400'}`} style={{ width: `${Math.abs(lifeExpectancyChange) * 10}%` }}></div>
                </div>
            </Card>
        </div>
    );
};

export default MetricsPanel;