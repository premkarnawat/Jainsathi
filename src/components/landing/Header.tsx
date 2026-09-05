'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
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
    { href: '#success-stories', label: 'Success Stories' },
    { href: '#pricing', label: 'Pricing' },
    { href: '/help', label: 'Help' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FFFDF9]/90 backdrop-blur-md shadow-sm border-b border-[#E8D8CE]/80 py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-deepBurgundy to-[#4E0D25] border border-champagneGold/60 flex items-center justify-center shadow-md shadow-deepBurgundy/15 transition-transform group-hover:scale-105">
              <span className="text-champagneGold font-serif italic text-xl font-bold tracking-tight">JS</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold text-deepBurgundy tracking-tight leading-none">
                JainSaathi
              </span>
              <span className="text-[8.5px] uppercase tracking-[0.22em] text-champagneGold font-semibold mt-1">
                FIND YOUR JAIN SAATHI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text/80 hover:text-deepBurgundy transition-colors nav-link-hover py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="bg-white/80 border border-border/80 rounded-full px-3 py-1.5 shadow-sm">
              <LanguageToggle className="text-xs font-semibold text-deepBurgundy" />
            </div>

            <div className="h-5 w-px bg-border mx-1" />

            <Link
              href="/login"
              className="text-sm font-bold text-deepBurgundy hover:text-darkBurgundy transition-colors px-2"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="btn-ruby text-sm px-5 py-2.5 shadow-md shadow-deepBurgundy/20 hover:shadow-lg transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-champagneGold" />
              Create Profile
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-3">
            <div className="bg-white/90 border border-border rounded-full px-2 py-1">
              <LanguageToggle className="text-xs font-semibold text-deepBurgundy" />
            </div>
            <button
              aria-label="Open Navigation Menu"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-white/80 border border-border text-deepBurgundy shadow-sm"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
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
              className="fixed top-0 right-0 w-[85%] max-w-sm h-full bg-[#FFFDF9] shadow-2xl z-50 flex flex-col lg:hidden border-l border-border"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-deepBurgundy flex items-center justify-center">
                    <span className="text-champagneGold font-serif italic text-base font-bold">JS</span>
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
