import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().get(name)?.value;
          }
        }
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { otp } = await req.json();
    if (!otp) {
      return NextResponse.json({ success: false, error: 'OTP is required' }, { status: 400 });
    }

    const email = user.email;

    // Check DB for OTP
    const { data: otpRecords, error: dbError } = await supabase
      .from('admin_otps')
      .select('*')
      .eq('email', email)
      .eq('otp', otp)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (dbError) throw dbError;

    if (!otpRecords || otpRecords.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid or expired OTP' }, { status: 400 });
    }

    // Delete the OTP so it can't be reused
    await supabase.from('admin_otps').delete().eq('id', otpRecords[0].id);

    return NextResponse.json({ success: true, message: 'OTP verified successfully' });

  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
