import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useLifeData } from '../../hooks/useLifeData';
import { useTimeData } from '../../hooks/useTimeData';
// FIX: Import DayData and YearData to be used for type assertions.
import type { CategoryName, Delta, AppNotification, DailyTask, DayData, YearData } from '../../types';
import { MINUTES_IN_DAY } from '../../constants';
import ControlPanel from '../dashboard/ControlPanel';
import LifeGrid3D from '../dashboard/LifeGrid3D';
import YearView from './YearView';
import { GlobalSearch } from '../dashboard/GlobalSearch';
import Button from '../ui/Button';
import GuideView from './GuideView';
import CalendarView from './CalendarView';
import NotesView from './NotesView';
import NotificationToast from '../ui/NotificationToast';

interface DashboardViewProps {
    onReset: () => void;
}

const useReminderScheduler = (onShowNotification: (title: string, message: string) => void) => {
    const { timeData } = useTimeData();

    useEffect(() => {
        const checkReminders = () => {
            const now = new Date();
            const notifiedKey = 'notifiedReminders';
            let notifiedReminders: { [key: string]: string } = {};
            try {
                notifiedReminders = JSON.parse(localStorage.getItem(notifiedKey) || '{}');
            } catch (e) { /* ignore */ }

            // FIX: Added type assertions to correctly access nested properties
            // on objects returned by Object.entries.
            Object.entries(timeData).forEach(([yearStr, yearData]) => {
                const year = parseInt(yearStr, 10);
                Object.entries((yearData as YearData).months).forEach(([monthStr, monthData]) => {
                    const month = parseInt(monthStr, 10);
                    Object.entries((monthData as any).weeks).forEach(([weekStr, weekData]) => {
                        const week = parseInt(weekStr, 10);
                        Object.entries((weekData as any).days).forEach(([dayStr, dayData]) => {
                            const dayOfWeek = parseInt(dayStr, 10);
                            
                            ((dayData as DayData).goals || []).forEach((task: DailyTask) => {
                                if (task.reminder && !task.completed) {
                                    // This is an approximation. A robust solution needs full dates.
                                    const approxDayOfMonth = (week * 7) + dayOfWeek + 1; 
                                    const taskDate = new Date(year, month, approxDayOfMonth);
                                    const reminderDateTime = new Date(`${taskDate.toISOString().split('T')[0]}T${task.reminder}`);
                                    const reminderId = `task-${year}-${month}-${week}-${dayOfWeek}-${task.text}`;
                                    
                                    if (now >= reminderDateTime && !notifiedReminders[reminderId]) {
                                        onShowNotification('Task Reminder', task.text);
                                        notifiedReminders[reminderId] = new Date().toISOString();
                                    }
                                }
                            });
                        });
                    });
                });
            });
            
            localStorage.setItem(notifiedKey, JSON.stringify(notifiedReminders));
        };

        const intervalId = setInterval(checkReminders, 30 * 1000); // Check every 30 seconds
        return () => clearInterval(intervalId);
    }, [timeData, onShowNotification]);
};


