import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HackingSequenceProps {
  onComplete: () => void;
  dangerMode: boolean;
}

const STAGES = [
  {
    title: 'SYSTEM IGNITION',
    logs: [
      '> Booting Quantum Shell…',
      '> Linking Synapse Nodes…',
      '> Loading Visual Neural Interface…',
    ],
    duration: 2000,
  },
  {
    title: 'DATA TUNNEL ACTIVE',
    logs: [
      '> Engaging Data-Tunnel Renderer…',
      '> Velocity: 9,421 LINES/SEC',
      '> Hyperloop: ACTIVE',
    ],
    duration: 3000,
    showTunnel: true,
  },
  {
    title: 'FIREWALL DETECTED',
    logs: [
      '>>> FIREWALL TIER-4 DETECTED',
      '>>> STRUCTURE: HEX-QUANTUM BARRIER',
    ],
    duration: 2500,
    showFirewall: true,
  },
  {
    title: 'CODE BREAKER DEPLOYED',
    logs: [
      '> Deploying CODE-BREAKER PACK A…',
      '> Sending PULSE_SHOCK…',
      '> Sending QUANTUM_DRILL…',
      '> Sending SHADOW_INVERT…',
    ],
    duration: 2000,
  },
  {
    title: 'FIREWALL DESTROYED',
    logs: [
      '>>> FIREWALL INTEGRITY: 11%',
      '>>> FIREWALL INTEGRITY: 03%',
      '>>> FIREWALL DESTROYED',
    ],
    duration: 2000,
  },
  {
    title: 'KENYA MAP SCAN',
    logs: [
      '> Mapping National School Registry…',
      '> Loading Mock KNEC Dataset Layers…',
    ],
    duration: 3000,
    showMap: true,
  },
];

const FIREWALL_ASCII = `
   ⦿⦿⦿⦿⦿⦿⦿
 ⦿           ⦿
⦿   ████████   ⦿
⦿   █ FIRE █   ⦿
⦿   █ WALL █   ⦿
⦿   ████████   ⦿
 ⦿           ⦿
   ⦿⦿⦿⦿⦿⦿⦿
`;

const KENYA_MAP_ASCII = `
        ____
     .-"    "-.
   .'  K E N Y A  '.
  /  SCAN IN PROG   \\
 |  • NAIROBI NODE    |
 |  • ELDORET NODE    |
  \\                  /
   '.              .'
     "-._____.-"
`;

const HackingSequence = ({ onComplete, dangerMode }: HackingSequenceProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [showTunnel, setShowTunnel] = useState(false);
  const [firewallHealth, setFirewallHealth] = useState(100);

  useEffect(() => {
    if (currentStage >= STAGES.length) {
      setTimeout(onComplete, 1000);
      return;
    }

    const stage = STAGES[currentStage];
    setVisibleLogs([]);
    setShowTunnel(stage.showTunnel || false);

    // Show logs one by one
    stage.logs.forEach((log, index) => {
      setTimeout(() => {
        setVisibleLogs(prev => [...prev, log]);
      }, index * 400);
    });

    // Special effects for firewall stage
    if (stage.showFirewall) {
      const interval = setInterval(() => {
        setFirewallHealth(prev => Math.max(0, prev - 10));
      }, 200);
      setTimeout(() => clearInterval(interval), 2000);
    }

    // Move to next stage
    const timer = setTimeout(() => {
      setCurrentStage(prev => prev + 1);
    }, stage.duration);

    return () => clearTimeout(timer);
  }, [currentStage, onComplete]);

  const stage = STAGES[currentStage] || STAGES[STAGES.length - 1];

  return (
    <motion.div
      className="fixed inset-0 z-30 flex items-center justify-center bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full max-w-4xl mx-auto p-8">
        {/* Stage indicator */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {STAGES.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i < currentStage ? 'bg-primary' : i === currentStage ? 'bg-secondary animate-pulse' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Stage title */}
        <motion.h2
          key={stage.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-3xl font-bold text-center mb-8 ${dangerMode ? 'text-destructive text-glow-red' : 'text-primary text-glow'}`}
        >
          {stage.title}
        </motion.h2>

        {/* Tunnel animation */}
        <AnimatePresence>
          {showTunnel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-8 h-48 relative overflow-hidden rounded-lg border border-primary"
              style={{ perspective: '500px' }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute border border-secondary rounded-lg"
                    style={{
                      width: `${100 - i * 4}%`,
                      height: `${100 - i * 4}%`,
                    }}
                    animate={{
                      scale: [0.1, 2],
                      opacity: [1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: 'linear',
                    }}
                  />
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Firewall ASCII */}
        <AnimatePresence>
          {stage.showFirewall && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-8 text-center"
            >
              <pre className={`text-sm font-mono inline-block ${firewallHealth < 30 ? 'text-destructive text-glow-red' : 'text-secondary text-glow-cyan'}`}>
                {FIREWALL_ASCII}
              </pre>
              <div className="mt-4">
                <div className="text-xs text-muted-foreground mb-1">FIREWALL INTEGRITY</div>
                <div className="h-2 bg-muted rounded overflow-hidden max-w-xs mx-auto">
                  <motion.div
                    className={`h-full ${firewallHealth < 30 ? 'bg-destructive' : 'bg-secondary'}`}
                    animate={{ width: `${firewallHealth}%` }}
                  />
                </div>
                <div className="text-xs text-secondary mt-1">{firewallHealth}%</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Kenya Map */}
        <AnimatePresence>
          {stage.showMap && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-8 text-center"
            >
              <pre className="text-sm font-mono inline-block text-primary text-glow">
                {KENYA_MAP_ASCII}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Terminal logs */}
        <div className="bg-card/50 border border-border rounded-lg p-4 font-mono text-sm max-h-60 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {visibleLogs.map((log, i) => (
              <motion.div
                key={`${currentStage}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={
                  log.includes('>>>') ? 'text-secondary text-glow-cyan' :
                  log.includes('DESTROYED') ? 'text-primary text-glow' :
                  'text-muted-foreground'
                }
              >
                {log}
              </motion.div>
            ))}
          </AnimatePresence>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-primary"
          >
            _
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

export default HackingSequence;
