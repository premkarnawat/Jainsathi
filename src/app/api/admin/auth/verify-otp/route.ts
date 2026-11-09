import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-auth';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const authResult = await requireAdminSession();
    if (!authResult.authorized) {
      return authResult.response;
    }

    const { otp } = await req.json();
    if (!otp) {
      return NextResponse.json({ success: false, error: 'OTP is required' }, { status: 400 });
    }

    const email = authResult.admin.email;
    const supabase = createAdminClient();

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
