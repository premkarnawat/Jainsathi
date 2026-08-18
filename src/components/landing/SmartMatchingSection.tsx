'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Target, Layers, MapPin, GraduationCap, Briefcase } from 'lucide-react';

export default function SmartMatchingSection() {
  return (
    <section className="py-24 bg-secondary overflow-hidden border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl font-bold text-text mb-6 leading-tight">
              Matches That Understand <br />
              <span className="italic text-deepBurgundy font-normal">Your Preferences</span>
            </h2>
            <p className="text-lg text-muted mb-8 leading-relaxed">
              JainSaathi recommendations are intelligently based on the detailed information and strict preferences you provide. We calculate a compatibility score to help you discover highly suitable profiles.
            </p>
            <p className="text-sm text-muted/70 italic mb-8 border-l-2 border-champagneGold pl-4">
              Note: Compatibility is a recommendation score designed to help surface relevant profiles. It is not a guarantee of marital suitability.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Jain Sect & Community', icon: Layers },
                { label: 'Location & Relocation', icon: MapPin },
                { label: 'Education & Career', icon: GraduationCap },
                { label: 'Lifestyle & Diet', icon: Target },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center shadow-sm">
                    <item.icon className="w-4 h-4 text-champagneGold" />
                  </div>
                  <span className="text-sm font-medium text-text">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] flex items-center justify-center"
          >
            {/* Decorative background circle */}
            <div className="absolute w-96 h-96 rounded-full bg-deepBurgundy/5 border border-deepBurgundy/10" />
            
            {/* Compatibility Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl border border-border p-8 w-80 z-10 transform rotate-1">
              <div className="flex justify-between items-center mb-8 border-b border-border pb-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted font-bold mb-1">Compatibility</p>
                  <h3 className="font-serif text-4xl font-bold text-deepBurgundy">92%</h3>
                </div>
                <div className="w-16 h-16 rounded-full bg-secondary border-2 border-champagneGold flex items-center justify-center">
                  <span className="font-serif font-bold text-xl text-text">A+B</span>
                </div>
              </div>
              
              <ul className="space-y-4">
                {[
                  'Age preference matched',
                  'Jain community matched',
                  'Location preference matched',
                  'Education preference matched',
                  'Strict vegetarian diet matched'
                ].map((text, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + (i * 0.1) }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-sm text-text font-medium">{text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
