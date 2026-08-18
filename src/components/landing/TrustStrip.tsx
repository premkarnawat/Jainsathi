'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, LockKeyhole, Users, HeartHandshake, ScrollText } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Verified Profiles',
    description: 'Every profile goes through verification for authenticity.',
  },
  {
    icon: Sparkles,
    title: 'Smart Matching',
    description: 'Recommendations based on community and lifestyle preferences.',
  },
  {
    icon: LockKeyhole,
    title: 'Privacy Protected',
    description: 'Control who sees your photos and contact details.',
  },
  {
    icon: HeartHandshake,
    title: 'Secure Connections',
    description: 'Connect safely through mutual acceptance.',
  },
  {
    icon: ScrollText,
    title: 'Digital Biodata',
    description: 'Securely attach and share your family biodata.',
  },
  {
    icon: Users,
    title: 'Family Friendly',
    description: 'Accounts built for individuals, parents, and guardians.',
  }
];

export default function TrustStrip() {
  return (
    <section className="py-16 bg-white relative z-20 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start gap-4 p-6 rounded-2xl bg-secondary/50 border border-border/50 hover:bg-white hover:shadow-xl hover:shadow-deepBurgundy/5 transition-all duration-300 group"
            >
              <div className="w-12 h-12 shrink-0 rounded-xl bg-background border border-border flex items-center justify-center group-hover:border-champagneGold transition-colors">
                <feature.icon className="w-6 h-6 text-deepBurgundy" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-text mb-1">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
