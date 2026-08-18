'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  FileText, 
  Sliders, 
  Search, 
  Heart, 
  UserCheck, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Lock, 
  PhoneCall, 
  Bell, 
  KeyRound,
  ChevronRight
} from 'lucide-react';

const stepsData = [
  {
    num: '01',
    title: 'Create Your Profile',
    tagline: 'Simple, Secure Mobile Setup',
    description: 'Begin with verified phone authentication. Enter fundamental personal and candidate details in a guided, intuitive environment.',
    stage: 'Identity & Authentication',
  },
  {
    num: '02',
    title: 'Complete Your Lineage Details',
    tagline: '4-Gotra Lineage & Cultural Sanskaar',
    description: 'Document your sacred 4-Gotra lineage (Self, Mother, Dadi, Nani), native ancestral place, education, career, and dietary lifestyle.',
    stage: 'Cultural Heritage',
  },
  {
    num: '03',
    title: 'Set Partner Preferences',
    tagline: 'Precision Compatibility Criteria',
    description: 'Specify your non-negotiables across age range, Jain sect (Shwetambar/Digambar), location, profession, and family values.',
    stage: 'Algorithmic Calibration',
  },
  {
    num: '04',
    title: 'Discover Compatible Matches',
    tagline: 'Preference Compatibility Engine',
    description: 'Review high-affinity candidate profiles scored transparently against your criteria, complete with verified badges and summary cards.',
    stage: 'Intelligent Discovery',
  },
  {
    num: '05',
    title: 'Express Matrimonial Interest',
    tagline: 'Respectful, Discreet Invitations',
    description: 'Send a private interest request. The recipient family receives an instant discreet alert with your verified profile summary.',
    stage: 'Mutual Inquiry',
  },
  {
    num: '06',
    title: 'Connect & Unlock Direct Details',
    tagline: 'Mutual Consent Unlocks Full Access',
    description: 'Once both parties accept, direct phone numbers and complete 4-Gotra PDF biodatas are revealed for meaningful family conversations.',
    stage: 'Lifelong Companion',
  },
];

