'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, Heart } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden">
      {/* Background Image with Parallax & Opacity */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full h-full relative"
        >
          <Image
            src="/images/hero-wedding.jpg"
            alt="JainSaathi Wedding"
            fill
            className="object-cover object-top opacity-[0.25] mix-blend-multiply"
            priority
            sizes="100vw"
          />
        </motion.div>
        
        {/* Gradients for readability and premium feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7EFE8]/80 via-[#F7EFE8]/60 to-[#F7EFE8]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F7EFE8] via-transparent to-[#F7EFE8]/80" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-champagneGold/30 mb-8">
              <ShieldCheck className="w-4 h-4 text-deepBurgundy" />
              <span className="text-xs font-semibold uppercase tracking-widest text-deepBurgundy">
                Built for the Jain community • Privacy-first • Verified profiles
              </span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-text mb-6 leading-[1.1]">
              Find Your <span className="text-deepBurgundy italic font-normal">Jain Saathi</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted max-w-lg mb-10 leading-relaxed font-sans">
              A trusted Jain matrimonial platform for meaningful relationships, family involvement and privacy.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link href="/register" className="btn-ruby w-full sm:w-auto text-lg px-8 py-4">
                Create Profile
              </Link>
              <Link href="/login" className="btn-gold-outline w-full sm:w-auto text-lg px-8 py-4 bg-white/50 backdrop-blur-sm">
                Login
              </Link>
            </div>
          </motion.div>

          {/* Right Floating Elements (Trust Card & Compatibility Card) */}
          <div className="relative h-[400px] lg:h-[500px] hidden md:block">
            
            {/* Trust Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="absolute top-10 left-10 lg:left-0 z-20"
            >
              <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-6 w-72 transform hover:-translate-y-2 transition-transform duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-deepBurgundy/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-deepBurgundy" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-text leading-tight">JainSaathi</h3>
                    <p className="text-xs text-muted uppercase tracking-wider">Verified Profiles</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-text font-medium">
                    <CheckCircle2 className="w-4 h-4 text-success" /> Identity Verification
                  </li>
                  <li className="flex items-center gap-2 text-sm text-text font-medium">
                    <CheckCircle2 className="w-4 h-4 text-success" /> Jain Details Verified
                  </li>
                  <li className="flex items-center gap-2 text-sm text-text font-medium">
                    <CheckCircle2 className="w-4 h-4 text-success" /> Privacy Protected
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Profile Match Illustrative Visual */}
            <motion.div 
              initial={{ opacity: 0, x: -30, y: 50 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
              className="absolute bottom-10 right-10 lg:right-0 z-30"
            >
              <div className="bg-deepBurgundy text-white shadow-2xl rounded-2xl p-6 w-64 transform hover:-translate-y-2 transition-transform duration-500 border border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex -space-x-3">
                    <div className="w-12 h-12 rounded-full border-2 border-deepBurgundy bg-champagneGold flex items-center justify-center shadow-lg z-10">
                      <span className="text-deepBurgundy font-serif font-bold">A</span>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-deepBurgundy bg-[#FFF9F4] flex items-center justify-center shadow-lg">
                      <span className="text-deepBurgundy font-serif font-bold">B</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-sm font-bold shadow-inner">
                    92%
                  </div>
                </div>
                <div className="flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-champagneGold fill-champagneGold animate-pulse" />
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between text-xs text-white/80">
                    <span>Community</span>
                    <CheckCircle2 className="w-3 h-3 text-champagneGold" />
                  </li>
                  <li className="flex items-center justify-between text-xs text-white/80">
                    <span>Education</span>
                    <CheckCircle2 className="w-3 h-3 text-champagneGold" />
                  </li>
                  <li className="flex items-center justify-between text-xs text-white/80">
                    <span>Lifestyle</span>
                    <CheckCircle2 className="w-3 h-3 text-champagneGold" />
                  </li>
                </ul>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
