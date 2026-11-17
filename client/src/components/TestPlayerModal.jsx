import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import {
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertCircle,
  Award,
  BarChart3,
  RotateCcw,
  BookOpen,
  X
} from 'lucide-react';

export const TestPlayerModal = ({ testId, testTitle, onClose, onTestCompleted }) => {
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({}); // { [qId]: 'A' }
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(180 * 60); // in seconds
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Fetch test details & questions
  useEffect(() => {
    const loadTest = async () => {
      try {
        const res = await api.getTestDetails(testId);
        if (res.success && res.questions) {
          setTest(res.test);
          setQuestions(res.questions);
          setTimeLeft((res.test.durationMinutes || 180) * 60);
        }
      } catch (err) {
        console.error('Failed to load test:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTest();
  }, [testId]);

  // Countdown timer
  useEffect(() => {
    if (result || loading || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [result, loading, timeLeft]);

  const formatTime = (secs) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remSecs = secs % 60;
    return `${hrs > 0 ? `${hrs}:` : ''}${mins < 10 ? '0' : ''}${mins}:${remSecs < 10 ? '0' : ''}${remSecs}`;
  };

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optId) => {
    if (!currentQ) return;
    setResponses(prev => ({
      ...prev,
      [currentQ.id]: optId
    }));
  };

  const handleClearResponse = () => {
    if (!currentQ) return;
    setResponses(prev => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  const handleToggleReview = () => {
    if (!currentQ) return;
    setMarkedForReview(prev => {
      const copy = new Set(prev);
      if (copy.has(currentQ.id)) {
        copy.delete(currentQ.id);
      } else {
        copy.add(currentQ.id);
      }
      return copy;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setShowConfirmSubmit(false);
    try {
      const timeSpent = ((test?.durationMinutes || 180) * 60) - timeLeft;
      const res = await api.submitTest({
        testId,
        responses,
        timeSpentSeconds: Math.max(1, timeSpent)
      });

      if (res.success) {
        setResult(res);
        onTestCompleted?.(res.attempt);
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Failed to submit test:', err);
      alert('Failed to submit test. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold tracking-wider">Preparing CBT Mock Environment...</span>
        </div>
      </div>
    );
  }

  // --- RESULT SCORECARD SCREEN ---
  if (result) {
    const { attempt, questionReviews } = result;
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 p-4 sm:p-6 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Official Examination Scorecard
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                {testTitle || 'NEET Mock Examination'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Highlights Score Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
              <span className="text-xs text-amber-400 font-semibold uppercase">Total Score</span>
              <div className="text-3xl font-black text-amber-300 mt-1">
                {attempt.score} <span className="text-sm text-slate-400">/ {attempt.totalMarks}</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">NTA Marking (+4 / -1)</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <span className="text-xs text-emerald-400 font-semibold uppercase">Accuracy</span>
              <div className="text-3xl font-black text-emerald-300 mt-1">
                {attempt.accuracyPct}%
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Precision Rate</span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-center">
              <span className="text-xs text-blue-400 font-semibold uppercase">Estimated Percentile</span>
              <div className="text-3xl font-black text-blue-300 mt-1">
                {attempt.percentile}%ile
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">All-India Benchmark</span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-center">
              <span className="text-xs text-indigo-400 font-semibold uppercase">Question Breakdown</span>
              <div className="flex items-center justify-center gap-2 mt-2 text-xs font-bold">
                <span className="text-emerald-400">✓ {attempt.correctCount}</span>
                <span className="text-rose-400">✗ {attempt.incorrectCount}</span>
                <span className="text-slate-400">○ {attempt.unattemptedCount}</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Total: {questions.length} Qs</span>
            </div>
          </div>

          {/* Weak Topics Diagnostic Banner */}
          {attempt.weakTopics && attempt.weakTopics.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-300">
                  Targeted Revision Alert (Weak Topic Identified)
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Based on your attempt, you made errors in:{' '}
                  <strong className="text-white">
                    {attempt.weakTopics.map(w => `${w.topic} (${w.accuracy}% acc)`).join(', ')}
                  </strong>
                  . Revisit these topics in the NCERT Library or book a 1-on-1 mentor session.
                </p>
              </div>
            </div>
          )}

          {/* Subject-Wise Performance Breakdown */}
          {attempt.subjectBreakdown && Object.keys(attempt.subjectBreakdown).length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>Subject-Wise Performance</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(attempt.subjectBreakdown).map(([sub, stat]) => (
                  <div key={sub} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-200">{sub}</span>
                      <div className="text-slate-400 mt-0.5">
                        Correct: <strong className="text-emerald-400">{stat.correct}</strong> | Incorrect:{' '}
                        <strong className="text-rose-400">{stat.incorrect}</strong>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold">
                      {stat.marks} Marks
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Question by Question Review */}
          <div className="space-y-4 border-t border-slate-800 pt-6">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>Comprehensive Solution Review with Explanations</span>
            </h4>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {questionReviews.map((rev, idx) => (
                <div
                  key={rev.questionId}
                  className={`p-4 rounded-2xl border ${
                    rev.isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : rev.isAnswered
                      ? 'bg-rose-950/20 border-rose-500/30'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-300">
                      Q{idx + 1}. [{rev.subject}] {rev.topic}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                      rev.isCorrect
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : rev.isAnswered
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {rev.isCorrect ? 'Correct (+4)' : rev.isAnswered ? 'Incorrect (-1)' : 'Unattempted (0)'}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-white mb-3">
                    {rev.questionText}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-xs">
                    {rev.options.map(opt => {
                      const isCorrectOpt = opt.id === rev.correctOption;
                      const isSelected = opt.id === rev.studentChoice;
                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                            isCorrectOpt
                              ? 'bg-emerald-900/40 border-emerald-400 text-white font-semibold'
                              : isSelected
                              ? 'bg-rose-900/40 border-rose-400 text-white'
                              : 'bg-slate-900/40 border-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="font-bold font-mono">({opt.id})</span>
                          <span>{opt.text}</span>
                          {isCorrectOpt && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />}
                          {isSelected && !isCorrectOpt && <XCircle className="w-3.5 h-3.5 text-rose-400 ml-auto shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {rev.explanation && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                      <strong className="text-amber-400 block mb-1">NCERT Master Solution & Explanation:</strong>
                      <p>{rev.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- LIVE TEST PLAYER CBT SCREEN ---
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-hidden">
      {/* Top Test Header Bar */}
      <div className="h-16 px-4 sm:px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
            CBT
          </div>
          <div>
            <h3 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
              {testTitle || 'NEET Examination'}
            </h3>
            <span className="text-[11px] text-slate-400">
              Question {currentIndex + 1} of {questions.length} • Single Choice MCQs
            </span>
          </div>
        </div>

        {/* Live Timer Banner */}
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border font-mono text-sm font-bold ${
            timeLeft < 300
              ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
              : 'bg-slate-800/90 border-slate-700 text-amber-300'
          }`}>
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Time Left: {formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => setShowConfirmSubmit(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Test</span>
          </button>
        </div>
      </div>

      {/* Main CBT Workspace: Split Screen */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Question Pane */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 lg:p-8">
          {currentQ ? (
            <div className="space-y-6 max-w-3xl">
              {/* Question Meta Tag */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-amber-300 font-semibold">
                  {currentQ.topic || 'Subject Practice'}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  Marks: <strong className="text-emerald-400">+4</strong> /{' '}
                  <strong className="text-rose-400">-1</strong>
                </span>
              </div>

              {/* Question Text */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-base font-medium leading-relaxed">
                <span className="font-bold text-amber-400 mr-2">Q{currentIndex + 1}.</span>
                {currentQ.questionText}
              </div>

              {/* Options List */}
              <div className="space-y-3">
                {currentQ.options?.map(opt => {
                  const isSelected = responses[currentQ.id] === opt.id;
                  return (
                    <label
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`flex items-center gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-500/10 text-white'
                          : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 text-slate-200'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                        isSelected ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {opt.id}
                      </div>
                      <span className="text-sm font-medium">{opt.text}</span>
                    </label>
                  );
                })}
              </div>

              {/* Bottom Question Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleReview}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                      markedForReview.has(currentQ.id)
                        ? 'bg-purple-950/60 border-purple-500 text-purple-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{markedForReview.has(currentQ.id) ? 'Marked for Review' : 'Mark for Review'}</span>
                  </button>

                  {responses[currentQ.id] && (
                    <button
                      onClick={handleClearResponse}
                      className="px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition"
                    >
                      Clear Response
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    disabled={currentIndex === questions.length - 1}
                    onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <span>Save & Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">No question selected.</div>
          )}
        </div>

        {/* Right Side: Question Palette (CBT Grid) */}
        <div className="w-full lg:w-80 bg-slate-900/90 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 flex flex-col justify-between shrink-0">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Question Palette ({questions.length} Items)
            </h4>

            {/* Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500" />
                <span>Answered ({Object.keys(responses).length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700" />
                <span>Not Visited</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-purple-600" />
                <span>Marked for Review ({markedForReview.size})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500" />
                <span>Current Active</span>
              </div>
            </div>

            {/* Grid of Question Numbers */}
            <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = Boolean(responses[q.id]);
                const isMarked = markedForReview.has(q.id);

                let bgClass = 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700';
                if (isCurrent) {
                  bgClass = 'bg-amber-500 text-slate-950 font-black ring-2 ring-amber-300';
                } else if (isAnswered && isMarked) {
                  bgClass = 'bg-purple-700 text-white font-bold';
                } else if (isMarked) {
                  bgClass = 'bg-purple-900/80 border border-purple-500 text-purple-200';
                } else if (isAnswered) {
                  bgClass = 'bg-emerald-600 text-white font-bold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-9 rounded-lg text-xs font-mono font-semibold transition ${bgClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Summary in sidebar */}
          <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20"
            >
              Submit Mock Examination
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">
              Ready to submit your examination?
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              You have answered <strong className="text-emerald-400">{Object.keys(responses).length}</strong> questions out of {questions.length}.
              Unattempted questions: <strong className="text-slate-400">{questions.length - Object.keys(responses).length}</strong>.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                Continue Solving
              </button>
              <button
                disabled={submitting}
                onClick={handleSubmit}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
              >
                {submitting ? 'Evaluating...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
