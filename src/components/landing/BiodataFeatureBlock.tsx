'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ShieldCheck, Sparkles, ArrowRight, Printer } from 'lucide-react';
import Link from 'next/link';

export default function BiodataFeatureBlock() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Reference 1 Style: Dark Contrast Block with Angled Card Presentation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="bg-gradient-to-br from-[#5E0D28] via-[#4A081D] to-[#2B0410] rounded-[36px] sm:rounded-[44px] p-8 sm:p-12 lg:p-16 border-2 border-champagneGold/40 shadow-2xl burgundy-glow relative overflow-hidden text-white"
      >
        {/* Decorative Gold Ambient Ring */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-champagneGold/15 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column: Angled 3D Digital Biodata Card (Ref 1 Card Presentation) */}
          <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
            <motion.div
              whileHover={{ rotate: 0, scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 border-2 border-champagneGold/60 shadow-2xl shadow-black/40 text-text -rotate-2 transform transition-transform"
            >
              {/* Document Header */}
              <div className="bg-gradient-to-r from-deepBurgundy to-[#5E0D28] text-white p-4 -m-6 sm:-m-7 mb-5 rounded-t-2xl flex items-center justify-between border-b border-champagneGold">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-champagneGold font-bold block">
                    Sacred Lineage Document
                  </span>
                  <h4 className="font-serif font-bold text-lg">Jain Matrimonial Biodata</h4>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-champagneGold" />
                </div>
              </div>

              {/* Lineage & Details */}
              <div className="space-y-3.5 text-xs pt-1">
                <div className="border-b border-border/80 pb-2.5">
                  <div className="text-[9.5px] font-bold uppercase tracking-wider text-deepBurgundy mb-1">
                    1. 4-Gotra Lineage (Paternal & Maternal)
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-medium text-text">
                    <div><span className="text-muted">Self (Paternal):</span> Karnawat</div>
                    <div><span className="text-muted">Mother (Nanihal):</span> Lodha</div>
                    <div><span className="text-muted">Paternal GM:</span> Kothari</div>
                    <div><span className="text-muted">Maternal GM:</span> Bhandari</div>
                  </div>
                </div>

                <div className="border-b border-border/80 pb-2.5">
                  <div className="text-[9.5px] font-bold uppercase tracking-wider text-deepBurgundy mb-1">
                    2. Community & Native Ancestry
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-medium text-text">
                    <div><span className="text-muted">Sect:</span> Murtipujak (Oswal)</div>
                    <div><span className="text-muted">Native:</span> Jalore, Rajasthan</div>
                  </div>
                </div>

                <div>
                  <div className="text-[9.5px] font-bold uppercase tracking-wider text-deepBurgundy mb-1">
                    3. Academic & Professional Summary
                  </div>
                  <div className="font-medium text-text space-y-0.5">
                    <div><span className="text-muted">Education:</span> B.Tech (IIT) + MBA</div>
                    <div><span className="text-muted">Profession:</span> VP of Technology, Mumbai</div>
                  </div>
                </div>
              </div>

              {/* Bottom Document Status */}
              <div className="mt-5 pt-3.5 border-t border-border flex items-center justify-between text-xs font-bold text-deepBurgundy">
                <div className="flex items-center gap-1.5 text-success">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Aadhaar Verified</span>
                </div>
                <div className="flex items-center gap-1 text-champagneGold">
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Title, Narrative & CTAs (Ref 1 Right Text) */}
          <div className="lg:col-span-6 order-1 lg:order-2 text-center lg:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-champagneGold bg-white/10 px-3.5 py-1.5 rounded-full border border-champagneGold/30 inline-block mb-4">
              Elder-Approved Presentation
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Create Your Verified <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-champagneGold via-softGold to-champagneGold italic font-normal">
                4-Gotra Digital Biodata
              </span>
            </h2>

            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Present your sacred lineage, academic accomplishments, and family sanskaar in a beautifully formatted, shareable PDF biodata. Designed for elder family review with zero privacy compromise.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link
                href="/register"
                className="btn-ruby w-full sm:w-auto text-sm px-8 py-3.5 bg-champagneGold text-deepBurgundy border-champagneGold hover:bg-white hover:text-deepBurgundy shadow-xl"
              >
                <Sparkles className="w-4 h-4 text-deepBurgundy" />
                Generate Your Biodata
              </Link>

              <Link
                href="#how-it-works"
                className="btn-gold-outline w-full sm:w-auto text-sm px-7 py-3.5 border-white/40 text-white hover:bg-white/10"
              >
                How It Works
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}
