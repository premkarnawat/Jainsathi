'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Image as PhotoIcon, PhoneCall, ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { LotusBlossom } from './LotusDecoration';

const privacyCards = [
  {
    icon: PhotoIcon,
    title: 'Photo Privacy',
    desc: 'Control who can see your photos',
  },
  {
    icon: PhoneCall,
    title: 'Contact Protection',
    desc: 'Revealed only after authorization',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Identity',
    desc: 'Aadhaar & Selfie verification',
  },
  {
    icon: Lock,
    title: 'Secure Platform',
    desc: 'Your data stays safe',
  },
];

export default function PrivacySection() {
  return (
    <section id="safety" className="py-20 sm:py-24 bg-[#FAF3ED] relative overflow-hidden border-t border-[#EADBCE]/70">
      
      {/* Decorative Lotus Blossom on left */}
      <div className="absolute -bottom-8 -left-8 z-10 pointer-events-none">
        <LotusBlossom size={130} rotation={20} opacity={0.85} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Heading, Subtitle, CTA Button */}
          <div className="lg:col-span-4 text-left">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-4 leading-tight"
            >
              Your Privacy <br />
              <span className="text-deepBurgundy">Comes First</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs sm:text-sm text-muted mb-6 leading-relaxed max-w-sm"
            >
              Your personal information remains protected and is shared only as per your preferences and platform rules.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                href="/register"
                className="btn-ruby text-xs px-6 py-3 shadow-md burgundy-glow hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                <span>Learn About Safety</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </div>

          {/* Right Column: 4 White Cards + 3D Golden Metallic Shield */}
          <div className="lg:col-span-8 flex flex-col md:flex-row items-center gap-4">
            
            {/* 4 Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 w-full">
              {privacyCards.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E7D6CA]/80 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#FAF3ED] border border-[#E4D1C3] flex items-center justify-center mb-3 text-[#8A243D] group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-[#8A243D]" />
                    </div>

                    <h3 className="font-serif font-bold text-xs sm:text-sm text-text mb-1 group-hover:text-deepBurgundy transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-[10px] text-muted leading-tight">
                      {item.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* 3D Metallic Golden Shield with Lock Emblem (Exact to image) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl bg-gradient-to-b from-[#E8D4C0] via-[#D8BC9E] to-[#BFA080] border-2 border-white p-1.5 shadow-xl flex items-center justify-center shrink-0"
            >
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#FAF3ED] to-[#E5CFBD] border border-[#C5A586] flex flex-col items-center justify-center shadow-inner">
                <div className="w-10 h-10 rounded-full bg-deepBurgundy text-champagneGold flex items-center justify-center shadow-md">
                  <Lock className="w-5 h-5" />
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
