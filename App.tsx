import React, { useState, useEffect } from 'react';
import { LifeDataProvider, useLifeData } from './hooks/useLifeData.tsx';
import { AuthProvider, useAuth } from './hooks/useAuth.tsx';
import OnboardingView from './components/views/OnboardingView';
import DashboardView from './components/views/DashboardView';
import AuthView from './components/views/AuthView';
import { Toaster } from 'react-hot-toast';
import NewLandingView from './components/views/NewLandingView';
import DemoDashboardView from './components/views/DemoDashboardView';
import type { LifeData } from './types';
import { supabase } from './lib/supabaseClient';

const AppContent: React.FC = () => {
    const { user, loading } = useAuth();
    const { lifeData, isInitialized } = useLifeData();
    const [view, setView] = useState<'onboarding' | 'dashboard'>('onboarding');

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

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading...</div>;
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
                        return <DashboardView onLogout={handleLogout} />;
                    default:
                        return <OnboardingView onComplete={handleOnboardingComplete} />;
                }
            })()}
        </div>
    );
};

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<'landing' | 'demo' | 'app'>('landing');

    const handleStart = () => {
        setCurrentView('app');
    };

    const handleSeeDemo = () => {
        setCurrentView('demo');
    };

    return (
        <>
            <Toaster />
            {currentView === 'landing' && <NewLandingView onStart={handleStart} onSeeDemo={handleSeeDemo} />}
            {currentView === 'demo' && <DemoDashboardView />}
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
