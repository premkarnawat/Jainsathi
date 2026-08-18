'use client';

import React from 'react';
import Link from 'next/link';
import LanguageToggle from '@/components/ui/LanguageToggle';

export default function Footer() {
  return (
    <footer className="bg-[#FFF9F4] border-t border-[#E8D8CE] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-deepBurgundy to-[#4E0D25] border border-champagneGold/60 flex items-center justify-center shadow-md">
                <span className="text-champagneGold font-serif italic text-2xl font-bold">JS</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-3xl font-bold text-deepBurgundy leading-none">
                  JainSaathi
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-champagneGold font-semibold mt-1">
                  Find Your Jain Saathi
                </span>
              </div>
            </Link>
            
            <p className="text-muted leading-relaxed max-w-sm mb-8 text-sm">
              A trusted, privacy-first matrimonial platform designed specifically for Jain individuals, parents, and guardians to discover compatible lifelong connections.
            </p>
            
            {/* Language Selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-text uppercase tracking-wider">
                Language:
              </span>
              <div className="bg-white rounded-full border border-border px-3.5 py-1.5 shadow-sm">
                <LanguageToggle className="text-xs font-semibold text-deepBurgundy" />
              </div>
            </div>
          </div>

          {/* Column 1: Platform */}
          <div>
            <h4 className="font-serif font-bold text-base text-text mb-5">
              Platform
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#how-it-works" className="text-muted hover:text-deepBurgundy transition-colors">How It Works</Link></li>
              <li><Link href="#why-us" className="text-muted hover:text-deepBurgundy transition-colors">Why JainSaathi</Link></li>
              <li><Link href="#pricing" className="text-muted hover:text-deepBurgundy transition-colors">Pricing Plans</Link></li>
              <li><Link href="#safety" className="text-muted hover:text-deepBurgundy transition-colors">Safety & Privacy</Link></li>
            </ul>
          </div>

          {/* Column 2: Company & Stories */}
          <div>
            <h4 className="font-serif font-bold text-base text-text mb-5">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#home" className="text-muted hover:text-deepBurgundy transition-colors">About Us</Link></li>
              <li><Link href="#success-stories" className="text-muted hover:text-deepBurgundy transition-colors">Success Stories</Link></li>
              <li><Link href="/help" className="text-muted hover:text-deepBurgundy transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal & Support */}
          <div>
            <h4 className="font-serif font-bold text-base text-text mb-5">
              Legal & Support
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="text-muted hover:text-deepBurgundy transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted hover:text-deepBurgundy transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/help" className="text-muted hover:text-deepBurgundy transition-colors">Help Center</Link></li>
              <li className="pt-3">
                <Link href="/login" className="text-deepBurgundy font-bold hover:underline block mb-1">
                  Member Login →
                </Link>
                <Link href="/register" className="text-deepBurgundy font-bold hover:underline block">
                  Create Profile →
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted text-center md:text-left">
            © {new Date().getFullYear()} JainSaathi. All rights reserved. Built with reverence for the Jain community.
          </p>
          <div className="flex items-center gap-2 text-xs font-semibold text-champagneGold">
            <span>Ahimsa • Satya • Asteya • Brahmacharya • Aparigraha</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
