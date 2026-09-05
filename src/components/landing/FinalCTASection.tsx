'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, HeartHandshake, Shield, ArrowRight } from 'lucide-react';
import { LotusBlossom } from './LotusDecoration';

export default function FinalCTASection() {
  return (
    <section id="final-cta" className="py-24 sm:py-28 bg-[#FAF3ED] relative overflow-hidden border-t border-[#EADBCE]/70">
      
      {/* Decorative Lotus Accents (Exact to image) */}
      <div className="absolute -bottom-8 -left-8 z-10 pointer-events-none">
        <LotusBlossom size={140} rotation={25} opacity={0.9} />
      </div>
      <div className="absolute -bottom-6 -right-6 z-10 pointer-events-none">
        <LotusBlossom size={140} rotation={-25} opacity={0.9} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left/Center Column: Heading, Subtitle, Dual Buttons */}
          <div className="lg:col-span-8 text-center lg:text-left">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text leading-tight mb-4"
            >
              Your Jain Saathi Could Be <br />
              <span className="text-deepBurgundy">Closer Than You Think.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs sm:text-sm text-muted mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Create a verified profile and begin your journey towards a meaningful Jain connection.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <Link
                href="/register"
                className="btn-ruby text-xs sm:text-sm px-7 py-3.5 shadow-lg burgundy-glow hover:shadow-xl transition-all inline-flex items-center gap-2"
              >
                <span>Create Your Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="#how-it-works"
                className="btn-gold-outline text-xs sm:text-sm px-7 py-3.5 bg-white/70 backdrop-blur-sm border-[#D6C1B4] text-text hover:bg-white transition-all shadow-sm"
              >
                Learn More
              </Link>
            </motion.div>
          </div>

          {/* Right Column: 4 Trust Badges Vertically Stacked (Exact to image) */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-3.5 text-left"
            >
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-text">
                <div className="w-8 h-8 rounded-full bg-[#EADBCE] text-deepBurgundy flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>Trusted</span>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-text">
                <div className="w-8 h-8 rounded-full bg-[#EADBCE] text-deepBurgundy flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <span>Safe</span>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-text">
                <div className="w-8 h-8 rounded-full bg-[#EADBCE] text-deepBurgundy flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <span>Private</span>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-text">
                <div className="w-8 h-8 rounded-full bg-[#EADBCE] text-deepBurgundy flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <span>Family-Friendly</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
