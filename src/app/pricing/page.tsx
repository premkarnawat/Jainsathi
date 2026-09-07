'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import BackgroundDecorations from '@/components/pricing/BackgroundDecorations';
import HorizontalRopePricingStage from '@/components/pricing/HorizontalRopePricingStage';
import PaymentCheckoutView from '@/components/pricing/PaymentCheckoutView';
import PaymentSuccessInvoice from '@/components/pricing/PaymentSuccessInvoice';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { PlanItem } from '@/components/pricing/PricingCard';

// Default Verified Plans for zero-latency fallback
const DEFAULT_PLANS: PlanItem[] = [
  {
    id: 1,
    code: 'free',
    name: 'Free',
    priceInr: 0,
    durationDays: 365,
    durationMonths: 12,
    durationLabel: '1 Year',
    subtitle: 'Begin your JainSaathi journey',
    badge: null,
    contactRevealLimit: 0,
    biodataDownloadLimit: 2,
    isFeaturedAllowed: false,
    features: ['Create Profile', 'Smart Matching', 'Receive Interests', 'Basic Search'],
  },
  {
    id: 2,
    code: 'pro_3m',
    name: 'Pro',
    priceInr: 1999,
    durationDays: 90,
    durationMonths: 3,
    durationLabel: '3 Months',
    subtitle: 'For active matrimonial search',
    badge: null,
    contactRevealLimit: 10,
    biodataDownloadLimit: 25,
    isFeaturedAllowed: false,
    features: ['View Full Profiles', '10 Contact Reveals', 'Send Unlimited Interests', 'Direct Chat Request', 'Verified Profile Badge'],
  },
  {
    id: 3,
    code: 'super_3m',
    name: 'Super',
    priceInr: 3499,
    durationDays: 90,
    durationMonths: 3,
    durationLabel: '3 Months',
    subtitle: 'For serious matrimonial search',
    badge: 'Most Popular',
    contactRevealLimit: 25,
    biodataDownloadLimit: 50,
    isFeaturedAllowed: true,
    features: ['Most Popular', '25 Contact Reveals', 'Featured Listing for 14 Days', 'Priority Recommendation', 'Full Biodata Access', 'Dedicated Relationship Manager'],
  },
  {
    id: 4,
    code: 'deluxe_6m',
    name: 'Deluxe',
    priceInr: 5999,
    durationDays: 180,
    durationMonths: 6,
    durationLabel: '6 Months',
    subtitle: 'For maximum visibility and connections',
    badge: 'Best Value',
    contactRevealLimit: 60,
    biodataDownloadLimit: 150,
    isFeaturedAllowed: true,
    features: ['Best Value', '60 Contact Reveals', 'Featured Profile for 30 Days', 'Top Ranking in Search', 'Personalized Assistance', 'Exclusive Family Verification'],
  },
];

