import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { Navbar } from '../components/Navbar';
import { NotificationTicker } from '../components/NotificationTicker';
import { ExamPatternTable } from '../components/ExamPatternTable';
import { TestPlayerModal } from '../components/TestPlayerModal';
import { MentorBookingModal } from '../components/MentorBookingModal';
import { NcertReaderModal } from '../components/NcertReaderModal';
import { SandboxPaymentModal } from '../components/SandboxPaymentModal';
import {
  Stethoscope,
  Sparkles,
  BookOpen,
  Crown,
  FileQuestion,
  Layers,
  Award,
  ArrowRight,
  Download,
  Eye,
  CheckCircle2,
  Lock,
  Search,
  Filter,
  Check,
  Zap,
  Atom,
  FlaskConical,
  Sprout,
  HeartPulse,
  Bot
} from 'lucide-react';

export const NeetPrepHub = ({ onReplayIntro }) => {
  const [examConfig, setExamConfig] = useState(null);
  const [mainPrepUnlocked, setMainPrepUnlocked] = useState(false);
  const [activeSection, setActiveSection] = useState('PYQS'); // PYQS | NCERT | PREMIUM

  // Section 1: PYQ State
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('sub-physics');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [activeTestId, setActiveTestId] = useState(null);

  // Section 2: NCERT State
  const [ncertResources, setNcertResources] = useState([]);
  const [selectedNcertResource, setSelectedNcertResource] = useState(null);

  // Section 3: Premium State
  const [shortNotes, setShortNotes] = useState([]);
  const [testSeriesList, setTestSeriesList] = useState([]);
  const [mentorModalOpen, setMentorModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState(null);

  const mainPrepRef = useRef(null);

  // Load basic curriculum
  useEffect(() => {
    const loadCurriculum = async () => {
      try {
        const [subRes, ncertRes, notesRes, testsRes] = await Promise.all([
          api.getSubjects('neet'),
          api.getNcert(),
          api.getShortNotes(),
          api.getTestSeries('neet')
        ]);
        if (subRes.success) setSubjects(subRes.subjects || []);
        if (ncertRes.success) setNcertResources(ncertRes.resources || []);
        if (notesRes.success) setShortNotes(notesRes.notes || []);
        if (testsRes.success) setTestSeriesList(testsRes.tests || []);
      } catch (err) {
        console.error('Failed to load curriculum:', err);
      }
    };
    loadCurriculum();
  }, []);

  // Fetch Questions when subject or year changes
  useEffect(() => {
    const loadQuestions = async () => {
      setLoadingQuestions(true);
      try {
        const params = {
          examSlug: 'neet',
          ...(selectedSubjectId && { subjectId: selectedSubjectId }),
          ...(selectedYear !== 'ALL' && { year: selectedYear })
        };
        const res = await api.getQuestions(params);
        if (res.success) {
          setQuestions(res.questions || []);
        }
      } catch (err) {
        console.error('Failed to load questions:', err);
      } finally {
        setLoadingQuestions(false);
      }
    };
    loadQuestions();
  }, [selectedSubjectId, selectedYear]);

  // Handle clicking "CRACK NEET WITH GYANVIK"
  const handleCrackNeetClick = () => {
    setMainPrepUnlocked(true);
    setTimeout(() => {
      mainPrepRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const getSubjectIcon = (code) => {
    switch (code) {
      case 'PHY': return Atom;
      case 'CHEM': return FlaskConical;
      case 'BOT': return Sprout;
      case 'ZOO': return HeartPulse;
      default: return BookOpen;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar onReplayIntro={onReplayIntro} />

      {/* TOP SECTION: MOTIVATIONAL QUOTE */}
      <section className="relative overflow-hidden pt-8 pb-4 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Dedicated NEET (UG) Master Hub</span>
          </div>

          {/* Motivational Quote Prominently Displayed at Top */}
          <div className="relative py-2">
            <blockquote className="text-2xl sm:text-4xl md:text-5xl font-black font-cinematic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 drop-shadow-[0_0_25px_rgba(245,158,11,0.4)]">
              "{examConfig?.motivationalQuote || "Today's hard work is tomorrow's white coat."}"
            </blockquote>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 tracking-widest uppercase font-medium">
              Every formula mastered, every NCERT diagram retained brings you closer to AIIMS.
            </p>
          </div>
        </div>
      </section>

      {/* CONTINUOUSLY SCROLLING NOTIFICATION TICKER */}
      <NotificationTicker examSlug="neet" />

      {/* NEET EXAMINATION INFORMATION & PAPER STRUCTURE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        <ExamPatternTable
          examSlug="neet"
          onConfigLoaded={(cfg) => setExamConfig(cfg)}
        />

        {/* BOTTOM CALL-TO-ACTION BUTTON: CRACK NEET WITH GYANVIK */}
        <div className="text-center pt-4 pb-6">
          <button
            onClick={handleCrackNeetClick}
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-base sm:text-lg uppercase tracking-wider shadow-2xl shadow-amber-500/30 hover:scale-[1.03] transition-all"
          >
            <Sparkles className="w-6 h-6 text-slate-950 group-hover:rotate-45 transition-transform" />
            <span>CRACK NEET WITH GYANVIK</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
          </button>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Unlock authentic Previous Year Questions, NCERT digital library, and Gyanvik Premium.
          </p>
        </div>

        {/* =========================================================================
            MAIN NEET PREPARATION DASHBOARD (THREE MAJOR SECTIONS)
            ========================================================================= */}
        <div ref={mainPrepRef} className="pt-6 border-t border-slate-800 space-y-8">
          {/* Section Navigation Tabs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              {[
                { id: 'PYQS', label: '1. PYQs (Previous Year Questions)', icon: FileQuestion },
                { id: 'NCERT', label: '2. NCERT BOOKS', icon: BookOpen },
                { id: 'PREMIUM', label: '3. GYANVIK PREMIUM', icon: Crown }
              ].map(sec => {
                const Icon = sec.icon;
                const isSelected = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-emerald-400 font-mono pr-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>NTA Pattern Active</span>
            </div>
          </div>

          {/* =====================================================================
              SECTION 1: PYQs (Previous Year Questions)
              Four Subjects: Physics, Chemistry, Botany, Zoology
              ===================================================================== */}
          {activeSection === 'PYQS' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <FileQuestion className="w-5 h-5 text-amber-400" />
                    <span>Authentic NEET Previous Year Questions (PYQs)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select a subject to solve authentic past examination questions online with live CBT navigation and explanations.
                  </p>
                </div>

                {/* Filter by Exam Year */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">Year:</span>
                  <select
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-amber-400 font-bold outline-none"
                  >
                    <option value="ALL">All Available Years</option>
                    <option value="2024">NEET 2024</option>
                    <option value="2023">NEET 2023</option>
                    <option value="2022">NEET 2022</option>
                    <option value="2021">NEET 2021</option>
                  </select>
                </div>
              </div>

              {/* 4 Subject Selector Cards: Physics, Chemistry, Botany, Zoology */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {subjects.map(sub => {
                  const Icon = getSubjectIcon(sub.code);
                  const isSelected = selectedSubjectId === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubjectId(sub.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400 shadow-lg shadow-amber-500/10'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">45 Qs • 180 M</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{sub.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{sub.description}</p>
                    </button>
                  );
                })}
              </div>

              {/* Interactive CBT Question Practice Header Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-amber-950/30 border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-xs text-slate-300">
                  Showing <strong className="text-amber-400">{questions.length}</strong> authentic PYQs in{' '}
                  <strong className="text-white">{subjects.find(s => s.id === selectedSubjectId)?.name}</strong>.
                </div>
                <button
                  onClick={() => {
                    if (testSeriesList.length > 0) setActiveTestId(testSeriesList[0].id);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition self-start sm:self-auto"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Launch Interactive CBT Mode</span>
                </button>
              </div>

              {/* Questions List with inline solution reveal */}
              {loadingQuestions ? (
                <div className="py-12 text-center text-slate-400 animate-pulse">Loading authentic questions...</div>
              ) : questions.length > 0 ? (
                <div className="space-y-4">
                  {questions.map((q, idx) => (
                    <QuestionCard key={q.id} question={q} index={idx + 1} />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800 text-xs">
                  No questions found for the selected filter.
                </div>
              )}
            </div>
          )}

          {/* =====================================================================
              SECTION 2: NCERT BOOKS LIBRARY
              Organized by subject, class, chapter and topic
              ===================================================================== */}
          {activeSection === 'NCERT' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                    <span>NCERT Textbooks & Digital Educational PDF Library</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Direct access to authorized NCERT Class 11th and 12th textbooks. Read in-app or download for offline revision.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {ncertResources.map(res => (
                  <div
                    key={res.id}
                    className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-xl"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold uppercase text-[10px]">
                          Class {res.classLevel}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">{res.fileSizeMb || 4.5} MB</span>
                      </div>

                      <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {res.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {res.chapterName}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedNcertResource(res)}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Read In-App</span>
                      </button>

                      <a
                        href={res.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition"
                        title="Download authorized PDF"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =====================================================================
              SECTION 3: GYANVIK PREMIUM
              (A) BOOK YOUR MENTOR
              (B) TEST SERIES
              (C) PYQ SOLVING
              (D) SHORT NOTES & BLUEPRINTS
              (E) AI CHATBOT (Future feature / Disabled per mentor scope)
              ===================================================================== */}
          {activeSection === 'PREMIUM' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <span>GYANVIK PREMIUM — Five High-Yield Academic Services</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Elevate your preparation with 1-on-1 AIIMS doctor guidance, grand mock tests, and high-weightage examination blueprints.
                </p>
              </div>

              {/* 5 Premium Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* (A) BOOK YOUR MENTOR */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-amber-950/20 border border-amber-500/30 flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-3">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      (A) Flagship Mentorship
                    </span>
                    <h4 className="text-lg font-bold text-white mt-1">BOOK YOUR MENTOR</h4>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      1-on-1 personal guidance from top AIIMS & MAMC MBBS doctors. Weekly video strategy calls, custom timetables, and doubt clearing.
                    </p>
                    <div className="mt-3 space-y-1 text-xs text-slate-400">
                      <div>✓ Personal Guidance & Study Planning</div>
                      <div>✓ Doubt Solving & Exam Strategies</div>
                      <div>✓ Stress & Test Anxiety Handling</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setMentorModalOpen(true)}
                    className="mt-6 w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
                  >
                    View Benefits & Book Mentor
                  </button>
                </div>

                {/* (B) TEST SERIES */}
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mb-3">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      (B) NTA Exam Simulation
                    </span>
                    <h4 className="text-lg font-bold text-white mt-1">TEST SERIES & MOCKS</h4>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Subject-wise, chapter-wise, and full-length NEET mock exams with configurable duration, negative marking, and weak-topic analytics.
                    </p>
                    <div className="mt-3 space-y-1 text-xs text-slate-400">
                      <div>✓ 180 Qs, 720 Marks Full Mocks</div>
                      <div>✓ Instant Scorecard & Percentile</div>
                      <div>✓ Detailed NCERT Solution Review</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (testSeriesList.length > 0) setActiveTestId(testSeriesList[0].id);
                    }}
                    className="mt-6 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition"
                  >
                    Launch Mock Test Series
                  </button>
                </div>

                {/* (C) PYQ SOLVING */}
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-3">
                      <Zap className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      (C) Concept Mastery
                    </span>
                    <h4 className="text-lg font-bold text-white mt-1">PYQ SOLVING DRILLS</h4>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Structured previous-year question practice with detailed explanations, performance analysis, and progress tracking.
                    </p>
                    <div className="mt-3 space-y-1 text-xs text-slate-400">
                      <div>✓ 10-Year Trend Analysis</div>
                      <div>✓ High-Yield Concept Tagging</div>
                      <div>✓ Speed & Accuracy Metrics</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSection('PYQS')}
                    className="mt-6 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition"
                  >
                    Open PYQ Practice Drills
                  </button>
                </div>

                {/* (D) SHORT NOTES & BLUEPRINTS */}
                <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400 mb-3">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                      (D) High-Yield Revision
                    </span>
                    <h4 className="text-lg font-bold text-white mt-1">SHORT NOTES & BLUEPRINTS</h4>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Downloadable subject-wise short notes, chapter summaries, formula pocket sheets, and NEET weightage blueprints.
                    </p>
                    <div className="mt-3 space-y-1 text-xs text-slate-400">
                      {shortNotes.slice(0, 2).map(n => (
                        <div key={n.id} className="truncate">📄 {n.title}</div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPlanForPayment({
                        title: 'Short Notes & High-Weightage Blueprints Pack',
                        tier: 'PREMIUM_NOTES',
                        amount: 499
                      });
                      setPaymentModalOpen(true);
                    }}
                    className="mt-6 w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition"
                  >
                    Access All Short Notes (₹499)
                  </button>
                </div>

                {/* (E) AI CHATBOT (Future Feature / Scope Locked) */}
                <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800/60 opacity-80 flex flex-col justify-between shadow-inner relative overflow-hidden">
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    Scope Locked
                  </div>
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-500 flex items-center justify-center mb-3">
                      <Bot className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      (E) Future Exploration
                    </span>
                    <h4 className="text-lg font-bold text-slate-300 mt-1">AI CHATBOT</h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      This section is treated as a future feature and remains disabled until explicitly approved for implementation, per the initial project scope defined in the mentor's PDF.
                    </p>
                  </div>
                  <button
                    disabled
                    className="mt-6 w-full py-2.5 rounded-xl bg-slate-800/80 text-slate-500 font-bold text-xs uppercase tracking-wider cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Temporarily Disabled (Per PDF Scope)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      {activeTestId && (
        <TestPlayerModal
          testId={activeTestId}
          testTitle={testSeriesList.find(t => t.id === activeTestId)?.title}
          onClose={() => setActiveTestId(null)}
        />
      )}

      <MentorBookingModal
        isOpen={mentorModalOpen}
        onClose={() => setMentorModalOpen(false)}
      />

      {selectedNcertResource && (
        <NcertReaderModal
          resource={selectedNcertResource}
          onClose={() => setSelectedNcertResource(null)}
        />
      )}

      <SandboxPaymentModal
        isOpen={paymentModalOpen}
        plan={selectedPlanForPayment}
        onClose={() => setPaymentModalOpen(false)}
      />
    </div>
  );
};

// Inline helper for Question Cards in PYQs
const QuestionCard = ({ question, index }) => {
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between text-xs">
        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 font-mono font-semibold">
          NEET {question.year} • {question.topic}
        </span>
        <span className="text-slate-400 font-mono text-[11px]">Difficulty: {question.difficulty}</span>
      </div>

      <div className="text-sm font-medium text-white leading-relaxed">
        <span className="font-bold text-amber-400 mr-2">Q{index}.</span>
        {question.questionText}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {question.options?.map(opt => {
          const isSelected = selectedOpt === opt.id;
          const isCorrect = revealed && opt.id === question.correctOption;
          const isWrong = revealed && isSelected && !isCorrect;

          return (
            <button
              key={opt.id}
              onClick={() => setSelectedOpt(opt.id)}
              className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center gap-2.5 transition ${
                isCorrect
                  ? 'bg-emerald-950/60 border-emerald-400 text-white font-bold'
                  : isWrong
                  ? 'bg-rose-950/60 border-rose-400 text-white'
                  : isSelected
                  ? 'bg-amber-500/20 border-amber-400 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/70'
              }`}
            >
              <span className="font-mono font-bold">({opt.id})</span>
              <span>{opt.text}</span>
            </button>
          );
        })}
      </div>

      <div className="pt-2 flex items-center justify-between">
        <button
          onClick={() => setRevealed(!revealed)}
          className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
        >
          <span>{revealed ? 'Hide Explanation' : 'View Verified NTA Explanation'}</span>
        </button>
      </div>

      {revealed && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 animate-fade-in">
          <div className="font-bold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Correct Option: ({question.correctOption})</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};
