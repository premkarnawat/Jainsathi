'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Search, Heart, Users } from 'lucide-react';

export default function FeaturesShowcase() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
        
        {/* Verification */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1 relative"
          >
            <div className="relative h-80 rounded-3xl bg-secondary border border-border p-8 flex flex-col justify-center items-center shadow-lg">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-deepBurgundy/10 flex items-center justify-center relative">
                  <Shield className="w-8 h-8 text-deepBurgundy" />
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center border-2 border-white"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </motion.div>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xl text-text">Profile Verification</h4>
                  <p className="text-sm text-muted mt-2">Mobile OTP • Photo ID • Admin Review</p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <h2 className="font-serif text-4xl font-bold text-text mb-6">Trust Begins With Verification</h2>
            <p className="text-lg text-muted mb-6 leading-relaxed">
              We employ a multi-layered verification system including Mobile OTP, selfie matching, and administrative review to ensure a trusted community.
            </p>
          </motion.div>
        </div>

        {/* Search Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl font-bold text-text mb-6">Precision Search</h2>
            <p className="text-lg text-muted mb-6 leading-relaxed">
              Find exactly who you are looking for. Filter by Jain Sect, education, location, lifestyle, and more to discover highly compatible profiles.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl bg-secondary border border-border p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <Search className="w-6 h-6 text-muted" />
                <div className="h-2 w-32 bg-border rounded-full" />
              </div>
              <div className="flex flex-wrap gap-3">
                {['Mumbai', '25–30 Years', 'Shwetambar', 'MBA', 'Vegetarian'].map((chip, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="px-4 py-2 rounded-full border border-champagneGold bg-white text-sm font-medium text-deepBurgundy shadow-sm"
                  >
                    {chip}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Family Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1 relative"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-secondary rounded-2xl p-6 border border-border">
                <Users className="w-8 h-8 text-deepBurgundy mb-4" />
                <h4 className="font-serif font-bold text-lg text-text mb-2">For Parents</h4>
                <p className="text-sm text-muted">Manage a matrimonial profile on behalf of your son or daughter.</p>
              </div>
              <div className="bg-white shadow-lg rounded-2xl p-6 border border-champagneGold/50 transform sm:translate-y-8">
                <Heart className="w-8 h-8 text-champagneGold mb-4" />
                <h4 className="font-serif font-bold text-lg text-text mb-2">For Candidates</h4>
                <p className="text-sm text-muted">Create and manage your own profile securely.</p>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <h2 className="font-serif text-4xl font-bold text-text mb-6">Made For Individuals. Trusted By Families.</h2>
            <p className="text-lg text-muted mb-6 leading-relaxed">
              Jain marriages bring families together. Our platform supports profile management for both independent candidates and involved parents or guardians.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
