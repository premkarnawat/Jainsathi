'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, Users, Search, HeartHandshake, UserCheck, Bookmark, 
  User, Sliders, Settings, Award, Bell, Mail
} from 'lucide-react';
import { useCandidateProfile } from '@/hooks/useCandidateProfile';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import { useInterests } from '@/hooks/useInterests';

// Helper for displaying fallback avatar
const FallbackAvatar = () => (
  <div className="w-full h-full bg-[#EDE1D7] flex items-center justify-center text-[#766B70]">
    <User className="w-1/2 h-1/2 opacity-50" />
  </div>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Base data hooks
  const { profile: loggedInUser, loading: profileLoading } = useCandidateProfile();
  const { stats, loading: statsLoading } = useDashboardStats(loggedInUser?.id);
  const { refetch: refetchInterests } = useInterests(loggedInUser?.id);
  
  // Real-time listener for the whole application
  useRealtimeNotifications(loggedInUser?.id, () => {
    // Optional global refetch logic could go here
    refetchInterests();
  });

  const userPhotoUrl = loggedInUser?.photos?.[0]?.url;
  const userName = loggedInUser ? `${loggedInUser.firstName} ${loggedInUser.lastName}` : '';
  const membershipTier = loggedInUser?.membershipTier || 'Free Member';

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Matches', icon: Users, path: '/matches' },
    { label: 'Search', icon: Search, path: '/search' },
    { label: 'Interests', icon: HeartHandshake, path: '/interests' },
    { label: 'Connections', icon: UserCheck, path: '/connections' },
    { label: 'Saved', icon: Bookmark, path: '/saved' },
    { label: 'Profile', icon: User, path: '/profile' },
    { label: 'Preferences', icon: Sliders, path: '/preferences' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#FDF9F4] text-text font-sans flex">
      {/* ==========================================
          GLOBAL SIDEBAR
          ========================================== */}
      <aside className="w-[280px] bg-white border-r border-[#EDE1D7] p-8 flex flex-col justify-between shrink-0 h-screen sticky top-0">
        <div className="space-y-8">
          <div className="py-2">
            <h1 className="font-serif font-bold text-3xl text-burgundy tracking-tight cursor-pointer" onClick={() => router.push('/dashboard')}>
              JainSaathi
            </h1>
          </div>

          {/* User Profile Mini-Card */}
          <div className="flex items-center gap-4 py-2">
            <div className="relative w-12 h-12 shrink-0">
              {profileLoading ? (
                <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse border-2 border-[#EDE1D7]" />
              ) : userPhotoUrl ? (
                <img 
                  src={userPhotoUrl} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-gold shadow-sm" 
                  alt={userName}
                />
              ) : (
                <div className="w-12 h-12 rounded-full border-2 border-gold overflow-hidden shadow-sm">
                  <FallbackAvatar />
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 bg-gold text-white p-0.5 rounded-full">
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
                  <h3 className="font-serif font-bold text-base text-text leading-tight truncate">
                    {userName}
                  </h3>
                  <span className="text-[11px] font-bold text-gold flex items-center gap-1 mt-0.5 truncate">
                    {membershipTier}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Sidebar Menu Links */}
          <nav className="space-y-2 text-[13px]">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              // Check if the current pathname matches the item's path exactly or starts with it (for nested routes)
              const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
              return (
                <Link
                  key={item.label}
                  href={item.path}
                  className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl font-bold transition-all ${
                    isActive 
                      ? 'bg-burgundy text-white shadow-md' 
                      : 'text-[#766B70] hover:bg-[#F8EFE5]/50 hover:text-text'
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
          <button className="w-full bg-burgundy hover:bg-deepBurgundy text-white font-bold py-3.5 rounded-xl text-xs tracking-wider uppercase transition-all shadow-md">
            Upgrade Plan
          </button>
        </div>
      </aside>

      {/* ==========================================
          MAIN CONTENT AREA
          ========================================== */}
      <main className="flex-grow flex flex-col min-w-0">
        
        {/* GLOBAL TOP NAV */}
        <header className="p-8 pb-4 max-w-6xl mx-auto w-full flex justify-between items-center shrink-0">
          <div className="flex gap-8 text-[13px] font-bold text-[#766B70]">
            <Link href="/dashboard" className={`pb-1 px-1 ${pathname === '/dashboard' ? 'text-burgundy border-b-2 border-burgundy' : 'hover:text-text'}`}>Explore</Link>
            <button className="hover:text-text pb-1 px-1">Community</button>
            <button className="hover:text-text pb-1 px-1">Help</button>
          </div>
          
          <div className="flex items-center gap-5 text-burgundy">
            <button className="p-2 hover:bg-[#F8EFE5]/60 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-burgundy" />
            </button>
            <Link href="/interests" className="p-2 hover:bg-[#F8EFE5]/60 rounded-full transition-colors relative inline-block">
              <Mail className="w-5 h-5" />
              {(!statsLoading && stats?.interests > 0) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-burgundy" />
              )}
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-grow p-8 pt-0 max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
