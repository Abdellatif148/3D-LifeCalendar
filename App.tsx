import React, { useState, useEffect } from 'react';
import { LifeDataProvider, useLifeData } from './hooks/useLifeData.tsx';
import { AuthProvider, useAuth } from './hooks/useAuth';
import OnboardingView from './components/views/OnboardingView';
import DashboardView from './components/views/DashboardView';
import AuthView from './components/views/AuthView';
import SettingsView from './components/views/SettingsView';
import { Toaster } from 'react-hot-toast';
import NewLandingView from './components/views/NewLandingView';
import ProductView from './components/views/ProductView';
import FeaturesView from './components/views/FeaturesView';
import PricingView from './components/views/PricingView';
import APIView from './components/views/APIView';
import CompanyView from './components/views/CompanyView';
import CareersView from './components/views/CareersView';
import ContactView from './components/views/ContactView';
import BlogView from './components/views/BlogView';
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
    const [currentView, setCurrentView] = useState<'landing' | 'app' | 'product' | 'features' | 'pricing' | 'api' | 'company' | 'careers' | 'contact' | 'blog'>('landing');

    const handleStart = () => {
        setCurrentView('app');
    };

    const handleNavigate = (view: typeof currentView) => {
        setCurrentView(view);
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
            {currentView === 'landing' && <NewLandingView onStart={handleStart} onNavigate={handleNavigate} />}
            {currentView === 'product' && <ProductView onNavigate={handleNavigate} />}
            {currentView === 'features' && <FeaturesView onNavigate={handleNavigate} />}
            {currentView === 'pricing' && <PricingView onNavigate={handleNavigate} />}
            {currentView === 'api' && <APIView onNavigate={handleNavigate} />}
            {currentView === 'company' && <CompanyView onNavigate={handleNavigate} />}
            {currentView === 'careers' && <CareersView onNavigate={handleNavigate} />}
            {currentView === 'contact' && <ContactView onNavigate={handleNavigate} />}
            {currentView === 'blog' && <BlogView onNavigate={handleNavigate} />}
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
