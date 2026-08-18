'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, FileText, Image as ImageIcon, Phone } from 'lucide-react';

export default function PrivacyAndSafetySection() {
  return (
    <section id="safety" className="py-24 bg-background relative border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl font-bold text-text mb-6">
              Your Information. <span className="italic text-deepBurgundy font-normal">Your Control.</span>
            </h2>
            <p className="text-lg text-muted">
              Sensitive information should remain protected. It only becomes available according to your privacy settings, your explicit authorization, and applicable plan rules.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-lg transition-shadow group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-softRose transition-colors">
                <ImageIcon className="w-5 h-5 text-deepBurgundy" />
              </div>
              <Lock className="w-4 h-4 text-champagneGold" />
            </div>
            <h3 className="font-serif font-bold text-lg text-text mb-2">Photo Privacy</h3>
            <p className="text-sm text-muted">Photos are controlled strictly by your privacy settings. Public, interest-only, or mutually accepted.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-lg transition-shadow group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-softRose transition-colors">
                <FileText className="w-5 h-5 text-deepBurgundy" />
              </div>
              <Lock className="w-4 h-4 text-champagneGold" />
            </div>
            <h3 className="font-serif font-bold text-lg text-text mb-2">Biodata Privacy</h3>
            <p className="text-sm text-muted">Your detailed family biodata PDF is protected and only available after mutual acceptance.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-lg transition-shadow group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-softRose transition-colors">
                <Phone className="w-5 h-5 text-deepBurgundy" />
              </div>
              <Lock className="w-4 h-4 text-champagneGold" />
            </div>
            <h3 className="font-serif font-bold text-lg text-text mb-2">Contact Details</h3>
            <p className="text-sm text-muted">Phone numbers and emails remain hidden. They are only revealed through authorized mutual connections.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-lg transition-shadow group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-softRose transition-colors">
                <Eye className="w-5 h-5 text-deepBurgundy" />
              </div>
              <Lock className="w-4 h-4 text-champagneGold" />
            </div>
            <h3 className="font-serif font-bold text-lg text-text mb-2">Profile Visibility</h3>
            <p className="text-sm text-muted">You completely control who can view your profile, and you can hide or delete it at any time.</p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
