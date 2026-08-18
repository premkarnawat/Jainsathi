'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Sparkles, 
  LockKeyhole, 
  Users, 
  HeartHandshake, 
  ScrollText,
  CheckCircle2
} from 'lucide-react';

const concepts = [
  {
    icon: ShieldCheck,
    title: 'Verified Profiles',
    subtitle: 'Identity & Live Selfie Verified',
    description: 'Every member goes through mandatory mobile OTP, Aadhaar verification, and native camera selfie checks.',
    tag: 'Trust Assured',
  },
  {
    icon: Sparkles,
    title: 'Intelligent Matching',
    subtitle: 'Community & Lifestyle Alignment',
    description: 'Proprietary compatibility algorithm factoring in Jain sects, gotras, native places, diet, and values.',
    tag: 'High Accuracy',
  },
  {
    icon: LockKeyhole,
    title: 'Uncompromised Privacy',
    subtitle: 'You Choose Who Sees What',
    description: 'Contact numbers and digital biodata are locked until you mutually accept interest with another profile.',
    tag: 'Strict Security',
  },
  {
    icon: HeartHandshake,
    title: '100% Jain Community',
    subtitle: 'Exclusively Shwetambar & Digambar',
    description: 'No generic clutter. Connect exclusively with families that share your traditions, festivals, and culture.',
    tag: 'Sacred Values',
  },
  {
    icon: Users,
    title: 'Family Involvement',
    subtitle: 'Individual, Parent & Guardian Accounts',
    description: 'Designed for both modern independent professionals and traditional families navigating the journey together.',
    tag: 'Unified Process',
  },
  {
    icon: ScrollText,
    title: 'Digital Biodata Exchange',
    subtitle: '4-Gotra Lineage Presentation',
    description: 'Clean, printable, and downloadable digital matrimonial biodata generated directly from verified details.',
    tag: 'Modern Lineage',
  },
];

export default function WhyJainSaathi() {
  return (
    <section id="why-us" className="py-24 bg-[#FFFDF9] relative overflow-hidden border-y border-border">
      {/* Decorative Gold & Soft Rose Backdrops */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-softRose/30 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-champagneGold/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-softRose/60 border border-champagneGold/30 text-deepBurgundy text-xs font-bold uppercase tracking-widest mb-4">
              Jain Matrimonial Excellence
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-text mb-4 leading-tight">
              Why <span className="text-deepBurgundy italic font-normal">JainSaathi?</span>
            </h2>
            <p className="text-base sm:text-lg text-muted font-sans leading-relaxed">
              Because finding a life partner deserves trust, deep cultural compatibility, and complete privacy protection.
            </p>
          </motion.div>
        </div>

        {/* Large Interactive Canvas with Concept Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {concepts.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl p-8 border border-border shadow-sm hover:shadow-xl hover:shadow-deepBurgundy/5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Subtle top card accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-champagneGold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-secondary border border-border group-hover:border-champagneGold flex items-center justify-center transition-colors">
                    <item.icon className="w-7 h-7 text-deepBurgundy" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-champagneGold bg-champagneGold/10 px-3 py-1 rounded-full">
                    {item.tag}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-2xl text-text mb-1 group-hover:text-deepBurgundy transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-champagneGold mb-3">
                  {item.subtitle}
                </p>
                <p className="text-sm text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-2 text-xs font-bold text-deepBurgundy">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>Standard across all profiles</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
