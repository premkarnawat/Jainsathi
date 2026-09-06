import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    // 1. Fetch all active subscription plans from PostgreSQL
    const { data: rawPlans, error: plansError } = await supabase
      .from('plans')
      .select('id, code, name, price_inr, duration_days, contact_reveal_limit, biodata_download_limit, is_featured_allowed, features, is_active')
      .eq('is_active', true)
      .order('price_inr', { ascending: true });

    if (plansError) {
      console.error('[Plans API Error]', plansError);
      return NextResponse.json({ success: false, error: 'Failed to fetch membership plans' }, { status: 500 });
    }

    // 2. Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    let currentSubscription = null;
    let isFemaleEligibleForFreeYear = false;
    let candidateProfile = null;
    let userRecord = null;

    if (user) {
      // Fetch public.users record
      const { data: dbUser } = await supabase
        .from('users')
        .select('id, email, phone, role')
        .eq('auth_id', user.id)
        .maybeSingle();

      userRecord = dbUser;

      if (dbUser?.id) {
        // Fetch candidate profile for gender check
        const { data: cand } = await supabase
          .from('candidate_profiles')
          .select('id, gender, first_name, last_name, verification_status')
          .eq('user_id', dbUser.id)
          .maybeSingle();

        candidateProfile = cand;

        // Check active or latest subscription
        const { data: subs } = await supabase
          .from('subscriptions')
          .select('id, plan_id, status, starts_at, expires_at, contact_reveals_remaining, biodata_downloads_remaining')
          .eq('user_id', dbUser.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (subs && subs.length > 0) {
          const sub = subs[0];
          const isExpired = sub.expires_at ? new Date(sub.expires_at) < new Date() : false;
          currentSubscription = {
            ...sub,
            status: isExpired ? 'expired' : sub.status,
            isExpired,
          };
        }

        // Female 1-Year Free Rule:
        // Eligible if candidate gender is female and user does not already have an active paid tier
        if (cand?.gender?.toLowerCase() === 'female') {
          isFemaleEligibleForFreeYear = !currentSubscription || currentSubscription.status === 'expired' || currentSubscription.plan_id === 1;
        }
      }
    }

    // Enrich plans with UI subtitle and structured entitlements
    const formattedPlans = (rawPlans || []).map((p) => {
      let subtitle = 'For getting started';
      let badge = null;

      if (p.code === 'free') {
        subtitle = 'For getting started';
      } else if (p.code === 'pro_3m' || p.name.toLowerCase().includes('pro')) {
        subtitle = 'For active match discovery';
      } else if (p.code === 'super_3m' || p.name.toLowerCase().includes('super')) {
        subtitle = 'For serious matrimonial search';
        badge = 'Most Popular';
      } else if (p.code === 'deluxe_6m' || p.name.toLowerCase().includes('deluxe')) {
        subtitle = 'For maximum visibility and connections';
        badge = 'Best Value';
      }

      const durationMonths = Math.round((p.duration_days || 90) / 30);
      const durationLabel = p.price_inr === 0 
        ? `${durationMonths} Months Access` 
        : `${durationMonths} Months`;

      return {
        id: p.id,
        code: p.code,
        name: p.name,
        priceInr: Number(p.price_inr),
        durationDays: p.duration_days,
        durationMonths,
        durationLabel,
        subtitle,
        badge,
        contactRevealLimit: p.contact_reveal_limit || 0,
        biodataDownloadLimit: p.biodata_download_limit || 0,
        isFeaturedAllowed: Boolean(p.is_featured_allowed),
        features: Array.isArray(p.features) ? p.features : [],
        isFemaleFreeEligible: isFemaleEligibleForFreeYear && (p.code === 'free' || p.code === 'pro_3m'),
      };
    });

    return NextResponse.json({
      success: true,
      plans: formattedPlans,
      user: userRecord ? {
        id: userRecord.id,
        email: userRecord.email,
        candidateId: candidateProfile?.id,
        gender: candidateProfile?.gender,
        firstName: candidateProfile?.first_name,
      } : null,
      currentSubscription,
      isFemaleEligibleForFreeYear,
    });
  } catch (error: any) {
    console.error('[Plans API Fatal Error]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
