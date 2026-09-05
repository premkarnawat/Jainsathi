import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { data: dbUser } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id)
      .single();

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const { data: candidateProfile } = await supabase
      .from('candidate_profiles')
      .select('id')
      .eq('user_id', dbUser.id)
      .single();

    if (!candidateProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 401 });
    }

    // Fetch the biodata record
    const { data: biodata } = await supabase
      .from('biodatas')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!biodata) {
      return NextResponse.json({ error: 'Biodata not found' }, { status: 404 });
    }

    // Check authorization: Can access if it's their own biodata
    let isAuthorized = biodata.candidate_id === candidateProfile.id;

    // If it's someone else's biodata, check if they have an accepted interest request
    if (!isAuthorized) {
      const { data: connection } = await supabase
        .from('interest_requests')
        .select('id')
        .or(`and(sender_id.eq.${candidateProfile.id},receiver_id.eq.${biodata.candidate_id}),and(sender_id.eq.${biodata.candidate_id},receiver_id.eq.${candidateProfile.id})`)
        .eq('status', 'accepted')
        .single();

      if (connection) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized to view this biodata' }, { status: 403 });
    }

    // Generate a secure, short-lived signed URL to the file
    const { data, error } = await supabase
      .storage
      .from('biodata-pdfs')
      .createSignedUrl(biodata.file_path, 60); // 60 seconds expiry

    if (error || !data) {
      return NextResponse.json({ error: 'Failed to access biodata file' }, { status: 500 });
    }

    // Redirect the user securely to the signed URL
    return NextResponse.redirect(data.signedUrl);

  } catch (error) {
    console.error('[Biodata API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
