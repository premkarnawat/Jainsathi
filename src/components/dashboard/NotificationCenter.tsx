'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, Check, Megaphone, Sparkles, Heart, UserCheck, 
  Clock, X, CheckCheck, ChevronRight, ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface BroadcastNotice {
  id: string;
  title: string;
  message: string;
  priority: 'general' | 'important' | 'urgent' | 'celebration';
  created_at: string;
}

interface InAppNotification {
  id: string;
  user_id: string | null;
  title: string;
  body: string;
  type: string;
  data: any;
  is_read: boolean;
  created_at: string;
}

interface NotificationCenterProps {
  userId?: string;
  className?: string;
}

export default function NotificationCenter({ userId, className = '' }: NotificationCenterProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'broadcasts' | 'requests'>('all');
  
  const [broadcasts, setBroadcasts] = useState<BroadcastNotice[]>([]);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const popoverRef = useRef<HTMLDivElement>(null);

  const fetchNotificationData = async () => {
    try {
      // 1. Fetch active broadcasts (Admin notices)
      const bRes = await fetch('/api/broadcasts');
      if (bRes.ok) {
        const bData = await bRes.json();
        if (bData.success && Array.isArray(bData.broadcasts)) {
          setBroadcasts(bData.broadcasts);
        }
      }

      // 2. Fetch user notifications
      const nRes = await fetch(`/api/notifications?userId=${userId || ''}`);
      if (nRes.ok) {
        const nData = await nRes.json();
        if (nData.success && Array.isArray(nData.notifications)) {
          setNotifications(nData.notifications);
          setUnreadCount(nData.unreadCount || 0);
        }
      }
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  useEffect(() => {
    fetchNotificationData();

    // Listen for custom toast/notification events to auto-refresh
    const handleRefresh = () => {
      fetchNotificationData();
    };
    window.addEventListener('jainsaathi:notification' as any, handleRefresh);
    
    // Periodically sync every 60s
    const interval = setInterval(fetchNotificationData, 60000);

    return () => {
      window.removeEventListener('jainsaathi:notification' as any, handleRefresh);
      clearInterval(interval);
    };
  }, [userId]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          markAllRead: true,
          userId: userId || undefined,
        }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (notif: InAppNotification) => {
    if (!notif.is_read) {
      try {
        await fetch('/api/notifications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notificationId: notif.id }),
        });
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (_) {}
    }

    setIsOpen(false);

    // Route based on type
    if (notif.type === 'interest_received' || notif.type === 'interest') {
      router.push('/interests');
    } else if (notif.type === 'connection' || notif.type === 'interest_accepted') {
      router.push('/connections');
    } else if (notif.type === 'verification') {
      router.push('/profile');
    }
  };

  // Compute items based on tab
  const totalBroadcasts = broadcasts.length;
  const totalNotifications = notifications.length;
  const totalBadge = unreadCount + (totalBroadcasts > 0 ? 1 : 0);

  return (
    <div className={`relative ${className}`} ref={popoverRef}>
      {/* Bell Icon Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-[#F7E5EA]/50 rounded-full transition-colors relative cursor-pointer flex items-center justify-center text-[#8F0038]"
        title="Notifications & System Notices"
        aria-label="Open Notifications"
      >
        <Bell className="w-5 h-5 sm:w-5 sm:h-5" />
        
        {totalBadge > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#8F0038] text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#FFFDFB] shadow-xs">
            {totalBadge > 9 ? '9+' : totalBadge}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-3 top-16 sm:absolute sm:inset-auto sm:right-0 sm:top-12 w-auto sm:w-[410px] max-h-[82vh] bg-[#FFFDFB] border border-[#EADFCB] rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden text-[#241B20]"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#EADFCB] flex items-center justify-between bg-gradient-to-b from-[#FAF4EC] to-[#FFFDFB]">
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-[#8F0038]">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8F0038] text-white">
                    {unreadCount} New
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-bold text-[#8F0038] hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-black hover:bg-black/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-[#EADFCB] px-4 pt-2 gap-2 text-xs font-bold bg-[#FAF4EC]/40">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`pb-2.5 px-2 transition-colors relative ${
                  activeTab === 'all' ? 'text-[#8F0038]' : 'text-gray-500 hover:text-black'
                }`}
              >
                All ({totalBroadcasts + totalNotifications})
                {activeTab === 'all' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8F0038]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('broadcasts')}
                className={`pb-2.5 px-2 transition-colors relative flex items-center gap-1.5 ${
                  activeTab === 'broadcasts' ? 'text-[#8F0038]' : 'text-gray-500 hover:text-black'
                }`}
              >
                <Megaphone className="w-3 h-3 text-[#C59A4E]" />
                <span>Broadcasts ({totalBroadcasts})</span>
                {activeTab === 'broadcasts' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8F0038]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('requests')}
                className={`pb-2.5 px-2 transition-colors relative flex items-center gap-1.5 ${
                  activeTab === 'requests' ? 'text-[#8F0038]' : 'text-gray-500 hover:text-black'
                }`}
              >
                <Heart className="w-3 h-3 text-[#8F0038]" />
                <span>Requests ({totalNotifications})</span>
                {activeTab === 'requests' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8F0038]" />
                )}
              </button>
            </div>

            {/* Content List */}
            <div className="overflow-y-auto flex-1 p-3 sm:p-4 space-y-2.5 divide-y divide-gray-100">
              
              {/* BROADCASTS SECTION */}
              {(activeTab === 'all' || activeTab === 'broadcasts') && broadcasts.map((b) => (
                <div
                  key={`bc-${b.id}`}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-[#FAF0E6] to-[#FFF8F0] border border-[#EADFCB] hover:border-[#C59A4E] transition-all shadow-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#C59A4E]/20 text-[#9E6F18] flex items-center justify-center shrink-0 mt-0.5">
                      <Megaphone className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#8F173D] tracking-wider">
                          Official Notice
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(b.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short'
                          })}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-[#8F173D] leading-snug">
                        {b.title}
                      </h4>
                      <p className="text-[11px] text-[#5C4D56] mt-1 leading-relaxed">
                        {b.message}
                      </p>
                      <span className="text-[9.5px] text-[#9E6F18] font-bold block mt-1.5 italic">
                        Notice persists here until removed by admin.
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* USER NOTIFICATIONS SECTION */}
              {(activeTab === 'all' || activeTab === 'requests') && notifications.map((n) => (
                <div
                  key={`notif-${n.id}`}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3 rounded-2xl transition-all cursor-pointer flex items-start gap-3 ${
                    !n.is_read 
                      ? 'bg-[#8F173D]/5 hover:bg-[#8F173D]/10 border border-[#8F173D]/20' 
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-[#8F173D]/10 text-[#8F173D] flex items-center justify-center shrink-0 mt-0.5">
                    {n.type?.includes('interest') ? (
                      <Heart className="w-4 h-4 fill-[#8F173D]" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-[#241B20] truncate">
                        {n.title}
                      </h4>
                      {!n.is_read && (
                        <span className="w-2 h-2 rounded-full bg-[#8F173D] shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-2 leading-relaxed">
                      {n.body}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {new Date(n.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))}

              {/* EMPTY STATE */}
              {((activeTab === 'all' && totalBroadcasts === 0 && totalNotifications === 0) ||
                (activeTab === 'broadcasts' && totalBroadcasts === 0) ||
                (activeTab === 'requests' && totalNotifications === 0)) && (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-600">No notifications yet</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">You are all caught up!</p>
                </div>
              )}

            </div>

            {/* Bottom Footer */}
            <div className="p-3 border-t border-[#EADFCB] bg-[#FAF4EC]/30 text-center">
              <span className="text-[10px] text-gray-500 font-medium">
                JainSaathi Live Notification Desk
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
