import React from 'react';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import WhyJainSaathi from '@/components/landing/WhyJainSaathi';
import TrustSystem from '@/components/landing/TrustSystem';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import MatchingEngineSection from '@/components/landing/MatchingEngineSection';
import InterestFlowSection from '@/components/landing/InterestFlowSection';
import PrivacySection from '@/components/landing/PrivacySection';
import FamilyTrustSection from '@/components/landing/FamilyTrustSection';
import JainCommunitySection from '@/components/landing/JainCommunitySection';
import DigitalBiodataSection from '@/components/landing/DigitalBiodataSection';
import SuccessStoriesSection from '@/components/landing/SuccessStoriesSection';
import PricingSection from '@/components/landing/PricingSection';
import SafetyTransparencySection from '@/components/landing/SafetyTransparencySection';
import FinalCTASection from '@/components/landing/FinalCTASection';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-text selection:bg-deepBurgundy selection:text-white">
      {/* Sticky Glassmorphism Header */}
      <Header />
      
      <main>
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Why JainSaathi Section */}
        <WhyJainSaathi />

        {/* 3. Four Trust Pillars */}
        <TrustSystem />

        {/* 4. 7-Step Interactive How It Works */}
        <HowItWorksSection />

        {/* 5. Matching Engine & UI Experience */}
        <MatchingEngineSection />

        {/* 6. Interest Flow & Mutual Consent */}
        <InterestFlowSection />

        {/* 7. Privacy First Locked Controls */}
        <PrivacySection />

        {/* 8. Designed for Individuals, Trusted by Families */}
        <FamilyTrustSection />

        {/* 9. Exclusively Built for the Jain Community */}
        <JainCommunitySection />

        {/* 10. Digital Matrimonial Biodata */}
        <DigitalBiodataSection />

        {/* 11. Success Stories & Unions */}
        <SuccessStoriesSection />

        {/* 12. Transparent Pricing & Bride Offer */}
        <PricingSection />

        {/* 13. Safety & Moderation Safeguards */}
        <SafetyTransparencySection />

        {/* 14. Final Emotion-Driven CTA */}
        <FinalCTASection />
      </main>

      {/* Comprehensive Footer */}
      <Footer />
    </div>
  );
}
