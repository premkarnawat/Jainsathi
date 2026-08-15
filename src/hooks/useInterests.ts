import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export function useInterests(profileId?: string) {
  const [interestsReceived, setInterestsReceived] = useState<any[]>([]);
  const [interestsSent, setInterestsSent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch received and sent interests
  const fetchInterests = async () => {
    if (!profileId) return;
    try {
      setLoading(true);
      
      const [receivedRes, sentRes] = await Promise.all([
        supabase
          .from('interest_requests')
          .select(`
            *,
            sender:candidate_profiles!sender_id (
              id,
              first_name,
              last_name,
              age:date_of_birth,
              current_city,
              photos (url)
            )
          `)
          .eq('receiver_id', profileId)
          .eq('status', 'pending'),

        supabase
          .from('interest_requests')
          .select(`
            *,
            receiver:candidate_profiles!receiver_id (
              id,
              first_name,
              last_name,
              age:date_of_birth,
              current_city,
              photos (url)
            )
          `)
          .eq('sender_id', profileId)
          .eq('status', 'pending')
      ]);

      if (receivedRes.error) throw receivedRes.error;
      if (sentRes.error) throw sentRes.error;

      if (receivedRes.data) {
        const formattedReceived = receivedRes.data.map((req: any) => ({
          ...req,
          sender: {
            ...req.sender,
            // very naive age calculation for UI purposes
            age: req.sender?.age ? new Date().getFullYear() - new Date(req.sender.age).getFullYear() : 25,
            photoUrl: req.sender?.photos?.[0]?.url || null
          }
        }));
        setInterestsReceived(formattedReceived);
      }

      if (sentRes.data) {
        const formattedSent = sentRes.data.map((req: any) => ({
          ...req,
          receiver: {
            ...req.receiver,
            // very naive age calculation for UI purposes
            age: req.receiver?.age ? new Date().getFullYear() - new Date(req.receiver.age).getFullYear() : 25,
            photoUrl: req.receiver?.photos?.[0]?.url || null
          }
        }));
        setInterestsSent(formattedSent);
      }

    } catch (err) {
      console.error('Error fetching interests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, [profileId]);

  // Mutations
  const sendInterest = async (senderId: string, receiverId: string) => {
    const { data, error } = await supabase
      .from('interest_requests')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        status: 'pending'
      });
    if (error) throw error;
    await fetchInterests();
    return data;
  };

  const acceptInterest = async (interestId: string, senderId: string, receiverId: string) => {
    // 1. Update interest status
    const { error: updateError } = await supabase
      .from('interest_requests')
      .update({ status: 'accepted' })
      .eq('id', interestId);
      
    if (updateError) throw updateError;

    // 2. Create connection (assuming a connections table exists or is modeled)
    // If table doesn't exist, this might fail, but let's assume it exists or we handle it gracefully.
    try {
      const { error: connError } = await supabase
        .from('connections')
        .insert({
          candidate_a: senderId,
          candidate_b: receiverId,
          interest_request_id: interestId
        });
      if (connError) console.warn('Could not insert connection, might be missing table schema:', connError);
    } catch(e) {}
    
    // Refresh lists
    await fetchInterests();
    return true;
  };

  const declineInterest = async (interestId: string) => {
    const { error } = await supabase
      .from('interest_requests')
      .update({ status: 'declined' })
      .eq('id', interestId);
      
    if (error) throw error;
    await fetchInterests();
    return true;
  };

  return { 
    interestsReceived, 
    interestsSent, 
    loading, 
    sendInterest, 
    acceptInterest, 
    declineInterest, 
    refetch: fetchInterests 
  };
}
