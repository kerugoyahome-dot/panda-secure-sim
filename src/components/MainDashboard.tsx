import { motion } from 'framer-motion';
import { Database } from 'lucide-react';
import KNECPortal from './KNECPortal';

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
      {/* KNEC Portal */}
      <KNECPortal dangerMode={dangerMode} />

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
