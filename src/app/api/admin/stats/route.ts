import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [candCounts] = await query(`
      SELECT 
        count(*) as total,
        count(*) FILTER (WHERE LOWER(gender) = 'male') as male_count,
        count(*) FILTER (WHERE LOWER(gender) = 'female') as female_count,
        count(*) FILTER (WHERE LOWER(verification_status) = 'verified') as verified_count,
        count(*) FILTER (WHERE LOWER(verification_status) = 'pending') as pending_count
      FROM candidate_profiles;
    `);

    const [userCounts] = await query(`
      SELECT count(*) as total_users FROM users;
    `);

    const [subCounts] = await query(`
      SELECT 
        count(*) FILTER (WHERE status = 'active') as active_subs,
        count(*) as total_subs
      FROM subscriptions;
    `);

    const [revCounts] = await query(`
      SELECT COALESCE(SUM(amount_inr), 0) as total_revenue
      FROM payments
      WHERE status = 'success';
    `);

    const total = Number(candCounts?.total || 0);
    const maleCount = Number(candCounts?.male_count || 0);
    const femaleCount = Number(candCounts?.female_count || 0);
    const verifiedCount = Number(candCounts?.verified_count || 0);
    const pendingCount = Number(candCounts?.pending_count || 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalCandidates: total,
        totalUsers: Number(userCounts?.total_users || total),
        verifiedCandidates: verifiedCount,
        pendingVerifications: pendingCount,
        activeSubscriptions: Number(subCounts?.active_subs || 0),
        totalRevenue: Number(revCounts?.total_revenue || 0),
        malePercentage: total > 0 ? Math.round((maleCount / total) * 100) : 50,
        femalePercentage: total > 0 ? Math.round((femaleCount / total) * 100) : 50,
        verifiedPercentage: total > 0 ? Math.round((verifiedCount / total) * 100) : 0,
      },
    });
  } catch (error: any) {
    console.error('[Admin Stats GET Error]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
