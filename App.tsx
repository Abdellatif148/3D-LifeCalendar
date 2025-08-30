import React, { useState, useEffect } from 'react';
import { LifeDataProvider, useLifeData } from './hooks/useLifeData.tsx';
import { AuthProvider, useAuth } from './hooks/useAuth';
import OnboardingView from './components/views/OnboardingView';
import DashboardView from './components/views/DashboardView';
import AuthView from './components/views/AuthView';
import SettingsView from './components/views/SettingsView';
import { Toaster } from 'react-hot-toast';
import NewLandingView from './components/views/NewLandingView';
import type { LifeData } from './types';

const AppContent: React.FC = () => {
    const { user, loading } = useAuth();
    const { lifeData, isInitialized } = useLifeData();
    const [view, setView] = useState<'onboarding' | 'dashboard' | 'settings'>('dashboard');

    useEffect(() => {
        if (!loading && user && isInitialized) {
            if (lifeData.currentAge > 0) {
                setView('dashboard');
            } else {
                setView('onboarding');
            }
        }
    }, [user, loading, isInitialized, lifeData.currentAge]);

    const handleOnboardingComplete = (data: LifeData) => {
        setView('dashboard');
    };

    const handleNavigateToSettings = () => {
        setView('settings');
    };

    const handleBackToDashboard = () => {
        setView('dashboard');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-black text-white">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg">Loading your life data...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <AuthView />;
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            {(() => {
                switch (view) {
                    case 'onboarding':
                        return <OnboardingView onComplete={handleOnboardingComplete} />;
                    case 'dashboard':
                        return <DashboardView onNavigateToSettings={handleNavigateToSettings} />;
                    case 'settings':
                        return <SettingsView onBackToDashboard={handleBackToDashboard} />;
                    default:
                        return <OnboardingView onComplete={handleOnboardingComplete} />;
                }
            })()}
        </div>
    );
};

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');

    const handleStart = () => {
        setCurrentView('app');
    };

    return (
        <>
            <Toaster 
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#1F2937',
                        color: '#F9FAFB',
                        border: '1px solid #374151',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#F9FAFB',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#F9FAFB',
                        },
                    },
                }}
            />
            {currentView === 'landing' && <NewLandingView onStart={handleStart} />}
            {currentView === 'app' && (
                <AuthProvider>
                    <LifeDataProvider>
                        <AppContent />
                    </LifeDataProvider>
                </AuthProvider>
            )}
        </>
    );
};

export default App;
