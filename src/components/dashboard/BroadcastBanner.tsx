'use client';

import React, { useState, useEffect } from 'react';
import { Megaphone, X, Sparkles, AlertCircle, Info, ChevronRight, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BroadcastNotice {
  id: string;
  title: string;
  message: string;
  priority: 'general' | 'important' | 'urgent' | 'celebration';
  created_at: string;
}

export default function BroadcastBanner() {
  const [activeBroadcast, setActiveBroadcast] = useState<BroadcastNotice | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [justDismissed, setJustDismissed] = useState(false);

  useEffect(() => {
    async function fetchBroadcast() {
      try {
        const res = await fetch('/api/broadcasts');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.broadcasts?.length > 0) {
            const latest = data.broadcasts[0];
            
            // Check if user previously cut/dismissed this specific broadcast from the main screen
            const dismissedIds = JSON.parse(localStorage.getItem('js_dismissed_broadcasts') || '[]');
            if (dismissedIds.includes(latest.id)) {
              setIsDismissed(true);
            } else {
              setActiveBroadcast(latest);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching broadcast notice', err);
      }
    }
    fetchBroadcast();
  }, []);

  const handleDismiss = () => {
    if (!activeBroadcast) return;
    
    // Save to dismissed broadcasts in localStorage
    try {
      const dismissedIds = JSON.parse(localStorage.getItem('js_dismissed_broadcasts') || '[]');
      if (!dismissedIds.includes(activeBroadcast.id)) {
        dismissedIds.push(activeBroadcast.id);
        localStorage.setItem('js_dismissed_broadcasts', JSON.stringify(dismissedIds));
      }
    } catch (_) {
      // LocalStorage fallback
    }

    setIsDismissed(true);
    setJustDismissed(true);
    setTimeout(() => {
      setJustDismissed(false);
      setActiveBroadcast(null);
    }, 4000);
  };

  if (!activeBroadcast || isDismissed && !justDismissed) return null;

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return {
          cardBg: 'bg-gradient-to-r from-[#5C0A1E] via-[#7B0D28] to-[#5C0A1E]',
          borderColor: 'border-red-400/40',
          badgeText: 'Urgent Notice',
          badgeColor: 'bg-red-500 text-white',
          icon: AlertCircle,
        };
      case 'celebration':
        return {
          cardBg: 'bg-gradient-to-r from-[#4A0A1C] via-[#630E26] to-[#4A0A1C]',
          borderColor: 'border-[#D4AF37]/50',
          badgeText: 'Special Announcement',
          badgeColor: 'bg-gradient-to-r from-[#D4AF37] to-[#C59A4E] text-[#121214]',
          icon: Sparkles,
        };
      case 'important':
        return {
          cardBg: 'bg-gradient-to-r from-[#2B1B26] via-[#3D1A2E] to-[#2B1B26]',
          borderColor: 'border-amber-400/40',
          badgeText: 'Important Notice',
          badgeColor: 'bg-amber-500 text-white',
          icon: Megaphone,
        };
      default:
        return {
          cardBg: 'bg-gradient-to-r from-[#24131D] via-[#351928] to-[#24131D]',
          borderColor: 'border-white/15',
          badgeText: 'System Notice',
          badgeColor: 'bg-white/20 text-white',
          icon: Info,
        };
    }
  };

  const style = getPriorityStyle(activeBroadcast.priority);
  const IconComponent = style.icon;

  return (
    <div className="w-full mb-6 select-none">
      <AnimatePresence>
        {!isDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
            className={`relative rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-white shadow-xl border ${style.borderColor} ${style.cardBg} overflow-hidden`}
          >
            {/* Ambient Background Lotus Watermark */}
            <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
              <Sparkles className="w-36 h-36 text-[#D4AF37]" />
            </div>

            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/15 shadow-inner">
                  <IconComponent className="w-5 h-5 text-[#D4AF37]" />
                </div>

                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-[9px] sm:text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full tracking-wider shadow-xs ${style.badgeColor}`}>
                      {style.badgeText}
                    </span>
                    <span className="text-[11px] text-white/50">
                      {new Date(activeBroadcast.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short'
                      })}
                    </span>
                  </div>

                  <h3 className="font-serif text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                    {activeBroadcast.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/80 mt-1 leading-relaxed max-w-3xl">
                    {activeBroadcast.message}
                  </p>
                </div>
              </div>

              {/* Cut / Dismiss Button */}
              <button
                type="button"
                onClick={handleDismiss}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors shrink-0 cursor-pointer"
                title="Cut from main screen (Saved in notifications)"
                aria-label="Close announcement"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Hint when cut */}
      {justDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-2 p-2.5 rounded-xl bg-[#8F173D]/10 border border-[#8F173D]/20 text-[11px] font-medium text-[#8F173D] flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Bell className="w-3.5 h-3.5 text-[#C59A4E]" />
            <span>Notice dismissed from main screen. It is saved in your Notification Bell 🔔.</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
