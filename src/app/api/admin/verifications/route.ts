import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('status') || 'pending';

    // 1. Fetch from identity_verifications
    let sql = `
      SELECT 
        iv.id,
        iv.status,
        iv.submitted_at,
        iv.document_path,
        iv.selfie_path,
        iv.notes,
        cp.id as candidate_id,
        cp.first_name,
        cp.last_name,
        cp.gender,
        cp.current_city,
        cp.current_state,
        cp.photos,
        ji.sect,
        ji.community
      FROM identity_verifications iv
      JOIN candidate_profiles cp ON iv.candidate_id = cp.id
      LEFT JOIN jain_identities ji ON ji.candidate_id = cp.id
      WHERE LOWER(iv.status) = LOWER($1)
      ORDER BY iv.submitted_at DESC;
    `;

    let rows = await query(sql, [filter]);

    // 2. If empty and looking for pending, include candidate_profiles with pending status
    if (rows.length === 0 && filter === 'pending') {
      const pendingCands = await query(`
        SELECT 
          cp.id as candidate_id,
          cp.first_name,
          cp.last_name,
          cp.gender,
          cp.current_city,
          cp.current_state,
          cp.photos,
          cp.created_at as submitted_at,
          cp.verification_status as status,
          ji.sect,
          ji.community
        FROM candidate_profiles cp
        LEFT JOIN jain_identities ji ON ji.candidate_id = cp.id
        WHERE LOWER(cp.verification_status) = 'pending'
        ORDER BY cp.created_at DESC;
      `);

      rows = pendingCands.map((c: any) => ({
        id: `verif-${c.candidate_id}`,
        status: 'pending',
        submitted_at: c.submitted_at,
        document_path: null,
        selfie_path: null,
        notes: 'Submitted via candidate onboarding wizard',
        ...c,
      }));
    }

    const formatted = rows.map((r: any) => ({
      id: r.id,
      status: r.status,
      submitted_at: r.submitted_at,
      document_path: r.document_path,
      selfie_path: r.selfie_path,
      notes: r.notes,
      candidate_profiles: {
        id: r.candidate_id,
        first_name: r.first_name,
        last_name: r.last_name,
        gender: r.gender,
        current_city: r.current_city,
        current_state: r.current_state,
        photos: Array.isArray(r.photos) ? r.photos : (typeof r.photos === 'string' ? JSON.parse(r.photos) : []),
        jain_identities: {
          sect: r.sect || 'Shwetambar',
          community: r.community || 'Deravasi',
        },
      },
    }));

    return NextResponse.json({
      success: true,
      verifications: formatted,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { verificationId, candidateId, action, reason } = body;

    const newStatus = action === 'approve' ? 'verified' : 'rejected';
    const notes = action === 'approve' ? 'Approved by administrator' : (reason || 'Rejected by administrator');

    if (candidateId) {
      await query(`UPDATE candidate_profiles SET verification_status = $1 WHERE id = $2;`, [newStatus, candidateId]);
    }

    if (verificationId && !verificationId.startsWith('verif-')) {
      await query(`UPDATE identity_verifications SET status = $1, notes = $2 WHERE id = $3;`, [action === 'approve' ? 'approved' : 'rejected', notes, verificationId]);
    }

    return NextResponse.json({
      success: true,
      message: `Verification ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
