import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { CandidateProfile } from '@/types';

export function useCandidateProfile(userId?: string) {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [preferences, setPreferences] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        let currentUserId = userId;

        if (!currentUserId) {
          // If no specific userId is provided, fetch the authenticated user
          const { data: { user }, error: authError } = await supabase.auth.getUser();
          if (authError || !user) {
            // For testing/mock purposes without true auth, we will leave it null
            setLoading(false);
            return;
          }
          currentUserId = user.id;
        }

        // Fetch candidate profile
        const { data: profileData, error: profileError } = await supabase
          .from('candidate_profiles')
          .select(`
            *,
            jain_identities (*),
            photos (*)
          `)
          .eq('user_id', currentUserId)
          .single();

        if (profileError) throw profileError;

        if (profileData) {
          // Transform response slightly to match our CandidateProfile type expectations
          const formattedProfile = {
            ...profileData,
            jainIdentity: profileData.jain_identities?.[0] || null,
          };
          setProfile(formattedProfile as any);

          // Fetch preferences
          const { data: prefData, error: prefError } = await supabase
            .from('partner_preferences')
            .select('*')
            .eq('candidate_id', profileData.id)
            .single();
            
          if (prefData) {
            setPreferences(prefData);
          }
        }
      } catch (err: any) {
        console.error('Error fetching candidate profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [userId]);

  return { profile, preferences, loading, error };
}
