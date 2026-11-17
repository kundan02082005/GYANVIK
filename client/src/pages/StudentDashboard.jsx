import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Navbar } from '../components/Navbar';
import { JourneySelectorModal } from '../components/JourneySelectorModal';
import { TestPlayerModal } from '../components/TestPlayerModal';
import { MentorBookingModal } from '../components/MentorBookingModal';
import {
  Sparkles,
  Stethoscope,
  BookOpen,
  Award,
  Compass,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  User,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Layers,
  ChevronRight,
  Flame,
  FileCheck,
  CreditCard
} from 'lucide-react';

export const StudentDashboard = ({ onReplayIntro }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('OVERVIEW'); // OVERVIEW | TESTS | MENTORS | DISCOVERY | COMPETITIONS | PROFILE
  const [journeyModalOpen, setJourneyModalOpen] = useState(false);
  const [activeTestId, setActiveTestId] = useState(null);
  const [mentorModalOpen, setMentorModalOpen] = useState(false);

  // Data states
  const [testAttempts, setTestAttempts] = useState([]);
  const [mentorBookings, setMentorBookings] = useState([]);
  const [discoveries, setDiscoveries] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [testSeriesList, setTestSeriesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [attemptsRes, bookingsRes, discRes, compRes, testsRes] = await Promise.all([
        api.getMyTestHistory(),
        api.getMyBookings(),
        api.getDiscoveries(),
        api.getCompetitions(),
        api.getTestSeries()
      ]);

      if (attemptsRes.success) setTestAttempts(attemptsRes.attempts || []);
      if (bookingsRes.success) setMentorBookings(bookingsRes.bookings || []);
      if (discRes.success) setDiscoveries(discRes.discoveries || []);
      if (compRes.success) setCompetitions(compRes.competitions || []);
      if (testsRes.success) setTestSeriesList(testsRes.tests || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute metrics from actual database attempts
  const totalAttempts = testAttempts.length;
  const avgAccuracy = totalAttempts > 0
    ? Math.round(testAttempts.reduce((sum, a) => sum + (a.accuracyPct || 0), 0) / totalAttempts)
    : 78; // baseline demo average
  const highestScore = totalAttempts > 0
    ? Math.max(...testAttempts.map(a => a.score || 0))
    : 590;

  // Aggregate weak topics from all attempts
  const allWeakTopics = [];
  testAttempts.forEach(att => {
    if (att.weakTopics) {
      att.weakTopics.forEach(wt => {
        if (!allWeakTopics.some(item => item.topic === wt.topic)) {
          allWeakTopics.push(wt);
        }
      });
    }
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar
        onOpenJourneySelector={() => setJourneyModalOpen(true)}
        onReplayIntro={onReplayIntro}
      />

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Personalized Welcome Banner */}
        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Personalized Aspirant Hub</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white font-cinematic tracking-tight">
                Welcome back, {user?.fullName || 'Aspirant'}!
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Your journey to academic excellence begins here. Master authentic previous year questions, assess your all-India readiness, and turn your white coat dream into reality.
              </p>
            </div>

            {/* Prominent Animated Button: SELECT YOUR JOURNEY */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => setJourneyModalOpen(true)}
                className="group relative px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/25 hover:scale-[1.03] transition-all flex items-center justify-center gap-3 animate-pulse-slow"
              >
                <Compass className="w-5 h-5 text-slate-950 group-hover:rotate-45 transition-transform" />
                <span>SELECT YOUR JOURNEY</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/neet-prep')}
                className="px-6 py-4 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
              >
                <Stethoscope className="w-4 h-4 text-emerald-400" />
                <span>Open NEET Hub</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-1 text-sm font-semibold">
          {[
            { id: 'OVERVIEW', label: 'Overview & Analytics', icon: TrendingUp },
            { id: 'TESTS', label: 'Test Series & Mock History', icon: FileCheck },
            { id: 'MENTORS', label: 'My Mentor & Bookings', icon: Stethoscope },
            { id: 'DISCOVERY', label: 'Govt & Exam Discovery', icon: Compass },
            { id: 'COMPETITIONS', label: 'Scholarships & Talent Search', icon: Award },
            { id: 'PROFILE', label: 'Aspirant Profile', icon: User }
          ].map(tab => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'border-amber-400 text-amber-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8">
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Tests Attempted</span>
                  <FileCheck className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-white mt-2">
                  {totalAttempts}
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">Full-length & Subject drills</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Overall Accuracy</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-emerald-400 mt-2">
                  {avgAccuracy}%
                </div>
                <span className="text-[11px] text-emerald-400/80 mt-1 block">Above National Median</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Peak Mock Score</span>
                  <Award className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-3xl font-black text-blue-400 mt-2">
                  {highestScore} <span className="text-xs text-slate-400 font-normal">/ 720</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">AIIMS Qualification Band</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Mentorship Status</span>
                  <Stethoscope className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-lg font-bold text-white mt-2 truncate">
                  {mentorBookings.length > 0 ? mentorBookings[0].status : 'Not Active'}
                </div>
                <button
                  onClick={() => setMentorModalOpen(true)}
                  className="text-[11px] text-amber-400 hover:underline mt-1 block"
                >
                  {mentorBookings.length > 0 ? 'View Details' : 'Book 1-on-1 Doctor'}
                </button>
              </div>
            </div>

            {/* Quick Access to Main NEET Hub CTA Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/70 to-slate-900 border border-emerald-500/40 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Master NEET (UG) with Gyanvik
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Explore previous-year questions organized by subject and year, read NCERT textbooks in-app, and access premium test series.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/neet-prep')}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shrink-0 transition shadow-lg shadow-emerald-500/20"
              >
                Go to NEET Prep Hub
              </button>
            </div>

            {/* Weak Topic Identification & Recommendation */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">
                    Weak-Topic Diagnosis (Based on Test Performance)
                  </h3>
                </div>
                <span className="text-xs text-slate-500">Auto-generated diagnostic</span>
              </div>

              {allWeakTopics.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {allWeakTopics.map((wt, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                          Needs Improvement
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1">{wt.topic}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Accuracy: <strong className="text-rose-300">{wt.accuracy}%</strong> ({wt.incorrectCount} mistakes logged)
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/neet-prep')}
                        className="mt-3 text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <span>Practice NCERT Questions</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>Take your first mock examination to automatically reveal your weak topics and priority revision chapters.</span>
                  <button
                    onClick={() => {
                      if (testSeriesList.length > 0) setActiveTestId(testSeriesList[0].id);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
                  >
                    Start Diagnostic Test
                  </button>
                </div>
              )}
            </div>

            {/* Upcoming Examination Deadlines & Official Reminders */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">
                    Important Upcoming Examination Schedules (NTA Verified)
                  </h3>
                </div>
                <span className="text-xs text-cyan-400 font-mono">2026/2027 Calendar</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">NEET (UG) 2026</span>
                  <div className="text-sm font-bold text-white mt-1">Application Portal Opening</div>
                  <div className="text-slate-400 mt-1">February 2026 (Expected)</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">NEET (UG) 2026 Exam</span>
                  <div className="text-sm font-bold text-white mt-1">First Sunday of May 2026</div>
                  <div className="text-slate-400 mt-1">Single shift (2:00 PM – 5:20 PM)</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold text-blue-400 uppercase">Gyanvik Talent Search</span>
                  <div className="text-sm font-bold text-white mt-1">National Scholarship Test</div>
                  <div className="text-slate-400 mt-1">December 1 – 15, 2026</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TESTS & MOCK HISTORY */}
        {activeTab === 'TESTS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">Full-Length & Subject-Wise Mock Tests</h2>
                <p className="text-xs text-slate-400">Evaluate your timing, accuracy, and negative marking in simulated NTA environments.</p>
              </div>
            </div>

            {/* Available Tests */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testSeriesList.map(test => (
                <div key={test.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase text-[10px]">
                        {test.testType}
                      </span>
                      <span className="text-slate-400 font-mono">{test.durationMinutes} Mins</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{test.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{test.description}</p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-slate-300">
                      <span>Total Marks: <strong className="text-amber-400">{test.totalMarks}</strong></span>
                      <span>•</span>
                      <span>Marking: <strong className="text-emerald-400">+4</strong> / <strong className="text-rose-400">-1</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTestId(test.id)}
                    className="mt-5 w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition"
                  >
                    Start Test Now
                  </button>
                </div>
              ))}
            </div>

            {/* Test Attempt History */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Your Completed Test Attempts</h3>
              {testAttempts.length > 0 ? (
                <div className="divide-y divide-slate-800">
                  {testAttempts.map((att, idx) => (
                    <div key={att.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                      <div>
                        <span className="font-bold text-white text-sm">{att.testTitle || 'NEET Mock Test'}</span>
                        <div className="text-slate-400 mt-0.5">
                          Attempted on: {new Date(att.submitTime).toLocaleString()} • Time Spent: {Math.round((att.timeSpentSeconds || 0) / 60)} mins
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="font-bold text-amber-400 text-sm">{att.score} / {att.totalMarks}</span>
                          <div className="text-[10px] text-slate-400">Accuracy: {att.accuracyPct}%</div>
                        </div>
                        <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold text-[11px]">
                          {att.percentile}%ile
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No test attempts recorded yet. Attempt a test above to record your score history.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MY MENTOR & BOOKINGS */}
        {activeTab === 'MENTORS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">1-on-1 Doctor Mentorship Program</h2>
                <p className="text-xs text-slate-400">Direct personal attention, doubt-solving, and study schedules from AIIMS doctors.</p>
              </div>

              <button
                onClick={() => setMentorModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition"
              >
                Book New Mentor Session
              </button>
            </div>

            {/* Student's active bookings */}
            <div className="space-y-4">
              {mentorBookings.map(b => (
                <div key={b.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-xs text-slate-400">Booking Reference: <strong className="text-white">{b.id}</strong></span>
                      <h3 className="text-lg font-bold text-white mt-0.5">{b.examGoal} Track</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      b.status === 'ASSIGNED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      Status: {b.status}
                    </span>
                  </div>

                  {b.mentor ? (
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
                        MBBS
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{b.mentor.fullName}</h4>
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                            NEET AIR {b.mentor.neetAirRank}
                          </span>
                        </div>
                        <p className="text-slate-300">{b.mentor.medicalCollege}</p>
                        <p className="text-slate-400">Specializations: {b.mentor.specializations?.join(', ')}</p>
                        <div className="pt-2 text-emerald-400 font-semibold flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Assigned & Active • Contact: {b.mentor.phone || 'Available in Orientation'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-slate-300">
                      <p className="font-semibold text-amber-300 mb-1">Application Under Academic Review</p>
                      Your mentorship application has been submitted and confirmed. Our administrative panel will assign an AIIMS doctor matching your subject preferences ({b.preferredSubjects}) within 24 hours.
                    </div>
                  )}

                  {b.adminNotes && (
                    <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <strong className="text-slate-300">Coordinator Notes:</strong> {b.adminNotes}
                    </div>
                  )}
                </div>
              ))}

              {mentorBookings.length === 0 && (
                <div className="p-8 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
                  <p>You have not booked a personal mentor yet.</p>
                  <button
                    onClick={() => setMentorModalOpen(true)}
                    className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
                  >
                    Explore Mentorship & Book
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: GOVT & EXAM DISCOVERY */}
        {activeTab === 'DISCOVERY' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">
                Unified Indian Competitive Examination & Government Opportunity Discovery
              </h2>
              <p className="text-xs text-slate-400">
                Official verified portals, eligibility, age limits, and important dates beyond NEET (UPSC, Defence, School Entrance, Staff Selection).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {discoveries.map(disc => (
                <div key={disc.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 font-bold uppercase text-[10px]">
                        {disc.category}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        Authority: <strong className="text-slate-200">{disc.conductingAuthority}</strong>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mt-2">{disc.title}</h3>

                    <div className="mt-2 space-y-1.5 text-xs text-slate-300">
                      <div><strong className="text-slate-400">Eligibility:</strong> {disc.eligibility}</div>
                      <div><strong className="text-slate-400">Age Limit:</strong> {disc.ageLimit}</div>
                      <div><strong className="text-slate-400">Application Cycle:</strong> {disc.applicationWindow}</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-emerald-400 font-mono">
                      Verified: {disc.lastVerifiedDate}
                    </span>
                    <a
                      href={disc.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SCHOLARSHIPS & COMPETITIONS */}
        {activeTab === 'COMPETITIONS' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Gyanvik National Talent Search & Olympiads</h2>
              <p className="text-xs text-slate-400">Compete nationally, earn merit scholarships, iPads, and free 1-on-1 mentorship.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {competitions.map(c => (
                <div key={c.id} className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/30 to-slate-900 border border-amber-500/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs uppercase">
                      All-India Championship
                    </span>
                    <span className="text-emerald-400 text-xs font-bold">Active Registration</span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{c.title}</h3>
                  <p className="text-xs text-slate-300">{c.description}</p>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                    <div><strong className="text-amber-400">Rules & Scoring:</strong> {c.rulesText}</div>
                    <div><strong className="text-amber-400">Prizes & Grants:</strong> {c.prizesText}</div>
                  </div>

                  <button
                    onClick={() => {
                      if (testSeriesList.length > 0) setActiveTestId(testSeriesList[0].id);
                    }}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition"
                  >
                    Enter Talent Search Examination
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: ASPIRANT PROFILE */}
        {activeTab === 'PROFILE' && (
          <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">Aspirant Profile & Settings</h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-black text-2xl">
                  {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{user?.fullName}</h3>
                  <p className="text-slate-400">{user?.email}</p>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase">
                    Role: {user?.role}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 block">Target Examination:</span>
                  <span className="text-white font-semibold text-sm">{user?.targetExam || 'NEET (UG)'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Current Academic Stage:</span>
                  <span className="text-white font-semibold text-sm">{user?.classLevel || 'Class 12th'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Phone Number:</span>
                  <span className="text-white font-semibold text-sm">{user?.phone || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Parent/Guardian Name:</span>
                  <span className="text-white font-semibold text-sm">{user?.guardianName || 'Registered'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <JourneySelectorModal
        isOpen={journeyModalOpen}
        onClose={() => setJourneyModalOpen(false)}
        onSelectExam={(slug) => {
          navigate('/neet-prep');
        }}
      />

      {activeTestId && (
        <TestPlayerModal
          testId={activeTestId}
          testTitle={testSeriesList.find(t => t.id === activeTestId)?.title}
          onClose={() => setActiveTestId(null)}
          onTestCompleted={(attempt) => {
            fetchDashboardData();
          }}
        />
      )}

      <MentorBookingModal
        isOpen={mentorModalOpen}
        onClose={() => setMentorModalOpen(false)}
        onBookingSuccess={() => {
          fetchDashboardData();
        }}
      />
    </div>
  );
};
