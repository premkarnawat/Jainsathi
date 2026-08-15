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
            onComplete={() => {
              window.location.href = '/dashboard';
            }}
          />
        </div>
      )}
    </div>
  );
}
