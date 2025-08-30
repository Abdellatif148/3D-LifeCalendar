
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { LifeData, ActivityData, CategoryName } from '../types';
import { MINUTES_IN_DAY } from '../constants';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';

const getInitialLifeData = (): LifeData => ({
    currentAge: 0,
    targetAge: 80,
    activities: [
        { name: 'Sleep', minutesPerDay: 8 * 60 },
        { name: 'Work/Study', minutesPerDay: 8 * 60 },
        { name: 'Social', minutesPerDay: 2 * 60 },
        { name: 'Hobbies', minutesPerDay: 2 * 60 },
        { name: 'Exercise', minutesPerDay: 1 * 60 },
        { name: 'Unallocated', minutesPerDay: 0 },
    ],
});

interface LifeDataContextType {
    lifeData: LifeData;
    isInitialized: boolean;
    setLifeData: React.Dispatch<React.SetStateAction<LifeData>>;
    updateActivity: (name: CategoryName, minutes: number) => void;
    baseActivities: ActivityData[];
}

const LifeDataContext = createContext<LifeDataContextType | undefined>(undefined);

export const LifeDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [lifeData, setLifeData] = useState<LifeData>(getInitialLifeData());
    const [baseActivities, setBaseActivities] = useState<ActivityData[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const fetchLifeData = async () => {
            if (!user) {
                setIsInitialized(true);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('life_data')
                    .eq('id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') { // Ignore 'Range not found' error
                    throw error;
                }

                if (data && data.life_data) {
                    setLifeData(data.life_data);
                    setBaseActivities(data.life_data.activities);
                } else {
                    setBaseActivities(getInitialLifeData().activities);
                }
            } catch (error) {
                console.error("Failed to fetch lifeData from Supabase", error);
                setBaseActivities(getInitialLifeData().activities);
            } finally {
                setIsInitialized(true);
            }
        };

        fetchLifeData();
    }, [user]);

    useEffect(() => {
        const saveLifeData = async () => {
            if (!user || !isInitialized) return;

            try {
                await supabase
                    .from('profiles')
                    .upsert({ id: user.id, life_data: lifeData });
            } catch (error) {
                console.error("Failed to save lifeData to Supabase", error);
            }
        };

        saveLifeData();
    }, [lifeData, user, isInitialized]);

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

    return <LifeDataContext.Provider value={value}>{children}</LifeDataContext.Provider>;
};

export const useLifeData = () => {
    const context = useContext(LifeDataContext);
    if (context === undefined) {
        throw new Error('useLifeData must be used within a LifeDataProvider');
    }
    return context;
};
