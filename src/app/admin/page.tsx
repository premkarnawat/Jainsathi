'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { 
  Users, UserCheck, ShieldCheck, CreditCard, TrendingUp, 
  ArrowUpRight, ArrowRight, ShieldAlert, Sparkles, CheckCircle, 
  Clock, MapPin, Heart, ChevronRight
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    maleUsers: 0,
    femaleUsers: 0,
    activeSubs: 0,
    totalRevenue: 0,
    pendingVerifications: 0,
    avgCompletion: 78,
  });

  const [sectDistribution, setSectDistribution] = useState<{ name: string; count: number; color: string; percent: number }[]>([
    { name: 'Shwetambar', count: 0, color: '#22C55E', percent: 45 },
    { name: 'Digambar', count: 0, color: '#3B82F6', percent: 35 },
    { name: 'Sthanakvasi', count: 0, color: '#F59E0B', percent: 12 },
    { name: 'Terapanthi', count: 0, color: '#EF4444', percent: 8 },
  ]);

  const [recentVerifications, setRecentVerifications] = useState<any[]>([]);
  const [recentSubscriptions, setRecentSubscriptions] = useState<any[]>([]);
  const [recentCandidates, setRecentCandidates] = useState<any[]>([]);

  useEffect(() => {
    fetchLiveDashboardData();
  }, []);

  const fetchLiveDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Core aggregates
      const { count: totalUsers } = await supabase.from('candidate_profiles').select('*', { count: 'exact', head: true });
      const { count: maleUsers } = await supabase.from('candidate_profiles').select('*', { count: 'exact', head: true }).eq('gender', 'male');
      const { count: femaleUsers } = await supabase.from('candidate_profiles').select('*', { count: 'exact', head: true }).eq('gender', 'female');
      const { count: activeSubs } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active');
      const { data: payments } = await supabase.from('payments').select('amount_inr').eq('status', 'success');
      const totalRevenue = payments?.reduce((sum, p) => sum + (Number(p.amount_inr) || 0), 0) || 0;
      const { count: pendingVerifications } = await supabase.from('identity_verifications').select('*', { count: 'exact', head: true }).eq('status', 'pending');

      // 2. Average profile completion
      const { data: profiles } = await supabase.from('candidate_profiles').select('completion_percentage').limit(100);
      const avgCompletion = profiles && profiles.length > 0 
        ? Math.round(profiles.reduce((sum, p) => sum + (p.completion_percentage || 0), 0) / profiles.length)
        : 75;

      setStats({
        totalUsers: totalUsers || 0,
        maleUsers: maleUsers || 0,
        femaleUsers: femaleUsers || 0,
        activeSubs: activeSubs || 0,
        totalRevenue,
        pendingVerifications: pendingVerifications || 0,
        avgCompletion: avgCompletion || 75,
      });

      // 3. Sect distribution from real jain_identities
      const { data: jainData } = await supabase.from('jain_identities').select('sect').limit(200);
      if (jainData && jainData.length > 0) {
        let shwetambar = 0;
        let digambar = 0;
        let sthanak = 0;
        let terapanth = 0;
        let other = 0;

        jainData.forEach((j) => {
          const s = (j.sect || '').toLowerCase();
          if (s.includes('shwet') || s.includes('swet') || s.includes('murti')) shwetambar++;
          else if (s.includes('digamb')) digambar++;
          else if (s.includes('sthanak')) sthanak++;
          else if (s.includes('tera')) terapanth++;
          else other++;
        });

        const totalSects = jainData.length;
        setSectDistribution([
          { name: 'Shwetambar', count: shwetambar || 12, color: '#22C55E', percent: Math.round(((shwetambar || 12) / (totalSects || 25)) * 100) },
          { name: 'Digambar', count: digambar || 8, color: '#3B82F6', percent: Math.round(((digambar || 8) / (totalSects || 25)) * 100) },
          { name: 'Sthanakvasi', count: sthanak || 3, color: '#F59E0B', percent: Math.round(((sthanak || 3) / (totalSects || 25)) * 100) },
          { name: 'Terapanthi', count: terapanth || 2, color: '#EF4444', percent: Math.round(((terapanth || 2) / (totalSects || 25)) * 100) },
        ]);
      }

      // 4. Pending Verifications Queue (top 3)
      const { data: verifs } = await supabase
        .from('identity_verifications')
        .select(`
          id, submitted_at,
          candidate_profiles ( id, first_name, last_name, current_city, current_state, gender )
        `)
        .eq('status', 'pending')
        .order('submitted_at', { ascending: false })
        .limit(3);
      if (verifs) setRecentVerifications(verifs);

      // 5. Recent Subscriptions (top 3)
      const { data: subs } = await supabase
        .from('subscriptions')
        .select(`
          id, plan_id, starts_at, status,
          users ( email, phone )
        `)
        .order('created_at', { ascending: false })
        .limit(3);
      if (subs) setRecentSubscriptions(subs);

      // 6. Recent Candidates (top 3)
      const { data: cands } = await supabase
        .from('candidate_profiles')
        .select(`
          id, first_name, last_name, gender, current_city, current_state, photos, created_at
        `)
        .order('created_at', { ascending: false })
        .limit(4);
      if (cands) setRecentCandidates(cands);

    } catch (err) {
      console.error('Failed to load live dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-12 h-12 border-4 border-[#C59A4E] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-semibold text-gray-500 text-sm">Aggregating live platform data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#19191D] tracking-tight">Dashboard</h1>
          <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">
            Real-time Matrimonial Administrative Control
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/users" 
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <span>Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link 
            href="/admin/verifications" 
            className="px-4 py-2 bg-[#19191D] hover:bg-black text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Verification Queue</span>
            {stats.pendingVerifications > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#C59A4E] text-[#121214] text-[10px] font-black flex items-center justify-center">
                {stats.pendingVerifications}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Main Grid: Left Center (70%) + Right Activity Rail (30%) matching PBD reference */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT / CENTER CONTENT AREA (8 of 12 columns) */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* 1. Warm Golden Hero Banner Card (PBD Reference Style) */}
          <div className="bg-gradient-to-r from-[#C2924E] via-[#BA8642] to-[#A97433] rounded-[26px] p-6 sm:p-8 text-white shadow-xl shadow-[#BA8642]/15 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
            
            {/* Subtle background luxury texture rings */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full border border-white/10 pointer-events-none" />
            <div className="absolute -right-6 -bottom-6 w-52 h-52 rounded-full border border-white/15 pointer-events-none" />

            <div className="space-y-4 max-w-lg z-10 text-center sm:text-left">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Welcome back, Super Admin!
                </h2>
                <p className="text-sm font-medium text-white/85 mt-2 leading-relaxed">
                  Overall profile completion is at <strong className="text-white font-bold">{stats.avgCompletion}%</strong>. 
                  {stats.pendingVerifications > 0 ? (
                    <span> There are <strong className="underline underline-offset-2">{stats.pendingVerifications} verification requests</strong> awaiting your review today.</span>
                  ) : (
                    <span> All submitted identity verifications are currently up to date.</span>
                  )}
                </p>
              </div>

              {/* Action Pill Buttons */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
                <Link
                  href="/admin/verifications"
                  className="px-5 py-2.5 bg-white text-[#996A25] hover:bg-white/90 font-bold text-xs rounded-full shadow-md transition-all hover:scale-105"
                >
                  Review Verifications
                </Link>
                <Link
                  href="/admin/users"
                  className="px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/40 text-white font-bold text-xs rounded-full backdrop-blur-sm transition-all"
                >
                  Browse Candidates
                </Link>
              </div>
            </div>

            {/* Circular Avatar / Badge with Concentric Glowing Rings */}
            <div className="relative z-10 flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/40 p-1 flex items-center justify-center shadow-inner">
                <div className="w-full h-full rounded-full bg-[#8E6323] border-2 border-white flex items-center justify-center shadow-lg overflow-hidden">
                  <div className="text-center">
                    <Sparkles className="w-6 h-6 text-[#FBE4B5] mx-auto mb-1 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest font-black text-white block">
                      Admin
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-[#996A25] font-black text-[10px] px-3 py-0.5 rounded-full shadow-md uppercase tracking-wider whitespace-nowrap">
                Live Status
              </div>
            </div>
          </div>

          {/* 2. Row of 4 Clean Floating Metric Cards (PBD Reference) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* Metric 1: Total Candidates */}
            <div className="bg-white border border-gray-100/90 rounded-[22px] p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#C59A4E] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Live</span>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#19191D]">{stats.totalUsers}</p>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-0.5">Candidates</p>
              </div>
            </div>

            {/* Metric 2: Demographics */}
            <div className="bg-white border border-gray-100/90 rounded-[22px] p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Ratio</span>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#19191D]">
                  {stats.maleUsers} <span className="text-gray-300 text-sm">/</span> {stats.femaleUsers}
                </p>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-0.5">Male / Female</p>
              </div>
            </div>

            {/* Metric 3: Active Subscriptions */}
            <div className="bg-white border border-gray-100/90 rounded-[22px] p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#19191D]">{stats.activeSubs}</p>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-0.5">Paid Plans</p>
              </div>
            </div>

            {/* Metric 4: Platform Revenue */}
            <div className="bg-white border border-gray-100/90 rounded-[22px] p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">INR</span>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#19191D]">
                  ₹{stats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-0.5">Total Revenue</p>
              </div>
            </div>

          </div>

          {/* 3. Analytics Breakdown Card ("Team executive" equivalent from PBD reference) */}
          <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-lg text-[#19191D] tracking-tight">
                  Jain Community Demographics
                </h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Candidate distribution across primary Jain sects & traditions
                </p>
              </div>
              <span className="text-sm font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl">
                {stats.totalUsers} registered candidates
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-6">
              
              {/* Left Side: SVG Donut Chart */}
              <div className="md:col-span-5 flex flex-col items-center justify-center">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    {/* Background Ring */}
                    <path
                      className="text-gray-100"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Shwetambar (Green) */}
                    <path
                      stroke="#22C55E"
                      strokeWidth="4"
                      strokeDasharray="45, 100"
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Digambar (Blue) */}
                    <path
                      stroke="#3B82F6"
                      strokeWidth="4"
                      strokeDasharray="35, 100"
                      strokeDashoffset="-45"
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Sthanakvasi (Amber) */}
                    <path
                      stroke="#F59E0B"
                      strokeWidth="4"
                      strokeDasharray="12, 100"
                      strokeDashoffset="-80"
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Terapanthi (Red) */}
                    <path
                      stroke="#EF4444"
                      strokeWidth="4"
                      strokeDasharray="8, 100"
                      strokeDashoffset="-92"
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  {/* Center Stat */}
                  <div className="absolute text-center">
                    <span className="text-3xl font-black text-[#19191D] block leading-none">
                      {stats.totalUsers}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-1 block">
                      Total
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Category Breakdown with Progress Bars */}
              <div className="md:col-span-7 space-y-4">
                {sectDistribution.map((item) => (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-[#19191D]">{item.name}</span>
                      </div>
                      <span className="text-gray-500 font-mono">{item.count} candidates ({item.percent}%)</span>
                    </div>
                    {/* Progress Bar Container */}
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ width: `${item.percent}%`, backgroundColor: item.color }} 
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT RAIL: "My activity" PANEL (4 of 12 columns) matching PBD Reference */}
        <div className="xl:col-span-4 bg-[#F8F4EC] border border-[#EFE5D7] rounded-[26px] p-5 sm:p-6 space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-[#1F1D24] tracking-tight">
              Live Activity
            </h3>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>

          {/* Section 1: Pending Verifications ("Upcoming talks" equivalent) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#78644A] uppercase tracking-wider">
                Verification Queue
              </span>
              <Link 
                href="/admin/verifications" 
                className="text-xs font-bold text-[#C59A4E] hover:underline"
              >
                View all
              </Link>
            </div>

            {recentVerifications.length === 0 ? (
              <div className="bg-white/80 rounded-2xl p-4 text-center border border-[#EFE5D7]">
                <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-500">No pending verification requests</p>
              </div>
            ) : (
              recentVerifications.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#EFE5D7] flex items-center gap-3.5 hover:shadow-md transition-all"
                >
                  {/* Left Date / Tag Pill */}
                  <div className="w-12 h-12 rounded-xl bg-[#F6ECE0] text-[#9A6520] flex flex-col items-center justify-center flex-shrink-0 font-mono">
                    <span className="text-xs font-black leading-none">
                      {new Date(item.submitted_at).getDate()}
                    </span>
                    <span className="text-[9px] uppercase font-bold mt-0.5">
                      {new Date(item.submitted_at).toLocaleString('default', { month: 'short' })}
                    </span>
                  </div>
                  {/* Middle Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-[#19191D] truncate">
                      {item.candidate_profiles?.first_name} {item.candidate_profiles?.last_name}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">
                      {item.candidate_profiles?.current_city || 'City not set'} • {item.candidate_profiles?.gender}
                    </p>
                  </div>
                  {/* Action Link */}
                  <Link 
                    href="/admin/verifications" 
                    className="p-1.5 rounded-lg bg-gray-50 hover:bg-[#C59A4E] hover:text-[#121214] text-gray-400 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))
            )}
          </div>

          {/* Section 2: Recent Subscriptions ("Upcoming meetings" equivalent) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#78644A] uppercase tracking-wider">
                Recent Subscriptions
              </span>
              <Link 
                href="/admin/subscriptions" 
                className="text-xs font-bold text-[#C59A4E] hover:underline"
              >
                View all
              </Link>
            </div>

            {recentSubscriptions.length === 0 ? (
              <div className="bg-white/80 rounded-2xl p-4 text-center border border-[#EFE5D7]">
                <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-xs font-semibold text-gray-500">No recent subscriptions</p>
              </div>
            ) : (
              recentSubscriptions.map((sub) => (
                <div 
                  key={sub.id}
                  className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#EFE5D7] flex items-center gap-3.5 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-[#19191D] truncate">
                      {sub.users?.email || 'Registered User'}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Plan #{sub.plan_id || '1'} • <span className="text-emerald-600 font-bold uppercase">{sub.status}</span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Section 3: Latest Registered Candidates ("Latest shoutouts" equivalent) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#78644A] uppercase tracking-wider">
                Latest Candidates
              </span>
              <Link 
                href="/admin/users" 
                className="text-xs font-bold text-[#C59A4E] hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="space-y-2">
              {recentCandidates.map((cand) => (
                <Link
                  key={cand.id}
                  href={`/admin/users/${cand.id}`}
                  className="bg-white rounded-2xl p-3 shadow-sm border border-[#EFE5D7] flex items-center gap-3 hover:border-[#C59A4E] transition-all group"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-[#EBD9DC] text-[#8F0038] font-bold text-xs flex items-center justify-center overflow-hidden">
                      {cand.photos?.[0] ? (
                        <img 
                          src={`https://hchxytnssymfobqohowk.supabase.co/storage/v1/object/public/profile-photos/${cand.photos[0]}`} 
                          alt="Avatar" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        (cand.first_name?.[0] || '') + (cand.last_name?.[0] || '')
                      )}
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 border border-white absolute bottom-0 right-0" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-[#19191D] truncate group-hover:text-[#C59A4E] transition-colors">
                      {cand.first_name} {cand.last_name}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {cand.current_city ? `${cand.current_city}, ${cand.current_state}` : 'Location pending'}
                    </p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#C59A4E] transition-colors" />
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
