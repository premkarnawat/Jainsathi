import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { query } from '@/lib/db';

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


    if (senderId === receiverId) {
      return NextResponse.json({ success: false, error: 'Cannot express interest in your own profile.' }, { status: 400 });
    }

    // Check if either candidate is blocked
    const blockCheck = await query(
      `SELECT id FROM blocks 
       WHERE (blocker_id = $1 AND blocked_candidate_id = $2)
          OR (blocker_id = $2 AND blocked_candidate_id = $1)
       LIMIT 1;`,
      [senderId, receiverId]
    );
    if (blockCheck.length > 0) {
      return NextResponse.json({ success: false, error: 'Action unavailable. User communication is restricted.' }, { status: 403 });
    }

    if (action === 'send') {
      // 1. Insert or update interest request via authoritative DB query
      const result = await query(
        `INSERT INTO interest_requests (sender_id, receiver_id, status, created_at, updated_at)
         VALUES ($1, $2, 'pending', NOW(), NOW())
         ON CONFLICT (sender_id, receiver_id) DO UPDATE SET 
           status = 'pending',
           updated_at = NOW()
         RETURNING *;`,
        [senderId, receiverId]
      );

      // 2. Notify receiver
      try {
        const receiverUserRows = await query<{ user_id: string }>(
          `SELECT user_id FROM candidate_profiles WHERE id = $1 LIMIT 1;`,
          [receiverId]
        );
        if (receiverUserRows.length > 0) {
          const senderNameRows = await query<{ first_name: string; last_name: string }>(
            `SELECT first_name, last_name FROM candidate_profiles WHERE id = $1 LIMIT 1;`,
            [senderId]
          );
          const sName = senderNameRows[0] ? `${senderNameRows[0].first_name} ${senderNameRows[0].last_name}` : 'A candidate';
          await query(
            `INSERT INTO notifications (user_id, title, body, type, data, is_read, created_at)
             VALUES ($1, $2, $3, 'interest', $4, FALSE, NOW());`,
            [
              receiverUserRows[0].user_id,
              'New Interest Request Received',
              `${sName} has expressed interest in your matrimonial profile.`,
              JSON.stringify({ senderId, receiverId })
            ]
          );
        }
      } catch (notifErr) {
        console.warn('[Interest Send Notification Warning]', notifErr);
      }

      return NextResponse.json({
        success: true,
        message: 'Interest request sent successfully.',
        interest: result[0],
      });
    }

    if (action === 'accept') {
      // 1. Update interest request to accepted
      await query(
        `UPDATE interest_requests 
         SET status = 'accepted', updated_at = NOW() 
         WHERE sender_id = $1 AND receiver_id = $2;`,
        [senderId, receiverId]
      );

      // 2. Create authoritative mutual connection (idempotent, server-side transaction)
      await query(
        `INSERT INTO connections (candidate_a, candidate_b, created_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (candidate_a, candidate_b) DO NOTHING;`,
        [senderId, receiverId]
      );

      // Also ensure opposite direction is recorded if queried symmetrically
      await query(
        `INSERT INTO connections (candidate_a, candidate_b, created_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (candidate_a, candidate_b) DO NOTHING;`,
        [receiverId, senderId]
      );

      // 3. Notify sender that their interest was accepted
      try {
        const senderUserRows = await query<{ user_id: string }>(
          `SELECT user_id FROM candidate_profiles WHERE id = $1 LIMIT 1;`,
          [senderId]
        );
        if (senderUserRows.length > 0) {
          const receiverNameRows = await query<{ first_name: string; last_name: string }>(
            `SELECT first_name, last_name FROM candidate_profiles WHERE id = $1 LIMIT 1;`,
            [receiverId]
          );
          const rName = receiverNameRows[0] ? `${receiverNameRows[0].first_name} ${receiverNameRows[0].last_name}` : 'Your match';
          await query(
            `INSERT INTO notifications (user_id, title, body, type, data, is_read, created_at)
             VALUES ($1, $2, $3, 'acceptance', $4, FALSE, NOW());`,
            [
              senderUserRows[0].user_id,
              'Interest Accepted!',
              `${rName} has accepted your interest. You are now connected!`,
              JSON.stringify({ senderId, receiverId })
            ]
          );
        }
      } catch (notifErr) {
        console.warn('[Interest Accept Notification Warning]', notifErr);
      }

      return NextResponse.json({
        success: true,
        message: 'Interest accepted. Mutual connection established.',
      });
    }

    if (action === 'decline') {
      await query(
        `UPDATE interest_requests 
         SET status = 'declined', updated_at = NOW() 
         WHERE sender_id = $1 AND receiver_id = $2;`,
        [senderId, receiverId]
      );

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
