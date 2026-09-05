import React from 'react';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import TrustRibbonStrip from '@/components/landing/TrustRibbonStrip';
import WhyJainSaathi from '@/components/landing/WhyJainSaathi';
import PlatformExperienceShowcase from '@/components/landing/PlatformExperienceShowcase';
import BiodataFeatureBlock from '@/components/landing/BiodataFeatureBlock';
import HowItWorksStickyCanvas from '@/components/landing/HowItWorksStickyCanvas';
import PrivacySection from '@/components/landing/PrivacySection';
import FamilyTrustSection from '@/components/landing/FamilyTrustSection';
import JainCommunitySection from '@/components/landing/JainCommunitySection';
import SuccessStoriesSection from '@/components/landing/SuccessStoriesSection';
import CoverFlowPricingSection from '@/components/landing/CoverFlowPricingSection';
import SafetyTransparencySection from '@/components/landing/SafetyTransparencySection';
import FinalCTASection from '@/components/landing/FinalCTASection';
import Footer from '@/components/landing/Footer';
import PageIntroLoader from '@/components/landing/PageIntroLoader';
import FloatingPetals from '@/components/landing/FloatingPetals';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-text selection:bg-deepBurgundy selection:text-white relative overflow-x-hidden">
      {/* Global Cinematic Floating Petals & Gold Glimmer Particles (Drifting Across Full Viewport) */}
      <div className="fixed inset-0 pointer-events-none z-30">
        <FloatingPetals />
      </div>

      {/* 13-Step Cinematic Initial Entrance Sequencer */}
      <PageIntroLoader />

      {/* Sticky Elevated Glassmorphism Header */}
      <Header />
      
      <main>
        {/* 1. Hero Section (Reference 1 Composition: Left Editorial Typography, Right Angled Wedding Frame + Circular Aura + 4 Floating Parallax Cards) */}
        <HeroSection />

        {/* 2. Trust Ribbon Strip (Reference 1 Dark Curved Banner Pill Strip with Partner Badges & Live Counters) */}
        <TrustRibbonStrip />

        {/* 3. "What We Provide?" (Reference 1: 4 Elongated Vertical Oval Pill Cards on Soft Curved Wave) */}
        <WhyJainSaathi />

        {/* 4. Platform Experience Showcase (Reference 1: Split Section with Floating Mobile Device Mockup) */}
        <PlatformExperienceShowcase />

        {/* 5. 4-Gotra Digital Biodata Block (Reference 1: Dark Contrast Rounded Block with Angled 3D Document) */}
        <BiodataFeatureBlock />

        {/* 6. Interactive 6-Step Matchmaking Workflow Simulation */}
        <HowItWorksStickyCanvas />

        {/* 7. Privacy First & Photo Visibility Protection */}
        <PrivacySection />

        {/* 8. Built for Individuals, Designed for Families */}
        <FamilyTrustSection />

        {/* 9. Exclusively Built for the Jain Community */}
        <JainCommunitySection />

        {/* 10. Heartfelt Success Stories (Reference 1: Clean Testimonial Review Cards Slider) */}
        <SuccessStoriesSection />

        {/* 11. 3D Cover-Flow Pricing Section (Reference 2: 3D Perspective Card Carousel + Details Modal + Bride Offer) */}
        <CoverFlowPricingSection />

        {/* 12. Safety, Moderation & Security Safeguards */}
        <SafetyTransparencySection />

        {/* 13. Dramatic Closing Section (Parallax Wedding Artwork under Deep Burgundy Gradient) */}
        <FinalCTASection />
      </main>

      {/* Comprehensive 4-Column Luxury Footer */}
      <Footer />
    </div>
  );
}
