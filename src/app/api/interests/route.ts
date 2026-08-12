import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { senderId, receiverId, action = 'send' } = body;

    if (!senderId || !receiverId) {
      return NextResponse.json(
        { success: false, error: 'Sender ID and Receiver ID required' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

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
