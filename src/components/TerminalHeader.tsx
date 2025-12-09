import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Download, AlertTriangle } from 'lucide-react';

interface TerminalHeaderProps {
  dangerMode: boolean;
  onToggleDanger: () => void;
}

const TerminalHeader = ({ dangerMode, onToggleDanger }: TerminalHeaderProps) => {
  const [time, setTime] = useState(new Date());
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    }
  };

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary text-glow" />
          <div>
            <h1 className="text-sm font-bold text-primary text-glow tracking-wider">
              PANDA TECH
            </h1>
            <p className="text-xs text-muted-foreground">
              KNEC SECURE ENGINE v9.7
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-muted-foreground hidden sm:block">
            <span className="text-primary">{time.toLocaleDateString()}</span>
            <span className="mx-2">|</span>
            <span className="text-secondary text-glow-cyan">{time.toLocaleTimeString()}</span>
          </div>

          <button
            onClick={onToggleDanger}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs border rounded transition-all ${
              dangerMode 
                ? 'border-destructive bg-destructive/20 text-destructive text-glow-red' 
                : 'border-border hover:border-primary hover:text-primary'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">DANGER MODE</span>
          </button>

          <button
            onClick={handleInstall}
            className="flex items-center gap-2 px-3 py-1.5 text-xs border border-secondary text-secondary hover:bg-secondary/20 rounded transition-all box-glow-cyan"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">INSTALL</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default TerminalHeader;
