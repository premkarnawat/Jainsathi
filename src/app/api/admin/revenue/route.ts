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
        p.id,
        p.amount_inr,
        p.currency,
        p.status,
        p.provider,
        p.provider_payment_id,
        p.created_at,
        p.plan_id,
        p.user_id,
        u.email as user_email,
        u.phone as user_phone,
        pl.name as plan_name,
        pl.code as plan_code
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN plans pl ON p.plan_id = pl.id
      WHERE 1=1
    `;

    const params: any[] = [];
    if (status !== 'all') {
      sql += ` AND p.status = $1`;
      params.push(status);
    }

    sql += ` ORDER BY p.created_at DESC LIMIT 200;`;

    const rows = await query(sql, params);

    const formatted = rows.map((r: any) => ({
      id: r.id,
      amount_inr: Number(r.amount_inr) || 0,
      currency: r.currency || 'INR',
      status: r.status || 'success',
      provider: r.provider || 'mock',
      provider_payment_id: r.provider_payment_id || `PAY_${r.id.slice(0, 8).toUpperCase()}`,
      created_at: r.created_at,
      plan_id: r.plan_id,
      plan_name: r.plan_name || 'Membership',
      users: {
        email: r.user_email || 'member@jainsaathi.com',
        phone: r.user_phone || '+91 98765 43210',
      },
    }));

    return NextResponse.json({
      success: true,
      payments: formatted,
    });
  } catch (error: any) {
    console.error('[Admin Revenue API Error]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
