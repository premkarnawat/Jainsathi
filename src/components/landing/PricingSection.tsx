'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, X, Sparkles, ShieldCheck, Heart } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    duration: 'Basic Membership',
    popular: false,
    features: [
      { text: 'Create & manage verified profile', included: true },
      { text: 'Browse Jain community recommendations', included: true },
      { text: 'Receive incoming interests', included: true },
      { text: 'View summary profiles', included: true },
      { text: 'Direct contact phone reveal', included: false },
      { text: 'Download 4-Gotra PDF biodata', included: false },
    ],
  },
  {
    name: 'Pro',
    price: '₹2,499',
    duration: '3 Months Access',
    popular: true,
    features: [
      { text: 'All Free tier features', included: true },
      { text: 'Send up to 50 Direct Interests', included: true },
      { text: 'Reveal up to 20 Verified Contacts', included: true },
      { text: 'Download full digital biodatas', included: true },
      { text: 'Priority matchmaking badge', included: true },
      { text: 'Dedicated support assistance', included: false },
    ],
  },
  {
    name: 'Super',
    price: '₹4,499',
    duration: '6 Months Access',
    popular: false,
    features: [
      { text: 'All Pro tier features', included: true },
      { text: 'Send up to 120 Direct Interests', included: true },
      { text: 'Reveal up to 50 Verified Contacts', included: true },
      { text: 'Unlimited digital biodata downloads', included: true },
      { text: 'Enhanced profile discovery spotlight', included: true },
      { text: 'Personal relationship advisor', included: false },
    ],
  },
  {
    name: 'Deluxe',
    price: '₹7,999',
    duration: '12 Months Access',
    popular: false,
    features: [
      { text: 'All Super tier features', included: true },
      { text: 'Unlimited Direct Interests', included: true },
      { text: 'Reveal up to 100 Verified Contacts', included: true },
      { text: 'Featured Top-of-Search placement', included: true },
      { text: 'VIP Horoscope & Lineage match advisor', included: true },
      { text: 'Family consultation assistance', included: true },
    ],
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-[#FFFDF9] relative border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-champagneGold/15 border border-champagneGold/40 text-deepBurgundy text-xs font-bold uppercase tracking-widest mb-4">
              Transparent Pricing
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-text mb-4">
              Simple, Honest <br />
              <span className="text-deepBurgundy italic font-normal">Membership Plans</span>
            </h2>
            <p className="text-base sm:text-lg text-muted">
              Choose the plan that suits your timeline. No hidden renewals, no artificial locks.
            </p>
          </motion.div>
        </div>

        {/* Special Female / Bride Offer Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-16 bg-gradient-to-r from-softRose via-white to-softRose border-2 border-champagneGold/50 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-deepBurgundy text-champagneGold flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-block text-[10px] font-bold uppercase tracking-wider text-deepBurgundy bg-white px-2.5 py-0.5 rounded-full mb-1 border border-champagneGold/30">
                Special Community Initiative
              </div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-deepBurgundy">
                Eligible Bride Profiles — Free for 1 Year
              </h3>
              <p className="text-xs sm:text-sm text-muted">
                To support families, verified candidate profiles for Jain brides receive complimentary access upon admin verification.
              </p>
            </div>
          </div>

          <Link
            href="/register"
            className="btn-ruby shrink-0 text-xs sm:text-sm px-6 py-3 shadow-md"
          >
            Check Eligibility
          </Link>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all ${
                plan.popular
                  ? 'bg-deepBurgundy text-white shadow-2xl shadow-deepBurgundy/25 border-2 border-champagneGold scale-[1.03] z-10'
                  : 'bg-white text-text border border-border hover:shadow-xl hover:border-champagneGold/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-champagneGold text-deepBurgundy text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
                  Most Recommended
                </div>
              )}

              <div>
                <div className="mb-6">
                  <h4 className={`font-serif font-bold text-2xl mb-1 ${plan.popular ? 'text-white' : 'text-text'}`}>
                    {plan.name}
                  </h4>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl sm:text-4xl font-bold font-serif ${plan.popular ? 'text-champagneGold' : 'text-deepBurgundy'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-xs font-semibold ${plan.popular ? 'text-white/70' : 'text-muted'}`}>
                      / {plan.duration}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-8 pt-4 border-t border-border/40">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs">
                      {feat.included ? (
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? 'text-champagneGold' : 'text-success'}`} />
                      ) : (
                        <X className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? 'text-white/30' : 'text-border'}`} />
                      )}
                      <span className={plan.popular ? (feat.included ? 'text-white/90' : 'text-white/40') : (feat.included ? 'text-text' : 'text-muted/60')}>
                        {feat.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/register"
                className={`w-full py-3 rounded-full text-center text-xs font-bold transition-all ${
                  plan.popular
                    ? 'bg-champagneGold text-deepBurgundy hover:bg-white shadow-md'
                    : 'bg-secondary text-deepBurgundy border border-border hover:bg-deepBurgundy hover:text-white'
                }`}
              >
                Choose {plan.name}
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
