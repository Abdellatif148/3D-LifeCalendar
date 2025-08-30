import React, { useMemo } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import type { Delta } from '../../types';

interface MetricsPanelProps {
    deltas: Delta[];
    yearsLeft: number;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ deltas, yearsLeft }) => {
    const { annualHoursGained, lifetimeDaysGained, totalDeltaMinutes, impactMessage } = useMemo(() => {
        const totalDeltaMinutes = deltas.reduce((sum, delta) => sum + delta.deltaMinutes, 0);
        const annualHoursGained = (totalDeltaMinutes * 365) / 60;
        const lifetimeDaysGained = (annualHoursGained * yearsLeft) / 24;
        
        let impactMessage = "Make a change to see your impact";
        if (Math.abs(lifetimeDaysGained) > 365) {
            impactMessage = `That's ${Math.abs(lifetimeDaysGained / 365).toFixed(1)} extra years!`;
        } else if (Math.abs(lifetimeDaysGained) > 30) {
            impactMessage = `That's ${Math.abs(lifetimeDaysGained / 30).toFixed(1)} extra months!`;
        } else if (Math.abs(lifetimeDaysGained) > 7) {
            impactMessage = `That's ${Math.abs(lifetimeDaysGained / 7).toFixed(1)} extra weeks!`;
        } else if (Math.abs(lifetimeDaysGained) > 1) {
            impactMessage = `That's ${Math.abs(lifetimeDaysGained).toFixed(1)} extra days!`;
        }
        
        return { totalDeltaMinutes, annualHoursGained, lifetimeDaysGained, impactMessage };
    }, [deltas, yearsLeft]);

    const isPositive = totalDeltaMinutes >= 0;
    const impactColor = isPositive ? 'text-green-400' : 'text-yellow-400';
    const glowColor = isPositive ? 'from-green-400/20 to-emerald-500/20' : 'from-yellow-400/20 to-orange-500/20';

    return (
        <div className="space-y-6">
            <Card>
                <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                    Lifetime Impact
                </h3>
                
                {totalDeltaMinutes !== 0 ? (
                    <div className={`bg-gradient-to-r ${glowColor} rounded-lg p-4 border border-white/10 mb-4`}>
                        <div className="text-center space-y-4">
                            <div>
                                <p className="text-sm text-gray-300">Annual Hours {isPositive ? 'Gained' : 'Reallocated'}</p>
                                <p className={`text-3xl font-black ${impactColor}`}>
                                    {isPositive ? '+' : ''}{annualHoursGained.toFixed(0)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-300">Lifetime Days {isPositive ? 'Gained' : 'Reallocated'}</p>
                                <p className={`text-4xl font-black ${impactColor}`}>
                                    {isPositive ? '+' : ''}{Math.abs(lifetimeDaysGained).toFixed(0)}
                                </p>
                            </div>
                            <p className={`text-sm font-semibold ${impactColor}`}>
                                {impactMessage}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <div className="text-4xl mb-3">⚡</div>
                        <p>Adjust your habits above to see the lifetime impact</p>
                    </div>
                )}
            </Card>
            
            <Card>
                <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    Create Tiny Nudges
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                    Turn your simulation into action. Export calendar reminders that nudge you toward your optimized life.
                </p>
                
                {deltas.length > 0 && (
                    <div className="mb-4 space-y-2">
                        <h4 className="text-sm font-semibold text-gray-300">Your Changes:</h4>
                        {deltas.map(delta => (
                            <div key={delta.name} className="flex justify-between text-xs">
                                <span className="text-gray-400">{delta.name}</span>
                                <span className={delta.deltaMinutes > 0 ? 'text-green-400' : 'text-yellow-400'}>
                                    {delta.deltaMinutes > 0 ? '+' : ''}{(delta.deltaMinutes / 60).toFixed(1)}h/day
                                </span>
                            </div>
                        ))}
                    </div>
                )}
                
                <Button 
                    className="w-full mb-2" 
                    disabled={totalDeltaMinutes === 0}
                >
                    📅 Export Nudge Calendar
                </Button>
                <p className="text-xs text-gray-500 text-center">
                    Creates recurring reminders for your habit changes
                </p>
            </Card>
            
            <Card>
                <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    Save Your Progress
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                    Sign in to save your baselines and track your progress over time.
                </p>
                <Button variant="secondary" className="w-full mb-2">
                    🔐 Sign In to Save
                </Button>
                <p className="text-xs text-gray-500 text-center">
                    Sync across devices • Track real progress
                </p>
            </Card>
        </div>
    );
};

export default MetricsPanel;