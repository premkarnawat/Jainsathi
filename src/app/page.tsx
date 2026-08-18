import React from 'react';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import TrustStrip from '@/components/landing/TrustStrip';
import AboutSection from '@/components/landing/AboutSection';
import HowItWorks from '@/components/landing/HowItWorks';
import SmartMatchingSection from '@/components/landing/SmartMatchingSection';
import PrivacyAndSafetySection from '@/components/landing/PrivacyAndSafetySection';
import FeaturesShowcase from '@/components/landing/FeaturesShowcase';
import PricingSection from '@/components/landing/PricingSection';
import SuccessStories from '@/components/landing/SuccessStories';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-text selection:bg-deepBurgundy selection:text-white">
      <Header />
      
      <main>
        <HeroSection />
        <TrustStrip />
        <AboutSection />
        <HowItWorks />
        <SmartMatchingSection />
        <PrivacyAndSafetySection />
        <FeaturesShowcase />
        <PricingSection />
        <SuccessStories />

        {/* Final CTA Section */}
        <section className="relative py-32 overflow-hidden border-t border-border">
          {/* Subtle Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-deepBurgundy/95 mix-blend-multiply z-10" />
            <div className="w-full h-full relative opacity-20">
              {/* Fallback to color if image doesn't load instantly, but we'll use a css class for bg or just dark color */}
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
              Your Jain Saathi May Be <br />
              <span className="italic font-normal text-champagneGold">Closer Than You Think.</span>
            </h2>
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto font-sans leading-relaxed">
              Create your profile, tell us what matters to you and discover meaningful Jain matrimonial connections today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/register" className="bg-champagneGold text-deepBurgundy hover:bg-white text-lg font-bold px-10 py-4 rounded-full transition-colors w-full sm:w-auto text-center shadow-xl">
                Create Your Profile
              </Link>
              <Link href="#how-it-works" className="bg-transparent border border-white/30 text-white hover:bg-white/10 text-lg font-semibold px-10 py-4 rounded-full transition-colors w-full sm:w-auto text-center">
                View How It Works
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
