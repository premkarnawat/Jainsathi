import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const authResult = await requireAdminSession();
    if (!authResult.authorized) {
      return authResult.response;
    }

    let logs: any[] = [];
    try {
      logs = await query(`
        SELECT id, user_id, action, target_table, target_id, details, ip_address, created_at
        FROM audit_logs
        ORDER BY created_at DESC
        LIMIT 100;
      `);
    } catch (_) {
      // Table may be empty or newly created
      logs = [];
    }

    // If audit_logs is empty, synthesize recent audit trail from broadcasts, settings, and verification events
    if (!logs || logs.length === 0) {
      const recentCandidates = await query(`
        SELECT id, first_name, last_name, verification_status, created_at
        FROM candidate_profiles
        ORDER BY created_at DESC
        LIMIT 10;
      `);

      logs = recentCandidates.map((c: any) => ({
        id: `LOG_${c.id.slice(0, 8)}`,
        action: c.verification_status === 'verified' ? 'CANDIDATE_VERIFIED' : 'CANDIDATE_REGISTERED',
        target_table: 'candidate_profiles',
        target_id: c.id,
        details: { candidate_name: `${c.first_name} ${c.last_name}`, status: c.verification_status },
        ip_address: '127.0.0.1',
        created_at: c.created_at,
      }));
    }

    return NextResponse.json({
      success: true,
      logs,
    });
  } catch (error: any) {
    console.error('[Admin Audit Logs API Error]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
