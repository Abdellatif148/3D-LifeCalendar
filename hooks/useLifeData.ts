import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
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
        const loadLifeData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    const { data, error } = await supabase
                        .from('life_data')
                        .select('*')
                        .eq('user_id', user.id)
                        .maybeSingle();

                    if (error) {
                        console.error('Error loading life data:', error);
                    } else if (data) {
                        setLifeData({
                            currentAge: data.current_age,
                            targetAge: data.target_age,
                            activities: data.activities as ActivityData[],
                        });
                    }
                } else {
                    const storedData = localStorage.getItem('lifeData');
                    if (storedData) {
                        const parsedData = JSON.parse(storedData);
                        setLifeData(parsedData);
                    }
                }
            } catch (error) {
                console.error('Failed to load life data:', error);
            } finally {
                setIsInitialized(true);
            }
        };

        loadLifeData();
    }, []);

    useEffect(() => {
        const saveLifeData = async () => {
            if (!isInitialized) return;

            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    const { error } = await supabase
                        .from('life_data')
                        .upsert({
                            user_id: user.id,
                            current_age: lifeData.currentAge,
                            target_age: lifeData.targetAge,
                            activities: lifeData.activities,
                        }, {
                            onConflict: 'user_id'
                        });

                    if (error) {
                        console.error('Error saving life data:', error);
                    }
                } else {
                    localStorage.setItem('lifeData', JSON.stringify(lifeData));
                }
            } catch (error) {
                console.error('Failed to save life data:', error);
            }
        };

        saveLifeData();
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

    const resetData = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { error } = await supabase
                    .from('life_data')
                    .delete()
                    .eq('user_id', user.id);

                if (error) {
                    console.error('Error deleting life data:', error);
                }
            } else {
                localStorage.removeItem('lifeData');
            }
        } catch (error) {
            console.error('Failed to reset life data:', error);
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