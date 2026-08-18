'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Camera, 
  FileCheck, 
  Award, 
  UserCheck, 
  Lock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function AnimatedTrustMetrics() {
  const [counts, setCounts] = useState({
    profiles: 0,
    verified: 0,
    communities: 0,
    satisfaction: 0,
  });

  useEffect(() => {
    // Smooth counting animation when component mounts / scrolls in
    const duration = 1500;
    const steps = 40;
    const intervalTime = duration / steps;
    let step = 0;

    const targets = {
      profiles: 2500,
      verified: 100,
      communities: 18,
      satisfaction: 98,
    };

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      setCounts({
        profiles: Math.floor(targets.profiles * progress),
        verified: Math.floor(targets.verified * progress),
        communities: Math.floor(targets.communities * progress),
        satisfaction: Math.floor(targets.satisfaction * progress),
      });

      if (step >= steps) clearInterval(timer);
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const verificationStages = [
    { title: '1. Profile Created', desc: 'Secure phone OTP', icon: UserCheck, status: 'Complete' },
    { title: '2. Aadhaar PDF', desc: 'Government ID verification', icon: FileCheck, status: 'Encrypted' },
    { title: '3. Live Selfie', desc: 'Native browser camera', icon: Camera, status: 'Matched' },
    { title: '4. Admin Review', desc: 'Human moderation', icon: ShieldCheck, status: 'Verified' },
  ];

  return (
    <section className="py-20 bg-[#F7EEE7] relative border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Dynamic Animated Statistics Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-6 border border-border shadow-sm text-center"
          >
            <div className="font-serif text-3xl sm:text-4xl font-bold text-deepBurgundy mb-1">
              {counts.profiles.toLocaleString()}+
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">
              Jain Community Profiles
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 border border-border shadow-sm text-center"
          >
            <div className="font-serif text-3xl sm:text-4xl font-bold text-champagneGold mb-1">
              {counts.verified}%
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">
              Identity Verification Capable
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 border border-border shadow-sm text-center"
          >
            <div className="font-serif text-3xl sm:text-4xl font-bold text-deepBurgundy mb-1">
              {counts.communities}+
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">
              Jain Sects & Samvaads
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-6 border border-border shadow-sm text-center"
          >
            <div className="font-serif text-3xl sm:text-4xl font-bold text-success mb-1">
              {counts.satisfaction}%
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">
              Family Trust Rating
            </div>
          </motion.div>
        </div>

        {/* Verification Architecture Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-champagneGold/40 shadow-xl shadow-deepBurgundy/5">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-champagneGold bg-champagneGold/10 px-3 py-1 rounded-full">
              Trust & Authenticity
            </span>
            <h3 className="font-serif text-3xl font-bold text-text mt-3 mb-2">
              Verified. Trusted. <span className="text-deepBurgundy italic font-normal">Genuine.</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted">
              Our multi-tier verification process protects families from fake profiles, spam, and misrepresentation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {verificationStages.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <div
                  key={idx}
                  className="bg-secondary/70 rounded-2xl p-5 border border-border/80 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center">
                      <Icon className="w-5 h-5 text-deepBurgundy" />
                    </div>
                    <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {stage.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-base text-text mb-1">
                      {stage.title}
                    </h4>
                    <p className="text-xs text-muted">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
