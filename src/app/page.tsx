import React from 'react';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import WhyJainSaathi from '@/components/landing/WhyJainSaathi';
import TrustSystem from '@/components/landing/TrustSystem';
import AnimatedTrustMetrics from '@/components/landing/AnimatedTrustMetrics';
import HowItWorksStickyCanvas from '@/components/landing/HowItWorksStickyCanvas';
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
import PageIntroLoader from '@/components/landing/PageIntroLoader';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-text selection:bg-deepBurgundy selection:text-white">
      {/* 13-Step Cinematic Initial Entrance Sequencer */}
      <PageIntroLoader />

      {/* Sticky Glassmorphism Header */}
      <Header />
      
      <main>
        {/* 1. Hero Section (Parallax, Masked Image, Floating Parallax Cards) */}
        <HeroSection />

        {/* 2. Dynamic Count-up Statistics & Verification Pipeline */}
        <AnimatedTrustMetrics />

        {/* 3. Why JainSaathi Concept Canvas */}
        <WhyJainSaathi />

        {/* 4. Four Core Trust Pillars */}
        <TrustSystem />

        {/* 5. Cinematic Sticky Scroll Product Demonstration (6 Steps) */}
        <HowItWorksStickyCanvas />

        {/* 6. Matching Engine & UI Experience (92% Score Mockup) */}
        <MatchingEngineSection />

        {/* 7. Mutual Consent Interest Flow */}
        <InterestFlowSection />

        {/* 8. Privacy First Protected Controls */}
        <PrivacySection />

        {/* 9. Designed for Individuals, Trusted by Families */}
        <FamilyTrustSection />

        {/* 10. Exclusively Built for the Jain Community */}
        <JainCommunitySection />

        {/* 11. Digital Matrimonial Biodata Document Preview */}
        <DigitalBiodataSection />

        {/* 12. Success Stories & Real Unions */}
        <SuccessStoriesSection />

        {/* 13. Transparent Pricing & Bride Offer Banner */}
        <PricingSection />

        {/* 14. Safety & Moderation Safeguards */}
        <SafetyTransparencySection />

        {/* 15. Final Emotion-Driven Closing Section */}
        <FinalCTASection />
      </main>

      {/* Comprehensive 4-Column Luxury Footer */}
      <Footer />
    </div>
  );
}
