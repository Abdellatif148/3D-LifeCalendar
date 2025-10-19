import React, { useMemo } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import type { Delta } from '../../types';

interface MetricsPanelProps {
  deltas: Delta[];
  yearsLeft: number;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ deltas, yearsLeft }) => {
  const { annualHoursGained, lifetimeDaysGained, totalDeltaMinutes } =
    useMemo(() => {
      const totalDeltaMinutes = deltas.reduce(
        (sum, delta) => sum + delta.deltaMinutes,
        0
      );
      const annualHoursGained = (totalDeltaMinutes * 365) / 60;
      const lifetimeDaysGained = (annualHoursGained * yearsLeft) / 24;
      return { totalDeltaMinutes, annualHoursGained, lifetimeDaysGained };
    }, [deltas, yearsLeft]);

  const gainOrLossText = totalDeltaMinutes >= 0 ? 'Gained' : 'Reallocated';
  const gainOrLossColor =
    totalDeltaMinutes >= 0 ? 'text-green-400' : 'text-yellow-400';

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-bold mb-4">Lifetime Impact</h3>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Annual Hours {gainOrLossText}
            </p>
            <p className={`text-4xl font-bold ${gainOrLossColor}`}>
              {annualHoursGained.toFixed(1)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Lifetime Days {gainOrLossText}
            </p>
            <p className={`text-4xl font-bold ${gainOrLossColor}`}>
              {lifetimeDaysGained.toFixed(1)}
            </p>
          </div>
        </div>
      </Card>
      <Card>
        <h3 className="text-lg font-bold mb-4">Create a Tiny Plan</h3>
        <p className="text-sm text-gray-400 mb-4">
          Turn your simulation into action. Create a recurring calendar event to
          nudge you towards your new goals.
        </p>
        <Button className="w-full" disabled={totalDeltaMinutes === 0}>
          Export .ICS Nudges
        </Button>
        <p className="text-xs text-gray-500 mt-2 text-center">
          ICS export functionality coming soon.
        </p>
      </Card>
      <Card>
        <h3 className="text-lg font-bold mb-4">Sync Your Data</h3>
        <p className="text-sm text-gray-400 mb-4">
          Sign in to save your baselines and plans across devices.
        </p>
        <Button variant="secondary" className="w-full">
          Sign In with Supabase
        </Button>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Supabase integration coming soon.
        </p>
      </Card>
    </div>
  );
};

export default MetricsPanel;
