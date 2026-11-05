'use client';

import React, { useState } from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Search, Book, MessageCircle, Shield, ChevronDown, ChevronUp, CheckCircle2, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
  category: 'account' | 'privacy' | 'membership' | 'matching';
}

const FAQS: FAQItem[] = [
  {
    category: 'account',
    question: 'How does profile verification work on JainSaathi?',
    answer: 'Every candidate submits a live selfie and a government photo ID (such as Aadhaar or Passport). Our dedicated admin compliance team compares the live facial capture with the ID document to grant the Gold Verified Badge.',
  },
  {
    category: 'privacy',
    question: 'Who can see my phone number and full biodata?',
    answer: 'Your phone number and complete biodata PDF are strictly locked by default. They are only revealed to verified candidates after an interest request has been mutually accepted by both parties.',
  },
  {
    category: 'membership',
    question: 'What are the benefits of upgraded membership tiers?',
    answer: 'While basic search and receiving interests are free, Pro, Super, and Deluxe tiers grant additional contact reveals, priority candidate ranking, featured profile spotlights, and dedicated relationship manager support.',
  },
  {
    category: 'matching',
    question: 'Can I filter matches by specific Jain sub-sects?',
    answer: 'Yes! JainSaathi supports granular community filtering across Shwetambar (Deravasi, Murtipujak), Digambar (Bispanthi, Terapanthi), Sthanakvasi, and Terapanthi, as well as Gotra/Saka matching.',
  },
  {
    category: 'privacy',
    question: 'Can I delete or pause my matrimonial account at any time?',
    answer: 'Yes. You have complete autonomy over your profile. In your Settings dashboard, you can toggle your profile to hidden/paused or permanently delete your account and associated records.',
  },
  {
    category: 'account',
    question: 'How long does the verification review take?',
    answer: 'Most profiles are verified within 2 to 4 business hours. You will receive an instant notification on your dashboard once your verification badge is active.',
  },
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFaqs = FAQS.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const term = searchQuery.toLowerCase().trim();
    const matchesSearch = !term || faq.question.toLowerCase().includes(term) || faq.answer.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FFFDFB] font-sans text-[#24131D] flex flex-col justify-between">
      <Header />

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8F173D]/10 text-[#8F173D] text-[11px] font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#8F173D]" />
            <span>Support & Documentation</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-[#8F173D] tracking-tight mb-4">
            How can we help you?
          </h1>
          <p className="text-sm sm:text-base text-[#705662]">
            Search our knowledge base for answers regarding registration, verification, biodata security, and membership plans.
          </p>

          <div className="mt-8 relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help topics (e.g., verification, privacy, plans)..." 
              className="w-full pl-11 pr-4 py-3 rounded-full border border-[#EADFCB] bg-white text-xs sm:text-sm shadow-xs outline-none focus:border-[#8F173D] focus:ring-1 focus:ring-[#8F173D]"
            />
          </div>
        </div>

        {/* Quick Nav Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          <div className="bg-white p-7 rounded-3xl border border-[#EADFCB] text-center shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#C59A4E]/15 text-[#9E6F18] flex items-center justify-center mx-auto mb-4">
                <Book className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#24131D] mb-2">Getting Started</h3>
              <p className="text-xs text-[#705662] mb-5 leading-relaxed">
                Step-by-step guidance on creating a verified profile, setting preferences, and uploading biodata.
              </p>
            </div>
            <Link 
              href="/register" 
              className="text-[#8F173D] hover:underline font-bold text-xs inline-flex items-center justify-center gap-1"
            >
              Start Profile Wizard →
            </Link>
          </div>
          
          <div className="bg-white p-7 rounded-3xl border border-[#EADFCB] text-center shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#8F173D]/10 text-[#8F173D] flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#24131D] mb-2">Safety & Privacy</h3>
              <p className="text-xs text-[#705662] mb-5 leading-relaxed">
                Learn how your personal details, phone numbers, and photos are protected with mutual consent locks.
              </p>
            </div>
            <Link 
              href="/privacy" 
              className="text-[#8F173D] hover:underline font-bold text-xs inline-flex items-center justify-center gap-1"
            >
              Read Privacy Policies →
            </Link>
          </div>
          
          <div className="bg-white p-7 rounded-3xl border border-[#EADFCB] text-center shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#24131D] mb-2">Contact Support</h3>
              <p className="text-xs text-[#705662] mb-5 leading-relaxed">
                Need direct help or have a question? Our member relationship team is available Mon-Sat 9AM-7PM IST.
              </p>
            </div>
            <Link 
              href="/contact" 
              className="text-[#8F173D] hover:underline font-bold text-xs inline-flex items-center justify-center gap-1"
            >
              Raise Support Ticket →
            </Link>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#8F173D]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-[#705662] mt-1">
              Find quick answers to common queries from Jain families.
            </p>

            {/* Category Pills */}
            <div className="flex justify-center gap-2 mt-4 flex-wrap">
              {[
                { id: 'all', label: 'All FAQs' },
                { id: 'account', label: 'Verification & Account' },
                { id: 'privacy', label: 'Privacy & Security' },
                { id: 'membership', label: 'Plans & Pricing' },
                { id: 'matching', label: 'Matchmaking' },
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#8F173D] text-white shadow-xs'
                      : 'bg-white border border-[#EADFCB] text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-[#EADFCB] overflow-hidden shadow-xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/60 transition-colors"
                  >
                    <span className="font-bold text-xs sm:text-sm text-[#24131D]">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#8F173D] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-[#5C4D56] leading-relaxed border-t border-gray-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#EADFCB]">
              <p className="text-xs text-gray-500">No matching questions found.</p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-2 text-xs font-bold text-[#8F173D] hover:underline"
              >
                Clear search filter
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
