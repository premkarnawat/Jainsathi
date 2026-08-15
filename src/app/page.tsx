'use client';

import React, { useState } from 'react';
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { TrustStrip } from '@/components/landing/TrustStrip';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { SuccessStories } from '@/components/landing/SuccessStories';
import { MatchingBiodataSection } from '@/components/landing/MatchingBiodataSection';
import { Footer } from '@/components/landing/Footer';
import { ProfileWizard } from '@/components/wizard/ProfileWizard';
import { supabase } from '@/lib/supabase/client';

export default function LandingPage() {
  const [currentLang, setCurrentLang] = useState<'en' | 'hi'>('en');
  const [view, setView] = useState<'landing' | 'wizard'>('landing');

  return (
    <div className="min-h-screen bg-[#100A18] text-[#241A20] selection:bg-[#9E183A] selection:text-white">
      {view === 'landing' ? (
        <>
          <Header
            currentLang={currentLang}
            onLanguageChange={setCurrentLang}
            onRegisterClick={() => setView('wizard')}
            onLoginClick={() => setView('wizard')}
          />

          <main>
            <HeroSection
              onSendOtp={() => setView('wizard')}
              onExploreMatches={() => setView('wizard')}
            />

            <TrustStrip />

            <HowItWorks />

            <SuccessStories />

            <MatchingBiodataSection />
          </main>

          <Footer currentLang={currentLang} onLanguageChange={setCurrentLang} />
        </>
      ) : (
        <div className="min-h-screen bg-[#FFF9F1] py-6">
          <div className="max-w-7xl mx-auto px-4 mb-4 flex items-center justify-between">
            <button
              onClick={() => setView('landing')}
              className="text-xs font-bold text-[#6E1231] hover:underline"
            >
              ← Return to Home
            </button>
          </div>

          <ProfileWizard
            onComplete={async (profileData, selectedPlan) => {
              try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                   alert('Authentication failed. Please verify OTP again.');
                   return;
                }
                
                // Ensure users table record exists
                const { data: existingUser } = await supabase.from('users').select('id').eq('auth_id', user.id).single();
                let internalUserId;
                if (!existingUser) {
                  const { data: newUser, error: userError } = await supabase.from('users').insert({
                    auth_id: user.id,
                    phone: user.phone || profileData.mobileNumber,
                    full_name: `${profileData.firstName} ${profileData.lastName}`,
                    role: 'user'
                  }).select().single();
                  if (userError) throw userError;
                  internalUserId = newUser.id;
                } else {
                  internalUserId = existingUser.id;
                }

                // Insert into candidate_profiles
                const { data: profile, error: profileError } = await supabase.from('candidate_profiles').insert({
                   user_id: internalUserId,
                   first_name: profileData.firstName,
                   last_name: profileData.lastName,
                   gender: profileData.gender,
                   date_of_birth: profileData.dateOfBirth,
                   height_cm: profileData.heightCm,
                   marital_status: profileData.maritalStatus,
                   profile_created_for: profileData.profileFor,
                   is_active: true,
                   is_discoverable: true,
                   verification_status: 'pending'
                }).select().single();
                
                if (profileError) throw profileError;

                // Insert jain identity
                await supabase.from('jain_identities').insert({
                   candidate_id: profile.id,
                   sect: profileData.jainIdentity.sect,
                   community: profileData.jainIdentity.community,
                   saka_gotra: profileData.jainIdentity.selfSaka,
                   mamas_gotra: profileData.jainIdentity.mamasaSaka
                });

                // Create default partner preferences
                await supabase.from('partner_preferences').insert({
                   candidate_id: profile.id,
                   min_age: 18,
                   max_age: 40,
                   min_height_cm: 140,
                   max_height_cm: 200,
                   preferred_sects: [profileData.jainIdentity.sect],
                });

                window.location.href = '/dashboard';
              } catch (err: any) {
                alert(`Error creating profile: ${err.message}`);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
