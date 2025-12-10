import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Calendar, FileText, AlertCircle, BookOpen, GraduationCap, ClipboardList, Search, User, Edit3, Save, Timer } from 'lucide-react';
import knecLogo from '@/assets/knec-logo.png';

interface KNECPortalProps {
  dangerMode: boolean;
  onAutoLogout?: () => void;
}

type ExamType = 'KPSEA' | 'KJSEA' | 'KCSE' | 'QT' | 'SBA' | null;

const EXAM_TYPES = [
  { id: 'KPSEA', name: 'Kenya Primary School Education Assessment', icon: BookOpen, description: 'Grade 6 Assessment' },
  { id: 'KJSEA', name: 'Kenya Junior School Education Assessment', icon: ClipboardList, description: 'Grade 9 Assessment' },
  { id: 'KCSE', name: 'Kenya Certificate of Secondary Education', icon: GraduationCap, description: 'Form 4 National Exam' },
  { id: 'QT', name: 'KCSE Qualifying Test', icon: FileText, description: 'Qualifying Examination' },
  { id: 'SBA', name: 'School-Based Assessments', icon: ClipboardList, description: 'Continuous Assessment' },
] as const;

// Generate years from 1996 to current year + 1
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1995 + 1 }, (_, i) => currentYear + 1 - i);

// Real student data from certificates
const STUDENT_DATABASE: Record<string, any> = {
  '12345503/079': {
    indexNumber: '12345503/079',
    name: 'PURITY WANZA MUSEMBI',
    school: 'MATUNGULU GIRLS SCHOOL',
    year: 2012,
    subjects: [
      { code: '101', name: 'ENGLISH', grade: 'B-', points: 7 },
      { code: '102', name: 'KISWAHILI', grade: 'C-', points: 4 },
      { code: '121', name: 'MATHEMATICS', grade: 'B-', points: 7 },
      { code: '231', name: 'BIOLOGY', grade: 'C', points: 5 },
      { code: '233', name: 'CHEMISTRY', grade: 'B', points: 8 },
      { code: '311', name: 'HISTORY AND GOVERNMENT', grade: 'B-', points: 7 },
      { code: '313', name: 'CHRISTIAN RELIGIOUS EDUCATION', grade: 'B-', points: 7 },
      { code: '565', name: 'BUSINESS STUDIES', grade: 'C+', points: 6 },
    ],
    meanGrade: 'C+',
    totalPoints: 51
  },
  '36611001/008': {
    indexNumber: '36611001/008',
    name: 'KHISA P LABAN',
    school: 'KARIMA SECONDARY SCHOOL',
    year: 2017,
    subjects: [
      { code: '101', name: 'ENGLISH', grade: 'C-', points: 4 },
      { code: '102', name: 'KISWAHILI', grade: 'C-', points: 4 },
      { code: '121', name: 'MATHEMATICS', grade: 'D', points: 2 },
      { code: '231', name: 'BIOLOGY', grade: 'C-', points: 4 },
      { code: '233', name: 'CHEMISTRY', grade: 'D', points: 2 },
      { code: '311', name: 'HISTORY AND GOVERNMENT', grade: 'B+', points: 9 },
      { code: '313', name: 'CHRISTIAN RELIGIOUS EDUCATION', grade: 'B', points: 8 },
      { code: '565', name: 'BUSINESS STUDIES', grade: 'B-', points: 7 },
    ],
    meanGrade: 'B+',
    totalPoints: 40
  }
};

