'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  X, 
  Sparkles, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Heart,
  Crown
} from 'lucide-react';
import Link from 'next/link';

interface PlanDetail {
  id: string;
  name: string;
  price: string;
  duration: string;
  badge?: string;
  popular?: boolean;
  tagline: string;
  features: string[];
  fullDetails: {
    contactReveals: string;
    interestAllowance: string;
    biodataAccess: string;
    photoPrivacy: string;
    support: string;
    spotlight: string;
  };
}

const pricingPlans: PlanDetail[] = [
  {
    id: 'free',
    name: 'Free Member',
    price: '₹0',
    duration: 'Basic Lifetime Access',
    tagline: 'Ideal for initial community browsing and profile creation',
    features: [
      'Create and manage verified profile',
      'Browse Jain community recommendations',
      'Receive incoming interest requests',
      'View basic candidate summaries',
      'Standard privacy controls',
    ],
    fullDetails: {
      contactReveals: 'None (Requires upgrade to reveal direct phone)',
      interestAllowance: 'Receive unlimited, cannot send direct requests',
      biodataAccess: 'Online summary only (PDF download locked)',
      photoPrivacy: 'Standard visibility controls (Everyone/Verified)',
      support: 'Standard community email help',
      spotlight: 'Standard search ranking',
    },
  },
  {
    id: 'pro',
    name: 'Premium Pro',
    price: '₹2,499',
    duration: '3 Months Active Search',
    popular: true,
    badge: 'MOST RECOMMENDED',
    tagline: 'The ideal balance for serious candidates & families',
    features: [
      'All Free Member features included',
      'Send up to 50 Direct Interests',
      'Reveal up to 20 Verified Contact Numbers',
      'Download full 4-Gotra PDF Biodatas',
      'Priority Verified Match Badge',
    ],
    fullDetails: {
      contactReveals: '20 Direct Phone & WhatsApp reveals on mutual acceptance',
      interestAllowance: '50 direct matrimonial interest invitations',
      biodataAccess: 'Unlimited 4-Gotra official PDF downloads with watermark',
      photoPrivacy: 'Advanced (Only interested or mutually accepted)',
      support: 'Priority WhatsApp & Email assistance',
      spotlight: '2x Profile visibility in community match feeds',
    },
  },
  {
    id: 'super',
    name: 'Premium Plus',
    price: '₹4,499',
    duration: '6 Months Comprehensive',
    tagline: 'Extended duration for comprehensive family matchmaking',
    features: [
      'All Premium Pro features included',
      'Send up to 120 Direct Interests',
      'Reveal up to 50 Verified Contact Numbers',
      'Unlimited 4-Gotra PDF Biodata downloads',
      'Top-of-Search Discovery Spotlight',
    ],
    fullDetails: {
      contactReveals: '50 Direct Phone & Family contact reveals',
      interestAllowance: '120 direct matrimonial interest invitations',
      biodataAccess: 'Unlimited high-resolution PDF downloads',
      photoPrivacy: 'Custom visibility tiers with Incognito mode',
      support: 'Dedicated Relationship Assistant via phone/chat',
      spotlight: 'Top-tier placement in community match feeds',
    },
  },
  {
    id: 'deluxe',
    name: 'Deluxe VIP',
    price: '₹7,999',
    duration: '12 Months Full Support',
    tagline: 'Annual bespoke family matchmaking with dedicated consultation',
    features: [
      'All Premium Plus features included',
      'Unlimited Direct Interests to candidates',
      'Reveal up to 100 Verified Contact Numbers',
      'VIP Horoscope & Lineage Match Advisor',
      'Family consultation & elder assistance',
    ],
    fullDetails: {
      contactReveals: '100 Verified direct phone numbers with family assistance',
      interestAllowance: 'Unlimited direct matrimonial inquiries',
      biodataAccess: 'Unlimited high-res print-ready biodatas',
      photoPrivacy: 'Full Incognito & VIP privacy shielding',
      support: 'Personal Senior Matchmaker with family phone support',
      spotlight: 'VIP Featured listing at the top of all search results',
    },
  },
];

