'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundDecorations from '@/components/pricing/BackgroundDecorations';
import HorizontalPricingCarousel from '@/components/pricing/HorizontalPricingCarousel';
import ActivationSlot from '@/components/pricing/ActivationSlot';
import InPlaceDetailCard from '@/components/pricing/InPlaceDetailCard';
import { PlanItem } from '@/components/pricing/PricingCard';

type PricingState = 
  | 'LOADING' 
  | 'READY' 
  | 'ACTIVATING' 
  | 'SUCCESS' 
  | 'ERROR';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function PricingPage() {
  const router = useRouter();

  const [pricingState, setPricingState] = useState<PricingState>('LOADING');
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(2); // Default to Super (Most Popular)
  const [detailPlan, setDetailPlan] = useState<PlanItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // User & eligibility
  const [currentSub, setCurrentSub] = useState<any>(null);
  const [isFemaleEligible, setIsFemaleEligible] = useState(false);

  // Drag interaction states for Activation Slot
  const [dragProgress, setDragProgress] = useState(0);
  const [isThresholdReached, setIsThresholdReached] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setPricingState('LOADING');
    setErrorMessage(null);
    try {
      const res = await fetch('/api/plans');
      const data = await res.json();

      if (!data.success || !data.plans || data.plans.length === 0) {
        throw new Error(data.error || 'Failed to load membership plans.');
      }

      setPlans(data.plans);
      setCurrentSub(data.currentSubscription);
      setIsFemaleEligible(data.isFemaleEligibleForFreeYear);

      // Default to "Super" if present, or index 1
      const superIndex = data.plans.findIndex((p: PlanItem) => p.code.includes('super'));
      setActiveIndex(superIndex !== -1 ? superIndex : Math.min(1, data.plans.length - 1));

      setPricingState('READY');
    } catch (err: any) {
      console.error('Error fetching plans:', err);
      setErrorMessage(err.message || 'Unable to connect to JainSaathi servers.');
      setPricingState('ERROR');
    }
  };

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

  const handleInitiateActivation = async (selectedPlan: PlanItem) => {
    setPricingState('ACTIVATING');
    setErrorMessage(null);

    try {
      const res = await fetch('/api/payments/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selectedPlan.id }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (res.status === 401) {
          router.push(`/login?redirect=/pricing`);
          return;
        }
        throw new Error(data.error || 'Failed to prepare membership order.');
      }

      // If direct activation (Free plan or Female 1-Year Free)
      if (data.directActivation) {
        setSuccessMessage(data.message || `Your ${selectedPlan.name} membership has been activated!`);
        setPricingState('SUCCESS');
        return;
      }

      // Paid Plan -> Launch Razorpay
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Could not load payment gateway. Please check your network.');
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
              setPricingState('SUCCESS');
            } else {
              throw new Error(verifyData.error || 'Payment verification failed.');
            }
          } catch (vErr: any) {
            setErrorMessage(vErr.message || 'Payment verification error.');
            setPricingState('READY');
          }
        },
        modal: {
          ondismiss: function () {
            setPricingState('READY');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        console.error('Payment failed:', resp.error);
        setErrorMessage(resp.error?.description || 'Payment was declined or cancelled.');
        setPricingState('READY');
      });
      rzp.open();
    } catch (err: any) {
      console.error('Activation error:', err);
      setErrorMessage(err.message || 'Unable to initiate subscription.');
      setPricingState('READY');
    }
  };

  const activePlan = plans[activeIndex] || null;

  return (
    <main className="relative w-full h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#FFF9F3] text-[#24131D] flex flex-col justify-between select-none">
      {/* 1. Subtle Background & Lotus Petals */}
      <BackgroundDecorations />

      {/* 2. Compact Minimal Header (Adhering to Section 3) */}
      <header className="relative z-30 w-full max-w-lg mx-auto px-4 pt-3 sm:pt-4 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/70 hover:bg-white/90 backdrop-blur-md border border-white/80 shadow-sm text-xs font-bold text-[#24131D] transition-all"
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

        {/* Small Plan Counter Pill */}
        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-sm text-xs">
          <span className="font-black text-[#8F173D]">
            {plans.length > 0 ? activeIndex + 1 : 0}
          </span>
          <span className="text-[10px] text-[#7A606E]">/</span>
          <span className="font-bold text-[#7A606E]">{plans.length}</span>
        </div>
      </header>

      {/* 3. Pricing Introduction (Compact, Section 4) */}
      <div className="relative z-20 text-center px-4 pt-1 shrink-0">
        <h1 className="font-serif text-lg sm:text-xl font-black text-[#24131D] tracking-tight">
          Choose Your JainSaathi Plan
        </h1>
        <p className="text-[11px] sm:text-xs text-[#705662] font-medium leading-tight">
          Choose the membership that fits your matrimonial journey.
        </p>
      </div>

      {/* Active Subscription Banner (if user has an active/expired plan) */}
      {currentSub && (
        <div className="relative z-30 max-w-xs mx-auto px-4 mt-0.5">
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center justify-center gap-1.5 border shadow-sm ${
            currentSub.isExpired
              ? 'bg-amber-50 text-amber-900 border-amber-200'
              : 'bg-emerald-50 text-emerald-900 border-emerald-200'
          }`}>
            <ShieldCheck className="w-3 h-3 shrink-0" />
            <span className="truncate">
              {currentSub.isExpired 
                ? 'Previous membership expired. Select a plan to renew.' 
                : `Current plan active until ${new Date(currentSub.expires_at).toLocaleDateString('en-IN')}`}
            </span>
          </div>
        </div>
      )}

      {/* Error Alert Display */}
      {errorMessage && (
        <div className="relative z-40 max-w-sm mx-auto px-4 mt-1">
          <div className="p-2.5 rounded-2xl bg-red-50/95 border border-red-200 text-red-800 text-xs font-semibold flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-500 font-bold px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 4. Horizontal Interactive 3D Card Stage (Section 5 & 7) */}
      {pricingState === 'LOADING' ? (
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-[280px] sm:w-[320px] aspect-[1/1.25] rounded-[34px] bg-white/40 border border-white/60 animate-pulse flex flex-col justify-between p-6 backdrop-blur-xl">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-black/10 rounded-full" />
              <div className="h-8 w-36 bg-black/10 rounded-xl" />
              <div className="h-3 w-44 bg-black/10 rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="h-8 w-28 bg-black/10 rounded-xl" />
              <div className="h-3 w-full bg-black/10 rounded" />
              <div className="h-3 w-3/4 bg-black/10 rounded" />
            </div>
            <div className="h-8 w-24 bg-black/10 rounded-full" />
          </div>
          <p className="text-[11px] font-semibold text-[#7A606E] mt-3 flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3 animate-spin text-[#8F173D]" />
            Loading JainSaathi Membership Plans...
          </p>
        </div>
      ) : pricingState === 'ERROR' ? (
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-4 text-center">
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-2">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-xl font-extrabold text-[#24131D]">
            Unable to Load Plans
          </h2>
          <p className="text-[11px] text-[#705662] max-w-xs mt-1 mb-4">
            {errorMessage || 'A temporary connection error occurred.'}
          </p>
          <button
            onClick={fetchPlans}
            className="px-5 py-2 rounded-full bg-[#8F173D] text-white font-bold text-xs shadow-md hover:bg-[#6E1735] transition-all"
          >
            Try Again
          </button>
        </div>
      ) : (
        <HorizontalPricingCarousel
          plans={plans}
          activeIndex={activeIndex}
          onIndexChange={setActiveIndex}
          onViewDetails={(plan) => setDetailPlan(plan)}
          onActivate={handleInitiateActivation}
          onDragProgress={(progress, isReached) => {
            setDragProgress(progress);
            setIsThresholdReached(isReached);
          }}
          isFemaleEligible={isFemaleEligible}
          currentPlanId={currentSub?.plan_id}
        />
      )}

      {/* 5. Four Minimal Plan Indicators (Section 14) */}
      <div className="relative z-20 flex items-center justify-center gap-2 py-1 shrink-0">
        {plans.map((p, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={p.id}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Select ${p.name} plan`}
              className={`transition-all flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                isActive
                  ? 'bg-[#8F173D] text-white shadow-sm scale-105'
                  : 'bg-white/60 text-[#7A606E] hover:bg-white/80'
              }`}
            >
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* 6. Dedicated Downward Activation Slot (Section 22 & Video Reference) */}
      <footer className="relative z-30 pb-3 sm:pb-4 shrink-0">
        <ActivationSlot
          activePlan={activePlan}
          dragProgress={dragProgress}
          isThresholdReached={isThresholdReached}
          isActivating={pricingState === 'ACTIVATING'}
          onSlotClick={() => activePlan && handleInitiateActivation(activePlan)}
          isFemaleEligible={isFemaleEligible}
        />
      </footer>

      {/* 7. In-Place Glassmorphism Detail Card (Section 16, 17, 18) */}
      <InPlaceDetailCard
        plan={detailPlan}
        isOpen={Boolean(detailPlan)}
        onClose={() => setDetailPlan(null)}
        onSelectAndActivate={handleInitiateActivation}
        isFemaleEligible={isFemaleEligible}
      />

      {/* 8. Success Celebration Screen */}
      <AnimatePresence>
        {pricingState === 'SUCCESS' && (
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
                  {successMessage || 'Welcome to JainSaathi Premium matrimonial privileges.'}
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
