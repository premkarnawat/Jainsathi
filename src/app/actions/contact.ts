'use server';

import { createClient } from '@/lib/supabase/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';

// Conditionally initialize Upstash if env vars exist
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Create a new ratelimiter, that allows 5 requests per 15 minutes
const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      analytics: true,
    })
  : null;

export async function revealContact(targetCandidateId: string) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await (await supabase).auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized. Please log in.' };
    }

    // Rate Limiting check
    if (ratelimit) {
      const ip = headers().get('x-forwarded-for') ?? '127.0.0.1';
      const { success } = await ratelimit.limit(`contact_reveal_${user.id}_${ip}`);
      if (!success) {
        return { success: false, error: 'Rate limit exceeded. Please try again later.' };
      }
    }

    // Server-side Authorization Checks:
    // 1. Get the current user's profile ID
    const { data: requesterProfile, error: profileError } = await (await supabase)
      .from('candidate_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !requesterProfile) {
      return { success: false, error: 'User profile not found.' };
    }

    // 2. Check if the target profile has accepted the interest OR if privacy is public
    // To maintain strictly ZERO TRUST, we'll enforce mutual connection check if target privacy requires it
    const { data: targetPrivacy } = await (await supabase)
      .from('profile_privacies')
      .select('contact_privacy')
      .eq('candidate_id', targetCandidateId)
      .single();

    const contactPrivacy = targetPrivacy?.contact_privacy || 'interest_accepted_only';

    if (contactPrivacy === 'interest_accepted_only') {
      const { data: connection } = await (await supabase)
        .from('connections')
        .select('id')
        .or(`and(candidate_a.eq.${requesterProfile.id},candidate_b.eq.${targetCandidateId}),and(candidate_a.eq.${targetCandidateId},candidate_b.eq.${requesterProfile.id})`)
        .single();
        
      if (!connection) {
        return { success: false, error: 'You can only reveal contact details for mutually accepted connections.' };
      }
    }

    // 3. Since Subscriptions are currently excluded per user request, we bypass subscription limit decrement here.

    // 4. Fetch the contact info
    // We must use the Service Role key to bypass RLS here because Candidate Profiles might hide phone/email in normal RLS
    // Wait, the phone/email are currently in the `users` table!
    const { data: targetProfile } = await (await supabase)
      .from('candidate_profiles')
      .select('user_id')
      .eq('id', targetCandidateId)
      .single();
      
    if (!targetProfile) return { success: false, error: 'Target profile not found' };

    // Create Admin Client to securely fetch protected fields
    const { createAdminClient } = await import('@/lib/supabase/server');
    const adminSupabase = createAdminClient();
    
    const { data: targetUser, error: userDetailsError } = await adminSupabase
      .from('users')
      .select('phone, email')
      .eq('id', targetProfile.user_id)
      .single();

    if (userDetailsError || !targetUser) {
      return { success: false, error: 'Unable to retrieve contact details.' };
    }

    // 5. Log the contact reveal (Audit Trail) securely using admin client
    await adminSupabase.from('contact_reveals').insert({
      requester_id: requesterProfile.id,
      target_id: targetCandidateId
    });

    return { 
      success: true, 
      phone: targetUser.phone,
      email: targetUser.email
    };

  } catch (err: any) {
    console.error('Contact reveal error:', err);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
