'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import HorizontalPricingCard from './HorizontalPricingCard';
import { PlanItem } from './PricingCard';

interface HorizontalPricingCarouselProps {
  plans: PlanItem[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onViewDetails: (plan: PlanItem) => void;
  onActivate: (plan: PlanItem) => void;
  onDragProgress: (progress: number, isThresholdReached: boolean) => void;
  isFemaleEligible?: boolean;
  currentPlanId?: number | null;
}

export default function HorizontalPricingCarousel({
  plans,
  activeIndex,
  onIndexChange,
  onViewDetails,
  onActivate,
  onDragProgress,
  isFemaleEligible = false,
  currentPlanId = null,
}: HorizontalPricingCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(300);

  // Measure card width responsively
  useEffect(() => {
    const updateSize = () => {
      if (typeof window !== 'undefined') {
        const w = window.innerWidth;
        // ~78% of viewport width clamped between 260px and 340px
        const calculated = Math.min(340, Math.max(260, Math.round(w * 0.78)));
        setCardWidth(calculated);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const cardSpacing = cardWidth + 18; // space between card centers
  const ACTIVATION_THRESHOLD = 80;

  // Real-time gesture motion values
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const springX = useSpring(dragX, { stiffness: 240, damping: 26 });
  const springY = useSpring(dragY, { stiffness: 280, damping: 28 });

  const [gestureLock, setGestureLock] = useState<'NONE' | 'HORIZONTAL' | 'VERTICAL'>('NONE');

  const handlePan = (_: any, info: PanInfo) => {
    const dx = info.offset.x;
    const dy = info.offset.y;

    // 1. Establish direction lock if not yet locked
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

    // 2. Process Horizontal Carousel Drag
    if (currentLock === 'HORIZONTAL') {
      let clampedDx = dx;
      // Boundary resistance at edges
      if ((activeIndex === 0 && dx > 0) || (activeIndex === plans.length - 1 && dx < 0)) {
        clampedDx = dx * 0.28;
      }
      dragX.set(clampedDx);
      dragY.set(0);
      onDragProgress(0, false);
    }
    // 3. Process Vertical Downward Drag (Drag-to-Activate)
    else if (currentLock === 'VERTICAL') {
      dragX.set(0);
      const clampedDy = Math.max(0, dy);
      dragY.set(clampedDy);

      const progress = Math.min(1, clampedDy / ACTIVATION_THRESHOLD);
      const isReached = clampedDy >= ACTIVATION_THRESHOLD;
      onDragProgress(progress, isReached);

      if (isReached && typeof window !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate(12); } catch (_) {}
      }
    }
  };

  const handlePanEnd = (_: any, info: PanInfo) => {
    const dx = info.offset.x;
    const vx = info.velocity.x;
    const dy = info.offset.y;

    if (gestureLock === 'VERTICAL') {
      if (dy >= ACTIVATION_THRESHOLD) {
        onDragProgress(1, true);
        const selected = plans[activeIndex];
        if (selected) {
          onActivate(selected);
        }
      }
    } else if (gestureLock === 'HORIZONTAL') {
      const swipeThreshold = cardWidth * 0.22;
      if ((dx < -swipeThreshold || vx < -320) && activeIndex < plans.length - 1) {
        onIndexChange(activeIndex + 1);
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          try { navigator.vibrate(8); } catch (_) {}
        }
      } else if ((dx > swipeThreshold || vx > 320) && activeIndex > 0) {
        onIndexChange(activeIndex - 1);
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          try { navigator.vibrate(8); } catch (_) {}
        }
      }
    }

    // Reset values with smooth springs
    dragX.set(0);
    dragY.set(0);
    setGestureLock('NONE');
    onDragProgress(0, false);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full flex-1 flex flex-col items-center justify-center select-none overflow-hidden py-1"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Subtle Desktop / Mouse Arrow Navigation Controls */}
      <button
        type="button"
        onClick={() => activeIndex > 0 && onIndexChange(activeIndex - 1)}
        disabled={activeIndex === 0}
        aria-label="Previous plan"
        className={`hidden sm:flex absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-md items-center justify-center text-[#24131D] z-40 transition-all ${
          activeIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white active:scale-95'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => activeIndex < plans.length - 1 && onIndexChange(activeIndex + 1)}
        disabled={activeIndex === plans.length - 1}
        aria-label="Next plan"
        className={`hidden sm:flex absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-md items-center justify-center text-[#24131D] z-40 transition-all ${
          activeIndex === plans.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white active:scale-95'
        }`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* 3D Horizontal Carousel Stage */}
      <div 
        className="relative w-full flex items-center justify-center"
        style={{
          perspective: '1200px',
          height: 'clamp(380px, 58dvh, 460px)',
        }}
      >
        {plans.map((plan, index) => {
          const offsetIndex = index - activeIndex; // -1: left, 0: center, 1: right
          // Don't render cards far away
          if (Math.abs(offsetIndex) > 2) return null;

          const isActive = offsetIndex === 0;

          // Compute base transforms adhering to prompt section 8
          const baseOffsetX = offsetIndex * cardSpacing;
          let baseScale = 1;
          let baseRotateY = 0;
          let baseTranslateZ = 0;
          let baseOpacity = 1;
          let baseBlur = 0;
          let zIndex = 20;

          if (offsetIndex === -1) {
            // Left neighbor card (peeking on left)
            baseScale = 0.90;
            baseRotateY = 12; // tilted inward
            baseTranslateZ = -35;
            baseOpacity = 0.65;
            baseBlur = 1.2;
            zIndex = 10;
          } else if (offsetIndex === 1) {
            // Right neighbor card (peeking on right)
            baseScale = 0.90;
            baseRotateY = -12; // tilted inward
            baseTranslateZ = -35;
            baseOpacity = 0.65;
            baseBlur = 1.2;
            zIndex = 10;
          } else if (offsetIndex === -2) {
            baseScale = 0.82;
            baseRotateY = 16;
            baseTranslateZ = -70;
            baseOpacity = 0.3;
            baseBlur = 2.5;
            zIndex = 5;
          } else if (offsetIndex === 2) {
            baseScale = 0.82;
            baseRotateY = -16;
            baseTranslateZ = -70;
            baseOpacity = 0.3;
            baseBlur = 2.5;
            zIndex = 5;
          } else if (isActive) {
            zIndex = 30;
          }

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
                className="absolute cursor-grab active:cursor-grabbing will-change-transform"
              >
                <HorizontalPricingCard
                  plan={plan}
                  isActive={true}
                  onViewDetails={onViewDetails}
                  isFemaleEligible={isFemaleEligible}
                  isCurrentPlan={currentPlanId === plan.id}
                />
              </motion.div>
            );
          }

          // Non-active Neighboring Cards (Peeking on left/right, clickable)
          return (
            <motion.div
              key={plan.id}
              onClick={() => onIndexChange(index)}
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
              className="absolute cursor-pointer will-change-transform"
            >
              <HorizontalPricingCard
                plan={plan}
                isActive={false}
                onViewDetails={onViewDetails}
                isFemaleEligible={isFemaleEligible}
                isCurrentPlan={currentPlanId === plan.id}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
