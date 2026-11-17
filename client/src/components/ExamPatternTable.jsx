import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Building2,
  Award,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

export const ExamPatternTable = ({ examSlug = 'neet', onConfigLoaded }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      const res = await api.getExamConfig(examSlug);
      if (res.success && res.config) {
        setConfig(res.config);
        onConfigLoaded?.(res.config);
      }
    } catch (e) {
      console.error('Failed to load exam config:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, [examSlug]);

  if (loading || !config) {
    return (
      <div className="py-12 text-center text-slate-400 animate-pulse">
        Loading official examination structure & rules...
      </div>
    );
  }

  const structure = config.paperStructure || [];

  return (
    <div className="space-y-6">
      {/* Overview Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Conducting Authority */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Authority</span>
          </div>
          <div className="mt-2 text-sm font-bold text-white truncate" title={config.conductingAuthority}>
            {config.conductingAuthority || 'NTA'}
          </div>
          <span className="text-[10px] text-slate-400 mt-1">National Testing Agency</span>
        </div>

        {/* Examination Mode */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Exam Mode</span>
          </div>
          <div className="mt-2 text-sm font-bold text-white">
            {config.examMode || 'Offline (Pen & Paper)'}
          </div>
          <span className="text-[10px] text-slate-400 mt-1">OMR Answer Sheet</span>
        </div>

        {/* Exam Duration */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>Duration</span>
          </div>
          <div className="mt-2 text-sm font-bold text-white">
            {config.durationText || `${config.durationMinutes || 180} Minutes`}
          </div>
          <span className="text-[10px] text-slate-400 mt-1">3 Hours (Single Shift)</span>
        </div>

        {/* Question Type */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>Question Type</span>
          </div>
          <div className="mt-2 text-sm font-bold text-white">
            MCQs
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Multiple Choice (4 Options)</span>
        </div>

        {/* Total Questions */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Questions</span>
          </div>
          <div className="mt-2 text-sm font-bold text-white">
            {config.totalQuestions || 180} Questions
          </div>
          <span className="text-[10px] text-slate-400 mt-1">Attempt from 200 total</span>
        </div>

        {/* Total Marks */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Maximum Marks</span>
          </div>
          <div className="mt-2 text-base font-black text-amber-300">
            {config.totalMarks || 720} Marks
          </div>
          <span className="text-[10px] text-amber-400/80 mt-1">All-India Merit Score</span>
        </div>
      </div>

      {/* Official Paper Structure Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl">
        <div className="px-5 py-4 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Official Examination Paper Structure
              </h3>
              <p className="text-xs text-slate-400">
                Directly synchronized with the National Testing Agency (NTA) notification guidelines
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Dynamic DB Configuration Active</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Subject / Section</th>
                <th className="py-3.5 px-6 text-center">Number of Questions</th>
                <th className="py-3.5 px-6 text-center">Maximum Marks</th>
                <th className="py-3.5 px-6">Curriculum Breakdown</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-sm">
              {structure.map((item, index) => {
                const isTotal = item.subject.toLowerCase().includes('total');
                return (
                  <tr
                    key={index}
                    className={`transition-colors ${
                      isTotal
                        ? 'bg-amber-500/10 font-bold text-white border-t-2 border-amber-500/40'
                        : 'hover:bg-slate-800/50 text-slate-200'
                    }`}
                  >
                    <td className="py-4 px-6 flex items-center gap-2">
                      {isTotal ? (
                        <span className="text-amber-400 font-extrabold text-base">★</span>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                      )}
                      <span className={isTotal ? 'text-amber-300 text-base font-bold' : 'font-semibold'}>
                        {item.subject}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 font-mono font-semibold">
                        {item.questions} Questions
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full font-mono font-bold ${
                        isTotal
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {item.marks} Marks
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400">
                      {item.description || 'NCERT Class 11th & 12th Syllabus'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Marking Scheme Footnote Banner */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Correct Answer: <strong className="text-emerald-300">+{config.correctMark || 4} Marks</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <XCircle className="w-4 h-4" />
              <span>Wrong Answer: <strong className="text-rose-300">-{config.negativeMark || 1} Mark</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
              <HelpCircle className="w-4 h-4" />
              <span>Unattempted: <strong className="text-slate-300">{config.unattemptedMark || 0} Marks</strong></span>
            </div>
          </div>

          <div className="text-slate-500 flex items-center gap-1 text-[11px]">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Configurable dynamically via Gyanvik Administration Panel</span>
          </div>
        </div>
      </div>
    </div>
  );
};
