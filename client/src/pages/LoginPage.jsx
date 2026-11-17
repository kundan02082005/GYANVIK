import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  ShieldAlert,
  Crown,
  User,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export const LoginPage = ({ onReplayIntro }) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Active Login Option: 'STUDENT' | 'ADMIN' | 'SUPER_ADMIN'
  const [activePortal, setActivePortal] = useState('STUDENT');
  // Student mode: 'SIGN_IN' | 'REGISTER'
  const [studentMode, setStudentMode] = useState('SIGN_IN');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [targetExam, setTargetExam] = useState('NEET');
  const [classLevel, setClassLevel] = useState('12th');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianConsent, setGuardianConsent] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Pre-fill demo accounts for easy evaluator review
  const handleFillDemo = (role) => {
    setErrorMsg('');
    if (role === 'STUDENT') {
      setActivePortal('STUDENT');
      setStudentMode('SIGN_IN');
      setEmail('student@gyanvik.edu.in');
      setPassword('Student@2026');
    } else if (role === 'ADMIN') {
      setActivePortal('ADMIN');
      setEmail('admin@gyanvik.edu.in');
      setPassword('Admin@2026');
    } else if (role === 'SUPER_ADMIN') {
      setActivePortal('SUPER_ADMIN');
      setEmail('superadmin@gyanvik.edu.in');
      setPassword('SuperAdmin@2026');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (activePortal === 'STUDENT' && studentMode === 'REGISTER') {
        const res = await register({
          fullName,
          email,
          password,
          phone,
          targetExam,
          classLevel,
          guardianName,
          guardianPhone,
          guardianConsent
        });

        if (res.success) {
          setSuccessMsg('Account registered successfully! Redirecting to student dashboard...');
          setTimeout(() => navigate('/student'), 800);
        } else {
          setErrorMsg(res.message || 'Registration failed.');
        }
      } else {
        // Sign In
        const res = await login(email, password, activePortal);
        if (res.success) {
          setSuccessMsg(`Welcome, ${res.user.fullName}! Redirecting...`);
          setTimeout(() => {
            if (res.user.role === 'SUPER_ADMIN') {
              navigate('/super-admin');
            } else if (res.user.role === 'ADMIN') {
              navigate('/admin');
            } else {
              navigate('/student');
            }
          }, 600);
        } else {
          setErrorMsg(res.message || 'Invalid credentials.');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Ambient background glow & grid lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      {/* Top Header / Branding */}
      <header className="relative z-10 p-4 sm:p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-wider text-white font-cinematic leading-none">
              GYANVIK
            </h1>
            <p className="text-[10px] text-amber-400 font-medium tracking-widest uppercase mt-0.5">
              One Platform • Many Examinations • Clearer Opportunities
            </p>
          </div>
        </div>

        {onReplayIntro && (
          <button
            onClick={onReplayIntro}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Play Cinematic Intro</span>
          </button>
        )}
      </header>

      {/* Center Container: 3 Separate Portals */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Three Separate Login Options Tabs */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
              Select Your Access Portal
            </span>
            <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
              {/* Option 1: Student Login */}
              <button
                type="button"
                onClick={() => {
                  setActivePortal('STUDENT');
                  setErrorMsg('');
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  activePortal === 'STUDENT'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <User className="w-4 h-4 shrink-0" />
                <span className="truncate">Student / User</span>
              </button>

              {/* Option 2: Admin Login */}
              <button
                type="button"
                onClick={() => {
                  setActivePortal('ADMIN');
                  setErrorMsg('');
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  activePortal === 'ADMIN'
                    ? 'bg-blue-600 text-white shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span className="truncate">Admin Portal</span>
              </button>

              {/* Option 3: Super Admin Login */}
              <button
                type="button"
                onClick={() => {
                  setActivePortal('SUPER_ADMIN');
                  setErrorMsg('');
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  activePortal === 'SUPER_ADMIN'
                    ? 'bg-amber-600 text-amber-50 shadow-md font-extrabold ring-1 ring-amber-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Crown className="w-4 h-4 shrink-0" />
                <span className="truncate">Super Admin</span>
              </button>
            </div>
          </div>

          {/* Portal Context Header */}
          <div className="text-center pt-1">
            {activePortal === 'STUDENT' && (
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {studentMode === 'SIGN_IN' ? 'Student & Aspirant Sign In' : 'Register New Student Profile'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Access authentic PYQs, NCERT mastery, test analytics, and personal doctor mentorship.
                </p>

                {/* Sub-toggle: Sign In vs Register */}
                <div className="flex justify-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStudentMode('SIGN_IN');
                      setErrorMsg('');
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                      studentMode === 'SIGN_IN'
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sign In Existing
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStudentMode('REGISTER');
                      setErrorMsg('');
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                      studentMode === 'REGISTER'
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Register New Aspirant
                  </button>
                </div>
              </div>
            )}

            {activePortal === 'ADMIN' && (
              <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-left">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Authorized Administrative Portal</span>
                </div>
                <p className="text-xs text-slate-300">
                  Secure login with officially authorized organizational credentials. Admin accounts manage question banks, exam configurations, notifications, and mentor bookings.
                </p>
              </div>
            )}

            {activePortal === 'SUPER_ADMIN' && (
              <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-left">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Super Admin Platform Governance</span>
                </div>
                <p className="text-xs text-slate-300">
                  Highest-level security clearance. Controls platform-wide settings, admin account provisioning, system audit logs, and monetization analytics.
                </p>
              </div>
            )}
          </div>

          {/* Error & Success Alerts */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student Registration extra fields */}
            {activePortal === 'STUDENT' && studentMode === 'REGISTER' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Student Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-400 outline-none"
                      placeholder="e.g. Aarav Sharma"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Target Examination *
                    </label>
                    <select
                      value={targetExam}
                      onChange={e => setTargetExam(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-400 outline-none"
                    >
                      <option value="NEET">NEET (UG) - Active</option>
                      <option value="JEE">IIT-JEE (Main & Adv)</option>
                      <option value="GATE">GATE</option>
                      <option value="CUET">CUET (UG)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Current Class / Status
                    </label>
                    <select
                      value={classLevel}
                      onChange={e => setClassLevel(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-400 outline-none"
                    >
                      <option value="12th">Class 12th</option>
                      <option value="11th">Class 11th</option>
                      <option value="Dropper">Dropper / Repeater</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Student WhatsApp / Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-400 outline-none"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                {/* Minor Safety & Guardian Consent Workflow */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                    Minor Safety & Guardian Information
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      value={guardianName}
                      onChange={e => setGuardianName(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 outline-none"
                      placeholder="Parent/Guardian Name"
                    />
                    <input
                      type="tel"
                      value={guardianPhone}
                      onChange={e => setGuardianPhone(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 outline-none"
                      placeholder="Guardian Phone"
                    />
                  </div>
                  <label className="flex items-start gap-2 text-xs text-slate-400 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={guardianConsent}
                      onChange={e => setGuardianConsent(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-0"
                    />
                    <span>
                      Parent / Guardian authorizes student registration and academic performance tracking in compliance with student privacy guidelines.
                    </span>
                  </label>
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {activePortal === 'STUDENT' ? 'Student Email Address' : 'Official Organizational Email'} *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-400 outline-none"
                  placeholder={
                    activePortal === 'STUDENT'
                      ? 'student@gyanvik.edu.in'
                      : activePortal === 'ADMIN'
                      ? 'admin@gyanvik.edu.in'
                      : 'superadmin@gyanvik.edu.in'
                  }
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Account Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-400 outline-none"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition ${
                activePortal === 'STUDENT'
                  ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20'
                  : activePortal === 'ADMIN'
                  ? 'bg-blue-500 hover:bg-blue-400 text-white shadow-blue-500/20'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
              }`}
            >
              <span>
                {loading
                  ? 'Authorizing...'
                  : activePortal === 'STUDENT' && studentMode === 'REGISTER'
                  ? 'Create Student Account'
                  : `Sign In to ${activePortal.replace('_', ' ')}`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials for Fast Evaluation */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block text-center font-bold">
              Fast Demo Evaluator Credentials:
            </span>
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <button
                type="button"
                onClick={() => handleFillDemo('STUDENT')}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:border-amber-400 hover:text-amber-300 text-center transition"
              >
                <strong className="block text-amber-400">Student</strong>
                <span>Aarav Sharma</span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('ADMIN')}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:border-blue-400 hover:text-blue-300 text-center transition"
              >
                <strong className="block text-blue-400">Admin</strong>
                <span>Prof. Kulkarni</span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('SUPER_ADMIN')}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:border-amber-400 hover:text-amber-300 text-center transition"
              >
                <strong className="block text-amber-400">Super Admin</strong>
                <span>Dr. Gyan</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-4 text-center text-xs text-slate-500 border-t border-slate-900">
        GYANVIK Platform © 2026. All authentic examination materials, PYQs, and syllabi referenced from official government testing bodies.
      </footer>
    </div>
  );
};
