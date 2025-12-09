import { motion } from 'framer-motion';
import { Shield, Activity, Server, Cpu, Wifi, Database } from 'lucide-react';
import CodeWaterfall from './CodeWaterfall';
import SchoolList from './SchoolList';

interface MainDashboardProps {
  dangerMode: boolean;
}

const MainDashboard = ({ dangerMode }: MainDashboardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* System status cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Shield, label: 'SECURE', value: 'ACTIVE', color: 'primary' },
          { icon: Activity, label: 'UPTIME', value: '99.97%', color: 'secondary' },
          { icon: Server, label: 'NODES', value: '47/50', color: 'primary' },
          { icon: Cpu, label: 'LOAD', value: '23%', color: 'secondary' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 border ${dangerMode ? 'border-destructive/50 bg-destructive/5' : 'border-border bg-card/30'} rounded-lg`}
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${dangerMode ? 'text-destructive' : stat.color === 'primary' ? 'text-primary' : 'text-secondary'}`} />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <div className={`text-lg font-bold ${dangerMode ? 'text-destructive text-glow-red' : stat.color === 'primary' ? 'text-primary text-glow' : 'text-secondary text-glow-cyan'}`}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Connection status */}
      <div className={`p-4 border ${dangerMode ? 'border-destructive/50' : 'border-border'} rounded-lg bg-card/30`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wifi className={`w-4 h-4 ${dangerMode ? 'text-destructive' : 'text-primary'}`} />
            <span className="text-sm font-bold">NETWORK STATUS</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded ${dangerMode ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
            CONNECTED
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div>
            <div className="text-muted-foreground">LATENCY</div>
            <div className={dangerMode ? 'text-destructive' : 'text-secondary'}>12ms</div>
          </div>
          <div>
            <div className="text-muted-foreground">BANDWIDTH</div>
            <div className={dangerMode ? 'text-destructive' : 'text-secondary'}>1.2 Gbps</div>
          </div>
          <div>
            <div className="text-muted-foreground">ENCRYPTION</div>
            <div className={dangerMode ? 'text-destructive' : 'text-primary'}>AES-256</div>
          </div>
        </div>
      </div>

      {/* Live code waterfall */}
      <CodeWaterfall dangerMode={dangerMode} />

      {/* School registry */}
      <SchoolList dangerMode={dangerMode} />

      {/* Footer disclaimer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-6 border-t border-border"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Database className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">PANDA TECH SYSTEMS</span>
        </div>
        <p className="text-xs text-destructive font-bold">
          FOR MOVIE USE ONLY – NOT A REAL SYSTEM.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          All data is fictional. No real KNEC systems accessed.
        </p>
      </motion.footer>
    </motion.div>
  );
};

export default MainDashboard;
