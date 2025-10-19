import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { TimeDataState, YearData, DayData, DailyTask } from '../types';

interface TimeDataContextType {
    timeData: TimeDataState;
    getYearData: (year: number) => YearData;
    getDayData: (date: Date) => DayData;
    updateDayData: (date: Date, newDayData: DayData) => void;
    updateYearTitle: (year: number, title: string) => void;
    addTaskToDay: (date: Date, task: DailyTask) => void;
}

const TimeDataContext = createContext<TimeDataContextType | undefined>(undefined);

export const TimeDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [timeData, setTimeData] = useState<TimeDataState>({});
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        try {
            const storedData = localStorage.getItem('timeData');
            if (storedData) {
                setTimeData(JSON.parse(storedData));
            }
        } catch (error) {
            console.error("Failed to load timeData from localStorage", error);
        } finally {
            setIsInitialized(true);
        }
    }, []);

    useEffect(() => {
        if (isInitialized) {
            try {
                localStorage.setItem('timeData', JSON.stringify(timeData));
            } catch (error) {
                console.error("Failed to save timeData to localStorage", error);
            }
        }
    }, [timeData, isInitialized]);
    
    const getYearData = useCallback((year: number): YearData => {
        return timeData[year] || { title: `Year ${year + 1}`, months: {} };
    }, [timeData]);

    const getDayData = useCallback((date: Date): DayData => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const dayOfMonth = date.getDate();
        const dayOfWeek = date.getDay();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const weekIndex = Math.floor((dayOfMonth + firstDayOfMonth - 1) / 7);
        
        return timeData[year]?.months?.[month]?.weeks?.[weekIndex]?.days?.[dayOfWeek] || { title: '', goals: [] };
    }, [timeData]);

    const updateYearTitle = useCallback((year: number, title: string) => {
        setTimeData(prev => {
            const yearData = prev[year] || { title: `Year ${year+1}`, months: {} };
            return { ...prev, [year]: { ...yearData, title } };
        });
    }, []);

    const updateDayData = useCallback((date: Date, newDayData: DayData) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const dayOfMonth = date.getDate();
        const dayOfWeek = date.getDay();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const weekIndex = Math.floor((dayOfMonth + firstDayOfMonth - 1) / 7);

        setTimeData(prev => ({
            ...prev,
            [year]: {
                ...(prev[year] || { title: `Year ${year + 1}`, months: {} }),
                months: {
                    ...(prev[year]?.months || {}),
                    [month]: {
                        ...(prev[year]?.months?.[month] || { weeks: {} }),
                        weeks: {
                            ...(prev[year]?.months?.[month]?.weeks || {}),
                            [weekIndex]: {
                                ...(prev[year]?.months?.[month]?.weeks?.[weekIndex] || { days: {} }),
                                days: {
                                    ...(prev[year]?.months?.[month]?.weeks?.[weekIndex]?.days || {}),
                                    [dayOfWeek]: newDayData,
                                }
                            }
                        }
                    }
                }
            }
        }));
    }, []);
    
    const addTaskToDay = useCallback((date: Date, task: DailyTask) => {
        const currentDayData = getDayData(date);
        const newDayData = {
            ...currentDayData,
            goals: [...currentDayData.goals, task]
        };
        updateDayData(date, newDayData);
    }, [getDayData, updateDayData]);


    const value = { timeData, getYearData, getDayData, updateDayData, updateYearTitle, addTaskToDay };

    return React.createElement(TimeDataContext.Provider, { value }, children);
};

export const useTimeData = () => {
    const context = useContext(TimeDataContext);
    if (context === undefined) {
        throw new Error('useTimeData must be used within a TimeDataProvider');
    }
    return context;
};