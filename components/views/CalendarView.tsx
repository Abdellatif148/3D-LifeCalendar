import React, { useState, useEffect, useMemo } from 'react';
import type { DailyTask } from '../../types';
import { useTimeData } from '../../hooks/useTimeData';
import Button from '../ui/Button';
import Card from '../ui/Card';

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_NAMES_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

type ViewMode = 'month' | 'week' | '4-day' | 'day';
type FilterType = 'all' | 'task' | 'event';

const CalendarView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [filterType, setFilterType] = useState<FilterType>('all');
    
    const { getDayData, addTaskToDay } = useTimeData();

    const changeDate = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (viewMode === 'month') newDate.setMonth(prev.getMonth() + offset);
            else if (viewMode === 'week') newDate.setDate(prev.getDate() + (offset * 7));
            else if (viewMode === '4-day') newDate.setDate(prev.getDate() + (offset * 4));
            else newDate.setDate(prev.getDate() + offset);
            return newDate;
        });
    };

    const handleDayClick = (day: number | Date) => {
        const date = (typeof day === 'number') ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day) : day;
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const handleSaveTask = (task: DailyTask) => {
        if (!selectedDate) return;
        addTaskToDay(selectedDate, task);
        setIsModalOpen(false);
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const filteredTasks = (tasks: DailyTask[]) => {
        if (filterType === 'all') return tasks;
        return tasks.filter(t => t.type === filterType);
    };

    const dateRange = useMemo(() => {
        const d = new Date(currentDate);
        let start: Date, end: Date;
        if (viewMode === 'month') {
            start = new Date(d.getFullYear(), d.getMonth(), 1);
            end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        } else if (viewMode === 'week') {
            const dayOfWeek = d.getDay();
            start = new Date(d);
            start.setDate(d.getDate() - dayOfWeek);
            end = new Date(start);
            end.setDate(start.getDate() + 6);
        } else if (viewMode === '4-day') {
            start = new Date(d);
            end = new Date(d);
            end.setDate(d.getDate() + 3);
        } else { // day view
            start = new Date(d);
            end = new Date(d);
        }
        return { start, end };
    }, [currentDate, viewMode]);
    
    const renderCalendarGrid = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const blanks = Array.from({ length: firstDay }, (_, i) => <div key={`blank-${i}`} className="border border-gray-800 p-2 h-32"></div>);
        const days = Array.from({ length: daysInMonth }, (_, i) => {
            const dayOfMonth = i + 1;
            const date = new Date(year, month, dayOfMonth);
            const dayData = getDayData(date);
            
            return (
                <div key={dayOfMonth} className={`border border-gray-800 p-2 h-32 flex flex-col group relative ${isToday(date) ? 'bg-purple-900/30' : ''}`}>
                    <span className={`font-bold ${isToday(date) ? 'text-purple-300' : ''}`}>{dayOfMonth}</span>
                    <div className="text-xs mt-1 space-y-1 overflow-y-auto flex-grow">
                        {dayData.title && (
                            <div className="bg-purple-600 text-white font-bold rounded px-1 py-0.5 truncate">{dayData.title}</div>
                        )}
                        {dayData && filteredTasks(dayData.goals).map((task, idx) => (
                             <div key={idx} className={`text-xs truncate ${task.completed ? 'text-gray-500 line-through' : (task.type === 'event' ? 'text-yellow-400' : 'text-cyan-300')}`}>
                                {task.text}
                             </div>
                        ))}
                    </div>
                    <Button onClick={() => handleDayClick(dayOfMonth)} className="absolute bottom-1 right-1 text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">+</Button>
                </div>
            );
        });
        return <div className="grid grid-cols-7 flex-grow">{[...blanks, ...days]}</div>;
    };
    
    const renderWeekView = () => {
        const startOfWeek = dateRange.start;
        const days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const dayData = getDayData(date);
            return (
                <div key={i} className={`border border-gray-800 p-2 flex flex-col group relative ${isToday(date) ? 'bg-purple-900/30' : ''}`}>
                    <div className="font-bold text-center">{DAY_NAMES_SHORT[date.getDay()]} <span className={isToday(date) ? 'text-purple-300' : ''}>{date.getDate()}</span></div>
                     <div className="text-xs mt-2 space-y-1 overflow-y-auto flex-grow">
                        {dayData.title && <div className="bg-purple-600 text-white font-bold rounded px-1 py-0.5 truncate">{dayData.title}</div>}
                        {dayData && filteredTasks(dayData.goals).map((task, idx) => (
                             <div key={idx} className={`text-xs truncate ${task.completed ? 'text-gray-500 line-through' : (task.type === 'event' ? 'text-yellow-400' : 'text-cyan-300')}`}>{task.text}</div>
                        ))}
                    </div>
                     <Button onClick={() => handleDayClick(date)} className="absolute bottom-1 right-1 text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">+</Button>
                </div>
            )
        })
        return <div className="grid grid-cols-7 flex-grow gap-1">{days}</div>;
    };
    
    const renderFourDayView = () => {
        const days = Array.from({ length: 4 }, (_, i) => {
            const date = new Date(currentDate);
            date.setDate(currentDate.getDate() + i);
            const dayData = getDayData(date);
            return (
                 <Card key={i} className={`flex flex-col ${isToday(date) ? 'border-purple-500' : ''}`}>
                    <h3 className="font-bold text-lg">{DAY_NAMES_FULL[date.getDay()]}, {date.getDate()}</h3>
                    <div className="text-sm mt-2 space-y-2 overflow-y-auto flex-grow">
                        {dayData.title && <div className="bg-purple-600 text-white font-bold rounded px-2 py-1 truncate">{dayData.title}</div>}
                        {dayData && filteredTasks(dayData.goals).map((task, idx) => (
                            <div key={idx} className={`p-2 rounded ${task.completed ? 'bg-gray-700/50' : (task.type==='event' ? 'bg-yellow-800/50' : 'bg-cyan-800/50')}`}>
                                <p className={task.completed ? 'line-through text-gray-500' : ''}>{task.text}</p>
                                {task.time && <p className="text-xs text-gray-400">{task.time}{task.location && ` at ${task.location}`}</p>}
                            </div>
                        ))}
                         {dayData.goals.length === 0 && !dayData.title && <p className="text-gray-500 text-center pt-4">Nothing scheduled.</p>}
                    </div>
                     <Button onClick={() => handleDayClick(date)} className="mt-4 w-full">Add Item</Button>
                </Card>
            )
        });
        return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 flex-grow gap-4">{days}</div>;
    };
    
    const renderDayView = () => {
        const dayData = getDayData(currentDate);
        const hours = Array.from({ length: 24 }, (_, i) => i);
        return (
            <Card className={`flex-grow overflow-y-auto ${isToday(currentDate) ? 'border-purple-500' : ''}`}>
                 <h2 className="text-2xl font-bold mb-4">{DAY_NAMES_FULL[currentDate.getDay()]}, {currentDate.toLocaleDateString()}</h2>
                 {dayData.title && <div className="bg-purple-600 text-white font-bold rounded px-2 py-1 mb-4 text-center">{dayData.title}</div>}
                <div className="space-y-2">
                {hours.map(hour => (
                    <div key={hour} className="flex border-t border-gray-700/50 py-2">
                        <div className="w-16 text-xs text-gray-400 text-right pr-2">{hour.toString().padStart(2,'0')}:00</div>
                        <div className="flex-grow">
                            {dayData && filteredTasks(dayData.goals).filter(t => t.time && parseInt(t.time.split(':')[0]) === hour).map((task, idx) => (
                                <div key={idx} className={`p-2 rounded text-sm mb-1 ${task.completed ? 'bg-gray-700/50' : (task.type==='event' ? 'bg-yellow-800/50' : 'bg-cyan-800/50')}`}>
                                     <p className={task.completed ? 'line-through text-gray-500' : ''}>{task.time} - {task.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                </div>
                 <Button onClick={() => handleDayClick(currentDate)} className="mt-4 w-full">Add Item</Button>
            </Card>
        )
    };

    const viewTitles = { month: "Month View", week: "Week View", "4-day": "Agenda", day: "Day View" };
    const dateTitle = {
        month: `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
        week: `Week of ${dateRange.start.toLocaleDateString()}`,
        "4-day": `Starting ${currentDate.toLocaleDateString()}`,
        day: currentDate.toLocaleDateString()
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900">
            <header className="flex-shrink-0 bg-gray-900/80 backdrop-blur-sm z-20 p-3 flex justify-between items-center border-b border-gray-700">
                <Button onClick={onBack} variant="secondary">&larr; Back</Button>
                <div className="flex-grow flex justify-center items-center gap-4">
                    <Button onClick={() => changeDate(-1)} variant="secondary" className="px-3 py-1 text-sm">&lt;</Button>
                    <h1 className="text-xl font-bold text-white w-64 text-center">{dateTitle[viewMode]}</h1>
                    <Button onClick={() => changeDate(1)} variant="secondary" className="px-3 py-1 text-sm">&gt;</Button>
                </div>
                <div className="w-48 flex justify-end gap-2">
                    {Object.keys(viewTitles).map((mode) => (
                         <Button key={mode} onClick={() => setViewMode(mode as ViewMode)} variant={viewMode === mode ? 'primary' : 'secondary'} className="px-3 py-1 text-xs">{viewTitles[mode]}</Button>
                    ))}
                </div>
            </header>
            <main className="flex-grow flex flex-col p-4 gap-4">
                 <div className="flex justify-center gap-2">
                    <span className="text-sm font-bold mr-4">Filter by:</span>
                    {(['all', 'task', 'event'] as FilterType[]).map(type => (
                        <Button key={type} onClick={() => setFilterType(type)} variant={filterType === type ? 'primary' : 'secondary'} className="px-3 py-1 text-xs capitalize">{type}</Button>
                    ))}
                </div>
                {viewMode === 'month' && <div className="grid grid-cols-7 text-center font-bold text-gray-400 mb-2"> {DAY_NAMES_FULL.map(day => <div key={day}>{day}</div>)} </div>}
                <div className="flex-grow bg-gray-800/50 rounded-lg flex flex-col">
                    {viewMode === 'month' && renderCalendarGrid()}
                    {viewMode === 'week' && renderWeekView()}
                    {viewMode === '4-day' && renderFourDayView()}
                    {viewMode === 'day' && renderDayView()}
                </div>
            </main>
            {isModalOpen && selectedDate && (
                <AddTaskModal date={selectedDate} onSave={handleSaveTask} onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
};

const AddTaskModal: React.FC<{date: Date, onSave: (task: DailyTask) => void, onClose: () => void}> = ({date, onSave, onClose}) => {
    const [task, setTask] = useState<Partial<DailyTask>>({ type: 'task', text: '', completed: false, repeat: 'none' });
    
    const handleSave = () => {
        if (!task.text?.trim()) return;
        onSave(task as DailyTask);
    }
    
    const commonFields = (
         <>
            <input
                type="text"
                value={task.text}
                onChange={(e) => setTask(p => ({...p, text: e.target.value}))}
                placeholder="Title..."
                className="w-full bg-gray-700 p-2 rounded"
                required
            />
             <textarea
                value={task.description}
                onChange={(e) => setTask(p => ({...p, description: e.target.value}))}
                placeholder="Description..."
                className="w-full bg-gray-700 p-2 rounded h-20"
            />
        </>
    );

    const eventFields = (
        <>
             <input type="time" value={task.time} onChange={e => setTask(p => ({...p, time: e.target.value}))} className="w-full bg-gray-700 p-2 rounded" />
             <input type="text" value={task.location} onChange={e => setTask(p => ({...p, location: e.target.value}))} placeholder="Location" className="w-full bg-gray-700 p-2 rounded" />
             <input type="text" value={task.guests} onChange={e => setTask(p => ({...p, guests: e.target.value}))} placeholder="Guests (comma-separated)" className="w-full bg-gray-700 p-2 rounded" />
             <input type="url" value={task.link} onChange={e => setTask(p => ({...p, link: e.target.value}))} placeholder="Meeting Link" className="w-full bg-gray-700 p-2 rounded" />
        </>
    );
    
    const taskFields = (
        <>
            <div className="flex items-center gap-2">
                <label>Repeat:</label>
                <select value={task.repeat} onChange={e => setTask(p => ({...p, repeat: e.target.value as any}))} className="bg-gray-700 p-2 rounded">
                    <option value="none">None</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                </select>
            </div>
             <div className="flex items-center gap-2">
                <label>Reminder:</label>
                <input type="time" value={task.reminder} onChange={e => setTask(p => ({...p, reminder: e.target.value}))} className="bg-gray-700 p-2 rounded" />
            </div>
        </>
    );

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <Card className="w-full max-w-lg">
                <h3 className="text-lg font-bold mb-4">Add to {date.toLocaleDateString()}</h3>
                <div className="flex gap-2 mb-4">
                    <Button onClick={() => setTask({ type: 'task', text: '', completed: false, repeat: 'none' })} variant={task.type === 'task' ? 'primary' : 'secondary'}>Task</Button>
                    <Button onClick={() => setTask({ type: 'event', text: '', completed: false })} variant={task.type === 'event' ? 'primary' : 'secondary'}>Event</Button>
                </div>
                <div className="space-y-3">
                    {commonFields}
                    {task.type === 'event' ? eventFields : taskFields}
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <Button onClick={onClose} variant="secondary">Cancel</Button>
                    <Button onClick={handleSave} disabled={!task.text?.trim()}>Save</Button>
                </div>
            </Card>
        </div>
    )
}

export default CalendarView;
