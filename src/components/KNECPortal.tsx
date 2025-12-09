import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Calendar, FileText, AlertCircle, BookOpen, GraduationCap, ClipboardList } from 'lucide-react';
import knecLogo from '@/assets/knec-logo.png';

interface KNECPortalProps {
  dangerMode: boolean;
}

type ExamType = 'KPSEA' | 'KJSEA' | 'KCSE' | 'QT' | 'SBA' | null;

const EXAM_TYPES = [
  { id: 'KPSEA', name: 'Kenya Primary School Education Assessment', icon: BookOpen, description: 'Grade 6 Assessment' },
  { id: 'KJSEA', name: 'Kenya Junior School Education Assessment', icon: ClipboardList, description: 'Grade 9 Assessment' },
  { id: 'KCSE', name: 'Kenya Certificate of Secondary Education', icon: GraduationCap, description: 'Form 4 National Exam' },
  { id: 'QT', name: 'KCSE Qualifying Test', icon: FileText, description: 'Qualifying Examination' },
  { id: 'SBA', name: 'School-Based Assessments', icon: ClipboardList, description: 'Continuous Assessment' },
] as const;

// Generate years from 1996 to 2025
const YEARS = Array.from({ length: 30 }, (_, i) => 2025 - i);

const KNECPortal = ({ dangerMode }: KNECPortalProps) => {
  const [selectedExam, setSelectedExam] = useState<ExamType>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showNotReady, setShowNotReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleExamSelect = (examId: ExamType) => {
    setSelectedExam(examId);
    setSelectedYear(null);
    setShowNotReady(false);
  };

  const handleYearSelect = (year: number) => {
    setLoading(true);
    setSelectedYear(year);
    
    setTimeout(() => {
      setLoading(false);
      if (year === 2025) {
        setShowNotReady(true);
      } else {
        setShowNotReady(false);
      }
    }, 1500);
  };

  const handleBack = () => {
    if (selectedYear !== null) {
      setSelectedYear(null);
      setShowNotReady(false);
    } else {
      setSelectedExam(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-[500px]"
    >
      {/* KNEC Logo Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <img 
          src={knecLogo} 
          alt="" 
          className="w-96 h-96 opacity-5 object-contain"
        />
      </div>

      {/* Header */}
      <div className={`border-b ${dangerMode ? 'border-destructive/30' : 'border-primary/30'} pb-4 mb-6`}>
        <div className="flex items-center gap-4">
          <img src={knecLogo} alt="KNEC" className="w-16 h-16 object-contain" />
          <div>
            <h2 className={`text-xl font-bold ${dangerMode ? 'text-destructive text-glow-red' : 'text-primary text-glow'}`}>
              THE KENYA NATIONAL EXAMINATIONS COUNCIL
            </h2>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Mock Results Portal - Simulation Only
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap gap-4 mt-4 text-xs">
          {['CBA PORTAL', 'SEMA NASI', 'QMIS', 'STAFF MAIL', 'INTRANET', 'CBA LMS', 'KCSE RESULTS'].map((link) => (
            <span 
              key={link}
              className={`cursor-pointer transition-colors ${
                link === 'KCSE RESULTS' 
                  ? dangerMode ? 'text-destructive text-glow-red' : 'text-primary text-glow'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link}
            </span>
          ))}
        </div>
      </div>

      {/* Breadcrumb */}
      {(selectedExam || selectedYear) && (
        <div className="flex items-center gap-2 mb-4 text-xs">
          <button 
            onClick={() => { setSelectedExam(null); setSelectedYear(null); setShowNotReady(false); }}
            className={`${dangerMode ? 'text-destructive' : 'text-primary'} hover:underline`}
          >
            Examinations
          </button>
          {selectedExam && (
            <>
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
              <button 
                onClick={handleBack}
                className={`${dangerMode ? 'text-destructive' : 'text-primary'} hover:underline`}
              >
                {selectedExam}
              </button>
            </>
          )}
          {selectedYear && (
            <>
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">{selectedYear}</span>
            </>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Exam Type Selection */}
        {!selectedExam && (
          <motion.div
            key="exam-select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-foreground mb-4">
              SELECT EXAMINATION TYPE
            </h3>
            <div className="grid gap-3">
              {EXAM_TYPES.map((exam, index) => (
                <motion.button
                  key={exam.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleExamSelect(exam.id as ExamType)}
                  className={`flex items-center gap-4 p-4 border rounded-lg text-left transition-all
                    ${dangerMode 
                      ? 'border-destructive/30 hover:border-destructive hover:bg-destructive/10' 
                      : 'border-border hover:border-primary hover:bg-primary/10'
                    } bg-card/30`}
                >
                  <exam.icon className={`w-8 h-8 ${dangerMode ? 'text-destructive' : 'text-primary'}`} />
                  <div className="flex-1">
                    <div className="font-bold text-foreground">{exam.id}</div>
                    <div className="text-sm text-muted-foreground">{exam.name}</div>
                    <div className="text-xs text-muted-foreground/70">{exam.description}</div>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${dangerMode ? 'text-destructive' : 'text-primary'}`} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Year Selection for KCSE */}
        {selectedExam && !selectedYear && !loading && (
          <motion.div
            key="year-select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">
                {selectedExam} RESULTS - SELECT YEAR
              </h3>
              <button 
                onClick={handleBack}
                className={`text-xs ${dangerMode ? 'text-destructive' : 'text-primary'} hover:underline`}
              >
                ← Back
              </button>
            </div>
            
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
              {YEARS.map((year, index) => (
                <motion.button
                  key={year}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => handleYearSelect(year)}
                  className={`p-3 text-sm font-bold rounded border transition-all
                    ${year === 2025 
                      ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
                      : dangerMode 
                        ? 'border-destructive/30 hover:border-destructive hover:bg-destructive/10 text-foreground' 
                        : 'border-border hover:border-primary hover:bg-primary/10 text-foreground'
                    }`}
                >
                  {year}
                </motion.button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-yellow-500 mt-4">
              <AlertCircle className="w-4 h-4" />
              <span>2025 results not yet released</span>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className={`w-16 h-16 border-4 ${dangerMode ? 'border-destructive/30 border-t-destructive' : 'border-primary/30 border-t-primary'} rounded-full animate-spin`} />
            <p className={`mt-4 text-sm ${dangerMode ? 'text-destructive' : 'text-primary'}`}>
              Accessing {selectedExam} {selectedYear} Results...
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Querying Mock Database...
            </p>
          </motion.div>
        )}

        {/* 2025 Not Ready Message */}
        {showNotReady && selectedYear === 2025 && (
          <motion.div
            key="not-ready"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className={`p-6 border-2 ${dangerMode ? 'border-destructive bg-destructive/10' : 'border-yellow-500 bg-yellow-500/10'} rounded-lg text-center max-w-md`}>
              <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${dangerMode ? 'text-destructive' : 'text-yellow-500'}`} />
              <h3 className={`text-xl font-bold mb-2 ${dangerMode ? 'text-destructive' : 'text-yellow-500'}`}>
                RESULTS NOT READY
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {selectedExam} 2025 results have not been released yet.
              </p>
              <p className="text-xs text-muted-foreground">
                Please check back later or select a different year.
              </p>
              <button
                onClick={handleBack}
                className={`mt-6 px-6 py-2 rounded font-bold text-sm transition-all
                  ${dangerMode 
                    ? 'bg-destructive/20 text-destructive hover:bg-destructive/30 border border-destructive' 
                    : 'bg-primary/20 text-primary hover:bg-primary/30 border border-primary'
                  }`}
              >
                ← SELECT DIFFERENT YEAR
              </button>
            </div>
          </motion.div>
        )}

        {/* Mock Results Display (for years other than 2025) */}
        {selectedYear && selectedYear !== 2025 && !loading && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-bold ${dangerMode ? 'text-destructive' : 'text-primary'}`}>
                {selectedExam} {selectedYear} RESULTS
              </h3>
              <button 
                onClick={handleBack}
                className={`text-xs ${dangerMode ? 'text-destructive' : 'text-primary'} hover:underline`}
              >
                ← Back to Years
              </button>
            </div>

            <div className={`p-6 border ${dangerMode ? 'border-destructive/30' : 'border-primary/30'} rounded-lg bg-card/50`}>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className={`w-5 h-5 ${dangerMode ? 'text-destructive' : 'text-primary'}`} />
                <span className="font-bold">Mock Data - {selectedYear} Academic Year</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className={`p-3 rounded ${dangerMode ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                  <div className="text-xs text-muted-foreground">Total Candidates</div>
                  <div className={`text-xl font-bold ${dangerMode ? 'text-destructive' : 'text-primary'}`}>
                    {(800000 + Math.floor(Math.random() * 100000)).toLocaleString()}
                  </div>
                </div>
                <div className={`p-3 rounded ${dangerMode ? 'bg-destructive/10' : 'bg-secondary/10'}`}>
                  <div className="text-xs text-muted-foreground">Mean Score</div>
                  <div className={`text-xl font-bold ${dangerMode ? 'text-destructive' : 'text-secondary'}`}>
                    {(35 + Math.random() * 10).toFixed(2)}
                  </div>
                </div>
                <div className={`p-3 rounded ${dangerMode ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                  <div className="text-xs text-muted-foreground">Grade A</div>
                  <div className={`text-xl font-bold ${dangerMode ? 'text-destructive' : 'text-primary'}`}>
                    {(2000 + Math.floor(Math.random() * 500)).toLocaleString()}
                  </div>
                </div>
                <div className={`p-3 rounded ${dangerMode ? 'bg-destructive/10' : 'bg-secondary/10'}`}>
                  <div className="text-xs text-muted-foreground">Schools</div>
                  <div className={`text-xl font-bold ${dangerMode ? 'text-destructive' : 'text-secondary'}`}>
                    {(10000 + Math.floor(Math.random() * 1000)).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="text-center py-8 border-t border-border">
                <FileText className={`w-12 h-12 mx-auto mb-3 ${dangerMode ? 'text-destructive/50' : 'text-primary/50'}`} />
                <p className="text-sm text-muted-foreground">
                  Individual result lookup requires student index number
                </p>
                <p className="text-xs text-destructive mt-2 font-bold">
                  (MOCK DATA - FOR MOVIE USE ONLY)
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default KNECPortal;
