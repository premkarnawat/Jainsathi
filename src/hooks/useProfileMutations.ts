import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export function useProfileMutations(profileId: string) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCandidateProfile = async (updates: any) => {
    try {
      setSaving(true);
      setError(null);
      const { error: err } = await supabase
        .from('candidate_profiles')
        .update(updates)
        .eq('id', profileId);
      if (err) throw err;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const upsertJainIdentity = async (data: any) => {
    try {
      setSaving(true);
      setError(null);
      // The jain_identities table links by candidate_id
      const { error: err } = await supabase
        .from('jain_identities')
        .upsert({ candidate_id: profileId, ...data }, { onConflict: 'candidate_id' });
      if (err) throw err;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const addEducation = async (data: any) => {
    try {
      setSaving(true);
      setError(null);
      const { error: err } = await supabase
        .from('education_records')
        .insert({ candidate_id: profileId, ...data });
      if (err) throw err;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const upsertEmployment = async (data: any) => {
    try {
      setSaving(true);
      setError(null);
      // Assuming a single primary employment record for simplicity in the UI initially
      // (Could be converted to an array based system like education later)
      const { data: existing } = await supabase
        .from('employment_records')
        .select('id')
        .eq('candidate_id', profileId)
        .limit(1)
        .single();
        
      if (existing) {
        const { error: err } = await supabase
          .from('employment_records')
          .update(data)
          .eq('id', existing.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase
          .from('employment_records')
          .insert({ candidate_id: profileId, ...data });
        if (err) throw err;
      }
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const upsertLifestyle = async (data: any) => {
    try {
      setSaving(true);
      setError(null);
      const { error: err } = await supabase
        .from('lifestyle_profiles')
        .upsert({ candidate_id: profileId, ...data }, { onConflict: 'candidate_id' });
      if (err) throw err;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updatePartnerPreferences = async (data: any) => {
    try {
      setSaving(true);
      setError(null);
      const { error: err } = await supabase
        .from('partner_preferences')
        .upsert({ candidate_id: profileId, ...data }, { onConflict: 'candidate_id' });
      if (err) throw err;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updatePrivacy = async (data: any) => {
    try {
      setSaving(true);
      setError(null);
      const { error: err } = await supabase
        .from('profile_privacies')
        .upsert({ candidate_id: profileId, ...data }, { onConflict: 'candidate_id' });
      if (err) throw err;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const removeFamilyMember = async (id: string) => {
    try {
      setSaving(true);
      setError(null);
      const { error: err } = await supabase
        .from('family_members')
        .delete()
        .eq('id', id)
        .eq('candidate_id', profileId); // ensure ownership
      if (err) throw err;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    error,
    updateCandidateProfile,
    upsertJainIdentity,
    addEducation,
    upsertEmployment,
    upsertLifestyle,
    updatePartnerPreferences,
    updatePrivacy,
    removeFamilyMember
  };
}
