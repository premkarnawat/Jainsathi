'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, HeartHandshake, ArrowRight, Mouse } from 'lucide-react';
import { LotusBlossom, SingleLotusPetal } from './LotusDecoration';

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-[95vh] pt-24 sm:pt-28 pb-16 flex items-center overflow-hidden bg-[#FAF3ED]">
      
      {/* Background Wedding Couple Image on Right with Seamless Left Gradient Feathering */}
      <div className="absolute top-0 right-0 bottom-0 w-full lg:w-[62%] pointer-events-none z-0">
        <Image
          src="/images/hero-wedding.jpg"
          alt="Jain Wedding Couple in Traditional Attire"
          fill
          priority
          className="object-cover object-[70%_center] lg:object-center opacity-90"
          sizes="(max-width: 1024px) 100vw, 65vw"
        />
        {/* Soft Radial and Linear Gradient Overlays to seamlessly blend into cream on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF3ED] via-[#FAF3ED]/80 to-transparent lg:via-[#FAF3ED]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF3ED] via-transparent to-[#FAF3ED]/40" />
      </div>

      {/* Decorative Golden Script Overlay on Right: "Same Values Brighter Tomorrow" */}
      <div className="hidden lg:block absolute top-28 right-12 z-10 text-right select-none pointer-events-none">
        <p className="font-serif italic text-2xl text-[#8E5E2B]/85 font-medium tracking-wide drop-shadow-sm leading-tight">
          Same <br />
          Values <br />
          Brighter <br />
          Tomorrow
        </p>
      </div>

      {/* Corner Lotus Blossom Accents */}
      <div className="absolute -bottom-6 -left-6 z-20 pointer-events-none">
        <LotusBlossom size={150} rotation={20} opacity={0.95} />
      </div>
      <div className="absolute -bottom-8 left-1/3 z-20 pointer-events-none hidden sm:block">
        <LotusBlossom size={120} rotation={-15} opacity={0.85} />
      </div>
      <div className="absolute -bottom-4 right-12 z-20 pointer-events-none hidden lg:block">
        <LotusBlossom size={140} rotation={10} opacity={0.9} />
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-2xl text-left">
          
          {/* Eyebrow (Exact to image) */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#7A402D] mb-4"
          >
            A Journey of Values, Companionship & a Brighter Tomorrow
          </motion.p>

          {/* Main Headline (Exact to image) */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-text leading-[1.06] tracking-tight mb-5"
          >
            Find Your <br />
            <span className="text-text font-serif">Jain </span>
            <span className="font-serif italic font-normal text-deepBurgundy">
              Saathi
            </span>
          </motion.h1>

          {/* Subtitle (Exact to image) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-2 mb-8 max-w-xl"
          >
            <p className="text-sm sm:text-base font-semibold text-text/90">
              More than a match — a meaningful journey.
            </p>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              A trusted Jain matrimony platform built on Jain values, modern technology, and the belief that the right connections create brighter tomorrows.
            </p>
          </motion.div>

          {/* Dual Action Buttons (Exact to image) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mb-10"
          >
            <Link
              href="/register"
              className="btn-ruby text-xs sm:text-sm px-7 py-3.5 shadow-lg burgundy-glow hover:shadow-xl transition-all"
            >
              <span>Create Your Profile</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="#how-it-works"
              className="btn-gold-outline text-xs sm:text-sm px-7 py-3.5 bg-white/70 backdrop-blur-sm border-[#D6C1B4] text-text hover:bg-white transition-all shadow-sm"
            >
              Find Your Match
            </Link>
          </motion.div>

          {/* Mini 3-Pillar Trust Strip (Exact to image) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center gap-6 sm:gap-8 pt-4 border-t border-[#E8D9CE]/80"
          >
            {/* Item 1 */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#EFE3DA] flex items-center justify-center text-deepBurgundy">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-text">Trusted By</div>
                <div className="text-[10px] text-muted">Jain Families</div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#EFE3DA] flex items-center justify-center text-deepBurgundy">
                <Lock className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-text">Privacy</div>
                <div className="text-[10px] text-muted">First Platform</div>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#EFE3DA] flex items-center justify-center text-deepBurgundy">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-text">Meaningful</div>
                <div className="text-[10px] text-muted">Connections</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom Right: "Scroll to explore" indicator */}
      <div className="hidden md:flex absolute bottom-6 right-8 z-20 items-center gap-2 text-[10px] font-semibold tracking-wider text-text/80 uppercase">
        <span>Scroll to explore</span>
        <div className="w-6 h-9 rounded-full border border-text/60 flex items-center justify-center p-1">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-2 bg-deepBurgundy rounded-full"
          />
        </div>
      </div>

    </section>
  );
}
