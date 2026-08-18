'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Printer
} from 'lucide-react';

export default function DigitalBiodataSection() {
  return (
    <section className="py-24 bg-[#FFFDF9] relative border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-champagneGold/15 border border-champagneGold/40 text-deepBurgundy text-xs font-bold uppercase tracking-widest mb-4">
                Smart Presentation
              </div>

              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-text mb-6 leading-tight">
                Your Modern <br />
                <span className="text-deepBurgundy italic font-normal">Digital Matrimonial Biodata</span>
              </h2>

              <p className="text-base sm:text-lg text-muted mb-6 leading-relaxed">
                Generate a beautifully formatted, comprehensive digital biodata directly from your verified profile. Share it with trusted families in single-click PDF format.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  'Formatted 4-Gotra paternal & maternal lineage tables',
                  'Professional academic and career verification summary',
                  'Family members, occupation, and native place details',
                  'Downloadable high-resolution PDF with privacy watermark'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-text font-medium">
                    <div className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-success" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/register"
                className="btn-ruby inline-flex items-center gap-2 text-base px-8 py-4 shadow-xl shadow-deepBurgundy/15"
              >
                <FileText className="w-5 h-5 text-champagneGold" />
                Create Your Digital Biodata
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Realistic Biodata Document Mockup */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border-2 border-champagneGold/40 shadow-2xl shadow-deepBurgundy/10 relative overflow-hidden"
            >
              {/* Gold Top Header Banner */}
              <div className="bg-gradient-to-r from-deepBurgundy via-[#5C0D28] to-deepBurgundy text-white p-4 -m-6 sm:-m-8 mb-6 rounded-t-2xl flex items-center justify-between border-b-2 border-champagneGold">
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-champagneGold font-bold">
                    Official Biodata Document
                  </div>
                  <h4 className="font-serif font-bold text-lg">Jain Matrimonial Biodata</h4>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-champagneGold" />
                </div>
              </div>

              {/* Document Fields Mockup */}
              <div className="space-y-4 text-xs pt-2">
                <div className="border-b border-border/80 pb-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-champagneGold mb-1">
                    1. Personal Details
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-text font-medium">
                    <div><span className="text-muted">DOB:</span> 14 May 1996</div>
                    <div><span className="text-muted">Height:</span> 5'11" (180 cm)</div>
                    <div><span className="text-muted">Complexion:</span> Fair</div>
                    <div><span className="text-muted">Diet:</span> Strict Vegetarian</div>
                  </div>
                </div>

                <div className="border-b border-border/80 pb-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-champagneGold mb-1">
                    2. Jain Community & 4-Gotra
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-text font-medium">
                    <div><span className="text-muted">Sect:</span> Shwetambar Murtipujak</div>
                    <div><span className="text-muted">Community:</span> Visa Oswal</div>
                    <div><span className="text-muted">Self Gotra:</span> Karnawat</div>
                    <div><span className="text-muted">Mother Gotra:</span> Lodha</div>
                  </div>
                </div>

                <div className="border-b border-border/80 pb-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-champagneGold mb-1">
                    3. Education & Profession
                  </div>
                  <div className="text-text font-medium space-y-1">
                    <div><span className="text-muted">Degree:</span> B.Tech (IIT Bombay) + MBA</div>
                    <div><span className="text-muted">Designation:</span> VP of Technology, Mumbai</div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-champagneGold mb-1">
                    4. Family Background
                  </div>
                  <div className="text-text font-medium space-y-1">
                    <div><span className="text-muted">Father:</span> Businessman (Textiles)</div>
                    <div><span className="text-muted">Native Place:</span> Jalore, Rajasthan</div>
                  </div>
                </div>
              </div>

              {/* Bottom Document Actions */}
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-deepBurgundy">
                <div className="flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-champagneGold" />
                  <span>PDF Ready</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted">
                  <Printer className="w-4 h-4" />
                  <span>Print Friendly</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
