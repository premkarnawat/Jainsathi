'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, Shield, UserCheck, Phone, FileText, Award } from 'lucide-react';
import { PlanItem } from './PricingCard';

interface PlanDetailSheetProps {
  plan: PlanItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectAndActivate: (plan: PlanItem) => void;
  isFemaleEligible?: boolean;
}

export default function PlanDetailSheet({
  plan,
  isOpen,
  onClose,
  onSelectAndActivate,
  isFemaleEligible = false,
}: PlanDetailSheetProps) {
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!plan) return null;

  const isFreePlan = plan.priceInr === 0;
  const isFemaleZeroPrice = isFemaleEligible && (plan.code === 'free' || plan.code === 'pro_3m');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
          {/* Backdrop Blur and Dim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#24131D]/40 backdrop-blur-md"
          />

          {/* Expanded Glassmorphic Detail Card */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 25 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 25 }}
            transition={{
              type: 'spring',
              damping: 28,
              stiffness: 300,
              duration: 0.45,
            }}
            className="relative w-full max-w-[440px] max-h-[90dvh] overflow-y-auto rounded-[36px] bg-gradient-to-b from-white/90 via-white/80 to-white/70 backdrop-blur-2xl border-[1.5px] border-white p-6 sm:p-8 shadow-[0_30px_70px_rgba(110,23,53,0.25),inset_0_1.5px_2px_rgba(255,255,255,1)] text-[#24131D] flex flex-col justify-between"
            style={{ touchAction: 'pan-y' }}
          >
            {/* Top Close Control - Minimal Single Icon */}
            <button
              onClick={onClose}
              aria-label="Close details"
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#24131D] transition-colors"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Header Section */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-[#8F173D]/10 text-[#8F173D] border border-[#8F173D]/20">
                  {plan.code.toUpperCase()}
                </span>
                {plan.badge && (
                  <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#D9A441]/20 text-[#9E6F18]">
                    {plan.badge}
                  </span>
                )}
              </div>

              <h2 className="font-serif text-3xl font-extrabold tracking-tight">
                {plan.name} Membership
              </h2>
              <p className="text-xs sm:text-sm text-[#705662] font-medium mt-0.5">
                {plan.subtitle}
              </p>

              {/* Price & Billing */}
              <div className="mt-4 p-4 rounded-2xl bg-white/70 border border-white/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-[#7A606E] uppercase tracking-wider">
                    Total Investment
                  </p>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    {isFemaleZeroPrice ? (
                      <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#8F173D]">
                        Free for 1 Year
                      </span>
                    ) : isFreePlan ? (
                      <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#24131D]">
                        ₹0
                      </span>
                    ) : (
                      <>
                        <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#24131D]">
                          ₹{plan.priceInr.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-[#705662] font-medium">
                          / {plan.durationDays} Days
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold text-[#9E6F18] px-2.5 py-1 rounded-full bg-[#D9A441]/15 border border-[#D9A441]/30">
                    {plan.durationMonths} Months Access
                  </span>
                </div>
              </div>
            </div>

            {/* Comprehensive Entitlements List from Database */}
            <div className="my-5 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#7A606E]">
                Included Entitlements & Privileges
              </h3>

              <div className="grid grid-cols-1 gap-2.5">
                {/* Contact Reveals */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/60 border border-white/70">
                  <div className="w-8 h-8 rounded-xl bg-[#8F173D]/10 text-[#8F173D] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#24131D]">
                      {plan.contactRevealLimit > 0
                        ? `${plan.contactRevealLimit} Verified Contact Reveals`
                        : 'No Direct Contact Reveal'}
                    </h4>
                    <p className="text-[11px] text-[#705662] font-medium leading-relaxed">
                      {plan.contactRevealLimit > 0
                        ? 'Unlock verified phone numbers & family contacts directly on biodata.'
                        : 'Connect via platform interest requests only.'}
                    </p>
                  </div>
                </div>

                {/* Biodata Downloads */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/60 border border-white/70">
                  <div className="w-8 h-8 rounded-xl bg-[#D9A441]/15 text-[#9E6F18] flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#24131D]">
                      {plan.biodataDownloadLimit > 0
                        ? `${plan.biodataDownloadLimit} Full Biodata PDF Downloads`
                        : '2 Basic Biodata Views'}
                    </h4>
                    <p className="text-[11px] text-[#705662] font-medium leading-relaxed">
                      Official 4-Gotra matrimonial PDF downloads formatted for family review.
                    </p>
                  </div>
                </div>

                {/* Featured Placement */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/60 border border-white/70">
                  <div className="w-8 h-8 rounded-xl bg-[#24131D]/10 text-[#24131D] flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#24131D]">
                      {plan.isFeaturedAllowed ? 'Featured Profile Placement' : 'Standard Search Placement'}
                    </h4>
                    <p className="text-[11px] text-[#705662] font-medium leading-relaxed">
                      {plan.isFeaturedAllowed
                        ? 'Highlighted top positioning in search results and candidate recommendations.'
                        : 'Standard visibility among Jain community matches.'}
                    </p>
                  </div>
                </div>

                {/* Database Feature Items */}
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/40 text-xs font-medium text-[#42313B]">
                    <Check className="w-3.5 h-3.5 text-[#8F173D] stroke-[2.5] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSelectAndActivate(plan);
                }}
                className="w-full py-3.5 rounded-full bg-[#8F173D] hover:bg-[#6E1735] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>Select & Continue with {plan.name}</span>
                <Sparkles className="w-3.5 h-3.5 text-[#E9C77B]" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
