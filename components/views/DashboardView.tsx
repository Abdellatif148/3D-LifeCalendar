import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLifeData } from '../../hooks/useLifeData';
import { useTimeData } from '../../hooks/useTimeData';
import type { CategoryName, Delta, AppNotification, DailyTask, DayData, YearData } from '../../types';
import { MINUTES_IN_DAY } from '../../constants';
import ControlPanel from '../dashboard/ControlPanel';
import LifeGrid3D from '../dashboard/LifeGrid3D';
import YearView from './YearView';
import { GlobalSearch } from '../dashboard/GlobalSearch';
import MetricsPanel from '../dashboard/MetricsPanel';
import Button from '../ui/Button';
import GuideView from './GuideView';
import CalendarView from './CalendarView';
import NotesView from './NotesView';
import NotificationToast from '../ui/NotificationToast';
import LoadingSpinner from '../ui/LoadingSpinner';

interface DashboardViewProps {
    onReset: () => void;
    onSettings: () => void;
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

        const intervalId = setInterval(checkReminders, 30 * 1000);
        return () => clearInterval(intervalId);
    }, [timeData, onShowNotification]);
};

const DashboardView: React.FC<DashboardViewProps> = ({ onReset, onSettings }) => {
    const { signOut } = useAuth();
    const { lifeData } = useLifeData();
    const [deltas, setDeltas] = useState<Delta[]>([]);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [initialView, setInitialView] = useState<{ month: number | null, week: number | null, day: number | null }>({ month: null, week: null, day: null });
    const [currentView, setCurrentView] = useState<'dashboard' | 'guide' | 'calendar' | 'notes'>('dashboard');
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const showNotification = useCallback((title: string, message: string) => {
        setNotifications(prev => [...prev, { id: Date.now(), title, message }]);
    }, []);

    useReminderScheduler(showNotification);

    const closeNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handleLogout = async () => {
        setIsLoading(true);
        await signOut();
        setIsLoading(false);
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
                <header className="flex-shrink-0 bg-gray-900/80 backdrop-blur-sm z-20 p-3 flex flex-wrap justify-between items-center border-b border-gray-700 gap-2">
                    <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">3D Time Optimizer</h1>
                    <div className="flex items-center gap-2 flex-wrap">
                        <GlobalSearch onNavigate={handleSearchNavigate} targetAge={lifeData.targetAge} currentAge={lifeData.currentAge} />
                        <Button onClick={() => handleNav('guide')} variant="secondary" size="sm">Guide</Button>
                        <Button onClick={() => handleNav('calendar')} variant="secondary" size="sm">Calendar</Button>
                        <Button onClick={() => handleNav('notes')} variant="secondary" size="sm">Notes</Button>
                        <Button onClick={onSettings} variant="secondary" size="sm" aria-label="Settings">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </Button>
                        <Button onClick={onReset} variant="secondary" size="sm">Reset</Button>
                        <Button onClick={handleLogout} variant="secondary" size="sm" loading={isLoading}>
                            {isLoading ? <LoadingSpinner size="sm" color="white" /> : 'Logout'}
                        </Button>
                    </div>
                </header>
                <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
                    <main className="flex-grow relative order-2 md:order-1" role="main" aria-label="3D Life Visualization">
                        <LifeGrid3D currentAge={lifeData.currentAge} targetAge={lifeData.targetAge} dominantColorActivity={dominantColorActivity} onYearClick={handleYearClick} deltas={deltas} />
                    </main>
                    <aside className="w-full md:w-96 bg-gray-800/50 backdrop-blur-sm border-l border-gray-700/50 p-4 overflow-y-auto order-1 md:order-2" role="complementary" aria-label="Control Panel">
                        <div className="space-y-6">
                            <ControlPanel activities={modifiedActivities} onSliderChange={handleSliderChange} deltas={deltas} yearsLeft={yearsLeft} />
                            <MetricsPanel lifeData={lifeData} deltas={deltas} />
                        </div>
                    </aside>
                </div>
                <div className="fixed top-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] space-y-2" role="region" aria-label="Notifications">
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