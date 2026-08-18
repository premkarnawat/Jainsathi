'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Sparkles, UserCheck } from 'lucide-react';

const trustPillars = [
  {
    icon: ShieldCheck,
    title: 'Identity Verification',
    description: 'Profiles can complete multi-step verification (Phone OTP, Aadhaar document check, live selfie) before meaningful connections begin.',
    badge: 'Step 1: Authenticity',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Your sensitive personal data, contact number, and digital biodata remain strictly locked until you explicitly choose to share them.',
    badge: 'Step 2: Protection',
  },
  {
    icon: Sparkles,
    title: 'Smart Matching',
    description: 'Comprehensive partner preferences help surface deeply compatible Jain profiles based on mutual values, lineage, and expectations.',
    badge: 'Step 3: Compatibility',
  },
  {
    icon: UserCheck,
    title: 'Mutual Connection',
    description: 'Direct contact numbers are revealed only after both parties have sent and accepted interest, preventing spam and misuse.',
    badge: 'Step 4: Mutual Consent',
  },
];

export default function TrustSystem() {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-border hover:border-champagneGold/50 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-deepBurgundy bg-softRose/50 px-2.5 py-1 rounded-md mb-4">
                  {pillar.badge}
                </span>
                
                <div className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-4">
                  <pillar.icon className="w-6 h-6 text-deepBurgundy" />
                </div>

                <h3 className="font-serif font-bold text-xl text-text mb-2">
                  {pillar.title}
                </h3>

                <p className="text-xs text-muted leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
