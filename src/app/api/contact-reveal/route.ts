import { NextResponse } from 'next/server';
import { checkContactRevealEntitlement, decrementContactRevealEntitlement } from '@/lib/entitlements';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const { data: dbUser } = await supabase.from('users').select('id').eq('auth_id', user.id).single();

    const body = await request.json();
    const { userId, requesterCandidateId, targetCandidateId } = body;

    if (!userId || !requesterCandidateId || !targetCandidateId) {
      return NextResponse.json(
        { success: false, error: 'User ID, Requester Candidate ID, and Target Candidate ID are required' },
        { status: 400 }
      );
    }

    if (userId !== dbUser?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized user' }, { status: 403 });
    }

    // 1. Check server-side entitlement & mutual connection rules
    const entitlementCheck = await checkContactRevealEntitlement(
      userId,
      requesterCandidateId,
      targetCandidateId
    );

    if (!entitlementCheck.authorized) {
      return NextResponse.json(
        {
          success: false,
          error: entitlementCheck.reason,
          remainingReveals: entitlementCheck.remainingReveals,
        },
        { status: 403 }
      );
    }

    // 2. Fetch sensitive target user contact details (phone, email) privately
    const { data: targetProfile } = await supabase
      .from('candidate_profiles')
      .select('first_name, last_name, user_id, current_city, current_state')
      .eq('id', targetCandidateId)
      .single();

    const { data: targetUser } = await supabase
      .from('users')
      .select('phone, email')
      .eq('id', targetProfile?.user_id)
      .single();

    if (!targetUser?.phone || !targetUser?.email) {
      throw new Error('Contact details not found');
    }

    // 3. Decrement entitlement counter
    const remainingCount = await decrementContactRevealEntitlement(userId);

    // 4. Log contact reveal event for security audit
    await supabase.from('contact_reveals').upsert({
      requester_id: requesterCandidateId,
      target_id: targetCandidateId,
      revealed_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      contact: {
        candidateName: `${targetProfile?.first_name} ${targetProfile?.last_name}`,
        phone: targetUser.phone,
        email: targetUser.email,
        location: `${targetProfile?.current_city}, ${targetProfile?.current_state}`,
      },
      remainingReveals: remainingCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Contact reveal authorization failed' },
      { status: 500 }
    );
  }
}
