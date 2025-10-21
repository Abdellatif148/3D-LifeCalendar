import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LifeDataProvider, useLifeData } from './hooks/useLifeData';
import { TimeDataProvider } from './hooks/useTimeData';
import LandingView from './components/views/LandingView';
import OnboardingView from './components/views/OnboardingView';
import DashboardView from './components/views/DashboardView';
import SettingsView from './components/views/SettingsView';
import AuthForm from './components/auth/AuthForm';
import ErrorBoundary from './components/ui/ErrorBoundary';
import LoadingSpinner from './components/ui/LoadingSpinner';
import type { LifeData } from './types';

type View = 'landing' | 'onboarding' | 'dashboard' | 'settings';

const LoadingScreen: React.FC = () => (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-lg">Loading your life optimizer...</p>
            <p className="text-sm text-gray-400 mt-2">Preparing your personalized experience</p>
        </div>
    </div>
);

const AppContent: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const { lifeData, isInitialized, resetData } = useLifeData();
    const [view, setView] = useState<View>('landing');
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        if (user && isInitialized) {
            if (lifeData.currentAge > 0) {
                setView('dashboard');
            } else {
                setView('onboarding');
            }
        } else if (!user && !authLoading) {
            setView('landing');
        }
    }, [user, isInitialized, lifeData.currentAge, authLoading]);

    const handleStart = async () => {
        setIsTransitioning(true);
        // Small delay for smooth transition
        await new Promise(resolve => setTimeout(resolve, 300));
        setView('onboarding');
        setIsTransitioning(false);
    };

    const handleOnboardingComplete = async (data: LifeData) => {
        setIsTransitioning(true);
        await new Promise(resolve => setTimeout(resolve, 300));
        setView('dashboard');
        setIsTransitioning(false);
    };

    const handleReset = async () => {
        setIsTransitioning(true);
        resetData();
        await new Promise(resolve => setTimeout(resolve, 300));
        setView('onboarding');
        setIsTransitioning(false);
    };

    const handleSettings = async () => {
        setIsTransitioning(true);
        await new Promise(resolve => setTimeout(resolve, 100));
        setView('settings');
        setIsTransitioning(false);
    };

    const currentView = useMemo(() => {
        if (!isInitialized || isTransitioning) {
            return <LoadingScreen />;
        }

        switch (view) {
            case 'landing':
                return <LandingView onStart={handleStart} />;
            case 'onboarding':
                return <OnboardingView onComplete={handleOnboardingComplete} />;
            case 'dashboard':
                return <DashboardView onReset={handleReset} onSettings={handleSettings} />;
            case 'settings':
                return <SettingsView onBack={() => setView('dashboard')} />;
            default:
                return <LandingView onStart={handleStart} />;
        }
    }, [view, isInitialized, isTransitioning]);

    if (authLoading) {
        return <LoadingScreen />;
    }

    if (!user) {
        return <AuthForm />;
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen transition-all duration-300 ease-in-out">
            {currentView}
        </div>
    );
};

const App: React.FC = () => {
    // Add global error handler
    useEffect(() => {
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            console.error('Unhandled promise rejection:', event.reason);
            // Prevent the default browser behavior
            event.preventDefault();
        };
        
        const handleError = (event: ErrorEvent) => {
            console.error('Global error:', event.error);
        };
        
        window.addEventListener('unhandledrejection', handleUnhandledRejection);
        window.addEventListener('error', handleError);
        
        return () => {
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
            window.removeEventListener('error', handleError);
        };
    }, []);
    
    return (
        <ErrorBoundary>
            <AuthProvider>
                <LifeDataProvider>
                    <TimeDataProvider>
                        <AppContent />
                    </TimeDataProvider>
                </LifeDataProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
};

export default App;