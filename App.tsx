import React, { useState, useEffect, useMemo } from 'react';
import { LifeDataProvider, useLifeData } from './hooks/useLifeData';
import LandingView from './components/views/LandingView';
import OnboardingView from './components/views/OnboardingView';
import DashboardView from './components/views/DashboardView';
import type { LifeData } from './types';

type View = 'landing' | 'onboarding' | 'dashboard';

const AppContent: React.FC = () => {
  const { lifeData, isInitialized } = useLifeData();
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

  const handleOnboardingComplete = (_data: LifeData) => {
    setView('dashboard');
  };

  const handleReset = () => {
    // This would typically be a more robust reset, like clearing localStorage
    // and then calling a method from the hook. For now, we just switch views.
    setView('onboarding');
  };

  const currentView = useMemo(() => {
    if (!isInitialized) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
          Loading...
        </div>
      );
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
  }, [view, isInitialized]);

  return (
    <div className="bg-gray-900 text-white min-h-screen">{currentView}</div>
  );
};

const App: React.FC = () => {
  return (
    <LifeDataProvider>
      <AppContent />
    </LifeDataProvider>
  );
};

export default App;
