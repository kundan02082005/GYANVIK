import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Sparkles, ArrowRight } from 'lucide-react';

export const CinematicIntro = ({ onComplete }) => {
  const canvasRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [phase, setPhase] = useState('initial'); // initial -> trailer -> tagline -> fadeOut

  // Synthesize cinematic movie-trailer bass sweep & resonant chord using Web Audio API
  const playCinematicSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // 1. Deep Sub-Bass Impact (Movie Boom)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 1.8);

      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 2.6);

      // 2. High Shimmer Chime (Trailer Glow)
      const chime = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chime.type = 'triangle';
      chime.frequency.setValueAtTime(523.25, now + 0.3); // C5
      chime.frequency.exponentialRampToValueAtTime(1046.5, now + 1.2); // C6

      chimeGain.gain.setValueAtTime(0.001, now);
      chimeGain.gain.linearRampToValueAtTime(0.25, now + 0.5);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

      chime.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chime.start(now + 0.3);
      chime.stop(now + 2.5);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Particle canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.5) * 0.8,
      alpha: Math.random() * 0.7 + 0.2,
      color: Math.random() > 0.4 ? '#F59E0B' : '#06B6D4'
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Radial dark vignette
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 50,
        width / 2, height / 2, Math.max(width, height) / 1.1
      );
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(0.6, '#070f2b');
      gradient.addColorStop(1, '#020617');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render drifting particles
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Sequence transitions: approx 2.8s total cinematic duration
  useEffect(() => {
    if (soundEnabled) {
      playCinematicSound();
    }

    const t1 = setTimeout(() => setPhase('trailer'), 100);
    const t2 = setTimeout(() => setPhase('tagline'), 1100);
    const t3 = setTimeout(() => setPhase('fadeOut'), 2700);
    const t4 = setTimeout(() => {
      onComplete?.();
    }, 3100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [soundEnabled, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 overflow-hidden transition-opacity duration-500 ${
        phase === 'fadeOut' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Ambient anamorphic lens flare line */}
      <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-40 blur-[1px] animate-pulse" />
      <div className="absolute w-[60vw] h-[300px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Cinematic Title */}
      <div className="relative z-10 text-center px-4 flex flex-col items-center">
        {/* Decorative Badge */}
        <div
          className={`flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-amber-400/30 bg-amber-500/10 backdrop-blur-md transition-all duration-700 ${
            phase !== 'initial' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-amber-300">
            India's Premier Exam Prep Hub
          </span>
        </div>

        {/* Word: GYANVIK */}
        <h1
          className={`text-6xl sm:text-8xl md:text-9xl font-black font-cinematic tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-[0_0_35px_rgba(245,158,11,0.6)] transition-all duration-1000 transform ${
            phase !== 'initial'
              ? 'scale-100 opacity-100 filter blur-0'
              : 'scale-125 opacity-0 filter blur-sm'
          }`}
        >
          GYANVIK
        </h1>

        {/* Tagline */}
        <div
          className={`mt-4 sm:mt-6 transition-all duration-1000 transform ${
            phase === 'tagline' || phase === 'fadeOut'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-sm sm:text-lg md:text-xl font-medium tracking-[0.25em] text-slate-200 uppercase max-w-2xl mx-auto">
            One Platform. <span className="text-amber-400 font-semibold">Many Examinations.</span>{' '}
            <span className="text-cyan-400 font-semibold">Clearer Opportunities.</span>
          </p>

          <div className="mt-4 flex items-center justify-center gap-3 text-xs tracking-wider text-slate-400">
            <span>NEET (UG)</span>
            <span>•</span>
            <span>IIT-JEE</span>
            <span>•</span>
            <span>GATE</span>
            <span>•</span>
            <span>CUET</span>
          </div>
        </div>
      </div>

      {/* Floating Controls: Audio toggle & Skip */}
      <div className="absolute bottom-8 z-20 flex items-center justify-between w-full max-w-4xl px-8">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/50 backdrop-blur-md text-xs transition"
          title={soundEnabled ? 'Mute cinematic sound' : 'Unmute sound'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          <span>{soundEnabled ? 'Audio Active' : 'Muted'}</span>
        </button>

        {/* Progress bar countdown */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-400 to-cyan-400 animate-[width_2.8s_linear_forwards]" style={{ animation: 'progressBar 2.8s linear forwards' }} />
          </div>
          <span className="text-[11px] text-slate-500">Entering Platform...</span>
        </div>

        <button
          onClick={() => onComplete?.()}
          className="group flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 backdrop-blur-md text-xs font-semibold tracking-wider transition uppercase"
        >
          <span>Skip to Portal</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
