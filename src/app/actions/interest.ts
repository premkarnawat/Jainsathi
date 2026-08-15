'use server';

import { createClient } from '@/lib/supabase/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(10, '1 h'), // Limit 10 interests per hour
      analytics: true,
    })
  : null;

export async function sendInterest(targetCandidateId: string, message?: string) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await (await supabase).auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized. Please log in.' };
    }

    if (ratelimit) {
      const ip = headers().get('x-forwarded-for') ?? '127.0.0.1';
      const { success } = await ratelimit.limit(`send_interest_${user.id}_${ip}`);
      if (!success) {
        return { success: false, error: 'You are sending interests too quickly. Please wait.' };
      }
    }

    const { data: requesterProfile } = await (await supabase)
      .from('candidate_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!requesterProfile) return { success: false, error: 'User profile not found.' };

    if (requesterProfile.id === targetCandidateId) {
      return { success: false, error: 'You cannot send interest to yourself.' };
    }

    // Check if blocked
    const { data: isBlocked } = await (await supabase)
      .from('blocks')
      .select('id')
      .or(`and(blocker_id.eq.${targetCandidateId},blocked_candidate_id.eq.${requesterProfile.id})`)
      .single();

    if (isBlocked) {
      return { success: false, error: 'Cannot send interest. This user is not accepting requests.' };
    }

    // Insert request
    const { error: insertError } = await (await supabase)
      .from('interest_requests')
      .insert({
        sender_id: requesterProfile.id,
        receiver_id: targetCandidateId,
        message: message ? message.substring(0, 500) : null, // Sanitize length
      });

    if (insertError) {
      if (insertError.code === '23505') { // Unique violation
        return { success: false, error: 'Interest request already sent.' };
      }
      throw insertError;
    }

    return { success: true };

  } catch (err: any) {
    console.error('Send interest error:', err);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function acceptInterest(requestId: string) {
  try {
    const supabase = createClient();
    const { data: { user } } = await (await supabase).auth.getUser();
    if (!user) return { success: false, error: 'Unauthorized.' };

    const { data: requesterProfile } = await (await supabase).from('candidate_profiles').select('id').eq('user_id', user.id).single();
    if (!requesterProfile) return { success: false, error: 'Profile not found.' };

    // Update the request
    const { data: request, error: updateError } = await (await supabase)
      .from('interest_requests')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('id', requestId)
      .eq('receiver_id', requesterProfile.id)
      .eq('status', 'pending')
      .select()
      .single();

    if (updateError || !request) {
      return { success: false, error: 'Invalid request or you are not authorized to accept it.' };
    }

    // Create mutual connection
    await (await supabase).from('connections').insert({
      candidate_a: request.sender_id,
      candidate_b: request.receiver_id,
      interest_request_id: request.id
    });

    return { success: true };

  } catch (err: any) {
    return { success: false, error: 'Unexpected error.' };
  }
}
