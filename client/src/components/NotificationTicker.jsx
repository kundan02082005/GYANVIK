import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ShieldCheck, Bell, ExternalLink, RefreshCw, AlertTriangle, Info } from 'lucide-react';

export const NotificationTicker = ({ examSlug = 'neet' }) => {
  const [tickerItems, setTickerItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTicker = async () => {
    try {
      const res = await api.getTicker(examSlug);
      if (res.success && res.ticker) {
        setTickerItems(res.ticker);
      }
    } catch (e) {
      console.error('Failed to load ticker:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicker();
    const interval = setInterval(fetchTicker, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, [examSlug]);

  if (loading || tickerItems.length === 0) {
    return (
      <div className="w-full bg-slate-900/90 border-y border-amber-500/20 py-2.5 px-4 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400 animate-spin" />
          <span>Synchronizing authentic NTA notices...</span>
        </div>
      </div>
    );
  }

  // Double items for seamless marquee loop
  const displayItems = [...tickerItems, ...tickerItems];

  return (
    <div className="w-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-y border-amber-500/30 overflow-hidden relative shadow-inner">
      <div className="flex items-center">
        {/* Fixed Left Header Tag */}
        <div className="z-20 flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider shrink-0 shadow-md">
          <ShieldCheck className="w-4 h-4 text-slate-950" />
          <span className="hidden sm:inline">NTA Official Updates</span>
          <span className="sm:hidden">NTA Alert</span>
        </div>

        {/* Continuous Scrolling Ticker Container */}
        <div className="overflow-hidden whitespace-nowrap relative w-full py-2 flex items-center">
          <div className="flex items-center gap-8 animate-ticker hover:[animation-play-state:paused] cursor-pointer">
            {displayItems.map((item, idx) => {
              const isUrgent = item.urgencyLevel === 'URGENT';
              const isWarning = item.urgencyLevel === 'WARNING';
              return (
                <div
                  key={`${item.id}-${idx}`}
                  className="inline-flex items-center gap-3 text-xs sm:text-sm text-slate-200 hover:text-amber-300 transition-colors"
                >
                  {isUrgent ? (
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                      Urgent
                    </span>
                  ) : isWarning ? (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                      Advisory
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                      Verified
                    </span>
                  )}

                  <span className="font-semibold text-slate-100">{item.title}</span>

                  <span className="text-slate-400 text-xs hidden md:inline">
                    — Source: <span className="text-amber-400/90 font-medium">{item.sourceName}</span>
                  </span>

                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:underline hover:text-cyan-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Official Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <span className="text-slate-600 font-bold">•</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Status indicator */}
        <div className="z-20 hidden md:flex items-center gap-1.5 px-3 py-1 bg-slate-950/80 text-[10px] text-emerald-400 font-mono shrink-0 border-l border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>LIVE TICKER</span>
        </div>
      </div>
    </div>
  );
};