export default function HowItWorksStickyCanvas() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-24 bg-[#FFF9F4] relative border-t border-border overflow-hidden">
      {/* Decorative ambient aura */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-champagneGold/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-softRose/30 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-champagneGold/15 border border-champagneGold/40 text-deepBurgundy text-xs font-bold uppercase tracking-widest mb-4">
              Interactive Product Journey
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-text mb-4">
              How <span className="text-deepBurgundy italic font-normal">JainSaathi</span> Works
            </h2>
            <p className="text-base sm:text-lg text-muted">
              Step through our structured matrimonial process designed to uphold dignity, trust, and family involvement.
            </p>
          </motion.div>
        </div>

        {/* =========================================================================
            TWO-COLUMN STICKY INTERACTION CANVAS
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* =========================================================
              LEFT COLUMN: INTERACTIVE STEP SELECTORS (Scrollable / Clickable)
              ========================================================= */}
          <div className="lg:col-span-5 space-y-3.5">
            {stepsData.map((item, idx) => {
              const isSelected = activeStep === idx;
              return (
                <motion.div
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  whileHover={{ x: isSelected ? 0 : 4 }}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 ${
                    isSelected
                      ? 'bg-deepBurgundy text-white border-deepBurgundy shadow-xl shadow-deepBurgundy/15 scale-[1.01]'
                      : 'bg-white text-text border-border hover:border-champagneGold/60 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`font-serif text-2xl font-bold leading-none shrink-0 mt-0.5 ${
                        isSelected ? 'text-champagneGold' : 'text-deepBurgundy/30'
                      }`}
                    >
                      {item.num}
                    </span>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className={`font-serif font-bold text-lg ${isSelected ? 'text-white' : 'text-text'}`}>
                          {item.title}
                        </h3>
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-white/20 text-champagneGold'
                              : 'bg-secondary text-deepBurgundy'
                          }`}
                        >
                          {item.stage}
                        </span>
                      </div>

                      <p className={`text-xs leading-relaxed ${isSelected ? 'text-white/80' : 'text-muted'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* =========================================================
              RIGHT COLUMN: DYNAMIC PRODUCT DEMONSTRATION CANVAS
              ========================================================= */}
          <div className="lg:col-span-7 sticky top-28">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-champagneGold/40 shadow-2xl shadow-deepBurgundy/10 min-h-[460px] flex flex-col justify-between relative overflow-hidden">
              
              {/* Canvas Header Tag */}
              <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-deepBurgundy text-champagneGold font-serif font-bold text-sm flex items-center justify-center shadow-sm">
                    {stepsData[activeStep].num}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-champagneGold">
                      Active Live Stage
                    </span>
                    <h4 className="font-serif font-bold text-base text-deepBurgundy leading-none">
                      {stepsData[activeStep].tagline}
                    </h4>
                  </div>
                </div>
                
                <span className="text-xs font-bold text-deepBurgundy bg-softRose/60 px-3 py-1 rounded-full">
                  Step {activeStep + 1} of 6
                </span>
              </div>

              {/* Dynamic Step Visualization Content */}
              <div className="flex-1 flex items-center justify-center py-4">
                <AnimatePresence mode="wait">
                  
                  {/* ==========================================
                      STEP 1 VISUAL: PROFILE CREATION & ASSEMBLY
                      ========================================== */}
                  {activeStep === 0 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -15 }}
                      transition={{ duration: 0.4 }}
                      className="w-full max-w-md space-y-4"
                    >
                      <div className="flex items-center justify-between bg-secondary p-3 rounded-2xl border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-deepBurgundy text-champagneGold flex items-center justify-center font-bold">
                            AJ
                          </div>
                          <div>
                            <div className="text-xs font-bold text-text">Aarav Jain</div>
                            <div className="text-[10px] text-muted">B.Tech • VP of Technology • Mumbai</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                            92% Complete
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white border border-border/80 flex items-center justify-between">
                          <span className="text-muted">Jain Community:</span>
                          <span className="font-bold text-deepBurgundy">Shwetambar Murtipujak</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-border/80 flex items-center justify-between">
                          <span className="text-muted">Native Place:</span>
                          <span className="font-bold text-deepBurgundy">Jalore, RJ</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-border/80 flex items-center justify-between">
                          <span className="text-muted">Education:</span>
                          <span className="font-bold text-deepBurgundy">IIT Bombay</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-border/80 flex items-center justify-between">
                          <span className="text-muted">Diet:</span>
                          <span className="font-bold text-deepBurgundy">Strict Vegetarian</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold text-success bg-success/5 p-2.5 rounded-xl border border-success/20">
                        <Check className="w-4 h-4" />
                        <span>Phone OTP & Identity verified successfully</span>
                      </div>
                    </motion.div>
                  )}

                  {/* ==========================================
                      STEP 2 VISUAL: 4-GOTRA LINEAGE & DETAILS
                      ========================================== */}
                  {activeStep === 1 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -15 }}
                      transition={{ duration: 0.4 }}
                      className="w-full max-w-md bg-secondary rounded-2xl p-5 border border-border space-y-3"
                    >
                      <div className="text-xs font-bold uppercase tracking-wider text-champagneGold border-b border-border pb-2">
                        Sacred 4-Gotra Verification
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-white p-3 rounded-xl border border-border/80">
                          <div className="text-[10px] text-muted">Self (Paternal):</div>
                          <div className="font-bold text-deepBurgundy">Karnawat</div>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-border/80">
                          <div className="text-[10px] text-muted">Mother (Nanihal):</div>
                          <div className="font-bold text-deepBurgundy">Lodha</div>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-border/80">
                          <div className="text-[10px] text-muted">Dadi (Paternal GM):</div>
                          <div className="font-bold text-deepBurgundy">Kothari</div>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-border/80">
                          <div className="text-[10px] text-muted">Nani (Maternal GM):</div>
                          <div className="font-bold text-deepBurgundy">Bhandari</div>
                        </div>
                      </div>

                      <div className="text-[11px] text-muted italic text-center">
                        ✓ Formatted for elder family elders & matrimonial lineage verification
                      </div>
                    </motion.div>
                  )}

                  {/* ==========================================
                      STEP 3 VISUAL: PARTNER PREFERENCE CONTROLS
                      ========================================== */}
                  {activeStep === 2 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -15 }}
                      transition={{ duration: 0.4 }}
                      className="w-full max-w-md space-y-3 text-xs"
                    >
                      <div className="bg-secondary p-3.5 rounded-2xl border border-border">
                        <div className="flex justify-between font-bold text-text mb-2">
                          <span>Preferred Age Range:</span>
                          <span className="text-deepBurgundy">24 – 29 Years</span>
                        </div>
                        <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-border">
                          <div className="h-full bg-champagneGold w-3/4 rounded-full" />
                        </div>
                      </div>

                      <div className="bg-secondary p-3.5 rounded-2xl border border-border">
                        <div className="font-bold text-text mb-2">Jain Sect Preference:</div>
                        <div className="flex flex-wrap gap-2">
                          {['Shwetambar Murtipujak', 'Sthanakvasi', 'Any Jain'].map((chip, i) => (
                            <span
                              key={i}
                              className={`px-3 py-1 rounded-full font-semibold ${
                                i === 0
                                  ? 'bg-deepBurgundy text-white'
                                  : 'bg-white text-text border border-border'
                              }`}
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-success/10 rounded-2xl border border-success/20 text-center font-bold text-success">
                        ✓ Filter calibrated — 148 compatible profiles found
                      </div>
                    </motion.div>
                  )}

                  {/* ==========================================
                      STEP 4 VISUAL: COMPATIBILITY SCORING
                      ========================================== */}
                  {activeStep === 3 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -15 }}
                      transition={{ duration: 0.4 }}
                      className="w-full max-w-md bg-secondary rounded-2xl p-5 border border-border space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-success" />
                          <span className="font-serif font-bold text-base text-text">Pooja Shah</span>
                        </div>
                        <span className="bg-deepBurgundy text-champagneGold font-bold text-xs px-3 py-1 rounded-full">
                          92% Compatible
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        {['Age & Astrological Alignment ✓', 'Shwetambar Jain Murtipujak ✓', 'Mumbai Location ✓', 'Strict Vegetarian Diet ✓'].map((c, i) => (
                          <div key={i} className="flex items-center gap-2 text-text font-medium bg-white p-2 rounded-lg border border-border/60">
                            <Check className="w-3.5 h-3.5 text-success" />
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ==========================================
                      STEP 5 VISUAL: EXPRESS INTEREST & ALERTS
                      ========================================== */}
                  {activeStep === 4 && (
                    <motion.div
                      key="step5"
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -15 }}
                      transition={{ duration: 0.4 }}
                      className="w-full max-w-md space-y-3"
                    >
                      <div className="bg-white p-4 rounded-2xl border-2 border-champagneGold shadow-md flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-softRose flex items-center justify-center shrink-0">
                          <Bell className="w-5 h-5 text-deepBurgundy" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-deepBurgundy">Interest Invitation Sent</div>
                          <div className="text-[10px] text-muted">A private matrimonial request has been delivered to candidate family.</div>
                        </div>
                      </div>

                      <div className="bg-secondary p-4 rounded-2xl border border-border text-center space-y-3">
                        <div className="text-xs font-semibold text-text">Recipient Family Action:</div>
                        <div className="flex gap-3 justify-center">
                          <button className="btn-ruby text-xs py-2 px-6">
                            Accept Interest
                          </button>
                          <button className="btn-gold-outline text-xs py-2 px-4 bg-white">
                            Decline
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ==========================================
                      STEP 6 VISUAL: MUTUAL ACCEPTANCE & REVEAL
                      ========================================== */}
                  {activeStep === 5 && (
                    <motion.div
                      key="step6"
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -15 }}
                      transition={{ duration: 0.4 }}
                      className="w-full max-w-md bg-gradient-to-br from-deepBurgundy to-[#5E0D28] text-white rounded-2xl p-6 border border-champagneGold/60 shadow-xl space-y-4"
                    >
                      <div className="flex items-center justify-center gap-2 text-champagneGold font-bold text-sm">
                        <Sparkles className="w-5 h-5" />
                        <span>Mutual Connection Established</span>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-white/80">Direct Phone:</span>
                          <span className="font-bold text-champagneGold">+91 98765 ***** (Unlocked)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/80">4-Gotra PDF Biodata:</span>
                          <span className="font-bold text-white">Full Access Granted</span>
                        </div>
                      </div>

                      <div className="text-center text-[11px] text-white/70">
                        ✓ Both parties have mutually accepted. You may now initiate family dialogue.
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Bottom Canvas Controls */}
              <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  className="font-bold text-deepBurgundy disabled:opacity-30 hover:underline"
                >
                  ← Previous Step
                </button>

                <button
                  disabled={activeStep === stepsData.length - 1}
                  onClick={() => setActiveStep((prev) => Math.min(stepsData.length - 1, prev + 1))}
                  className="btn-ruby text-xs py-2 px-5 font-bold disabled:opacity-30"
                >
                  Next Step →
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
