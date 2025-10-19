import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { LifeData, ActivityData, CategoryName } from '../types';
import { MINUTES_IN_DAY } from '../constants';

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
    updateActivity: (name: CategoryName, minutes: number) => void;
    saveOnboardingData: (data: LifeData) => void;
    resetData: () => void;
}

const LifeDataContext = createContext<LifeDataContextType | undefined>(undefined);

export const LifeDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lifeData, setLifeData] = useState<LifeData>(getInitialLifeData());
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        try {
            const storedData = localStorage.getItem('lifeData');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                setLifeData(parsedData);
            }
        } catch (error) {
            console.error("Failed to parse lifeData from localStorage", error);
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

    const saveOnboardingData = useCallback((data: LifeData) => {
        setLifeData(data);
    }, []);

    const resetData = useCallback(() => {
        try {
            localStorage.removeItem('lifeData');
        } catch (error) {
            console.error("Failed to remove lifeData from localStorage", error);
        }
        setLifeData(getInitialLifeData());
    }, []);

    const value = { lifeData, isInitialized, updateActivity, saveOnboardingData, resetData };

    // The use of React.createElement is preserved as per the existing file structure
    // which seems to be a workaround for using React logic in a .ts file.
    return React.createElement(LifeDataContext.Provider, { value }, children);
};

export const useLifeData = () => {
    const context = useContext(LifeDataContext);
    if (context === undefined) {
        throw new Error('useLifeData must be used within a LifeDataProvider');
    }
    return context;
};