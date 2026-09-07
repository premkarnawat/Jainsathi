'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, X, ChevronRight, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export interface ToastNotificationPayload {
  id?: string;
  title: string;
  message: string;
  type?: 'interest' | 'acceptance' | 'broadcast' | 'info';
  actionUrl?: string;
  actionText?: string;
}

export default function NotificationToast() {
  const router = useRouter();
  const [toasts, setToasts] = useState<ToastNotificationPayload[]>([]);

  useEffect(() => {
    const handleNotificationEvent = (e: CustomEvent<ToastNotificationPayload>) => {
      const newToast = {
        ...e.detail,
        id: e.detail.id || Math.random().toString(),
      };
      setToasts((prev) => [newToast, ...prev.slice(0, 2)]); // Keep max 3 toasts at once

      // Auto-dismiss after 6 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 6000);
    };

    window.addEventListener('jainsaathi:notification' as any, handleNotificationEvent);
    return () => {
      window.removeEventListener('jainsaathi:notification' as any, handleNotificationEvent);
    };
  }, []);

  const removeToast = (id?: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <aside aria-label="Notifications" className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100vw-2rem)] pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto bg-[#FFFDFB] text-[#241B20] border-2 border-[#8F173D]/30 rounded-2xl p-4 shadow-2xl backdrop-blur-md relative overflow-hidden"
          >
            {/* Top Accent Gold Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8F173D] via-[#D4AF37] to-[#8F173D]" />

            <div className="flex items-start gap-3">
              {/* Icon based on notification type */}
              <div className="w-9 h-9 rounded-xl bg-[#8F173D]/10 text-[#8F173D] flex items-center justify-center shrink-0 mt-0.5">
                {toast.type === 'interest' ? (
                  <Heart className="w-5 h-5 fill-[#8F173D] text-[#8F173D] animate-pulse" />
                ) : toast.type === 'acceptance' ? (
                  <Sparkles className="w-5 h-5 text-[#C59A4E]" />
                ) : (
                  <Bell className="w-5 h-5 text-[#8F173D]" />
                )}
              </div>

              <div className="flex-1 min-w-0 pr-6">
                <h4 className="text-xs font-bold text-[#8F173D] uppercase tracking-wider">
                  {toast.title}
                </h4>
                <p className="text-xs text-[#5C4D56] mt-0.5 leading-relaxed">
                  {toast.message}
                </p>

                {toast.actionUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      if (toast.actionUrl) router.push(toast.actionUrl);
                      removeToast(toast.id);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8F173D] hover:underline mt-2"
                  >
                    <span>{toast.actionText || 'View Details'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors p-1"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </aside>
  );
}

// Global dispatcher helper
export function triggerNotificationToast(payload: ToastNotificationPayload) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('jainsaathi:notification', { detail: payload }));
  }
}
