'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Landmark, Compass, Heart, CheckCircle2 } from 'lucide-react';

const jainPillars = [
  {
    icon: Layers,
    title: 'Sects & Traditions',
    items: ['Shwetambar Murtipujak', 'Shwetambar Sthanakvasi', 'Terapanthi', 'Digambar Bispanthi', 'Digambar Terapanthi'],
  },
  {
    icon: Landmark,
    title: 'Communities & Samvaad',
    items: ['Oswal', 'Porwal', 'Khandelwal', 'Humad', 'Jaiswal', 'Shrimal', 'Nema', 'Bagherwal'],
  },
  {
    icon: Compass,
    title: 'Lineage & 4-Gotras',
    items: ['Self (Paternal)', 'Mother (Nanihal)', 'Paternal Grandmother (Dadi)', 'Maternal Grandmother (Nani)'],
  },
  {
    icon: Heart,
    title: 'Ahimsa & Lifestyle',
    items: ['Strict Vegetarian Diet', 'Navkar Mantra Values', 'Paryushan & Mahavir Jayanti Sanskaar', 'Rooted Family Traditions'],
  },
];

export default function JainCommunitySection() {
  return (
    <section className="py-24 bg-background relative border-t border-border overflow-hidden">
      {/* Decorative Lotus Silhouette Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-champagneGold/5 to-softRose/20 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-softRose/80 border border-champagneGold/30 text-deepBurgundy text-xs font-bold uppercase tracking-widest mb-4">
              Sacred Heritage
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-text mb-4">
              Built Exclusively for the <br />
              <span className="text-deepBurgundy italic font-normal">Jain Community</span>
            </h2>
            <p className="text-base sm:text-lg text-muted">
              We honor the diverse traditions, sects, and lineage structures of Jain families across India and the global diaspora.
            </p>
          </motion.div>
        </div>

        {/* 4 Cultural Concepts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {jainPillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-7 border border-border hover:border-champagneGold/60 shadow-sm hover:shadow-xl hover:shadow-deepBurgundy/5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-5">
                  <pillar.icon className="w-6 h-6 text-deepBurgundy" />
                </div>

                <h3 className="font-serif font-bold text-xl text-text mb-4">
                  {pillar.title}
                </h3>

                <ul className="space-y-2.5">
                  {pillar.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-muted font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-champagneGold shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 text-[11px] font-semibold text-deepBurgundy">
                Full search & filter support
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
