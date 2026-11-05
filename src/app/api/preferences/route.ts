import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let candidateId = searchParams.get('candidateId');

    if (!candidateId) {
      const userRows = await query<{ id: string }>(
        'SELECT id FROM users WHERE auth_id = $1 LIMIT 1',
        [user.id]
      );
      if (!userRows.length) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }

      const candRows = await query<{ id: string }>(
        'SELECT id FROM candidate_profiles WHERE user_id = $1 LIMIT 1',
        [userRows[0].id]
      );
      if (!candRows.length) {
        return NextResponse.json({ success: false, error: 'Candidate profile not found' }, { status: 404 });
      }
      candidateId = candRows[0].id;
    }

    const prefRows = await query(
      'SELECT * FROM partner_preferences WHERE candidate_id = $1 LIMIT 1',
      [candidateId]
    );

    return NextResponse.json({
      success: true,
      preferences: prefRows.length > 0 ? prefRows[0] : null,
    });
  } catch (err: any) {
    console.error('Error fetching partner preferences:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    let candidateId = body.candidate_id;

    if (!candidateId) {
      const userRows = await query<{ id: string }>(
        'SELECT id FROM users WHERE auth_id = $1 LIMIT 1',
        [user.id]
      );
      if (!userRows.length) {
        return NextResponse.json({ success: false, error: 'User record not found' }, { status: 404 });
      }
      const candRows = await query<{ id: string }>(
        'SELECT id FROM candidate_profiles WHERE user_id = $1 LIMIT 1',
        [userRows[0].id]
      );
      if (!candRows.length) {
        return NextResponse.json({ success: false, error: 'Candidate not found' }, { status: 404 });
      }
      candidateId = candRows[0].id;
    }

    const minAge = body.min_age ?? 18;
    const maxAge = body.max_age ?? 70;
    const minHeight = body.min_height_cm ?? 140;
    const maxHeight = body.max_height_cm ?? 210;
    const minIncome = body.min_income_lakhs ?? 0;
    const preferredDiet = body.preferred_diet ?? 'strict_jain';
    const dietMandatory = !!body.diet_is_mandatory;
    const sectMandatory = !!body.sect_is_mandatory;
    const aboutPartner = body.about_preferred_partner ?? '';

    // Handle array conversions
    const states = Array.isArray(body.preferred_states) ? body.preferred_states : [];
    const cities = Array.isArray(body.preferred_cities) ? body.preferred_cities : [];
    const sects = Array.isArray(body.preferred_sects) ? body.preferred_sects : [];
    const communities = Array.isArray(body.preferred_communities) ? body.preferred_communities : [];
    const educations = Array.isArray(body.preferred_educations) ? body.preferred_educations : [];
    const maritalStatuses = Array.isArray(body.allowed_marital_statuses) ? body.allowed_marital_statuses : ['never_married'];

    const upsertSql = `
      INSERT INTO partner_preferences (
        candidate_id, min_age, max_age, min_height_cm, max_height_cm,
        min_income_lakhs, preferred_diet, diet_is_mandatory, sect_is_mandatory,
        about_preferred_partner, preferred_states, preferred_cities,
        preferred_sects, preferred_communities, preferred_educations,
        allowed_marital_statuses, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9,
        $10, $11, $12,
        $13, $14, $15,
        $16::marital_status_type[], NOW()
      )
      ON CONFLICT (candidate_id) DO UPDATE SET
        min_age = EXCLUDED.min_age,
        max_age = EXCLUDED.max_age,
        min_height_cm = EXCLUDED.min_height_cm,
        max_height_cm = EXCLUDED.max_height_cm,
        min_income_lakhs = EXCLUDED.min_income_lakhs,
        preferred_diet = EXCLUDED.preferred_diet,
        diet_is_mandatory = EXCLUDED.diet_is_mandatory,
        sect_is_mandatory = EXCLUDED.sect_is_mandatory,
        about_preferred_partner = EXCLUDED.about_preferred_partner,
        preferred_states = EXCLUDED.preferred_states,
        preferred_cities = EXCLUDED.preferred_cities,
        preferred_sects = EXCLUDED.preferred_sects,
        preferred_communities = EXCLUDED.preferred_communities,
        preferred_educations = EXCLUDED.preferred_educations,
        allowed_marital_statuses = EXCLUDED.allowed_marital_statuses,
        updated_at = NOW()
      RETURNING *;
    `;

    const saved = await query(upsertSql, [
      candidateId, minAge, maxAge, minHeight, maxHeight,
      minIncome, preferredDiet, dietMandatory, sectMandatory,
      aboutPartner, states, cities,
      sects, communities, educations,
      maritalStatuses,
    ]);

    return NextResponse.json({
      success: true,
      preferences: saved[0] || null,
      message: 'Preferences updated successfully',
    });
  } catch (err: any) {
    console.error('Error saving partner preferences:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to save preferences' },
      { status: 500 }
    );
  }
}
