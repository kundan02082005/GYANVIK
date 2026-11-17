import React, { useState } from 'react';
import { api } from '../services/api';
import { ShieldCheck, CreditCard, Smartphone, Building, CheckCircle2, X, Download, FileText } from 'lucide-react';

export const SandboxPaymentModal = ({ isOpen, onClose, plan, onSuccess }) => {
  const [method, setMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  if (!isOpen || !plan) return null;

  const amount = plan.amount || 1499;
  const gst = Math.round(amount * 0.18);
  const total = amount + gst;

  const handleSimulatePayment = async () => {
    setLoading(true);
    try {
      const orderRes = await api.createPaymentOrder({
        planName: plan.title || 'Gyanvik Premium Pro',
        planTier: plan.tier || 'NEET_PRO',
        amountInr: amount
      });

      const verifyRes = await api.verifyPayment({
        planName: plan.title || 'Gyanvik Premium Pro',
        planTier: plan.tier || 'NEET_PRO',
        amountInr: total,
        paymentMethod: `${method} (Sandbox)`,
        gatewayOrderId: orderRes.order?.orderId
      });

      if (verifyRes.success) {
        setPaymentSuccess(verifyRes.payment);
        onSuccess?.(verifyRes.payment);
      }
    } catch (err) {
      console.error('Payment failed:', err);
      alert('Sandbox payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!paymentSuccess ? (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sandbox Mode (Zero Risk Simulation)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Gyanvik Secure Checkout
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Subscribing to: <strong className="text-white">{plan.title}</strong>
              </p>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Base Price:</span>
                <span className="font-mono font-semibold">₹{amount}.00</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST (18% Educational Rate):</span>
                <span className="font-mono">₹{gst}.00</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                <span>Total Amount Payable:</span>
                <span className="font-mono text-amber-400 text-base">₹{total}.00</span>
              </div>
            </div>

            {/* Simulated Payment Methods */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Select Sandbox Test Instrument:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: Smartphone },
                  { id: 'Card', label: 'Credit/Debit', icon: CreditCard },
                  { id: 'NetBanking', label: 'Net Banking', icon: Building }
                ].map(item => {
                  const Icon = item.icon;
                  const isSelected = method === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setMethod(item.id)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action button */}
            <button
              disabled={loading}
              onClick={handleSimulatePayment}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>{loading ? 'Authorizing in Sandbox...' : `Simulate Payment of ₹${total}`}</span>
            </button>
          </div>
        ) : (
          /* Receipt Screen */
          <div className="text-center py-4 space-y-5 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-white">
              Payment Successful!
            </h3>
            <p className="text-xs text-slate-300">
              Your subscription is now active on your student profile.
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Invoice Number:</span>
                <span className="font-mono font-bold text-amber-300">{paymentSuccess.invoiceNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Plan:</span>
                <span className="font-semibold text-white">{paymentSuccess.planName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-mono font-bold text-emerald-400">₹{paymentSuccess.amountInr} (Sandbox)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-emerald-400">CONFIRMED & ACTIVE</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider"
            >
              Continue to Premium Hub
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
