'use client';

import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Lock, CreditCard, QrCode, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import FlippingPaymentCard from './FlippingPaymentCard';
import { PlanItem } from './PricingCard';

interface PaymentCheckoutViewProps {
  plan: PlanItem;
  onBack: () => void;
  onPaymentSuccess: (invoiceData: {
    invoiceNumber: string;
    orderId: string;
    paymentMethod: string;
    amountInr: number;
    paymentDate: string;
  }) => void;
  isFemaleEligible?: boolean;
}


export default function PaymentCheckoutView({
  plan,
  onBack,
  onPaymentSuccess,
  isFemaleEligible = false,
}: PaymentCheckoutViewProps) {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'upi' | 'netbanking'>('card');

  // Interactive Card Form States (Syncing Live to Flipping Card)
  const [cardHolder, setCardHolder] = useState('PREM KARNAWAT');
  const [cardNumber, setCardNumber] = useState('4215 2154 2154 5487');
  const [expiry, setExpiry] = useState('03/28');
  const [cvv, setCvv] = useState('842');
  const [isFlipped, setIsFlipped] = useState(false);

  // UPI State
  const [upiId, setUpiId] = useState('prem@okhdfcbank');

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Loading & Error States
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isZeroPrice = plan.priceInr === 0 || (isFemaleEligible && (plan.code === 'free' || plan.code === 'pro_3m'));

  // Calculated Pricing Breakdown
  const basePrice = isZeroPrice ? 0 : plan.priceInr;
  const gstAmount = isZeroPrice ? 0 : Math.round(basePrice * 0.18);
  const totalDue = isZeroPrice ? 0 : basePrice + gstAmount;

  // Format Card Number input with spaces every 4 digits
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  // Format Expiry MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setExpiry(raw);
  };

  // 100% Mock Payment Handler (Zero external dependencies or gateway required)
  const handlePayNow = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. If user is logged in, optionally persist mock subscription in database
      try {
        await fetch('/api/payments/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId: plan.id, mockMode: true }),
        });
      } catch (_) {
        // Ignored in mock mode
      }

      // 2. Realistic Simulated Banking Processing Delay (1.2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // 3. Format Payment Method Description
      const cleanDigits = (cardNumber || '').replace(/\D/g, '');
      let methodLabel = 'CREDIT / DEBIT CARD';
      if (selectedMethod === 'card') {
        const last4 = cleanDigits.slice(-4) || '5487';
        methodLabel = `Card ending in ${last4}`;
      } else if (selectedMethod === 'upi') {
        methodLabel = `UPI (${upiId.trim() || 'Instant QR'})`;
      } else if (selectedMethod === 'netbanking') {
        methodLabel = `Net Banking (${selectedBank})`;
      }

      if (isZeroPrice) {
        methodLabel = isFemaleEligible ? 'Female Privilege (Complimentary)' : 'Free Access';
      }

      // 4. Navigate Directly to Success Screen / Invoice
      setIsProcessing(false);
      onPaymentSuccess({
        invoiceNumber: `JS-INV-${Math.floor(100000 + Math.random() * 900000)}`,
        orderId: `MOCK-${Date.now().toString().slice(-8)}`,
        paymentMethod: methodLabel,
        amountInr: isZeroPrice ? 0 : totalDue,
        paymentDate: new Date().toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to process mock transaction.');
      setIsProcessing(false);
    }
  };

  const popularBanks = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'];

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 py-2 select-none overflow-y-auto max-h-[92dvh]">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E8D7CE]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-xs font-bold text-[#24131D] shadow-xs border border-white transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Plans</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-serif font-black text-base text-[#8F173D]">
            JainSaathi
          </span>
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Mock Checkout
          </span>
        </div>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-2.5 mb-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-red-500 font-bold px-1">✕</button>
        </div>
      )}

      {/* ============================================================
          RESPONSIVE SPLIT-SCREEN / STACKED PAYMENT CHECKOUT
          (Matching References media_1788777664251.png & media_1788777813319.png)
          ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 3D Flipping Card Preview & Order Summary */}
        <div className="md:col-span-5 space-y-4">
          {/* Interactive Card with Live Typing & 3D CVV Flip */}
          <FlippingPaymentCard
            cardNumber={cardNumber}
            cardHolder={cardHolder}
            expiry={expiry}
            cvv={cvv}
            isFlipped={isFlipped}
          />

          {/* Order Summary Box (Matching Reference) */}
          <div className="rounded-[22px] bg-white/80 backdrop-blur-xl border border-white/90 p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#7A606E]">
                  Selected Plan
                </span>
                <h4 className="font-serif text-lg font-black text-[#24131D]">
                  {plan.name} Membership
                </h4>
              </div>
              <span className="text-xs font-bold text-[#8F173D] px-2.5 py-1 rounded-full bg-[#8F173D]/10">
                {plan.durationLabel}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-[#42313B]">
              <div className="flex justify-between">
                <span className="text-[#7A606E]">Membership Base</span>
                <span className="font-semibold">₹{basePrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A606E]">Estimated GST (18%)</span>
                <span className="font-semibold">₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-gray-100 flex justify-between items-baseline text-sm font-black text-[#24131D]">
                <span>Total Due</span>
                <span className="font-serif text-xl text-[#8F173D]">
                  {isZeroPrice ? 'Free' : `₹${totalDue.toLocaleString('en-IN')}`}
                </span>
              </div>
            </div>

            {/* Security Guarantee Pill */}
            <div className="pt-2 flex items-center gap-1.5 text-[10px] text-[#7A606E] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>PCI-DSS Level 1 Verified • 256-bit TLS Encryption</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Payment Method Selector & Form */}
        <div className="md:col-span-7 rounded-[26px] bg-white/90 backdrop-blur-xl border border-white p-5 sm:p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-serif text-xl font-black text-[#24131D]">
              Payment Options
            </h3>
            <p className="text-xs text-[#7A606E] font-medium">
              Select your preferred secure payment method
            </p>
          </div>

          {/* Payment Method Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-gray-100/80">
            <button
              type="button"
              onClick={() => setSelectedMethod('card')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                selectedMethod === 'card'
                  ? 'bg-white text-[#8F173D] shadow-xs'
                  : 'text-[#7A606E] hover:text-[#24131D]'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Card</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('upi')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                selectedMethod === 'upi'
                  ? 'bg-white text-[#8F173D] shadow-xs'
                  : 'text-[#7A606E] hover:text-[#24131D]'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('netbanking')}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                selectedMethod === 'netbanking'
                  ? 'bg-white text-[#8F173D] shadow-xs'
                  : 'text-[#7A606E] hover:text-[#24131D]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Net Banking</span>
            </button>
          </div>

          {/* FORM: CREDIT / DEBIT CARD */}
          {selectedMethod === 'card' && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A606E] block mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. PREM KARNAWAT"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-[#24131D] focus:outline-none focus:border-[#8F173D] focus:ring-1 focus:ring-[#8F173D]"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A606E] block mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="4242 •••• •••• ••••"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white font-mono text-xs font-semibold text-[#24131D] focus:outline-none focus:border-[#8F173D] focus:ring-1 focus:ring-[#8F173D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A606E] block mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={handleExpiryChange}
                    maxLength={5}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white font-mono text-xs font-semibold text-[#24131D] focus:outline-none focus:border-[#8F173D] focus:ring-1 focus:ring-[#8F173D]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A606E] block mb-1">
                    CVV / CVC (Flip Card)
                  </label>
                  <input
                    type="password"
                    placeholder="•••"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.slice(0, 4))}
                    onFocus={() => setIsFlipped(true)}
                    onBlur={() => setIsFlipped(false)}
                    maxLength={4}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white font-mono text-xs font-semibold text-[#24131D] focus:outline-none focus:border-[#8F173D] focus:ring-1 focus:ring-[#8F173D]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* FORM: UPI / QR */}
          {selectedMethod === 'upi' && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A606E] block mb-1">
                  UPI ID (VPA)
                </label>
                <input
                  type="text"
                  placeholder="username@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-[#24131D] focus:outline-none focus:border-[#8F173D] focus:ring-1 focus:ring-[#8F173D]"
                />
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
                <p className="text-xs font-bold text-[#24131D]">Instant UPI Apps Supported</p>
                <p className="text-[11px] text-[#7A606E] mt-0.5">Google Pay, PhonePe, Paytm, CRED, BHIM</p>
              </div>
            </div>
          )}

          {/* FORM: NET BANKING */}
          {selectedMethod === 'netbanking' && (
            <div className="space-y-3 pt-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A606E] block mb-1">
                Select Popular Bank
              </label>

              <div className="grid grid-cols-2 gap-2">
                {popularBanks.map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className={`p-2.5 rounded-xl text-xs font-bold text-left border transition-all flex items-center justify-between ${
                      selectedBank === bank
                        ? 'border-[#8F173D] bg-[#8F173D]/5 text-[#8F173D]'
                        : 'border-gray-200 hover:border-gray-300 text-[#42313B]'
                    }`}
                  >
                    <span className="truncate">{bank}</span>
                    {selectedBank === bank && <CheckCircle2 className="w-3.5 h-3.5 text-[#8F173D] shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="pt-2 space-y-1.5">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handlePayNow}
              className="w-full py-3.5 rounded-2xl bg-[#8F173D] hover:bg-[#6E1735] disabled:opacity-75 text-white text-xs font-bold tracking-wider uppercase shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
            >
              {isProcessing ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
              <span>
                {isProcessing
                  ? 'Processing Securely...'
                  : isZeroPrice
                  ? 'Activate Free Membership'
                  : `Pay ₹${totalDue.toLocaleString('en-IN')}`}
              </span>
            </button>
            <p className="text-[10px] text-center text-[#7A606E] font-medium flex items-center justify-center gap-1">
              ✨ Demo Mock Gateway • No actual card charges
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
