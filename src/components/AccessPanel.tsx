import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Terminal } from 'lucide-react';

interface AccessPanelProps {
  onAccessGranted: () => void;
  dangerMode: boolean;
}

const CORRECT_CODE = 'PANDA-OVERRIDE-9X7-ACCESS';

const FAKE_CODES = [
  'OVERRIDE-77X-PROTOCOL',
  'NODEKEY-ALPHA-4921',
  'SIGMA-LAYER-90B-ENTRY',
  'GATE-ACCESS-0041A',
  'QUANTUM-KEY-MK900',
  'HYPERCODE-RED-552',
];

const AccessPanel = ({ onAccessGranted, dangerMode }: AccessPanelProps) => {
  const [code, setCode] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'processing' | 'denied' | 'granted'>('idle');
  const [shake, setShake] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, message]);
  };

  const simulateProgress = async (targetProgress: number, duration: number) => {
    const steps = 20;
    const increment = targetProgress / steps;
    const delay = duration / steps;
    
    for (let i = 0; i < steps; i++) {
      await new Promise(r => setTimeout(r, delay));
      setProgress(prev => Math.min(prev + increment, targetProgress));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing || !code.trim()) return;

    setIsProcessing(true);
    setProgress(0);
    setStatus('processing');
    setLogs([]);

    const attemptNum = attempts + 1;
    setAttempts(attemptNum);

    // Simulate authentication sequence
    addLog(`> INITIALIZING PANDA TECH AUTH ENGINE…`);
    addLog(`> Running AUTH_SEQ_0${attemptNum}…`);
    await new Promise(r => setTimeout(r, 500));

    await simulateProgress(12, 300);
    addLog(`> Verifying input sequence...`);
    
    await simulateProgress(35, 400);
    addLog(`> Cross-referencing cipher blocks...`);
    
    await simulateProgress(68, 500);
    addLog(`> Quantum signature analysis...`);
    
    await simulateProgress(92, 400);
    addLog(`> Finalizing authentication...`);

    await new Promise(r => setTimeout(r, 300));

    if (code.toUpperCase().trim() === CORRECT_CODE) {
      setProgress(100);
      addLog(`> OVERRIDE KEY ACCEPTED`);
      addLog(`> AUTHENTICATION SUCCESSFUL`);
      setStatus('granted');
      
      // Play success sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQkVW6bJ8t6NMg0Ckqvi/NaVQw4LjK7n/9mXRQoFhKjk+9iSPgYCfqLg+NaQOwQBd5zd9tSNOAMAdJfY89KKNgIAcJPU8c+HMwEAbI/Q78yFMAEAaIvN7MmCLgAAZIfJ6sZ/LAAAYoPG58N8KgAAX3/D5cB5KAAAXHu/4b12JgAAWXe83rtzJAAAVnO42bZwIgAAU2+11rNtIAAAUGux0q9qHgAATWet0KxnHAAAS2Op');
      audio.volume = 0.3;
      audio.play().catch(() => {});

      setTimeout(() => {
        onAccessGranted();
      }, 2000);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);

      if (attemptNum === 1) {
        addLog(`!!! ERROR: INVALID ACCESS CODE`);
        addLog(`!!! ACCESS DENIED (01)`);
      } else if (attemptNum === 2) {
        addLog(`!!! CRITICAL MISMATCH`);
        addLog(`!!! ACCESS DENIED (02)`);
      } else {
        addLog(`!!! OVERRIDE FAILURE`);
        addLog(`!!! ACCESS DENIED (0${Math.min(attemptNum, 9)})`);
      }
      
      setStatus('denied');

      // Play error sound
      const audio = new Audio('data:audio/wav;base64,UklGRl9vT19teleQkVW6bJ8t6NMg0CkqviBAAgAZGF0YQoGAACB');
      audio.volume = 0.2;
      audio.play().catch(() => {});

      setTimeout(() => {
        setIsProcessing(false);
        setStatus('idle');
        setProgress(0);
      }, 2000);
    }
  };

  return (
    <motion.div
      className={`w-full max-w-2xl mx-auto ${shake ? 'animate-shake' : ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`border ${dangerMode ? 'border-destructive box-glow-red' : 'border-primary box-glow'} rounded-lg p-6 bg-card/50 backdrop-blur-sm`}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
          <div className={`p-2 rounded ${status === 'granted' ? 'bg-primary/20' : status === 'denied' ? 'bg-destructive/20' : 'bg-muted'}`}>
            {status === 'granted' ? (
              <Unlock className="w-6 h-6 text-primary text-glow" />
            ) : (
              <Lock className={`w-6 h-6 ${status === 'denied' ? 'text-destructive text-glow-red' : 'text-primary'}`} />
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary text-glow">SECURE ACCESS TERMINAL</h2>
            <p className="text-xs text-muted-foreground">AUTHENTICATION REQUIRED</p>
          </div>
        </div>

        {/* Code suggestions */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">AVAILABLE OVERRIDE CODES (TRY THEM):</p>
          <div className="flex flex-wrap gap-2">
            {FAKE_CODES.map((fakeCode) => (
              <button
                key={fakeCode}
                onClick={() => setCode(fakeCode)}
                className="text-xs px-2 py-1 border border-border rounded hover:border-secondary hover:text-secondary transition-all"
                disabled={isProcessing}
              >
                {fakeCode}
              </button>
            ))}
          </div>
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ENTER ACCESS OVERRIDE CODE..."
              disabled={isProcessing || status === 'granted'}
              className={`w-full px-4 py-3 bg-input border ${
                status === 'denied' ? 'border-destructive' : 
                status === 'granted' ? 'border-primary' : 
                'border-secondary'
              } rounded text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary text-center text-sm tracking-widest font-mono ${
                status === 'denied' ? 'box-glow-red' : 'box-glow-cyan'
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing || !code.trim() || status === 'granted'}
            className={`w-full py-3 px-6 font-bold text-sm tracking-wider rounded transition-all ${
              isProcessing || status === 'granted'
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse-glow'
            }`}
          >
            {isProcessing ? 'PROCESSING...' : status === 'granted' ? 'ACCESS GRANTED' : 'INITIATE ACCESS'}
          </button>
        </form>

        {/* Progress bar */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Terminal className="w-4 h-4" />
                <span>AUTH PROGRESS</span>
                <span className="ml-auto text-primary">{Math.round(progress)}%</span>
              </div>
              <div className="h-3 bg-muted rounded overflow-hidden">
                <motion.div
                  className={`h-full ${status === 'denied' ? 'bg-destructive' : status === 'granted' ? 'bg-primary' : 'bg-secondary'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <div className="mt-2 text-xs text-primary font-mono">
                [{'■'.repeat(Math.floor(progress / 7))}{'□'.repeat(14 - Math.floor(progress / 7))}]
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Terminal logs */}
        <AnimatePresence>
          {logs.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-3 bg-background/80 border border-border rounded font-mono text-xs space-y-1 max-h-40 overflow-y-auto"
            >
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={log.includes('!!!') ? 'text-destructive text-glow-red' : log.includes('ACCEPTED') || log.includes('SUCCESSFUL') ? 'text-primary text-glow' : 'text-muted-foreground'}
                >
                  {log}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attempts counter */}
        {attempts > 0 && (
          <div className="mt-4 text-center text-xs text-muted-foreground">
            AUTHENTICATION ATTEMPTS: <span className={attempts >= 3 ? 'text-destructive' : 'text-secondary'}>{attempts}</span>
          </div>
        )}
      </div>

    </motion.div>
  );
};

export default AccessPanel;
