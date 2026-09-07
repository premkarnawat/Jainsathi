'use client';

import React from 'react';
import { ArrowRight, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { PlanItem } from './PricingCard';

interface HorizontalPricingCardProps {
  plan: PlanItem;
  isActive: boolean;
  onViewDetails: (plan: PlanItem) => void;
  isFemaleEligible?: boolean;
  isCurrentPlan?: boolean;
}

export default function HorizontalPricingCard({
  plan,
  isActive,
  onViewDetails,
  isFemaleEligible = false,
  isCurrentPlan = false,
}: HorizontalPricingCardProps) {
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
      ? 'Personal Matchmaker Assistance'
      : plan.code.includes('super')
      ? 'Priority Candidate Recommendations'
      : 'Verified Jain Community Badge',
  ];

  return (
    <div
      className={`relative w-full h-full rounded-[32px] sm:rounded-[36px] p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 select-none overflow-hidden ${
        isActive
          ? 'bg-gradient-to-b from-white/75 via-white/55 to-white/35 backdrop-blur-2xl border-2 border-[#D9A441] shadow-[0_0_30px_rgba(217,164,65,0.32),0_20px_45px_-10px_rgba(110,23,53,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.95)]'
          : 'bg-gradient-to-b from-white/50 via-white/35 to-white/20 backdrop-blur-xl border border-white/60 shadow-[0_12px_28px_-10px_rgba(110,23,53,0.08),inset_0_1px_1.5px_rgba(255,255,255,0.7)]'
      }`}
    >
      {/* 1. Subtle Champagne / Amber Radial Glow in Corner (Active Card Only) */}
      {isActive && (
        <div 
          className="absolute -top-14 -right-14 w-36 h-36 rounded-full pointer-events-none opacity-50 blur-2xl"
          style={{
            background: isSuperOrDeluxe
              ? 'radial-gradient(circle, rgba(217,164,65,0.5) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(143,23,61,0.35) 0%, transparent 70%)',
          }}
        />
      )}

      {/* 2. Top Header Metadata */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] sm:text-[11px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/80 border border-white/90 text-[#8F173D] shadow-sm">
              {plan.code.toUpperCase()}
            </span>
            {plan.badge && (
              <span className="text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#D9A441]/20 text-[#9E6F18] border border-[#D9A441]/40">
                {plan.badge}
              </span>
            )}
          </div>

          {isCurrentPlan ? (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-300/60 flex items-center gap-1 shrink-0">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Active
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-[#7A606E]">
              JainSaathi
            </span>
          )}
        </div>

        {/* Plan Display Title */}
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#24131D] tracking-tight leading-none mb-1">
          {plan.name}
        </h2>
        <p className="text-[11px] sm:text-xs text-[#705662] font-medium line-clamp-1">
          {plan.subtitle}
        </p>
      </div>

      {/* 3. Pricing Display Area */}
      <div className="my-auto py-1.5">
        {isFemaleZeroPrice ? (
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#8F173D]">
                Free
              </span>
              <span className="text-xs font-semibold text-[#8F173D]/80">
                for 1 Year
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-semibold text-[#9E6F18]">
              <Sparkles className="w-3 h-3 text-[#D9A441]" />
              <span>Complimentary Female Privilege</span>
            </div>
          </div>
        ) : isFreePlan ? (
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#24131D]">
              ₹0
            </span>
            <span className="text-xs font-medium text-[#705662]">
              / Basic Access
            </span>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#24131D] tracking-tight">
                ₹{plan.priceInr.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-medium text-[#705662]">
                / {plan.durationLabel}
              </span>
            </div>
            <p className="text-[10px] font-medium text-[#9E6F18] mt-0.5">
              ~₹{Math.round(plan.priceInr / Math.max(1, plan.durationMonths))} / month
            </p>
          </div>
        )}

        {/* Entitlements Highlights */}
        <ul className="mt-2.5 space-y-1.5 text-[11px] sm:text-xs text-[#42313B]">
          {highlightFeatures.slice(0, 3).map((feat, idx) => (
            <li key={idx} className="flex items-center gap-1.5 font-medium">
              <span className="w-3.5 h-3.5 rounded-full bg-[#8F173D]/10 text-[#8F173D] flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
              <span className="truncate">{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 4. Bottom Controls Matching Reference Image */}
      <div className="pt-2 border-t border-white/60 flex items-center justify-between">
        {/* Left: View Details Pill Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(plan);
          }}
          className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 hover:bg-white border border-white shadow-sm text-[11px] sm:text-xs font-bold text-[#24131D] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>View Details</span>
          <div className="w-4 h-4 rounded-full bg-[#24131D] text-white flex items-center justify-center transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="w-2.5 h-2.5 stroke-[2.5]" />
          </div>
        </button>

        {/* Right: Asterisk / Luxury Star Accent (Exact to Reference Bottom-Right) */}
        <div className="w-7 h-7 rounded-full bg-white/40 border border-white/60 flex items-center justify-center text-[#24131D]/70 shadow-sm">
          <span className="font-serif text-base font-black leading-none select-none">
            ✦
          </span>
        </div>
      </div>
    </div>
  );
}
