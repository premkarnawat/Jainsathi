import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required to view candidate profiles.' },
        { status: 401 }
      );
    }

    const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
    // Rate limiting: Max 60 profile views per minute per user/IP
    const rateCheck = checkRateLimit(`candidate_view:${user.id}_${clientIp}`, 60, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Profile viewing rate limit exceeded. Please wait a moment.' },
        { status: 429 }
      );
    }

    const candidateId = params.id;
    if (!candidateId) {
      return NextResponse.json({ success: false, error: 'Candidate ID is required' }, { status: 400 });
    }

    // Resolve current user's candidate profile
    const userRows = await query<{ id: string; role: string }>(
      'SELECT id, role FROM users WHERE auth_id = $1 LIMIT 1;',
      [user.id]
    );
    const dbUser = userRows[0];
    const isSystemAdmin = dbUser?.role === 'admin' || dbUser?.role === 'super_admin';

    let requesterCandidateId: string | null = null;
    let requesterIsVerified = false;
    let requesterGender = '';

    if (dbUser) {
      const candRows = await query<{ id: string; verification_status: string; gender: string }>(
        'SELECT id, verification_status, gender FROM candidate_profiles WHERE user_id = $1 LIMIT 1;',
        [dbUser.id]
      );
      if (candRows.length > 0) {
        requesterCandidateId = candRows[0].id;
        requesterIsVerified = candRows[0].verification_status === 'verified';
        requesterGender = (candRows[0].gender || '').toLowerCase();
      }
    }

    // Check if target is blocked by or has blocked the requester
    if (requesterCandidateId && requesterCandidateId !== candidateId && !isSystemAdmin) {
      const blockCheck = await query(
        `SELECT id FROM blocks 
         WHERE (blocker_id = $1 AND blocked_candidate_id = $2)
            OR (blocker_id = $2 AND blocked_candidate_id = $1)
         LIMIT 1;`,
        [requesterCandidateId, candidateId]
      );
      if (blockCheck.length > 0) {
        return NextResponse.json({ success: false, error: 'Candidate profile unavailable.' }, { status: 403 });
      }
    }

    const rows = await query(`
      SELECT 
        cp.id, cp.first_name, cp.last_name, cp.gender, cp.date_of_birth,
        cp.height_cm, cp.marital_status, cp.current_city, cp.current_state,
        cp.native_city, cp.native_state, cp.about_me, cp.verification_status,
        cp.completion_percentage, cp.photos, cp.is_featured, cp.created_at
      FROM candidate_profiles cp
      WHERE cp.id = $1 AND cp.is_active = TRUE
      LIMIT 1;
    `, [candidateId]);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Candidate profile not found' }, { status: 404 });
    }

    const candidate = rows[0];

    // Enforce matrimonial opposite-gender rule for non-admin viewers (cannot spy on same gender)
    if (
      requesterGender && 
      candidate.gender && 
      requesterCandidateId !== candidateId && 
      !isSystemAdmin
    ) {
      if (requesterGender.toLowerCase() === candidate.gender.toLowerCase()) {
        return NextResponse.json(
          { success: false, error: 'Profiles of the same gender cannot be viewed in matchmaking search.' },
          { status: 403 }
        );
      }
    }

    // Fetch privacy settings
    const [privacy] = await query(
      `SELECT photo_privacy, contact_privacy, income_privacy FROM profile_privacies WHERE candidate_id = $1 LIMIT 1;`,
      [candidateId]
    );

    // Fetch related sections
    const [jain] = await query(`SELECT sect, community, sub_community, self_saka, mama_saka, native_place FROM jain_identities WHERE candidate_id = $1 LIMIT 1;`, [candidateId]);
    const [lifestyle] = await query(`SELECT diet, smoke, drink, hobbies, interests FROM lifestyle_profiles WHERE candidate_id = $1 LIMIT 1;`, [candidateId]);
    const education = await query(`SELECT id, degree_name, institution, field_of_study, passout_year FROM education_records WHERE candidate_id = $1 ORDER BY passout_year DESC;`, [candidateId]);
    
    // Apply income privacy: redact income if not authorized
    let employment = await query(`SELECT id, company_name, designation, work_location, annual_income_lakhs FROM employment_records WHERE candidate_id = $1 ORDER BY created_at DESC;`, [candidateId]);
    if (privacy?.income_privacy === 'hidden' && requesterCandidateId !== candidateId && !isSystemAdmin) {
      employment = employment.map(e => ({ ...e, annual_income_lakhs: null }));
    }

    const family = await query(`SELECT id, relation, name, occupation, location FROM family_members WHERE candidate_id = $1;`, [candidateId]);
    
    // Apply photo privacy
    let photos = await query(`SELECT id, url, is_primary FROM photos WHERE candidate_id = $1 ORDER BY is_primary DESC;`, [candidateId]);
    if (privacy?.photo_privacy === 'private' && requesterCandidateId !== candidateId && !isSystemAdmin) {
      photos = [];
    }

    // Parse photos if array on candidate_profiles
    let photosList = photos;
    if ((!photosList || photosList.length === 0) && candidate.photos && (privacy?.photo_privacy !== 'private' || requesterCandidateId === candidateId || isSystemAdmin)) {
      const parsed = Array.isArray(candidate.photos) ? candidate.photos : (typeof candidate.photos === 'string' ? JSON.parse(candidate.photos || '[]') : []);
      photosList = parsed.map((p: any, i: number) => ({
        id: `photo_${i}`,
        url: typeof p === 'string' ? p : (p?.url || ''),
        is_primary: i === 0,
      }));
    }

    const fullProfile = {
      ...candidate,
      jain_identities: jain ? [jain] : [],
      lifestyle_profiles: lifestyle ? [lifestyle] : [],
      education_records: education || [],
      employment_records: employment || [],
      family_members: family || [],
      photos: photosList || [],
    };

    return NextResponse.json({
      success: true,
      candidate: fullProfile,
    });
  } catch (error: any) {
    console.error('[Candidate Detail GET Error]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
