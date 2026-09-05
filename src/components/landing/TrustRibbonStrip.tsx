'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Lock, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';

export default function TrustRibbonStrip() {
  const [metrics, setMetrics] = useState({
    profiles: 0,
    communities: 0,
    privacy: 0,
    satisfaction: 0,
  });

  useEffect(() => {
    // Smooth animated number counting
    const duration = 1200;
    const steps = 30;
    const intervalTime = duration / steps;
    let currentStep = 0;

    const targetMetrics = {
      profiles: 2500,
      communities: 18,
      privacy: 100,
      satisfaction: 98,
    };

    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep / steps, 1);
      setMetrics({
        profiles: Math.floor(targetMetrics.profiles * progress),
        communities: Math.floor(targetMetrics.communities * progress),
        privacy: Math.floor(targetMetrics.privacy * progress),
        satisfaction: Math.floor(targetMetrics.satisfaction * progress),
      });

      if (currentStep >= steps) clearInterval(timer);
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const trustPartners = [
    { label: 'Aadhaar Verified', icon: ShieldCheck },
    { label: '100% Jain Community', icon: Users },
    { label: 'Privacy First Protocol', icon: Lock },
    { label: 'Family Approved', icon: HeartHandshake },
  ];

  return (
    <section className="relative -mt-8 z-30 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Reference 1 Style: Curved Dark Burgundy Banner Pill Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="bg-gradient-to-r from-deepBurgundy via-[#520B22] to-darkBurgundy text-white rounded-[28px] sm:rounded-[36px] p-5 sm:p-7 border-2 border-champagneGold/35 shadow-2xl burgundy-glow relative overflow-hidden"
      >
        {/* Subtle decorative gold shimmer background */}
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-champagneGold/10 to-transparent pointer-events-none" />

        {/* Top Row: Trust Badges (Ref 1 "Trusted by -> Logos") */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/15 pb-6">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-9 h-9 rounded-full bg-champagneGold/20 border border-champagneGold/50 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-champagneGold" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-champagneGold block">
                Trusted by Jain Families Nationwide
              </span>
              <span className="text-[11px] text-white/70">
                Upholding sacred traditions, verified lineages and mutual consent
              </span>
            </div>
          </div>

          {/* Partner Badges Strip */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {trustPartners.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="flex items-center gap-2 text-xs font-medium text-white/90 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-sm"
                >
                  <Icon className="w-3.5 h-3.5 text-champagneGold shrink-0" />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Row: 4 Metric Cards (Ref 1 Stat Pills) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center">
            <div className="font-serif text-2xl sm:text-3xl font-bold text-champagneGold">
              {metrics.profiles.toLocaleString()}+
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-white/75 mt-1">
              Verified Jain Profiles
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center">
            <div className="font-serif text-2xl sm:text-3xl font-bold text-white">
              {metrics.communities}+
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-white/75 mt-1">
              Jain Communities & Sects
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center">
            <div className="font-serif text-2xl sm:text-3xl font-bold text-champagneGold">
              {metrics.privacy}%
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-white/75 mt-1">
              Privacy Control Rate
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center">
            <div className="font-serif text-2xl sm:text-3xl font-bold text-white">
              {metrics.satisfaction}%
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-white/75 mt-1">
              Family Trust Rating
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
