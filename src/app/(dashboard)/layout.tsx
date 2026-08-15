'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, Users, Search, HeartHandshake, UserCheck, Bookmark, 
  User, Sliders, Settings, Award, Bell, Mail, Star, Home
} from 'lucide-react';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import { useInterests } from '@/hooks/useInterests';

const FallbackAvatar = () => (
  <div className="w-full h-full bg-[#EDE1D7] flex items-center justify-center text-[#75666D]">
    <User className="w-1/2 h-1/2 opacity-50" />
  </div>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const { profile: loggedInUser, loading: profileLoading } = useCandidateProfile();
  const { stats, loading: statsLoading } = useDashboardStats(loggedInUser?.id);
  const { refetch: refetchInterests } = useInterests(loggedInUser?.id);
  
  useRealtimeNotifications(loggedInUser?.id, () => {
    refetchInterests();
  });

  const userPhotoUrl = loggedInUser?.photos?.[0]?.url;
  const userName = loggedInUser ? `${loggedInUser.first_name} ${loggedInUser.last_name}` : '';
  const membershipTier = loggedInUser?.membershipTier || 'Free Member';

  const menuItems = [
    { label: 'Home', icon: Home, path: '/dashboard' },
    { label: 'Matches', icon: Users, path: '/matches' },
    { label: 'Search', icon: Search, path: '/search' },
    { label: 'Interests', icon: HeartHandshake, path: '/interests' },
    { label: 'Connections', icon: UserCheck, path: '/connections' },
    { label: 'Saved', icon: Bookmark, path: '/saved' },
    { label: 'Profile', icon: User, path: '/profile' },
    { label: 'Preferences', icon: Sliders, path: '/preferences' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  // For mobile bottom navigation we only show these 5 items
  const mobileNavItems = [
    { label: 'Home', icon: Home, path: '/dashboard' },
    { label: 'Matches', icon: Users, path: '/matches' },
    { label: 'Interests', icon: HeartHandshake, path: '/interests' },
    { label: 'Connections', icon: UserCheck, path: '/connections' },
    { label: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F7] text-[#241B20] font-sans flex flex-col md:flex-row">
      
      {/* ==========================================
          DESKTOP SIDEBAR (Visible md and above)
          ========================================== */}
      <aside className="hidden md:flex w-[280px] bg-[#FFFDFB] border-r border-[#EBD9DC] p-8 flex-col justify-between shrink-0 h-screen sticky top-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3 py-2 cursor-pointer" onClick={() => router.push('/dashboard')}>
            <img src="/logo.png" alt="Logo" className="w-14 h-14 object-contain rounded-lg" />
            <h1 className="font-serif font-bold text-2xl text-[#8F0038] tracking-tight">
              JainSaathi
            </h1>
          </div>

          {/* User Profile Mini-Card */}
          <div className="flex items-center gap-4 py-2">
            <div className="relative w-12 h-12 shrink-0">
              {profileLoading ? (
                <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse border-2 border-[#EBD9DC]" />
              ) : userPhotoUrl ? (
                <img 
                  src={userPhotoUrl} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#C99A3D] shadow-sm" 
                  alt={userName}
                />
              ) : (
                <div className="w-12 h-12 rounded-full border-2 border-[#C99A3D] overflow-hidden shadow-sm">
                  <FallbackAvatar />
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 bg-[#C99A3D] text-white p-0.5 rounded-full">
                <Award className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="overflow-hidden">
              {profileLoading ? (
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              ) : (
                <>
                  <h3 className="font-serif font-bold text-base text-[#241B20] leading-tight truncate">
                    {userName}
                  </h3>
                  <span className="text-[11px] font-bold text-[#C99A3D] flex items-center gap-1 mt-0.5 truncate">
                    {membershipTier}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Sidebar Menu Links */}
          <nav className="space-y-1.5 text-[13px]">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
              return (
                <Link
                  key={item.label}
                  href={item.path}
                  className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold transition-all ${
                    isActive 
                      ? 'bg-[#8F0038] text-white shadow-sm' 
                      : 'text-[#75666D] hover:bg-[#F7E5EA]/40 hover:text-[#241B20]'
                  }`}
                >
                  <IconComponent className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6">
          <button className="w-full bg-[#8F0038] hover:bg-[#72002E] text-white font-bold py-3.5 rounded-2xl text-xs tracking-wider uppercase transition-all shadow-sm">
            Upgrade Plan
          </button>
        </div>
      </aside>

      {/* ==========================================
          MOBILE STICKY HEADER (Visible below md)
          ========================================== */}
      <header className="md:hidden flex justify-between items-center bg-[#FFFDFB] border-b border-[#EBD9DC] px-6 py-4 sticky top-0 z-40 shadow-sm shrink-0">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/dashboard')}>
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain rounded-md" />
          <span className="font-serif font-bold text-lg text-[#8F0038]">JainSaathi</span>
        </div>
        <div className="font-serif text-[#8F0038] font-bold text-lg tracking-wide select-none">
          Explore
        </div>
        <div className="relative">
          <Link href="/interests" className="text-[#8F0038] hover:opacity-85">
            <Bell className="w-6 h-6" />
            {(!statsLoading && stats?.interests > 0) && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#8F0038] border border-[#FFFDFB]" />
            )}
          </Link>
        </div>
      </header>

      {/* ==========================================
          MAIN PAGE CONTENT WRAPPER
          ========================================== */}
      <div className="flex-grow flex flex-col min-w-0 pb-[80px] md:pb-0">
        {/* Desktop Header Top bar (Hidden on mobile) */}
        <header className="hidden md:flex p-8 pb-4 max-w-6xl mx-auto w-full justify-between items-center shrink-0">
          <div className="flex gap-8 text-[13px] font-bold text-[#75666D]">
            <Link href="/dashboard" className={`pb-1 px-1 ${pathname === '/dashboard' ? 'text-[#8F0038] border-b-2 border-[#8F0038]' : 'hover:text-[#241B20]'}`}>Explore</Link>
            <button className="hover:text-[#241B20] pb-1 px-1">Community</button>
            <button className="hover:text-[#241B20] pb-1 px-1">Help</button>
          </div>
          
          <div className="flex items-center gap-5 text-[#8F0038]">
            <button className="p-2 hover:bg-[#F7E5EA]/40 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8F0038]" />
            </button>
            <Link href="/interests" className="p-2 hover:bg-[#F7E5EA]/40 rounded-full transition-colors relative inline-block">
              <Mail className="w-5 h-5" />
              {(!statsLoading && stats?.interests > 0) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8F0038]" />
              )}
            </Link>
          </div>
        </header>

        {/* Dynamic page content */}
        <main className="flex-grow p-4 md:p-8 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* ==========================================
          MOBILE FIXED BOTTOM NAV BAR (Visible below md)
          ========================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#FFFDFB] border-t border-[#EBD9DC] py-3.5 px-6 flex justify-between items-center z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        {mobileNavItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
          return (
            <Link 
              key={item.label} 
              href={item.path} 
              className="flex flex-col items-center gap-1 flex-1 relative group"
            >
              <IconComponent className={`w-[22px] h-[22px] transition-colors ${
                isActive ? 'text-[#8F0038]' : 'text-[#75666D]'
              }`} />
              <span className={`text-[10px] font-bold tracking-wide transition-colors ${
                isActive ? 'text-[#8F0038]' : 'text-[#75666D]'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-[-6px] w-1.5 h-1.5 rounded-full bg-[#8F0038]" />
              )}
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
