'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Wifi } from 'lucide-react';

interface FlippingPaymentCardProps {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  isFlipped: boolean;
}

export default function FlippingPaymentCard({
  cardNumber,
  cardHolder,
  expiry,
  cvv,
  isFlipped,
}: FlippingPaymentCardProps) {
  // Format card number to display 16 digits formatted in 4 blocks
  const cleanNumber = (cardNumber || '').replace(/\D/g, '');
  const displayBlocks = [
    cleanNumber.slice(0, 4) || '••••',
    cleanNumber.slice(4, 8) || '••••',
    cleanNumber.slice(8, 12) || '••••',
    cleanNumber.slice(12, 16) || (cleanNumber.length > 0 ? '••••' : '4589'),
  ];

  // Detect card network
  const firstDigit = cleanNumber[0];
  let cardNetwork = 'VISA';
  if (firstDigit === '5') cardNetwork = 'MASTERCARD';
  if (firstDigit === '6') cardNetwork = 'RUPAY';

  const displayName = cardHolder.trim() || 'CARDHOLDER NAME';
  const displayExpiry = expiry || 'MM/YY';

  return (
    <div 
      className="relative w-full max-w-[340px] sm:max-w-[370px] aspect-[1/0.63] mx-auto select-none"
      style={{ perspective: '1100px' }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-full rounded-[24px] shadow-[0_20px_45px_-10px_rgba(110,23,53,0.35),0_0_20px_rgba(217,164,65,0.2)] will-change-transform"
      >
        {/* ============================================================
            FRONT OF CARD
            ============================================================ */}
        <div
          style={{ backfaceVisibility: 'hidden' }}
          className="absolute inset-0 rounded-[24px] p-5 sm:p-6 bg-gradient-to-br from-[#8F173D] via-[#5C1027] to-[#24131D] text-white flex flex-col justify-between border border-[#D9A441]/40 overflow-hidden"
        >
          {/* Subtle Ambient Glass Highlights */}
          <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-[#D9A441]/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-[#8F173D]/30 blur-2xl pointer-events-none" />

          {/* Top Row: Chip + Contactless Wifi + Brand */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              {/* Metallic Card EMV Chip */}
              <div className="w-10 h-7 rounded-md bg-gradient-to-br from-[#E9C77B] via-[#D9A441] to-[#9E6F18] p-1 shadow-sm border border-[#E9C77B]/60 flex flex-col justify-between">
                <div className="w-full h-[1px] bg-black/30" />
                <div className="w-full h-[1px] bg-black/30" />
              </div>
              {/* Wifi Wave */}
              <Wifi className="w-4 h-4 text-white/70 rotate-90" />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-serif font-black text-sm tracking-wider text-[#E9C77B]">
                JainSaathi
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/20">
                {cardNetwork}
              </span>
            </div>
          </div>

          {/* Center: Live Updating Card Number */}
          <div className="my-auto py-2 z-10">
            <div className="font-mono text-base sm:text-lg font-bold tracking-[0.22em] text-white/95 drop-shadow-sm flex justify-between">
              {displayBlocks.map((block, idx) => (
                <span key={idx}>{block}</span>
              ))}
            </div>
          </div>

          {/* Bottom Row: Cardholder Name & Expiry Date */}
          <div className="flex items-end justify-between z-10 text-white/90">
            <div className="max-w-[70%]">
              <span className="text-[8.5px] uppercase tracking-widest text-[#E9C77B] font-bold block mb-0.5">
                Cardholder Name
              </span>
              <p className="font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase truncate">
                {displayName}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[8.5px] uppercase tracking-widest text-[#E9C77B] font-bold block mb-0.5">
                Expires
              </span>
              <p className="font-mono text-xs sm:text-sm font-semibold tracking-wider">
                {displayExpiry}
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================
            BACK OF CARD (Flipped 180° around Y-axis)
            ============================================================ */}
        <div
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-[#24131D] via-[#4A0A22] to-[#170B13] text-white flex flex-col justify-between py-5 border border-[#D9A441]/40 overflow-hidden"
        >
          {/* Black Magnetic Stripe */}
          <div className="w-full h-9 sm:h-11 bg-[#12080E] shadow-inner mb-3" />

          {/* Signature Strip & CVV Area */}
          <div className="px-6 z-10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[8.5px] uppercase tracking-widest text-white/60 font-semibold">
                Authorized Signature
              </span>
              <span className="text-[8.5px] uppercase tracking-widest text-[#E9C77B] font-bold">
                CVV / CVC
              </span>
            </div>

            {/* Signature Box with CVV */}
            <div className="flex items-center h-8 rounded bg-white/90 shadow-sm overflow-hidden">
              <div 
                className="flex-1 h-full opacity-30"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #7A606E 0, #7A606E 2px, transparent 0, transparent 6px)',
                }}
              />
              <div className="px-3 font-mono text-sm font-extrabold text-[#24131D] tracking-widest bg-amber-50 h-full flex items-center border-l border-gray-300">
                {cvv || '•••'}
              </div>
            </div>
          </div>

          {/* Bottom Security / Bank Hologram Text */}
          <div className="px-6 z-10 flex items-center justify-between text-[9px] text-white/50">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#D9A441]" />
              <span>256-bit Encrypted Tokenization</span>
            </div>
            <span className="font-mono tracking-widest">
              {cardNetwork} SECURE
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
