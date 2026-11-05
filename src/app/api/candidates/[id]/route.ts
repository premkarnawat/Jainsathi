import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const candidateId = params.id;
    if (!candidateId) {
      return NextResponse.json({ success: false, error: 'Candidate ID is required' }, { status: 400 });
    }

    const rows = await query(`
      SELECT 
        cp.id, cp.user_id, cp.first_name, cp.last_name, cp.gender, cp.date_of_birth,
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

    // Fetch related sections
    const [jain] = await query(`SELECT sect, community, sub_community, self_saka, mama_saka, native_place FROM jain_identities WHERE candidate_id = $1 LIMIT 1;`, [candidateId]);
    const [lifestyle] = await query(`SELECT diet, smoke, drink, hobbies, interests FROM lifestyle_profiles WHERE candidate_id = $1 LIMIT 1;`, [candidateId]);
    const education = await query(`SELECT id, degree_name, institution, field_of_study, passout_year FROM education_records WHERE candidate_id = $1 ORDER BY passout_year DESC;`, [candidateId]);
    const employment = await query(`SELECT id, company_name, designation, work_location, annual_income_lakhs FROM employment_records WHERE candidate_id = $1 ORDER BY created_at DESC;`, [candidateId]);
    const family = await query(`SELECT id, relation, name, occupation, location FROM family_members WHERE candidate_id = $1;`, [candidateId]);
    const photos = await query(`SELECT id, url, is_primary FROM photos WHERE candidate_id = $1 ORDER BY is_primary DESC;`, [candidateId]);

    // Parse photos if array on candidate_profiles
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
    console.error('[Public Candidate Detail GET Error]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
