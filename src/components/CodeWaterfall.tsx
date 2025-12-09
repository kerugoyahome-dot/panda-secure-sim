import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const STREAMS = [
  'STREAM 01: EXAM_BUNDLE_44X-MOCK → OK',
  'STREAM 02: NODE[ALLIANCE] → SYNC',
  'STREAM 03: NODE[MANGU] → NO DATA YET',
  'STREAM 04: CHECKSUM MOCK-201-A',
  'STREAM 05: ENCRYPT_BLOCK 7Z-900 → OK',
  'STREAM 06: NODE[STAREHE] → SYNC',
  'STREAM 07: PACKET_VERIFY_A92 → PASS',
  'STREAM 08: NODE[KENYA_HIGH] → SYNC',
  'STREAM 09: CIPHER_ROTATE_X21 → OK',
  'STREAM 10: NODE[MASENO] → PENDING',
  'STREAM 11: DATA_INTEGRITY_CHECK → 100%',
  'STREAM 12: NODE[MARYHILL] → SYNC',
  'STREAM 13: QUANTUM_HASH_B44 → VERIFIED',
  'STREAM 14: NODE[LENANA] → SYNC',
  'STREAM 15: BUFFER_FLUSH_C19 → COMPLETE',
];

interface CodeWaterfallProps {
  dangerMode: boolean;
}

const CodeWaterfall = ({ dangerMode }: CodeWaterfallProps) => {
  const [lines, setLines] = useState<{ id: number; text: string }[]>([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLine = {
        id: Date.now(),
        text: STREAMS[Math.floor(Math.random() * STREAMS.length)],
      };
      setLines(prev => [...prev.slice(-20), newLine]);
      setCounter(prev => prev + 1);
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-48 overflow-hidden border border-border rounded-lg bg-card/30 p-3 font-mono text-xs">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-border">
        <span className={`${dangerMode ? 'text-destructive' : 'text-secondary'} font-bold`}>
          LIVE DATA STREAM
        </span>
        <span className="text-muted-foreground">
          PACKETS: <span className={dangerMode ? 'text-destructive' : 'text-primary'}>{counter}</span>
        </span>
      </div>
      <div className="space-y-1 overflow-hidden">
        {lines.map((line) => (
          <motion.div
            key={line.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className={`${
              line.text.includes('OK') || line.text.includes('SYNC') || line.text.includes('PASS')
                ? dangerMode ? 'text-destructive' : 'text-primary'
                : line.text.includes('NO DATA') || line.text.includes('PENDING')
                ? 'text-muted-foreground'
                : dangerMode ? 'text-destructive/70' : 'text-secondary'
            }`}
          >
            {line.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CodeWaterfall;
