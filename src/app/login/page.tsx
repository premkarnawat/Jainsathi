'use client';

import React from 'react';
import { ProfileWizard } from '@/components/wizard/ProfileWizard';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FFF9F1] py-6">
      <div className="max-w-7xl mx-auto px-4 mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xs font-bold text-[#6E1231] hover:underline"
        >
          ← Return to Home
        </Link>
      </div>

      <ProfileWizard
        onComplete={() => {
          router.push('/dashboard');
        }}
      />
    </div>
  );
}
