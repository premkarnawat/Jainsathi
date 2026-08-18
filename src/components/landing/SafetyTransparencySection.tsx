'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  UserX, 
  FileCheck, 
  Lock, 
  CheckCircle2
} from 'lucide-react';

const safetyPoints = [
  {
    icon: FileCheck,
    title: 'Multi-Tier Identity Check',
    desc: 'Government ID verification combined with native WebRTC live front camera selfie matching prevents fraudulent profiles.',
  },
  {
    icon: Lock,
    title: 'Bank-Grade Data Encryption',
    desc: 'All sensitive biodata PDFs, contact numbers, and private photos are encrypted both in transit and at rest.',
  },
  {
    icon: UserX,
    title: 'Instant Block & Report',
    desc: 'One-click reporting tool allows members to immediately flag or block any individual with zero tolerance policies.',
  },
  {
    icon: ShieldAlert,
    title: 'Active Community Moderation',
    desc: 'Manual administrator review of newly submitted profiles ensures authentic matrimonial intent.',
  },
];

export default function SafetyTransparencySection() {
  return (
    <section className="py-24 bg-background relative border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-softRose/80 border border-champagneGold/30 text-deepBurgundy text-xs font-bold uppercase tracking-widest mb-4">
              Community Safeguards
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-text mb-4">
              Trust. Transparency. <br />
              <span className="text-deepBurgundy italic font-normal">Uncompromised Safety.</span>
            </h2>
            <p className="text-base sm:text-lg text-muted">
              We provide a clean, secure space so you and your family can focus on finding your Jain Saathi with peace of mind.
            </p>
          </motion.div>
        </div>

        {/* 4 Safety Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {safetyPoints.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-7 border border-border hover:border-champagneGold/50 shadow-sm hover:shadow-xl hover:shadow-deepBurgundy/5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-deepBurgundy" />
                </div>

                <h3 className="font-serif font-bold text-xl text-text mb-2">
                  {item.title}
                </h3>
                
                <p className="text-xs text-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-2 text-xs font-semibold text-deepBurgundy">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                <span>Verified System</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
