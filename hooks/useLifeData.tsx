import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { LifeData, ActivityData, CategoryName } from '../types';
import { MINUTES_IN_DAY } from '../constants';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

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
    loading: boolean;
    setLifeData: React.Dispatch<React.SetStateAction<LifeData>>;
    updateActivity: (name: CategoryName, minutes: number) => void;
    baseActivities: ActivityData[];
    saveLifeData: () => Promise<void>;
}

const LifeDataContext = createContext<LifeDataContextType | undefined>(undefined);

export const LifeDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [lifeData, setLifeData] = useState<LifeData>(getInitialLifeData());
    const [baseActivities, setBaseActivities] = useState<ActivityData[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLifeData = async () => {
            if (!user) {
                setLifeData(getInitialLifeData());
                setBaseActivities(getInitialLifeData().activities);
                setIsInitialized(true);
                return;
            }

            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('life_data')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    if (error.code === 'PGRST116') {
                        // No profile found, create one
                        const { error: insertError } = await supabase
                            .from('profiles')
                            .insert({ id: user.id, life_data: null });
                        
                        if (insertError) {
                            console.error('Error creating profile:', insertError);
                        }
                        setBaseActivities(getInitialLifeData().activities);
                    } else {
                        throw error;
                    }
                } else if (data && data.life_data) {
                    setLifeData(data.life_data);
                    setBaseActivities(data.life_data.activities);
                } else {
                    setBaseActivities(getInitialLifeData().activities);
                }

            } catch (error) {
                console.error('Failed to fetch life data:', error);
                toast.error('Failed to load your data');
                setBaseActivities(getInitialLifeData().activities);
            } finally {
                setLoading(false);
                setIsInitialized(true);
            }
        };

        fetchLifeData();
    }, [user]);

    const saveLifeData = useCallback(async () => {
        if (!user || !isInitialized) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({ 
                    id: user.id, 
                    life_data: lifeData,
                    updated_at: new Date().toISOString()
                });
            
            if (error) throw error;
        } catch (error) {
            console.error('Failed to save life data:', error);
            toast.error('Failed to save your changes');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [lifeData, user, isInitialized]);

    // Auto-save with debouncing
    useEffect(() => {
        if (!user || !isInitialized || lifeData.currentAge === 0) return;

        const timeoutId = setTimeout(() => {
            saveLifeData().catch(console.error);
        }, 1000); // Debounce saves by 1 second

        return () => clearTimeout(timeoutId);
    }, [lifeData, user, isInitialized, saveLifeData]);

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

    const value = { 
        lifeData, 
        isInitialized, 
        loading,
        setLifeData, 
        updateActivity, 
        baseActivities,
        saveLifeData
    };

    return <LifeDataContext.Provider value={value}>{children}</LifeDataContext.Provider>;
};

export const useLifeData = () => {
    const context = useContext(LifeDataContext);
    if (context === undefined) {
        throw new Error('useLifeData must be used within a LifeDataProvider');
    }
    return context;
};