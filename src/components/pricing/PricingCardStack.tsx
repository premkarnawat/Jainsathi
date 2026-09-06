'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import PricingCard, { PlanItem } from './PricingCard';

interface PricingCardStackProps {
  plans: PlanItem[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onViewDetails: (plan: PlanItem) => void;
  onActivate: (plan: PlanItem) => void;
  onDragProgress: (progress: number, isThresholdReached: boolean) => void;
  isFemaleEligible?: boolean;
  currentPlanId?: number | null;
}

export default function PricingCardStack({
  plans,
  activeIndex,
  onIndexChange,
  onViewDetails,
  onActivate,
  onDragProgress,
  isFemaleEligible = false,
  currentPlanId = null,
}: PricingCardStackProps) {
  const dragY = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);

  const ACTIVATION_THRESHOLD = 80;
  const SWIPE_UP_THRESHOLD = -60;

  const handleDrag = (_: any, info: PanInfo) => {
    const y = info.offset.y;
    dragY.set(y);

    // If dragging downward toward the activation zone
    if (y > 0) {
      const progress = Math.min(1, y / ACTIVATION_THRESHOLD);
      const isReached = y >= ACTIVATION_THRESHOLD;
      onDragProgress(progress, isReached);

      if (isReached && typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(10);
        } catch (_) {}
      }
    } else {
      onDragProgress(0, false);
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false);
    const y = info.offset.y;
    const vy = info.velocity.y;

    // 1. Check if dragged downward into Activation Zone (Gesture B)
    if (y >= ACTIVATION_THRESHOLD) {
      onDragProgress(1, true);
      const selectedPlan = plans[activeIndex];
      if (selectedPlan) {
        onActivate(selectedPlan);
      }
      dragY.set(0);
      return;
    }

    // 2. Check if swiped upward to browse to Next Plan (Gesture A)
    if (y < SWIPE_UP_THRESHOLD || vy < -400) {
      if (activeIndex < plans.length - 1) {
        onIndexChange(activeIndex + 1);
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          try { navigator.vibrate(8); } catch (_) {}
        }
      }
    } 
    // 3. Check if swiped downward with rapid velocity (browsing previous plan)
    else if (y > 30 && vy > 500 && y < ACTIVATION_THRESHOLD) {
      if (activeIndex > 0) {
        onIndexChange(activeIndex - 1);
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          try { navigator.vibrate(8); } catch (_) {}
        }
      }
    }

    // Reset drag
    dragY.set(0);
    onDragProgress(0, false);
  };

  return (
    <div className="relative w-full flex-1 flex flex-col items-center justify-center select-none py-2">
      {/* Visual Navigation Utility - Subtle side arrows */}
      <div className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={() => activeIndex > 0 && onIndexChange(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Previous membership plan"
          className={`w-8 h-8 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-sm flex items-center justify-center text-[#24131D] transition-all ${
            activeIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white active:scale-95'
          }`}
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => activeIndex < plans.length - 1 && onIndexChange(activeIndex + 1)}
          disabled={activeIndex === plans.length - 1}
          aria-label="Next membership plan"
          className={`w-8 h-8 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-sm flex items-center justify-center text-[#24131D] transition-all ${
            activeIndex === plans.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white active:scale-95'
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* 3D Centered Card Stage */}
      <div 
        className="relative w-full max-w-[340px] sm:max-w-[370px] aspect-[1/1.32] sm:aspect-[1/1.3] flex items-center justify-center"
        style={{ perspective: '1100px' }}
      >
        {plans.map((plan, index) => {
          const position = index - activeIndex; // e.g. -1 (prev), 0 (active), +1 (next)

          // Only render adjacent cards for optimal GPU performance
          if (Math.abs(position) > 2) return null;

          const isActive = position === 0;

          // 3D Stacking Transform Values adhering to prompt section 9
          let translateY = 0;
          let translateZ = 0;
          let scale = 1;
          let opacity = 1;
          let blur = 0;
          let zIndex = 10;

          if (position === -1) {
            // Previous card (above/behind)
            translateY = -22;
            translateZ = -45;
            scale = 0.93;
            opacity = 0.7;
            blur = 1.5;
            zIndex = 5;
          } else if (position === 1) {
            // Next card (below/behind)
            translateY = 22;
            translateZ = -45;
            scale = 0.93;
            opacity = 0.7;
            blur = 1.5;
            zIndex = 6;
          } else if (position === -2) {
            translateY = -40;
            translateZ = -90;
            scale = 0.86;
            opacity = 0.35;
            blur = 3;
            zIndex = 2;
          } else if (position === 2) {
            translateY = 40;
            translateZ = -90;
            scale = 0.86;
            opacity = 0.35;
            blur = 3;
            zIndex = 3;
          } else if (isActive) {
            zIndex = 20;
          }

          if (isActive) {
            return (
              <motion.div
                key={plan.id}
                drag="y"
                dragConstraints={{ top: -90, bottom: 120 }}
                dragElastic={0.25}
                onDragStart={() => setIsDragging(true)}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                style={{
                  y: dragY,
                  zIndex,
                  touchAction: 'none',
                }}
                animate={{
                  scale,
                  opacity,
                  filter: `blur(${blur}px)`,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 350,
                  damping: 30,
                }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing will-change-transform"
              >
                <PricingCard
                  plan={plan}
                  isActive={true}
                  onViewDetails={onViewDetails}
                  isFemaleEligible={isFemaleEligible}
                  isCurrentPlan={currentPlanId === plan.id}
                />
              </motion.div>
            );
          }

          // Background Layered Cards (Tap to select)
          return (
            <motion.div
              key={plan.id}
              onClick={() => onIndexChange(index)}
              animate={{
                y: translateY,
                z: translateZ,
                scale,
                opacity,
                filter: `blur(${blur}px)`,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 28,
              }}
              style={{
                zIndex,
                transformStyle: 'preserve-3d',
              }}
              className="absolute inset-0 cursor-pointer transition-opacity"
            >
              <PricingCard
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
