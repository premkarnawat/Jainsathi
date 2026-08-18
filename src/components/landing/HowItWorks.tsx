'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, FileText, Settings2, Search, Heart, UserCheck } from 'lucide-react';

const steps = [
  {
    num: '01',
    title: 'Create Your Profile',
    icon: UserPlus,
    description: 'Sign up securely using your mobile number and basic details.'
  },
  {
    num: '02',
    title: 'Complete Jain & Personal Details',
    icon: FileText,
    description: 'Add your education, career, lifestyle, and Jain identity information.'
  },
  {
    num: '03',
    title: 'Set Partner Preferences',
    icon: Settings2,
    description: 'Define exactly what you are looking for in a life partner.'
  },
  {
    num: '04',
    title: 'Discover Compatible Profiles',
    icon: Search,
    description: 'Our smart matching algorithm recommends highly compatible matches.'
  },
  {
    num: '05',
    title: 'Express Interest',
    icon: Heart,
    description: 'Send interest requests to profiles you wish to connect with.'
  },
  {
    num: '06',
    title: 'Connect After Mutual Acceptance',
    icon: UserCheck,
    description: 'Once mutually accepted, securely exchange contact details and biodata.'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl font-bold text-text mb-4"
          >
            The Journey to Your <span className="text-deepBurgundy italic">Jain Saathi</span>
          </motion.h2>
        </div>

        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-8 lg:left-1/2 lg:-ml-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-deepBurgundy/5 via-deepBurgundy/20 to-deepBurgundy/5 hidden sm:block" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`relative flex flex-col sm:flex-row gap-8 items-start ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
              >
                {/* Visual side */}
                <div className="flex-1 w-full lg:w-1/2 flex justify-center lg:justify-end lg:px-12">
                  <div className={`w-full max-w-sm bg-secondary rounded-2xl border border-border p-6 shadow-lg shadow-deepBurgundy/5 flex flex-col items-center text-center ${index % 2 === 0 ? 'lg:items-end lg:text-right' : 'lg:items-start lg:text-left'}`}>
                    <div className="w-16 h-16 rounded-full bg-white border border-champagneGold flex items-center justify-center mb-4">
                      <step.icon className="w-7 h-7 text-deepBurgundy" />
                    </div>
                    <span className="font-serif text-4xl font-bold text-deepBurgundy/20 mb-2">{step.num}</span>
                  </div>
                </div>

                {/* Center Node */}
                <div className="hidden sm:flex absolute left-8 lg:left-1/2 -ml-[11px] mt-8 w-6 h-6 rounded-full border-4 border-white bg-champagneGold shadow-md z-10" />

                {/* Text side */}
                <div className={`flex-1 w-full lg:w-1/2 flex flex-col justify-center sm:pl-16 lg:pl-12 pt-8 ${index % 2 === 0 ? 'lg:text-left' : 'lg:text-right lg:pr-12 lg:pl-0'}`}>
                  <h3 className="font-serif font-bold text-2xl text-text mb-3">{step.title}</h3>
                  <p className="text-muted leading-relaxed max-w-md inline-block">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
