import React from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background font-sans text-text">
      <Header />
      <main className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl font-bold text-deepBurgundy mb-8">Privacy Policy</h1>
        <div className="prose prose-stone max-w-none text-muted">
          <p className="lead text-lg mb-6">Last updated: August 2026</p>
          <h2 className="font-serif text-2xl font-bold text-text mt-8 mb-4">1. Information Collected</h2>
          <p className="mb-4">At JainSaathi, we collect information you provide directly, including name, contact details, profile information, and photos for the purpose of matrimonial matching.</p>
          <h2 className="font-serif text-2xl font-bold text-text mt-8 mb-4">2. How Information is Used</h2>
          <p className="mb-4">We use your information exclusively to provide matchmaking services, verify identities, and ensure the safety of our platform.</p>
          <h2 className="font-serif text-2xl font-bold text-text mt-8 mb-4">3. Data Security & Privacy Controls</h2>
          <p className="mb-4">You retain full control over your privacy settings. Sensitive information like your Biodata PDF and Phone Number are restricted and only shared upon your mutual consent.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
