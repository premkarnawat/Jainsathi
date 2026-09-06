'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, Users, CreditCard, ShieldCheck, 
  Settings, LogOut, Search, Bell, Menu, X, Receipt, Activity,
  Sun, Moon, ChevronRight, UserCheck, Shield
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email?: string; role?: string }>({
    email: 'admin@jainsaathi.com',
    role: 'super_admin'
  });
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    async function loadAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: dbUser } = await supabase
          .from('users')
          .select('email, role')
          .eq('auth_id', user.id)
          .single();
        if (dbUser) {
          setAdminUser({
            email: dbUser.email || user.email || 'admin@jainsaathi.com',
            role: dbUser.role || 'super_admin'
          });
        }
      }
    }
    loadAdmin();
  }, []);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Manage Candidates', href: '/admin/users', icon: Users },
    { name: 'Verifications', href: '/admin/verifications', icon: ShieldCheck },
    { name: 'Revenue', href: '/admin/revenue', icon: Receipt },
    { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
    { name: 'Activity & Logs', href: '/admin/logs', icon: Activity },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#111114] text-[#E8E6E3] p-2 sm:p-3 md:p-4 font-sans flex items-center justify-center">
      {/* Outer App Frame matching PBD design */}
      <div className="w-full max-w-[1720px] h-[calc(100vh-1rem)] sm:h-[calc(100vh-1.5rem)] md:h-[calc(100vh-2rem)] bg-[#141417] rounded-[28px] sm:rounded-[36px] p-2 sm:p-3 md:p-3.5 flex overflow-hidden shadow-2xl border border-white/5 relative">
        
        {/* Mobile Backdrop */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 bg-black/75 z-40 md:hidden backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileOpen(false)} 
          />
        )}

        {/* LEFT SIDEBAR - PBD Style */}
        <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 md:w-60 lg:w-64 bg-[#16161A] md:bg-transparent rounded-[24px] md:rounded-none flex flex-col justify-between p-4 md:p-3 transition-transform duration-300 ease-in-out border-r md:border-r-0 border-white/5 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}>
          {/* Brand Logo */}
          <div>
            <div className="flex items-center justify-between px-2 pt-2 pb-6">
              <Link href="/admin" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#C59A4E] to-[#9C752B] flex items-center justify-center shadow-lg shadow-[#C59A4E]/25 group-hover:scale-105 transition-transform">
                  <span className="font-serif font-black text-xl text-[#121214]">JS</span>
                </div>
                <div>
                  <span className="font-serif font-bold text-lg text-white tracking-wide block leading-tight">
                    JainSaathi
                  </span>
                  <span className="text-[10px] tracking-widest uppercase font-semibold text-[#D4AF37]/90 block">
                    Administration
                  </span>
                </div>
              </Link>
              <button 
                className="md:hidden text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10" 
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1.5 mt-2">
              {navItems.map((item) => {
                const isActive = item.href === '/admin' 
                  ? pathname === '/admin'
                  : pathname === item.href || pathname.startsWith(item.href + '/');

                return (
                  <Link 
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                      isActive 
                        ? 'bg-[#C59A4E] text-[#121214] shadow-lg shadow-[#C59A4E]/25 font-bold scale-[1.02]' 
                        : 'text-white/65 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-[#121214]' : 'text-white/60'}`} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#121214]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar: Admin Profile & Light/Dark Switcher */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            {/* Admin Profile Card */}
            <div className="bg-[#1C1C22] border border-white/10 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-[#2D2A26] border border-[#D4AF37]/40 flex items-center justify-center font-bold text-xs text-[#D4AF37] uppercase">
                    {adminUser.email?.[0] || 'A'}
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#1C1C22] absolute -bottom-0.5 -right-0.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate leading-tight">
                    {adminUser.email?.split('@')[0] || 'Admin'}
                  </p>
                  <p className="text-[10px] font-semibold text-[#D4AF37] tracking-wider uppercase mt-0.5">
                    {adminUser.role?.replace('_', ' ') || 'Super Admin'}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Light / Dark Mode Toggle from PBD design */}
            <div className="bg-[#1A1A1F] border border-white/5 rounded-xl p-1 flex items-center justify-between text-xs font-semibold">
              <button 
                onClick={() => setThemeMode('light')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
                  themeMode === 'light' ? 'bg-[#C59A4E] text-[#121214] font-bold shadow-sm' : 'text-white/40 hover:text-white/70'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
              <button 
                onClick={() => setThemeMode('dark')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
                  themeMode === 'dark' ? 'bg-[#2A2A32] text-white font-bold shadow-sm' : 'text-white/40 hover:text-white/70'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN APPLICATION CONTAINER (White/Cream Rounded Center Canvas) */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FFFDFB] rounded-[24px] sm:rounded-[30px] overflow-hidden ml-0 md:ml-2 shadow-xl relative text-[#1E1B24]">
          
          {/* Top Mobile Bar */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-150 bg-white">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-[#8F0038]">JainSaathi</span>
              <span className="bg-[#C59A4E] text-[#121214] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Admin</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Main Scrollable Canvas */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
}
