import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { supabase } from '../utils/supabase';
import {
  Crown,
  ShieldCheck,
  UserPlus,
  Users,
  Activity,
  DollarSign,
  Lock,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Stethoscope,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const SuperAdminPortal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('ADMINS'); // ADMINS | MENTORS | AUDIT_LOGS | REVENUE | SETTINGS

  const [admins, setAdmins] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Admin Form
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminRole, setAdminRole] = useState('ADMIN');

  // New Mentor Form
  const [mentorName, setMentorName] = useState('');
  const [mentorEmail, setMentorEmail] = useState('');
  const [mentorCollege, setMentorCollege] = useState('');
  const [mentorRank, setMentorRank] = useState('');
  const [mentorRate, setMentorRate] = useState(799);

  const fetchSuperData = async () => {
    try {
      const [adminsRes, mentorsRes, logsRes, statsRes, transRes] = await Promise.all([
        api.getAllAdmins(),
        api.getMentors(),
        api.getAuditLogs(100),
        api.getPlatformStats(),
        api.getAllPayments()
      ]);

      if (adminsRes.success) setAdmins(adminsRes.admins || []);
      if (mentorsRes.success) setMentors(mentorsRes.mentors || []);
      if (logsRes.success) setAuditLogs(logsRes.logs || []);
      if (statsRes.success) setStats(statsRes.stats);
      if (transRes.success) setTransactions(transRes.payments || []);
    } catch (err) {
      console.error('Failed to load super admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuperData();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!adminName || !adminEmail || !adminPass) return;
    try {
      const res = await api.createAdminAccount({
        fullName: adminName,
        email: adminEmail,
        password: adminPass,
        phone: adminPhone,
        role: adminRole
      });
      if (res.success) {
        setAdmins([...admins, res.admin]);
        setAdminName('');
        setAdminEmail('');
        setAdminPass('');
        setAdminPhone('');
        alert(`Authorized ${adminRole} account provisioned successfully!`);
      }
    } catch {
      alert('Failed to provision account.');
    }
  };

  const handleToggleAdminStatus = async (adminId, currentActive) => {
    try {
      const res = await api.updateAdminRole(adminId, { isActive: !currentActive });
      if (res.success) {
        setAdmins(admins.map(a => a.id === adminId ? { ...a, isActive: !currentActive } : a));
      }
    } catch {
      alert('Action blocked.');
    }
  };

  const handleRecruitMentor = async (e) => {
    e.preventDefault();
    if (!mentorName || !mentorEmail || !mentorCollege) return;
    try {
      const res = await api.createMentor({
        fullName: mentorName,
        email: mentorEmail,
        medicalCollege: mentorCollege,
        neetAirRank: parseInt(mentorRank, 10),
        hourlyRateInr: parseInt(mentorRate, 10)
      });
      if (res.success) {
        setMentors([...mentors, res.mentor]);
        setMentorName('');
        setMentorEmail('');
        setMentorCollege('');
        setMentorRank('');
        alert('Verified Doctor recruited and added to Mentorship Roster!');
      }
    } catch {
      alert('Failed to recruit mentor.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Super Admin Top Hero */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold mb-2">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Highest Security Clearance & Platform Ownership</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-cinematic tracking-tight">
              SUPER ADMIN GOVERNANCE CONSOLE
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Welcome, <strong className="text-amber-400">{user?.fullName}</strong> ({user?.email}) • Platform Director
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-xs font-mono text-amber-300">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Multi-Tenant RLS & Audit Watchdog Active</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-1 text-xs font-bold uppercase tracking-wider">
          {[
            { id: 'ADMINS', label: 'Admin Governance & Provisioning', icon: ShieldCheck },
            { id: 'MENTORS', label: 'Mentor Recruitment & Directory', icon: Stethoscope },
            { id: 'AUDIT_LOGS', label: 'Security Audit Logs', icon: Activity },
            { id: 'REVENUE', label: 'Monetization & Invoices', icon: DollarSign },
            { id: 'SETTINGS', label: 'Platform Feature Controls', icon: Layers }
          ].map(tab => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'border-amber-400 text-amber-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ADMIN GOVERNANCE */}
        {activeTab === 'ADMINS' && (
          <div className="space-y-6 animate-fade-in">
            {/* Provision Admin Form */}
            <form onSubmit={handleCreateAdmin} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>Provision New Authorized Admin Account</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={e => setAdminName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-400"
                    placeholder="Prof. Rajeshwar"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Organizational Email *</label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-400"
                    placeholder="admin2@gyanvik.edu.in"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Initial Password *</label>
                  <input
                    type="password"
                    required
                    value={adminPass}
                    onChange={e => setAdminPass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-amber-400"
                    placeholder="••••••••••••"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Assigned Role</label>
                  <select
                    value={adminRole}
                    onChange={e => setAdminRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                  >
                    <option value="ADMIN">ADMIN (Operational Academic Controller)</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN (Platform Ownership)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={adminPhone}
                    onChange={e => setAdminPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                    placeholder="+91 98765 00000"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider"
              >
                Provision Admin Account
              </button>
            </form>

            {/* Admin Roster List */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Active Authorized Administrators ({admins.length})</h4>
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 uppercase font-semibold">
                      <th className="py-3 px-4">Admin Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {admins.map(a => (
                      <tr key={a.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-white">{a.fullName}</td>
                        <td className="py-3 px-4 font-mono">{a.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            a.role === 'SUPER_ADMIN' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {a.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            a.isActive ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {a.isActive ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {a.id !== 'super-admin-001' && (
                            <button
                              onClick={() => handleToggleAdminStatus(a.id, a.isActive)}
                              className={`px-3 py-1 rounded text-xs font-semibold ${
                                a.isActive
                                  ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                              }`}
                            >
                              {a.isActive ? 'Suspend' : 'Reactivate'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MENTOR RECRUITMENT */}
        {activeTab === 'MENTORS' && (
          <div className="space-y-6 animate-fade-in">
            {/* Recruit Mentor Form */}
            <form onSubmit={handleRecruitMentor} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-400" />
                <span>Recruit Verified MBBS Doctor Mentor</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Doctor Name *</label>
                  <input
                    type="text"
                    required
                    value={mentorName}
                    onChange={e => setMentorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                    placeholder="Dr. Aryan Sharma"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={mentorEmail}
                    onChange={e => setMentorEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                    placeholder="dr.aryan@gyanvik.edu.in"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Medical College *</label>
                  <input
                    type="text"
                    required
                    value={mentorCollege}
                    onChange={e => setMentorCollege(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                    placeholder="AIIMS New Delhi"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">NEET AIR Rank</label>
                  <input
                    type="number"
                    value={mentorRank}
                    onChange={e => setMentorRank(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none"
                    placeholder="42"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider"
              >
                Verify & Add to Mentorship Panel
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {mentors.map(m => (
                <div key={m.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{m.fullName}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                      AIR {m.neetAirRank}
                    </span>
                  </div>
                  <p className="text-slate-300">{m.medicalCollege}</p>
                  <p className="text-slate-400">{m.email}</p>
                  <span className="text-emerald-400 block pt-1">Active Mentor • {m.totalMentees || 0} Mentees</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT LOGS */}
        {activeTab === 'AUDIT_LOGS' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Platform Security & Activity Audit Log</h3>
                <p className="text-xs text-slate-400">Chronological ledger of logins, configurations, and administrative actions.</p>
              </div>
              <span className="text-xs font-mono text-amber-400">{auditLogs.length} Records Logged</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 max-h-[500px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-slate-950 text-slate-400 uppercase font-semibold">
                  <tr className="border-b border-slate-800">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Resource</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-slate-300">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 text-slate-500">{new Date(log.createdAt).toLocaleTimeString()}</td>
                      <td className="py-2.5 px-4 text-white font-sans">{log.userEmail || 'System'}</td>
                      <td className="py-2.5 px-4 text-amber-400">{log.userRole || 'SYSTEM'}</td>
                      <td className="py-2.5 px-4 font-bold text-cyan-400">{log.action}</td>
                      <td className="py-2.5 px-4 text-slate-400">{log.resourceType}:{log.resourceId}</td>
                      <td className="py-2.5 px-4 text-[11px] text-slate-400 max-w-xs truncate">
                        {JSON.stringify(log.details)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: REVENUE & TRANSACTIONS */}
        {activeTab === 'REVENUE' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase font-bold">Total Gross Subscriptions (Sandbox)</span>
                <div className="text-4xl font-black text-emerald-400 mt-1">₹{stats?.totalRevenueInr || 0}.00</div>
              </div>
              <div className="text-xs text-slate-400 text-right">
                <span>Transactions Recorded: <strong className="text-white">{transactions.length}</strong></span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Recent Student Transactions & Invoices</h4>
              {transactions.map(t => (
                <div key={t.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{t.planName}</span>
                    <div className="text-slate-400 mt-0.5">
                      Student: <strong className="text-slate-300">{t.studentName}</strong> • Invoice: <strong className="text-amber-400 font-mono">{t.invoiceNumber}</strong>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-emerald-400 text-sm">₹{t.amountInr}</span>
                    <span className="block text-[10px] text-slate-500 uppercase">{t.paymentMethod}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PLATFORM FEATURE CONTROLS & SUPABASE CLOUD STATUS */}
        {activeTab === 'SETTINGS' && (
          <div className="max-w-3xl space-y-6 text-xs animate-fade-in">
            {/* Supabase Live Integration Banner */}
            <div className="p-6 rounded-3xl bg-emerald-950/40 border border-emerald-500/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                    ⚡
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Supabase Cloud PostgreSQL Active</h3>
                    <p className="text-[11px] text-slate-300">Connected Endpoint: https://wqtavzkfwbnhefabgzou.supabase.co</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold uppercase text-[10px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>CLOUD CONNECTED</span>
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Database Engine:</span>
                  <span className="font-semibold text-white">PostgreSQL (Supabase Managed Cloud)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Security Architecture:</span>
                  <span className="font-semibold text-emerald-400">Row-Level Security (RLS) Active</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Migration File:</span>
                  <span className="font-mono text-amber-300">supabase/migrations/20261117_init_gyanvik_schema.sql</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Platform-Wide Feature Availability Toggles</h3>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">NEET Preparation Track</span>
                    <span className="text-slate-400">Full PYQ player, NCERT library & mock examinations.</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                    ENABLED (ACTIVE)
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">IIT-JEE & GATE Tracks</span>
                    <span className="text-slate-400">Engineering modules preview status.</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-bold text-[10px]">
                    COMING SOON
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">AI Chatbot Module</span>
                    <span className="text-slate-400">Disabled until approved per mentor initial PDF scope guidelines.</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                    LOCKED BY SCOPE
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Payment Gateway Sandbox</span>
                    <span className="text-slate-400">Mock payment processing enabled without real money charges.</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                    SANDBOX MODE
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
