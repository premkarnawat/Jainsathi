'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Youtube, Globe } from 'lucide-react';
import LanguageToggle from '@/components/ui/LanguageToggle';

export default function Footer() {
  return (
    <footer className="bg-[#24040E] text-white pt-20 pb-12 border-t border-[#3D0A1A] relative overflow-hidden">
      
      {/* Decorative Gold Lotus Watermark Outline on Far Right (Exact to image) */}
      <div className="absolute right-6 bottom-16 opacity-15 pointer-events-none select-none hidden lg:block">
        <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 25 C70 65, 30 110, 45 150 C60 185, 140 185, 155 150 C170 110, 130 65, 100 25 Z" stroke="#D4A64A" strokeWidth="2" />
          <path d="M100 35 C50 70, 10 115, 25 155 C40 190, 85 190, 100 170 C115 190, 160 190, 175 155 C190 115, 150 70, 100 35 Z" stroke="#D4A64A" strokeWidth="2" />
          <path d="M100 80 C60 85, 15 110, 10 145 C5 175, 55 185, 80 170 C95 160, 100 130, 100 80 Z" stroke="#D4A64A" strokeWidth="2" />
          <path d="M100 80 C140 85, 185 110, 190 145 C195 175, 145 185, 120 170 C105 160, 100 130, 100 80 Z" stroke="#D4A64A" strokeWidth="2" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-white/10">
          
          {/* Brand Info (Col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-deepBurgundy border border-champagneGold flex items-center justify-center">
                <span className="text-champagneGold font-serif italic text-lg font-bold">JS</span>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-white tracking-tight leading-none block">
                  JainSaathi
                </span>
                <span className="text-[7.5px] uppercase tracking-[0.2em] text-champagneGold font-semibold">
                  FIND YOUR JAIN SAATHI
                </span>
              </div>
            </Link>

            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              A modern matrimony platform for the Jain community. Built on trust, values and meaningful connections.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full bg-white/10 hover:bg-champagneGold hover:text-deepBurgundy flex items-center justify-center text-white/80 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full bg-white/10 hover:bg-champagneGold hover:text-deepBurgundy flex items-center justify-center text-white/80 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-full bg-white/10 hover:bg-champagneGold hover:text-deepBurgundy flex items-center justify-center text-white/80 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" aria-label="YouTube" className="w-8 h-8 rounded-full bg-white/10 hover:bg-champagneGold hover:text-deepBurgundy flex items-center justify-center text-white/80 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platforms (Col 5-6) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-sm text-white tracking-wide">
              Platforms
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li><Link href="#home" className="hover:text-champagneGold transition-colors">Home</Link></li>
              <li><Link href="#why-us" className="hover:text-champagneGold transition-colors">Why JainSaathi</Link></li>
              <li><Link href="#how-it-works" className="hover:text-champagneGold transition-colors">How It Works</Link></li>
              <li><Link href="#safety" className="hover:text-champagneGold transition-colors">Safety & Privacy</Link></li>
              <li><Link href="#pricing" className="hover:text-champagneGold transition-colors">Pricing</Link></li>
              <li><Link href="/help" className="hover:text-champagneGold transition-colors">Help</Link></li>
            </ul>
          </div>

          {/* Company (Col 7-8) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-sm text-white tracking-wide">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li><Link href="/about" className="hover:text-champagneGold transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-champagneGold transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-champagneGold transition-colors">Contact Us</Link></li>
              <li><Link href="/help" className="hover:text-champagneGold transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Legal (Col 9-10) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-sm text-white tracking-wide">
              Legal
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li><Link href="/privacy" className="hover:text-champagneGold transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-champagneGold transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/refund" className="hover:text-champagneGold transition-colors">Refund Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-champagneGold transition-colors">Cookie Policy</Link></li>
              <li><Link href="/guidelines" className="hover:text-champagneGold transition-colors">Community Guidelines</Link></li>
            </ul>
          </div>

          {/* Language (Col 11-12) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-sm text-white tracking-wide">
              Language
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-white/80 bg-white/10 p-2.5 rounded-xl border border-white/15">
              <Globe className="w-3.5 h-3.5 text-champagneGold" />
              <LanguageToggle className="text-xs font-semibold text-white" />
            </div>
          </div>

        </div>

        {/* Bottom Bar (Exact to image) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/60 gap-4">
          <div>
            © 2024 JainSaathi. All rights reserved.
          </div>
          <div className="font-serif italic text-champagneGold">
            Jain Values. Modern Connections.
          </div>
        </div>

      </div>
    </footer>
  );
}
