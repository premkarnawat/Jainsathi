'use client';

import React from 'react';
import { Settings, Shield, Bell, LogOut, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl">
      <div className="bg-white p-8 rounded-3xl border border-[#EDE1D7] shadow-sm">
        <h1 className="font-serif text-3xl font-bold text-burgundy flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Settings
        </h1>
        <p className="text-sm font-semibold text-[#766B70] mt-1">
          Manage your account, privacy, and notifications.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#EDE1D7] shadow-sm overflow-hidden">
        
        <div className="p-6 border-b border-[#F8EFE5] flex items-center justify-between hover:bg-[#FDF9F4] transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#FFF9F2] rounded-xl text-burgundy">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-text text-sm">Privacy & Visibility</h3>
              <p className="text-xs text-[#766B70] mt-0.5">Control who can see your photos and contact details</p>
            </div>
          </div>
          <Lock className="w-4 h-4 text-[#766B70]" />
        </div>

        <div className="p-6 border-b border-[#F8EFE5] flex items-center justify-between hover:bg-[#FDF9F4] transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#FFF9F2] rounded-xl text-burgundy">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-text text-sm">Notifications</h3>
              <p className="text-xs text-[#766B70] mt-0.5">Manage email and push notification preferences</p>
            </div>
          </div>
        </div>

        <div 
          onClick={handleLogout}
          className="p-6 flex items-center justify-between hover:bg-[#FFF1F1] transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#FFF1F1] rounded-xl text-burgundy group-hover:bg-burgundy group-hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-burgundy text-sm">Log Out</h3>
              <p className="text-xs text-burgundy/70 mt-0.5">Sign out of your account on this device</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
