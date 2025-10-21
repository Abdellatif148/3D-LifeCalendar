import React from 'react';
import Card from '../ui/Card';
import type { LifeData, Delta } from '../../types';

interface MetricsPanelProps {
    lifeData: LifeData;
    deltas: Delta[];
}

const MetricsPanel: React.FC<MetricsPanelProps> = React.memo(({ lifeData, deltas }) => {
    const yearsLeft = Math.max(0, lifeData.targetAge - lifeData.currentAge);
    const weeksLeft = yearsLeft * 52;
    const daysLeft = yearsLeft * 365;

    const totalDeltaMinutes = deltas.reduce((sum, delta) => sum + delta.deltaMinutes, 0);
    const annualHoursImpact = Math.abs((totalDeltaMinutes * 365) / 60);
    const lifetimeDaysImpact = Math.abs((annualHoursImpact * yearsLeft) / 24);

    const metrics = React.useMemo(() => [
        { 
            label: 'Years Left', 
            value: yearsLeft.toString(), 
            color: 'text-primary-500',
            bgColor: 'bg-primary-50 dark:bg-primary-900/20'
        },
        { 
            label: 'Weeks Left', 
            value: weeksLeft.toLocaleString(), 
            color: 'text-accent-500',
            bgColor: 'bg-accent-50 dark:bg-accent-900/20'
        },
        { 
            label: 'Days Left', 
            value: daysLeft.toLocaleString(), 
            color: 'text-purple-500',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20'
        },
        {
            label: totalDeltaMinutes >= 0 ? 'Days Gained' : 'Days Lost',
            value: lifetimeDaysImpact.toFixed(1),
            color: totalDeltaMinutes >= 0 ? 'text-accent-500' : 'text-red-500',
            bgColor: totalDeltaMinutes >= 0 ? 'bg-accent-50 dark:bg-accent-900/20' : 'bg-red-50 dark:bg-red-900/20'
        },
    ], [yearsLeft, weeksLeft, daysLeft, totalDeltaMinutes, lifetimeDaysImpact]);

    return (
        <Card variant="elevated" padding="lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Life Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
                {metrics.map((metric, index) => (
                    <div key={index} className={`text-center p-4 rounded-xl ${metric.bgColor}`}>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{metric.label}</p>
                        <p className={`text-xl font-bold ${metric.color}`}>{metric.value}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
});

MetricsPanel.displayName = 'MetricsPanel';

export default MetricsPanel;