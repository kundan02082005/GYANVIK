import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  UserCheck,
  HelpCircle,
  Calendar,
  Sparkles,
  TrendingUp,
  Target,
  Smile,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  X,
  Stethoscope,
  ChevronRight
} from 'lucide-react';

export const MentorBookingModal = ({ isOpen, onClose, onBookingSuccess }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Benefits & Form, 2: Transparent Pricing & Sandbox Checkout, 3: Confirmation
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    studentContactPhone: user?.phone || '',
    examGoal: 'NEET (UG) 2026/27',
    preferredSubjects: 'Physics & Biology 360 Strategy',
    preparationStage: 'Class 12th Regular',
    preferredLanguage: 'Bilingual (Hindi + English)',
    notes: ''
  });
  const [selectedPlan, setSelectedPlan] = useState({
    id: 'monthly',
    name: '1-Month Intensive Doctor Mentorship',
    price: 999,
    description: 'Weekly 1-on-1 strategy calls, daily doubt support on WhatsApp, and custom revision planner.'
  });
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  if (!isOpen) return null;

  const mentorBenefits = [
    {
      title: 'Personal Guidance',
      desc: 'Providing individual attention and personalized study roadmap tailored to your strengths.',
      icon: UserCheck,
      color: 'text-amber-400 bg-amber-500/10'
    },
    {
      title: 'Doubt Solving',
      desc: 'Helping students master difficult concepts in Physics numericals and Organic mechanisms.',
      icon: HelpCircle,
      color: 'text-cyan-400 bg-cyan-500/10'
    },
    {
      title: 'Study Planning',
      desc: 'Creating effective, realistic study schedules and daily milestone checklists.',
      icon: Calendar,
      color: 'text-emerald-400 bg-emerald-500/10'
    },
    {
      title: 'Motivation & Confidence',
      desc: 'Keeping students motivated and confident throughout the rigorous preparation journey.',
      icon: Sparkles,
      color: 'text-purple-400 bg-purple-500/10'
    },
    {
      title: 'Performance Tracking',
      desc: 'Continuous monitoring of your mock test scores, error logs, and topic accuracy.',
      icon: TrendingUp,
      color: 'text-blue-400 bg-blue-500/10'
    },
    {
      title: 'Exam Strategies',
      desc: 'Teaching question-selection techniques, OMR speed hacks, and negative mark elimination.',
      icon: Target,
      color: 'text-rose-400 bg-rose-500/10'
    },
    {
      title: 'Stress Management',
      desc: 'Guiding students to overcome test anxiety and pressure from top AIIMS doctors.',
      icon: Smile,
      color: 'text-teal-400 bg-teal-500/10'
    }
  ];

  const handleNextToPayment = (e) => {
    e.preventDefault();
    if (!formData.studentContactPhone || !formData.preferredSubjects) {
      alert('Please fill out your contact phone and preferred subjects.');
      return;
    }
    setStep(2);
  };

  const handleCompleteBookingWithSandboxPayment = async () => {
    setLoading(true);
    try {
      // 1. Process sandbox payment order
      const orderRes = await api.createPaymentOrder({
        planName: `Gyanvik 1-on-1 Mentorship (${selectedPlan.name})`,
        planTier: 'MENTOR_SUBSCRIPTION',
        amountInr: selectedPlan.price
      });

      // 2. Simulate sandbox payment completion
      const paymentRes = await api.verifyPayment({
        planName: selectedPlan.name,
        planTier: 'MENTOR_SUBSCRIPTION',
        amountInr: selectedPlan.price,
        paymentMethod: 'UPI / Card (Sandbox Test Mode)',
        gatewayOrderId: orderRes.order?.orderId
      });

      // 3. Register the mentor booking with backend
      const bookingRes = await api.bookMentor({
        examGoal: formData.examGoal,
        preferredSubjects: formData.preferredSubjects,
        preparationStage: formData.preparationStage,
        preferredLanguage: formData.preferredLanguage,
        studentContactPhone: formData.studentContactPhone,
        notes: formData.notes
      });

      if (bookingRes.success) {
        setBookingResult({
          booking: bookingRes.booking,
          payment: paymentRes.payment
        });
        setStep(3);
        onBookingSuccess?.(bookingRes.booking);
      }
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Failed to complete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: BENEFITS & APPLICATION FORM */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>AIIMS & Premier GMC Doctor Mentorship</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                BOOK YOUR PERSONAL MENTOR
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-400">
                Experience transformative 1-on-1 guidance from top medical college rank holders who have walked the path and cracked NEET UG.
              </p>
            </div>

            {/* 7 Key Benefits Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                7 Core Pillars of Gyanvik Personal Mentorship:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {mentorBenefits.map((b, i) => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition"
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${b.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-200">{b.title}</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Integrated Booking Form */}
            <form onSubmit={handleNextToPayment} className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Mentorship Application & Preferences</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-400 outline-none"
                    placeholder="Enter student name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-400 outline-none"
                    placeholder="student@gyanvik.edu.in"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    WhatsApp / Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.studentContactPhone}
                    onChange={e => setFormData({ ...formData, studentContactPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-400 outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Examination Goal
                  </label>
                  <select
                    value={formData.examGoal}
                    onChange={e => setFormData({ ...formData, examGoal: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-400 outline-none"
                  >
                    <option value="NEET (UG) 2026">NEET (UG) 2026 Target</option>
                    <option value="NEET (UG) 2027">NEET (UG) 2027 (Class 11 Aspirant)</option>
                    <option value="NEET Dropper Comeback">NEET Dropper / Repeater Track</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Primary Focus / Preferred Subjects *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.preferredSubjects}
                    onChange={e => setFormData({ ...formData, preferredSubjects: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-400 outline-none"
                    placeholder="e.g. Physics Numericals, Chemistry Physical, Full Syllabus"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Preferred Communication Language
                  </label>
                  <select
                    value={formData.preferredLanguage}
                    onChange={e => setFormData({ ...formData, preferredLanguage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-400 outline-none"
                  >
                    <option value="Bilingual (Hindi + English)">Bilingual (Hindi + English)</option>
                    <option value="English Only">English Only</option>
                    <option value="Hindi Only">Hindi Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Specific Challenges or Goals (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-400 outline-none"
                  placeholder="Tell your future mentor what areas you want help with (e.g. low mock scores, procrastination)..."
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <span className="text-xs text-slate-500">
                  Step 1 of 2: Application Details
                </span>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
                >
                  <span>Select Mentorship Plan</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: TRANSPARENT PRICING & SANDBOX PAYMENT CHECKOUT */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Transparent Academic Pricing
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                Select Your Mentorship Plan
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Zero hidden charges. Includes 100% money-back guarantee if you are not satisfied after your first session.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option A: Monthly */}
              <div
                onClick={() => setSelectedPlan({
                  id: 'monthly',
                  name: '1-Month Intensive Doctor Mentorship',
                  price: 999,
                  description: 'Weekly 1-on-1 strategy calls, daily doubt support on WhatsApp, and custom revision planner.'
                })}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  selectedPlan.id === 'monthly'
                    ? 'bg-amber-500/15 border-amber-400 shadow-xl shadow-amber-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Monthly Starter
                  </span>
                  {selectedPlan.id === 'monthly' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="text-3xl font-black text-white">
                  ₹999 <span className="text-xs text-slate-400 font-normal">/ month</span>
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  Ideal for diagnostic review, formula strategy, and building weekly discipline.
                </p>
                <div className="mt-4 space-y-1.5 text-xs text-slate-400 border-t border-slate-800 pt-3">
                  <div className="flex items-center gap-1.5 text-slate-300">✓ 4 Live 1-on-1 Doctor Video Calls</div>
                  <div className="flex items-center gap-1.5 text-slate-300">✓ Weekly Customized Timetable</div>
                  <div className="flex items-center gap-1.5 text-slate-300">✓ Test Error Log Analysis</div>
                </div>
              </div>

              {/* Option B: Quarter Target Pro */}
              <div
                onClick={() => setSelectedPlan({
                  id: 'quarterly',
                  name: '3-Month Complete NEET Mastery Tier',
                  price: 2499,
                  description: 'Complete syllabus revision, weekly mock reviews, personal AIIMS mentor, and priority WhatsApp doubt solving.'
                })}
                className={`p-5 rounded-2xl border cursor-pointer transition-all relative ${
                  selectedPlan.id === 'quarterly'
                    ? 'bg-emerald-500/15 border-emerald-400 shadow-xl shadow-emerald-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider">
                  Most Popular
                </span>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    Quarterly Pro (Save 20%)
                  </span>
                  {selectedPlan.id === 'quarterly' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="text-3xl font-black text-white">
                  ₹2,499 <span className="text-xs text-slate-400 font-normal">/ 3 months</span>
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  Comprehensive end-to-end guidance right up to the NEET exam hall.
                </p>
                <div className="mt-4 space-y-1.5 text-xs text-slate-400 border-t border-slate-800 pt-3">
                  <div className="flex items-center gap-1.5 text-slate-300">✓ 12 Live 1-on-1 Doctor Video Calls</div>
                  <div className="flex items-center gap-1.5 text-slate-300">✓ Unlimited Chat & Doubt Clearing</div>
                  <div className="flex items-center gap-1.5 text-slate-300">✓ Free Gyanvik Test Series Access</div>
                </div>
              </div>
            </div>

            {/* Sandbox Notice Banner */}
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <p className="text-xs text-slate-300">
                <strong className="text-amber-300">Sandbox Payment Mode Active:</strong> No real money will be charged. This sandbox simulates the complete order generation, payment authorization, and receipt emission.
              </p>
            </div>

            {/* Checkout buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                Back to Details
              </button>

              <button
                disabled={loading}
                onClick={handleCompleteBookingWithSandboxPayment}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/25 transition"
              >
                <CreditCard className="w-4 h-4" />
                <span>{loading ? 'Processing Sandbox Payment...' : `Confirm & Pay ₹${selectedPlan.price} (Sandbox)`}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: BOOKING CONFIRMED SCREEN */}
        {step === 3 && bookingResult && (
          <div className="text-center py-6 space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-white">
              Mentorship Booking Confirmed!
            </h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Thank you for entrusting Gyanvik with your medical journey. Your booking request is now under review by our Academic Coordinator.
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left max-w-md mx-auto space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Booking Reference:</span>
                <span className="font-mono font-bold text-amber-300">{bookingResult.booking?.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Invoice Number:</span>
                <span className="font-mono font-bold text-white">{bookingResult.payment?.invoiceNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-emerald-400">Payment Completed • Mentor Assignment Pending</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Assigned Doctor:</span>
                <span className="text-slate-300">Will be assigned by Admin within 24 Hours</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
