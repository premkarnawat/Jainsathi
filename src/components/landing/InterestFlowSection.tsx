'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Bell, 
  CheckCircle2, 
  UserCheck, 
  FileText, 
  PhoneCall,
  ArrowRight
} from 'lucide-react';

const flowSteps = [
  {
    icon: Heart,
    title: '1. Express Interest',
    desc: 'You discover a compatible profile and send a respectful interest invitation.',
    highlight: 'Discreet & Protected',
  },
  {
    icon: Bell,
    title: '2. Family Notified',
    desc: 'The receiving candidate or guardian gets an instant private notification.',
    highlight: 'Controlled Alert',
  },
  {
    icon: CheckCircle2,
    title: '3. Mutual Acceptance',
    desc: 'The receiving party reviews your verified summary and accepts your request.',
    highlight: 'Explicit Consent',
  },
  {
    icon: PhoneCall,
    title: '4. Contact Reveal',
    desc: 'Both parties now gain access to direct contact numbers and 4-Gotra biodata.',
    highlight: 'Safe Family Dialogue',
  },
];

export default function InterestFlowSection() {
  return (
    <section className="py-24 bg-[#FFFDF9] relative border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-softRose/80 border border-champagneGold/30 text-deepBurgundy text-xs font-bold uppercase tracking-widest mb-4">
              Mutual Consent Protocol
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-text mb-4">
              Connect With <span className="text-deepBurgundy italic font-normal">Dignity & Privacy</span>
            </h2>
            <p className="text-base sm:text-lg text-muted">
              No unsolicited phone calls. Contact details and family biodata are strictly protected until mutual acceptance is established.
            </p>
          </motion.div>
        </div>

        {/* Step by Step Flow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {flowSteps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="relative bg-white rounded-3xl p-6 sm:p-7 border border-border hover:border-champagneGold/50 shadow-sm hover:shadow-xl hover:shadow-deepBurgundy/5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-deepBurgundy" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-deepBurgundy bg-softRose/60 px-2.5 py-1 rounded-md">
                    {step.highlight}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-xl text-text mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-bold text-champagneGold">
                <span>Stage {idx + 1}</span>
                {idx < 3 && <ArrowRight className="w-4 h-4 text-border" />}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
