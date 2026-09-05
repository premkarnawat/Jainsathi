'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, LockKeyhole, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const ovalPillFeatures = [
  {
    icon: Users,
    title: 'Authentic Profiles',
    highlight: '100% Jain',
    desc: 'Exclusively for Shwetambar & Digambar candidates. Zero casual dating clutter.',
    tag: 'Community First',
  },
  {
    icon: ShieldCheck,
    title: 'Identity Verified',
    highlight: 'Aadhaar + Selfie',
    desc: 'Multi-step verification with government ID checks and live camera capture.',
    tag: 'Authenticity Assured',
  },
  {
    icon: LockKeyhole,
    title: 'Privacy Protocol',
    highlight: 'Mutual Consent',
    desc: 'Photos, phone numbers & digital biodatas remain strictly locked until both parties agree.',
    tag: 'Full Discretion',
  },
  {
    icon: Sparkles,
    title: 'Smart Matching',
    highlight: '4-Gotra & Values',
    desc: 'Compatibility algorithms evaluating sect, gotras, ancestral native place & diet.',
    tag: 'Deep Alignment',
  },
];

export default function WhyJainSaathi() {
  return (
    <section id="why-us" className="py-28 bg-[#FFF9F4] relative overflow-hidden border-t border-border">
      {/* Reference 1 Style: Soft Flowing Wave Ribbon in Background */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-44 bg-gradient-to-r from-softRose/40 via-champagneGold/20 to-softRose/30 -skew-y-3 pointer-events-none -z-0 blur-lg" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header (Ref 1 Typography & Centering) */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-softRose/80 border border-champagneGold/30 text-deepBurgundy text-xs font-bold uppercase tracking-widest mb-4">
              Jain Matrimonial Excellence
            </div>
            
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-text mb-4 leading-tight">
              What We <span className="text-deepBurgundy italic font-normal">Provide?</span>
            </h2>
            
            <p className="text-base sm:text-lg text-muted font-sans leading-relaxed">
              A trusted, sacred and privacy-first matrimonial ecosystem designed for meaningful lifelong connections.
            </p>
          </motion.div>
        </div>

        {/* Reference 1 Style: 4 Vertical Oval Pill Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {ovalPillFeatures.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[42px] p-7 border-2 border-champagneGold/30 shadow-xl shadow-deepBurgundy/5 hover:shadow-2xl hover:border-champagneGold transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden group"
              >
                {/* Top Subtle Accent Gradient */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-deepBurgundy via-champagneGold to-deepBurgundy opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Glowing Circular Icon Bubble */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-softRose border border-champagneGold/40 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-champagneGold transition-transform duration-300 shadow-sm">
                  <Icon className="w-9 h-9 text-deepBurgundy" />
                </div>

                {/* Pill Tag */}
                <span className="text-[10px] font-bold uppercase tracking-wider text-deepBurgundy bg-softRose/70 px-3 py-1 rounded-full mb-3">
                  {item.tag}
                </span>

                {/* Card Title & Highlight */}
                <h3 className="font-serif font-bold text-2xl text-text mb-1 group-hover:text-deepBurgundy transition-colors">
                  {item.title}
                </h3>
                
                <span className="text-xs font-semibold text-champagneGold mb-3 block">
                  {item.highlight}
                </span>

                {/* Description */}
                <p className="text-xs text-muted leading-relaxed mb-6">
                  {item.desc}
                </p>

                {/* Bottom Pill Indicator */}
                <div className="mt-auto w-full pt-4 border-t border-border/60 flex items-center justify-center text-xs font-bold text-deepBurgundy group-hover:text-champagneGold transition-colors">
                  <span>Explore Feature</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
