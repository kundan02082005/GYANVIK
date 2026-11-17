import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  Cpu,
  Cog,
  Compass,
  CheckCircle2,
  Lock,
  ArrowRight,
  X,
  Sparkles
} from 'lucide-react';

export const JourneySelectorModal = ({ isOpen, onClose, onSelectExam }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const journeys = [
    {
      slug: 'neet',
      name: 'NEET (UG)',
      title: 'National Eligibility cum Entrance Test',
      icon: Stethoscope,
      category: 'Medical Sciences',
      status: 'ACTIVE',
      badge: 'Active & Fully Functional',
      tagline: 'Gateway to AIIMS, JIPMER, and Top Govt Medical Colleges',
      features: ['Authentic 10-Yr PYQs', 'NCERT Master Library', 'Grand Mock Tests', '1-on-1 AIIMS Mentors'],
      accentColor: 'emerald',
      gradient: 'from-emerald-900/60 via-slate-900 to-slate-950',
      borderColor: 'border-emerald-500/60 hover:border-emerald-400',
      buttonBg: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
    },
    {
      slug: 'jee',
      name: 'IIT-JEE (Main & Adv)',
      title: 'Joint Entrance Examination',
      icon: Cpu,
      category: 'Engineering & Technology',
      status: 'COMING_SOON',
      badge: 'Coming Soon - Configured for 2026/27',
      tagline: 'Pathway to Premier IITs, NITs, and IIITs',
      features: ['Advanced Numerical Drills', 'IITian Doubt Support', 'Rank Predictor'],
      accentColor: 'blue',
      gradient: 'from-blue-950/40 via-slate-900 to-slate-950',
      borderColor: 'border-blue-900/40 hover:border-blue-700/50',
      buttonBg: 'bg-slate-800 text-slate-400 cursor-not-allowed'
    },
    {
      slug: 'gate',
      name: 'GATE',
      title: 'Graduate Aptitude Test in Engineering',
      icon: Cog,
      category: 'Higher Tech & Maharatna PSUs',
      status: 'COMING_SOON',
      badge: 'Coming Soon - In Development',
      tagline: 'M.Tech in IISc/IITs & Direct PSU Recruitment',
      features: ['Subject Specialization Tracks', 'Engg Mathematics Modules'],
      accentColor: 'indigo',
      gradient: 'from-indigo-950/40 via-slate-900 to-slate-950',
      borderColor: 'border-indigo-900/40 hover:border-indigo-700/50',
      buttonBg: 'bg-slate-800 text-slate-400 cursor-not-allowed'
    },
    {
      slug: 'cuet',
      name: 'CUET (UG)',
      title: 'Common University Entrance Test',
      icon: Compass,
      category: 'Central Universities Admission',
      status: 'COMING_SOON',
      badge: 'Coming Soon - In Development',
      tagline: 'Direct Admission into DU, BHU, JNU, and AMU',
      features: ['Domain Specific Practice', 'General Ability Tests'],
      accentColor: 'amber',
      gradient: 'from-amber-950/40 via-slate-900 to-slate-950',
      borderColor: 'border-amber-900/40 hover:border-amber-700/50',
      buttonBg: 'bg-slate-800 text-slate-400 cursor-not-allowed'
    }
  ];

  const handleSelect = (journey) => {
    if (journey.status === 'ACTIVE') {
      onSelectExam?.(journey.slug);
      onClose();
      navigate('/neet-prep');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalized Academic Pathway</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-cinematic">
            SELECT YOUR JOURNEY
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Choose your target competitive examination to unlock dedicated previous-year questions, NCERT chapter libraries, and verified mentorship.
          </p>
        </div>

        {/* 4 Clickable Journey Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {journeys.map((j) => {
            const IconComponent = j.icon;
            const isActive = j.status === 'ACTIVE';

            return (
              <div
                key={j.slug}
                onClick={() => isActive && handleSelect(j)}
                className={`relative rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between bg-gradient-to-br ${
                  j.gradient
                } ${j.borderColor} ${
                  isActive
                    ? 'cursor-pointer hover:scale-[1.01] hover:shadow-2xl hover:shadow-emerald-900/30 group'
                    : 'opacity-75 cursor-default'
                }`}
              >
                {/* Active or Coming Soon Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40' : 'bg-slate-800 text-slate-500'
                  }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {j.badge}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {j.category}
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1 group-hover:text-amber-300 transition-colors">
                    {j.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {j.title}
                  </p>
                  <p className="text-sm text-slate-300 mt-2 font-normal">
                    {j.tagline}
                  </p>

                  {/* Highlights list */}
                  <div className="mt-4 space-y-1.5 border-t border-slate-800/80 pt-3">
                    {j.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTA Button */}
                <div className="mt-6 pt-2">
                  {isActive ? (
                    <button
                      onClick={() => handleSelect(j)}
                      className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition ${j.buttonBg}`}
                    >
                      <span>Enter Dedicated NEET Hub</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 bg-slate-800/80 text-slate-400 border border-slate-700/60 cursor-not-allowed text-xs font-semibold"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Configured for Upcoming Release</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Admin Configuration Note */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
          <span>Examination tracks are fully modular and dynamically configurable through the Gyanvik Administration Portal.</span>
        </div>
      </div>
    </div>
  );
};
