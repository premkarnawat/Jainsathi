'use client';

import React, { useState, useEffect } from 'react';
import { Sliders, Save, AlertCircle, Heart } from 'lucide-react';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import { supabase } from '@/lib/supabase/client';

export default function PreferencesPage() {
  const { profile: loggedInUser, preferences, loading } = useCandidateProfile();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({
    min_age: 18,
    max_age: 40,
    min_height_cm: 140,
    preferred_states: [],
    preferred_cities: [],
    preferred_sects: [],
    preferred_communities: [],
    preferred_diet: 'strict_jain',
    min_income_lakhs: 0,
    diet_is_mandatory: true,
    sect_is_mandatory: false,
    about_preferred_partner: ''
  });
  const [successMsg, setSuccessMsg] = useState('');

  // Update local form state when hook resolves
  useEffect(() => {
    if (preferences) {
      setForm((prev: any) => ({ ...prev, ...preferences }));
    }
  }, [preferences]);

  const handleSave = async () => {
    if (!loggedInUser) return;
    setSaving(true);
    setSuccessMsg('');
    try {
      const payload = { ...form };
      delete payload.id; // Prevent updating the ID column

      const { error } = await supabase
        .from('partner_preferences')
        .upsert({
          candidate_id: loggedInUser.id,
          ...payload
        }, { onConflict: 'candidate_id' });

      if (error) throw error;
      setSuccessMsg('Partner preferences successfully updated! The matchmaking engine has recalibrated your recommendations.');
      
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error('Error saving preferences:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#C99A3D] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
      
      {/* Header */}
      <div className="bg-[#FFFDFB] p-8 rounded-[32px] border border-[#EBD9DC] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#F7E5EA] to-transparent rounded-bl-full pointer-events-none" />
        <div className="relative z-10">
          <h1 className="font-serif text-3xl font-bold text-[#8F0038] tracking-tight flex items-center gap-3">
            <Sliders className="w-6 h-6 text-[#C99A3D]" />
            Partner Preferences
          </h1>
          <p className="text-sm font-semibold text-[#75666D] mt-1 max-w-lg">
            Configure your matching criteria. Our JainSaathi engine uses this precise data to find your ideal life partner.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="relative z-10 flex items-center gap-2 px-8 py-3.5 bg-[#8F0038] text-white font-bold rounded-xl text-xs hover:bg-[#72002E] transition-all shadow-sm disabled:opacity-50"
        >
          {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Preferences</>}
        </button>
      </div>

      {successMsg && (
        <div className="bg-[#FFF1F1] text-[#8F0038] border border-[#8F0038]/20 p-4 rounded-xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
          <Heart className="w-4 h-4" /> {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Core Criteria */}
        <div className="bg-[#FFFDFB] p-6 rounded-[24px] border border-[#EBD9DC] shadow-sm space-y-5">
          <h2 className="font-serif text-xl font-bold text-[#8F0038] border-b border-[#EBD9DC]/50 pb-3">Basic Criteria</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#75666D] uppercase">Min Age</label>
              <input 
                type="number" 
                value={form.min_age || ''}
                onChange={(e) => setForm({...form, min_age: parseInt(e.target.value)})}
                className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[#75666D] uppercase">Max Age</label>
              <input 
                type="number" 
                value={form.max_age || ''}
                onChange={(e) => setForm({...form, max_age: parseInt(e.target.value)})}
                className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#75666D] uppercase">Minimum Height (cm)</label>
            <input 
              type="number" 
              value={form.min_height_cm || ''}
              onChange={(e) => setForm({...form, min_height_cm: parseInt(e.target.value)})}
              className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#75666D] uppercase">Minimum Income (Lakhs/Year)</label>
            <input 
              type="number" 
              value={form.min_income_lakhs || ''}
              onChange={(e) => setForm({...form, min_income_lakhs: parseInt(e.target.value)})}
              className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#75666D] uppercase">Allowed Marital Status (comma separated)</label>
            <input 
              type="text" 
              placeholder="never_married, divorced, widowed"
              value={(form.allowed_marital_statuses || []).join(', ')}
              onChange={(e) => setForm({...form, allowed_marital_statuses: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
              className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#75666D] uppercase">Preferred States (comma separated)</label>
            <input 
              type="text" 
              placeholder="Maharashtra, Gujarat..."
              value={(form.preferred_states || []).join(', ')}
              onChange={(e) => setForm({...form, preferred_states: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
              className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#75666D] uppercase">Preferred Cities (comma separated)</label>
            <input 
              type="text" 
              placeholder="Pune, Mumbai..."
              value={(form.preferred_cities || []).join(', ')}
              onChange={(e) => setForm({...form, preferred_cities: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
              className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]"
            />
          </div>
        </div>

        {/* Jain Identity Preferences */}
        <div className="bg-[#FFFDFB] p-6 rounded-[24px] border border-[#EBD9DC] shadow-sm space-y-5">
          <h2 className="font-serif text-xl font-bold text-[#8F0038] border-b border-[#EBD9DC]/50 pb-3">Jain & Cultural Criteria</h2>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#75666D] uppercase">Preferred Sects (comma separated)</label>
            <input 
              type="text" 
              placeholder="Shwetambar, Digambar..."
              value={(form.preferred_sects || []).join(', ')}
              onChange={(e) => setForm({...form, preferred_sects: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
              className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#75666D] uppercase">Preferred Communities (comma separated)</label>
            <input 
              type="text" 
              placeholder="Oswal, Porwal..."
              value={(form.preferred_communities || []).join(', ')}
              onChange={(e) => setForm({...form, preferred_communities: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
              className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#75666D] uppercase">Dietary Preference</label>
            <select 
              value={form.preferred_diet || 'strict_jain'}
              onChange={(e) => setForm({...form, preferred_diet: e.target.value})}
              className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]"
            >
              <option value="strict_jain">Strict Jain Only</option>
              <option value="jain_vegetarian">Jain Vegetarian</option>
              <option value="vegetarian">Vegetarian Acceptable</option>
            </select>
          </div>

          <label className="flex items-center gap-3 p-4 bg-[#F7E5EA]/40 border border-[#EBD9DC] rounded-xl cursor-pointer hover:bg-[#F7E5EA]/60 transition-colors">
            <input 
              type="checkbox" 
              checked={form.diet_is_mandatory} 
              onChange={(e) => setForm({...form, diet_is_mandatory: e.target.checked})}
              className="w-4 h-4 accent-[#8F0038]"
            />
            <div>
              <p className="text-xs font-bold text-[#241B20]">Diet is Mandatory</p>
              <p className="text-[10px] font-semibold text-[#75666D]">Filter out matches that do not meet diet criteria.</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl cursor-pointer hover:bg-[#F7E5EA]/30 transition-colors">
            <input 
              type="checkbox" 
              checked={form.sect_is_mandatory} 
              onChange={(e) => setForm({...form, sect_is_mandatory: e.target.checked})}
              className="w-4 h-4 accent-[#8F0038]"
            />
            <div>
              <p className="text-xs font-bold text-[#241B20]">Same Sect Only</p>
              <p className="text-[10px] font-semibold text-[#75666D]">Only show profiles from your Jain sect.</p>
            </div>
          </label>
        </div>

        {/* Ideal Partner Description */}
        <div className="col-span-1 md:col-span-2 bg-[#FFFDFB] p-6 rounded-[24px] border border-[#EBD9DC] shadow-sm space-y-5">
          <h2 className="font-serif text-xl font-bold text-[#8F0038] border-b border-[#EBD9DC]/50 pb-3">Describe Your Ideal Partner</h2>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-[#75666D] mb-2">
              Write a few words about what you value in a life partner. This helps families understand your perspective.
            </p>
            <textarea 
              rows={4}
              value={form.about_preferred_partner || ''}
              onChange={(e) => setForm({...form, about_preferred_partner: e.target.value})}
              placeholder="I am looking for someone who..."
              className="w-full bg-[#FDF9F4] border border-[#EBD9DC] rounded-xl px-4 py-3 text-sm font-semibold text-[#241B20] focus:outline-none focus:border-[#8F0038]"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
