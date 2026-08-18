'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  FileText, 
  Sliders, 
  Search, 
  Heart, 
  UserCheck, 
  KeyRound,
  CheckCircle2
} from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Create Your Profile',
    desc: 'Quick mobile OTP sign-in with basic candidate or family guardian details.',
    icon: UserPlus,
    detail: 'Secure phone auth & account setup.',
  },
  {
    step: '02',
    title: 'Tell Us About Yourself',
    desc: 'Share education, career, Jain sect, gotras, native place, and lifestyle.',
    icon: FileText,
    detail: 'Rich personal & cultural profile.',
  },
  {
    step: '03',
    title: 'Set Partner Preferences',
    desc: 'Define non-negotiable expectations across age, location, education, and values.',
    icon: Sliders,
    detail: 'Custom algorithmic criteria.',
  },
  {
    step: '04',
    title: 'Discover Compatible Profiles',
    desc: 'Browse recommendations ranked by our proprietary preference compatibility score.',
    icon: Search,
    detail: 'High-affinity matching.',
  },
  {
    step: '05',
    title: 'Express Interest',
    desc: 'Send a respectful matrimonial interest to profiles that meet your criteria.',
    icon: Heart,
    detail: 'Discreet interest invitation.',
  },
  {
    step: '06',
    title: 'Connect Upon Mutual Acceptance',
    desc: 'Once the other family or candidate accepts, your connection becomes mutual.',
    icon: UserCheck,
    detail: 'Consent-based interaction.',
  },
  {
    step: '07',
    title: 'Access Biodata & Contact Details',
    desc: 'Unlock detailed PDF biodata, family history, and direct phone contact securely.',
    icon: KeyRound,
    detail: 'Full authorized exchange.',
  },
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-24 bg-[#FFFDF9] relative border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-champagneGold/15 border border-champagneGold/40 text-deepBurgundy text-xs font-bold uppercase tracking-widest mb-4">
              Seven Step Journey
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-text mb-4">
              How <span className="text-deepBurgundy italic font-normal">JainSaathi</span> Works
            </h2>
            <p className="text-base sm:text-lg text-muted">
              A structured, respectful process designed to protect your privacy at every stage.
            </p>
          </motion.div>
        </div>

        {/* 7-Step Interactive Grid Canvas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = activeStep === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-deepBurgundy text-white border-deepBurgundy shadow-xl shadow-deepBurgundy/20 scale-[1.03]'
                    : 'bg-white text-text border-border hover:border-champagneGold/60 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`font-serif text-2xl font-bold ${
                        isSelected ? 'text-champagneGold' : 'text-deepBurgundy/30'
                      }`}
                    >
                      {item.step}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? 'bg-white/20 text-champagneGold'
                          : 'bg-secondary text-deepBurgundy'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3
                    className={`font-serif font-bold text-sm leading-snug mb-2 ${
                      isSelected ? 'text-white' : 'text-text'
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p
                    className={`text-[11px] leading-relaxed ${
                      isSelected ? 'text-white/80' : 'text-muted'
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>

                <div
                  className={`mt-4 pt-3 border-t text-[10px] font-semibold flex items-center gap-1.5 ${
                    isSelected
                      ? 'border-white/20 text-champagneGold'
                      : 'border-border text-deepBurgundy'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{item.detail}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Step Spotlight Banner */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-12 bg-white rounded-3xl p-8 border border-champagneGold/40 shadow-lg shadow-deepBurgundy/5 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-deepBurgundy text-champagneGold flex items-center justify-center font-serif text-2xl font-bold shadow-md shrink-0">
              {steps[activeStep].step}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-champagneGold">
                Active Stage Focus
              </span>
              <h4 className="font-serif text-2xl font-bold text-deepBurgundy">
                {steps[activeStep].title}
              </h4>
              <p className="text-sm text-muted max-w-2xl mt-1">
                {steps[activeStep].desc}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs font-bold text-text bg-secondary px-4 py-2 rounded-full border border-border">
              Privacy Step {activeStep + 1} of 7
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
