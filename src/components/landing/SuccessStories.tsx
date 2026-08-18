'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

export default function SuccessStories() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to fetch actual success stories if table exists
    const fetchStories = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        // Assuming a success_stories table might exist in the future
        const { data, error } = await supabase.from('success_stories').select('*').limit(3);
        if (!error && data) {
          setStories(data);
        }
      } catch (err) {
        // Ignore error if table doesn't exist yet
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  return (
    <section id="success-stories" className="py-24 bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl font-bold text-text mb-6">
              Meaningful <span className="italic text-deepBurgundy font-normal">Connections</span>
            </h2>
            <p className="text-lg text-muted">
              Discover stories of families and individuals who found their perfect match through JainSaathi.
            </p>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-champagneGold border-t-deepBurgundy animate-spin" />
          </div>
        ) : stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stories.map((story, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-secondary rounded-2xl p-8 border border-border"
              >
                <Quote className="w-8 h-8 text-champagneGold mb-4 opacity-50" />
                <p className="text-text italic mb-6">"{story.quote}"</p>
                <div>
                  <p className="font-serif font-bold text-deepBurgundy">{story.couple_names}</p>
                  <p className="text-xs text-muted uppercase tracking-wider">{story.wedding_date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-secondary rounded-2xl p-12 border border-border text-center max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[300px]"
          >
            <Quote className="w-12 h-12 text-champagneGold mb-6 opacity-30" />
            <h3 className="font-serif text-2xl font-bold text-text mb-4">Beautiful stories are being written.</h3>
            <p className="text-muted max-w-md mx-auto">
              As our platform brings Jain families together, verified success stories will appear here. Start your journey today to find your Jain Saathi.
            </p>
          </motion.div>
        )}

      </div>
    </section>
  );
}
