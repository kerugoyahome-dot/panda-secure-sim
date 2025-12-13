import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Play, Terminal, Cpu, Zap, CheckCircle, XCircle, FileCode } from 'lucide-react';

interface CodingSpaceProps {
  dangerMode: boolean;
}

const EXPLOIT_TEMPLATES = [
  {
    id: 'sql_inject',
    name: 'SQL Injection Probe',
    code: `// SQL Injection Detection
const probe = async (target) => {
  const payloads = [
    "' OR '1'='1",
    "'; DROP TABLE--",
    "UNION SELECT * FROM users"
  ];
  return await scanVulnerabilities(target, payloads);
};`,
    status: 'ready',
  },
  {
    id: 'port_scan',
    name: 'Port Scanner',
    code: `// Advanced Port Scanner
const scanPorts = async (host) => {
  const openPorts = [];
  for (let port = 1; port <= 65535; port++) {
    if (await isOpen(host, port)) {
      openPorts.push(port);
    }
  }
  return openPorts;
};`,
    status: 'ready',
  },
  {
    id: 'hash_crack',
    name: 'Hash Cracker',
    code: `// Rainbow Table Attack
const crackHash = (hash, algorithm) => {
  const rainbow = loadRainbowTable(algorithm);
  const result = rainbow.lookup(hash);
  return result || bruteForce(hash);
};`,
    status: 'locked',
  },
  {
    id: 'keylogger',
    name: 'Keystroke Logger',
    code: `// Keystroke Capture Module
const captureKeys = () => {
  document.addEventListener('keydown', (e) => {
    sendToServer({
      key: e.key,
      timestamp: Date.now()
    });
  });
};`,
    status: 'ready',
  },
];

const HACK_OUTPUTS = [
  '> Initializing exploit framework...',
  '> Loading payload modules...',
  '> Establishing secure tunnel...',
  '> Target acquired: 192.168.1.100',
  '> Running vulnerability scan...',
  '> [!] Found open port: 22 (SSH)',
  '> [!] Found open port: 80 (HTTP)',
  '> [!] Found open port: 443 (HTTPS)',
  '> Attempting authentication bypass...',
  '> [*] Injecting payload...',
  '> [+] Payload delivered successfully',
  '> Extracting data packets...',
  '> [*] 256 records retrieved',
  '> Cleaning traces...',
  '> [+] Operation complete',
];

const CodingSpace = ({ dangerMode }: CodingSpaceProps) => {
  const [selectedExploit, setSelectedExploit] = useState(EXPLOIT_TEMPLATES[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const runExploit = () => {
    if (selectedExploit.status === 'locked') return;
    
    setIsRunning(true);
    setOutput([]);
    setProgress(0);

    let outputIndex = 0;
    const interval = setInterval(() => {
      if (outputIndex < HACK_OUTPUTS.length) {
        setOutput(prev => [...prev, HACK_OUTPUTS[outputIndex]]);
        setProgress((outputIndex / HACK_OUTPUTS.length) * 100);
        outputIndex++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setProgress(100);
      }
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-lg ${dangerMode ? 'border-destructive/30' : 'border-primary/30'} bg-card/30 p-4`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Code className={`w-5 h-5 ${dangerMode ? 'text-destructive' : 'text-primary'}`} />
        <h3 className={`font-bold ${dangerMode ? 'text-destructive' : 'text-primary'}`}>
          EXPLOIT DEVELOPMENT LAB
        </h3>
        <span className="ml-auto text-xs text-muted-foreground flex items-center gap-2">
          <Cpu className="w-3 h-3" />
          SANDBOX ENVIRONMENT
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Exploit Templates */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <FileCode className="w-3 h-3" />
            EXPLOIT MODULES
          </div>
          {EXPLOIT_TEMPLATES.map((exploit) => (
            <button
              key={exploit.id}
              onClick={() => setSelectedExploit(exploit)}
              disabled={exploit.status === 'locked'}
              className={`w-full text-left p-3 rounded text-xs transition-all ${
                selectedExploit.id === exploit.id
                  ? dangerMode 
                    ? 'bg-destructive/20 border border-destructive' 
                    : 'bg-primary/20 border border-primary'
                  : exploit.status === 'locked'
                    ? 'bg-muted/20 border border-transparent cursor-not-allowed opacity-50'
                    : 'bg-background/50 border border-transparent hover:border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-bold ${dangerMode ? 'text-destructive' : 'text-primary'}`}>
                  {exploit.name}
                </span>
                {exploit.status === 'locked' ? (
                  <span className="text-muted-foreground">🔒</span>
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
              <div className="text-muted-foreground">
                {exploit.status === 'locked' ? 'REQUIRES CLEARANCE' : 'READY TO DEPLOY'}
              </div>
            </button>
          ))}
        </div>

        {/* Code Editor */}
        <div className="md:col-span-2">
          <div className={`rounded border ${dangerMode ? 'border-destructive/30' : 'border-primary/30'} overflow-hidden`}>
            {/* Editor Header */}
            <div className={`flex items-center justify-between px-3 py-2 ${dangerMode ? 'bg-destructive/10' : 'bg-primary/10'}`}>
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <span className="text-xs text-muted-foreground">{selectedExploit.name}.js</span>
              </div>
              <button
                onClick={runExploit}
                disabled={isRunning || selectedExploit.status === 'locked'}
                className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-bold transition-all ${
                  isRunning || selectedExploit.status === 'locked'
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : dangerMode
                      ? 'bg-destructive text-destructive-foreground hover:bg-destructive/80'
                      : 'bg-primary text-primary-foreground hover:bg-primary/80'
                }`}
              >
                {isRunning ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Zap className="w-3 h-3" />
                    </motion.div>
                    EXECUTING...
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    RUN EXPLOIT
                  </>
                )}
              </button>
            </div>

            {/* Code Area */}
            <div className="p-4 bg-background/80 font-mono text-xs overflow-x-auto">
              <pre className={`${dangerMode ? 'text-destructive/80' : 'text-primary/80'}`}>
                {selectedExploit.code}
              </pre>
            </div>

            {/* Progress Bar */}
            {(isRunning || progress > 0) && (
              <div className={`h-1 ${dangerMode ? 'bg-destructive/20' : 'bg-primary/20'}`}>
                <motion.div
                  className={`h-full ${dangerMode ? 'bg-destructive' : 'bg-primary'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          {/* Terminal Output */}
          <div className={`mt-4 rounded border ${dangerMode ? 'border-destructive/30 bg-black' : 'border-primary/30 bg-background/90'} p-3 h-48 overflow-y-auto font-mono text-xs`}>
            <div className="flex items-center gap-2 mb-2 text-muted-foreground">
              <Terminal className="w-4 h-4" />
              OUTPUT CONSOLE
            </div>
            {output.length === 0 ? (
              <div className="text-muted-foreground">
                &gt; Awaiting execution...
              </div>
            ) : (
              output.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${
                    line.includes('[+]') ? 'text-green-500' :
                    line.includes('[!]') ? 'text-yellow-500' :
                    line.includes('[*]') ? (dangerMode ? 'text-destructive' : 'text-secondary') :
                    dangerMode ? 'text-destructive/70' : 'text-primary/70'
                  }`}
                >
                  {line}
                </motion.div>
              ))
            )}
            {progress === 100 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 flex items-center gap-2 text-green-500"
              >
                <CheckCircle className="w-4 h-4" />
                EXECUTION COMPLETE - ALL SYSTEMS NOMINAL
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CodingSpace;
