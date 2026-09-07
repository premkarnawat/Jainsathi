import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { triggerNotificationToast } from '@/components/dashboard/NotificationToast';

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
          console.log('[Realtime Notification] Incoming Interest:', payload);
          triggerNotificationToast({
            title: 'New Interest Received!',
            message: 'A candidate has expressed interest in your profile.',
            type: 'interest',
            actionUrl: '/interests',
            actionText: 'Review Interest',
          });
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
          if (payload.new && payload.new.status === 'accepted') {
            console.log('[Realtime Notification] Interest Accepted:', payload);
            triggerNotificationToast({
              title: 'Interest Request Accepted!',
              message: 'Your interest was accepted! Mutual connection established.',
              type: 'acceptance',
              actionUrl: '/connections',
              actionText: 'View Connection',
            });
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
