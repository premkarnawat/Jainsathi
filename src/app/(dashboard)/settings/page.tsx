'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, CreditCard, Bell, Lock, EyeOff, LogOut, 
  ChevronRight, AlertCircle, DownloadCloud, Eye
} from 'lucide-react';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const { profile, subscription, loading } = useCandidateProfile();
  const [privacies, setPrivacies] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchPrivacies() {
      if (profile) {
        const { data } = await supabase
          .from('profile_privacies')
          .select('*')
          .eq('candidate_id', profile.id)
          .single();
        if (data) setPrivacies(data);
      }
    }
    fetchPrivacies();
  }, [profile]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const updatePrivacy = async (field: string, value: string) => {
    if (!profile) return;
    setSaving(true);
    const newPrivacies = { ...privacies, [field]: value };
    setPrivacies(newPrivacies);
    try {
      await supabase
        .from('profile_privacies')
        .upsert({ candidate_id: profile.id, ...newPrivacies });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#C99A3D] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="bg-[#FFFDFB] p-8 rounded-[32px] border border-[#EBD9DC] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#F7E5EA] to-transparent rounded-bl-full pointer-events-none" />
        <div className="relative z-10">
          <h1 className="font-serif text-3xl font-bold text-[#8F0038] tracking-tight">Settings & Privacy</h1>
          <p className="text-sm font-semibold text-[#75666D] mt-1">
            Manage your account security, visibility, and active subscriptions.
          </p>
        </div>
      </div>

      {/* Subscription Card */}
      <div className="bg-[#FFFDFB] p-6 rounded-[24px] border border-[#EBD9DC] shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-[#EBD9DC]/50 pb-3">
          <CreditCard className="w-5 h-5 text-[#C99A3D]" />
          <h2 className="font-serif text-xl font-bold text-[#8F0038]">Membership & Billing</h2>
        </div>
        
        {subscription ? (
          <div className="bg-[#FDF9F4] border border-[#C99A3D]/30 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase text-[#75666D]">Active Plan</p>
              <p className="text-lg font-serif font-bold text-[#C99A3D]">{subscription.plan?.name}</p>
              <p className="text-xs font-semibold text-[#75666D] mt-1">
                Valid till {new Date(subscription.expires_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-xl font-bold text-[#241B20]">{subscription.contact_reveals_remaining}</p>
                <p className="text-[10px] font-bold uppercase text-[#75666D]">Reveals Left</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-[#241B20]">{subscription.biodata_downloads_remaining}</p>
                <p className="text-[10px] font-bold uppercase text-[#75666D]">PDFs Left</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#F9F9F9] border border-[#E0E0E0] p-5 rounded-2xl flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-[#241B20]">Free Member</p>
              <p className="text-xs font-semibold text-[#75666D] mt-0.5">Upgrade for contact reveals & verified badges.</p>
            </div>
            <button className="px-5 py-2.5 bg-[#8F0038] text-white font-bold rounded-xl text-xs hover:bg-[#72002E] transition-colors shadow-sm">
              Upgrade
            </button>
          </div>
        )}
      </div>

      {/* Privacy Center */}
      <div className="bg-[#FFFDFB] p-6 rounded-[24px] border border-[#EBD9DC] shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-[#EBD9DC]/50 pb-3">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#C99A3D]" />
            <h2 className="font-serif text-xl font-bold text-[#8F0038]">Privacy Center</h2>
          </div>
          {saving && <span className="text-[10px] font-bold text-[#8F0038] animate-pulse">Saving...</span>}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl">
            <div className="flex items-center gap-3">
              <Eye className="w-4 h-4 text-[#75666D]" />
              <div>
                <p className="text-sm font-bold text-[#241B20]">Profile Discoverability</p>
                <p className="text-[10px] font-semibold text-[#75666D]">Who can see your profile in search?</p>
              </div>
            </div>
            <select 
              value={privacies?.discoverability || 'public'} 
              onChange={e => updatePrivacy('discoverability', e.target.value)}
              className="bg-white border border-[#EBD9DC] rounded-lg text-xs font-bold px-3 py-1.5 focus:outline-none focus:border-[#8F0038]"
            >
              <option value="public">Everyone</option>
              <option value="verified_users">Verified Users Only</option>
              <option value="private">Hidden (Pause Profile)</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl">
            <div className="flex items-center gap-3">
              <DownloadCloud className="w-4 h-4 text-[#75666D]" />
              <div>
                <p className="text-sm font-bold text-[#241B20]">Biodata PDF Download</p>
                <p className="text-[10px] font-semibold text-[#75666D]">Who can download your full PDF?</p>
              </div>
            </div>
            <select 
              value={privacies?.biodata_privacy || 'interest_accepted_only'} 
              onChange={e => updatePrivacy('biodata_privacy', e.target.value)}
              className="bg-white border border-[#EBD9DC] rounded-lg text-xs font-bold px-3 py-1.5 focus:outline-none focus:border-[#8F0038]"
            >
              <option value="verified_users">All Verified Users</option>
              <option value="interest_accepted_only">Accepted Interests Only</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-[#75666D]" />
              <div>
                <p className="text-sm font-bold text-[#241B20]">Contact Details Privacy</p>
                <p className="text-[10px] font-semibold text-[#75666D]">When are your phone/address revealed?</p>
              </div>
            </div>
            <select 
              value={privacies?.contact_privacy || 'interest_accepted_only'} 
              onChange={e => updatePrivacy('contact_privacy', e.target.value)}
              className="bg-white border border-[#EBD9DC] rounded-lg text-xs font-bold px-3 py-1.5 focus:outline-none focus:border-[#8F0038]"
            >
              <option value="interest_accepted_only">Mutual Connections Only</option>
              <option value="private">Never (I will share manually)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Log Out */}
      <div className="pt-4">
        <button onClick={handleSignOut} className="w-full p-4 bg-white border border-[#EBD9DC] rounded-[24px] text-center font-bold text-[#8F0038] hover:bg-[#F7E5EA]/30 transition-colors flex items-center justify-center gap-2 shadow-sm">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

    </div>
  );
}
