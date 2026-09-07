import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const broadcasts = await query(`
      SELECT id, title, message, priority, is_active, created_by, created_at, expires_at
      FROM broadcasts
      ORDER BY created_at DESC;
    `);

    return NextResponse.json({
      success: true,
      broadcasts,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, message, priority = 'info', createdBy = 'Super Admin' } = body;

    if (!title || !message) {
      return NextResponse.json({ success: false, error: 'Title and message are required' }, { status: 400 });
    }

    // 1. Insert into broadcasts table
    const result = await query(`
      INSERT INTO broadcasts (title, message, priority, is_active, created_by, created_at)
      VALUES ($1, $2, $3, TRUE, $4, NOW())
      RETURNING *;
    `, [title, message, priority, createdBy]);

    const broadcast = result[0];

    // 2. Also insert into notifications table as system broadcast
    try {
      await query(`
        INSERT INTO notifications (title, body, type, data, is_read, created_at)
        VALUES ($1, $2, 'broadcast', $3, FALSE, NOW());
      `, [title, message, JSON.stringify({ broadcastId: broadcast.id, priority })]);
    } catch (nErr) {
      console.error('[Notification Insert Warning]', nErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Broadcast notice sent successfully to all users!',
      broadcast,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Broadcast ID required' }, { status: 400 });
    }

    await query(`DELETE FROM broadcasts WHERE id = $1;`, [id]);
    await query(`DELETE FROM notifications WHERE type = 'broadcast' AND data->>'broadcastId' = $1;`, [id]);

    return NextResponse.json({
      success: true,
      message: 'Broadcast deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
