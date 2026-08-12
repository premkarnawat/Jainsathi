import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, planId, amountInr } = body;

    if (!userId || !planId || !amountInr) {
      return NextResponse.json(
        { success: false, error: 'User ID, Plan ID, and Amount required' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();
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
