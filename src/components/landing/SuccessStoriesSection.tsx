'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Heart, Sparkles } from 'lucide-react';

const placeholderStories = [
  {
    couple: 'Rishabh & Ananya',
    community: 'Shwetambar Murtipujak (Oswal)',
    location: 'Mumbai & Ahmedabad',
    quote: 'Our families connected through JainSaathi with complete transparency on gotras and lifestyle. We are grateful for a platform that respects both tradition and modern compatibility.',
    year: 'Married Feb 2026',
  },
  {
    couple: 'Siddharth & Priya',
    community: 'Digambar (Khandelwal)',
    location: 'Jaipur & Bangalore',
    quote: 'The photo privacy and mutual acceptance model made us feel comfortable from day one. It was a seamless journey from interest to wedding bells.',
    year: 'Engaged Jan 2026',
  },
  {
    couple: 'Chirag & Megha',
    community: 'Terapanthi (Porwal)',
    location: 'Surat & Pune',
    quote: 'Being able to see 4-gotra lineage and shared vegetarian values right on the biodata made family discussions effortless and joyful.',
    year: 'Married Dec 2025',
  },
];

export default function SuccessStoriesSection() {
  return (
    <section id="success-stories" className="py-24 bg-background relative border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-softRose/80 border border-champagneGold/30 text-deepBurgundy text-xs font-bold uppercase tracking-widest mb-4">
              Heartfelt Unions
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-text mb-4">
              Real Connections. <br />
              <span className="text-deepBurgundy italic font-normal">Timeless Matrimony.</span>
            </h2>
            <p className="text-base sm:text-lg text-muted">
              Celebrating Jain families who began their lifelong companionship on JainSaathi.
            </p>
          </motion.div>
        </div>

        {/* Stories Horizontal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {placeholderStories.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="bg-white rounded-3xl p-8 border border-border hover:border-champagneGold/50 shadow-sm hover:shadow-xl hover:shadow-deepBurgundy/5 transition-all flex flex-col justify-between relative"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-softRose/50 border border-champagneGold/30 flex items-center justify-center">
                    <Quote className="w-5 h-5 text-deepBurgundy" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-champagneGold bg-champagneGold/10 px-2.5 py-1 rounded-full">
                    {item.year}
                  </span>
                </div>

                <p className="text-sm text-text/90 italic leading-relaxed mb-6 font-serif">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-border/70 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-lg text-deepBurgundy">
                    {item.couple}
                  </h4>
                  <p className="text-xs text-muted font-medium">
                    {item.community}
                  </p>
                  <p className="text-[11px] text-champagneGold font-semibold">
                    {item.location}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-deepBurgundy/10 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-deepBurgundy fill-deepBurgundy" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
