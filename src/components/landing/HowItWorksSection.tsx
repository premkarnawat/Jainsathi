'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  FileText, 
  Sliders, 
  Search, 
  Heart, 
  HeartHandshake, 
  ArrowRight, 
  Check, 
  ShieldCheck 
} from 'lucide-react';
import Link from 'next/link';
import { LotusBlossom } from './LotusDecoration';

const steps = [
  { num: '01', icon: UserPlus, title: 'Create', subtitle: 'Your Profile' },
  { num: '02', icon: FileText, title: 'Complete', subtitle: 'Your Details' },
  { num: '03', icon: Sliders, title: 'Set Partner', subtitle: 'Preferences' },
  { num: '04', icon: Search, title: 'Discover', subtitle: 'Matches' },
  { num: '05', icon: Heart, title: 'Express', subtitle: 'Interest' },
  { num: '06', icon: HeartHandshake, title: 'Connect', subtitle: 'After Acceptance' },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-[#FAF3ED] relative overflow-hidden border-t border-[#EADBCE]/70">
      
      {/* Decorative Lotus Accents */}
      <div className="absolute top-12 -left-8 z-10 pointer-events-none">
        <LotusBlossom size={120} rotation={25} opacity={0.85} />
      </div>
      <div className="absolute bottom-12 -right-8 z-10 pointer-events-none">
        <LotusBlossom size={130} rotation={-25} opacity={0.85} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="relative mb-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#7A402D] mb-2"
          >
            Simple Steps to a Meaningful Connection
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-4xl sm:text-5xl font-bold text-text mb-3 leading-tight"
          >
            How JainSaathi Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xs sm:text-sm text-muted max-w-xl mx-auto"
          >
            A structured and respectful process designed for your journey.
          </motion.p>

          {/* Top Right "View Details ->" */}
          <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2">
            <Link
              href="#safety"
              className="text-xs font-bold text-deepBurgundy hover:text-darkBurgundy inline-flex items-center gap-1 group"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* 6-Step Connected Pipeline (Exact to image) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-20">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E7D6CA]/90 shadow-sm flex flex-col items-center text-center relative group"
              >
                {/* Step Number Circle Badge at Top */}
                <div className="w-8 h-8 rounded-full bg-[#FAF3ED] border border-[#D8C0B2] text-[11px] font-bold text-deepBurgundy flex items-center justify-center mb-3">
                  {step.num}
                </div>

                {/* Step Icon */}
                <div className="w-9 h-9 rounded-full bg-[#FAF3ED] flex items-center justify-center text-[#8A243D] mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>

                {/* Step Titles */}
                <div className="font-serif font-bold text-xs sm:text-sm text-text leading-tight mb-0.5">
                  {step.title}
                </div>
                <div className="text-[10px] text-muted font-medium">
                  {step.subtitle}
                </div>

                {/* Connecting arrow for larger screens */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 text-[#CBB3A6] z-10">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Split: Two Mobile Phones Mockup (Left) + Smart Matching Text (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Overlapping Mobile Phones + Handwritten Script Text */}
          <div className="lg:col-span-6 relative flex justify-center py-6">
            
            {/* Left Script Overlay: "Meaningful Matches Real People" */}
            <div className="hidden sm:block absolute -left-4 top-1/3 -translate-y-1/2 z-20 pointer-events-none select-none">
              <p className="font-serif italic text-2xl sm:text-3xl text-[#9A6242] drop-shadow-sm rotate-[-8deg] leading-tight">
                Meaningful Matches <br />
                Real People
              </p>
            </div>

            <div className="relative flex items-center justify-center w-full max-w-md">
              
              {/* Phone 1 (Left - Candidate Profile Mockup) */}
              <motion.div
                initial={{ opacity: 0, x: -25, rotate: -4 }}
                whileInView={{ opacity: 1, x: 0, rotate: -4 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                whileHover={{ rotate: 0, zIndex: 30 }}
                className="relative w-[210px] sm:w-[230px] rounded-[36px] p-2.5 bg-[#1C1518] border-2 border-[#382C32] shadow-2xl z-20 transition-all duration-300"
              >
                <div className="w-16 h-3 bg-[#1C1518] rounded-full mx-auto mb-2" />
                <div className="bg-[#FFFDFB] rounded-[28px] p-3 text-left space-y-2.5 overflow-hidden">
                  
                  {/* Candidate Avatar Mock */}
                  <div className="relative w-full h-32 rounded-2xl overflow-hidden bg-[#EEDCCE] border border-border">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <div className="absolute bottom-2 left-2 z-20 text-white">
                      <div className="font-serif font-bold text-xs">Priya Jain, 26</div>
                      <div className="text-[9px] text-white/80">Doctor • Ahmedabad</div>
                    </div>
                    <div className="absolute top-2 right-2 z-20 bg-deepBurgundy text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                      <Heart className="w-3 h-3 fill-white" />
                    </div>
                  </div>

                  {/* Compatibility Pill */}
                  <div className="bg-[#FAF3ED] p-2 rounded-xl border border-[#EADBCE] text-[9.5px] space-y-1">
                    <div className="flex justify-between font-bold text-deepBurgundy">
                      <span>Compatibility</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-[#E8D9CE] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-deepBurgundy h-full w-[92%]" />
                    </div>
                  </div>

                  <div className="text-[9px] text-muted space-y-0.5 pt-1">
                    <div><span className="font-semibold text-text">Sect:</span> Shwetambar</div>
                    <div><span className="font-semibold text-text">Gotra:</span> Shah • Mehta</div>
                  </div>

                  <button className="btn-ruby w-full py-1.5 text-[10px] font-bold">
                    Connect Now
                  </button>
                </div>
              </motion.div>

              {/* Phone 2 (Right - Partner Preferences Mockup) */}
              <motion.div
                initial={{ opacity: 0, x: 25, rotate: 4 }}
                whileInView={{ opacity: 1, x: 0, rotate: 4 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                whileHover={{ rotate: 0, zIndex: 30 }}
                className="relative -ml-12 sm:-ml-14 w-[210px] sm:w-[230px] rounded-[36px] p-2.5 bg-[#1C1518] border-2 border-[#382C32] shadow-2xl z-10 transition-all duration-300"
              >
                <div className="w-16 h-3 bg-[#1C1518] rounded-full mx-auto mb-2" />
                <div className="bg-[#FFFDFB] rounded-[28px] p-3 text-left space-y-2 overflow-hidden text-[9px]">
                  <div className="font-serif font-bold text-xs text-deepBurgundy pb-1 border-b border-border">
                    Partner Preferences
                  </div>

                  <div className="space-y-1 text-muted">
                    <div className="flex justify-between">
                      <span>Age Range:</span>
                      <span className="font-bold text-text">25 - 30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-bold text-text">Mumbai</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Jain Community:</span>
                      <span className="font-bold text-text">Shwetambar</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Education:</span>
                      <span className="font-bold text-text">Any</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Profession:</span>
                      <span className="font-bold text-text">Any</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lifestyle:</span>
                      <span className="font-bold text-text">Modern & Traditional</span>
                    </div>
                  </div>

                  <button className="btn-ruby w-full py-1.5 text-[10px] font-bold mt-2 shadow-sm">
                    Find Matches
                  </button>
                </div>
              </motion.div>

            </div>
          </div>

          {/* Right Side: Smart Matching Copy & Checklist */}
          <div className="lg:col-span-6 text-left relative">
            
            {/* Right Script Overlay: "More Than Profiles A Better Tomorrow" */}
            <div className="hidden sm:block absolute -right-6 -bottom-10 z-20 pointer-events-none select-none">
              <p className="font-serif italic text-2xl sm:text-3xl text-[#9A6242] drop-shadow-sm rotate-[6deg] leading-tight">
                More Than Profiles <br />
                A Better Tomorrow
              </p>
            </div>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-serif text-3xl sm:text-4xl font-bold text-text mb-4 leading-tight"
            >
              Smart Matching <br />
              <span className="text-deepBurgundy">for Meaningful Relationships</span>
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs sm:text-sm text-muted mb-6 leading-relaxed max-w-lg"
            >
              Our matching system helps you discover profiles that align with your values, preferences and lifestyle.
            </motion.p>

            {/* Checklist (Exact to image) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-3 mb-8"
            >
              {[
                'Community preference',
                'Lifestyle compatibility',
                'Education & career preferences',
                'Location & family values',
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-text">
                  <div className="w-4 h-4 rounded-full bg-[#EADBCE] text-deepBurgundy flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>

            {/* Explore Matches Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                href="/register"
                className="btn-ruby text-xs sm:text-sm px-7 py-3.5 shadow-lg burgundy-glow inline-flex items-center gap-2"
              >
                <span>Explore Matches</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
