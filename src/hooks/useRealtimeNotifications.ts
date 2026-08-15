import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export function useRealtimeNotifications(profileId?: string, onInterestReceived?: () => void) {
  useEffect(() => {
    if (!profileId) return;

    // Subscribe to incoming interest requests
    const interestSubscription = supabase
      .channel('public:interest_requests')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'interest_requests',
          filter: `receiver_id=eq.${profileId}`
        },
        (payload) => {
          console.log('Realtime Event: Interest Received!', payload);
          if (onInterestReceived) {
            onInterestReceived();
          }
        }
      )
      .subscribe();

    // Subscribe to connections (when an interest we sent is accepted)
    const connectionSubscription = supabase
      .channel('public:connections')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'connections',
          filter: `candidate_a=eq.${profileId}` // Simplified filter, Supabase realtime OR filters can be complex
        },
        (payload) => {
          console.log('Realtime Event: Connection established!', payload);
          // Could trigger a refetch of connections
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(interestSubscription);
      supabase.removeChannel(connectionSubscription);
    };
  }, [profileId, onInterestReceived]);
}
