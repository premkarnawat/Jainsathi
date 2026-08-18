'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Sparkles, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Heart, 
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function MatchingEngineSection() {
  const matchCriteria = [
    { title: 'Age & Horoscope', value: '28 Yrs • Compatible', matched: true },
    { title: 'Jain Community & Sect', value: 'Shwetambar Murtipujak (Oswal)', matched: true },
    { title: 'Native Place & Location', value: 'Mumbai (Native: Jalore, RJ)', matched: true },
    { title: 'Education & Profession', value: 'B.Tech + MBA • Tech Lead', matched: true },
    { title: 'Diet & Lifestyle', value: 'Strict Vegetarian • Non-Smoker', matched: true },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Descriptive Story */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-softRose/80 border border-champagneGold/30 text-deepBurgundy text-xs font-bold uppercase tracking-widest mb-4">
                Intelligent Discovery
              </div>
              
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-text mb-6 leading-tight">
                Meet Profiles That Match <br />
                <span className="text-deepBurgundy italic font-normal">What Matters Most</span>
              </h2>

              <p className="text-base sm:text-lg text-muted mb-6 leading-relaxed">
                Jain marriages unite values, lineage, and mutual life vision. Our matching engine evaluates your strict partner criteria to surface high-compatibility candidates without clutter.
              </p>

              <div className="space-y-3.5 mb-8">
                {[
                  'Custom scoring across 12+ cultural and lifestyle parameters',
                  'Clear breakdown explaining why every profile was recommended',
                  'Lineage & 4-Gotra compatibility filtering',
                  'Preference Compatibility indicator (never an absolute guarantee)'
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-text font-medium">
                    <div className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-success" />
                    </div>
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-white/70 border border-champagneGold/30 text-xs text-muted italic">
                Note: Compatibility percentage represents preference alignment based on member-submitted data.
              </div>
            </motion.div>
          </div>

          {/* Right Column: Realistic UI Mockup Card (Aarav Jain) */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border-2 border-champagneGold/40 shadow-2xl shadow-deepBurgundy/10 relative"
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-border pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-deepBurgundy text-champagneGold font-serif font-bold text-xl flex items-center justify-center shadow-md">
                    AJ
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-lg text-text">Aarav Jain</h4>
                      <ShieldCheck className="w-4 h-4 text-success" />
                    </div>
                    <p className="text-xs text-muted">28 Yrs • 5'11" • Mumbai</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1 bg-gradient-to-r from-deepBurgundy to-[#5C0D28] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-champagneGold" />
                    <span>92% Match</span>
                  </div>
                </div>
              </div>

              {/* Match Criteria Checklist */}
              <div className="space-y-3 mb-6">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
                  Why this is a strong match:
                </div>

                {matchCriteria.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/80 border border-border/70 text-xs"
                  >
                    <span className="font-semibold text-text">{item.title}</span>
                    <div className="flex items-center gap-1.5 text-deepBurgundy font-bold">
                      <span>{item.value}</span>
                      <Check className="w-3.5 h-3.5 text-success" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons Mockup */}
              <div className="flex gap-3 pt-2">
                <button className="flex-1 btn-ruby py-2.5 text-xs">
                  <Heart className="w-4 h-4 text-champagneGold fill-champagneGold" />
                  Express Interest
                </button>
                <button className="btn-gold-outline py-2.5 px-4 text-xs">
                  View Biodata
                </button>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
