'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Menu, X } from 'lucide-react';
import LanguageToggle from '@/components/ui/LanguageToggle';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#safety', label: 'Safety' },
    { href: '#success-stories', label: 'Success Stories' },
    { href: '#pricing', label: 'Pricing' },
    { href: '/help', label: 'Help' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-border py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-deepBurgundy">
              <span className="text-white font-serif italic text-xl">JS</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold text-deepBurgundy leading-none">JainSaathi</span>
              <span className="text-[9px] uppercase tracking-widest text-champagneGold font-semibold">Find Your Jain Saathi</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text hover:text-deepBurgundy transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageToggle className="text-muted hover:text-deepBurgundy" />
            
            <button className="p-2 text-muted hover:text-deepBurgundy transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            
            <div className="h-6 w-px bg-border mx-1"></div>

            <Link href="/login" className="text-sm font-semibold text-deepBurgundy hover:text-premiumBurgundy transition-colors px-2">
              Login
            </Link>
            <Link href="/register" className="btn-ruby text-sm px-5 py-2">
              Create Profile
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-3">
            <button className="p-2 text-muted">
              <Bell className="w-5 h-5" />
            </button>
            <button 
              className="p-2 text-text"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
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
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-[80%] max-w-sm h-full bg-surface shadow-2xl z-50 flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <span className="font-serif text-xl font-bold text-deepBurgundy">JainSaathi</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-muted hover:text-text bg-background rounded-full">
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
                      className="text-lg font-medium text-text"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                
                <div className="h-px w-full bg-border"></div>
                
                <div className="flex flex-col gap-4">
                  <Link href="/privacy" className="text-muted hover:text-text" onClick={() => setMobileMenuOpen(false)}>Privacy Policy</Link>
                  <Link href="/terms" className="text-muted hover:text-text" onClick={() => setMobileMenuOpen(false)}>Terms & Conditions</Link>
                </div>

                <div className="mt-auto flex flex-col gap-4 pt-6 border-t border-border">
                  <div className="flex justify-center py-3 rounded-xl border border-border">
                    <LanguageToggle className="text-text font-medium" />
                  </div>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn-gold-outline w-full py-3">
                    Login
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="btn-ruby w-full py-3">
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
