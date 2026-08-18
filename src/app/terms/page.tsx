import React from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-background font-sans text-text">
      <Header />
      <main className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl font-bold text-deepBurgundy mb-8">Terms & Conditions</h1>
        <div className="prose prose-stone max-w-none text-muted">
          <p className="lead text-lg mb-6">Last updated: August 2026</p>
          <h2 className="font-serif text-2xl font-bold text-text mt-8 mb-4">1. Eligibility</h2>
          <p className="mb-4">You must be of legal marriageable age as per the laws of your jurisdiction to register and use JainSaathi.</p>
          <h2 className="font-serif text-2xl font-bold text-text mt-8 mb-4">2. Account Creation & Profile Accuracy</h2>
          <p className="mb-4">All information provided must be accurate, authentic, and intended solely for the purpose of matrimonial matchmaking within the Jain community.</p>
          <h2 className="font-serif text-2xl font-bold text-text mt-8 mb-4">3. Acceptable Use</h2>
          <p className="mb-4">This platform is strictly for matrimonial purposes. Any use of the platform for dating, business networking, or malicious activity will result in immediate account termination.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