const DashboardView: React.FC<DashboardViewProps> = ({ onReset }) => {
    const { lifeData } = useLifeData();
    const [deltas, setDeltas] = useState<Delta[]>([]);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [initialView, setInitialView] = useState<{ month: number | null, week: number | null, day: number | null }>({ month: null, week: null, day: null });
    const [currentView, setCurrentView] = useState<'dashboard' | 'guide' | 'calendar' | 'notes'>('dashboard');
    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    const showNotification = useCallback((title: string, message: string) => {
        setNotifications(prev => [...prev, { id: Date.now(), title, message }]);
    }, []);

    useReminderScheduler(showNotification);

    const closeNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const formatTime = (minutes: number) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        if (h > 0 && m > 0) return `${h}h ${m}m`;
        if (h > 0) return `${h}h`;
        return `${m}m`;
    };

    const modifiedActivities = useMemo(() => {
        let totalDelta = deltas.reduce((sum, d) => sum + d.deltaMinutes, 0);

        return lifeData.activities.map(act => {
            const delta = deltas.find(d => d.name === act.name)?.deltaMinutes || 0;
            let newMinutes = act.minutesPerDay + delta;

            if (act.name === 'Unallocated') {
                newMinutes -= totalDelta;
            }
            newMinutes = Math.max(0, Math.min(MINUTES_IN_DAY, newMinutes));

            return { ...act, minutesPerDay: newMinutes, displayTime: formatTime(newMinutes) };
        });
    }, [lifeData.activities, deltas]);

    const handleSliderChange = useCallback((name: CategoryName, deltaMinutes: number) => {
        setDeltas(prevDeltas => {
            const existingDelta = prevDeltas.find(d => d.name === name);
            if (deltaMinutes === 0) {
                 return prevDeltas.filter(d => d.name !== name);
            }
            if (existingDelta) {
                return prevDeltas.map(d => d.name === name ? { ...d, deltaMinutes } : d);
            }
            return [...prevDeltas, { name, deltaMinutes }];
        });
    }, []);

    const dominantColorActivity = useMemo(() => {
         const nonSleepWork = modifiedActivities.filter(a => a.name !== 'Sleep' && a.name !== 'Work/Study' && a.name !== 'Unallocated');
        if (nonSleepWork.length === 0) return 'Hobbies';
        return nonSleepWork.reduce((max, act) => act.minutesPerDay > max.minutesPerDay ? act : max, nonSleepWork[0]).name;
    }, [modifiedActivities]);
    
    const yearsLeft = Math.max(0, lifeData.targetAge - lifeData.currentAge);

    const handleYearClick = (year: number) => {
        setInitialView({ month: null, week: null, day: null });
        setSelectedYear(year);
    };

    const handleBack = () => {
        setSelectedYear(null);
        setCurrentView('dashboard');
        setInitialView({ month: null, week: null, day: null });
    }

    const handleSearchNavigate = ({ year, month, week, day }: { year: number, month: number | null, week: number | null, day: number | null }) => {
        setSelectedYear(year);
        setInitialView({ month, week, day });
    };

    if (selectedYear !== null) {
        return <YearView year={selectedYear} currentAge={lifeData.currentAge} onBack={handleBack} initialMonth={initialView.month} initialWeek={initialView.week} initialDay={initialView.day} />;
    }
    
    const mainDashboardVisible = currentView === 'dashboard';
    const guideVisible = currentView === 'guide';
    const calendarVisible = currentView === 'calendar';
    const notesVisible = currentView === 'notes';

    const handleNav = (view: 'dashboard' | 'guide' | 'calendar' | 'notes') => {
        setCurrentView(view);
    };

    return (
        <>
            <div style={{ display: mainDashboardVisible ? 'flex' : 'none' }} className="flex-col h-screen bg-gray-900 overflow-hidden">
                <header className="flex-shrink-0 bg-gray-900/80 backdrop-blur-sm z-20 p-3 flex justify-between items-center border-b border-gray-700">
                    <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">3D Time Optimizer</h1>
                    <div className="flex items-center gap-4">
                        <GlobalSearch onNavigate={handleSearchNavigate} targetAge={lifeData.targetAge} currentAge={lifeData.currentAge} />
                        <Button onClick={() => handleNav('guide')} variant="secondary" className="px-4 py-2 text-sm">Guide</Button>
                        <Button onClick={() => handleNav('calendar')} variant="secondary" className="px-4 py-2 text-sm">Calendar</Button>
                        <Button onClick={() => handleNav('notes')} variant="secondary" className="px-4 py-2 text-sm">Notes</Button>
                        <Button onClick={onReset} variant="secondary" className="px-4 py-2 text-sm">Reset</Button>
                    </div>
                </header>
                <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
                    <main className="flex-grow relative order-2 md:order-1">
                        <LifeGrid3D currentAge={lifeData.currentAge} targetAge={lifeData.targetAge} dominantColorActivity={dominantColorActivity} onYearClick={handleYearClick} deltas={deltas} />
                    </main>
                    <aside className="w-full md:w-96 bg-gray-800/50 backdrop-blur-sm border-l border-gray-700/50 p-4 overflow-y-auto order-1 md:order-2">
                        <div className="space-y-6">
                            <ControlPanel activities={modifiedActivities} onSliderChange={handleSliderChange} deltas={deltas} yearsLeft={yearsLeft} />
                        </div>
                    </aside>
                </div>
                <div className="absolute top-4 right-4 z-50 w-80 space-y-2">
                    {notifications.map(n => <NotificationToast key={n.id} notification={n} onClose={() => closeNotification(n.id)} />)}
                </div>
            </div>

            <div style={{ display: guideVisible ? 'flex' : 'none', height: '100vh', flexDirection: 'column' }}>
                <GuideView onBack={() => handleNav('dashboard')} />
            </div>
            <div style={{ display: calendarVisible ? 'flex' : 'none', height: '100vh', flexDirection: 'column' }}>
                <CalendarView onBack={() => handleNav('dashboard')} />
            </div>
            <div style={{ display: notesVisible ? 'flex' : 'none', height: '100vh', flexDirection: 'column' }}>
                <NotesView onBack={() => handleNav('dashboard')} />
            </div>
        </>
    );
};

export default DashboardView;