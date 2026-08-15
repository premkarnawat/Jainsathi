import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export function useRealtimeNotifications(profileId?: string, onInterestReceived?: () => void) {
  useEffect(() => {
    if (!profileId) return;

    // Subscribe to incoming interests
    const channel = supabase
      .channel(`interest_requests_${profileId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'interest_requests',
          filter: `receiver_id=eq.${profileId}`,
        },
        (payload) => {
          console.log('Realtime payload:', payload);
          // Assuming the UI will have a native bell or we just use alert for now
          alert('❤️ Someone has sent you an interest request!');
          if (onInterestReceived) {
            onInterestReceived();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'interest_requests',
          filter: `sender_id=eq.${profileId}`,
        },
        (payload) => {
          if (payload.new.status === 'accepted') {
            alert('🎉 Your interest request was accepted!');
            if (onInterestReceived) {
              onInterestReceived();
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profileId, onInterestReceived]);
}
