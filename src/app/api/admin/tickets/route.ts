import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tickets = await query(`
      SELECT 
        id, user_id, user_email, user_name, subject,
        category, priority, status, message, admin_reply,
        replied_at, created_at, updated_at
      FROM support_tickets
      ORDER BY 
        CASE 
          WHEN status = 'open' THEN 1 
          WHEN status = 'in_progress' THEN 2 
          ELSE 3 
        END,
        created_at DESC;
    `);

    return NextResponse.json({
      success: true,
      tickets,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { ticketId, adminReply, status } = body;

    if (!ticketId) {
      return NextResponse.json({ success: false, error: 'Ticket ID is required' }, { status: 400 });
    }

    const updates: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (adminReply !== undefined) {
      updates.push(`admin_reply = $${idx++}`);
      params.push(adminReply);
      updates.push(`replied_at = NOW()`);
    }

    if (status !== undefined) {
      updates.push(`status = $${idx++}`);
      params.push(status);
    }

    updates.push(`updated_at = NOW()`);
    params.push(ticketId);

    const sql = `UPDATE support_tickets SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *;`;
    const result = await query(sql, params);

    return NextResponse.json({
      success: true,
      message: 'Support ticket updated successfully',
      ticket: result[0],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