const KNECPortal = ({ dangerMode, onAutoLogout }: KNECPortalProps) => {
  const [selectedExam, setSelectedExam] = useState<ExamType>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showNotReady, setShowNotReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [indexNumber, setIndexNumber] = useState('');
  const [searchingStudent, setSearchingStudent] = useState(false);
  const [studentResult, setStudentResult] = useState<any>(null);
  
  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editCountdown, setEditCountdown] = useState(45);
  const [editedResult, setEditedResult] = useState<any>(null);
  const [showDangerCountdown, setShowDangerCountdown] = useState(false);

  // Handle edit countdown and auto-logout
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isEditing && editCountdown > 0) {
      interval = setInterval(() => {
        setEditCountdown(prev => {
          if (prev <= 1) {
            setShowDangerCountdown(true);
            setIsEditing(false);
            // Auto logout after showing danger for 3 seconds
            setTimeout(() => {
              if (onAutoLogout) {
                onAutoLogout();
              }
            }, 3000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isEditing, editCountdown, onAutoLogout]);

  const handleExamSelect = (examId: ExamType) => {
    setSelectedExam(examId);
    setSelectedYear(null);
    setShowNotReady(false);
  };

  const handleYearSelect = (year: number) => {
    setLoading(true);
    setSelectedYear(year);
    setStudentResult(null);
    setIndexNumber('');
    setIsEditing(false);
    setEditCountdown(45);
    setShowDangerCountdown(false);
    
    setTimeout(() => {
      setLoading(false);
      if (year >= currentYear) {
        setShowNotReady(true);
      } else {
        setShowNotReady(false);
      }
    }, 1500);
  };

  const handleStudentSearch = () => {
    if (indexNumber.length < 5) return;
    
    setSearchingStudent(true);
    setIsEditing(false);
    setEditCountdown(45);
    setShowDangerCountdown(false);
    
    setTimeout(() => {
      setSearchingStudent(false);
      
      // Check if student exists in database
      const normalizedIndex = indexNumber.toUpperCase().trim();
      const foundStudent = STUDENT_DATABASE[normalizedIndex];
      
      if (foundStudent) {
        setStudentResult({ ...foundStudent });
        setEditedResult({ ...foundStudent });
      } else {
        // Generate mock student result for other index numbers
        const grades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'];
        const subjects = [
          { code: '101', name: 'ENGLISH' },
          { code: '102', name: 'KISWAHILI' },
          { code: '121', name: 'MATHEMATICS' },
          { code: '231', name: 'BIOLOGY' },
          { code: '232', name: 'PHYSICS' },
          { code: '233', name: 'CHEMISTRY' },
          { code: '311', name: 'HISTORY AND GOVERNMENT' },
          { code: '312', name: 'GEOGRAPHY' },
        ];
        
        const mockResult = {
          indexNumber: normalizedIndex,
          name: 'STUDENT NAME REDACTED',
          school: 'SCHOOL NAME REDACTED',
          year: selectedYear,
          subjects: subjects.map(sub => ({
            ...sub,
            grade: grades[Math.floor(Math.random() * grades.length)],
            points: Math.floor(Math.random() * 12) + 1
          })),
          meanGrade: grades[Math.floor(Math.random() * 5)],
          totalPoints: Math.floor(Math.random() * 30) + 50
        };
        
        setStudentResult(mockResult);
        setEditedResult({ ...mockResult });
      }
    }, 2000);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditCountdown(45);
    setEditedResult({ ...studentResult });
  };

  const handleSaveEdit = () => {
    setStudentResult({ ...editedResult });
    setIsEditing(false);
    setEditCountdown(45);
  };

  const handleGradeChange = (index: number, newGrade: string) => {
    const newSubjects = [...editedResult.subjects];
    newSubjects[index] = { ...newSubjects[index], grade: newGrade.toUpperCase() };
    setEditedResult({ ...editedResult, subjects: newSubjects });
  };

  const handleMeanGradeChange = (newGrade: string) => {
    setEditedResult({ ...editedResult, meanGrade: newGrade.toUpperCase() });
  };

  const handleBack = () => {
    if (selectedYear !== null) {
      setSelectedYear(null);
      setShowNotReady(false);
      setIsEditing(false);
      setEditCountdown(45);
      setShowDangerCountdown(false);
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
      {/* Danger Countdown Overlay */}
      <AnimatePresence>
        {showDangerCountdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="text-center"
            >
              <AlertCircle className="w-32 h-32 mx-auto text-destructive animate-pulse" />
              <h2 className="text-4xl font-bold text-destructive text-glow-red mt-4">
                SECURITY BREACH DETECTED
              </h2>
              <p className="text-xl text-destructive/80 mt-2">
                EDIT SESSION EXPIRED - INITIATING AUTO LOGOUT
              </p>
              <p className="text-lg text-muted-foreground mt-4">
                TERMINATING CONNECTION...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              DATABASE
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
              Querying Database...
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
                <span className="font-bold">Data - {selectedYear} Academic Year</span>
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

              {/* Student Index Search */}
              <div className="border-t border-border pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Search className={`w-5 h-5 ${dangerMode ? 'text-destructive' : 'text-primary'}`} />
                  <span className="font-bold text-foreground">SEARCH STUDENT RESULT</span>
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={indexNumber}
                    onChange={(e) => setIndexNumber(e.target.value.toUpperCase())}
                    placeholder="Enter Index Number (e.g., 36611001/008)"
                    className={`flex-1 p-3 bg-background/50 border rounded font-mono text-sm
                      ${dangerMode 
                        ? 'border-destructive/50 focus:border-destructive text-destructive' 
                        : 'border-primary/50 focus:border-primary text-foreground'
                      } placeholder:text-muted-foreground/50 focus:outline-none`}
                  />
                  <button
                    onClick={handleStudentSearch}
                    disabled={indexNumber.length < 5 || searchingStudent}
                    className={`px-6 py-3 font-bold text-sm rounded transition-all
                      ${indexNumber.length >= 5 && !searchingStudent
                        ? dangerMode 
                          ? 'bg-destructive text-destructive-foreground hover:bg-destructive/80' 
                          : 'bg-primary text-primary-foreground hover:bg-primary/80'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                  >
                    {searchingStudent ? 'SEARCHING...' : 'SEARCH'}
                  </button>
                </div>

                {/* Searching Animation */}
                {searchingStudent && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-center py-6"
                  >
                    <div className={`w-8 h-8 mx-auto border-2 ${dangerMode ? 'border-destructive/30 border-t-destructive' : 'border-primary/30 border-t-primary'} rounded-full animate-spin`} />
                    <p className={`mt-2 text-sm ${dangerMode ? 'text-destructive' : 'text-primary'}`}>
                      Querying database for {indexNumber}...
                    </p>
                  </motion.div>
                )}

                {/* Student Result Display */}
                {studentResult && !searchingStudent && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-4 border rounded-lg ${
                      dangerMode ? 'border-destructive/30 bg-destructive/5' : 'border-primary/30 bg-primary/5'
                    }`}
                  >
                    {/* Edit Timer and Controls */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <User className={`w-5 h-5 ${dangerMode ? 'text-destructive' : 'text-primary'}`} />
                        <span className="font-bold text-foreground">RESULT SLIP - {studentResult.year}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {isEditing && (
                          <div className={`flex items-center gap-2 px-3 py-1 rounded ${
                            editCountdown <= 10 
                              ? 'bg-destructive/20 text-destructive animate-pulse' 
                              : 'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            <Timer className="w-4 h-4" />
                            <span className="font-mono font-bold">{editCountdown}s</span>
                          </div>
                        )}
                        
                        {!isEditing ? (
                          <button
                            onClick={handleStartEdit}
                            className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-bold transition-all
                              ${dangerMode 
                                ? 'bg-destructive/20 text-destructive hover:bg-destructive/30' 
                                : 'bg-primary/20 text-primary hover:bg-primary/30'
                              }`}
                          >
                            <Edit3 className="w-4 h-4" />
                            EDIT
                          </button>
                        ) : (
                          <button
                            onClick={handleSaveEdit}
                            className="flex items-center gap-1 px-3 py-1 rounded text-sm font-bold bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-all"
                          >
                            <Save className="w-4 h-4" />
                            SAVE
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Index No:</span>
                        <span className={`ml-2 font-mono ${dangerMode ? 'text-destructive' : 'text-primary'}`}>
                          {studentResult.indexNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Name:</span>
                        <span className={`ml-2 font-bold ${dangerMode ? 'text-destructive' : 'text-foreground'}`}>
                          {studentResult.name}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">School:</span>
                        <span className="ml-2 text-foreground">
                          {studentResult.school}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Mean Grade:</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedResult?.meanGrade || ''}
                            onChange={(e) => handleMeanGradeChange(e.target.value)}
                            maxLength={2}
                            className={`ml-2 w-16 px-2 py-1 font-bold text-lg rounded bg-background border
                              ${dangerMode ? 'border-destructive text-destructive' : 'border-primary text-primary'}
                              focus:outline-none text-center`}
                          />
                        ) : (
                          <span className={`ml-2 font-bold text-lg ${dangerMode ? 'text-destructive' : 'text-primary'}`}>
                            {studentResult.meanGrade}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-border pt-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-muted-foreground">
                            <th className="text-left py-1">Code</th>
                            <th className="text-left py-1">Subject</th>
                            <th className="text-center py-1">Grade</th>
                            <th className="text-center py-1">Points</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(isEditing ? editedResult : studentResult)?.subjects.map((sub: any, i: number) => (
                            <tr key={i} className="border-t border-border/50">
                              <td className="py-1 text-muted-foreground font-mono">{sub.code}</td>
                              <td className="py-1 text-foreground">{sub.name}</td>
                              <td className="py-1 text-center">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={sub.grade}
                                    onChange={(e) => handleGradeChange(i, e.target.value)}
                                    maxLength={2}
                                    className={`w-12 px-1 py-0.5 font-bold rounded bg-background border text-center
                                      ${dangerMode ? 'border-destructive text-destructive' : 'border-primary text-primary'}
                                      focus:outline-none`}
                                  />
                                ) : (
                                  <span className={`font-bold ${dangerMode ? 'text-destructive' : 'text-primary'}`}>
                                    {sub.grade}
                                  </span>
                                )}
                              </td>
                              <td className="py-1 text-center text-muted-foreground">{sub.points}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t-2 border-border font-bold">
                            <td colSpan={2} className="py-2 text-foreground">TOTAL</td>
                            <td className={`py-2 text-center ${dangerMode ? 'text-destructive' : 'text-primary'}`}>
                              {isEditing ? editedResult?.meanGrade : studentResult.meanGrade}
                            </td>
                            <td className="py-2 text-center text-foreground">{studentResult.totalPoints}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {isEditing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`mt-4 p-3 rounded text-xs ${
                          editCountdown <= 10 
                            ? 'bg-destructive/20 text-destructive border border-destructive/50' 
                            : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          <span className="font-bold">
                            {editCountdown <= 10 
                              ? 'WARNING: Session expiring soon! Save changes now!' 
                              : 'Edit session active. Changes will be locked after timeout.'}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default KNECPortal;