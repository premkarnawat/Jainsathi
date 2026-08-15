'use client';

import React, { useState } from 'react';
import { Sliders, Save, AlertCircle } from 'lucide-react';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import { supabase } from '@/lib/supabase/client';

export default function PreferencesPage() {
  const { profile: loggedInUser, preferences, loading } = useCandidateProfile();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(preferences || {
    min_age: 18,
    max_age: 40,
    min_height_cm: 140,
    preferred_cities: [],
    preferred_sects: []
  });
  const [successMsg, setSuccessMsg] = useState('');

  // Update local form state when hook resolves
  React.useEffect(() => {
    if (preferences) {
      setForm(preferences);
    }
  }, [preferences]);

  const handleSave = async () => {
    if (!loggedInUser) return;
    setSaving(true);
    setSuccessMsg('');
    try {
      const { error } = await supabase
        .from('partner_preferences')
        .upsert({
          candidate_id: loggedInUser.id,
          ...form
        });

      if (error) throw error;
      setSuccessMsg('Preferences updated successfully!');
      
      // Clear msg after 3s
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error saving preferences:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div className="bg-white p-8 rounded-3xl border border-[#EDE1D7] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-burgundy flex items-center gap-2">
            <Sliders className="w-6 h-6" />
            Partner Preferences
          </h1>
          <p className="text-sm font-semibold text-[#766B70] mt-1">
            Configure your matching criteria. Our engine uses this to find your ideal Jain Saathi.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3.5 bg-burgundy text-white font-bold rounded-xl text-xs hover:bg-deepBurgundy transition-all shadow-sm disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>

      {successMsg && (
        <div className="bg-[#FFF1F1] text-burgundy border border-burgundy/20 p-4 rounded-xl text-sm font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#EDE1D7] shadow-sm space-y-5">
          <h2 className="font-serif text-xl font-bold text-burgundy border-b border-[#F8EFE5] pb-3">Age & Height</h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 space-y-1.5">
                <label className="text-xs font-bold text-[#766B70] uppercase">Min Age</label>
                <input 
                  type="number" 
                  value={form.min_age || ''}
                  onChange={(e) => setForm({...form, min_age: parseInt(e.target.value)})}
                  className="w-full bg-[#FDF9F4] border border-[#EDE1D7] rounded-xl px-4 py-2.5 text-sm font-semibold text-text focus:outline-none focus:border-burgundy"
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <label className="text-xs font-bold text-[#766B70] uppercase">Max Age</label>
                <input 
                  type="number" 
                  value={form.max_age || ''}
                  onChange={(e) => setForm({...form, max_age: parseInt(e.target.value)})}
                  className="w-full bg-[#FDF9F4] border border-[#EDE1D7] rounded-xl px-4 py-2.5 text-sm font-semibold text-text focus:outline-none focus:border-burgundy"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#766B70] uppercase">Min Height (cm)</label>
              <input 
                type="number" 
                value={form.min_height_cm || ''}
                onChange={(e) => setForm({...form, min_height_cm: parseInt(e.target.value)})}
                className="w-full bg-[#FDF9F4] border border-[#EDE1D7] rounded-xl px-4 py-2.5 text-sm font-semibold text-text focus:outline-none focus:border-burgundy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
