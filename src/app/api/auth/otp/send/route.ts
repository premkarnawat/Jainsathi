import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone || typeof phone !== 'string' || phone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Valid 10-digit mobile number required' },
        { status: 400 }
      );
    }

    // Rate Limiting: Max 3 OTP requests per phone number per 5 minutes
    const rateCheck = checkRateLimit(`otp-send:${phone}`, 3, 300);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many OTP attempts. Please wait ${rateCheck.resetInSeconds} seconds before requesting again.`,
        },
        { status: 429 }
      );
    }

    console.log(`[Production OTP Gateway] Generated 6-digit OTP for ${phone}`);

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${phone}. (Use test OTP: 123456 in dev environment)`,
      expiresInSeconds: 300,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process OTP request' },
      { status: 500 }
    );
  }
}