export default function CoverFlowPricingSection() {
  const [activeIndex, setActiveIndex] = useState(1); // Default to 'Premium Pro' (index 1)
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<PlanDetail | null>(null);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % pricingPlans.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + pricingPlans.length) % pricingPlans.length);
  };

  return (
    <section id="pricing" className="py-28 bg-[#FFF9F4] relative border-t border-border overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-softRose/30 via-champagneGold/15 to-softRose/20 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-champagneGold/15 border border-champagneGold/40 text-deepBurgundy text-xs font-bold uppercase tracking-widest mb-4">
              Membership Plans
            </div>
            
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-text mb-4 leading-tight">
              Choose Your <span className="text-deepBurgundy italic font-normal">JainSaathi Journey</span>
            </h2>
            
            <p className="text-base sm:text-lg text-muted">
              Transparent plans tailored for your family's pace. No hidden auto-renewals, zero arbitrary locks.
            </p>
          </motion.div>
        </div>

        {/* Special Community Banner: Eligible Bride Profiles - Free for 1 Year */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-16 bg-gradient-to-r from-softRose via-white to-softRose border-2 border-champagneGold/50 rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-13 h-13 rounded-2xl bg-deepBurgundy text-champagneGold flex items-center justify-center p-3 shadow-md shrink-0">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-deepBurgundy bg-white px-3 py-0.5 rounded-full border border-champagneGold/30 inline-block mb-1">
                Community Initiative
              </span>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-deepBurgundy">
                Eligible Bride Profiles — Free for 1 Year
              </h3>
              <p className="text-xs sm:text-sm text-muted">
                To honor our Jain daughters, verified female candidate profiles receive complimentary access upon administrative verification.
              </p>
            </div>
          </div>

          <Link
            href="/register"
            className="btn-ruby shrink-0 text-xs sm:text-sm px-6 py-3 shadow-md"
          >
            Check Eligibility
          </Link>
        </motion.div>

        {/* =========================================================================
            REFERENCE IMAGE 2: 3D COVER-FLOW PERSPECTIVE PRICING CAROUSEL
            ========================================================================= */}
        <div className="relative perspective-1200 py-6">
          <div className="flex items-center justify-center min-h-[500px] relative">
            {pricingPlans.map((plan, index) => {
              const offset = index - activeIndex;
              const isActive = offset === 0;
              const isPrev = offset === -1 || (activeIndex === 0 && index === pricingPlans.length - 1);
              const isNext = offset === 1 || (activeIndex === pricingPlans.length - 1 && index === 0);

              // Calculate 3D perspective transforms inspired by Reference 2
              let rotateY = 0;
              let translateX = 0;
              let scale = 0.88;
              let zIndex = 10;
              let opacity = 0.5;

              if (isActive) {
                rotateY = 0;
                translateX = 0;
                scale = 1.05;
                zIndex = 30;
                opacity = 1;
              } else if (offset === -1 || (activeIndex === 0 && index === pricingPlans.length - 1)) {
                rotateY = 22; // Angled inward from left
                translateX = -260;
                scale = 0.9;
                zIndex = 20;
                opacity = 0.75;
              } else if (offset === 1 || (activeIndex === pricingPlans.length - 1 && index === 0)) {
                rotateY = -22; // Angled inward from right
                translateX = 260;
                scale = 0.9;
                zIndex = 20;
                opacity = 0.75;
              } else {
                // Outlying cards
                rotateY = offset < 0 ? 35 : -35;
                translateX = offset < 0 ? -480 : 480;
                scale = 0.8;
                zIndex = 5;
                opacity = 0.2;
              }

              return (
                <motion.div
                  key={plan.id}
                  onClick={() => setActiveIndex(index)}
                  animate={{
                    rotateY,
                    x: translateX,
                    scale,
                    opacity,
                    zIndex,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`absolute w-[310px] sm:w-[360px] rounded-[32px] p-7 cursor-pointer transition-shadow preserve-3d ${
                    isActive
                      ? 'bg-deepBurgundy text-white border-2 border-champagneGold shadow-2xl burgundy-glow'
                      : 'bg-white text-text border border-border shadow-xl hover:border-champagneGold/60'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="inline-block bg-champagneGold text-deepBurgundy text-[9.5px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full mb-3 shadow-sm">
                      {plan.badge}
                    </div>
                  )}

                  {/* Plan Name & Price */}
                  <h3 className={`font-serif font-bold text-2xl mb-1 ${isActive ? 'text-white' : 'text-text'}`}>
                    {plan.name}
                  </h3>
                  
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className={`font-serif text-3xl sm:text-4xl font-bold ${isActive ? 'text-champagneGold' : 'text-deepBurgundy'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-xs font-semibold ${isActive ? 'text-white/70' : 'text-muted'}`}>
                      / {plan.duration}
                    </span>
                  </div>

                  <p className={`text-xs mb-6 ${isActive ? 'text-white/80' : 'text-muted'}`}>
                    {plan.tagline}
                  </p>

                  {/* Key Features List */}
                  <div className="space-y-2.5 pt-4 border-t border-border/40 mb-6 text-xs">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2">
                        <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isActive ? 'text-champagneGold' : 'text-success'}`} />
                        <span className={isActive ? 'text-white/90' : 'text-text'}>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions: See More Details + Choose Plan */}
                  <div className="space-y-3 pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlanForModal(plan);
                      }}
                      className={`w-full py-2.5 rounded-full text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                        isActive
                          ? 'border-white/30 text-champagneGold hover:bg-white/10'
                          : 'border-border text-deepBurgundy hover:bg-secondary'
                      }`}
                    >
                      <Info className="w-3.5 h-3.5" />
                      See More Details
                    </button>

                    <Link
                      href="/register"
                      className={`w-full py-3 rounded-full text-center text-xs font-bold block transition-all ${
                        isActive
                          ? 'bg-champagneGold text-deepBurgundy hover:bg-white shadow-lg'
                          : 'bg-secondary text-deepBurgundy border border-border hover:bg-deepBurgundy hover:text-white'
                      }`}
                    >
                      Choose {plan.name}
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Carousel Navigation Arrows & Indicators (Ref 2 Navigation) */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={handlePrev}
              aria-label="Previous Plan"
              className="w-11 h-11 rounded-full bg-white border border-border shadow-md text-deepBurgundy hover:bg-deepBurgundy hover:text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Pagination Dots */}
            <div className="flex gap-2">
              {pricingPlans.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Go to plan ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeIndex === i ? 'w-8 bg-deepBurgundy' : 'w-2.5 bg-border hover:bg-champagneGold'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="Next Plan"
              className="w-11 h-11 rounded-full bg-white border border-border shadow-md text-deepBurgundy hover:bg-deepBurgundy hover:text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>

      {/* =========================================================================
          "SEE MORE DETAILS" EXPANDED BREAKDOWN MODAL DIALOG
          ========================================================================= */}
      <AnimatePresence>
        {selectedPlanForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlanForModal(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border-2 border-champagneGold shadow-2xl z-10 text-text space-y-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-champagneGold">
                    Plan Specifications
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-deepBurgundy">
                    {selectedPlanForModal.name} ({selectedPlanForModal.price})
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPlanForModal(null)}
                  className="p-2 rounded-full bg-secondary text-muted hover:text-text border border-border"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Detailed Breakdown Grid */}
              <div className="space-y-3.5 text-xs">
                <div className="bg-secondary p-3 rounded-xl border border-border/80">
                  <span className="font-bold text-deepBurgundy block mb-0.5">Contact Reveals:</span>
                  <p className="text-muted">{selectedPlanForModal.fullDetails.contactReveals}</p>
                </div>

                <div className="bg-secondary p-3 rounded-xl border border-border/80">
                  <span className="font-bold text-deepBurgundy block mb-0.5">Interest Allowance:</span>
                  <p className="text-muted">{selectedPlanForModal.fullDetails.interestAllowance}</p>
                </div>

                <div className="bg-secondary p-3 rounded-xl border border-border/80">
                  <span className="font-bold text-deepBurgundy block mb-0.5">Digital Biodata Access:</span>
                  <p className="text-muted">{selectedPlanForModal.fullDetails.biodataAccess}</p>
                </div>

                <div className="bg-secondary p-3 rounded-xl border border-border/80">
                  <span className="font-bold text-deepBurgundy block mb-0.5">Photo & Privacy Protection:</span>
                  <p className="text-muted">{selectedPlanForModal.fullDetails.photoPrivacy}</p>
                </div>

                <div className="bg-secondary p-3 rounded-xl border border-border/80">
                  <span className="font-bold text-deepBurgundy block mb-0.5">Support & Advisory:</span>
                  <p className="text-muted">{selectedPlanForModal.fullDetails.support}</p>
                </div>

                <div className="bg-secondary p-3 rounded-xl border border-border/80">
                  <span className="font-bold text-deepBurgundy block mb-0.5">Search Ranking Spotlight:</span>
                  <p className="text-muted">{selectedPlanForModal.fullDetails.spotlight}</p>
                </div>
              </div>

              {/* Modal CTA */}
              <div className="pt-3">
                <Link
                  href="/register"
                  onClick={() => setSelectedPlanForModal(null)}
                  className="btn-ruby w-full py-3 text-center text-xs font-bold block shadow-lg"
                >
                  Proceed with {selectedPlanForModal.name}
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
