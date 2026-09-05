import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const { data: dbUser } = await supabase.from('users').select('id').eq('auth_id', user.id).single();
    const { data: candidateProfile } = await supabase.from('candidate_profiles').select('gender').eq('user_id', dbUser?.id).single();

    if (!dbUser || !candidateProfile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    const enforcedGender = candidateProfile.gender === 'male' ? 'female' : 'male';

    const { searchParams } = new URL(request.url);
    const clientIp = request.headers.get('x-forwarded-for') || 'anon';

    // Rate Limiting search endpoint
    const rateCheck = checkRateLimit(`search:${clientIp}`, 30, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Search rate limit exceeded. Please wait a moment.' },
        { status: 429 }
      );
    }

    const minAge = parseInt(searchParams.get('minAge') || '18');
    const maxAge = parseInt(searchParams.get('maxAge') || '70');
    const state = searchParams.get('state');
    const city = searchParams.get('city');
    const sect = searchParams.get('sect');
    const community = searchParams.get('community');
    const verifiedOnly = searchParams.get('verifiedOnly') === 'true';
    const featuredOnly = searchParams.get('featuredOnly') === 'true';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

    let query = supabase
      .from('candidate_profiles')
      .select('id, first_name, last_name, gender, date_of_birth, height_cm, marital_status, current_state, current_city, completion_percentage, verification_status, is_featured, created_at, jain_identities!inner(sect, community), photos(url, is_primary)', { count: 'exact' })
      .eq('is_active', true)
      .eq('is_discoverable', true)
      .eq('gender', enforcedGender);

    if (state) query = query.eq('current_state', state);
    if (city) query = query.eq('current_city', city);
    if (sect) query = query.eq('jain_identities.sect', sect);
    if (community) query = query.eq('jain_identities.community', community);
    if (verifiedOnly) query = query.eq('verification_status', 'verified');
    if (featuredOnly) query = query.eq('is_featured', true);

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to).order('created_at', { ascending: false });

    const { data: candidates, count, error } = await query;

    if (error) {
      console.error('[Search Query Error]', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch search results' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      candidates: candidates || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Search execution failed' },
      { status: 500 }
    );
  }
}
