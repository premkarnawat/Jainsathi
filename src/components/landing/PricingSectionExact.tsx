'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Gift, ChevronLeft, ChevronRight, X, Info } from 'lucide-react';
import Link from 'next/link';
import { LotusBlossom } from './LotusDecoration';

interface Plan {
  name: string;
  subtitle: string;
  price: string;
  duration: string;
  popular?: boolean;
  features: string[];
  details: {
    contacts: string;
    interests: string;
    biodata: string;
    support: string;
  };
}

const plans: Plan[] = [
  {
    name: 'Free',
    subtitle: 'Get started',
    price: '₹0',
    duration: 'Basic Access',
    features: ['Basic profile creation', 'Limited access'],
    details: {
      contacts: 'Zero direct contact reveal',
      interests: 'Receive incoming requests only',
      biodata: 'Summary biodata viewing online',
      support: 'Standard community email help',
    },
  },
  {
    name: 'Pro',
    subtitle: 'For serious seekers',
    price: '₹2,499',
    duration: '/ 3 months',
    popular: true,
    features: ['Increased visibility', 'More interests'],
    details: {
      contacts: '20 verified direct contact reveals',
      interests: '50 direct interest invitations',
      biodata: 'Unlimited 4-Gotra official PDF downloads',
      support: 'Priority WhatsApp & Email support',
    },
  },
  {
    name: 'Super',
    subtitle: 'For better connections',
    price: '₹4,499',
    duration: '/ 6 months',
    features: ['Advanced filters', 'More profile access'],
    details: {
      contacts: '50 verified direct contact reveals',
      interests: '120 direct interest invitations',
      biodata: 'Unlimited printable PDF downloads',
      support: 'Dedicated phone & relationship assistance',
    },
  },
  {
    name: 'Deluxe',
    subtitle: 'For the best experience',
    price: '₹7,999',
    duration: '/ 12 months',
    features: ['Priority support', 'Maximum visibility'],
    details: {
      contacts: '100 verified direct contact reveals',
      interests: 'Unlimited direct inquiries',
      biodata: 'VIP watermark-free printable biodatas',
      support: 'Personal Senior Matchmaker consultation',
    },
  },
];

