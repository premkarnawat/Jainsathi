'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles, CheckCircle2 } from 'lucide-react';
import { PlanItem } from './PricingCard';

interface ActivationZoneProps {
  activePlan: PlanItem | null;
  dragProgress: number; // 0 to 1 (how far downward the active card is dragged)
  isThresholdReached: boolean;
  isActivating: boolean;
  onActivateClick?: () => void;
  isFemaleEligible?: boolean;
}

export default function ActivationZone({
  activePlan,
  dragProgress,
  isThresholdReached,
  isActivating,
  onActivateClick,
  isFemaleEligible = false,
}: ActivationZoneProps) {
  const isZeroPrice = activePlan?.priceInr === 0 || (isFemaleEligible && (activePlan?.code === 'free' || activePlan?.code === 'pro_3m'));

  return (
    <div className="w-full max-w-[360px] sm:max-w-[400px] mx-auto px-4 pb-2 z-20">
      <motion.div
        animate={{
          scale: isThresholdReached ? 1.03 : 1 + dragProgress * 0.02,
          borderColor: isThresholdReached 
            ? 'rgba(217, 164, 65, 0.9)' 
            : dragProgress > 0.2
            ? 'rgba(143, 23, 61, 0.45)'
            : 'rgba(255, 255, 255, 0.7)',
          backgroundColor: isThresholdReached
            ? 'rgba(255, 255, 255, 0.85)'
            : dragProgress > 0.1
            ? 'rgba(255, 255, 255, 0.65)'
            : 'rgba(255, 255, 255, 0.45)',
          boxShadow: isThresholdReached
            ? '0 12px 30px -5px rgba(217, 164, 65, 0.35), 0 0 0 2px rgba(217, 164, 65, 0.25)'
            : dragProgress > 0.1
            ? '0 8px 24px -6px rgba(143, 23, 61, 0.15)'
            : '0 4px 16px -4px rgba(110, 23, 53, 0.06)',
        }}
        transition={{ duration: 0.2 }}
        className="relative rounded-[28px] border-[1.5px] p-3 sm:p-3.5 backdrop-blur-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
        onClick={onActivateClick}
      >
        {/* Subtle Inner Champagne Glow */}
        <div 
          className="absolute inset-0 rounded-[28px] pointer-events-none opacity-0 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(217, 164, 65, 0.15) 0%, transparent 80%)',
            opacity: isThresholdReached ? 1 : dragProgress * 0.6,
          }}
        />

        {/* Animated Directional Arrow */}
        <div className="relative mb-1">
          <motion.div
            animate={{
              y: isThresholdReached ? [0, 4, 0] : [0, 2, 0],
              scale: isThresholdReached ? 1.2 : 1,
            }}
            transition={{
              repeat: Infinity,
              duration: isThresholdReached ? 0.7 : 1.4,
              ease: 'easeInOut',
            }}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
              isThresholdReached 
                ? 'bg-[#8F173D] text-white' 
                : 'bg-white/80 text-[#8F173D] border border-white'
            }`}
          >
            {isActivating ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isThresholdReached ? (
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <ChevronDown className="w-4 h-4 stroke-[2.5]" />
            )}
          </motion.div>
        </div>

        {/* Dynamic Instructional Copy */}
        <div className="relative">
          <p className="text-xs sm:text-[13px] font-bold tracking-tight text-[#24131D] transition-all">
            {isActivating ? (
              'Securing your membership...'
            ) : isThresholdReached ? (
              <span className="text-[#8F173D] font-black">
                Release to continue with {activePlan?.name || 'Plan'} →
              </span>
            ) : dragProgress > 0.15 ? (
              <span className="text-[#705662]">
                Keep dragging into zone...
              </span>
            ) : (
              <span className="text-[#42313B]">
                Drag plan here to continue
              </span>
            )}
          </p>

          <p className="text-[10px] text-[#7A606E] font-medium mt-0.5">
            {isZeroPrice
              ? 'Instant direct membership activation'
              : `Secure 256-bit Razorpay checkout • ${activePlan?.durationLabel || 'Instant access'}`}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
