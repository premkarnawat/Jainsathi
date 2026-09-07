import React from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { query } from '@/lib/db';
import { Shield, Clock, FileText } from 'lucide-react';

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

export default async function PrivacyPolicy() {
  let policyData = {
    title: 'Privacy Policy',
    lastUpdated: 'August 2026',
    content: `### 1. Information Collected
At JainSaathi, we collect information you provide directly, including name, contact details, profile information, and photos for the purpose of matrimonial matching.

### 2. How Information is Used
We use your information exclusively to provide matchmaking services, verify identities, and ensure the safety of our platform.

### 3. Data Security & Privacy Controls
You retain full control over your privacy settings. Sensitive information like your Biodata PDF and Phone Number are restricted and only shared upon your mutual consent.`
  };

  try {
    const rows = await query(`SELECT value FROM site_settings WHERE key = 'privacy_policy' LIMIT 1;`);
    if (rows && rows.length > 0 && rows[0].value) {
      policyData = {
        title: rows[0].value.title || policyData.title,
        lastUpdated: rows[0].value.lastUpdated || policyData.lastUpdated,
        content: rows[0].value.content || policyData.content,
      };
    }
  } catch (err) {
    console.error('Error fetching live privacy policy:', err);
  }

  return (
    <div className="min-h-screen bg-[#FFFDFB] font-sans text-[#24131D] flex flex-col justify-between">
      <Header />

      <main className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        {/* Breadcrumb & Badge */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#8F173D] mb-4">
          <Shield className="w-4 h-4 text-[#C59A4E]" />
          <span className="uppercase tracking-widest text-[10px]">Legal Transparency</span>
        </div>

        {/* Title & Metadata */}
        <div className="border-b border-[#EADFCB] pb-6 mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#8F173D] tracking-tight">
            {policyData.title}
          </h1>
          <div className="flex items-center gap-2 mt-3 text-xs text-[#705662] font-medium">
            <Clock className="w-3.5 h-3.5 text-[#C59A4E]" />
            <span>Effective date: {policyData.lastUpdated}</span>
          </div>
        </div>

        {/* Live Rendered Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EADFCB] shadow-xs">
          <div className="prose max-w-none">
            {renderMarkdown(policyData.content)}
          </div>
        </div>

        {/* Privacy Assurance Box */}
        <div className="mt-8 p-5 rounded-2xl bg-[#8F173D]/5 border border-[#8F173D]/15 flex items-start gap-3.5">
          <Shield className="w-5 h-5 text-[#8F173D] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#4A3B43] leading-relaxed">
            <strong className="text-[#8F173D] block mb-0.5">Your Privacy Guarantee:</strong>
            JainSaathi strictly adheres to community trust and confidentiality standards. We never sell, rent, or lease your personal information to third-party advertising networks.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
