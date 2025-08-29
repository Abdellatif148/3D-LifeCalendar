
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { LifeData, ActivityData, CategoryName, Delta } from '../types';
import { CATEGORIES, MINUTES_IN_DAY } from '../constants';

const defaultActivities: ActivityData[] = [
    { name: 'Sleep', minutesPerDay: 8 * 60 },
    { name: 'Work/Study', minutesPerDay: 8 * 60 },
    { name: 'Social', minutesPerDay: 2 * 60 },
    { name: 'Hobbies', minutesPerDay: 2 * 60 },
    { name: 'Exercise', minutesPerDay: 1 * 60 },
];

const getInitialLifeData = (): LifeData => {
    const totalAllocated = defaultActivities.reduce((sum, act) => sum + act.minutesPerDay, 0);
    const unallocated = MINUTES_IN_DAY - totalAllocated;
    
    return {
        currentAge: 0,
        targetAge: 80,
        activities: [
            ...defaultActivities,
            { name: 'Unallocated', minutesPerDay: Math.max(0, unallocated) }
        ],
    };
};


interface LifeDataContextType {
    lifeData: LifeData;
    isInitialized: boolean;
    setLifeData: React.Dispatch<React.SetStateAction<LifeData>>;
    updateActivity: (name: CategoryName, minutes: number) => void;
    baseActivities: ActivityData[];
}

const LifeDataContext = createContext<LifeDataContextType | undefined>(undefined);

export const LifeDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lifeData, setLifeData] = useState<LifeData>(getInitialLifeData());
    const [baseActivities, setBaseActivities] = useState<ActivityData[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        try {
            const storedData = localStorage.getItem('lifeData');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                setLifeData(parsedData);
                setBaseActivities(parsedData.activities);
            } else {
                 setBaseActivities(lifeData.activities);
            }
        } catch (error) {
            console.error("Failed to parse lifeData from localStorage", error);
             setBaseActivities(lifeData.activities);
        } finally {
            setIsInitialized(true);
        }
    }, []);

    useEffect(() => {
        if(isInitialized) {
            try {
                localStorage.setItem('lifeData', JSON.stringify(lifeData));
            } catch (error) {
                console.error("Failed to save lifeData to localStorage", error);
            }
        }
    }, [lifeData, isInitialized]);

    const updateActivity = useCallback((name: CategoryName, minutes: number) => {
        setLifeData(prevData => {
            const newActivities = prevData.activities.map(act => 
                act.name === name ? { ...act, minutesPerDay: minutes } : act
            );

            const totalAllocated = newActivities
                .filter(act => act.name !== 'Unallocated')
                .reduce((sum, act) => sum + act.minutesPerDay, 0);

            const unallocatedMinutes = Math.max(0, MINUTES_IN_DAY - totalAllocated);

            const finalActivities = newActivities.map(act => 
                act.name === 'Unallocated' ? { ...act, minutesPerDay: unallocatedMinutes } : act
            );

            return { ...prevData, activities: finalActivities };
        });
    }, []);

    const value = { lifeData, isInitialized, setLifeData, updateActivity, baseActivities };

    // FIX: Replaced JSX with React.createElement to support usage in a .ts file.
    // The errors indicated that JSX syntax was not being parsed correctly, likely
    // due to the .ts file extension.
    return React.createElement(LifeDataContext.Provider, { value }, children);
};

export const useLifeData = () => {
    const context = useContext(LifeDataContext);
    if (context === undefined) {
        throw new Error('useLifeData must be used within a LifeDataProvider');
    }
    return context;
};
