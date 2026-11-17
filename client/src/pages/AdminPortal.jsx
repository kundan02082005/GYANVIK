import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import {
  ShieldAlert,
  Bell,
  FileQuestion,
  BookOpen,
  Layers,
  Award,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
  Save,
  Search,
  DollarSign,
  FileText
} from 'lucide-react';

export const AdminPortal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('STATS'); // STATS | EXAM_CONFIG | NOTIFICATIONS | QUESTIONS | NCERT | TESTS | MENTORS | STUDENTS

  // States
  const [stats, setStats] = useState(null);
  const [examConfig, setExamConfig] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [ncertList, setNcertList] = useState([]);
  const [testList, setTestList] = useState([]);
  const [mentorList, setMentorList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newNotifTitle, setNewNotifTitle] = useState('');
  const [newNotifContent, setNewNotifContent] = useState('');
  const [newNotifSource, setNewNotifSource] = useState('National Testing Agency (NTA)');
  const [newNotifUrl, setNewNotifUrl] = useState('https://exams.nta.ac.in/NEET/');
  const [newNotifUrgency, setNewNotifUrgency] = useState('INFO');

  // New Question form
  const [qSubjectId, setQSubjectId] = useState('sub-physics');
  const [qYear, setQYear] = useState(2024);
  const [qTopic, setQTopic] = useState('');
  const [qDifficulty, setQDifficulty] = useState('MEDIUM');
  const [qText, setQText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [qCorrectOpt, setQCorrectOpt] = useState('A');
  const [qExplanation, setQExplanation] = useState('');

  const fetchAdminData = async () => {
    try {
      const [
        statsRes,
        configRes,
        notifRes,
        subRes,
        qRes,
        ncertRes,
        testsRes,
        mentorsRes,
        bookingsRes,
        studentsRes
      ] = await Promise.all([
        api.getPlatformStats(),
        api.getExamConfig('neet'),
        api.getNotifications('neet'),
        api.getSubjects('neet'),
        api.getQuestions({ examSlug: 'neet' }),
        api.getNcert(),
        api.getTestSeries('neet'),
        api.getMentors(),
        api.getAllBookings(),
        api.getAllStudents()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (configRes.success) setExamConfig(configRes.config);
      if (notifRes.success) setNotifications(notifRes.notifications || []);
      if (subRes.success) setSubjects(subRes.subjects || []);
      if (qRes.success) setQuestions(qRes.questions || []);
      if (ncertRes.success) setNcertList(ncertRes.resources || []);
      if (testsRes.success) setTestList(testsRes.tests || []);
      if (mentorsRes.success) setMentorList(mentorsRes.mentors || []);
      if (bookingsRes.success) setBookingsList(bookingsRes.bookings || []);
      if (studentsRes.success) setStudentList(studentsRes.students || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Save updated NEET exam config live
  const handleSaveExamConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await api.updateExamConfig('neet', examConfig);
      if (res.success) {
        alert('Examination structure & parameters updated live in database!');
      }
    } catch {
      alert('Failed to update exam configuration.');
    }
  };

  // Publish notification
  const handleCreateNotification = async (e) => {
    e.preventDefault();
    if (!newNotifTitle || !newNotifContent) return;
    try {
      const res = await api.createNotification({
        title: newNotifTitle,
        content: newNotifContent,
        examSlug: 'neet',
        sourceName: newNotifSource,
        sourceUrl: newNotifUrl,
        isVerified: true,
        isTicker: true,
        urgencyLevel: newNotifUrgency
      });
      if (res.success) {
        setNotifications([res.notification, ...notifications]);
        setNewNotifTitle('');
        setNewNotifContent('');
        alert('Official notification published to live ticker!');
      }
    } catch {
      alert('Failed to publish notification.');
    }
  };

  const handleDeleteNotification = async (id) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;
    try {
      const res = await api.deleteNotification(id);
      if (res.success) {
        setNotifications(notifications.filter(n => n.id !== id));
      }
    } catch {
      alert('Failed to delete.');
    }
  };

  // Add Question to bank
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!qText || !optA || !optB || !optC || !optD) {
      alert('Please fill out question text and all 4 options.');
      return;
    }
    try {
      const res = await api.createQuestion({
        subjectId: qSubjectId,
        examSlug: 'neet',
        year: parseInt(qYear, 10),
        topic: qTopic || 'General Chapter',
        difficulty: qDifficulty,
        questionText: qText,
        options: [
          { id: 'A', text: optA },
          { id: 'B', text: optB },
          { id: 'C', text: optC },
          { id: 'D', text: optD }
        ],
        correctOption: qCorrectOpt,
        explanation: qExplanation
      });
      if (res.success) {
        setQuestions([res.question, ...questions]);
        setQText('');
        setOptA('');
        setOptB('');
        setOptC('');
        setOptD('');
        setQExplanation('');
        alert('Question added to authentic question bank successfully!');
      }
    } catch {
      alert('Failed to add question.');
    }
  };

  // Assign Mentor to Booking
  const handleAssignMentor = async (bookingId, mentorId) => {
    try {
      const res = await api.updateBooking(bookingId, {
        status: 'ASSIGNED',
        mentorId,
        adminNotes: 'Assigned by Academic Administration.'
      });
      if (res.success) {
        fetchAdminData();
        alert('Mentor assigned and student updated successfully!');
      }
    } catch {
      alert('Failed to assign mentor.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Admin Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Administrative Operations Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Gyanvik Administration Portal
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Logged in as: <strong className="text-amber-400">{user?.fullName}</strong> ({user?.email}) • Authorized Academic Control
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Operational Mode: Real-time DB Mutator</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-1 text-xs font-bold uppercase tracking-wider">
          {[
            { id: 'STATS', label: 'Overview Metrics', icon: ShieldAlert },
            { id: 'EXAM_CONFIG', label: 'NEET Exam Config & Pattern', icon: Settings },
            { id: 'NOTIFICATIONS', label: 'Ticker & Announcements', icon: Bell },
            { id: 'QUESTIONS', label: 'Question Bank (PYQs)', icon: FileQuestion },
            { id: 'MENTORS', label: 'Mentor Bookings & Assignments', icon: Award },
            { id: 'STUDENTS', label: 'Student Directory', icon: Users },
            { id: 'TESTS', label: 'Test Series Manager', icon: Layers }
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

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'STATS' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Total Enrolled Students</span>
                <div className="text-3xl font-black text-white mt-1">{stats?.totalStudents || 0}</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Questions in Bank</span>
                <div className="text-3xl font-black text-amber-400 mt-1">{stats?.totalQuestions || 0}</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Mentor Bookings</span>
                <div className="text-3xl font-black text-emerald-400 mt-1">{stats?.totalBookings || 0}</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Platform Revenue (Sandbox)</span>
                <div className="text-3xl font-black text-cyan-400 mt-1">₹{stats?.totalRevenueInr || 0}</div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2">
              <h3 className="text-base font-bold text-white">Administrative Scope</h3>
              <p>
                As an authorized Administrator, all updates made in this panel are recorded into the database engine. Changes to the NEET Paper Structure or Motivational Quotes appear dynamically for all students without requiring code deployments.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: EXAM CONFIG & PATTERN MANAGER (NO CODE MODIFICATION NEEDED) */}
        {activeTab === 'EXAM_CONFIG' && examConfig && (
          <form onSubmit={handleSaveExamConfig} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">Dynamic NEET Examination Configuration</h3>
                <p className="text-xs text-slate-400">Modify exam pattern parameters in real-time without modifying code.</p>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                <Save className="w-4 h-4" />
                <span>Save Live Config</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Motivational Quote (Top Header)</label>
                <input
                  type="text"
                  value={examConfig.motivationalQuote}
                  onChange={e => setExamConfig({ ...examConfig, motivationalQuote: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Conducting Authority</label>
                <input
                  type="text"
                  value={examConfig.conductingAuthority}
                  onChange={e => setExamConfig({ ...examConfig, conductingAuthority: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  value={examConfig.durationMinutes}
                  onChange={e => setExamConfig({ ...examConfig, durationMinutes: parseInt(e.target.value, 10) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Total Marks</label>
                <input
                  type="number"
                  value={examConfig.totalMarks}
                  onChange={e => setExamConfig({ ...examConfig, totalMarks: parseInt(e.target.value, 10) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-sm font-bold text-white">Paper Structure Table (Live Subjects & Marks)</h4>
              {examConfig.paperStructure?.map((item, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block">Subject / Section</span>
                    <input
                      type="text"
                      value={item.subject}
                      onChange={e => {
                        const copy = [...examConfig.paperStructure];
                        copy[idx].subject = e.target.value;
                        setExamConfig({ ...examConfig, paperStructure: copy });
                      }}
                      className="w-full bg-slate-900 px-2.5 py-1.5 rounded border border-slate-700 text-white mt-1"
                    />
                  </div>
                  <div>
                    <span className="text-slate-500 block">Questions</span>
                    <input
                      type="number"
                      value={item.questions}
                      onChange={e => {
                        const copy = [...examConfig.paperStructure];
                        copy[idx].questions = parseInt(e.target.value, 10);
                        setExamConfig({ ...examConfig, paperStructure: copy });
                      }}
                      className="w-full bg-slate-900 px-2.5 py-1.5 rounded border border-slate-700 text-white mt-1"
                    />
                  </div>
                  <div>
                    <span className="text-slate-500 block">Marks</span>
                    <input
                      type="number"
                      value={item.marks}
                      onChange={e => {
                        const copy = [...examConfig.paperStructure];
                        copy[idx].marks = parseInt(e.target.value, 10);
                        setExamConfig({ ...examConfig, paperStructure: copy });
                      }}
                      className="w-full bg-slate-900 px-2.5 py-1.5 rounded border border-slate-700 text-white mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </form>
        )}

        {/* TAB 3: TICKER & NOTIFICATIONS MANAGER */}
        {activeTab === 'NOTIFICATIONS' && (
          <div className="space-y-6 animate-fade-in">
            {/* Publish Form */}
            <form onSubmit={handleCreateNotification} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <h3 className="text-base font-bold text-white">Publish New Official NTA Notification to Ticker</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-slate-300 font-semibold block mb-1">Headline / Announcement Title *</label>
                  <input
                    type="text"
                    required
                    value={newNotifTitle}
                    onChange={e => setNewNotifTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-400"
                    placeholder="e.g. NTA Releases NEET UG City Intimation Slip Link"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Source Name</label>
                  <input
                    type="text"
                    value={newNotifSource}
                    onChange={e => setNewNotifSource(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Official NTA Portal URL</label>
                  <input
                    type="url"
                    value={newNotifUrl}
                    onChange={e => setNewNotifUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-slate-300 font-semibold block mb-1">Detailed Content</label>
                  <textarea
                    rows={2}
                    required
                    value={newNotifContent}
                    onChange={e => setNewNotifContent(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-400"
                    placeholder="Enter official press release text..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider"
              >
                Publish to Scrolling Ticker
              </button>
            </form>

            {/* List of active notifications */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Active Ticker Notifications</h4>
              {notifications.map(n => (
                <div key={n.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{n.title}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Verified</span>
                    </div>
                    <p className="text-slate-400 mt-0.5">{n.content}</p>
                    <span className="text-slate-500 text-[10px]">Source: {n.sourceName}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteNotification(n.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 transition"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: QUESTION BANK & PYQS */}
        {activeTab === 'QUESTIONS' && (
          <div className="space-y-6 animate-fade-in">
            {/* Create Question Form */}
            <form onSubmit={handleAddQuestion} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <h3 className="text-base font-bold text-white">Add Authentic MCQ / PYQ to Question Bank</h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Subject</label>
                  <select
                    value={qSubjectId}
                    onChange={e => setQSubjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Exam Year</label>
                  <input
                    type="number"
                    value={qYear}
                    onChange={e => setQYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Topic Name</label>
                  <input
                    type="text"
                    value={qTopic}
                    onChange={e => setQTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                    placeholder="e.g. Current Electricity"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Difficulty</label>
                  <select
                    value={qDifficulty}
                    onChange={e => setQDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                  >
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Question Text *</label>
                <textarea
                  rows={2}
                  required
                  value={qText}
                  onChange={e => setQText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                  placeholder="Enter full MCQ question text..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Option (A)"
                  required
                  value={optA}
                  onChange={e => setOptA(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                />
                <input
                  type="text"
                  placeholder="Option (B)"
                  required
                  value={optB}
                  onChange={e => setOptB(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                />
                <input
                  type="text"
                  placeholder="Option (C)"
                  required
                  value={optC}
                  onChange={e => setOptC(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                />
                <input
                  type="text"
                  placeholder="Option (D)"
                  required
                  value={optD}
                  onChange={e => setOptD(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Correct Answer</label>
                  <select
                    value={qCorrectOpt}
                    onChange={e => setQCorrectOpt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">NCERT Explanation</label>
                  <input
                    type="text"
                    value={qExplanation}
                    onChange={e => setQExplanation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                    placeholder="Step-by-step formula and solution"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider"
              >
                Save Question to Repository
              </button>
            </form>

            {/* Questions count */}
            <div className="text-xs text-slate-400">
              Total questions stored in active question bank: <strong className="text-white">{questions.length}</strong>
            </div>
          </div>
        )}

        {/* TAB 5: MENTOR BOOKINGS & ASSIGNMENTS */}
        {activeTab === 'MENTORS' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-base font-bold text-white">Student Mentorship Bookings & Doctor Assignment</h3>

            <div className="space-y-4">
              {bookingsList.map(b => (
                <div key={b.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-800">
                    <div>
                      <span className="font-bold text-white text-sm">
                        {b.student ? b.student.fullName : 'Registered Student'} ({b.studentContactPhone})
                      </span>
                      <div className="text-slate-400 mt-0.5">
                        Track: <strong className="text-amber-400">{b.examGoal}</strong> • Preferred: {b.preferredSubjects}
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                      b.status === 'ASSIGNED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                    <div>
                      <span className="text-slate-500">Currently Assigned Doctor:</span>
                      <div className="text-white font-semibold mt-0.5">
                        {b.mentor ? `${b.mentor.fullName} (${b.mentor.medicalCollege})` : 'None Assigned Yet'}
                      </div>
                    </div>

                    {/* Mentor selector to assign */}
                    <div className="flex items-center gap-2">
                      <select
                        id={`select-mentor-${b.id}`}
                        defaultValue={b.mentorId || ''}
                        className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs outline-none"
                      >
                        <option value="">Select Doctor / Mentor...</option>
                        {mentorList.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.fullName} - {m.medicalCollege} (AIR {m.neetAirRank})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          const sel = document.getElementById(`select-mentor-${b.id}`);
                          if (sel?.value) handleAssignMentor(b.id, sel.value);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                      >
                        Assign Mentor
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: STUDENT DIRECTORY */}
        {activeTab === 'STUDENTS' && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-white">Registered Student Accounts ({studentList.length})</h3>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase font-semibold">
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Target Track</th>
                    <th className="py-3 px-4">Tests Attempted</th>
                    <th className="py-3 px-4">Avg Accuracy</th>
                    <th className="py-3 px-4">Guardian Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {studentList.map(s => (
                    <tr key={s.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-white">{s.fullName}</td>
                      <td className="py-3 px-4 font-mono">{s.email}</td>
                      <td className="py-3 px-4 text-amber-400">{s.targetExam || 'NEET'}</td>
                      <td className="py-3 px-4 font-bold">{s.attemptsCount}</td>
                      <td className="py-3 px-4 text-emerald-400">{s.avgAccuracy}%</td>
                      <td className="py-3 px-4 text-slate-400">{s.guardianPhone || 'On File'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
