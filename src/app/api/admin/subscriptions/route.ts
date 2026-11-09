import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authResult = await requireAdminSession();
    if (!authResult.authorized) {
      return authResult.response;
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    let sql = `
      SELECT 
        s.id,
        s.plan_id,
        s.status,
        s.starts_at,
        s.expires_at,
        s.created_at,
        s.user_id,
        u.email as user_email,
        u.phone as user_phone,
        pl.code as plan_code,
        pl.name as plan_name,
        pl.price_inr as plan_price,
        pl.duration_days as plan_duration
      FROM subscriptions s
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN plans pl ON s.plan_id = pl.id
      WHERE 1=1
    `;

    const params: any[] = [];
    if (status !== 'all') {
      sql += ` AND s.status = $1`;
      params.push(status);
    }

    sql += ` ORDER BY s.created_at DESC LIMIT 200;`;

    const rows = await query(sql, params);

    const formatted = rows.map((r: any) => ({
      id: r.id,
      plan_id: r.plan_id,
      status: r.status || 'active',
      starts_at: r.starts_at || r.created_at,
      expires_at: r.expires_at,
      created_at: r.created_at,
      users: {
        email: r.user_email || 'member@jainsaathi.com',
        phone: r.user_phone || '+91 98765 43210',
      },
      plans: {
        code: r.plan_code || 'pro',
        name: r.plan_name || 'Pro Membership',
        price_inr: Number(r.plan_price) || 0,
        duration_days: r.plan_duration || 90,
      },
    }));

    return NextResponse.json({
      success: true,
      subscriptions: formatted,
    });
  } catch (error: any) {
    console.error('[Admin Subscriptions API Error]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
