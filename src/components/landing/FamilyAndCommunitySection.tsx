'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Users, Shield, Compass, BookOpen, MapPin, Heart } from 'lucide-react';
import Image from 'next/image';

export default function FamilyAndCommunitySection() {
  return (
    <section className="py-20 sm:py-24 bg-[#FAF3ED] relative overflow-hidden border-t border-[#EADBCE]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          
          {/* =========================================================================
              LEFT CARD BLOCK: BUILT FOR INDIVIDUALS. DESIGNED FOR FAMILIES.
              ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-[#E7D6CA]/90 shadow-sm flex flex-col justify-between"
          >
            <div>
              {/* Header with Circular Family Image */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-5">
                {/* Circular Family Photo Container */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-champagneGold shadow-md shrink-0 bg-[#E8D9CE]">
                  <Image
                    src="/images/hero-wedding.jpg"
                    alt="Jain Family Together"
                    fill
                    className="object-cover object-[20%_center]"
                    sizes="100px"
                  />
                </div>

                <div>
                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-text leading-tight mb-2">
                    Built for Individuals. <br />
                    <span className="text-deepBurgundy">Designed for Families.</span>
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Whether you are creating your own profile or managing it for your son or daughter, JainSaathi supports every step.
                  </p>
                </div>
              </div>

              {/* 3 Account Management Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                
                <div className="bg-[#FAF3ED] rounded-2xl p-3.5 border border-[#EADBCE] text-center flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#E0D0C2] flex items-center justify-center text-deepBurgundy mb-2">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="font-serif font-bold text-xs text-text mb-0.5">Self Managed</div>
                  <div className="text-[9.5px] text-muted">Create and manage your own profile</div>
                </div>

                <div className="bg-[#FAF3ED] rounded-2xl p-3.5 border border-[#EADBCE] text-center flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#E0D0C2] flex items-center justify-center text-deepBurgundy mb-2">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="font-serif font-bold text-xs text-text mb-0.5">Parent Managed</div>
                  <div className="text-[9.5px] text-muted">Manage for your son or daughter</div>
                </div>

                <div className="bg-[#FAF3ED] rounded-2xl p-3.5 border border-[#EADBCE] text-center flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#E0D0C2] flex items-center justify-center text-deepBurgundy mb-2">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="font-serif font-bold text-xs text-text mb-0.5">Guardian Managed</div>
                  <div className="text-[9.5px] text-muted">Help manage with permissions</div>
                </div>

              </div>
            </div>
          </motion.div>


          {/* =========================================================================
              RIGHT CARD BLOCK: ROOTED IN THE JAIN COMMUNITY
              ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-[#E7D6CA]/90 shadow-sm flex flex-col justify-between"
          >
            <div>
              {/* Header with Temple Illustration / Photo */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-5">
                <div>
                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-text leading-tight mb-2">
                    Rooted in the <br />
                    <span className="text-deepBurgundy">Jain Community</span>
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Bringing together Jain families across communities, sects and generations.
                  </p>
                </div>

                {/* Jain Temple / Architecture Icon Visual */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-champagneGold shadow-md shrink-0 bg-[#F5EDE4] flex items-center justify-center">
                  <Image
                    src="/images/hero-wedding.jpg"
                    alt="Jain Temple Derasar Architecture"
                    fill
                    className="object-cover object-right filter sepia-[0.3]"
                    sizes="100px"
                  />
                </div>
              </div>

              {/* 4 Badges arranged in 2x2 Grid */}
              <div className="grid grid-cols-2 gap-3 pt-3">
                
                <div className="bg-[#FAF3ED] rounded-xl p-3 border border-[#EADBCE] flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-deepBurgundy shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <span className="font-serif font-bold text-xs text-text">Sect & Community</span>
                </div>

                <div className="bg-[#FAF3ED] rounded-xl p-3 border border-[#EADBCE] flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-deepBurgundy shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="font-serif font-bold text-xs text-text">Gotra & Gota</span>
                </div>

                <div className="bg-[#FAF3ED] rounded-xl p-3 border border-[#EADBCE] flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-deepBurgundy shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="font-serif font-bold text-xs text-text">Location</span>
                </div>

                <div className="bg-[#FAF3ED] rounded-xl p-3 border border-[#EADBCE] flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-deepBurgundy shrink-0">
                    <Heart className="w-4 h-4" />
                  </div>
                  <span className="font-serif font-bold text-xs text-text">Lifestyle & Values</span>
                </div>

              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
