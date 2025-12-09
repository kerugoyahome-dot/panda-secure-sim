import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { School, ChevronRight, Database, X } from 'lucide-react';

const SCHOOLS = [
  { name: 'Alliance High', code: 'ALH-001', region: 'Kikuyu' },
  { name: 'Mangu High', code: 'MNG-002', region: 'Thika' },
  { name: 'Starehe Boys', code: 'STB-003', region: 'Nairobi' },
  { name: 'Kenya High', code: 'KNH-004', region: 'Nairobi' },
  { name: 'Pangani Girls', code: 'PGG-005', region: 'Nairobi' },
  { name: 'Maseno School', code: 'MSN-006', region: 'Kisumu' },
  { name: 'Maryhill Girls', code: 'MRY-007', region: 'Thika' },
  { name: 'Lenana School', code: 'LEN-008', region: 'Nairobi' },
  { name: 'Kapsabet Boys', code: 'KPS-009', region: 'Nandi' },
  { name: 'Moi Forces Academy', code: 'MFA-010', region: 'Nairobi' },
];

interface SchoolListProps {
  dangerMode: boolean;
}

const SchoolList = ({ dangerMode }: SchoolListProps) => {
  const [selectedSchool, setSelectedSchool] = useState<typeof SCHOOLS[0] | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryLogs, setQueryLogs] = useState<string[]>([]);

  const handleSchoolClick = async (school: typeof SCHOOLS[0]) => {
    setSelectedSchool(school);
    setIsQuerying(true);
    setQueryLogs([]);

    const logs = [
      `> Opening ${school.name}…`,
      `> Query: MOCK_EXAM_DATA_${school.code}`,
      `> Scanning regional node: ${school.region}…`,
      `> Checking data availability…`,
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise(r => setTimeout(r, 400));
      setQueryLogs(prev => [...prev, logs[i]]);
    }

    await new Promise(r => setTimeout(r, 500));
    setQueryLogs(prev => [...prev, '', 'NO DATA YET', 'Will be added soon (Mock Placeholder)']);
    setIsQuerying(false);
  };

  return (
    <div className={`border ${dangerMode ? 'border-destructive/50' : 'border-border'} rounded-lg bg-card/30 overflow-hidden`}>
      {/* Header */}
      <div className={`px-4 py-3 border-b ${dangerMode ? 'border-destructive/50 bg-destructive/10' : 'border-border bg-muted/30'}`}>
        <div className="flex items-center gap-2">
          <Database className={`w-4 h-4 ${dangerMode ? 'text-destructive' : 'text-secondary'}`} />
          <span className={`text-sm font-bold ${dangerMode ? 'text-destructive' : 'text-secondary'}`}>
            MOCK KNEC NATIONAL SCHOOLS
          </span>
        </div>
      </div>

      {/* School list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
        <div className="max-h-64 overflow-y-auto">
          {SCHOOLS.map((school, i) => (
            <motion.button
              key={school.code}
              onClick={() => handleSchoolClick(school)}
              className={`w-full px-4 py-2 flex items-center justify-between text-left text-sm transition-all ${
                selectedSchool?.code === school.code
                  ? dangerMode ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'
                  : 'hover:bg-muted/50 text-foreground/80'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-center gap-2">
                <School className="w-4 h-4" />
                <span>{school.name}</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </motion.button>
          ))}
        </div>

        {/* Query result panel */}
        <div className="p-4 bg-background/50 min-h-[200px]">
          <AnimatePresence mode="wait">
            {selectedSchool ? (
              <motion.div
                key={selectedSchool.code}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-bold ${dangerMode ? 'text-destructive' : 'text-primary'}`}>
                    {selectedSchool.name}
                  </h4>
                  <button
                    onClick={() => setSelectedSchool(null)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="text-xs space-y-1 font-mono">
                  {queryLogs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={
                        log === 'NO DATA YET'
                          ? 'text-cyber-yellow font-bold mt-2'
                          : log.includes('Will be added')
                          ? 'text-muted-foreground italic'
                          : dangerMode ? 'text-destructive/80' : 'text-muted-foreground'
                      }
                    >
                      {log}
                    </motion.div>
                  ))}
                  {isQuerying && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className={dangerMode ? 'text-destructive' : 'text-primary'}
                    >
                      _
                    </motion.span>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center text-muted-foreground text-sm"
              >
                Select a school to query data
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SchoolList;
