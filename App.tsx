import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LifeDataProvider, useLifeData } from './hooks/useLifeData';
import { TimeDataProvider } from './hooks/useTimeData';
import LandingView from './components/views/LandingView';
import OnboardingView from './components/views/OnboardingView';
import DashboardView from './components/views/DashboardView';
import AuthForm from './components/auth/AuthForm';
import type { LifeData } from './types';

type View = 'landing' | 'onboarding' | 'dashboard';

const AppContent: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const { lifeData, isInitialized, resetData } = useLifeData();
    const [view, setView] = useState<View>('landing');

    useEffect(() => {
        if (isInitialized) {
            if (lifeData.currentAge > 0) {
                setView('dashboard');
            } else {
                setView('landing');
            }
        }
    }, [isInitialized, lifeData.currentAge]);

    const handleStart = () => {
        setView('onboarding');
    };

    const handleOnboardingComplete = (data: LifeData) => {
        setView('dashboard');
    };

    const handleReset = () => {
        resetData();
        setView('onboarding');
    };

    if (authLoading) {
        return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading...</div>;
    }

    if (!user) {
        return <AuthForm />;
    }

    const currentView = useMemo(() => {
        if (!isInitialized) {
            return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading...</div>;
        }

        switch (view) {
            case 'landing':
                return <LandingView onStart={handleStart} />;
            case 'onboarding':
                return <OnboardingView onComplete={handleOnboardingComplete} />;
            case 'dashboard':
                return <DashboardView onReset={handleReset} />;
            default:
                return <LandingView onStart={handleStart} />;
        }
    }, [view, isInitialized, resetData]);

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            {currentView}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <LifeDataProvider>
                <TimeDataProvider>
                    <AppContent />
                </TimeDataProvider>
            </LifeDataProvider>
        </AuthProvider>
    );
};

export default App;