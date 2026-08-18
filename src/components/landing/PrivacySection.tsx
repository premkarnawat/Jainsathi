'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, 
  Eye, 
  FileText, 
  Image as ImageIcon, 
  Phone, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const privacyControls = [
  {
    icon: Phone,
    title: 'Phone Number Privacy',
    status: 'Protected',
    description: 'Your mobile number is never displayed publicly. It is securely encrypted and unlocked only after mutual interest acceptance.',
  },
  {
    icon: ImageIcon,
    title: 'Photo Visibility Tiers',
    status: 'Controlled',
    description: 'Choose who can view your photo gallery: All Verified Members, Only Connected Profiles, or Upon Request.',
  },
  {
    icon: FileText,
    title: 'Digital Biodata PDF',
    status: 'Authorization Required',
    description: 'Your family lineage, 4-gotras, and horoscope biodata are shared only with families you explicitly approve.',
  },
  {
    icon: Eye,
    title: 'Ghost & Incognito Mode',
    status: 'Flexible',
    description: 'Pause or hide your profile from search results instantly whenever you take a break or finalize discussions.',
  },
];

export default function PrivacySection() {
  return (
    <section id="safety" className="py-24 bg-background relative border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-softRose/80 border border-champagneGold/30 text-deepBurgundy text-xs font-bold uppercase tracking-widest mb-4">
              Zero Compromise
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-text mb-4">
              Your Privacy <span className="text-deepBurgundy italic font-normal">Comes First</span>
            </h2>
            <p className="text-base sm:text-lg text-muted">
              Sensitive information should remain protected. It only becomes available according to your strict permissions and mutual consent.
            </p>
          </motion.div>
        </div>

        {/* 4 Privacy Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {privacyControls.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-7 border border-border hover:border-champagneGold/50 shadow-sm hover:shadow-xl hover:shadow-deepBurgundy/5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-deepBurgundy" />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-deepBurgundy bg-softRose/60 px-2.5 py-1 rounded-full border border-champagneGold/20">
                    <Lock className="w-3 h-3 text-champagneGold" />
                    <span>{item.status}</span>
                  </div>
                </div>

                <h3 className="font-serif font-bold text-xl text-text mb-2">
                  {item.title}
                </h3>
                
                <p className="text-xs text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-2 text-xs font-semibold text-success">
                <CheckCircle2 className="w-4 h-4" />
                <span>You maintain full control</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
