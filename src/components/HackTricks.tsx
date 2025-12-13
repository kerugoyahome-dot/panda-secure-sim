import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Lock, Unlock, ChevronRight, Shield, Fingerprint, Key, Wifi, Database, Terminal } from 'lucide-react';

interface HackTricksProps {
  dangerMode: boolean;
}

const HACK_CATEGORIES = [
  {
    id: 'password',
    name: 'Password Attacks',
    icon: Key,
    tricks: [
      { name: 'Dictionary Attack', difficulty: 'EASY', description: 'Uses common password lists to crack weak passwords' },
      { name: 'Rainbow Tables', difficulty: 'MEDIUM', description: 'Pre-computed hash lookup for quick password recovery' },
      { name: 'Brute Force', difficulty: 'HARD', description: 'Systematic check of all possible passwords' },
    ],
  },
  {
    id: 'network',
    name: 'Network Exploitation',
    icon: Wifi,
    tricks: [
      { name: 'Man-in-the-Middle', difficulty: 'MEDIUM', description: 'Intercept communications between two parties' },
      { name: 'ARP Spoofing', difficulty: 'EASY', description: 'Redirect network traffic through attacker machine' },
      { name: 'DNS Poisoning', difficulty: 'HARD', description: 'Corrupt DNS cache to redirect traffic' },
    ],
  },
  {
    id: 'database',
    name: 'Database Attacks',
    icon: Database,
    tricks: [
      { name: 'SQL Injection', difficulty: 'MEDIUM', description: 'Inject malicious SQL code into queries' },
      { name: 'NoSQL Injection', difficulty: 'HARD', description: 'Exploit NoSQL database vulnerabilities' },
      { name: 'Data Exfiltration', difficulty: 'MEDIUM', description: 'Extract sensitive data from databases' },
    ],
  },
  {
    id: 'auth',
    name: 'Authentication Bypass',
    icon: Fingerprint,
    tricks: [
      { name: 'Session Hijacking', difficulty: 'MEDIUM', description: 'Steal user session tokens' },
      { name: 'Token Forgery', difficulty: 'HARD', description: 'Create fake authentication tokens' },
      { name: 'Cookie Manipulation', difficulty: 'EASY', description: 'Modify cookies to gain access' },
    ],
  },
  {
    id: 'system',
    name: 'System Compromise',
    icon: Terminal,
    tricks: [
      { name: 'Privilege Escalation', difficulty: 'HARD', description: 'Gain higher system permissions' },
      { name: 'Backdoor Installation', difficulty: 'MEDIUM', description: 'Create persistent access point' },
      { name: 'Rootkit Deployment', difficulty: 'EXPERT', description: 'Hide malicious software from detection' },
    ],
  },
];

const HackTricks = ({ dangerMode }: HackTricksProps) => {
  const [selectedCategory, setSelectedCategory] = useState(HACK_CATEGORIES[0]);
  const [unlockedTricks, setUnlockedTricks] = useState<string[]>([]);
  const [activeTrick, setActiveTrick] = useState<string | null>(null);

  const handleUnlock = (trickName: string) => {
    if (!unlockedTricks.includes(trickName)) {
      setUnlockedTricks([...unlockedTricks, trickName]);
    }
    setActiveTrick(trickName);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'text-green-500 bg-green-500/20';
      case 'MEDIUM': return 'text-yellow-500 bg-yellow-500/20';
      case 'HARD': return 'text-orange-500 bg-orange-500/20';
      case 'EXPERT': return 'text-destructive bg-destructive/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-lg ${dangerMode ? 'border-destructive/30' : 'border-primary/30'} bg-card/30 p-4`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className={`w-5 h-5 ${dangerMode ? 'text-destructive' : 'text-primary'}`} />
        <h3 className={`font-bold ${dangerMode ? 'text-destructive' : 'text-primary'}`}>
          HACK TRICKS DATABASE
        </h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {unlockedTricks.length}/{HACK_CATEGORIES.reduce((acc, cat) => acc + cat.tricks.length, 0)} UNLOCKED
        </span>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {/* Categories */}
        <div className="space-y-2">
          {HACK_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className={`w-full text-left p-3 rounded text-xs transition-all flex items-center gap-2 ${
                selectedCategory.id === category.id
                  ? dangerMode 
                    ? 'bg-destructive/20 border border-destructive' 
                    : 'bg-primary/20 border border-primary'
                  : 'bg-background/50 border border-transparent hover:border-border'
              }`}
            >
              <category.icon className={`w-5 h-5 ${dangerMode ? 'text-destructive' : 'text-primary'}`} />
              <span className="font-bold text-foreground">{category.name}</span>
              <ChevronRight className={`w-4 h-4 ml-auto ${dangerMode ? 'text-destructive' : 'text-primary'}`} />
            </button>
          ))}
        </div>

        {/* Tricks List */}
        <div className="md:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              <div className={`flex items-center gap-2 p-3 rounded ${dangerMode ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                <selectedCategory.icon className={`w-6 h-6 ${dangerMode ? 'text-destructive' : 'text-primary'}`} />
                <div>
                  <div className={`font-bold ${dangerMode ? 'text-destructive' : 'text-primary'}`}>
                    {selectedCategory.name.toUpperCase()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedCategory.tricks.length} techniques available
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                {selectedCategory.tricks.map((trick, index) => {
                  const isUnlocked = unlockedTricks.includes(trick.name);
                  const isActive = activeTrick === trick.name;
                  
                  return (
                    <motion.div
                      key={trick.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded border transition-all ${
                        isActive
                          ? dangerMode 
                            ? 'border-destructive bg-destructive/10' 
                            : 'border-primary bg-primary/10'
                          : 'border-border bg-background/50 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {isUnlocked ? (
                            <Unlock className="w-5 h-5 text-green-500" />
                          ) : (
                            <Lock className={`w-5 h-5 ${dangerMode ? 'text-destructive' : 'text-muted-foreground'}`} />
                          )}
                          <span className="font-bold text-foreground">{trick.name}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${getDifficultyColor(trick.difficulty)}`}>
                          {trick.difficulty}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{trick.description}</p>
                      
                      <button
                        onClick={() => handleUnlock(trick.name)}
                        className={`w-full py-2 rounded text-xs font-bold transition-all ${
                          isUnlocked
                            ? 'bg-green-500/20 text-green-500 border border-green-500/50'
                            : dangerMode
                              ? 'bg-destructive/20 text-destructive hover:bg-destructive/30 border border-destructive/50'
                              : 'bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50'
                        }`}
                      >
                        {isUnlocked ? (
                          <span className="flex items-center justify-center gap-2">
                            <Shield className="w-4 h-4" />
                            TECHNIQUE MASTERED
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Key className="w-4 h-4" />
                            UNLOCK TECHNIQUE
                          </span>
                        )}
                      </button>

                      {isActive && isUnlocked && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className={`mt-3 p-3 rounded text-xs font-mono ${dangerMode ? 'bg-black' : 'bg-background'}`}
                        >
                          <div className="text-muted-foreground mb-1">&gt; Technique loaded...</div>
                          <div className={dangerMode ? 'text-destructive' : 'text-primary'}>
                            &gt; {trick.name} ready for deployment
                          </div>
                          <div className="text-green-500">&gt; [+] Execute at your own risk</div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default HackTricks;
