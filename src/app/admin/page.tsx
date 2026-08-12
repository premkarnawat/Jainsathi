'use client';

import React, { useState } from 'react';
import { JainSaathiLogo } from '@/components/ui/JainSaathiLogo';
import { ShieldCheck, Users, AlertTriangle, CreditCard, Settings, FileCheck } from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'verifications' | 'taxonomy' | 'reports'>('verifications');

  return (
    <div className="min-h-screen bg-[#100A18] text-[#FFF9F1] flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#100A18] border-r border-[#D6A24A]/20 p-5 space-y-6">
        <div className="flex items-center gap-2">
          <JainSaathiLogo variant="dark" size="sm" />
          <span className="bg-[#9E183A] text-white text-[10px] font-bold px-2 py-0.5 rounded">ADMIN</span>
        </div>

        <nav className="space-y-1 text-xs">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`w-full text-left px-3 py-2.5 rounded-xl font-medium flex items-center gap-2 ${
              activeTab === 'verifications' ? 'bg-[#9E183A] text-white font-bold' : 'text-[#F3D59B]/70 hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Pending Verifications
          </button>
          
          <button
            onClick={() => setActiveTab('taxonomy')}
            className={`w-full text-left px-3 py-2.5 rounded-xl font-medium flex items-center gap-2 ${
              activeTab === 'taxonomy' ? 'bg-[#9E183A] text-white font-bold' : 'text-[#F3D59B]/70 hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" /> Jain Taxonomy Manager
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full text-left px-3 py-2.5 rounded-xl font-medium flex items-center gap-2 ${
              activeTab === 'reports' ? 'bg-[#9E183A] text-white font-bold' : 'text-[#F3D59B]/70 hover:bg-white/5'
            }`}
          >
            <AlertTriangle className="w-4 h-4" /> Profile Moderation & Reports
          </button>
        </nav>
      </aside>

      {/* Admin Main Body */}
      <main className="flex-1 p-6 space-y-6">
        <h1 className="font-serif font-bold text-3xl text-[#FFF9F1]">
          JainSaathi Secure Admin Portal
        </h1>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-[#6E1231]/30 border border-[#D6A24A]/30 p-4 rounded-2xl">
            <p className="text-xs text-[#F3D59B]">Total Users</p>
            <p className="font-serif text-3xl font-bold text-white mt-1">1,240</p>
          </div>
          <div className="bg-[#6E1231]/30 border border-[#D6A24A]/30 p-4 rounded-2xl">
            <p className="text-xs text-[#F3D59B]">Pending Verifications</p>
            <p className="font-serif text-3xl font-bold text-[#D6A24A] mt-1">14</p>
          </div>
          <div className="bg-[#6E1231]/30 border border-[#D6A24A]/30 p-4 rounded-2xl">
            <p className="text-xs text-[#F3D59B]">Active Subscriptions</p>
            <p className="font-serif text-3xl font-bold text-emerald-400 mt-1">312</p>
          </div>
          <div className="bg-[#6E1231]/30 border border-[#D6A24A]/30 p-4 rounded-2xl">
            <p className="text-xs text-[#F3D59B]">Open Reports</p>
            <p className="font-serif text-3xl font-bold text-red-400 mt-1">2</p>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'verifications' && (
          <div className="bg-[#100A18]/80 border border-[#D6A24A]/25 rounded-2xl p-6 space-y-4">
            <h2 className="font-serif font-bold text-xl text-[#F3D59B]">Verification Requests Queue</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#6E1231]/40 text-[#F3D59B] uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3">Candidate</th>
                    <th className="p-3">Sect / Community</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Doc Submitted</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  <tr>
                    <td className="p-3 font-semibold text-white">Ritika Shah (ID: cand-001)</td>
                    <td className="p-3">Shwetambar • Oswal</td>
                    <td className="p-3">Mumbai, MH</td>
                    <td className="p-3 text-emerald-400">Identity + Photo</td>
                    <td className="p-3 flex gap-2">
                      <button className="bg-emerald-700 text-white px-3 py-1 rounded font-bold hover:bg-emerald-600">
                        Approve
                      </button>
                      <button className="bg-red-800 text-white px-3 py-1 rounded hover:bg-red-700">
                        Reject
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
