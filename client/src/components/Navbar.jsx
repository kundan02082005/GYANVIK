import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Sparkles,
  User,
  LogOut,
  ShieldAlert,
  Crown,
  BookOpen,
  Award,
  Compass,
  Menu,
  X,
  Stethoscope
} from 'lucide-react';

export const Navbar = ({ onOpenJourneySelector, onReplayIntro }) => {
  const { user, logout, isStudent, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link to={user ? (isStudent ? '/student' : isAdmin ? '/admin' : '/login') : '/login'} className="flex items-center gap-2 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6 text-slate-950" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-wider text-white font-cinematic">
                  GYANVIK
                </span>
                <span className="text-[10px] tracking-widest text-amber-400/90 font-medium hidden sm:inline uppercase">
                  One Platform • Clearer Opportunities
                </span>
              </div>
            </Link>

            {/* Target Exam Indicator (if student) */}
            {isStudent && (
              <button
                onClick={onOpenJourneySelector}
                className="hidden md:flex items-center gap-1.5 ml-4 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/60 transition group"
                title="Click to switch or explore other examinations"
              >
                <Stethoscope className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Track: {user?.targetExam || 'NEET (UG)'}</span>
                <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.2 rounded text-emerald-200 ml-1 group-hover:bg-emerald-400 group-hover:text-slate-950 transition">
                  Change
                </span>
              </button>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {isStudent && (
              <>
                <Link to="/student" className="text-slate-300 hover:text-amber-400 transition flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/neet-prep" className="text-slate-300 hover:text-emerald-400 transition flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                  <span>NEET Master Hub</span>
                </Link>
                <Link to="/discovery" className="text-slate-300 hover:text-cyan-400 transition flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>Exam Discovery</span>
                </Link>
                <Link to="/competitions" className="text-slate-300 hover:text-amber-400 transition flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Scholarship & Olympiad</span>
                </Link>
              </>
            )}

            {isAdmin && (
              <Link to="/admin" className="text-slate-300 hover:text-amber-400 transition flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Admin Portal</span>
              </Link>
            )}

            {isSuperAdmin && (
              <Link to="/super-admin" className="text-amber-300 hover:text-amber-200 transition flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Super Admin</span>
              </Link>
            )}
          </nav>

          {/* User Profile / Actions */}
          <div className="flex items-center gap-3">
            {onReplayIntro && (
              <button
                onClick={onReplayIntro}
                className="hidden xl:flex items-center gap-1 text-xs text-slate-400 hover:text-amber-400 px-2 py-1 rounded border border-slate-800 hover:border-amber-500/40 transition"
                title="Replay cinematic trailer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Intro</span>
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-xs font-bold">
                    {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-200 leading-tight">
                      {user.fullName}
                    </span>
                    <span className="text-[10px] text-amber-400/90 font-mono leading-tight">
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition"
                  title="Sign out of Gyanvik"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold tracking-wide shadow-md shadow-amber-500/20 transition"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-3">
          {isStudent && (
            <>
              <Link
                to="/student"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-amber-400"
              >
                Student Dashboard
              </Link>
              <Link
                to="/neet-prep"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-emerald-400"
              >
                NEET Master Hub (PYQs & Books)
              </Link>
              <Link
                to="/discovery"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-cyan-400"
              >
                Government & Exam Discovery
              </Link>
              <Link
                to="/competitions"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-amber-400"
              >
                National Talent Search
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenJourneySelector?.();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-emerald-400 hover:bg-slate-900"
              >
                Change Journey (NEET / JEE / GATE / CUET)
              </button>
            </>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-amber-400 hover:bg-slate-900"
            >
              Admin Management Portal
            </Link>
          )}

          {isSuperAdmin && (
            <Link
              to="/super-admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-amber-300 hover:bg-slate-900"
            >
              Super Admin Governance
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
