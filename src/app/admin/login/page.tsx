'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { JainSaathiLogo } from '@/components/ui/JainSaathiLogo';
import { ShieldCheck, Mail, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        const { data: dbUser } = await supabase
          .from('users')
          .select('role')
          .eq('auth_id', data.user.id)
          .single();

        if (!dbUser || (dbUser.role !== 'admin' && dbUser.role !== 'super_admin')) {
          await supabase.auth.signOut();
          throw new Error('Unauthorized: You do not have admin access.');
        }
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#100A18] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <JainSaathiLogo variant="dark" size="lg" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#F3D59B]">Admin Portal Access</h1>
          <p className="text-sm text-gray-400 mt-2">Restricted access for authorized personnel only.</p>
        </div>

        <div className="bg-[#1C1326] rounded-3xl p-8 border border-[#8F0038]/30 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm font-semibold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#8F0038] transition-colors"
                  placeholder="admin@jainsaathi.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#8F0038] transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8F0038] hover:bg-[#A30040] text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-[#8F0038]/20 flex justify-center items-center gap-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Secure Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
