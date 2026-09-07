'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, ArrowRight, ShieldCheck, FileText, Sparkles } from 'lucide-react';
import { PlanItem } from './PricingCard';

interface PaymentSuccessInvoiceProps {
  plan: PlanItem;
  invoiceNumber: string;
  orderId: string;
  paymentMethod: string;
  amountInr: number;
  paymentDate: string;
  onClose?: () => void;
}

export default function PaymentSuccessInvoice({
  plan,
  invoiceNumber,
  orderId,
  paymentMethod,
  amountInr,
  paymentDate,
  onClose,
}: PaymentSuccessInvoiceProps) {
  const router = useRouter();

  // Print / Save Invoice as PDF
  const handleDownloadReceipt = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="relative w-full max-w-[390px] sm:max-w-[420px] mx-auto p-4 select-none">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="relative bg-[#FFFDFB] rounded-[30px] border border-[#E8D7CE] p-6 sm:p-7 shadow-[0_25px_60px_rgba(110,23,53,0.18)] text-[#24131D] flex flex-col justify-between overflow-hidden"
      >
        {/* Top Header Icon */}
        <div className="flex flex-col items-center text-center pb-4 border-b border-dashed border-[#E8D7CE]">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-2.5 shadow-sm">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>

          <h2 className="font-serif text-2xl font-black text-[#24131D] tracking-tight">
            Payment Successful
          </h2>
          <p className="text-xs text-[#7A606E] font-medium mt-0.5">
            Thank you for trusting JainSaathi Matrimony
          </p>
        </div>

        {/* Transaction & Payment Details (Matching Reference media_1788777985572.png) */}
        <div className="py-4 space-y-3.5 text-xs">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A606E] block mb-2">
              Payment Details
            </span>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[#42313B]">
                <span className="text-[#7A606E]">Invoice Number</span>
                <span className="font-mono font-bold text-[#24131D]">{invoiceNumber}</span>
              </div>

              <div className="flex justify-between items-center text-[#42313B]">
                <span className="text-[#7A606E]">Order Time</span>
                <span className="font-medium text-[#24131D]">{paymentDate}</span>
              </div>

              <div className="flex justify-between items-center text-[#42313B]">
                <span className="text-[#7A606E]">Payment Method</span>
                <span className="font-semibold text-[#24131D] capitalize">{paymentMethod}</span>
              </div>

              <div className="flex justify-between items-center text-[#42313B]">
                <span className="text-[#7A606E]">Payment Status</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Successful
                </span>
              </div>

              <div className="flex justify-between items-center text-[#42313B]">
                <span className="text-[#7A606E]">Amount Paid</span>
                <span className="font-serif text-base font-black text-[#8F173D]">
                  {amountInr === 0 ? 'Free (Complimentary)' : `₹${amountInr.toLocaleString('en-IN')}`}
                </span>
              </div>
            </div>
          </div>

          {/* Membership Plan Details */}
          <div className="pt-3 border-t border-dashed border-[#E8D7CE]">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A606E] block mb-2">
              Membership Package
            </span>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[#42313B]">
                <span className="font-bold text-[#24131D]">{plan.name} Tier</span>
                <span className="text-xs font-semibold text-[#8F173D]">{plan.durationLabel}</span>
              </div>

              <div className="text-[11px] text-[#7A606E] leading-relaxed">
                {plan.contactRevealLimit > 0 && `• ${plan.contactRevealLimit} Verified Contact Reveals `}
                {plan.biodataDownloadLimit > 0 && `• ${plan.biodataDownloadLimit} Full Biodatas `}
                {plan.isFeaturedAllowed && `• Featured Profile Listing`}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-[#E8D7CE] space-y-2">
          {/* Download PDF Receipt Button */}
          <button
            type="button"
            onClick={handleDownloadReceipt}
            className="w-full py-2.5 rounded-2xl bg-[#F5EBE6] hover:bg-[#EBDDD5] text-[#24131D] text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-[#E0CDC3] active:scale-[0.99]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF Receipt</span>
          </button>

          {/* Proceed to Dashboard Primary Button */}
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="w-full py-3 rounded-2xl bg-[#8F173D] hover:bg-[#6E1735] text-white text-xs font-bold tracking-wider uppercase shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-[0.99]"
          >
            <span>Proceed to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Decorative Perforated Receipt Bottom Edge */}
        <div className="absolute -bottom-2.5 left-0 right-0 flex justify-between pointer-events-none opacity-40">
          {[...Array(18)].map((_, i) => (
            <div key={i} className="w-3.5 h-3.5 rounded-full bg-[#FFF9F3] -mb-2 border-t border-[#E8D7CE]" />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
