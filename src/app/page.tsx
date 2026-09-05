import React from 'react';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import WhyJainSaathi from '@/components/landing/WhyJainSaathi';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import PrivacySection from '@/components/landing/PrivacySection';
import FamilyAndCommunitySection from '@/components/landing/FamilyAndCommunitySection';
import PricingSectionExact from '@/components/landing/PricingSectionExact';
import FinalCTASection from '@/components/landing/FinalCTASection';
import Footer from '@/components/landing/Footer';
import UnboxingSection from '@/components/landing/UnboxingSection';
import FloatingPetals from '@/components/landing/FloatingPetals';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF3ED] font-sans text-text selection:bg-deepBurgundy selection:text-white relative overflow-x-hidden">
      
      {/* Floating Lotus & Gold Petals across Viewport */}
      <div className="fixed inset-0 pointer-events-none z-30">
        <FloatingPetals />
      </div>

      {/* Sticky Top Header */}
      <Header />
      
      <main>
        {/* 1. Hero Section (Full Panoramic Wedding Artwork + Editorial Copy + 3-Trust Pill) */}
        <UnboxingSection>
          <HeroSection />
        </UnboxingSection>

        {/* 2. "Why JainSaathi?" Section (Left Title/Button + 4 White Cards) */}
        <UnboxingSection>
          <WhyJainSaathi />
        </UnboxingSection>

        {/* 3. "How JainSaathi Works" Section (6-Step Pipeline + Dual Mobile Phones + Smart Matching) */}
        <UnboxingSection>
          <HowItWorksSection />
        </UnboxingSection>

        {/* 4. "Your Privacy Comes First" Section (4 Security Cards + 3D Metallic Shield) */}
        <UnboxingSection>
          <PrivacySection />
        </UnboxingSection>

        {/* 5. "Built for Individuals. Designed for Families." & "Rooted in the Jain Community" */}
        <UnboxingSection>
          <FamilyAndCommunitySection />
        </UnboxingSection>

        {/* 6. "Choose Your JainSaathi Journey" (Deep Burgundy 4 Pricing Cards + Bride Offer) */}
        <UnboxingSection>
          <PricingSectionExact />
        </UnboxingSection>

        {/* NOTE: Success Stories section is omitted per user's explicit directive: "just dont add sucess stories section in that" */}

        {/* 7. "Your Jain Saathi Could Be Closer Than You Think." (Closing CTA + 4 Vertical Badges) */}
        <UnboxingSection>
          <FinalCTASection />
        </UnboxingSection>
      </main>

      {/* 8. Luxury 4-Column Maroon Footer with Lotus Motif */}
      <Footer />

    </div>
  );
}
