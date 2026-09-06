'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import BackgroundDecorations from '@/components/pricing/BackgroundDecorations';
import PricingCardStack from '@/components/pricing/PricingCardStack';
import ActivationZone from '@/components/pricing/ActivationZone';
import PlanDetailSheet from '@/components/pricing/PlanDetailSheet';
import { PlanItem } from '@/components/pricing/PricingCard';

// Interaction State Machine
type PricingState = 
  | 'IDLE' 
  | 'LOADING' 
  | 'PLAN_SELECTED' 
  | 'DETAIL_OPEN' 
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

  // State machine & data states
  const [pricingState, setPricingState] = useState<PricingState>('LOADING');
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(1); // Default to Pro or Super
  const [detailPlan, setDetailPlan] = useState<PlanItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // User & eligibility info from backend
  const [userData, setUserData] = useState<any>(null);
  const [currentSub, setCurrentSub] = useState<any>(null);
  const [isFemaleEligible, setIsFemaleEligible] = useState(false);

  // Drag interaction states for Activation Zone
  const [dragProgress, setDragProgress] = useState(0);
  const [isThresholdReached, setIsThresholdReached] = useState(false);

  // 1. Fetch Authoritative Database Plans on Mount
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
      setUserData(data.user);
      setCurrentSub(data.currentSubscription);
      setIsFemaleEligible(data.isFemaleEligibleForFreeYear);

      // Default to "Super" or "Pro" for best user experience
      const superIndex = data.plans.findIndex((p: PlanItem) => p.code.includes('super'));
      setActiveIndex(superIndex !== -1 ? superIndex : Math.min(1, data.plans.length - 1));

      setPricingState('PLAN_SELECTED');
    } catch (err: any) {
      console.error('Error fetching plans:', err);
      setErrorMessage(err.message || 'Unable to connect to JainSaathi servers.');
      setPricingState('ERROR');
    }
  };

  // Helper to dynamically load Razorpay Checkout Script
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

  // 2. Intentional Activation Trigger (From Drag-to-Activate or Details)
  const handleInitiateActivation = async (selectedPlan: PlanItem) => {
    setPricingState('ACTIVATING');
    setErrorMessage(null);

    try {
      // Step A: Request authoritative order from server
      const res = await fetch('/api/payments/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selectedPlan.id }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (res.status === 401) {
          // Unauthenticated user -> redirect to login with return path
          router.push(`/login?redirect=/pricing`);
          return;
        }
        throw new Error(data.error || 'Failed to prepare membership order.');
      }

      // Step B: If direct activation (Free plan or Female 1-Year Free)
      if (data.directActivation) {
        setSuccessMessage(data.message || `Your ${selectedPlan.name} membership has been activated!`);
        setPricingState('SUCCESS');
        return;
      }

      // Step C: Paid Plan -> Launch Razorpay Gateway
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Could not load payment gateway. Please check your network.');
      }

      const order = data.order;
      const options = {
        key: order.keyId,
        amount: order.amountInr * 100, // in paise
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
          // Verify server-side
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
            setPricingState('PLAN_SELECTED');
          }
        },
        modal: {
          ondismiss: function () {
            setPricingState('PLAN_SELECTED');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        console.error('Payment failed:', resp.error);
        setErrorMessage(resp.error?.description || 'Payment was declined or cancelled.');
        setPricingState('PLAN_SELECTED');
      });
      rzp.open();
    } catch (err: any) {
      console.error('Activation error:', err);
      setErrorMessage(err.message || 'Unable to initiate subscription.');
      setPricingState('PLAN_SELECTED');
    }
  };

  const activePlan = plans[activeIndex] || null;

  return (
    <main className="relative w-full h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#FFF9F3] text-[#24131D] flex flex-col justify-between select-none">
      {/* 1. Subtle Background & Lotus Petals */}
      <BackgroundDecorations />

      {/* 2. Mobile-Friendly Header */}
      <header className="relative z-30 w-full max-w-lg mx-auto px-5 pt-4 sm:pt-6 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 hover:bg-white/90 backdrop-blur-md border border-white/80 shadow-sm text-xs font-bold text-[#24131D] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Back</span>
        </button>

        {/* Brand Tagline */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <span className="font-serif font-black text-lg sm:text-xl text-[#8F173D] tracking-tight">
              JainSaathi
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#9E6F18]">
            Find Your Jain Saathi
          </span>
        </div>

        {/* Plan Indicator (e.g. 2 / 4) */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-sm">
          <span className="text-xs font-black text-[#8F173D]">
            {plans.length > 0 ? activeIndex + 1 : 0}
          </span>
          <span className="text-[10px] text-[#7A606E]">/</span>
          <span className="text-xs font-bold text-[#7A606E]">
            {plans.length}
          </span>
        </div>
      </header>

      {/* Active Subscription Notice Banner (if any) */}
      {currentSub && (
        <div className="relative z-30 max-w-sm mx-auto px-4 mt-1">
          <div className={`px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center justify-center gap-2 border shadow-sm ${
            currentSub.isExpired
              ? 'bg-amber-50 text-amber-900 border-amber-200'
              : 'bg-emerald-50 text-emerald-900 border-emerald-200'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>
              {currentSub.isExpired 
                ? 'Your previous membership has expired. Choose a plan to renew.' 
                : `Current Membership Active until ${new Date(currentSub.expires_at).toLocaleDateString('en-IN')}`}
            </span>
          </div>
        </div>
      )}

      {/* Error Alert Display */}
      {errorMessage && (
        <div className="relative z-40 max-w-sm mx-auto px-4 mt-2">
          <div className="p-3 rounded-2xl bg-red-50/95 border border-red-200 text-red-800 text-xs font-semibold flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-500 font-bold px-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Central 3D Card Stack Stage */}
      {pricingState === 'LOADING' ? (
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-[310px] sm:w-[350px] aspect-[1/1.3] rounded-[34px] bg-white/40 border border-white/60 animate-pulse flex flex-col justify-between p-7 backdrop-blur-xl">
            <div className="space-y-3">
              <div className="h-4 w-20 bg-black/10 rounded-full" />
              <div className="h-9 w-40 bg-black/10 rounded-xl" />
              <div className="h-4 w-48 bg-black/10 rounded-md" />
            </div>
            <div className="space-y-3">
              <div className="h-10 w-32 bg-black/10 rounded-xl" />
              <div className="h-4 w-full bg-black/10 rounded" />
              <div className="h-4 w-3/4 bg-black/10 rounded" />
            </div>
            <div className="h-9 w-28 bg-black/10 rounded-full" />
          </div>
          <p className="text-xs font-semibold text-[#7A606E] mt-4 flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#8F173D]" />
            Loading JainSaathi Membership Plans...
          </p>
        </div>
      ) : pricingState === 'ERROR' ? (
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-extrabold text-[#24131D]">
            Unable to Load Plans
          </h2>
          <p className="text-xs text-[#705662] max-w-xs mt-1 mb-5">
            {errorMessage || 'A temporary connection error occurred while loading membership tiers.'}
          </p>
          <button
            onClick={fetchPlans}
            className="px-6 py-2.5 rounded-full bg-[#8F173D] text-white font-bold text-xs shadow-md hover:bg-[#6E1735] transition-all"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center overflow-hidden">
          <PricingCardStack
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
        </div>
      )}

      {/* 4. Bottom Destination: Drag to Activate Zone */}
      <footer className="relative z-30 pb-4 sm:pb-6 shrink-0">
        <ActivationZone
          activePlan={activePlan}
          dragProgress={dragProgress}
          isThresholdReached={isThresholdReached}
          isActivating={pricingState === 'ACTIVATING'}
          onActivateClick={() => activePlan && handleInitiateActivation(activePlan)}
          isFemaleEligible={isFemaleEligible}
        />
      </footer>

      {/* 5. Expanding Glassmorphism Detail Sheet */}
      <PlanDetailSheet
        plan={detailPlan}
        isOpen={Boolean(detailPlan)}
        onClose={() => setDetailPlan(null)}
        onSelectAndActivate={handleInitiateActivation}
        isFemaleEligible={isFemaleEligible}
      />

      {/* 6. Success Celebration Modal */}
      <AnimatePresence>
        {pricingState === 'SUCCESS' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm rounded-[32px] bg-white p-7 text-center shadow-2xl border border-white space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-black text-[#24131D]">
                  Membership Activated!
                </h3>
                <p className="text-xs text-[#705662] mt-1">
                  {successMessage || 'Welcome to JainSaathi Premium matrimonial privileges.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="w-full py-3.5 rounded-full bg-[#8F173D] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#6E1735] transition-all"
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
