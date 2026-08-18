import React from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Search, Book, MessageCircle, Shield } from 'lucide-react';

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-background font-sans text-text">
      <Header />
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="font-serif text-4xl font-bold text-deepBurgundy mb-6">JainSaathi Help Center</h1>
          <p className="text-lg text-muted">How can we assist you with your matrimonial journey today?</p>
          <div className="mt-8 relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input 
              type="text" 
              placeholder="Search for articles, guides..." 
              className="w-full pl-12 pr-4 py-3 rounded-full border border-border focus:outline-none focus:border-champagneGold focus:ring-1 focus:ring-champagneGold shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-2xl border border-border text-center hover:shadow-lg transition-shadow">
            <Book className="w-10 h-10 text-champagneGold mx-auto mb-4" />
            <h3 className="font-serif font-bold text-xl mb-2">Getting Started</h3>
            <p className="text-muted text-sm mb-4">Learn how to create your profile and set partner preferences.</p>
            <button className="text-deepBurgundy font-semibold text-sm">Read Guides →</button>
          </div>
          
          <div className="bg-white p-8 rounded-2xl border border-border text-center hover:shadow-lg transition-shadow">
            <Shield className="w-10 h-10 text-champagneGold mx-auto mb-4" />
            <h3 className="font-serif font-bold text-xl mb-2">Safety & Privacy</h3>
            <p className="text-muted text-sm mb-4">Understand how we protect your biodata and control visibility.</p>
            <button className="text-deepBurgundy font-semibold text-sm">View Policies →</button>
          </div>
          
          <div className="bg-white p-8 rounded-2xl border border-border text-center hover:shadow-lg transition-shadow">
            <MessageCircle className="w-10 h-10 text-champagneGold mx-auto mb-4" />
            <h3 className="font-serif font-bold text-xl mb-2">Contact Support</h3>
            <p className="text-muted text-sm mb-4">Need personalized assistance? Our support team is here to help.</p>
            <button className="text-deepBurgundy font-semibold text-sm">Contact Us →</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
