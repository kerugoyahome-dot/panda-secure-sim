import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, Terminal, Wifi, Database, Lock, Key } from 'lucide-react';

interface HomePageProps {
  onStart: () => void;
  dangerMode: boolean;
}

const HomePage = ({ onStart, dangerMode }: HomePageProps) => {
  const [startKey, setStartKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState(0);

  const loadingStages = [
    'INITIALIZING SYSTEM CORES...',
    'LOADING NEURAL NETWORKS...',
    'CONNECTING TO DARK WEB NODES...',
    'BYPASSING SECURITY PROTOCOLS...',
    'ACTIVATING STEALTH MODE...',
    'PREPARING ACCESS TERMINAL...',
  ];

  const features = [
    { icon: Shield, label: 'STEALTH PROTOCOLS', desc: 'Advanced cloaking' },
    { icon: Terminal, label: 'QUANTUM SHELL', desc: 'Neural interface' },
    { icon: Wifi, label: 'DARK NET ACCESS', desc: 'Encrypted tunnels' },
    { icon: Database, label: 'DATA EXTRACTION', desc: 'High-speed transfer' },
    { icon: Lock, label: 'FIREWALL BYPASS', desc: 'Multi-layer penetration' },
    { icon: Zap, label: 'TURBO MODE', desc: '9000+ ops/sec' },
  ];

  const handleStart = () => {
    if (startKey.length < 3) return;
    
    setIsLoading(true);
    let progress = 0;
    let stage = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 8 + 2;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          onStart();
        }, 500);
      }

      const newStage = Math.floor((progress / 100) * loadingStages.length);
      if (newStage !== stage && newStage < loadingStages.length) {
        stage = newStage;
        setLoadingStage(stage);
      }

      setLoadingProgress(progress);
    }, 150);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center min-h-[70vh]"
    >
      <AnimatePresence mode="wait">
        {!isLoading ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center w-full max-w-4xl"
          >
            {/* Main Title */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className={`text-5xl md:text-7xl font-bold mb-2 tracking-tight ${
                dangerMode ? 'text-destructive text-glow-red' : 'text-primary text-glow'
              }`}>
                COOL HACKS
              </h1>
              <h2 className={`text-2xl md:text-3xl font-bold ${
                dangerMode ? 'text-destructive/70' : 'text-secondary text-glow-cyan'
              }`}>
                SECURE SOFTWARE v9.7
              </h2>
              <p className="text-muted-foreground text-sm mt-4 tracking-widest">
                CIA-GRADE INTELLIGENCE INTERFACE
              </p>
            </motion.div>

            {/* Feature Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-4 border rounded-lg ${
                    dangerMode 
                      ? 'border-destructive/30 bg-destructive/5 hover:bg-destructive/10' 
                      : 'border-primary/30 bg-primary/5 hover:bg-primary/10'
                  } transition-all cursor-default`}
                >
                  <feature.icon className={`w-8 h-8 mx-auto mb-2 ${
                    dangerMode ? 'text-destructive' : 'text-primary'
                  }`} />
                  <div className="text-xs font-bold text-foreground">{feature.label}</div>
                  <div className="text-xs text-muted-foreground">{feature.desc}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Start Key Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`p-6 border-2 rounded-lg max-w-md mx-auto ${
                dangerMode 
                  ? 'border-destructive/50 bg-destructive/10' 
                  : 'border-primary/50 bg-primary/10'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <Key className={`w-5 h-5 ${dangerMode ? 'text-destructive' : 'text-primary'}`} />
                <span className="text-sm font-bold text-foreground">ENTER ACTIVATION KEY</span>
              </div>
              
              <input
                type="text"
                value={startKey}
                onChange={(e) => setStartKey(e.target.value.toUpperCase())}
                placeholder="TYPE ANY KEY TO BEGIN..."
                className={`w-full p-4 bg-background/50 border rounded font-mono text-center text-lg tracking-widest
                  ${dangerMode 
                    ? 'border-destructive/50 focus:border-destructive text-destructive' 
                    : 'border-primary/50 focus:border-primary text-primary'
                  } placeholder:text-muted-foreground/50 focus:outline-none transition-all`}
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              />

              <button
                onClick={handleStart}
                disabled={startKey.length < 3}
                className={`w-full mt-4 py-4 font-bold text-lg rounded transition-all
                  ${startKey.length >= 3
                    ? dangerMode 
                      ? 'bg-destructive text-destructive-foreground hover:bg-destructive/80 box-glow-red' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/80 box-glow'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
              >
                {startKey.length >= 3 ? '⚡ INITIATE SYSTEM ⚡' : 'ENTER KEY TO CONTINUE'}
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center w-full max-w-lg"
          >
            {/* Loading Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-8"
            >
              <div className={`w-32 h-32 mx-auto rounded-full border-4 ${
                dangerMode ? 'border-destructive/30' : 'border-primary/30'
              } relative`}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className={`absolute inset-2 rounded-full border-4 border-transparent ${
                    dangerMode ? 'border-t-destructive' : 'border-t-primary'
                  }`}
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className={`absolute inset-4 rounded-full border-4 border-transparent ${
                    dangerMode ? 'border-b-destructive/70' : 'border-b-secondary'
                  }`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${dangerMode ? 'text-destructive' : 'text-primary'}`}>
                    {Math.floor(loadingProgress)}%
                  </span>
                </div>
              </div>
            </motion.div>

            <h3 className={`text-xl font-bold mb-4 ${dangerMode ? 'text-destructive text-glow-red' : 'text-primary text-glow'}`}>
              SYSTEM BOOT SEQUENCE
            </h3>

            {/* Progress Bar */}
            <div className={`h-3 rounded-full overflow-hidden ${dangerMode ? 'bg-destructive/20' : 'bg-primary/20'}`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                className={`h-full ${dangerMode ? 'bg-destructive' : 'bg-primary'}`}
              />
            </div>

            {/* Loading Stage */}
            <p className={`mt-4 text-sm font-mono ${dangerMode ? 'text-destructive/80' : 'text-secondary'}`}>
              {loadingStages[loadingStage]}
            </p>

            {/* Fake Log Output */}
            <div className="mt-6 text-left font-mono text-xs text-muted-foreground space-y-1 max-h-32 overflow-hidden">
              {Array.from({ length: Math.floor(loadingProgress / 10) }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <span className={dangerMode ? 'text-destructive/60' : 'text-primary/60'}>&gt;</span> MODULE_{String(i + 1).padStart(3, '0')}: LOADED
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HomePage;
