import { NextResponse } from 'next/server';
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
    const { userId, planId, amountInr } = body;

    if (!userId || !planId || !amountInr) {
      return NextResponse.json(
        { success: false, error: 'User ID, Plan ID, and Amount required' },
        { status: 400 }
      );
    }

    if (userId !== dbUser?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized user' }, { status: 403 });
    }
    const orderId = `order_jain_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Create pending payment record in database
    const { data: paymentRecord, error } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        plan_id: planId,
        amount_inr: amountInr,
        currency: 'INR',
        status: 'pending',
        provider: 'razorpay',
        provider_order_id: orderId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('[Payment Order Creation Error]', error);
    }

    return NextResponse.json({
      success: true,
      order: {
        orderId,
        amountInr,
        currency: 'INR',
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_jainsaathi_key',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Payment order creation failed' },
      { status: 500 }
    );
  }
}
