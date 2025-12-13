import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Play, Pause, SkipForward, AlertTriangle, Eye } from 'lucide-react';

interface CCTVModuleProps {
  dangerMode: boolean;
}

const CCTV_FEEDS = [
  { id: 'CAM-001', location: 'MAIN ENTRANCE - KNEC HQ', status: 'ACTIVE', activity: 'LOW' },
  { id: 'CAM-002', location: 'SERVER ROOM A', status: 'ACTIVE', activity: 'HIGH' },
  { id: 'CAM-003', location: 'DATA CENTER B', status: 'ENCRYPTED', activity: 'MEDIUM' },
  { id: 'CAM-004', location: 'EXAM VAULT', status: 'RESTRICTED', activity: 'CRITICAL' },
  { id: 'CAM-005', location: 'PRINTING FACILITY', status: 'ACTIVE', activity: 'LOW' },
  { id: 'CAM-006', location: 'ARCHIVE ROOM', status: 'ACTIVE', activity: 'NONE' },
];

const CCTVModule = ({ dangerMode }: CCTVModuleProps) => {
  const [selectedCam, setSelectedCam] = useState(CCTV_FEEDS[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [detections, setDetections] = useState<string[]>([]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setScanProgress(prev => (prev + 1) % 100);
        if (Math.random() > 0.95) {
          const movements = [
            'MOTION DETECTED - SECTOR 4',
            'FACE RECOGNITION: ANALYZING...',
            'UNAUTHORIZED ACCESS ATTEMPT',
            'PERIMETER BREACH - FALSE ALARM',
            'VEHICLE DETECTED - PARKING LOT',
            'THERMAL ANOMALY DETECTED',
          ];
          setDetections(prev => [...prev.slice(-4), movements[Math.floor(Math.random() * movements.length)]]);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-lg ${dangerMode ? 'border-destructive/30' : 'border-primary/30'} bg-card/30 p-4`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Camera className={`w-5 h-5 ${dangerMode ? 'text-destructive' : 'text-primary'}`} />
        <h3 className={`font-bold ${dangerMode ? 'text-destructive' : 'text-primary'}`}>
          CCTV SURVEILLANCE NETWORK
        </h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {CCTV_FEEDS.filter(f => f.status === 'ACTIVE').length}/{CCTV_FEEDS.length} ONLINE
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Feed List */}
        <div className="space-y-2">
          {CCTV_FEEDS.map((feed) => (
            <button
              key={feed.id}
              onClick={() => setSelectedCam(feed)}
              className={`w-full text-left p-2 rounded text-xs transition-all ${
                selectedCam.id === feed.id
                  ? dangerMode 
                    ? 'bg-destructive/20 border border-destructive' 
                    : 'bg-primary/20 border border-primary'
                  : 'bg-background/50 border border-transparent hover:border-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-bold ${dangerMode ? 'text-destructive' : 'text-primary'}`}>{feed.id}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                  feed.status === 'ACTIVE' ? 'bg-green-500/20 text-green-500' :
                  feed.status === 'ENCRYPTED' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-destructive/20 text-destructive'
                }`}>
                  {feed.status}
                </span>
              </div>
              <div className="text-muted-foreground truncate">{feed.location}</div>
            </button>
          ))}
        </div>

        {/* Main Feed View */}
        <div className="md:col-span-2">
          <div className={`relative aspect-video border rounded ${dangerMode ? 'border-destructive/50 bg-destructive/5' : 'border-primary/50 bg-background/80'} overflow-hidden`}>
            {/* Fake CCTV Feed */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-8 grid-rows-6 w-full h-full opacity-20">
                {Array.from({ length: 48 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={`border ${dangerMode ? 'border-destructive/20' : 'border-primary/20'}`}
                    animate={{ opacity: Math.random() > 0.5 ? [0.3, 0.6, 0.3] : [0.6, 0.3, 0.6] }}
                    transition={{ duration: Math.random() * 2 + 1, repeat: Infinity }}
                  />
                ))}
              </div>
              
              {/* Static noise effect */}
              <div className="absolute inset-0 opacity-10">
                {Array.from({ length: 50 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-1 h-1 ${dangerMode ? 'bg-destructive' : 'bg-primary'}`}
                    style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: Math.random() * 0.5 + 0.1, repeat: Infinity }}
                  />
                ))}
              </div>
            </div>

            {/* Overlay Info */}
            <div className="absolute top-2 left-2 text-xs">
              <div className={`font-bold ${dangerMode ? 'text-destructive' : 'text-primary'}`}>{selectedCam.id}</div>
              <div className="text-muted-foreground">{selectedCam.location}</div>
            </div>

            <div className="absolute top-2 right-2 flex items-center gap-2">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="flex items-center gap-1"
              >
                <div className="w-2 h-2 rounded-full bg-destructive" />
                <span className="text-xs text-destructive">REC</span>
              </motion.div>
            </div>

            {/* Scan Line */}
            <motion.div
              className={`absolute left-0 right-0 h-0.5 ${dangerMode ? 'bg-destructive/50' : 'bg-primary/50'}`}
              style={{ top: `${scanProgress}%` }}
            />

            {/* Activity Indicator */}
            <div className="absolute bottom-2 left-2 right-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">ACTIVITY:</span>
                <span className={`font-bold ${
                  selectedCam.activity === 'CRITICAL' ? 'text-destructive' :
                  selectedCam.activity === 'HIGH' ? 'text-yellow-500' :
                  'text-green-500'
                }`}>{selectedCam.activity}</span>
              </div>
              <div className={`h-1 rounded-full ${dangerMode ? 'bg-destructive/20' : 'bg-primary/20'}`}>
                <motion.div
                  className={`h-full rounded-full ${
                    selectedCam.activity === 'CRITICAL' ? 'bg-destructive' :
                    selectedCam.activity === 'HIGH' ? 'bg-yellow-500' :
                    selectedCam.activity === 'MEDIUM' ? 'bg-secondary' :
                    'bg-green-500'
                  }`}
                  animate={{ width: ['20%', '80%', '40%', '60%', '20%'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded ${dangerMode ? 'bg-destructive/20 text-destructive hover:bg-destructive/30' : 'bg-primary/20 text-primary hover:bg-primary/30'}`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setSelectedCam(CCTV_FEEDS[(CCTV_FEEDS.findIndex(f => f.id === selectedCam.id) + 1) % CCTV_FEEDS.length])}
              className={`p-2 rounded ${dangerMode ? 'bg-destructive/20 text-destructive hover:bg-destructive/30' : 'bg-primary/20 text-primary hover:bg-primary/30'}`}
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <div className="flex-1 text-xs text-muted-foreground text-right">
              FRAME: {String(Math.floor(Date.now() / 100) % 9999).padStart(4, '0')}
            </div>
          </div>

          {/* Detection Log */}
          <div className={`mt-3 p-2 rounded text-xs font-mono ${dangerMode ? 'bg-destructive/10' : 'bg-background/50'} max-h-20 overflow-y-auto`}>
            <AnimatePresence>
              {detections.length === 0 ? (
                <div className="text-muted-foreground flex items-center gap-2">
                  <Eye className="w-3 h-3" />
                  MONITORING... NO ANOMALIES DETECTED
                </div>
              ) : (
                detections.map((d, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-2 ${dangerMode ? 'text-destructive' : 'text-yellow-500'}`}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {d}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CCTVModule;
