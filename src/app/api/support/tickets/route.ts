import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, category = 'general', message, priority = 'medium', userId } = body;

    if (!subject || !message) {
      return NextResponse.json({ success: false, error: 'Subject and message are required' }, { status: 400 });
    }

    const res = await query(`
      INSERT INTO support_tickets (user_name, user_email, subject, category, priority, status, message, user_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, 'open', $6, $7, NOW(), NOW())
      RETURNING *;
    `, [name || 'Anonymous User', email || 'support@jainsaathi.com', subject, category, priority, message, userId || null]);

    return NextResponse.json({
      success: true,
      message: 'Support ticket submitted successfully. Our team will review and reply promptly.',
      ticket: res[0],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
