import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { searchParams } = new URL(request.url);
    let targetUserId = searchParams.get('userId');

    // If authenticated, always resolve to authenticated user's internal ID
    if (user) {
      const userRows = await query<{ id: string }>('SELECT id FROM users WHERE auth_id = $1 LIMIT 1;', [user.id]);
      if (userRows.length > 0) {
        targetUserId = userRows[0].id;
      }
    }

    let sql = `
      SELECT id, user_id, title, body, type, data, is_read, created_at
      FROM notifications
      WHERE (user_id IS NULL OR user_id = $1)
      ORDER BY created_at DESC
      LIMIT 30;
    `;

    const dummyUuid = '00000000-0000-0000-0000-000000000000';
    const notifications = await query(sql, [targetUserId || dummyUuid]);

    const unreadCount = notifications.filter((n: any) => !n.is_read).length;

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await request.json();
    let { notificationId, markAllRead, userId } = body;

    if (user) {
      const userRows = await query<{ id: string }>('SELECT id FROM users WHERE auth_id = $1 LIMIT 1;', [user.id]);
      if (userRows.length > 0) {
        userId = userRows[0].id;
      }
    }

    if (markAllRead && userId) {
      await query(`UPDATE notifications SET is_read = TRUE WHERE user_id = $1 OR user_id IS NULL;`, [userId]);
      return NextResponse.json({ success: true, message: 'All notifications marked as read' });
    }

    if (notificationId) {
      await query(`UPDATE notifications SET is_read = TRUE WHERE id = $1;`, [notificationId]);
      return NextResponse.json({ success: true, message: 'Notification marked as read' });
    }

    return NextResponse.json({ success: false, error: 'Invalid request parameters' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
