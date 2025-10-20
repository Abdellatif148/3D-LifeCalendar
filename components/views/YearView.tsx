import React, { useState, useEffect, useCallback } from 'react';
import type { DailyTask, DayData, YearData } from '../../types';
import { useTimeData } from '../../hooks/useTimeData';
import Button from '../ui/Button';
import Card from '../ui/Card';

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface YearViewProps {
    year: number;
    currentAge: number;
    onBack: () => void;
    initialMonth: number | null;
    initialWeek: number | null;
    initialDay: number | null;
}

const YearView: React.FC<YearViewProps> = ({ year, onBack, initialMonth, initialWeek, initialDay }) => {
    const { getYearData, getDayData, updateDayData, updateYearTitle } = useTimeData();
    const [yearData, setYearData] = useState<YearData>(() => getYearData(year));
    const [selectedDay, setSelectedDay] = useState<{ month: number; week: number; day: number; dayOfMonth: number; } | null>(null);

    useEffect(() => {
        setYearData(getYearData(year));
    }, [getYearData, year]);
    
    useEffect(() => {
        if(initialMonth !== null && initialWeek !== null && initialDay !== null) {
            const dayOfMonth = (initialWeek * 7) + initialDay + 1; // Approx.
            setSelectedDay({month: initialMonth, week: initialWeek, day: initialDay, dayOfMonth})
        }
    }, [initialMonth, initialWeek, initialDay]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setYearData(prev => ({...prev, title: e.target.value}));
        updateYearTitle(year, e.target.value);
    };

    const handleDayDataUpdate = (dayData: DayData) => {
        if (!selectedDay) return;
        const date = new Date(year, selectedDay.month, selectedDay.dayOfMonth);
        updateDayData(date, dayData);
        setYearData(getYearData(year)); // Re-fetch to update view
    };

    const renderMonth = (monthIndex: number) => {
        const firstDay = new Date(year, monthIndex, 1).getDay();
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const blanks = Array.from({ length: firstDay }, (_, i) => <div key={`blank-${i}`} className="p-1"></div>);

        return (
            <Card key={monthIndex} className="w-full">
                <h3 className="text-lg font-bold text-center text-purple-400 mb-2">{MONTH_NAMES[monthIndex]}</h3>
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-1">
                    {DAY_NAMES.map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {blanks}
                    {days.map(dayOfMonth => {
                         const date = new Date(year, monthIndex, dayOfMonth);
                         const dayData = getDayData(date);
                         const goals = dayData.goals || [];
                         const hasGoals = goals.length > 0;
                         const completedGoals = goals.filter(g => g.completed).length;

                        return (
                            <div
                                key={dayOfMonth}
                                onClick={() => {
                                    const weekIndex = Math.floor((firstDay + dayOfMonth - 1) / 7);
                                    const dayIndex = (firstDay + dayOfMonth - 1) % 7;
                                    setSelectedDay({ month: monthIndex, week: weekIndex, day: dayIndex, dayOfMonth })
                                }}
                                className={`p-1 h-12 flex flex-col items-center justify-center rounded-md cursor-pointer transition-colors ${selectedDay?.dayOfMonth === dayOfMonth && selectedDay?.month === monthIndex ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                            >
                                <span className="text-sm font-bold">{dayOfMonth}</span>
                                {hasGoals && (
                                     <span className={`text-xs ${completedGoals === goals.length ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {completedGoals}/{goals.length}
                                     </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Card>
        );
    };
    
    const dayDataForDetail = selectedDay ? getDayData(new Date(year, selectedDay.month, selectedDay.dayOfMonth)) : {title: '', goals: []};

    return (
        <div className="flex flex-col h-screen bg-gray-900">
            <header className="flex-shrink-0 bg-gray-900/80 backdrop-blur-sm z-20 p-3 flex justify-between items-center border-b border-gray-700">
                <Button onClick={onBack} variant="secondary">&larr; Back to Dashboard</Button>
                <input
                    type="text"
                    value={yearData.title}
                    onChange={handleTitleChange}
                    className="text-xl font-bold text-white bg-transparent text-center focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-md px-2"
                />
                <div className="w-48 text-right text-gray-400">Age: {year + 1}</div>
            </header>
            <main className="flex-grow flex overflow-hidden">
                <div className="flex-grow p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto">
                    {MONTH_NAMES.map((_, i) => renderMonth(i))}
                </div>
                {selectedDay && (
                    <aside className="w-full md:w-96 bg-gray-800/50 backdrop-blur-sm border-l border-gray-700/50 p-4 overflow-y-auto flex flex-col">
                        <DayDetailView
                            day={selectedDay}
                            dayData={dayDataForDetail}
                            onUpdate={handleDayDataUpdate}
                            onClose={() => setSelectedDay(null)}
                        />
                    </aside>
                )}
            </main>
        </div>
    );
};


interface DayDetailViewProps {
    day: { month: number; week: number; day: number; dayOfMonth: number; };
    dayData: DayData;
    onUpdate: (data: DayData) => void;
    onClose: () => void;
}

const DayDetailView: React.FC<DayDetailViewProps> = ({ day, dayData, onUpdate, onClose }) => {
    const [localDayData, setLocalDayData] = useState(dayData);
    const [newTaskText, setNewTaskText] = useState('');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingText, setEditingText] = useState('');

    useEffect(() => {
        setLocalDayData(dayData);
    }, [dayData]);

    const handleAddTask = () => {
        if (newTaskText.trim()) {
            const newTask: DailyTask = { text: newTaskText.trim(), completed: false, type: 'task' };
            const newDayData = { ...localDayData, goals: [...localDayData.goals, newTask] };
            setLocalDayData(newDayData);
            onUpdate(newDayData);
            setNewTaskText('');
        }
    };

    const handleToggleTask = (index: number) => {
        const newGoals = localDayData.goals.map((task, i) => i === index ? { ...task, completed: !task.completed } : task);
        const newDayData = { ...localDayData, goals: newGoals };
        setLocalDayData(newDayData);
        onUpdate(newDayData);
    };
    
    const handleDeleteTask = (index: number) => {
        const newGoals = localDayData.goals.filter((_, i) => i !== index);
        const newDayData = { ...localDayData, goals: newGoals };
        setLocalDayData(newDayData);
        onUpdate(newDayData);
    };
    
    const handleUpdateTask = (index: number) => {
        if (editingText.trim()) {
            const newGoals = localDayData.goals.map((task, i) => (i === index ? { ...task, text: editingText.trim() } : task));
            const newDayData = { ...localDayData, goals: newGoals };
            setLocalDayData(newDayData);
            onUpdate(newDayData);
        }
        setEditingIndex(null);
        setEditingText('');
    };

    const handleStartEdit = (index: number, task: DailyTask) => {
        if (!task.completed) {
            setEditingIndex(index);
            setEditingText(task.text);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDayData = { ...localDayData, title: e.target.value };
        setLocalDayData(newDayData);
        onUpdate(newDayData);
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold">{MONTH_NAMES[day.month]} {day.dayOfMonth}</h2>
                 <Button onClick={onClose} variant="secondary" className="px-2 py-1 text-xs">&times;</Button>
            </div>
            <div className="mb-4">
                <label className="text-sm font-bold text-purple-400">Main Focus</label>
                <input
                    type="text"
                    value={localDayData.title}
                    onChange={handleTitleChange}
                    placeholder="Set a main goal for the day..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
            </div>
            <div className="flex-grow space-y-2 overflow-y-auto">
                 <h3 className="text-sm font-bold text-gray-400">Tasks</h3>
                {localDayData.goals.map((task, index) => (
                    <div key={index} className={`group flex items-center p-3 rounded-md transition-all duration-200 hover:bg-gray-600/50 ${task.completed ? 'bg-gray-700/30' : 'bg-gray-700'}`}>
                        <input type="checkbox" checked={task.completed} onChange={() => handleToggleTask(index)} className="h-5 w-5 rounded bg-gray-600 border-gray-500 text-purple-500 focus:ring-purple-600 flex-shrink-0"/>
                        {editingIndex === index ? (
                            <input
                                type="text"
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                onBlur={() => handleUpdateTask(index)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleUpdateTask(index); if (e.key === 'Escape') setEditingIndex(null); }}
                                autoFocus
                                className="ml-3 flex-grow bg-gray-600 text-white rounded px-2 py-1 outline-none ring-2 ring-purple-500"
                            />
                        ) : (
                            <span 
                                className={`ml-3 flex-grow transition-colors ${task.completed ? 'line-through text-gray-500' : 'text-gray-200 cursor-pointer hover:text-white'}`}
                                onClick={() => handleStartEdit(index, task)}
                            >
                                {task.text}
                            </span>
                        )}
                        <button 
                            onClick={() => handleDeleteTask(index)} 
                            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 text-lg ml-2 flex-shrink-0 transition-all duration-200 w-6 h-6 flex items-center justify-center"
                            title="Delete task"
                        >
                            ×
                        </button>
                    </div>
                ))}
                {localDayData.goals.length === 0 && <p className="text-gray-500 text-center py-4">No tasks for this day.</p>}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
                <input
                    type="text"
                    value={newTaskText}
                    onChange={e => setNewTaskText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                    placeholder="Add a new task..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                <Button onClick={handleAddTask} className="w-full mt-2" disabled={!newTaskText.trim()}>Add Task</Button>
            </div>
        </div>
    );
}

export default YearView;