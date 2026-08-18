'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    duration: 'Basic Access',
    popular: false,
    features: [
      { text: 'Create detailed profile', included: true },
      { text: 'Basic matching', included: true },
      { text: 'Receive interests', included: true },
      { text: 'View full biodata', included: false },
      { text: 'Reveal contact details', included: false },
    ]
  },
  {
    name: 'Pro',
    price: '₹2,499',
    duration: '3 Months',
    popular: true,
    features: [
      { text: 'Create detailed profile', included: true },
      { text: 'Advanced matching', included: true },
      { text: 'Send up to 50 interests', included: true },
      { text: 'View full biodata', included: true },
      { text: 'Reveal up to 20 contacts', included: true },
    ]
  },
  {
    name: 'Super',
    price: '₹4,499',
    duration: '6 Months',
    popular: false,
    features: [
      { text: 'Create detailed profile', included: true },
      { text: 'Advanced matching', included: true },
      { text: 'Send up to 120 interests', included: true },
      { text: 'View full biodata', included: true },
      { text: 'Reveal up to 50 contacts', included: true },
    ]
  },
  {
    name: 'Deluxe',
    price: '₹7,999',
    duration: '12 Months',
    popular: false,
    features: [
      { text: 'Create detailed profile', included: true },
      { text: 'Priority matching', included: true },
      { text: 'Unlimited interests', included: true },
      { text: 'View full biodata', included: true },
      { text: 'Reveal up to 100 contacts', included: true },
    ]
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-background border-t border-border relative overflow-hidden">
      
      {/* Decorative background */}
      <div className="absolute top-0 w-full h-[400px] bg-gradient-to-b from-secondary to-background pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl font-bold text-text mb-6">
              Clear. Transparent. <br />
              <span className="italic text-deepBurgundy font-normal">No Hidden Surprises.</span>
            </h2>
            <p className="text-lg text-muted mb-8">
              Choose a plan that fits your journey. Our pricing is transparent and designed to help you find meaningful connections without deceptive limits.
            </p>

            {/* Special Callout */}
            <div className="inline-flex items-center gap-3 bg-white border border-champagneGold/50 rounded-full py-2 px-6 shadow-sm">
              <Sparkles className="w-5 h-5 text-champagneGold" />
              <span className="text-sm font-semibold text-deepBurgundy">Women Join Free</span>
              <span className="text-sm text-muted">— Eligible bride profiles can enjoy JainSaathi access for 1 year.</span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-3xl p-8 flex flex-col ${
                plan.popular 
                  ? 'bg-deepBurgundy text-white shadow-2xl scale-105 border border-deepBurgundy z-10' 
                  : 'bg-white border border-border hover:shadow-xl transition-shadow'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-champagneGold text-deepBurgundy text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-md">
                  Most Recommended
                </div>
              )}
              
              <div className="mb-8">
                <h3 className={`font-serif text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-text'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-text'}`}>{plan.price}</span>
                  <span className={`text-sm font-medium ${plan.popular ? 'text-white/70' : 'text-muted'}`}>/ {plan.duration}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-champagneGold' : 'text-success'}`} />
                    ) : (
                      <X className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-white/30' : 'text-border'}`} />
                    )}
                    <span className={`text-sm ${
                      plan.popular 
                        ? (feature.included ? 'text-white' : 'text-white/50')
                        : (feature.included ? 'text-text' : 'text-muted')
                    }`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 rounded-full font-semibold transition-colors ${
                plan.popular
                  ? 'bg-champagneGold text-deepBurgundy hover:bg-white'
                  : 'bg-secondary text-deepBurgundy border border-border hover:bg-deepBurgundy hover:text-white'
              }`}>
                Choose Plan
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
