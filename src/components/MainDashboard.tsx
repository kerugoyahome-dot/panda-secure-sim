import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Camera, Users, Code, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import KNECPortal from './KNECPortal';
import CCTVModule from './CCTVModule';
import SocialMediaModule from './SocialMediaModule';
import CodingSpace from './CodingSpace';
import HackTricks from './HackTricks';

interface MainDashboardProps {
  dangerMode: boolean;
  onAutoLogout?: () => void;
}

type ModuleTab = 'knec' | 'cctv' | 'social' | 'coding' | 'tricks';

const MODULES = [
  { id: 'knec' as ModuleTab, name: 'KNEC DATABASE', icon: Database, description: 'Exam Results Portal' },
  { id: 'cctv' as ModuleTab, name: 'CCTV NETWORK', icon: Camera, description: 'Surveillance Feeds' },
  { id: 'social' as ModuleTab, name: 'SOCIAL INTEL', icon: Users, description: 'Profile Tracking' },
  { id: 'coding' as ModuleTab, name: 'EXPLOIT LAB', icon: Code, description: 'Development Tools' },
  { id: 'tricks' as ModuleTab, name: 'HACK TRICKS', icon: Lightbulb, description: 'Technique Library' },
];

const MainDashboard = ({ dangerMode, onAutoLogout }: MainDashboardProps) => {
  const [activeModule, setActiveModule] = useState<ModuleTab>('knec');
  const [showModuleNav, setShowModuleNav] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Module Navigation */}
      <div className={`border rounded-lg ${dangerMode ? 'border-destructive/30' : 'border-primary/30'} bg-card/30 overflow-hidden`}>
        <button
          onClick={() => setShowModuleNav(!showModuleNav)}
          className={`w-full flex items-center justify-between p-4 ${dangerMode ? 'hover:bg-destructive/10' : 'hover:bg-primary/10'} transition-colors`}
        >
          <div className="flex items-center gap-3">
            <Database className={`w-5 h-5 ${dangerMode ? 'text-destructive' : 'text-primary'}`} />
            <span className={`font-bold ${dangerMode ? 'text-destructive' : 'text-primary'}`}>
              SYSTEM MODULES
            </span>
            <span className="text-xs text-muted-foreground">
              — {MODULES.find(m => m.id === activeModule)?.name}
            </span>
          </div>
          {showModuleNav ? (
            <ChevronUp className={`w-5 h-5 ${dangerMode ? 'text-destructive' : 'text-primary'}`} />
          ) : (
            <ChevronDown className={`w-5 h-5 ${dangerMode ? 'text-destructive' : 'text-primary'}`} />
          )}
        </button>

        {showModuleNav && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-4"
          >
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {MODULES.map((module, index) => (
                <motion.button
                  key={module.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setActiveModule(module.id)}
                  className={`p-3 rounded text-left transition-all ${
                    activeModule === module.id
                      ? dangerMode
                        ? 'bg-destructive/20 border-2 border-destructive'
                        : 'bg-primary/20 border-2 border-primary'
                      : 'bg-background/50 border border-border hover:border-primary/50'
                  }`}
                >
                  <module.icon className={`w-6 h-6 mb-2 ${
                    activeModule === module.id
                      ? dangerMode ? 'text-destructive' : 'text-primary'
                      : 'text-muted-foreground'
                  }`} />
                  <div className={`text-xs font-bold ${
                    activeModule === module.id
                      ? dangerMode ? 'text-destructive' : 'text-primary'
                      : 'text-foreground'
                  }`}>
                    {module.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{module.description}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Active Module Content */}
      <motion.div
        key={activeModule}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeModule === 'knec' && (
          <KNECPortal dangerMode={dangerMode} onAutoLogout={onAutoLogout} />
        )}
        {activeModule === 'cctv' && (
          <CCTVModule dangerMode={dangerMode} />
        )}
        {activeModule === 'social' && (
          <SocialMediaModule dangerMode={dangerMode} />
        )}
        {activeModule === 'coding' && (
          <CodingSpace dangerMode={dangerMode} />
        )}
        {activeModule === 'tricks' && (
          <HackTricks dangerMode={dangerMode} />
        )}
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-6 border-t border-border"
      >
        <div className="flex items-center justify-center gap-2">
          <Database className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">COOL HACKS SECURE SOFTWARE v9.7</span>
        </div>
        <div className="text-xs text-muted-foreground/50 mt-1">
          ALL DATA IS SIMULATED FOR DEMONSTRATION PURPOSES
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default MainDashboard;
