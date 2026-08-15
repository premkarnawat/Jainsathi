import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { CandidateProfile } from '@/types';

export function useMatches(profileId?: string) {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMatches() {
      if (!profileId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Call the custom RPC function we created in migration 04
        const { data, error: rpcError } = await supabase
          .rpc('get_recommended_matches', { p_user_profile_id: profileId, p_limit: 20 });

        if (rpcError) throw rpcError;

        if (data && data.length > 0) {
          // Fetch primary photos and verification status for these candidates
          const candidateIds = data.map((m: any) => m.candidate_id);
          
          const [photosRes, profilesRes] = await Promise.all([
            supabase
              .from('photos')
              .select('candidate_id, url')
              .in('candidate_id', candidateIds)
              .eq('is_primary', true),
            supabase
              .from('candidate_profiles')
              .select('id, verification_status')
              .in('id', candidateIds)
          ]);

          const photoMap = new Map();
          if (photosRes.data) {
            photosRes.data.forEach(p => photoMap.set(p.candidate_id, p.url));
          }

          const verificationMap = new Map();
          if (profilesRes.data) {
            profilesRes.data.forEach(p => verificationMap.set(p.id, p.verification_status));
          }

          const formattedMatches = data.map((match: any) => ({
            id: match.candidate_id,
            userId: match.user_id,
            firstName: match.first_name,
            lastName: match.last_name,
            gender: match.gender,
            dateOfBirth: match.date_of_birth,
            age: match.age,
            heightCm: match.height_cm,
            currentCity: match.current_city,
            currentState: match.current_state,
            jainIdentity: {
              sect: match.sect,
              community: match.community,
            },
            compatibilityScore: match.compatibility_score,
            matchingReasons: match.matching_reasons || [],
            photos: [{ url: photoMap.get(match.candidate_id) || null }],
            verificationStatus: verificationMap.get(match.candidate_id) || 'pending',
            isVerified: verificationMap.get(match.candidate_id) === 'verified',
            isDiscoverable: true,
            isActive: true,
          }));
          setMatches(formattedMatches);
        } else {
          setMatches([]);
        }
      } catch (err: any) {
        console.error('Error fetching matches:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, [profileId]);

  return { matches, loading, error };
}
