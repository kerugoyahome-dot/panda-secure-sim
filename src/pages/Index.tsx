import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import MatrixRain from '@/components/MatrixRain';
import Scanlines from '@/components/Scanlines';
import TerminalHeader from '@/components/TerminalHeader';
import HomePage from '@/components/HomePage';
import AccessPanel from '@/components/AccessPanel';
import HackingSequence from '@/components/HackingSequence';
import MainDashboard from '@/components/MainDashboard';
import DangerAlert from '@/components/DangerAlert';

type AppState = 'home' | 'login' | 'hacking' | 'dashboard';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('home');
  const [dangerMode, setDangerMode] = useState(false);

  const handleSystemStart = () => {
    setAppState('login');
  };

  const handleAccessGranted = () => {
    setAppState('hacking');
  };

  const handleHackingComplete = () => {
    setAppState('dashboard');
  };

  const handleAutoLogout = () => {
    setAppState('home');
    setDangerMode(false);
  };

  const toggleDangerMode = () => {
    setDangerMode(!dangerMode);
  };

  return (
    <div className={`min-h-screen bg-background relative overflow-hidden ${dangerMode ? 'danger-mode' : ''}`}>
      {/* Background effects */}
      <MatrixRain />
      <Scanlines />
      
      {/* Header */}
      <TerminalHeader dangerMode={dangerMode} onToggleDanger={toggleDangerMode} />
      
      {/* Danger mode alert */}
      <DangerAlert show={dangerMode} />

      {/* Main content */}
      <main className="relative z-10 pt-24 pb-8 px-4 container mx-auto max-w-6xl">
        <AnimatePresence mode="wait">
          {appState === 'home' && (
            <HomePage 
              key="home"
              onStart={handleSystemStart}
              dangerMode={dangerMode}
            />
          )}

          {appState === 'login' && (
            <AccessPanel 
              key="login"
              onAccessGranted={handleAccessGranted} 
              dangerMode={dangerMode}
            />
          )}
          
          {appState === 'hacking' && (
            <HackingSequence 
              key="hacking"
              onComplete={handleHackingComplete}
              dangerMode={dangerMode}
            />
          )}
          
          {appState === 'dashboard' && (
            <MainDashboard 
              key="dashboard"
              dangerMode={dangerMode}
              onAutoLogout={handleAutoLogout}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
