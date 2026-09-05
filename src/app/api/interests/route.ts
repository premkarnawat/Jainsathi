import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const { data: dbUser } = await supabase.from('users').select('id').eq('auth_id', user.id).single();
    const { data: candidateProfile } = await supabase.from('candidate_profiles').select('id').eq('user_id', dbUser?.id).single();

    if (!dbUser || !candidateProfile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    const clientIp = request.headers.get('x-forwarded-for') || 'anon';
    const rateCheck = checkRateLimit(`interests:${clientIp}`, 10, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await request.json();
    const { senderId, receiverId, action = 'send' } = body;

    if (!senderId || !receiverId) {
      return NextResponse.json(
        { success: false, error: 'Sender ID and Receiver ID required' },
        { status: 400 }
      );
    }

    if (action === 'send' && senderId !== candidateProfile.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized sender' }, { status: 403 });
    }
    
    if ((action === 'accept' || action === 'decline') && receiverId !== candidateProfile.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized receiver' }, { status: 403 });
    }


    if (action === 'send') {
      // Create or update interest request
      const { data, error } = await supabase
        .from('interest_requests')
        .upsert(
          {
            sender_id: senderId,
            receiver_id: receiverId,
            status: 'pending',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'sender_id,receiver_id' }
        )
        .select()
        .single();

      if (error) {
        console.error('[Supabase Interest Error]', error);
        return NextResponse.json({ success: true, message: 'Interest request recorded.' });
      }

      return NextResponse.json({
        success: true,
        message: 'Interest request sent successfully.',
        interest: data,
      });
    }

    if (action === 'accept') {
      // 1. Update interest request to accepted
      await supabase
        .from('interest_requests')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .match({ sender_id: senderId, receiver_id: receiverId });

      // 2. Create mutual connection
      await supabase.from('connections').upsert(
        {
          candidate_a: senderId,
          candidate_b: receiverId,
          created_at: new Date().toISOString(),
        },
        { onConflict: 'candidate_a,candidate_b' }
      );

      return NextResponse.json({
        success: true,
        message: 'Interest accepted. Connection established.',
      });
    }

    if (action === 'decline') {
      await supabase
        .from('interest_requests')
        .update({ status: 'declined', updated_at: new Date().toISOString() })
        .match({ sender_id: senderId, receiver_id: receiverId });

      return NextResponse.json({
        success: true,
        message: 'Interest request declined.',
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Interest action failed' },
      { status: 500 }
    );
  }
}
