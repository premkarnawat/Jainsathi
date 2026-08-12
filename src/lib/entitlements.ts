// ========================================================
// JAINSAATHI SUBSCRIPTION & ENTITLEMENT ENGINE
// ========================================================

import { createServerSupabaseClient } from './supabase/server';

export interface UserEntitlements {
  canRevealContact: boolean;
  contactRevealsRemaining: number;
  canDownloadBiodata: boolean;
  biodataDownloadsRemaining: number;
  canFeatureProfile: boolean;
  planCode: string;
}

/**
 * Validates whether a candidate profile is authorized to reveal a contact
 */
export async function checkContactRevealEntitlement(
  userId: string,
  candidateId: string,
  targetCandidateId: string
): Promise<{ authorized: boolean; reason?: string; remainingReveals?: number }> {
  const supabase = createServerSupabaseClient();

  // 1. Check if mutual connection exists
  const { data: connection } = await supabase
    .from('connections')
    .select('id')
    .or(`and(candidate_a.eq.${candidateId},candidate_b.eq.${targetCandidateId}),and(candidate_a.eq.${targetCandidateId},candidate_b.eq.${candidateId})`)
    .single();

  if (!connection) {
    return { authorized: false, reason: 'Contact can only be revealed after mutual interest acceptance.' };
  }

  // 2. Check active subscription entitlements
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id, contact_reveals_remaining, status')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!subscription || subscription.contact_reveals_remaining <= 0) {
    return {
      authorized: false,
      reason: 'No remaining contact reveals in your plan. Please upgrade to Pro or Super plan.',
      remainingReveals: subscription?.contact_reveals_remaining || 0,
    };
  }

  return {
    authorized: true,
    remainingReveals: subscription.contact_reveals_remaining,
  };
}

/**
 * Decrements user contact reveal count server-side upon successful reveal
 */
export async function decrementContactRevealEntitlement(userId: string): Promise<number> {
  const supabase = createServerSupabaseClient();

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id, contact_reveals_remaining')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (!subscription || subscription.contact_reveals_remaining <= 0) return 0;

  const updatedCount = Math.max(0, subscription.contact_reveals_remaining - 1);

  await supabase
    .from('subscriptions')
    .update({ contact_reveals_remaining: updatedCount })
    .eq('id', subscription.id);

  return updatedCount;
}
