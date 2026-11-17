import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CinematicIntro } from './components/CinematicIntro';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { NeetPrepHub } from './pages/NeetPrepHub';
import { AdminPortal } from './pages/AdminPortal';
import { SuperAdminPortal } from './pages/SuperAdminPortal';
import { supabase } from './utils/supabase';

// Protected Route helper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold tracking-wider font-cinematic">GYANVIK...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'SUPER_ADMIN') return <Navigate to="/super-admin" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/student" replace />;
  }

  return children;
};

function AppContent() {
  // Show cinematic intro once initially
  const [showIntro, setShowIntro] = useState(() => {
    const seen = sessionStorage.getItem('gyanvik_intro_seen');
    return !seen;
  });

  // Supabase live integration state (queries live cloud database)
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [cloudItems, setCloudItems] = useState([]);

  useEffect(() => {
    async function initSupabaseData() {
      try {
        // Query Supabase live endpoint
        const { data: todos, error: todosErr } = await supabase.from('todos').select('*');
        if (todos && !todosErr) {
          setCloudItems(todos);
        }

        const { data: profiles, error: profErr } = await supabase.from('profiles').select('*').limit(1);
        if (!profErr || profErr.code === 'PGRST205') {
          setSupabaseConnected(true);
        }
      } catch (e) {
        console.warn('Supabase integration initialized:', e);
      }
    }

    initSupabaseData();
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('gyanvik_intro_seen', 'true');
    setShowIntro(false);
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  return (
    <>
      {showIntro && <CinematicIntro onComplete={handleIntroComplete} />}

      <Routes>
        <Route
          path="/login"
          element={<LoginPage onReplayIntro={handleReplayIntro} />}
        />

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN', 'SUPER_ADMIN']}>
              <StudentDashboard onReplayIntro={handleReplayIntro} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/neet-prep"
          element={
            <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN', 'SUPER_ADMIN']}>
              <NeetPrepHub onReplayIntro={handleReplayIntro} />
            </ProtectedRoute>
          }
        />

        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
              <AdminPortal />
            </ProtectedRoute>
          }
        />

        {/* Super Admin Route */}
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <SuperAdminPortal />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/student" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
