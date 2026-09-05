'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Home, Heart, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { LotusBlossom } from './LotusDecoration';

const whyCards = [
  {
    icon: Users,
    title: 'Verified Profiles',
    desc: 'Authentic & genuine members',
  },
  {
    icon: Home,
    title: 'Jain Community',
    desc: 'Built for Jain families',
  },
  {
    icon: Heart,
    title: 'Smart Matching',
    desc: 'Find compatible profiles faster',
  },
  {
    icon: Shield,
    title: 'Privacy Controls',
    desc: 'You decide what to share',
  },
];

export default function WhyJainSaathi() {
  return (
    <section id="why-us" className="py-20 sm:py-24 bg-[#FAF3ED] relative overflow-hidden border-t border-[#EADBCE]/70">
      
      {/* Decorative Lotus Accents on Edges (Exact to image) */}
      <div className="absolute -top-10 -left-10 z-10 pointer-events-none">
        <LotusBlossom size={130} rotation={45} opacity={0.9} />
      </div>
      <div className="absolute -bottom-10 -right-8 z-10 pointer-events-none">
        <LotusBlossom size={130} rotation={-35} opacity={0.85} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Title, Subtitle, Know More Button */}
          <div className="lg:col-span-4 text-left">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-serif text-4xl sm:text-5xl font-bold text-text mb-4 leading-tight"
            >
              Why JainSaathi?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs sm:text-sm text-muted mb-6 leading-relaxed max-w-sm"
            >
              Because finding a life partner deserves trust, compatibility and privacy.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                href="#how-it-works"
                className="btn-ruby text-xs px-6 py-3 shadow-md burgundy-glow hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                <span>Know More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </div>

          {/* Right Column: 4 Clean White Cards in a Row */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {whyCards.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E7D6CA]/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group"
                  >
                    {/* Circle Icon Badge */}
                    <div className="w-13 h-13 rounded-full bg-[#FAF3ED] border border-[#E4D1C3] flex items-center justify-center mb-4 text-[#8A243D] group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 text-[#8A243D]" />
                    </div>

                    {/* Title */}
                    <h3 className="font-serif font-bold text-sm sm:text-base text-text mb-1 group-hover:text-deepBurgundy transition-colors">
                      {item.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-[11px] text-muted leading-normal">
                      {item.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
