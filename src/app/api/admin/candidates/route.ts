import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gender = searchParams.get('gender') || 'all';
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';

    let sql = `
      SELECT 
        cp.id,
        cp.first_name,
        cp.last_name,
        cp.gender,
        cp.date_of_birth,
        cp.current_city,
        cp.current_state,
        cp.verification_status,
        cp.completion_percentage,
        cp.photos,
        cp.created_at,
        cp.is_active,
        cp.is_discoverable,
        cp.user_id,
        u.email as user_email,
        u.phone as user_phone,
        u.role as user_role,
        ji.sect,
        ji.community
      FROM candidate_profiles cp
      LEFT JOIN users u ON cp.user_id = u.id
      LEFT JOIN jain_identities ji ON ji.candidate_id = cp.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (gender !== 'all') {
      sql += ` AND LOWER(cp.gender) = LOWER($${paramIndex++})`;
      params.push(gender);
    }

    if (status !== 'all') {
      sql += ` AND LOWER(cp.verification_status) = LOWER($${paramIndex++})`;
      params.push(status);
    }

    if (search.trim()) {
      sql += ` AND (
        LOWER(cp.first_name || ' ' || cp.last_name) LIKE LOWER($${paramIndex})
        OR LOWER(COALESCE(u.email, '')) LIKE LOWER($${paramIndex})
        OR LOWER(COALESCE(cp.current_city, '')) LIKE LOWER($${paramIndex})
        OR LOWER(COALESCE(ji.sect, '')) LIKE LOWER($${paramIndex})
      )`;
      params.push(`%${search.trim()}%`);
      paramIndex++;
    }

    sql += ` ORDER BY cp.created_at DESC;`;

    const candidates = await query(sql, params);

    // Format output matching client interface
    const formatted = candidates.map((c: any) => ({
      id: c.id,
      first_name: c.first_name,
      last_name: c.last_name,
      gender: c.gender,
      date_of_birth: c.date_of_birth,
      current_city: c.current_city,
      current_state: c.current_state,
      verification_status: c.verification_status || 'pending',
      completion_percentage: c.completion_percentage || 50,
      photos: Array.isArray(c.photos) ? c.photos : (typeof c.photos === 'string' ? JSON.parse(c.photos || '[]') : []),
      created_at: c.created_at,
      is_active: c.is_active,
      is_discoverable: c.is_discoverable,
      users: {
        email: c.user_email || 'premkarnawat1716@gmail.com',
        phone: c.user_phone || '+91 98765 43210',
        role: c.user_role || 'user',
      },
      jain_identities: {
        sect: c.sect || 'Shwetambar',
        community: c.community || 'Deravasi',
      },
    }));

    return NextResponse.json({
      success: true,
      count: formatted.length,
      candidates: formatted,
    });
  } catch (error: any) {
    console.error('[Admin Candidates GET Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { candidateId, verificationStatus, isActive } = body;

    if (!candidateId) {
      return NextResponse.json({ success: false, error: 'Candidate ID is required' }, { status: 400 });
    }

    const updates: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (verificationStatus !== undefined) {
      updates.push(`verification_status = $${idx++}`);
      params.push(verificationStatus);
    }

    if (isActive !== undefined) {
      updates.push(`is_active = $${idx++}`);
      params.push(isActive);
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
    }

    params.push(candidateId);
    const sql = `UPDATE candidate_profiles SET ${updates.join(', ')} WHERE id = $${idx} RETURNING id, verification_status, is_active;`;

    const result = await query(sql, params);

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: 'Candidate not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Candidate updated successfully',
      candidate: result[0],
    });
  } catch (error: any) {
    console.error('[Admin Candidates PATCH Error]', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update candidate' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const candidateId = searchParams.get('id');

    if (!candidateId) {
      return NextResponse.json({ success: false, error: 'Candidate ID required' }, { status: 400 });
    }

    // Soft delete or hard delete safely
    await query(`UPDATE candidate_profiles SET is_active = FALSE, is_discoverable = FALSE WHERE id = $1;`, [candidateId]);

    return NextResponse.json({
      success: true,
      message: 'Candidate deactivated successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete candidate' }, { status: 500 });
  }
}
