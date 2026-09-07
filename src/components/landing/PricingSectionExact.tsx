'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LotusBlossom } from './LotusDecoration';
import HorizontalRopePricingStage from '@/components/pricing/HorizontalRopePricingStage';

export default function PricingSectionExact() {
  return (
    <section id="pricing" className="py-20 bg-[#330616] relative overflow-x-hidden text-white border-t border-[#4A0A22]">
      {/* Decorative Lotus Blossoms Framing the Edges */}
      <div className="absolute top-6 -left-8 z-10 pointer-events-none">
        <LotusBlossom size={140} rotation={25} opacity={0.7} />
      </div>
      <div className="absolute bottom-6 -right-8 z-10 pointer-events-none">
        <LotusBlossom size={150} rotation={-25} opacity={0.7} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 tracking-tight"
          >
            Choose Your <span className="text-champagneGold italic font-normal">JainSaathi</span> Journey
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xs sm:text-sm text-white/70"
          >
            Flexible membership tiers suspended along our matrimonial journey rope.
          </motion.p>
        </div>

        {/* ============================================================
            FIXED HORIZONTAL ROPE / WIRE PRICING STAGE
            (No vertical card stacking. 100% horizontal swipe + in-place expansion)
            ============================================================ */}
        <div className="w-full max-w-5xl mx-auto">
          <HorizontalRopePricingStage isDarkTheme={true} />
        </div>
      </div>
    </section>
  );
}
