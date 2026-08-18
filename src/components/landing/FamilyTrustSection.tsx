'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Users, HeartHandshake, CheckCircle2 } from 'lucide-react';

const familyProfiles = [
  {
    icon: User,
    type: 'Self Managed',
    title: 'For Candidates',
    subtitle: 'Personal & Direct Control',
    desc: 'Independent Jain professionals managing their own profiles, setting individual preferences, and connecting directly.',
    benefits: ['Direct conversation flow', 'Private photo controls', 'Custom lifestyle filters'],
  },
  {
    icon: Users,
    type: 'Parent Managed',
    title: 'For Parents',
    subtitle: 'Family First Inquiries',
    desc: 'Parents seeking suitable matrimonial proposals for their son or daughter with focus on lineage, culture, and values.',
    benefits: ['4-Gotra lineage verification', 'Family background focus', 'Direct parent-to-parent dialogue'],
  },
  {
    icon: HeartHandshake,
    type: 'Guardian Managed',
    title: 'For Guardians & Siblings',
    subtitle: 'Supportive Family Network',
    desc: 'Elder siblings, uncles, or guardians managing or co-managing profiles to assist the candidate throughout the process.',
    benefits: ['Collaborative profile management', 'Shared match notifications', 'Verified guardian credentials'],
  },
];

export default function FamilyTrustSection() {
  return (
    <section className="py-24 bg-[#FFFDF9] relative border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-champagneGold/15 border border-champagneGold/40 text-deepBurgundy text-xs font-bold uppercase tracking-widest mb-4">
              Multi-Role Support
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-text mb-4">
              Designed for Individuals. <br />
              <span className="text-deepBurgundy italic font-normal">Trusted by Families.</span>
            </h2>
            <p className="text-base sm:text-lg text-muted">
              Jain marriages are a harmonious union of two families. Whether you are creating a profile for yourself or your child, JainSaathi adapts to your needs.
            </p>
          </motion.div>
        </div>

        {/* 3 Family Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {familyProfiles.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl p-8 border border-border hover:border-champagneGold/60 shadow-sm hover:shadow-xl hover:shadow-deepBurgundy/5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center">
                    <item.icon className="w-7 h-7 text-deepBurgundy" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-champagneGold bg-champagneGold/10 px-3 py-1 rounded-full">
                    {item.type}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-2xl text-text mb-1">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-deepBurgundy mb-4">
                  {item.subtitle}
                </p>
                <p className="text-sm text-muted leading-relaxed mb-6">
                  {item.desc}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-border/60">
                  {item.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-text font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
