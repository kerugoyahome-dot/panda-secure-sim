import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield } from 'lucide-react';

interface DangerAlertProps {
  show: boolean;
}

const DangerAlert = ({ show }: DangerAlertProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-3 px-6 py-3 bg-destructive/20 border border-destructive rounded-lg box-glow-red">
            <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
            <div className="text-sm">
              <div className="font-bold text-destructive text-glow-red">
                !!! SECURITY SPIKE DETECTED !!!
              </div>
              <div className="text-destructive/80">
                !!! SIMULATION MODE ACTIVE !!!
              </div>
            </div>
            <Shield className="w-5 h-5 text-destructive animate-pulse" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DangerAlert;
