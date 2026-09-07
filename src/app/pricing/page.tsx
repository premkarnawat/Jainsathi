'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundDecorations from '@/components/pricing/BackgroundDecorations';
import HorizontalRopePricingStage from '@/components/pricing/HorizontalRopePricingStage';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { PlanItem } from '@/components/pricing/PricingCard';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function PricingPage() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleActivatePlan = async (selectedPlan: PlanItem) => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. Authoritative order creation on backend
      const res = await fetch('/api/payments/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selectedPlan.id }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (res.status === 401) {
          router.push('/login?redirect=/pricing');
          return;
        }
        throw new Error(data.error || 'Unable to prepare membership order.');
      }

      // 2. Direct activation for Free / Female 1-Year Free
      if (data.directActivation) {
        setSuccessMessage(data.message || `Your ${selectedPlan.name} membership has been activated!`);
        setIsProcessing(false);
        return;
      }

      // 3. Paid Tier -> Razorpay Gateway
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Payment gateway connection error. Please check your network.');
      }

      const order = data.order;
      const options = {
        key: order.keyId,
        amount: order.amountInr * 100,
        currency: order.currency || 'INR',
        name: 'JainSaathi Matrimony',
        description: `${selectedPlan.name} Membership (${selectedPlan.durationDays} Days)`,
        image: '/logo.png',
        order_id: order.orderId,
        prefill: {
          email: order.userEmail || '',
        },
        theme: {
          color: '#8F173D',
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: order.userId,
                planId: selectedPlan.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setSuccessMessage(`Congratulations! Your ${selectedPlan.name} membership is now active.`);
            } else {
              throw new Error(verifyData.error || 'Payment verification failed.');
            }
          } catch (vErr: any) {
            setErrorMessage(vErr.message || 'Payment verification error.');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        setErrorMessage(resp.error?.description || 'Payment was declined or cancelled.');
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to initiate subscription.');
      setIsProcessing(false);
    }
  };

  return (
    <main className="relative w-full h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#FFF9F3] text-[#24131D] flex flex-col justify-between select-none">
      {/* 1. Warm Ivory & Subtle Lotus Ambient Background */}
      <BackgroundDecorations />

      {/* 2. Premium Minimal Mobile Header (Adhering to Section 32) */}
      <header className="relative z-30 w-full max-w-lg mx-auto px-4 pt-3 sm:pt-4 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/70 hover:bg-white/90 backdrop-blur-md border border-white/80 shadow-xs text-xs font-bold text-[#24131D] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Back</span>
        </button>

        {/* Brand Tagline */}
        <div className="flex flex-col items-center">
          <span className="font-serif font-black text-lg sm:text-xl text-[#8F173D] tracking-tight leading-none">
            JainSaathi
          </span>
          <span className="text-[8.5px] uppercase font-bold tracking-widest text-[#9E6F18] mt-0.5">
            Find Your Jain Saathi
          </span>
        </div>

        {/* Hindi / English Language Switcher */}
        <div className="bg-white/70 backdrop-blur-md border border-white/80 rounded-full px-2 py-0.5 shadow-xs">
          <LanguageToggle className="text-[11px] font-bold text-[#8F173D]" />
        </div>
      </header>

      {/* 3. Compact Pricing Introduction (Section 4) */}
      <div className="relative z-20 text-center px-4 pt-1 shrink-0">
        <h1 className="font-serif text-lg sm:text-xl font-black text-[#24131D] tracking-tight">
          Choose Your JainSaathi Plan
        </h1>
        <p className="text-[11px] sm:text-xs text-[#705662] font-medium leading-tight">
          Choose the membership that fits your matrimonial journey.
        </p>
      </div>

      {/* Friendly Error Notice (Never exposes technical errors or raw JSON) */}
      {errorMessage && (
        <div className="relative z-40 max-w-sm mx-auto px-4 mt-1">
          <div className="p-2.5 rounded-2xl bg-red-50/95 border border-red-200 text-red-800 text-xs font-semibold flex items-center justify-between gap-2 shadow-sm">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-500 font-bold px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 4. Strict Horizontal Rope / Wire Pricing Stage */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center overflow-hidden">
        <HorizontalRopePricingStage onActivatePlan={handleActivatePlan} />
      </div>

      {/* 5. Safe Area Bottom Spacer */}
      <div className="h-1 shrink-0" />

      {/* 6. Success Celebration Screen */}
      <AnimatePresence>
        {successMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/40 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-xs rounded-[32px] bg-white p-6 text-center shadow-2xl border border-white space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="font-serif text-xl font-black text-[#24131D]">
                  Membership Activated!
                </h3>
                <p className="text-[11px] text-[#705662] mt-1">
                  {successMessage}
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="w-full py-3 rounded-full bg-[#8F173D] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#6E1735] transition-all"
              >
                Go to Dashboard
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
