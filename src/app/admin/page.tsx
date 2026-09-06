'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    maleUsers: 0,
    femaleUsers: 0,
    activeSubs: 0,
    totalRevenue: 0,
    pendingVerifications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    
    // Total Users
    const { count: totalUsers } = await supabase.from('candidate_profiles').select('*', { count: 'exact', head: true });
    
    // Male Users
    const { count: maleUsers } = await supabase.from('candidate_profiles').select('*', { count: 'exact', head: true }).eq('gender', 'male');
    
    // Female Users
    const { count: femaleUsers } = await supabase.from('candidate_profiles').select('*', { count: 'exact', head: true }).eq('gender', 'female');
    
    // Active Subs
    const { count: activeSubs } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active');
    
    // Revenue (Sum of successful payments)
    const { data: payments } = await supabase.from('payments').select('amount').eq('status', 'success');
    const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
    
    // Pending Verifications
    const { count: pendingVerifications } = await supabase.from('identity_verifications').select('*', { count: 'exact', head: true }).eq('status', 'pending');

    setStats({
      totalUsers: totalUsers || 0,
      maleUsers: maleUsers || 0,
      femaleUsers: femaleUsers || 0,
      activeSubs: activeSubs || 0,
      totalRevenue,
      pendingVerifications: pendingVerifications || 0,
    });
    setLoading(false);
  };

  if (loading) {
    return <div className="p-10 flex justify-center"><div className="w-8 h-8 border-4 border-[#C99A3D] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#241A20]">Dashboard Overview</h1>
          <p className="text-sm font-semibold text-[#75666D] mt-1">Welcome back to the JainSaathi Admin Panel.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Stat Cards */}
        <div className="bg-[#FDF9F4] border border-[#EBD9DC] p-5 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-[#75666D] uppercase tracking-wider mb-1">Total Users</p>
          <p className="text-3xl font-serif font-bold text-[#8F0038]">{stats.totalUsers}</p>
        </div>
        <div className="bg-[#FDF9F4] border border-[#EBD9DC] p-5 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-[#75666D] uppercase tracking-wider mb-1">Male Users</p>
          <p className="text-3xl font-serif font-bold text-[#8F0038]">{stats.maleUsers}</p>
        </div>
        <div className="bg-[#FDF9F4] border border-[#EBD9DC] p-5 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-[#75666D] uppercase tracking-wider mb-1">Female Users</p>
          <p className="text-3xl font-serif font-bold text-[#8F0038]">{stats.femaleUsers}</p>
        </div>
        <div className="bg-[#FDF9F4] border border-[#EBD9DC] p-5 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-[#75666D] uppercase tracking-wider mb-1">Active Subs</p>
          <p className="text-3xl font-serif font-bold text-[#8F0038]">{stats.activeSubs}</p>
        </div>
        <div className="bg-[#FDF9F4] border border-[#EBD9DC] p-5 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-[#75666D] uppercase tracking-wider mb-1">Revenue (INR)</p>
          <p className="text-3xl font-serif font-bold text-[#8F0038]">?{stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-[#FDF9F4] border border-[#EBD9DC] p-5 rounded-2xl shadow-sm">
          <p className="text-[10px] font-bold text-[#75666D] uppercase tracking-wider mb-1">Pending ID Verifications</p>
          <p className="text-3xl font-serif font-bold text-[#C99A3D]">{stats.pendingVerifications}</p>
        </div>
      </div>
    </div>
  );
}
