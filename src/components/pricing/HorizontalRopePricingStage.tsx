'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence, PanInfo } from 'framer-motion';
import { Check, ArrowRight, X, ChevronDown, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Phone, FileText, Award } from 'lucide-react';
import { PlanItem } from './PricingCard';

// Verified Database Default Plans Fallback (Ensures 100% Reliable Render with Zero Broken Screens)
const DEFAULT_PLANS: PlanItem[] = [
  {
    id: 1,
    code: 'free',
    name: 'Free',
    priceInr: 0,
    durationDays: 365,
    durationMonths: 12,
    durationLabel: '1 Year',
    subtitle: 'Begin your JainSaathi journey',
    badge: null,
    contactRevealLimit: 0,
    biodataDownloadLimit: 2,
    isFeaturedAllowed: false,
    features: ['Create Profile', 'Smart Matching', 'Receive Interests', 'Basic Search'],
  },
  {
    id: 2,
    code: 'pro_3m',
    name: 'Pro',
    priceInr: 1999,
    durationDays: 90,
    durationMonths: 3,
    durationLabel: '3 Months',
    subtitle: 'For active matrimonial search',
    badge: null,
    contactRevealLimit: 10,
    biodataDownloadLimit: 25,
    isFeaturedAllowed: false,
    features: ['View Full Profiles', '10 Contact Reveals', 'Send Unlimited Interests', 'Direct Chat Request', 'Verified Profile Badge'],
  },
  {
    id: 3,
    code: 'super_3m',
    name: 'Super',
    priceInr: 3499,
    durationDays: 90,
    durationMonths: 3,
    durationLabel: '3 Months',
    subtitle: 'For serious matrimonial search',
    badge: 'Most Popular',
    contactRevealLimit: 25,
    biodataDownloadLimit: 50,
    isFeaturedAllowed: true,
    features: ['Most Popular', '25 Contact Reveals', 'Featured Listing for 14 Days', 'Priority Recommendation', 'Full Biodata Access', 'Dedicated Relationship Manager'],
  },
  {
    id: 4,
    code: 'deluxe_6m',
    name: 'Deluxe',
    priceInr: 5999,
    durationDays: 180,
    durationMonths: 6,
    durationLabel: '6 Months',
    subtitle: 'For maximum visibility and connections',
    badge: 'Best Value',
    contactRevealLimit: 60,
    biodataDownloadLimit: 150,
    isFeaturedAllowed: true,
    features: ['Best Value', '60 Contact Reveals', 'Featured Profile for 30 Days', 'Top Ranking in Search', 'Personalized Assistance', 'Exclusive Family Verification'],
  },
];

interface HorizontalRopePricingStageProps {
  onActivatePlan?: (plan: PlanItem) => void;
  isDarkTheme?: boolean;
}