type PurchaseState =
  | 'PLAN_SELECTED'
  | 'CHECKOUT_READY'
  | 'INVOICE_READY';

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [purchaseState, setPurchaseState] = useState<PurchaseState>('PLAN_SELECTED');
  const [plans, setPlans] = useState<PlanItem[]>(DEFAULT_PLANS);
  const [selectedPlan, setSelectedPlan] = useState<PlanItem>(DEFAULT_PLANS[2]); // Default Super
  const [isFemaleEligible, setIsFemaleEligible] = useState(false);

  // Invoice Receipt Data
  const [invoiceData, setInvoiceData] = useState<{
    invoiceNumber: string;
    orderId: string;
    paymentMethod: string;
    amountInr: number;
    paymentDate: string;
  } | null>(null);

  // 1. Fetch Plans and Check for Direct Checkout URL Parameter
  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const res = await fetch('/api/plans');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && data.plans?.length > 0) {
            setPlans(data.plans);
            setIsFemaleEligible(Boolean(data.isFemaleEligibleForFreeYear));

            // Check if ?checkout=planId was provided (from Landing Page drag or direct link)
            const checkoutParam = searchParams.get('checkout');
            if (checkoutParam) {
              const target = data.plans.find((p: PlanItem) => p.id === Number(checkoutParam));
              if (target) {
                setSelectedPlan(target);
                // Immediately open Checkout — ZERO SECOND DRAG!
                setPurchaseState('CHECKOUT_READY');
                return;
              }
            }
          }
        }
      } catch (_) {
        // Use verified default plans
      }

      // Check fallback checkout param
      const checkoutParam = searchParams.get('checkout');
      if (checkoutParam) {
        const target = DEFAULT_PLANS.find((p) => p.id === Number(checkoutParam));
        if (target && isMounted) {
          setSelectedPlan(target);
          setPurchaseState('CHECKOUT_READY');
        }
      }
    }

    init();
    return () => { isMounted = false; };
  }, [searchParams]);

  // 2. First and Only Drag / Activate Handler
  const handleActivatePlan = (planToActivate: PlanItem) => {
    setSelectedPlan(planToActivate);
    // Direct transition to Payment Checkout — NO second pricing page, NO second drag!
    setPurchaseState('CHECKOUT_READY');
  };

  // 3. Payment Success Callback
  const handlePaymentSuccess = (invoice: {
    invoiceNumber: string;
    orderId: string;
    paymentMethod: string;
    amountInr: number;
    paymentDate: string;
  }) => {
    setInvoiceData(invoice);
    setPurchaseState('INVOICE_READY');
  };

  return (
    <main className="relative w-full h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#FFF9F3] text-[#24131D] flex flex-col justify-between select-none">
      {/* 1. Warm Ivory & Subtle Lotus Ambient Background */}
      <BackgroundDecorations />

      {/* 2. Premium Minimal Mobile Header (Only shown when not in full invoice) */}
      {purchaseState !== 'INVOICE_READY' && (
        <header className="relative z-30 w-full max-w-lg mx-auto px-4 pt-3 sm:pt-4 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => {
              if (purchaseState === 'CHECKOUT_READY') {
                setPurchaseState('PLAN_SELECTED');
              } else {
                router.back();
              }
            }}
            aria-label="Go back"
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/75 hover:bg-white backdrop-blur-md border border-white/80 shadow-xs text-xs font-bold text-[#24131D] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{purchaseState === 'CHECKOUT_READY' ? 'Plans' : 'Back'}</span>
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
          <div className="bg-white/75 backdrop-blur-md border border-white/80 rounded-full px-2 py-0.5 shadow-xs">
            <LanguageToggle className="text-[11px] font-bold text-[#8F173D]" />
          </div>
        </header>
      )}

      {/* 3. DYNAMIC CONTENT BASED ON PURCHASE STATE MACHINE */}
      {purchaseState === 'PLAN_SELECTED' && (
        <>
          {/* Pricing Introduction Header */}
          <div className="relative z-20 text-center px-4 pt-1 shrink-0">
            <h1 className="font-serif text-lg sm:text-xl font-black text-[#24131D] tracking-tight">
              Choose Your JainSaathi Plan
            </h1>
            <p className="text-[11px] sm:text-xs text-[#705662] font-medium leading-tight">
              Choose the membership that fits your matrimonial journey.
            </p>
          </div>

          {/* The Horizontal Rope / Wire Carousel (First and Only Drag!) */}
          <div className="relative z-20 flex-1 flex flex-col items-center justify-center overflow-hidden">
            <HorizontalRopePricingStage onActivatePlan={handleActivatePlan} />
          </div>

          <div className="h-1 shrink-0" />
        </>
      )}

      {/* STATE: CHECKOUT READY (Payment Page matching references media_1788777664251.png & media_1788777813319.png) */}
      {purchaseState === 'CHECKOUT_READY' && selectedPlan && (
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center overflow-y-auto py-2">
          <PaymentCheckoutView
            plan={selectedPlan}
            onBack={() => setPurchaseState('PLAN_SELECTED')}
            onPaymentSuccess={handlePaymentSuccess}
            isFemaleEligible={isFemaleEligible}
          />
        </div>
      )}

      {/* STATE: INVOICE READY (Payment Success matching reference media_1788777985572.png) */}
      {purchaseState === 'INVOICE_READY' && selectedPlan && invoiceData && (
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center overflow-y-auto py-4">
          <PaymentSuccessInvoice
            plan={selectedPlan}
            invoiceNumber={invoiceData.invoiceNumber}
            orderId={invoiceData.orderId}
            paymentMethod={invoiceData.paymentMethod}
            amountInr={invoiceData.amountInr}
            paymentDate={invoiceData.paymentDate}
            onClose={() => router.push('/dashboard')}
          />
        </div>
      )}
    </main>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-[100dvh] flex items-center justify-center bg-[#FFF9F3]">
        <div className="w-8 h-8 rounded-full border-2 border-[#8F173D] border-t-transparent animate-spin" />
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}
