'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Settings, Save, Shield, CreditCard, FileText, CheckCircle, Sparkles } from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'plans' | 'legal' | 'security'>('general');
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'JainSaathi',
    supportEmail: 'support@jainsaathi.com',
    supportPhone: '+91 98765 43210',
    contactAddress: 'Nariman Point, Mumbai, Maharashtra, India',
  });

  // Password Change States
  const [passwordState, setPasswordState] = useState({
    newPassword: '',
    confirmPassword: '',
    otp: '',
    step: 1, // 1: Enter passwords, 2: Enter OTP
    loading: false,
    error: '',
    success: ''
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const { data } = await supabase.from('plans').select('*').order('id', { ascending: true });
    if (data) setPlans(data);
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setPasswordState(p => ({ ...p, error: 'Passwords do not match.' }));
      return;
    }
    if (passwordState.newPassword.length < 8) {
      setPasswordState(p => ({ ...p, error: 'Password must be at least 8 characters.' }));
      return;
    }

    setPasswordState(p => ({ ...p, loading: true, error: '' }));
    try {
      const res = await fetch('/api/admin/auth/send-otp', { method: 'POST' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      
      setPasswordState(p => ({ ...p, step: 2, loading: false }));
    } catch (err: any) {
      setPasswordState(p => ({ ...p, error: err.message, loading: false }));
    }
  };

  const handleVerifyOTPAndChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordState(p => ({ ...p, loading: true, error: '' }));
    try {
      // 1. Verify OTP
      const res = await fetch('/api/admin/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: passwordState.otp })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      // 2. Change password via Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: passwordState.newPassword
      });
      if (error) throw error;

      setPasswordState({
        newPassword: '', confirmPassword: '', otp: '',
        step: 1, loading: false, error: '', success: 'Password successfully changed!'
      });
      setTimeout(() => setPasswordState(p => ({ ...p, success: '' })), 5000);
    } catch (err: any) {
      setPasswordState(p => ({ ...p, error: err.message, loading: false }));
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#1A1822] tracking-tight">
          Platform Settings
        </h1>
        <p className="text-xs font-semibold text-gray-400 mt-0.5 uppercase tracking-wider">
          Configure Global Platform Rules, Business Info & Pricing Plans
        </p>
      </div>

      {/* Tabs */}
      <div className="inline-flex items-center gap-1.5 p-1.5 bg-gray-100 rounded-full border border-gray-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-5 py-2 rounded-full transition-all ${
            activeTab === 'general' ? 'bg-[#1E1B24] text-white shadow-md' : 'text-gray-600 hover:text-black'
          }`}
        >
          General & Contact
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-5 py-2 rounded-full transition-all ${
            activeTab === 'plans' ? 'bg-[#1E1B24] text-white shadow-md' : 'text-gray-600 hover:text-black'
          }`}
        >
          Pricing Plans
        </button>
        <button
          onClick={() => setActiveTab('legal')}
          className={`px-5 py-2 rounded-full transition-all ${
            activeTab === 'legal' ? 'bg-[#1E1B24] text-white shadow-md' : 'text-gray-600 hover:text-black'
          }`}
        >
          Policies & Terms
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-5 py-2 rounded-full transition-all ${
            activeTab === 'security' ? 'bg-[#8F0038] text-white shadow-md' : 'text-gray-600 hover:text-black'
          }`}
        >
          Security & Auth
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="bg-white rounded-[28px] border border-gray-150 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-extrabold text-[#1A1822]">Platform Identity & Support</h2>
              <p className="text-xs text-gray-400">Global support channels displayed to matrimonial candidates</p>
            </div>
            {saveSuccess && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                <CheckCircle className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Platform Title</label>
              <input 
                type="text"
                value={generalSettings.platformName}
                onChange={(e) => setGeneralSettings({ ...generalSettings, platformName: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#C59A4E]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Support Email</label>
              <input 
                type="email"
                value={generalSettings.supportEmail}
                onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#C59A4E]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Support Phone Hotline</label>
              <input 
                type="text"
                value={generalSettings.supportPhone}
                onChange={(e) => setGeneralSettings({ ...generalSettings, supportPhone: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#C59A4E]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Headquarters Office</label>
              <input 
                type="text"
                value={generalSettings.contactAddress}
                onChange={(e) => setGeneralSettings({ ...generalSettings, contactAddress: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#C59A4E]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-full bg-[#1E1B24] hover:bg-[#C59A4E] hover:text-[#121214] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'plans' && (
        <div className="bg-white rounded-[28px] border border-gray-150 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-extrabold text-[#1A1822]">Matrimonial Subscription Plans</h2>
              <p className="text-xs text-gray-400">Database-backed subscription tiers available for purchase</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No plans currently configured in database.</p>
            ) : (
              plans.map((p) => (
                <div key={p.id} className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase text-[#C59A4E]">{p.code}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Active</span>
                  </div>
                  <h3 className="text-lg font-black text-[#1A1822]">{p.name}</h3>
                  <p className="text-2xl font-black text-[#1A1822]">₹{p.price_inr}</p>
                  <p className="text-xs text-gray-500 font-medium">Duration: {p.duration_days} Days</p>
                  <ul className="text-xs text-gray-600 space-y-1 pt-2 border-t border-gray-200/60">
                    <li>• {p.contact_reveal_limit || 25} Contact Reveals</li>
                    <li>• {p.biodata_download_limit || 10} Biodata Downloads</li>
                    <li>• {p.is_featured_allowed ? 'Featured Profile Placement' : 'Standard Placement'}</li>
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'legal' && (
        <div className="bg-white rounded-[28px] border border-gray-150 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-extrabold text-[#1A1822]">Terms of Service & Privacy Policy</h2>
              <p className="text-xs text-gray-400">Published legal agreements governing the platform</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-[#1A1822]">Privacy Policy Document</p>
                <p className="text-xs text-gray-500">Accessible at /privacy for all registered users</p>
              </div>
              <Link href="/privacy" target="_blank" className="text-xs font-bold text-[#C59A4E] hover:underline">
                View Published Policy ↗
              </Link>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-[#1A1822]">Terms & Conditions Document</p>
                <p className="text-xs text-gray-500">Accessible at /terms for all registered users</p>
              </div>
              <Link href="/terms" target="_blank" className="text-xs font-bold text-[#C59A4E] hover:underline">
                View Published Terms ↗
              </Link>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-white rounded-[28px] border border-gray-150 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-extrabold text-[#1A1822]">Account Security</h2>
              <p className="text-xs text-gray-400">Manage admin authentication and access controls</p>
            </div>
            {passwordState.success && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                <CheckCircle className="w-3.5 h-3.5" /> {passwordState.success}
              </span>
            )}
          </div>

          <div className="max-w-md">
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#8F0038]" /> Change Password (2FA Required)
            </h3>
            
            {passwordState.error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">
                {passwordState.error}
              </div>
            )}

            {passwordState.step === 1 ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">New Password</label>
                  <input 
                    type="password"
                    required
                    value={passwordState.newPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#8F0038]"
                    placeholder="Minimum 8 characters"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm New Password</label>
                  <input 
                    type="password"
                    required
                    value={passwordState.confirmPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-[#8F0038]"
                    placeholder="Repeat password"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={passwordState.loading}
                  className="w-full mt-2 px-6 py-3 rounded-2xl bg-[#8F0038] hover:bg-[#7A002F] text-white font-bold text-xs shadow-md transition-all flex justify-center items-center gap-2"
                >
                  {passwordState.loading ? 'Sending OTP...' : 'Request OTP to Email'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTPAndChangePassword} className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-2">
                  <p className="text-xs font-semibold text-amber-800">
                    A 6-digit verification code has been sent to your admin email address. Please enter it below to confirm the password change.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">6-Digit OTP</label>
                  <input 
                    type="text"
                    required
                    maxLength={6}
                    value={passwordState.otp}
                    onChange={(e) => setPasswordState({ ...passwordState, otp: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-lg font-bold tracking-widest text-center focus:outline-none focus:border-[#8F0038]"
                    placeholder="------"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button 
                    type="button"
                    onClick={() => setPasswordState({ ...passwordState, step: 1, otp: '', error: '' })}
                    className="w-1/3 px-4 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={passwordState.loading}
                    className="w-2/3 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex justify-center items-center"
                  >
                    {passwordState.loading ? 'Verifying...' : 'Verify & Change Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