export default function HorizontalRopePricingStage({
  onActivatePlan,
  isDarkTheme = false,
}: HorizontalRopePricingStageProps) {
  const [plans, setPlans] = useState<PlanItem[]>(DEFAULT_PLANS);
  const [activeIndex, setActiveIndex] = useState(2); // Default to Super (Most Popular)
  const [detailPlan, setDetailPlan] = useState<PlanItem | null>(null);
  const [isFemaleEligible, setIsFemaleEligible] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);

  // Responsive card measurements
  const [cardWidth, setCardWidth] = useState(300);
  const cardSpacing = cardWidth + 20;

  // Activation drag states
  const [dragProgress, setDragProgress] = useState(0);
  const [isThresholdReached, setIsThresholdReached] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  // Motion values
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const springX = useSpring(dragX, { stiffness: 240, damping: 26 });
  const springY = useSpring(dragY, { stiffness: 280, damping: 28 });

  const [gestureLock, setGestureLock] = useState<'NONE' | 'HORIZONTAL' | 'VERTICAL'>('NONE');

  const ACTIVATION_THRESHOLD = 80;

  // 1. Fetch Authoritative Database Plans on Mount
  useEffect(() => {
    let isMounted = true;
    async function loadPlans() {
      try {
        const res = await fetch('/api/plans');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && data.plans && data.plans.length > 0) {
            setPlans(data.plans);
            setIsFemaleEligible(Boolean(data.isFemaleEligibleForFreeYear));
            setCurrentSubscription(data.currentSubscription || null);
          }
        }
      } catch (_) {
        // Gracefully keep DEFAULT_PLANS - zero technical errors displayed to user
      }
    }
    loadPlans();
    return () => { isMounted = false; };
  }, []);

  // 2. Responsive Card Width Calculation
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const w = window.innerWidth;
        // ~78% of viewport width clamped between 260px and 340px
        const calculated = Math.min(340, Math.max(260, Math.round(w * 0.78)));
        setCardWidth(calculated);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 3. Gesture Handling with Strict Direction Locking
  const handlePan = (_: any, info: PanInfo) => {
    // If detail card is open, ignore carousel pan
    if (detailPlan) return;

    const dx = info.offset.x;
    const dy = info.offset.y;

    let currentLock = gestureLock;
    if (currentLock === 'NONE') {
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (absX > 6 || absY > 6) {
        if (absX > absY) {
          currentLock = 'HORIZONTAL';
          setGestureLock('HORIZONTAL');
        } else if (dy > 4) {
          currentLock = 'VERTICAL';
          setGestureLock('VERTICAL');
        }
      }
    }

    // Gesture 1: Horizontal Swipe (Browse Plans Along Rope)
    if (currentLock === 'HORIZONTAL') {
      let clampedDx = dx;
      if ((activeIndex === 0 && dx > 0) || (activeIndex === plans.length - 1 && dx < 0)) {
        clampedDx = dx * 0.25; // boundary rubber band
      }
      dragX.set(clampedDx);
      dragY.set(0);
      setDragProgress(0);
      setIsThresholdReached(false);
    }
    // Gesture 2: Vertical Downward Drag (Drag-to-Pay into Activation Zone)
    else if (currentLock === 'VERTICAL') {
      dragX.set(0);
      const clampedDy = Math.max(0, dy);
      dragY.set(clampedDy);

      const progress = Math.min(1, clampedDy / ACTIVATION_THRESHOLD);
      const reached = clampedDy >= ACTIVATION_THRESHOLD;
      setDragProgress(progress);
      setIsThresholdReached(reached);

      if (reached && typeof window !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate(10); } catch (_) {}
      }
    }
  };

  const handlePanEnd = (_: any, info: PanInfo) => {
    if (detailPlan) return;

    const dx = info.offset.x;
    const vx = info.velocity.x;
    const dy = info.offset.y;

    if (gestureLock === 'VERTICAL') {
      if (dy >= ACTIVATION_THRESHOLD) {
        const selected = plans[activeIndex];
        if (selected) {
          triggerActivation(selected);
        }
      }
    } else if (gestureLock === 'HORIZONTAL') {
      const swipeThreshold = cardWidth * 0.22;
      if ((dx < -swipeThreshold || vx < -300) && activeIndex < plans.length - 1) {
        setActiveIndex(activeIndex + 1);
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          try { navigator.vibrate(8); } catch (_) {}
        }
      } else if ((dx > swipeThreshold || vx > 300) && activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          try { navigator.vibrate(8); } catch (_) {}
        }
      }
    }

    // Reset with smooth springs
    dragX.set(0);
    dragY.set(0);
    setGestureLock('NONE');
    setDragProgress(0);
    setIsThresholdReached(false);
  };

  const triggerActivation = (selected: PlanItem) => {
    setIsActivating(true);
    if (onActivatePlan) {
      onActivatePlan(selected);
    } else if (typeof window !== 'undefined') {
      // Default navigation to /pricing with selected plan
      window.location.href = `/pricing?plan=${selected.id}`;
    }
  };

  const activePlan = plans[activeIndex] || plans[0];

  return (
    <div 
      className="relative w-full flex flex-col items-center justify-between select-none overflow-x-hidden overflow-y-visible py-2"
      style={{ touchAction: 'pan-y' }}
    >
      {/* ============================================================
          1. THE HORIZONTAL ROPE / WIRE WITH ATTACHMENT POINTS
          ============================================================ */}
      <div className="relative w-full max-w-4xl mx-auto h-7 flex items-center justify-center pointer-events-none z-10 px-4">
        {/* The Continuous Glowing Gold Rope */}
        <div 
          className="absolute left-0 right-0 h-[2px] rounded-full shadow-[0_1px_8px_rgba(217,164,65,0.45)]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(217, 164, 65, 0.3) 6%, rgba(217, 164, 65, 0.95) 50%, rgba(217, 164, 65, 0.3) 94%, transparent 100%)',
          }}
        />

        {/* Rope Wall Cleats / End Finials */}
        <div className="absolute left-3 w-2.5 h-2.5 rounded-full bg-[#D9A441] border border-white shadow-sm" />
        <div className="absolute right-3 w-2.5 h-2.5 rounded-full bg-[#D9A441] border border-white shadow-sm" />
      </div>

      {/* ============================================================
          2. THE FIXED PRICING STAGE (Cards suspended along horizontal rope)
          ============================================================ */}
      <div 
        className="relative w-full flex items-center justify-center"
        style={{
          perspective: '1200px',
          height: 'clamp(380px, 56dvh, 440px)',
        }}
      >
        {/* Desktop / Tablet Left & Right Arrow Buttons */}
        <button
          type="button"
          onClick={() => activeIndex > 0 && setActiveIndex(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Previous plan"
          className={`hidden sm:flex absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-white shadow-md items-center justify-center text-[#24131D] z-40 transition-all ${
            activeIndex === 0 ? 'opacity-25 cursor-not-allowed' : 'hover:bg-white active:scale-95'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => activeIndex < plans.length - 1 && setActiveIndex(activeIndex + 1)}
          disabled={activeIndex === plans.length - 1}
          aria-label="Next plan"
          className={`hidden sm:flex absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-white shadow-md items-center justify-center text-[#24131D] z-40 transition-all ${
            activeIndex === plans.length - 1 ? 'opacity-25 cursor-not-allowed' : 'hover:bg-white active:scale-95'
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* The Horizontal Carousel Cards */}
        {plans.map((plan, index) => {
          const offsetIndex = index - activeIndex;
          if (Math.abs(offsetIndex) > 2) return null;

          const isActive = offsetIndex === 0;
          const baseOffsetX = offsetIndex * cardSpacing;

          let baseScale = 1;
          let baseRotateY = 0;
          let baseTranslateZ = 0;
          let baseOpacity = 1;
          let baseBlur = 0;
          let zIndex = 20;

          if (offsetIndex === -1) {
            baseScale = 0.90;
            baseRotateY = 10;
            baseTranslateZ = -35;
            baseOpacity = 0.65;
            baseBlur = 1.2;
            zIndex = 10;
          } else if (offsetIndex === 1) {
            baseScale = 0.90;
            baseRotateY = -10;
            baseTranslateZ = -35;
            baseOpacity = 0.65;
            baseBlur = 1.2;
            zIndex = 10;
          } else if (offsetIndex === -2) {
            baseScale = 0.82;
            baseRotateY = 14;
            baseTranslateZ = -70;
            baseOpacity = 0.3;
            baseBlur = 2.5;
            zIndex = 5;
          } else if (offsetIndex === 2) {
            baseScale = 0.82;
            baseRotateY = -14;
            baseTranslateZ = -70;
            baseOpacity = 0.3;
            baseBlur = 2.5;
            zIndex = 5;
          } else if (isActive) {
            zIndex = 30;
          }

          // Active Card (Draggable horizontally for browsing, downward for activation)
          if (isActive) {
            return (
              <motion.div
                key={plan.id}
                onPan={handlePan}
                onPanEnd={handlePanEnd}
                style={{
                  width: `${cardWidth}px`,
                  height: '100%',
                  x: springX,
                  y: springY,
                  zIndex,
                  touchAction: 'none',
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  scale: baseScale,
                  rotateY: baseRotateY,
                  z: baseTranslateZ,
                  opacity: baseOpacity,
                  filter: `blur(${baseBlur}px)`,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 240,
                  damping: 26,
                }}
                className="absolute cursor-grab active:cursor-grabbing will-change-transform flex flex-col items-center"
              >
                {/* Visual Hanging Suspension Cord to Horizontal Rope */}
                <div className="w-[1.5px] h-5 bg-gradient-to-b from-[#D9A441] to-[#D9A441]/50 mb-0.5 shrink-0 relative">
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-[#D9A441] bg-[#FFF9F3] shadow-xs flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-[#D9A441]" />
                  </div>
                </div>

                {/* The Card Itself */}
                <div className="flex-1 w-full">
                  <PricingCardBody
                    plan={plan}
                    isActive={true}
                    onViewDetails={() => setDetailPlan(plan)}
                    isFemaleEligible={isFemaleEligible}
                    isCurrentPlan={currentSubscription?.plan_id === plan.id}
                    isDarkTheme={isDarkTheme}
                  />
                </div>
              </motion.div>
            );
          }

          // Inactive Neighboring Cards (Suspended on rope, clickable to focus)
          return (
            <motion.div
              key={plan.id}
              onClick={() => setActiveIndex(index)}
              style={{
                width: `${cardWidth}px`,
                height: '100%',
                x: baseOffsetX,
                zIndex,
                transformStyle: 'preserve-3d',
              }}
              animate={{
                scale: baseScale,
                rotateY: baseRotateY,
                z: baseTranslateZ,
                opacity: baseOpacity,
                filter: `blur(${baseBlur}px)`,
              }}
              transition={{
                type: 'spring',
                stiffness: 240,
                damping: 26,
              }}
              className="absolute cursor-pointer will-change-transform flex flex-col items-center"
            >
              {/* Visual Suspension Cord */}
              <div className="w-[1.5px] h-5 bg-gradient-to-b from-[#D9A441]/70 to-[#D9A441]/30 mb-0.5 shrink-0 relative">
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-[#D9A441]/70 bg-[#FFF9F3]/90" />
              </div>

              {/* The Inactive Card */}
              <div className="flex-1 w-full">
                <PricingCardBody
                  plan={plan}
                  isActive={false}
                  onViewDetails={() => setDetailPlan(plan)}
                  isFemaleEligible={isFemaleEligible}
                  isCurrentPlan={currentSubscription?.plan_id === plan.id}
                  isDarkTheme={isDarkTheme}
                />
              </div>
            </motion.div>
          );
        })}

        {/* ============================================================
            3. IN-PLACE GLASSMORPHISM DETAIL CARD (Within the SAME Fixed Stage!)
            ============================================================ */}
        <AnimatePresence>
          {detailPlan && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-3 select-none">
              {/* Subtle Stage Backdrop Blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setDetailPlan(null)}
                className="absolute inset-0 bg-[#24131D]/40 backdrop-blur-md rounded-3xl"
              />

              {/* Expanded Card in Fixed Position (Zero Page Height Change) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 28,
                }}
                className="relative w-full max-w-[360px] max-h-[92%] overflow-y-auto rounded-[32px] bg-gradient-to-b from-white/95 via-white/90 to-white/80 backdrop-blur-2xl border-2 border-[#D9A441] p-5 sm:p-6 shadow-[0_20px_50px_rgba(217,164,65,0.3),inset_0_1.5px_2px_rgba(255,255,255,1)] text-[#24131D] flex flex-col justify-between"
                style={{ touchAction: 'pan-y' }}
              >
                {/* Single Minimal Close Icon */}
                <button
                  type="button"
                  onClick={() => setDetailPlan(null)}
                  aria-label="Close details"
                  className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#24131D] transition-colors"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>

                {/* Plan Title & Price */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#8F173D]/10 text-[#8F173D]">
                      {detailPlan.code.toUpperCase()}
                    </span>
                    {detailPlan.badge && (
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#D9A441]/20 text-[#9E6F18]">
                        {detailPlan.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-2xl font-black text-[#24131D]">
                    {detailPlan.name} Membership
                  </h3>

                  <div className="flex items-baseline gap-1.5 mt-1.5 pb-2 border-b border-gray-100">
                    <span className="font-serif text-2xl font-black text-[#24131D]">
                      {detailPlan.priceInr === 0 ? '₹0' : `₹${detailPlan.priceInr.toLocaleString('en-IN')}`}
                    </span>
                    <span className="text-xs text-[#705662] font-medium">
                      / {detailPlan.durationLabel}
                    </span>
                  </div>
                </div>

                {/* Full Database Entitlements & Usage Limits */}
                <div className="my-2.5 space-y-2">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A606E]">
                    Membership Entitlements
                  </h4>

                  <div className="space-y-1.5 text-xs">
                    {/* Contact Reveals */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-white">
                      <Phone className="w-3.5 h-3.5 text-[#8F173D] shrink-0" />
                      <div>
                        <span className="font-bold text-[#24131D] block text-[11px]">
                          {detailPlan.contactRevealLimit > 0
                            ? `${detailPlan.contactRevealLimit} Verified Contact Reveals`
                            : 'Mutual Interest Connect Only'}
                        </span>
                      </div>
                    </div>

                    {/* Biodata Downloads */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-white">
                      <FileText className="w-3.5 h-3.5 text-[#9E6F18] shrink-0" />
                      <div>
                        <span className="font-bold text-[#24131D] block text-[11px]">
                          {detailPlan.biodataDownloadLimit > 0
                            ? `${detailPlan.biodataDownloadLimit} Full 4-Gotra Biodata Downloads`
                            : '2 Summary Biodata Views'}
                        </span>
                      </div>
                    </div>

                    {/* Featured Placement */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-white/70 border border-white">
                      <Award className="w-3.5 h-3.5 text-[#24131D] shrink-0" />
                      <div>
                        <span className="font-bold text-[#24131D] block text-[11px]">
                          {detailPlan.isFeaturedAllowed ? 'Featured Priority Matchmaker Placement' : 'Standard Community Listing'}
                        </span>
                      </div>
                    </div>

                    {/* Database Features List */}
                    {detailPlan.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 px-2 py-1 text-[11px] font-medium text-[#42313B]">
                        <Check className="w-3 h-3 text-[#8F173D] stroke-[2.5] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Close & Continue Button */}
                <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDetailPlan(null)}
                    className="flex-1 py-2 rounded-full border border-gray-300 text-xs font-bold text-[#24131D] hover:bg-gray-50 transition-all"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDetailPlan(null);
                      triggerActivation(detailPlan);
                    }}
                    className="flex-1 py-2 rounded-full bg-[#8F173D] text-white text-xs font-bold shadow-md hover:bg-[#6E1735] transition-all flex items-center justify-center gap-1"
                  >
                    <span>Activate Plan</span>
                    <Sparkles className="w-3 h-3 text-[#E9C77B]" />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* ============================================================
          4. MINIMAL PLAN INDICATORS (4 Minimal Dots/Pills along rope)
          ============================================================ */}
      <div className="flex items-center justify-center gap-1.5 py-1 z-20">
        {plans.map((p, idx) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActiveIndex(idx)}
            aria-label={`Select ${p.name}`}
            className={`transition-all px-2 py-0.5 rounded-full text-[10px] font-bold ${
              idx === activeIndex
                ? 'bg-[#8F173D] text-white shadow-xs scale-105'
                : 'bg-black/5 text-[#705662] hover:bg-black/10'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* ============================================================
          5. DRAG DOWN TO PURCHASE ACTIVATION ZONE (Section 21, 22, 23)
          ============================================================ */}
      <div className="w-full max-w-[320px] sm:max-w-[360px] mx-auto px-4 pt-1 z-20">
        <motion.div
          animate={{
            scale: isThresholdReached ? 1.02 : 1 + dragProgress * 0.015,
            borderColor: isThresholdReached
              ? 'rgba(217, 164, 65, 0.95)'
              : dragProgress > 0.25
              ? 'rgba(217, 164, 65, 0.65)'
              : 'rgba(217, 164, 65, 0.35)',
            backgroundColor: isThresholdReached
              ? 'rgba(255, 255, 255, 0.92)'
              : dragProgress > 0.1
              ? 'rgba(255, 255, 255, 0.7)'
              : 'rgba(255, 255, 255, 0.4)',
            boxShadow: isThresholdReached
              ? '0 8px 24px -4px rgba(217, 164, 65, 0.4), 0 0 12px rgba(217, 164, 65, 0.3)'
              : '0 2px 8px rgba(0, 0, 0, 0.03)',
          }}
          transition={{ duration: 0.15 }}
          onClick={() => triggerActivation(activePlan)}
          className="relative rounded-[24px] border-2 border-dashed p-2.5 sm:p-3 backdrop-blur-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all"
        >
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#24131D]">
            <motion.div
              animate={{ y: isThresholdReached ? [0, 2, 0] : [0, 1.5, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              <ChevronDown className="w-3.5 h-3.5 text-[#8F173D] stroke-[2.5]" />
            </motion.div>
            <span>
              {isActivating ? (
                'Securing membership...'
              ) : isThresholdReached ? (
                <span className="text-[#8F173D] font-black">Release to Continue →</span>
              ) : (
                <span>↓ DRAG TO CONTINUE</span>
              )}
            </span>
          </div>

          <p className="text-[9.5px] text-[#705662] font-medium mt-0.5">
            Secure Checkout • {activePlan.name} ({activePlan.durationLabel})
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// Sub-component: Clean Glassmorphic Card Body
function PricingCardBody({
  plan,
  isActive,
  onViewDetails,
  isFemaleEligible,
  isCurrentPlan,
  isDarkTheme,
}: {
  plan: PlanItem;
  isActive: boolean;
  onViewDetails: () => void;
  isFemaleEligible: boolean;
  isCurrentPlan: boolean;
  isDarkTheme: boolean;
}) {
  const isFree = plan.priceInr === 0;
  const isFemaleFree = isFemaleEligible && (plan.code === 'free' || plan.code === 'pro_3m');

  const highlightFeatures = [
    plan.contactRevealLimit > 0
      ? `${plan.contactRevealLimit} Verified Contact Reveals`
      : 'Mutual Interest Requests',
    plan.biodataDownloadLimit > 0
      ? `${plan.biodataDownloadLimit} Full 4-Gotra PDF Biodatas`
      : 'Summary Biodata Access',
    plan.isFeaturedAllowed
      ? 'Featured Profile Placement'
      : 'Standard Directory Visibility',
  ];

  return (
    <div
      className={`relative w-full h-full rounded-[30px] sm:rounded-[34px] p-5 sm:p-6 flex flex-col justify-between select-none overflow-hidden transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-b from-white/80 via-white/60 to-white/40 backdrop-blur-2xl border-2 border-[#D9A441] shadow-[0_0_28px_rgba(217,164,65,0.32),0_18px_40px_-10px_rgba(110,23,53,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.95)]'
          : 'bg-gradient-to-b from-white/55 via-white/40 to-white/25 backdrop-blur-xl border border-white/70 shadow-[0_10px_25px_-8px_rgba(110,23,53,0.08)]'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-1.5 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/80 text-[#8F173D] border border-white/90 shadow-xs">
              {plan.code.toUpperCase()}
            </span>
            {plan.badge && (
              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#D9A441]/20 text-[#9E6F18] border border-[#D9A441]/30">
                {plan.badge}
              </span>
            )}
          </div>

          {isCurrentPlan && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 shrink-0">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Active
            </span>
          )}
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-black text-[#24131D] tracking-tight leading-none">
          {plan.name}
        </h3>
        <p className="text-[11px] sm:text-xs text-[#705662] font-medium mt-0.5 line-clamp-1">
          {plan.subtitle}
        </p>
      </div>

      {/* Pricing Display */}
      <div className="my-auto py-1">
        {isFemaleFree ? (
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-black text-[#8F173D]">Free</span>
              <span className="text-xs font-bold text-[#8F173D]/80">for 1 Year</span>
            </div>
            <p className="text-[10px] font-bold text-[#9E6F18] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D9A441]" /> Female Privilege
            </p>
          </div>
        ) : isFree ? (
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-2xl sm:text-3xl font-black text-[#24131D]">₹0</span>
            <span className="text-xs font-medium text-[#705662]">/ 1 Year</span>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-black text-[#24131D] tracking-tight">
                ₹{plan.priceInr.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-medium text-[#705662]">
                / {plan.durationLabel}
              </span>
            </div>
            <p className="text-[10px] font-medium text-[#9E6F18] mt-0.5">
              ~₹{Math.round(plan.priceInr / Math.max(1, plan.durationMonths))} / month
            </p>
          </div>
        )}

        {/* 2–4 Benefits on Collapsed Card */}
        <ul className="mt-2.5 space-y-1 text-[11px] sm:text-xs text-[#42313B]">
          {highlightFeatures.map((feat, idx) => (
            <li key={idx} className="flex items-center gap-1.5 font-medium">
              <span className="w-3.5 h-3.5 rounded-full bg-[#8F173D]/10 text-[#8F173D] flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
              <span className="truncate">{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* View More Details Trigger (Expands in-place) */}
      <div className="pt-2 border-t border-white/60 flex items-center justify-between">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
          className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white border border-white shadow-xs text-xs font-bold text-[#24131D] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>View More Details</span>
          <ArrowRight className="w-3 h-3 text-[#24131D] transition-transform group-hover:translate-x-0.5" />
        </button>

        <span className="text-sm font-serif text-[#24131D]/60 select-none">✦</span>
      </div>
    </div>
  );
}
