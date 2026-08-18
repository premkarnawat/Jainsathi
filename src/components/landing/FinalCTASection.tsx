'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, Heart } from 'lucide-react';
import FloatingPetals from './FloatingPetals';

export default function FinalCTASection() {
  return (
    <section className="relative py-32 bg-gradient-to-b from-[#FFFDF9] via-[#F7E8E8] to-[#FFFDF9] border-t border-border overflow-hidden text-center">
      {/* Floating Petals Motion */}
      <FloatingPetals />

      {/* Decorative Golden Ring / Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-champagneGold/20 via-softRose to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* Logo Badge */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-deepBurgundy to-[#4E0D25] border-2 border-champagneGold flex items-center justify-center mb-8 shadow-xl shadow-deepBurgundy/20">
            <span className="text-champagneGold font-serif italic text-2xl font-bold">JS</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-text mb-6 leading-tight">
            Your Jain Saathi May Be <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-deepBurgundy via-premiumBurgundy to-champagneGold italic font-normal">
              Closer Than You Think.
            </span>
          </h2>

          <p className="text-base sm:text-lg lg:text-xl text-muted max-w-2xl mb-10 leading-relaxed">
            Create your profile, set your cultural and lifestyle preferences, and begin your journey toward a sacred and meaningful Jain matrimonial connection.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/register"
              className="btn-ruby w-full sm:w-auto text-base sm:text-lg px-9 py-4 shadow-xl shadow-deepBurgundy/25 hover:shadow-2xl transition-all"
            >
              <Sparkles className="w-5 h-5 text-champagneGold" />
              Create Your Profile
            </Link>

            <Link
              href="#how-it-works"
              className="btn-gold-outline w-full sm:w-auto text-base sm:text-lg px-8 py-4 bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm transition-all"
            >
              Explore How It Works
              <ChevronRight className="w-4 h-4 text-deepBurgundy" />
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-2 text-xs font-semibold text-deepBurgundy">
            <Heart className="w-3.5 h-3.5 fill-deepBurgundy" />
            <span>Built with devotion for the global Jain community</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
