import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export function useDashboardStats(profileId?: string) {
  const [stats, setStats] = useState({
    recommended: 0,
    interests: 0,
    views: 0,
    saved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!profileId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // We fetch counts concurrently
        const [interestsCount, viewsCount, savedCount, matchesCount] = await Promise.all([
          // Pending interests received
          supabase
            .from('interest_requests')
            .select('*', { count: 'exact', head: true })
            .eq('receiver_id', profileId)
            .eq('status', 'pending'),

          // Profile views received
          supabase
            .from('profile_views')
            .select('*', { count: 'exact', head: true })
            .eq('profile_owner_id', profileId),

          // Saved profiles by this user
          supabase
            .from('saved_profiles')
            .select('*', { count: 'exact', head: true })
            .eq('candidate_id', profileId), // user is the saver

          // Matches count (call RPC just to get the length)
          supabase
            .rpc('get_recommended_matches', { p_user_profile_id: profileId, p_limit: 100 })
        ]);

        setStats({
          recommended: matchesCount.data?.length || 0,
          interests: interestsCount.count || 0,
          views: viewsCount.count || 0,
          saved: savedCount.count || 0,
        });

      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [profileId]);

  return { stats, loading };
}
