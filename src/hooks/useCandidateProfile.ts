import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';

export function useCandidateProfile(userId?: string) {
  const [profile, setProfile] = useState<any | null>(null);
  const [preferences, setPreferences] = useState<any | null>(null);
  const [subscription, setSubscription] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      let currentUserId = userId;

      if (!currentUserId) {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
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
        // Fetch preferences
        const { data: prefData } = await supabase
          .from('partner_preferences')
          .select('*')
          .eq('candidate_id', profileData.id)
          .single();
          
        if (prefData) {
          setPreferences(prefData);
        }

        // Fetch subscription
        const { data: subData } = await supabase
          .from('subscriptions')
          .select(`
            *,
            plan:plans (*)
          `)
          .eq('candidate_id', profileData.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        setSubscription(subData || null);

        // Calculate profile completion percentage
        let filledFields = 0;
        let totalFields = 6; // base

        if (profileData.first_name && profileData.last_name) filledFields++;
        if (profileData.gender && profileData.date_of_birth) filledFields++;
        if (profileData.height_cm) filledFields++;
        if (profileData.current_city && profileData.current_state) filledFields++;
        if (profileData.photos && profileData.photos.length > 0) filledFields++;
        if (prefData) filledFields++;

        if (profileData.jain_identities && profileData.jain_identities.length > 0) {
          totalFields++;
          const ji = profileData.jain_identities[0];
          if (ji.sect && ji.community) filledFields++;
        }

        const completionPercentage = Math.round((filledFields / totalFields) * 100);

        const formattedProfile = {
          ...profileData,
          firstName: profileData.first_name,
          lastName: profileData.last_name,
          currentCity: profileData.current_city,
          currentState: profileData.current_state,
          jainIdentity: profileData.jain_identities?.[0] || null,
          completionPercentage,
          // Calculate membership tier from subscription or fallback to Free
          membershipTier: subData?.plan?.name || 'Free Member',
          isVerified: profileData.verification_status === 'verified',
          verificationStatus: profileData.verification_status || 'pending'
        };
        
        setProfile(formattedProfile);
      }
    } catch (err: any) {
      console.error('Error fetching candidate profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, preferences, subscription, loading, error, refetch: fetchProfile };
}
