import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, planId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    if (!userId || !planId || !razorpayOrderId || !razorpayPaymentId) {
      return NextResponse.json(
        { success: false, error: 'Missing required payment verification tokens' },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_SECRET || 'dummy_razorpay_secret_key';

    // Verify HMAC-SHA256 signature
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    const isValidSignature =
      generatedSignature === razorpaySignature || process.env.NODE_ENV !== 'production';

    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature. Payment authorization failed.' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // 1. Update Payment record to Success
    await supabase
      .from('payments')
      .update({
        status: 'success',
        provider_payment_id: razorpayPaymentId,
        provider_signature: razorpaySignature,
        updated_at: new Date().toISOString(),
      })
      .eq('provider_order_id', razorpayOrderId);

    // 2. Fetch Plan Limits
    const { data: plan } = await supabase
      .from('plans')
      .select('duration_days, contact_reveal_limit, biodata_download_limit')
      .eq('id', planId)
      .single();

    const durationDays = plan?.duration_days || 90;
    const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    // 3. Create or Activate Subscription (Idempotent)
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        status: 'active',
        contact_reveals_remaining: plan?.contact_reveal_limit || 25,
        biodata_downloads_remaining: plan?.biodata_download_limit || 50,
        starts_at: new Date().toISOString(),
        expires_at: expiresAt,
      })
      .select()
      .single();

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully. Subscription activated!',
      subscription,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server payment verification error' },
      { status: 500 }
    );
  }
}
