import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CinematicIntro } from './components/CinematicIntro';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { NeetPrepHub } from './pages/NeetPrepHub';
import { AdminPortal } from './pages/AdminPortal';
import { SuperAdminPortal } from './pages/SuperAdminPortal';

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
    // Check if intro has already been viewed in this browser session
    const seen = sessionStorage.getItem('gyanvik_intro_seen');
    return !seen;
  });

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
