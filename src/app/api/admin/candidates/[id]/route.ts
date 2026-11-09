import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const authResult = await requireAdminSession();
    if (!authResult.authorized) {
      return authResult.response;
    }

    const candidateId = params.id;
    if (!candidateId) {
      return NextResponse.json({ success: false, error: 'Candidate ID is required' }, { status: 400 });
    }

    const candidateRows = await query(`
      SELECT cp.*, u.email as user_email, u.phone as user_phone, u.role as user_role, u.created_at as user_created_at
      FROM candidate_profiles cp
      LEFT JOIN users u ON cp.user_id = u.id
      WHERE cp.id = $1 LIMIT 1;
    `, [candidateId]);

    if (!candidateRows || candidateRows.length === 0) {
      return NextResponse.json({ success: false, error: 'Candidate not found' }, { status: 404 });
    }

    const candidate = candidateRows[0];

    // Fetch related records safely
    const [jain] = await query(`SELECT * FROM jain_identities WHERE candidate_id = $1 LIMIT 1;`, [candidateId]);
    const [lifestyle] = await query(`SELECT * FROM lifestyle_profiles WHERE candidate_id = $1 LIMIT 1;`, [candidateId]);
    const [preferences] = await query(`SELECT * FROM partner_preferences WHERE candidate_id = $1 LIMIT 1;`, [candidateId]);
    const [biodata] = await query(`SELECT * FROM biodatas WHERE candidate_id = $1 LIMIT 1;`, [candidateId]);
    const [activeSub] = await query(`
      SELECT s.*, p.name as plan_name, p.code as plan_code
      FROM subscriptions s
      LEFT JOIN plans p ON s.plan_id = p.id
      WHERE s.user_id = $1 ORDER BY s.created_at DESC LIMIT 1;
    `, [candidate.user_id]);

    const education = await query(`SELECT * FROM education_records WHERE candidate_id = $1 ORDER BY passout_year DESC;`, [candidateId]);
    const employment = await query(`SELECT * FROM employment_records WHERE candidate_id = $1 ORDER BY created_at DESC;`, [candidateId]);
    const family = await query(`SELECT * FROM family_members WHERE candidate_id = $1 ORDER BY created_at ASC;`, [candidateId]);
    const photos = await query(`SELECT * FROM photos WHERE candidate_id = $1 ORDER BY is_primary DESC, created_at ASC;`, [candidateId]);
    const verifications = await query(`SELECT * FROM identity_verifications WHERE candidate_id = $1 ORDER BY created_at DESC;`, [candidateId]);

    // Parse photos stored as array on candidate_profiles if separate photos table is empty
    let photosList = photos;
    if ((!photosList || photosList.length === 0) && candidate.photos) {
      const parsed = Array.isArray(candidate.photos) ? candidate.photos : (typeof candidate.photos === 'string' ? JSON.parse(candidate.photos || '[]') : []);
      photosList = parsed.map((p: any, i: number) => ({
        id: `photo_${i}`,
        url: typeof p === 'string' ? p : (p?.url || ''),
        is_primary: i === 0,
      }));
    }

    const fullProfile = {
      ...candidate,
      users: {
        id: candidate.user_id,
        email: candidate.user_email || 'member@jainsaathi.com',
        phone: candidate.user_phone || '+91 98765 43210',
        role: candidate.user_role || 'user',
        created_at: candidate.user_created_at,
      },
      jain_identities: jain || { sect: 'Shwetambar', community: 'Oswal' },
      lifestyle_profiles: lifestyle || { diet: 'strict_jain', smoke: false, drink: false },
      partner_preferences: preferences || null,
      biodatas: biodata || null,
      subscriptions: activeSub || null,
      education_records: education || [],
      employment_records: employment || [],
      family_members: family || [],
      photos: photosList || [],
      identity_verifications: verifications || [],
    };

    return NextResponse.json({
      success: true,
      profile: fullProfile,
    });
  } catch (error: any) {
    console.error('[Admin Candidate Detail GET Error]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const authResult = await requireAdminSession();
    if (!authResult.authorized) {
      return authResult.response;
    }

    const candidateId = params.id;
    const body = await request.json();
    const { verificationStatus, isActive } = body;

    const updates: string[] = [];
    const updateParams: any[] = [];
    let idx = 1;

    if (verificationStatus !== undefined) {
      updates.push(`verification_status = $${idx++}`);
      updateParams.push(verificationStatus);
    }

    if (isActive !== undefined) {
      updates.push(`is_active = $${idx++}`);
      updateParams.push(isActive);
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
    }

    updateParams.push(candidateId);
    const sql = `UPDATE candidate_profiles SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *;`;
    const res = await query(sql, updateParams);

    if (verificationStatus) {
      // Also update identity_verifications
      await query(`
        UPDATE identity_verifications 
        SET status = $1, reviewed_at = NOW() 
        WHERE candidate_id = $2;
      `, [verificationStatus === 'verified' ? 'approved' : 'rejected', candidateId]);
    }

    return NextResponse.json({
      success: true,
      message: 'Candidate updated successfully',
      candidate: res[0],
    });
  } catch (error: any) {
    console.error('[Admin Candidate Detail PATCH Error]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
