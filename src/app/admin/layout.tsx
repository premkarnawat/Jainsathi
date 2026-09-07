'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, Users, CreditCard, ShieldCheck, 
  Settings, LogOut, Menu, X, Receipt, Activity,
  Sun, Moon, ChevronLeft, MessageSquare
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
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  // Load theme and session on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('js_admin_theme') as 'light' | 'dark' | null;
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setThemeMode(savedTheme);
    }

    async function loadAdmin() {
      try {
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
      } catch (_) {
        // Safe fallback
      }
    }
    loadAdmin();
  }, []);

  const handleToggleTheme = (mode: 'light' | 'dark') => {
    setThemeMode(mode);
    localStorage.setItem('js_admin_theme', mode);
  };

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
    { name: 'Support Tickets', href: '/admin/support', icon: MessageSquare },
    { name: 'Revenue', href: '/admin/revenue', icon: Receipt },
    { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
    { name: 'Settings & CMS', href: '/admin/settings', icon: Settings },
    { name: 'Activity & Logs', href: '/admin/logs', icon: Activity },
  ];

  const isDark = themeMode === 'dark';

  return (
    <div className={`min-h-screen font-sans p-0 sm:p-2.5 md:p-4 flex items-center justify-center transition-colors duration-300 ${
      isDark ? 'bg-[#0B0B0E] text-[#E8E6E3]' : 'bg-[#F4F0EA] text-[#241B20]'
    }`}>
      <style>{`
        /* Global Admin Clean Typography */
        .admin-root .text-xs { font-size: 0.85rem; line-height: 1.3rem; }
        .admin-root .text-\\[10px\\] { font-size: 0.75rem; }
        .admin-root .text-sm { font-size: 0.95rem; }

        /* Dark / Light Global Variables for internal components */
        .admin-canvas.theme-dark {
          background-color: #15151A !important;
          color: #F3F4F6 !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        .admin-canvas.theme-dark .bg-white,
        .admin-canvas.theme-dark .bg-\\[\\#FFFDFB\\] {
          background-color: #1C1C23 !important;
          color: #F3F4F6 !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        .admin-canvas.theme-dark .bg-gray-50,
        .admin-canvas.theme-dark .bg-gray-100 {
          background-color: #23232C !important;
          color: #E5E7EB !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        .admin-canvas.theme-dark .text-gray-800,
        .admin-canvas.theme-dark .text-gray-700,
        .admin-canvas.theme-dark .text-\\[\\#1A1822\\],
        .admin-canvas.theme-dark .text-\\[\\#19191D\\] {
          color: #F9FAFB !important;
        }
        .admin-canvas.theme-dark .text-gray-500,
        .admin-canvas.theme-dark .text-gray-400 {
          color: #9CA3AF !important;
        }
        .admin-canvas.theme-dark .border-gray-100,
        .admin-canvas.theme-dark .border-gray-150,
        .admin-canvas.theme-dark .border-gray-200 {
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        .admin-canvas.theme-dark input,
        .admin-canvas.theme-dark textarea,
        .admin-canvas.theme-dark select {
          background-color: #1E1E26 !important;
          color: #FFFFFF !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
        }

        /* Light Mode Tuning */
        .admin-canvas.theme-light {
          background-color: #FFFFFF !important;
          color: #1F141B !important;
          border-color: #E2DDD5 !important;
        }
        .admin-canvas.theme-light input,
        .admin-canvas.theme-light textarea,
        .admin-canvas.theme-light select {
          background-color: #FBF9F5 !important;
          color: #1F141B !important;
          border-color: #DDD5C9 !important;
        }
      `}</style>

      {/* Main Container Frame */}
      <div className={`w-full max-w-[1720px] h-[100dvh] sm:h-[calc(100vh-1rem)] md:h-[calc(100vh-1.5rem)] rounded-none sm:rounded-[28px] md:rounded-[34px] p-0 sm:p-2.5 md:p-3 flex overflow-hidden shadow-2xl transition-colors duration-300 border ${
        isDark 
          ? 'bg-[#121216] border-white/5' 
          : 'bg-[#EDE8E0] border-[#DDD5C9]'
      } relative admin-root`}>
        
        {/* Mobile Sidebar Backdrop */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-xs transition-opacity" 
            onClick={() => setIsMobileOpen(false)} 
          />
        )}

        {/* ============================================================
            SIDEBAR (Desktop Fixed + Mobile Slide-Out Drawer)
            ============================================================ */}
        <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 md:w-56 lg:w-64 flex flex-col justify-between p-4 md:p-3 transition-transform duration-300 ease-in-out border-r md:border-r-0 ${
          isDark 
            ? 'bg-[#16161C] md:bg-transparent border-white/5' 
            : 'bg-[#FAF7F2] md:bg-transparent border-[#DDD5C9]'
        } ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}>
          {/* Brand Logo & Mobile Close */}
          <div>
            <div className="flex items-center justify-between px-2 pt-1 pb-5">
              <Link href="/admin" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#C59A4E] to-[#8F173D] flex items-center justify-center shadow-md shadow-[#C59A4E]/20 group-hover:scale-105 transition-transform">
                  <span className="font-serif font-black text-lg text-white">JS</span>
                </div>
                <div>
                  <span className={`font-serif font-bold text-base tracking-tight block leading-tight ${isDark ? 'text-white' : 'text-[#8F173D]'}`}>
                    JainSaathi
                  </span>
                  <span className="text-[9px] tracking-widest uppercase font-bold text-[#D4AF37] block">
                    Admin Portal
                  </span>
                </div>
              </Link>
              <button 
                type="button"
                aria-label="Close sidebar"
                className={`md:hidden p-1.5 rounded-lg transition-colors ${isDark ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-black hover:bg-black/5'}`} 
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Menu Links */}
            <nav className="space-y-1 mt-1 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
              {navItems.map((item) => {
                const isActive = item.href === '/admin' 
                  ? pathname === '/admin'
                  : pathname === item.href || pathname.startsWith(item.href + '/');

                let activeClasses = '';
                let inactiveClasses = '';

                if (isDark) {
                  activeClasses = 'bg-[#C59A4E] text-[#121214] shadow-md shadow-[#C59A4E]/20 font-bold scale-[1.01]';
                  inactiveClasses = 'text-white/65 hover:text-white hover:bg-white/[0.06]';
                } else {
                  activeClasses = 'bg-[#8F173D] text-white shadow-sm font-bold scale-[1.01]';
                  inactiveClasses = 'text-[#5C4D56] hover:text-[#1F141B] hover:bg-black/[0.04]';
                }

                return (
                  <Link 
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive ? activeClasses : inactiveClasses
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 ${isActive ? (isDark ? 'text-[#121214]' : 'text-white') : (isDark ? 'text-white/60' : 'text-[#8F173D]/80')}`} />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {isActive && (
                      <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#121214]' : 'bg-[#D4AF37]'}`} />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar: Admin Profile & Light/Dark Switcher */}
          <div className={`space-y-2.5 pt-3 border-t ${isDark ? 'border-white/5' : 'border-[#DDD5C9]'}`}>
            {/* Admin Profile Card */}
            <div className={`rounded-xl p-2.5 flex items-center justify-between border ${
              isDark ? 'bg-[#1C1C24] border-white/5' : 'bg-[#FAF7F2] border-[#DDD5C9]'
            }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative">
                  <div className="w-8 h-8 rounded-lg bg-[#8F173D] border border-[#D4AF37]/50 flex items-center justify-center font-bold text-xs text-white uppercase">
                    {adminUser.email?.[0] || 'A'}
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 border-2 border-[#1C1C24] absolute -bottom-0.5 -right-0.5" />
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-bold truncate leading-tight ${isDark ? 'text-white' : 'text-[#1F141B]'}`}>
                    {adminUser.email?.split('@')[0] || 'Admin'}
                  </p>
                  <p className="text-[9px] font-bold text-[#D4AF37] tracking-wider uppercase mt-0.5 truncate">
                    {adminUser.role?.replace('_', ' ') || 'Super Admin'}
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={handleLogout}
                title="Sign Out"
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark ? 'text-white/50 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Persistent Light / Dark Mode Toggle */}
            <div className={`rounded-xl p-1 flex items-center justify-between text-xs font-semibold border ${
              isDark ? 'bg-[#191920] border-white/5' : 'bg-[#E5DFD5] border-[#D4CABE]'
            }`}>
              <button 
                type="button"
                onClick={() => handleToggleTheme('light')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all text-xs ${
                  !isDark 
                    ? 'bg-white text-[#8F173D] font-bold shadow-xs' 
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
              <button 
                type="button"
                onClick={() => handleToggleTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all text-xs ${
                  isDark 
                    ? 'bg-[#282834] text-white font-bold shadow-xs' 
                    : 'text-[#695A64] hover:text-black'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ============================================================
            MAIN APPLICATION CANVAS
            ============================================================ */}
        <div className={`flex-1 flex flex-col min-w-0 rounded-none sm:rounded-[22px] md:rounded-[28px] overflow-hidden ml-0 md:ml-2 shadow-sm relative transition-colors duration-300 border ${
          isDark 
            ? 'bg-[#16161B] border-white/5' 
            : 'bg-[#FFFDFB] border-[#DDD5C9]'
        } admin-canvas ${isDark ? 'theme-dark' : 'theme-light'}`}>
          
          {/* Top Mobile Bar (Visible on mobile) */}
          <div className={`md:hidden flex items-center justify-between px-4 py-3 border-b ${
            isDark ? 'bg-[#1A1A22] border-white/5' : 'bg-white border-gray-200'
          }`}>
            <button 
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className={`p-2 rounded-xl transition-colors ${
                isDark ? 'bg-[#252530] text-white hover:bg-[#30303E]' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <span className={`font-serif font-bold text-base ${isDark ? 'text-[#C59A4E]' : 'text-[#8F173D]'}`}>
                JainSaathi
              </span>
              <span className="bg-[#D4AF37] text-[#121214] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                Admin
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleToggleTheme(isDark ? 'light' : 'dark')}
                className={`p-2 rounded-xl transition-colors ${
                  isDark ? 'bg-[#252530] text-[#D4AF37]' : 'bg-gray-100 text-[#8F173D]'
                }`}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button 
                type="button"
                onClick={handleLogout}
                className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Scrollable Content Area */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col min-w-0">
            {/* Global Subpage Back Header */}
            {pathname !== '/admin' && (
              <div className={`sticky top-0 z-30 border-b backdrop-blur-md px-4 sm:px-6 py-2 flex items-center justify-between ${
                isDark ? 'bg-[#16161B]/95 border-white/5' : 'bg-[#FFFDFB]/95 border-gray-200'
              }`}>
                <button 
                  type="button"
                  onClick={() => router.back()}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors ${
                    isDark ? 'text-white/70 hover:text-[#C59A4E]' : 'text-[#5C4D56] hover:text-[#8F173D]'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    isDark ? 'bg-white/5 text-white/60 border-white/10' : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {pathname.replace('/admin/', '').toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            <div className="flex-1 p-3 sm:p-5 md:p-6 min-w-0">
              {children}
            </div>
          </main>
        </div>

      </div>
    </div>
  );
}
