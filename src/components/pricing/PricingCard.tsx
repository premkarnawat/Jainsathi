'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Check, Crown, ShieldCheck } from 'lucide-react';

export interface PlanItem {
  id: number;
  code: string;
  name: string;
  priceInr: number;
  durationDays: number;
  durationMonths: number;
  durationLabel: string;
  subtitle: string;
  badge?: string | null;
  contactRevealLimit: number;
  biodataDownloadLimit: number;
  isFeaturedAllowed: boolean;
  features: string[];
  isFemaleFreeEligible?: boolean;
}

interface PricingCardProps {
  plan: PlanItem;
  isActive: boolean;
  onViewDetails: (plan: PlanItem) => void;
  isFemaleEligible?: boolean;
  isCurrentPlan?: boolean;
}

export default function PricingCard({
  plan,
  isActive,
  onViewDetails,
  isFemaleEligible = false,
  isCurrentPlan = false,
}: PricingCardProps) {
  const isSuperOrDeluxe = plan.code.includes('super') || plan.code.includes('deluxe');
  const isFreePlan = plan.priceInr === 0;
  const isFemaleZeroPrice = isFemaleEligible && (plan.code === 'free' || plan.code === 'pro_3m');

  // Key entitlement summary items from database
  const highlightFeatures = [
    plan.contactRevealLimit > 0
      ? `${plan.contactRevealLimit} Verified Contact Reveals`
      : 'Basic Contact Access',
    plan.biodataDownloadLimit > 0
      ? `${plan.biodataDownloadLimit} Full Biodata PDF Downloads`
      : 'Summary Biodata View',
    plan.isFeaturedAllowed
      ? 'Featured Matrimonial Placement'
      : 'Standard Profile Listing',
    plan.code.includes('deluxe')
      ? 'Personal Relationship Matchmaker'
      : plan.code.includes('super')
      ? 'Priority Profile Recommendations'
      : 'Verified Jain Community Badge',
  ];

  return (
    <div
      className={`relative w-full max-w-[340px] sm:max-w-[370px] aspect-[1/1.32] sm:aspect-[1/1.3] rounded-[34px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 select-none overflow-hidden ${
        isActive
          ? 'bg-gradient-to-b from-white/70 via-white/50 to-white/35 backdrop-blur-2xl border-[1.5px] border-white/90 shadow-[0_24px_55px_-12px_rgba(110,23,53,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.95)]'
          : 'bg-gradient-to-b from-white/55 via-white/40 to-white/20 backdrop-blur-xl border border-white/60 shadow-[0_16px_35px_-10px_rgba(110,23,53,0.08),inset_0_1px_1.5px_rgba(255,255,255,0.8)]'
      }`}
    >
      {/* 1. Subtle Champagne / Burgundy Corner Reflection */}
      <div 
        className="absolute -top-16 -right-16 w-36 h-36 rounded-full pointer-events-none opacity-40 blur-2xl"
        style={{
          background: isSuperOrDeluxe
            ? 'radial-gradient(circle, rgba(217,164,65,0.45) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(143,23,61,0.3) 0%, transparent 70%)',
        }}
      />

      {/* 2. Top Header Metadata */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-white/70 border border-white/80 text-[#8F173D] shadow-sm">
              {plan.code.toUpperCase()}
            </span>
            {plan.badge && (
              <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#D9A441]/15 text-[#9E6F18] border border-[#D9A441]/30">
                {plan.badge}
              </span>
            )}
          </div>

          {isCurrentPlan ? (
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-300/60 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Active Plan
            </span>
          ) : (
            <span className="text-[11px] font-medium text-[#7A606E]">
              JainSaathi
            </span>
          )}
        </div>

        {/* Plan Display Title */}
        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#24131D] tracking-tight leading-none mb-1.5">
          {plan.name}
        </h2>
        <p className="text-xs sm:text-sm text-[#705662] font-medium leading-snug">
          {plan.subtitle}
        </p>
      </div>

      {/* 3. Pricing Display Area */}
      <div className="my-auto py-2">
        {isFemaleZeroPrice ? (
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#8F173D]">
                Free
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#8F173D]/80">
                for 1 Year
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#9E6F18]">
              <Sparkles className="w-3 h-3 text-[#D9A441]" />
              <span>Complimentary Female Privilege</span>
            </div>
          </div>
        ) : isFreePlan ? (
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#24131D]">
              ₹0
            </span>
            <span className="text-xs sm:text-sm font-medium text-[#705662]">
              / Basic Access
            </span>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#24131D] tracking-tight">
                ₹{plan.priceInr.toLocaleString('en-IN')}
              </span>
              <span className="text-xs sm:text-sm font-medium text-[#705662]">
                / {plan.durationLabel}
              </span>
            </div>
            <p className="text-[11px] font-medium text-[#9E6F18] mt-0.5">
              ~₹{Math.round(plan.priceInr / Math.max(1, plan.durationMonths))} / month
            </p>
          </div>
        )}

        {/* Entitlements Highlights */}
        <ul className="mt-4 space-y-2 text-[11px] sm:text-xs text-[#42313B]">
          {highlightFeatures.slice(0, 4).map((feat, idx) => (
            <li key={idx} className="flex items-center gap-2 font-medium">
              <span className="w-4 h-4 rounded-full bg-[#8F173D]/10 text-[#8F173D] flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
              <span className="truncate">{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 4. Bottom Controls Matching Reference Image */}
      <div className="pt-3 border-t border-white/60 flex items-center justify-between">
        {/* Left: View Details Pill Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(plan);
          }}
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white border border-white/90 shadow-sm text-xs font-bold text-[#24131D] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>View Details</span>
          <div className="w-5 h-5 rounded-full bg-[#24131D] text-white flex items-center justify-center transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="w-3 h-3 stroke-[2.5]" />
          </div>
        </button>

        {/* Right: Asterisk / Luxury Star Accent (Exact to Reference Bottom-Right) */}
        <div className="w-8 h-8 rounded-full bg-white/40 border border-white/60 flex items-center justify-center text-[#24131D]/70 shadow-sm">
          <span className="font-serif text-lg font-black leading-none select-none">
            ✦
          </span>
        </div>
      </div>
    </div>
  );
}
