import React from 'react';
import Card from '../ui/Card';
import type { LifeData, Delta } from '../../types';

interface MetricsPanelProps {
    lifeData: LifeData;
    deltas: Delta[];
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ lifeData, deltas }) => {
    const yearsLeft = Math.max(0, lifeData.targetAge - lifeData.currentAge);
    const weeksLeft = yearsLeft * 52;
    const daysLeft = yearsLeft * 365;
    
    const totalDeltaMinutes = deltas.reduce((sum, delta) => sum + delta.deltaMinutes, 0);
    const annualHoursImpact = Math.abs((totalDeltaMinutes * 365) / 60);
    const lifetimeDaysImpact = Math.abs((annualHoursImpact * yearsLeft) / 24);

    const metrics = [
        { label: 'Years Left', value: yearsLeft, color: 'text-blue-400' },
        { label: 'Weeks Left', value: weeksLeft.toLocaleString(), color: 'text-green-400' },
        { label: 'Days Left', value: daysLeft.toLocaleString(), color: 'text-purple-400' },
        { 
            label: totalDeltaMinutes >= 0 ? 'Days Gained' : 'Days Lost', 
            value: lifetimeDaysImpact.toFixed(1), 
            color: totalDeltaMinutes >= 0 ? 'text-green-400' : 'text-red-400' 
        },
    ];

    return (
        <Card>
            <h3 className="text-lg font-bold mb-4">Life Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
                {metrics.map((metric, index) => (
                    <div key={index} className="text-center">
                        <p className="text-xs text-gray-400">{metric.label}</p>
                        <p className={`text-xl font-bold ${metric.color}`}>{metric.value}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default MetricsPanel;