'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { PlanItem } from './PricingCard';

interface ActivationSlotProps {
  activePlan: PlanItem | null;
  dragProgress: number; // 0 to 1
  isThresholdReached: boolean;
  isActivating: boolean;
  onSlotClick?: () => void;
  isFemaleEligible?: boolean;
}

export default function ActivationSlot({
  activePlan,
  dragProgress,
  isThresholdReached,
  isActivating,
  onSlotClick,
  isFemaleEligible = false,
}: ActivationSlotProps) {
  const isZeroPrice = activePlan?.priceInr === 0 || (isFemaleEligible && (activePlan?.code === 'free' || activePlan?.code === 'pro_3m'));

  return (
    <div className="w-full max-w-[320px] sm:max-w-[360px] mx-auto px-4 z-20 select-none">
      <motion.div
        animate={{
          scale: isThresholdReached ? 1.02 : 1 + dragProgress * 0.015,
          borderColor: isThresholdReached
            ? 'rgba(217, 164, 65, 0.95)'
            : dragProgress > 0.25
            ? 'rgba(217, 164, 65, 0.6)'
            : 'rgba(217, 164, 65, 0.3)',
          backgroundColor: isThresholdReached
            ? 'rgba(255, 255, 255, 0.88)'
            : dragProgress > 0.1
            ? 'rgba(255, 255, 255, 0.65)'
            : 'rgba(255, 255, 255, 0.35)',
          boxShadow: isThresholdReached
            ? '0 12px 30px -5px rgba(217, 164, 65, 0.4), 0 0 15px rgba(217, 164, 65, 0.3)'
            : dragProgress > 0.15
            ? '0 8px 20px -6px rgba(217, 164, 65, 0.2)'
            : '0 2px 10px rgba(0, 0, 0, 0.03)',
        }}
        transition={{ duration: 0.18 }}
        onClick={onSlotClick}
        className="relative rounded-[26px] border-2 border-dashed p-3 sm:p-3.5 backdrop-blur-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
      >
        {/* Glowing Champagne Drop Receiver Indicator */}
        <div
          className="absolute inset-0 rounded-[26px] pointer-events-none transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(217, 164, 65, 0.18) 0%, transparent 80%)',
            opacity: isThresholdReached ? 1 : dragProgress * 0.7,
          }}
        />

        {/* Pulsing Down Arrow */}
        <div className="relative mb-1">
          <motion.div
            animate={{
              y: isThresholdReached ? [0, 3, 0] : [0, 2, 0],
              scale: isThresholdReached ? 1.15 : 1,
            }}
            transition={{
              repeat: Infinity,
              duration: isThresholdReached ? 0.65 : 1.3,
              ease: 'easeInOut',
            }}
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
              isThresholdReached
                ? 'bg-[#8F173D] text-white'
                : 'bg-white/80 text-[#8F173D] border border-white'
            }`}
          >
            {isActivating ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isThresholdReached ? (
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
            )}
          </motion.div>
        </div>

        {/* Dynamic Instructional Copy */}
        <div className="relative">
          <p className="text-[11px] sm:text-xs font-bold tracking-tight text-[#24131D]">
            {isActivating ? (
              'Securing your membership...'
            ) : isThresholdReached ? (
              <span className="text-[#8F173D] font-black">
                Release to activate {activePlan?.name || 'Plan'} →
              </span>
            ) : dragProgress > 0.15 ? (
              <span className="text-[#705662]">
                Release into slot to continue...
              </span>
            ) : (
              <span className="text-[#42313B]">
                Drag selected plan down to activate
              </span>
            )}
          </p>

          <p className="text-[9.5px] text-[#7A606E] font-medium mt-0.5">
            {isZeroPrice
              ? 'Instant direct membership activation'
              : `Secure checkout • ${activePlan?.durationLabel || 'Instant access'}`}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
