import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import type { Delta } from '../../types';

interface TinyNudgesProps {
    deltas: Delta[];
}

const TinyNudges: React.FC<TinyNudgesProps> = ({ deltas }) => {
    const totalDeltaMinutes = deltas.reduce((sum, delta) => sum + delta.deltaMinutes, 0);

    return (
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
                    onClick={() => {
                        const cal = [
                            'BEGIN:VCALENDAR',
                            'VERSION:2.0',
                            'PRODID:-//LifeCalendar//EN',
                            ...deltas.map(delta => {
                                return [
                                    'BEGIN:VEVENT',
                                    `UID:${new Date().getTime()}@lifecalendar.com`,
                                    `DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '')}`,
                                    `SUMMARY:Life Calendar Nudge: ${delta.name}`,
                                    `DESCRIPTION:A reminder to spend time on ${delta.name}.`,
                                    'RRULE:FREQ=DAILY',
                                    'END:VEVENT'
                                ].join('\\n');
                            }),
                            'END:VCALENDAR'
                        ].join('\\n');

                        const blob = new Blob([cal], { type: 'text/calendar' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'lifecalendar-nudges.ics';
                        a.click();
                        URL.revokeObjectURL(url);
                    }}
            >
                📅 Export Nudge Calendar
            </Button>
            <p className="text-xs text-gray-500 text-center">
                Creates recurring reminders for your habit changes
            </p>
        </Card>
    );
};

export default TinyNudges;
