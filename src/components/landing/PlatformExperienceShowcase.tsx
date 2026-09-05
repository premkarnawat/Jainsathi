'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Check, Heart, Lock, Smartphone, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PlatformExperienceShowcase() {
  return (
    <section className="py-24 bg-background relative overflow-hidden border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Headline & Benefits (Reference 1 Layout) */}
          <div className="lg:col-span-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-softRose/80 border border-champagneGold/30 text-deepBurgundy text-xs font-bold uppercase tracking-widest mb-4">
                Seamless Experience
              </div>

              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-text mb-6 leading-tight">
                Discover Your Partner <br />
                <span className="text-deepBurgundy italic font-normal">Through Modern Design</span>
              </h2>

              <p className="text-base sm:text-lg text-muted mb-8 leading-relaxed">
                Whether you are a busy professional reviewing candidate profiles between meetings or a family reviewing 4-gotras together at home, JainSaathi delivers an effortless, dignified experience.
              </p>

              {/* Feature Checklist */}
              <div className="space-y-3.5 mb-10 text-left max-w-lg mx-auto lg:mx-0">
                {[
                  'Instant verified candidate alerts matching your exact sect & criteria',
                  'Discreet mutual acceptance notifications before contact reveal',
                  '4-Gotra paternal and maternal lineage details instantly readable',
                  'Bank-grade encrypted private photo vault with custom permissions'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-text font-medium">
                    <div className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-success" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Action Pill Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="btn-ruby w-full sm:w-auto text-base px-8 py-3.5 shadow-lg burgundy-glow"
                >
                  <Sparkles className="w-4 h-4 text-champagneGold" />
                  Explore Platform
                </Link>

                <Link
                  href="#how-it-works"
                  className="btn-gold-outline w-full sm:w-auto text-base px-7 py-3.5 bg-white/70"
                >
                  How It Works
                  <ArrowRight className="w-4 h-4 text-deepBurgundy" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Reference 1 Floating Phone Mockup */}
          <div className="lg:col-span-6 flex justify-center relative">
            
            {/* Background Circular Aura & Color Wave */}
            <div className="absolute w-[360px] h-[360px] rounded-full bg-gradient-to-tr from-champagneGold/20 via-softRose/40 to-transparent blur-2xl pointer-events-none -z-0" />

            {/* Mobile Device Frame Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, rotate: 1 }}
              className="relative w-[300px] sm:w-[330px] rounded-[48px] p-4 bg-gradient-to-b from-[#2B2024] to-[#160E12] border-4 border-[#3D3035] shadow-2xl shadow-deepBurgundy/25 z-10"
            >
              {/* Phone Speaker Notch */}
              <div className="w-24 h-4 bg-[#160E12] rounded-full mx-auto mb-3" />

              {/* Phone Screen Canvas */}
              <div className="bg-[#FFFDF9] rounded-[36px] p-4 border border-border overflow-hidden space-y-4">
                
                {/* Mini Top Bar */}
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-deepBurgundy text-champagneGold text-xs font-serif font-bold flex items-center justify-center">
                      JS
                    </div>
                    <span className="font-serif font-bold text-xs text-deepBurgundy">JainSaathi</span>
                  </div>
                  <span className="text-[9px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                </div>

                {/* Candidate Mini Card */}
                <div className="bg-secondary rounded-2xl p-3.5 border border-border/80 text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-text">Pooja Shah, 26</h4>
                      <p className="text-[10px] text-muted">Architect • Ahmedabad (Native: Surat)</p>
                    </div>
                    <span className="bg-deepBurgundy text-champagneGold font-bold text-[10px] px-2.5 py-1 rounded-full">
                      94% Match
                    </span>
                  </div>

                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between text-muted">
                      <span>Sect:</span>
                      <span className="font-semibold text-text">Shwetambar Murtipujak</span>
                    </div>
                    <div className="flex justify-between text-muted">
                      <span>4-Gotra:</span>
                      <span className="font-semibold text-text">Shah • Mehta</span>
                    </div>
                    <div className="flex justify-between text-muted">
                      <span>Diet:</span>
                      <span className="font-semibold text-success">Strict Vegetarian</span>
                    </div>
                  </div>

                  {/* Photo Lock Badge */}
                  <div className="flex items-center gap-1.5 text-[9px] font-semibold text-deepBurgundy bg-softRose/60 p-2 rounded-xl border border-champagneGold/20">
                    <Lock className="w-3 h-3 text-champagneGold shrink-0" />
                    <span>Photos & direct contact protected until mutual acceptance</span>
                  </div>

                  <button className="btn-ruby w-full py-2 text-xs font-bold shadow-sm">
                    <Heart className="w-3.5 h-3.5 fill-champagneGold text-champagneGold" />
                    Express Matrimonial Interest
                  </button>
                </div>

                {/* Bottom Bar Simulation */}
                <div className="flex justify-around text-muted pt-2 text-[10px] font-bold">
                  <span className="text-deepBurgundy">Explore</span>
                  <span>Interests</span>
                  <span>Biodata</span>
                  <span>Profile</span>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
