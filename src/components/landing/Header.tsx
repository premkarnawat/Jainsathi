'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Bell, Globe } from 'lucide-react';
import LanguageToggle from '@/components/ui/LanguageToggle';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#why-us', label: 'Why JainSaathi' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#safety', label: 'Safety & Privacy' },
    { href: '#pricing', label: 'Pricing' },
    { href: '/help', label: 'Help' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FFFDFB]/95 backdrop-blur-md shadow-sm border-b border-[#EADBD1] py-2.5'
            : 'bg-[#FFFDFB]/90 backdrop-blur-sm border-b border-[#F0E4DC]/80 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Left Brand Logo (Real Official Logo) */}
          <Link href="/" className="flex items-center gap-2.5 group py-0.5">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 shrink-0 transition-transform group-hover:scale-105">
              <Image
                src="/images/logo.png"
                alt="JainSaathi Official Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold text-deepBurgundy tracking-tight leading-none">
                JainSaathi
              </span>
              <span className="text-[7.5px] uppercase tracking-[0.22em] text-champagneGold font-bold mt-1">
                FIND YOUR JAIN SAATHI
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs sm:text-sm font-medium text-text/80 hover:text-deepBurgundy transition-colors nav-link-hover py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Language Switcher Pill */}
            <div className="flex items-center gap-1 bg-[#FDF7F2] border border-border px-3 py-1.5 rounded-full shadow-sm text-xs font-semibold text-deepBurgundy">
              <Globe className="w-3.5 h-3.5 text-champagneGold" />
              <LanguageToggle className="text-xs font-semibold text-deepBurgundy" />
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              aria-label="Notifications"
              className="w-8 h-8 rounded-full bg-[#FDF7F2] border border-border flex items-center justify-center text-text/70 hover:text-deepBurgundy transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>

            {/* Login Link */}
            <Link
              href="/login"
              className="text-xs sm:text-sm font-bold text-deepBurgundy hover:text-darkBurgundy transition-colors px-2"
            >
              Login
            </Link>

            {/* Create Profile Primary CTA Pill with Arrow */}
            <Link
              href="/register"
              className="btn-ruby text-xs sm:text-sm px-5 py-2.5 shadow-md shadow-deepBurgundy/20 hover:shadow-lg transition-all"
            >
              <span>Create Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2.5">
            <div className="bg-[#FDF7F2] border border-border rounded-full px-2 py-1">
              <LanguageToggle className="text-xs font-semibold text-deepBurgundy" />
            </div>
            <button
              aria-label="Open Navigation Menu"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-white border border-border text-deepBurgundy shadow-sm"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 w-[85%] max-w-sm h-full bg-[#FFFDFB] shadow-2xl z-50 flex flex-col lg:hidden border-l border-border"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-10 h-10 shrink-0">
                    <Image
                      src="/images/logo.png"
                      alt="JainSaathi"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-serif text-xl font-bold text-deepBurgundy">JainSaathi</span>
                </div>
                <button
                  aria-label="Close Navigation Menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-muted hover:text-text bg-background rounded-full border border-border"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-6">
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-base font-semibold text-text hover:text-deepBurgundy transition-colors py-1 border-b border-border/40"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-border">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-gold-outline w-full py-3 text-center font-bold"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-ruby w-full py-3 text-center font-bold shadow-md"
                  >
                    Create Profile
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
