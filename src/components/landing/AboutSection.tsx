'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-background relative overflow-hidden">
      {/* Subtle background decorative shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full border border-champagneGold/30" />
        <div className="absolute top-20 -left-20 w-64 h-64 rounded-full border border-deepBurgundy/10" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-text mb-8">
            Modern Matchmaking. <br />
            <span className="italic text-deepBurgundy font-normal">Rooted in Jain Values.</span>
          </h2>
          
          <div className="space-y-6 text-lg text-muted font-sans leading-relaxed">
            <p>
              JainSaathi is built specifically for the Jain community to make matrimonial discovery more organized, transparent, and privacy-conscious. We understand that Jain marriages are a union of families, built on shared cultural values and traditions.
            </p>
            <p>
              Whether you are an individual searching for a life partner, or a parent managing a profile for your child, JainSaathi provides a secure ecosystem. You can set detailed partner preferences, discover recommended matches, manage mutual connections, and reveal contact details only when authorized.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
