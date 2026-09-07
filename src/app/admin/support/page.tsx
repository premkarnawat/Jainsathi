'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Search, Filter, Clock, CheckCircle, AlertCircle, 
  Send, User, Mail, Tag, RefreshCw, X, ChevronRight, MessageCircle, AlertTriangle
} from 'lucide-react';

interface SupportTicket {
  id: string;
  user_id: string | null;
  user_name: string;
  user_email: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  message: string;
  admin_reply: string | null;
  replied_at: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  
  // Reply modal state
  const [replyText, setReplyText] = useState('');
  const [newStatus, setNewStatus] = useState<'open' | 'in_progress' | 'resolved'>('resolved');
  const [savingReply, setSavingReply] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/tickets');
      const data = await res.json();
      if (data.success && Array.isArray(data.tickets)) {
        setTickets(data.tickets);
      }
    } catch (err) {
      console.error('Failed to load tickets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const openReplyModal = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setReplyText(ticket.admin_reply || '');
    setNewStatus(ticket.status === 'open' ? 'resolved' : ticket.status);
    setActionSuccess(null);
  };

  const handleSendReply = async () => {
    if (!selectedTicket) return;
    setSavingReply(true);
    try {
      const res = await fetch('/api/admin/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          adminReply: replyText,
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess('Reply saved and ticket updated successfully!');
        // Update local list
        setTickets(prev => prev.map(t => t.id === selectedTicket.id ? {
          ...t,
          admin_reply: replyText,
          status: newStatus,
          replied_at: new Date().toISOString(),
        } : t));
        if (selectedTicket) {
          setSelectedTicket({
            ...selectedTicket,
            admin_reply: replyText,
            status: newStatus,
            replied_at: new Date().toISOString(),
          });
        }
        setTimeout(() => {
          setSelectedTicket(null);
          setActionSuccess(null);
        }, 1200);
      } else {
        alert(data.error || 'Failed to update ticket');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating ticket');
    } finally {
      setSavingReply(false);
    }
  };

  // Filtered tickets
  const filteredTickets = tickets.filter(t => {
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      t.subject?.toLowerCase().includes(q) ||
      t.user_name?.toLowerCase().includes(q) ||
      t.user_email?.toLowerCase().includes(q) ||
      t.id?.toLowerCase().includes(q) ||
      t.category?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const totalCount = tickets.length;
  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-600 border border-red-500/30 uppercase">Urgent</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 border border-amber-500/30 uppercase">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-600 border border-blue-500/30 uppercase">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-500/15 text-gray-500 border border-gray-500/30 uppercase">Low</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/10 text-red-600 border border-red-500/20 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Open</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1"><Clock className="w-3 h-3" /> In Progress</span>;
      case 'resolved':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Resolved</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">Support Tickets & Inquiries</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage user help inquiries, profile verification requests, and payment questions.</p>
        </div>
        <button
          type="button"
          onClick={fetchTickets}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-gray-150 dark:border-white/5 shadow-xs">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Tickets</p>
          <p className="text-xl sm:text-2xl font-bold mt-1">{totalCount}</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-red-500/5 border border-red-500/20 shadow-xs">
          <p className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Open</p>
          <p className="text-xl sm:text-2xl font-bold text-red-600 mt-1">{openCount}</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 shadow-xs">
          <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">In Progress</p>
          <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-1">{inProgressCount}</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 shadow-xs">
          <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Resolved</p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">{resolvedCount}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-150 dark:border-white/5 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by user, email, subject, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:ring-1 focus:ring-[#8F173D]"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs font-bold">
          {(['all', 'open', 'in_progress', 'resolved'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap capitalize ${
                statusFilter === tab 
                  ? 'bg-[#8F173D] text-white shadow-xs' 
                  : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
            >
              {tab === 'all' ? 'All Tickets' : tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#8F173D] border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-500">Loading support inquiries...</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-white/5 border border-gray-150 dark:border-white/5">
          <MessageSquare className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm font-bold">No support tickets found</p>
          <p className="text-xs text-gray-400 mt-1">There are no inquiries matching your filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map(ticket => (
            <div
              key={ticket.id}
              onClick={() => openReplyModal(ticket)}
              className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-150 dark:border-white/5 hover:border-[#C59A4E]/50 transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2 flex-wrap">
                  {getStatusBadge(ticket.status)}
                  {getPriorityBadge(ticket.priority)}
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 uppercase">
                    {ticket.category}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    ID: #{ticket.id.slice(0, 8)}
                  </span>
                </div>
                <div className="text-[11px] text-gray-400">
                  {new Date(ticket.created_at).toLocaleString('en-IN', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                  })}
                </div>
              </div>

              <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold group-hover:text-[#8F173D] dark:group-hover:text-[#C59A4E] transition-colors line-clamp-1">
                    {ticket.subject}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {ticket.message}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform shrink-0 hidden sm:block" />
              </div>

              <div className="mt-3 pt-2.5 flex flex-wrap items-center justify-between text-xs text-gray-500 border-t border-gray-100 dark:border-white/5 gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 font-medium">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    {ticket.user_name}
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <Mail className="w-3.5 h-3.5" />
                    {ticket.user_email}
                  </span>
                </div>
                {ticket.admin_reply ? (
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Replied
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-red-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Awaiting Response
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ticket Details & Reply Modal / Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#1C1C24] border border-gray-200 dark:border-white/10 shadow-2xl p-5 sm:p-6 space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-200 dark:border-white/10">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  {getStatusBadge(selectedTicket.status)}
                  {getPriorityBadge(selectedTicket.priority)}
                  <span className="text-[11px] text-gray-400 font-mono">
                    #{selectedTicket.id.slice(0, 8)}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold">
                  {selectedTicket.subject}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  From <strong className="text-gray-800 dark:text-gray-200">{selectedTicket.user_name}</strong> ({selectedTicket.user_email})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Original User Query */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                User Query ({new Date(selectedTicket.created_at).toLocaleString('en-IN')})
              </span>
              <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                {selectedTicket.message}
              </p>
            </div>

            {/* Existing Admin Reply If Present */}
            {selectedTicket.admin_reply && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Previous Admin Reply
                  </span>
                  {selectedTicket.replied_at && (
                    <span className="text-[10px] text-gray-400">
                      {new Date(selectedTicket.replied_at).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {selectedTicket.admin_reply}
                </p>
              </div>
            )}

            {/* Reply Input Form */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold block">
                {selectedTicket.admin_reply ? 'Update Support Reply:' : 'Draft Admin Reply:'}
              </label>
              <textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your official support response here. The user will be notified..."
                className="w-full p-3 rounded-2xl text-xs sm:text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:ring-1 focus:ring-[#8F173D] leading-relaxed resize-y"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-gray-500">Update Status:</label>
                  <select
                    value={newStatus}
                    onChange={(e: any) => setNewStatus(e.target.value)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 outline-none"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendReply}
                    disabled={savingReply || !replyText.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-[#8F173D] hover:bg-[#73002B] text-white shadow-md disabled:opacity-50 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{savingReply ? 'Saving...' : 'Send & Save Reply'}</span>
                  </button>
                </div>
              </div>

              {actionSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-bold text-center border border-emerald-500/20">
                  {actionSuccess}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
