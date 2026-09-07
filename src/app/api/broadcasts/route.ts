import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const broadcasts = await query(`
      SELECT id, title, message, priority, created_at
      FROM broadcasts
      WHERE is_active = TRUE
      ORDER BY created_at DESC
      LIMIT 5;
    `);

    return NextResponse.json({
      success: true,
      broadcasts,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
