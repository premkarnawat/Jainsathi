'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { JainSaathiLogo } from '@/components/ui/JainSaathiLogo';
import { 
  LayoutDashboard, Users, CreditCard, ShieldCheck, 
  Settings, LogOut, Search, Bell, Menu, X, Receipt, Activity
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Verifications', href: '/admin/verifications', icon: ShieldCheck },
    { name: 'Revenue', href: '/admin/revenue', icon: Receipt },
    { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
    { name: 'Audit Logs', href: '/admin/logs', icon: Activity },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#100A18] text-[#FFFDFB] flex overflow-hidden font-sans">
      
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      <aside className={ixed inset-y-0 left-0 z-50 w-64 bg-[#100A18] border-r border-[#8F0038]/30 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-64 }>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <JainSaathiLogo variant="dark" size="sm" />
            <span className="bg-[#8F0038] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Admin</span>
          </div>
          <button className="md:hidden text-white/70 hover:text-white" onClick={() => setIsMobileOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <a 
                key={item.name}
                href={item.href}
                className={lex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 }
              >
                <item.icon className={w-5 h-5 } />
                {item.name}
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#8F0038]/30">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-[#F3D59B]" onClick={() => setIsMobileOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-hidden p-2 md:p-4 lg:p-6 lg:pt-0">
          <div className="h-full w-full bg-[#FFFDFB] rounded-[32px] overflow-y-auto text-[#241A20] shadow-2xl relative">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
