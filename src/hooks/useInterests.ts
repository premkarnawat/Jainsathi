import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export function useInterests(profileId?: string) {
  const [interestsReceived, setInterestsReceived] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch received interests
  const fetchInterests = async () => {
    if (!profileId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
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
        .eq('status', 'pending');

      if (error) throw error;

      if (data) {
        // Transform the nested relations for UI convenience
        const formatted = data.map((req: any) => ({
          ...req,
          senderProfile: {
            ...req.sender,
            // very naive age calculation for UI purposes
            age: req.sender.age ? new Date().getFullYear() - new Date(req.sender.age).getFullYear() : 25,
            photoUrl: req.sender.photos?.[0]?.url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'
          }
        }));
        setInterestsReceived(formatted);
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
    return data;
  };

  const acceptInterest = async (interestId: string, senderId: string, receiverId: string) => {
    // 1. Update interest status
    const { error: updateError } = await supabase
      .from('interest_requests')
      .update({ status: 'accepted' })
      .eq('id', interestId);
      
    if (updateError) throw updateError;

    // 2. Create connection
    const { error: connError } = await supabase
      .from('connections')
      .insert({
        candidate_a: senderId,
        candidate_b: receiverId,
        interest_request_id: interestId
      });

    if (connError) throw connError;
    
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

  return { interestsReceived, loading, sendInterest, acceptInterest, declineInterest, refetch: fetchInterests };
}
