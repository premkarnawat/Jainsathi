'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, Heart, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

const storiesData = [
  {
    couple: 'Rishabh & Ananya',
    community: 'Shwetambar Murtipujak (Oswal)',
    location: 'Mumbai & Ahmedabad',
    quote: 'Our families connected through JainSaathi with complete transparency on 4-gotras and lifestyle. We are grateful for a platform that respects both tradition and modern compatibility.',
    date: 'Married February 2026',
    verified: true,
  },
  {
    couple: 'Siddharth & Priya',
    community: 'Digambar (Khandelwal)',
    location: 'Jaipur & Bangalore',
    quote: 'The photo privacy and mutual acceptance model made us feel comfortable from day one. It was a seamless journey from the first verified interest to wedding bells.',
    date: 'Engaged January 2026',
    verified: true,
  },
  {
    couple: 'Chirag & Megha',
    community: 'Terapanthi (Porwal)',
    location: 'Surat & Pune',
    quote: 'Being able to see 4-gotra lineage and shared vegetarian values right on the digital biodata made family discussions effortless and joyous.',
    date: 'Married December 2025',
    verified: true,
  },
  {
    couple: 'Darshan & Ruchi',
    community: 'Sthanakvasi (Shrimal)',
    location: 'Delhi & Mumbai',
    quote: 'JainSaathi is uniquely respectful. No unsolicited contact numbers or fake profiles. Both our parents were actively involved in reviewing the biodatas.',
    date: 'Married November 2025',
    verified: true,
  },
];

export default function SuccessStoriesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? storiesData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === storiesData.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="success-stories" className="py-28 bg-background relative border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header (Ref 1 Style) */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-softRose/80 border border-champagneGold/30 text-deepBurgundy text-xs font-bold uppercase tracking-widest mb-4">
              Heartfelt Unions
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-text mb-4 leading-tight">
              What Families <span className="text-deepBurgundy italic font-normal">Say</span>
            </h2>

            <p className="text-base sm:text-lg text-muted">
              Real matrimonial unions celebrated across the Jain community with dignity, trust and happiness.
            </p>
          </motion.div>
        </div>

        {/* Stories Cards Grid (Ref 1 Customer Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {storiesData.slice(0, 3).map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-[32px] p-7 sm:p-8 border border-border hover:border-champagneGold/60 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative"
            >
              <div>
                {/* Header: Monogram Avatar + Verified Tag */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-deepBurgundy to-darkBurgundy text-champagneGold font-serif font-bold text-sm flex items-center justify-center shadow-md">
                      {item.couple.split(' ')[0][0]}&{item.couple.split(' ')[2] ? item.couple.split(' ')[2][0] : 'J'}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-text">
                        {item.couple}
                      </h4>
                      <p className="text-[11px] text-muted">
                        {item.location}
                      </p>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 px-2.5 py-1 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-text/90 italic leading-relaxed mb-6 font-serif">
                  "{item.quote}"
                </p>
              </div>

              {/* Bottom Footer */}
              <div className="pt-4 border-t border-border/70 flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-deepBurgundy">
                  {item.community}
                </span>
                <span className="text-[10px] font-medium text-muted">
                  {item.date}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Carousel Slider Controls (Ref 1 Arrows + Dots) */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={handlePrev}
            aria-label="Previous Stories"
            className="w-11 h-11 rounded-full bg-white border border-border shadow-md text-deepBurgundy hover:bg-deepBurgundy hover:text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  dot === 0 ? 'w-8 bg-deepBurgundy' : 'w-2.5 bg-border'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            aria-label="Next Stories"
            className="w-11 h-11 rounded-full bg-white border border-border shadow-md text-deepBurgundy hover:bg-deepBurgundy hover:text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