export default function PricingSectionExact() {
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<Plan | null>(null);

  return (
    <section id="pricing" className="py-24 bg-[#330616] relative overflow-hidden text-white border-t border-[#4A0A22]">
      
      {/* Lotus Blossoms Framing the Edges (Exact to image) */}
      <div className="absolute top-8 -left-8 z-10 pointer-events-none">
        <LotusBlossom size={150} rotation={25} opacity={0.8} />
      </div>
      <div className="absolute bottom-8 -right-8 z-10 pointer-events-none">
        <LotusBlossom size={160} rotation={-25} opacity={0.8} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header (Exact to image) */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 tracking-tight"
          >
            Choose Your <span className="text-champagneGold italic font-normal">JainSaathi</span> Journey
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xs sm:text-sm text-white/70"
          >
            Flexible plans designed for your needs.
          </motion.p>
        </div>

        {/* Pricing Cards Row + Bride Offer Card (Exact to image) */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 relative">
          
          {/* Left Arrow Icon (as shown in image) */}
          <div className="hidden xl:flex absolute -left-7 top-1/2 -translate-y-1/2 z-20">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/70">
              <ChevronLeft className="w-5 h-5" />
            </div>
          </div>

          {/* 4 Main Plan Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 w-full max-w-5xl">
            {plans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className={`rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between relative ${
                  plan.popular
                    ? 'bg-[#FFFDFB] text-text border-2 border-champagneGold shadow-2xl scale-[1.02] z-10'
                    : 'bg-[#FFFDFB] text-text border border-border shadow-md hover:border-champagneGold/50'
                }`}
              >
                {/* Most Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-champagneGold text-deepBurgundy text-[9px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="font-serif font-bold text-xl text-text mb-0.5">
                    {plan.name}
                  </h3>
                  
                  <p className="text-[11px] text-muted mb-3">
                    {plan.subtitle}
                  </p>

                  <div className="flex items-baseline gap-1 mb-4 pb-3 border-b border-border/80">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-deepBurgundy">
                      {plan.price}
                    </span>
                    <span className="text-[10px] text-muted font-medium">
                      {plan.duration}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 mb-6 text-xs text-text/90">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-deepBurgundy stroke-[2.5]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* View Details Button */}
                <button
                  type="button"
                  onClick={() => setSelectedPlanForModal(plan)}
                  className="w-full py-2 rounded-full border border-border text-xs font-semibold text-deepBurgundy hover:bg-[#FAF3ED] transition-colors flex items-center justify-center gap-1 group"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Special Right Card: Eligible Bride Profiles (Free for 1 Year) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full lg:w-64 rounded-2xl p-6 bg-gradient-to-b from-[#4A0A22] to-[#2B0410] border border-champagneGold/40 shadow-xl flex flex-col items-center text-center justify-between"
          >
            <div className="w-12 h-12 rounded-full bg-champagneGold/20 border border-champagneGold/50 flex items-center justify-center text-champagneGold mb-3">
              <Gift className="w-6 h-6" />
            </div>

            <h4 className="font-serif font-bold text-lg text-white mb-1">
              Eligible Bride Profiles
            </h4>

            <p className="font-serif italic text-champagneGold text-lg font-bold mb-4">
              Free for 1 Year
            </p>

            <p className="text-[11px] text-white/70 leading-relaxed mb-6">
              Complimentary verification and matching access for Jain daughters upon profile review.
            </p>

            <Link
              href="/register"
              className="w-full py-2.5 rounded-full bg-white text-deepBurgundy text-xs font-bold hover:bg-[#FAF3ED] transition-all flex items-center justify-center gap-1 shadow-md"
            >
              <span>Check Eligibility</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>

        </div>

      </div>

      {/* Plan Details Modal Dialog */}
      <AnimatePresence>
        {selectedPlanForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-text">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPlanForModal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="relative w-full max-w-md bg-[#FFFDFB] rounded-3xl p-6 sm:p-7 border-2 border-champagneGold shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-serif font-bold text-xl text-deepBurgundy">
                    {selectedPlanForModal.name} Plan Details
                  </h3>
                  <p className="text-xs text-muted">{selectedPlanForModal.price} {selectedPlanForModal.duration}</p>
                </div>
                <button
                  onClick={() => setSelectedPlanForModal(null)}
                  className="p-1.5 rounded-full bg-[#FAF3ED] text-muted hover:text-text"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-[#FAF3ED] p-3 rounded-xl border border-border">
                  <span className="font-bold text-deepBurgundy block mb-0.5">Contact Access:</span>
                  <p className="text-muted">{selectedPlanForModal.details.contacts}</p>
                </div>
                <div className="bg-[#FAF3ED] p-3 rounded-xl border border-border">
                  <span className="font-bold text-deepBurgundy block mb-0.5">Interests Allowance:</span>
                  <p className="text-muted">{selectedPlanForModal.details.interests}</p>
                </div>
                <div className="bg-[#FAF3ED] p-3 rounded-xl border border-border">
                  <span className="font-bold text-deepBurgundy block mb-0.5">Biodata Access:</span>
                  <p className="text-muted">{selectedPlanForModal.details.biodata}</p>
                </div>
                <div className="bg-[#FAF3ED] p-3 rounded-xl border border-border">
                  <span className="font-bold text-deepBurgundy block mb-0.5">Support & Guidance:</span>
                  <p className="text-muted">{selectedPlanForModal.details.support}</p>
                </div>
              </div>

              <Link
                href="/register"
                onClick={() => setSelectedPlanForModal(null)}
                className="btn-ruby w-full py-2.5 text-center text-xs font-bold block shadow-md mt-4"
              >
                Proceed with {selectedPlanForModal.name}
              </Link>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
