import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const plans = await query(`
      SELECT 
        id, code, name, price_inr, duration_days,
        contact_reveal_limit, biodata_download_limit,
        is_featured_allowed, features, is_active
      FROM plans
      ORDER BY id ASC;
    `);

    return NextResponse.json({
      success: true,
      plans: plans.map((p: any) => ({
        ...p,
        price_inr: Number(p.price_inr),
        features: Array.isArray(p.features) ? p.features : (typeof p.features === 'string' ? JSON.parse(p.features) : []),
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, name, priceInr, durationDays, contactRevealLimit, biodataDownloadLimit, isFeaturedAllowed, features } = body;

    if (!code || !name) {
      return NextResponse.json({ success: false, error: 'Plan code and name are required' }, { status: 400 });
    }

    const res = await query(`
      INSERT INTO plans (
        code, name, price_inr, duration_days,
        contact_reveal_limit, biodata_download_limit,
        is_featured_allowed, features, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
      RETURNING *;
    `, [
      code,
      name,
      Number(priceInr || 0),
      Number(durationDays || 30),
      Number(contactRevealLimit || 10),
      Number(biodataDownloadLimit || 25),
      Boolean(isFeaturedAllowed),
      JSON.stringify(features || []),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Plan created successfully',
      plan: res[0],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, priceInr, durationDays, contactRevealLimit, biodataDownloadLimit, isFeaturedAllowed, features, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Plan ID is required' }, { status: 400 });
    }

    const updates: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (name !== undefined) { updates.push(`name = $${idx++}`); params.push(name); }
    if (priceInr !== undefined) { updates.push(`price_inr = $${idx++}`); params.push(Number(priceInr)); }
    if (durationDays !== undefined) { updates.push(`duration_days = $${idx++}`); params.push(Number(durationDays)); }
    if (contactRevealLimit !== undefined) { updates.push(`contact_reveal_limit = $${idx++}`); params.push(Number(contactRevealLimit)); }
    if (biodataDownloadLimit !== undefined) { updates.push(`biodata_download_limit = $${idx++}`); params.push(Number(biodataDownloadLimit)); }
    if (isFeaturedAllowed !== undefined) { updates.push(`is_featured_allowed = $${idx++}`); params.push(Boolean(isFeaturedAllowed)); }
    if (features !== undefined) { updates.push(`features = $${idx++}`); params.push(JSON.stringify(features)); }
    if (isActive !== undefined) { updates.push(`is_active = $${idx++}`); params.push(Boolean(isActive)); }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
    }

    params.push(id);
    const sql = `UPDATE plans SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *;`;
    const res = await query(sql, params);

    return NextResponse.json({
      success: true,
      message: 'Plan updated successfully',
      plan: res[0],
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
      return NextResponse.json({ success: false, error: 'Plan ID required' }, { status: 400 });
    }

    // Toggle active to false instead of destructive delete to protect existing subscriptions
    await query(`UPDATE plans SET is_active = FALSE WHERE id = $1;`, [id]);

    return NextResponse.json({
      success: true,
      message: 'Plan deactivated successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
