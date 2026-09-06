import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const { data: dbUser } = await supabase.from('users').select('id, email').eq('auth_id', user.id).single();
    if (!dbUser) {
      return NextResponse.json({ success: false, error: 'User profile not found' }, { status: 404 });
    }

    const body = await request.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json(
        { success: false, error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    // 1. Authoritative Server-Side Plan Lookup from Database (Never trust client price)
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('id, code, name, price_inr, duration_days, contact_reveal_limit, biodata_download_limit, is_featured_allowed, is_active')
      .eq('id', planId)
      .eq('is_active', true)
      .single();

    if (planError || !plan) {
      return NextResponse.json({ success: false, error: 'Selected plan is invalid or unavailable' }, { status: 400 });
    }

    // 2. Check Candidate Profile and Female 1-Year Free Eligibility
    const { data: cand } = await supabase
      .from('candidate_profiles')
      .select('id, gender')
      .eq('user_id', dbUser.id)
      .maybeSingle();

    const isFemale = cand?.gender?.toLowerCase() === 'female';
    const authoritativePrice = Number(plan.price_inr);

    // If Free plan OR Female Free 1-Year eligible for Free/Pro
    const isEligibleZeroCost = authoritativePrice === 0 || (isFemale && (plan.code === 'free' || plan.code === 'pro_3m'));

    if (isEligibleZeroCost) {
      // Direct Server-Side Activation (Zero Payment Gateway Required)
      const durationDays = isFemale && plan.code === 'pro_3m' ? 365 : (plan.duration_days || 365);
      const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: dbUser.id,
          candidate_id: cand?.id,
          plan_id: plan.id,
          status: 'active',
          contact_reveals_remaining: plan.contact_reveal_limit || 10,
          biodata_downloads_remaining: plan.biodata_download_limit || 25,
          starts_at: new Date().toISOString(),
          expires_at: expiresAt,
        })
        .select()
        .single();

      if (subError) {
        console.error('[Subscription Direct Activation Error]', subError);
        return NextResponse.json({ success: false, error: 'Failed to activate membership' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        directActivation: true,
        message: isFemale 
          ? `Complimentary 1-Year ${plan.name} Membership activated successfully!` 
          : `${plan.name} Membership activated successfully!`,
        subscription,
      });
    }

    // 3. Paid Plan: Create Authoritative Order
    const orderId = `order_jain_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Create pending payment record in database with authoritative database price
    const { data: paymentRecord, error: payError } = await supabase
      .from('payments')
      .insert({
        user_id: dbUser.id,
        plan_id: plan.id,
        amount_inr: authoritativePrice,
        currency: 'INR',
        status: 'pending',
        provider: 'razorpay',
        provider_order_id: orderId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (payError) {
      console.error('[Payment Order Creation Error]', payError);
      return NextResponse.json({ success: false, error: 'Failed to create payment order' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      directActivation: false,
      order: {
        orderId,
        amountInr: authoritativePrice,
        currency: 'INR',
        planName: plan.name,
        planDuration: plan.duration_days,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder_key',
        userEmail: dbUser.email,
        userId: dbUser.id,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Payment order creation failed' },
      { status: 500 }
    );
  }
}
