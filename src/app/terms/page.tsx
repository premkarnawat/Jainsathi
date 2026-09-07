import React from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { query } from '@/lib/db';
import { FileCheck, Clock, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

function renderMarkdown(content: string) {
  const blocks = content.split('\n\n');
  return blocks.map((block, idx) => {
    const trimmed = block.trim();
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={idx} className="font-serif text-xl sm:text-2xl font-bold text-[#8F173D] mt-8 mb-3">
          {trimmed.replace('### ', '')}
        </h3>
      );
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={idx} className="font-serif text-2xl sm:text-3xl font-bold text-[#24131D] mt-10 mb-4 pb-2 border-b border-[#C59A4E]/20">
          {trimmed.replace('## ', '')}
        </h2>
      );
    }
    if (trimmed.startsWith('# ')) {
      return (
        <h1 key={idx} className="font-serif text-3xl sm:text-4xl font-black text-[#8F173D] mb-6">
          {trimmed.replace('# ', '')}
        </h1>
      );
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items = trimmed.split('\n').map(line => line.replace(/^[-*]\s+/, '').trim());
      return (
        <ul key={idx} className="list-disc pl-5 space-y-2 text-sm sm:text-base text-[#4A3B43] my-4 leading-relaxed">
          {items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={idx} className="text-sm sm:text-base text-[#4A3B43] leading-relaxed mb-4">
        {trimmed}
      </p>
    );
  });
}

export default async function TermsAndConditions() {
  let termsData = {
    title: 'Terms & Conditions',
    lastUpdated: 'August 2026',
    content: `### 1. Eligibility
You must be at least 18 years old (for females) or 21 years old (for males) and legally eligible to enter into matrimony under applicable Indian laws.

### 2. Community Integrity
JainSaathi is exclusively dedicated to the Jain community. Profiles providing false, inaccurate, or fraudulent community/personal information will be terminated immediately.

### 3. Verification & Safety
All candidates undergo our verification process. Harassment, abuse, or unauthorized sharing of biodatas is strictly prohibited.`
  };

  try {
    const rows = await query(`SELECT value FROM site_settings WHERE key = 'terms_conditions' LIMIT 1;`);
    if (rows && rows.length > 0 && rows[0].value) {
      termsData = {
        title: rows[0].value.title || termsData.title,
        lastUpdated: rows[0].value.lastUpdated || termsData.lastUpdated,
        content: rows[0].value.content || termsData.content,
      };
    }
  } catch (err) {
    console.error('Error fetching live terms & conditions:', err);
  }

  return (
    <div className="min-h-screen bg-[#FFFDFB] font-sans text-[#24131D] flex flex-col justify-between">
      <Header />

      <main className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        {/* Breadcrumb & Badge */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#8F173D] mb-4">
          <FileCheck className="w-4 h-4 text-[#C59A4E]" />
          <span className="uppercase tracking-widest text-[10px]">User Agreement</span>
        </div>

        {/* Title & Metadata */}
        <div className="border-b border-[#EADFCB] pb-6 mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#8F173D] tracking-tight">
            {termsData.title}
          </h1>
          <div className="flex items-center gap-2 mt-3 text-xs text-[#705662] font-medium">
            <Clock className="w-3.5 h-3.5 text-[#C59A4E]" />
            <span>Effective date: {termsData.lastUpdated}</span>
          </div>
        </div>

        {/* Live Rendered Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EADFCB] shadow-xs">
          <div className="prose max-w-none">
            {renderMarkdown(termsData.content)}
          </div>
        </div>

        {/* Terms Box */}
        <div className="mt-8 p-5 rounded-2xl bg-[#C59A4E]/10 border border-[#C59A4E]/25 flex items-start gap-3.5">
          <ShieldCheck className="w-5 h-5 text-[#9E6F18] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#4A3B43] leading-relaxed">
            <strong className="text-[#9E6F18] block mb-0.5">Community Standard:</strong>
            By accessing or creating a profile on JainSaathi, you solemnly affirm the truthfulness of your biodata, photographs, and personal credentials.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
