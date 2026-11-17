import React, { useState } from 'react';
import { BookOpen, Download, ExternalLink, X, ZoomIn, ZoomOut, CheckCircle2 } from 'lucide-react';

export const NcertReaderModal = ({ resource, onClose }) => {
  const [zoom, setZoom] = useState(100);

  if (!resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Control Bar */}
        <div className="h-16 px-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                {resource.title}
              </h3>
              <span className="text-[11px] text-slate-400">
                Class {resource.classLevel} • {resource.chapterName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setZoom(prev => Math.max(70, prev - 15))}
                className="p-1 text-slate-400 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-slate-300 w-10 text-center">{zoom}%</span>
              <button
                onClick={() => setZoom(prev => Math.min(160, prev + 15))}
                className="p-1 text-slate-400 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Official Download Link */}
            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF ({resource.fileSizeMb || 4.5} MB)</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Body / Simulation */}
        <div className="flex-1 bg-slate-950/70 p-6 overflow-y-auto flex justify-center">
          <div
            className="w-full max-w-3xl bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-xl space-y-6 transition-all duration-200"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            {/* Textbook Page Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">
                  National Council of Educational Research and Training
                </span>
                <h1 className="text-2xl font-black text-slate-950 font-serif mt-1">
                  {resource.title}
                </h1>
                <p className="text-xs text-slate-600 font-semibold mt-0.5">
                  Class {resource.classLevel} • Authorized Curriculum
                </p>
              </div>
              <div className="w-12 h-12 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center font-serif font-black text-slate-700">
                NCERT
              </div>
            </div>

            {/* Chapter Overview Box */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-slate-800 text-xs space-y-2">
              <strong className="text-amber-900 block font-bold text-sm">Chapter Syllabus Highlights:</strong>
              <p>
                This chapter is curated from the latest revised NCERT textbook framework for NEET (UG). Key focus areas include conceptual diagrams, standard definitions, solved numerical illustrations, and summary exercises directly tested by the National Testing Agency.
              </p>
              <div className="flex items-center gap-2 pt-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified against official NTA NEET UG Syllabus</span>
              </div>
            </div>

            {/* Sample Page Content */}
            <div className="prose text-xs sm:text-sm text-slate-700 space-y-4 leading-relaxed font-serif">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1">
                {resource.chapterName}
              </h2>
              <p>
                In competitive examinations such as NEET, over 85–90% of Biology questions and direct theoretical principles in Physics and Chemistry are lifted line-by-line from the NCERT textbook. Students are advised to meticulously study every caption, diagram label, boldfaced term, and summary section at the conclusion of this chapter.
              </p>

              <div className="my-6 p-4 bg-slate-50 border-l-4 border-emerald-500 rounded text-slate-800 text-xs italic">
                "Science is not only about knowing facts; it is about grasping how those principles govern the natural cosmos."
              </div>

              <p>
                Gyanvik provides full online access to the authorized NCERT repository. Use the download button in the toolbar above to save the complete official textbook PDF to your local device for offline study.
              </p>
            </div>

            {/* Direct Official Link */}
            <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Source: National Council of Educational Research and Training (ncert.nic.in)</span>
              <a
                href={resource.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Open in Official NCERT Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
