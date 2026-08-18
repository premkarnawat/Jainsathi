'use client';

import React from 'react';
import Link from 'next/link';
import LanguageToggle from '@/components/ui/LanguageToggle';

export default function Footer() {
  return (
    <footer className="bg-[#FFF9F4] border-t border-[#E8D8CE] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-deepBurgundy">
                <span className="text-white font-serif italic text-2xl">JS</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-3xl font-bold text-deepBurgundy leading-none">JainSaathi</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-champagneGold font-semibold">Find Your Jain Saathi</span>
              </div>
            </Link>
            <p className="text-muted leading-relaxed max-w-sm mb-8">
              A trusted, privacy-first matrimonial platform designed specifically for Jain individuals, parents, and guardians to build meaningful connections.
            </p>
            
            {/* Language Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-text uppercase tracking-wider">Language:</span>
              <div className="flex bg-white rounded-lg border border-border px-3 py-2">
                <LanguageToggle className="text-deepBurgundy" />
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-serif font-bold text-lg text-text mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="#about" className="text-muted hover:text-deepBurgundy transition-colors">About</Link></li>
              <li><Link href="#how-it-works" className="text-muted hover:text-deepBurgundy transition-colors">How It Works</Link></li>
              <li><Link href="#safety" className="text-muted hover:text-deepBurgundy transition-colors">Safety</Link></li>
              <li><Link href="#pricing" className="text-muted hover:text-deepBurgundy transition-colors">Pricing</Link></li>
              <li><Link href="#success-stories" className="text-muted hover:text-deepBurgundy transition-colors">Success Stories</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-serif font-bold text-lg text-text mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="text-muted hover:text-deepBurgundy transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted hover:text-deepBurgundy transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/refund" className="text-muted hover:text-deepBurgundy transition-colors">Refund Policy</Link></li>
              <li><Link href="/cookies" className="text-muted hover:text-deepBurgundy transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Support & Account */}
          <div>
            <h4 className="font-serif font-bold text-lg text-text mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/help" className="text-muted hover:text-deepBurgundy transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-muted hover:text-deepBurgundy transition-colors">Contact Support</Link></li>
              <li><Link href="/report" className="text-muted hover:text-deepBurgundy transition-colors">Report a Profile</Link></li>
              <li className="pt-4 mt-4 border-t border-border">
                <Link href="/login" className="text-deepBurgundy font-semibold hover:text-premiumBurgundy transition-colors block mb-2">Login</Link>
                <Link href="/register" className="text-deepBurgundy font-semibold hover:text-premiumBurgundy transition-colors block">Create Profile</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted text-center md:text-left">
            © {new Date().getFullYear()} JainSaathi. Made for meaningful Jain connections.
          </p>
          <div className="flex items-center gap-4 opacity-50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C12 22 19 16 19 9C19 5.5 16.5 3 12 3C7.5 3 5 5.5 5 9C5 16 12 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 14.5C9 14.5 9 9 12 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 14.5C15 14.5 15 9 12 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
