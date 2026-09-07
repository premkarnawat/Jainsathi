'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Settings, Save, Shield, CreditCard, FileText, CheckCircle2, 
  Sparkles, Megaphone, Trash2, Edit3, Plus, X, Eye, Phone, Mail, MapPin, Clock, AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'plans' | 'legal' | 'broadcasts' | 'security'>('general');
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 1. General & Contact Info State
  const [contactInfo, setContactInfo] = useState({
    email: 'support@jainsaathi.com',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    address: 'Nariman Point, Mumbai, Maharashtra 400021, India',
    supportHours: 'Monday - Saturday: 9:00 AM - 7:00 PM IST',
    platformName: 'JainSaathi',
    tagline: 'Find Your Jain Saathi',
  });

  // 2. Plans State & Editor Modal
  const [plans, setPlans] = useState<any[]>([]);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);
  const [isNewPlan, setIsNewPlan] = useState(false);

  // 3. Legal Documents State
  const [legalDocType, setLegalDocType] = useState<'privacy' | 'terms'>('privacy');
  const [privacyPolicy, setPrivacyPolicy] = useState({
    title: 'Privacy Policy',
    lastUpdated: 'August 2026',
    content: '',
  });
  const [termsConditions, setTermsConditions] = useState({
    title: 'Terms & Conditions',
    lastUpdated: 'August 2026',
    content: '',
  });

  // 4. Broadcast Notices State
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    message: '',
    priority: 'info',
  });

  // 5. Password Security State
  const [passwordState, setPasswordState] = useState({
    newPassword: '',
    confirmPassword: '',
    otp: '',
    step: 1,
    loading: false,
    error: '',
    success: '',
  });

  // Fetch initial settings, plans, and broadcasts
  useEffect(() => {
    fetchSettings();
    fetchPlans();
    fetchBroadcasts();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        if (data.settings.contact_info) {
          setContactInfo(prev => ({ ...prev, ...data.settings.contact_info }));
        }
        if (data.settings.privacy_policy) {
          setPrivacyPolicy(data.settings.privacy_policy);
        }
        if (data.settings.terms_conditions) {
          setTermsConditions(data.settings.terms_conditions);
        }
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/admin/plans');
      const data = await res.json();
      if (data.success && Array.isArray(data.plans)) {
        setPlans(data.plans);
      }
    } catch (err) {
      console.error('Failed to load plans:', err);
    }
  };

  const fetchBroadcasts = async () => {
    try {
      const res = await fetch('/api/admin/broadcasts');
      const data = await res.json();
      if (data.success && Array.isArray(data.broadcasts)) {
        setBroadcasts(data.broadcasts);
      }
    } catch (err) {
      console.error('Failed to load broadcasts:', err);
    }
  };

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setSaveMessage({ text, type });
    setTimeout(() => setSaveMessage(null), 4000);
  };

  // Save General & Contact Settings
  const handleSaveContactInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'contact_info', value: contactInfo }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Contact information saved and updated across website!');
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      showNotification(err.message || 'Failed to save contact settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Save Legal Document (Privacy or Terms)
  const handleSaveLegalDoc = async () => {
    setLoading(true);
    try {
      const key = legalDocType === 'privacy' ? 'privacy_policy' : 'terms_conditions';
      const value = legalDocType === 'privacy' ? privacyPolicy : termsConditions;

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`${legalDocType === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'} saved and published live!`);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      showNotification(err.message || 'Failed to publish legal document', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Save / Update Plan
  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    setLoading(true);
    try {
      const method = isNewPlan ? 'POST' : 'PUT';
      const res = await fetch('/api/admin/plans', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPlan),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Plan ${isNewPlan ? 'created' : 'updated'} successfully!`);
        setEditingPlan(null);
        setIsNewPlan(false);
        fetchPlans();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      showNotification(err.message || 'Failed to save plan', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Deactivate Plan
  const handleDeletePlan = async (id: number) => {
    if (!confirm('Are you sure you want to deactivate this membership plan?')) return;
    try {
      const res = await fetch(`/api/admin/plans?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('Plan deactivated successfully');
        fetchPlans();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Send Broadcast Announcement
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.message) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(broadcastForm),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Broadcast announcement sent to all users!');
        setBroadcastForm({ title: '', message: '', priority: 'info' });
        fetchBroadcasts();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      showNotification(err.message || 'Failed to send broadcast', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete Broadcast Announcement
  const handleDeleteBroadcast = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/broadcasts?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('Broadcast removed');
        fetchBroadcasts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto select-none">
      
      {/* Save Notification Banner */}
      {saveMessage && (
        <div className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in ${
          saveMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {saveMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{saveMessage.text}</span>
          </div>
          <button type="button" onClick={() => setSaveMessage(null)} className="font-bold px-2">✕</button>
        </div>
      )}

      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Settings & CMS Management
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage live site content, pricing tiers, legal policies, broadcasts, and security
        </p>
      </div>

      {/* Tab Selector Navigation */}
      <div className="flex items-center gap-1.5 p-1.5 bg-black/5 rounded-2xl border border-black/5 overflow-x-auto text-xs font-bold">
        {[
          { id: 'general', label: 'Contact Info & Brand', icon: Settings },
          { id: 'plans', label: 'Pricing Plans', icon: CreditCard },
          { id: 'legal', label: 'Legal & Policies', icon: FileText },
          { id: 'broadcasts', label: 'Broadcast Notices', icon: Megaphone },
          { id: 'security', label: 'Account Security', icon: Shield },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-[#8F173D] text-white shadow-xs font-bold' 
                  : 'text-gray-600 hover:text-black hover:bg-white/50'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================
          TAB 1: CONTACT INFO & BRAND
          ============================================================ */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveContactInfo} className="bg-white/80 rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs space-y-5">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-base font-extrabold text-[#19191D]">Platform Contact Information</h2>
            <p className="text-xs text-gray-400">Updates the public footer, contact us section, and help center</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Support Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Support Phone / Helpline</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Official WhatsApp Number</label>
              <input 
                type="text"
                value={contactInfo.whatsapp}
                onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Support Operating Hours</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={contactInfo.supportHours}
                  onChange={(e) => setContactInfo({ ...contactInfo, supportHours: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Headquarters Office Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <textarea 
                  rows={2}
                  value={contactInfo.address}
                  onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-[#8F173D] hover:bg-[#6E1735] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? 'Saving...' : 'Save & Publish Live'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ============================================================
          TAB 2: PRICING PLANS CRUD
          ============================================================ */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#19191D]">Matrimonial Subscription Plans</h2>
              <p className="text-xs text-gray-400">Directly edit pricing, contact reveal quotas, biodatas, and active status</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsNewPlan(true);
                setEditingPlan({
                  name: '',
                  code: 'custom_' + Date.now().toString().slice(-4),
                  priceInr: 1999,
                  durationDays: 90,
                  contactRevealLimit: 15,
                  biodataDownloadLimit: 30,
                  isFeaturedAllowed: false,
                  features: ['Verified Profile Badge', 'Direct Contact Access'],
                  isActive: true,
                });
              }}
              className="px-3.5 py-2 rounded-xl bg-[#D4AF37] text-[#121214] hover:bg-[#C59A4E] text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Plan</span>
            </button>
          </div>

          {/* Plan Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((p) => (
              <div 
                key={p.id}
                className={`bg-white/90 rounded-2xl p-4 border transition-all space-y-3 flex flex-col justify-between ${
                  p.is_active ? 'border-gray-200' : 'border-gray-200 opacity-60 bg-gray-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#D4AF37]">
                      {p.code}
                    </span>
                    <span className={`px-2 py-0.2 rounded-full text-[9px] font-extrabold uppercase ${
                      p.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <h3 className="font-serif font-black text-lg text-[#19191D]">{p.name}</h3>
                  <div className="flex items-baseline gap-1 my-1">
                    <span className="font-serif font-black text-2xl text-[#8F173D]">
                      {Number(p.price_inr) === 0 ? 'Free' : `₹${Number(p.price_inr).toLocaleString('en-IN')}`}
                    </span>
                    <span className="text-[10px] text-gray-500 font-semibold">/ {p.duration_days} Days</span>
                  </div>

                  <div className="pt-2 border-t border-gray-100 space-y-1 text-xs text-gray-600">
                    <p>• <strong>{p.contact_reveal_limit}</strong> Contact Reveals</p>
                    <p>• <strong>{p.biodata_download_limit}</strong> Biodata Downloads</p>
                    <p>• {p.is_featured_allowed ? '✨ Featured Placement' : 'Standard Placement'}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewPlan(false);
                      setEditingPlan({
                        id: p.id,
                        name: p.name,
                        code: p.code,
                        priceInr: p.price_inr,
                        durationDays: p.duration_days,
                        contactRevealLimit: p.contact_reveal_limit,
                        biodataDownloadLimit: p.biodata_download_limit,
                        isFeaturedAllowed: p.is_featured_allowed,
                        features: p.features || [],
                        isActive: p.is_active,
                      });
                    }}
                    className="flex-1 py-1.5 rounded-xl bg-gray-100 hover:bg-[#8F173D] hover:text-white text-gray-700 text-xs font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>

                  {p.is_active && (
                    <button
                      type="button"
                      onClick={() => handleDeletePlan(p.id)}
                      className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                      title="Deactivate Plan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Edit / Create Plan Modal */}
          {editingPlan && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-gray-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="font-serif font-black text-lg text-[#19191D]">
                    {isNewPlan ? 'Create New Pricing Tier' : `Edit Plan: ${editingPlan.name}`}
                  </h3>
                  <button type="button" onClick={() => setEditingPlan(null)} className="p-1 text-gray-400 hover:text-black">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSavePlan} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-gray-500 uppercase block mb-1">Plan Name</label>
                      <input 
                        type="text" 
                        value={editingPlan.name}
                        onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-500 uppercase block mb-1">Price (₹ INR)</label>
                      <input 
                        type="number" 
                        value={editingPlan.priceInr}
                        onChange={(e) => setEditingPlan({ ...editingPlan, priceInr: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-gray-500 uppercase block mb-1">Duration (Days)</label>
                      <input 
                        type="number" 
                        value={editingPlan.durationDays}
                        onChange={(e) => setEditingPlan({ ...editingPlan, durationDays: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-500 uppercase block mb-1">Contact Reveals</label>
                      <input 
                        type="number" 
                        value={editingPlan.contactRevealLimit}
                        onChange={(e) => setEditingPlan({ ...editingPlan, contactRevealLimit: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-500 uppercase block mb-1">Biodata Downloads</label>
                      <input 
                        type="number" 
                        value={editingPlan.biodataDownloadLimit}
                        onChange={(e) => setEditingPlan({ ...editingPlan, biodataDownloadLimit: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold">
                      <input 
                        type="checkbox"
                        checked={editingPlan.isFeaturedAllowed}
                        onChange={(e) => setEditingPlan({ ...editingPlan, isFeaturedAllowed: e.target.checked })}
                        className="rounded text-[#8F173D]"
                      />
                      <span>Enable Featured Listing</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold">
                      <input 
                        type="checkbox"
                        checked={editingPlan.isActive}
                        onChange={(e) => setEditingPlan({ ...editingPlan, isActive: e.target.checked })}
                        className="rounded text-[#8F173D]"
                      />
                      <span>Active for Purchase</span>
                    </label>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                    <button 
                      type="button" 
                      onClick={() => setEditingPlan(null)} 
                      className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 font-bold"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="px-5 py-2 rounded-xl bg-[#8F173D] hover:bg-[#6E1735] text-white font-bold"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          TAB 3: LEGAL POLICIES CMS (Privacy Policy & Terms)
          ============================================================ */}
      {activeTab === 'legal' && (
        <div className="bg-white/80 rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-[#19191D]">Live Document CMS</h2>
              <p className="text-xs text-gray-400">Content edited here directly updates /privacy and /terms for all users</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setLegalDocType('privacy')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    legalDocType === 'privacy' ? 'bg-[#8F173D] text-white' : 'text-gray-600'
                  }`}
                >
                  Privacy Policy
                </button>
                <button
                  type="button"
                  onClick={() => setLegalDocType('terms')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    legalDocType === 'terms' ? 'bg-[#8F173D] text-white' : 'text-gray-600'
                  }`}
                >
                  Terms & Conditions
                </button>
              </div>

              <Link
                href={legalDocType === 'privacy' ? '/privacy' : '/terms'}
                target="_blank"
                className="px-3 py-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Live ↗</span>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-gray-500 uppercase block mb-1">Document Title</label>
                <input
                  type="text"
                  value={legalDocType === 'privacy' ? privacyPolicy.title : termsConditions.title}
                  onChange={(e) => {
                    if (legalDocType === 'privacy') {
                      setPrivacyPolicy({ ...privacyPolicy, title: e.target.value });
                    } else {
                      setTermsConditions({ ...termsConditions, title: e.target.value });
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-gray-500 uppercase block mb-1">Last Updated Notice</label>
                <input
                  type="text"
                  value={legalDocType === 'privacy' ? privacyPolicy.lastUpdated : termsConditions.lastUpdated}
                  onChange={(e) => {
                    if (legalDocType === 'privacy') {
                      setPrivacyPolicy({ ...privacyPolicy, lastUpdated: e.target.value });
                    } else {
                      setTermsConditions({ ...termsConditions, lastUpdated: e.target.value });
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-500 uppercase block mb-1">
                Document Body Content (Markdown Supported)
              </label>
              <textarea
                rows={12}
                value={legalDocType === 'privacy' ? privacyPolicy.content : termsConditions.content}
                onChange={(e) => {
                  if (legalDocType === 'privacy') {
                    setPrivacyPolicy({ ...privacyPolicy, content: e.target.value });
                  } else {
                    setTermsConditions({ ...termsConditions, content: e.target.value });
                  }
                }}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs leading-relaxed focus:outline-none"
                placeholder="Write legal policy sections here..."
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              disabled={loading}
              onClick={handleSaveLegalDoc}
              className="px-5 py-2.5 rounded-xl bg-[#8F173D] hover:bg-[#6E1735] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? 'Publishing...' : 'Save & Publish Live'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 4: BROADCAST NOTICES
          ============================================================ */}
      {activeTab === 'broadcasts' && (
        <div className="space-y-6">
          {/* Create Broadcast Form */}
          <form onSubmit={handleSendBroadcast} className="bg-white/80 rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-base font-extrabold text-[#19191D] flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#8F173D]" />
                <span>Send System-Wide Announcement</span>
              </h2>
              <p className="text-xs text-gray-400">
                Notice will immediately popup on all user dashboards, and remain in their Notification Center until deleted.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-500 uppercase block mb-1">Announcement Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Diwali Mahotsav Matrimonial Meet"
                    value={broadcastForm.title}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-500 uppercase block mb-1">Priority / Category</label>
                  <select
                    value={broadcastForm.priority}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                  >
                    <option value="info">Information (Blue)</option>
                    <option value="celebration">Celebration / Festival (Gold)</option>
                    <option value="warning">Important Alert (Amber)</option>
                    <option value="urgent">Urgent Notice (Red)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-500 uppercase block mb-1">Notice Message</label>
                <textarea
                  rows={3}
                  placeholder="Type the announcement to be broadcasted to all registered Jain candidates..."
                  value={broadcastForm.message}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                  required
                />
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-[#8F173D] hover:bg-[#6E1735] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>{loading ? 'Broadcasting...' : 'Broadcast to All Users'}</span>
              </button>
            </div>
          </form>

          {/* Active Broadcasts List */}
          <div className="bg-white/80 rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#19191D]">Active Broadcasts ({broadcasts.length})</h3>

            {broadcasts.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No broadcasts currently active.</p>
            ) : (
              <div className="space-y-2.5">
                {broadcasts.map((b) => (
                  <div key={b.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.2 rounded-full text-[9px] font-extrabold uppercase ${
                          b.priority === 'celebration' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
                        }`}>
                          {b.priority}
                        </span>
                        <h4 className="font-bold text-sm text-[#19191D]">{b.title}</h4>
                      </div>
                      <p className="text-gray-600 mt-1 leading-relaxed">{b.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1.5 font-mono">
                        Sent on {new Date(b.created_at).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteBroadcast(b.id)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Broadcast"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 5: ACCOUNT SECURITY & OTP
          ============================================================ */}
      {activeTab === 'security' && (
        <div className="bg-white/80 rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs space-y-5">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-base font-extrabold text-[#19191D]">Administrator Security</h2>
            <p className="text-xs text-gray-400">Change master administrator password with 2FA email verification</p>
          </div>

          <form onSubmit={async (e) => {
            e.preventDefault();
            if (passwordState.step === 1) {
              if (passwordState.newPassword !== passwordState.confirmPassword) {
                setPasswordState(p => ({ ...p, error: 'Passwords do not match' }));
                return;
              }
              if (passwordState.newPassword.length < 8) {
                setPasswordState(p => ({ ...p, error: 'Password must be at least 8 characters' }));
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
            } else {
              // Step 2
              setPasswordState(p => ({ ...p, loading: true, error: '' }));
              try {
                const res = await fetch('/api/admin/auth/verify-otp', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ otp: passwordState.otp }),
                });
                const data = await res.json();
                if (!data.success) throw new Error(data.error);

                await supabase.auth.updateUser({ password: passwordState.newPassword });
                showNotification('Password successfully changed!');
                setPasswordState({ newPassword: '', confirmPassword: '', otp: '', step: 1, loading: false, error: '', success: '' });
              } catch (err: any) {
                setPasswordState(p => ({ ...p, error: err.message, loading: false }));
              }
            }
          }} className="space-y-3.5 max-w-md text-xs">
            {passwordState.error && (
              <p className="text-xs text-red-600 font-semibold">{passwordState.error}</p>
            )}

            {passwordState.step === 1 ? (
              <>
                <div>
                  <label className="font-bold text-gray-500 uppercase block mb-1">New Password</label>
                  <input 
                    type="password"
                    value={passwordState.newPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-500 uppercase block mb-1">Confirm New Password</label>
                  <input 
                    type="password"
                    value={passwordState.confirmPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={passwordState.loading}
                  className="px-5 py-2.5 rounded-xl bg-[#8F173D] text-white font-bold"
                >
                  {passwordState.loading ? 'Sending OTP...' : 'Send Verification OTP'}
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="font-bold text-gray-500 uppercase block mb-1">Enter 6-Digit Email OTP</label>
                  <input 
                    type="text"
                    maxLength={6}
                    value={passwordState.otp}
                    onChange={(e) => setPasswordState({ ...passwordState, otp: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-center tracking-widest text-lg font-bold"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={passwordState.loading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  {passwordState.loading ? 'Verifying...' : 'Verify OTP & Change Password'}
                </button>
              </>
            )}
          </form>
        </div>
      )}

    </div>
  );
}
