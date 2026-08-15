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

        // Map the RPC response to the CandidateProfile format expected by the UI
        if (data) {
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
            matchingReasons: match.matching_reasons,
            // For now, load a placeholder image, since the RPC didn't join photos
            // A more advanced RPC would join the primary photo URL.
            photos: [{ url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400' }],
            verificationStatus: 'verified',
            isDiscoverable: true,
            isActive: true,
          }));
          setMatches(formattedMatches);
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
