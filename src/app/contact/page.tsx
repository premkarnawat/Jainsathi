'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { 
  Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, 
  HelpCircle, MessageCircle, AlertCircle, Shield
} from 'lucide-react';

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  whatsapp: string;
  supportHours: string;
}

const DEFAULT_CONTACT: ContactInfo = {
  email: 'support@jainsaathi.com',
  phone: '+91 98765 43210',
  address: 'Nariman Point, Mumbai, Maharashtra 400021, India',
  whatsapp: '+91 98765 43210',
  supportHours: 'Monday - Saturday: 9:00 AM - 7:00 PM IST',
};

export default function ContactUsPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(DEFAULT_CONTACT);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    priority: 'medium',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadContact() {
      try {
        const res = await fetch('/api/settings?key=contact_info');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.setting?.value) {
            setContactInfo(prev => ({
              ...prev,
              ...data.setting.value,
            }));
          }
        }
      } catch (_) {
        // Safe fallback
      }
    }
    loadContact();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setSubmittedTicket(data.ticket);
        setFormData({
          name: '',
          email: '',
          subject: '',
          category: 'general',
          priority: 'medium',
          message: '',
        });
      } else {
        setErrorMessage(data.error || 'Failed to submit ticket. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage('Network error submitting your inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDFB] font-sans text-[#24131D] flex flex-col justify-between">
      <Header />

      <main className="pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8F173D]/10 text-[#8F173D] text-[11px] font-bold uppercase tracking-wider mb-3">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Dedicated Support & Assistance</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#8F173D] tracking-tight">
            We Are Here To Help
          </h1>
          <p className="text-xs sm:text-sm text-[#705662] mt-2">
            Have questions about profile verification, membership plans, or finding your Jain Saathi? Our support team is at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Live Official Contact Cards (Col 1-5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-[#EADFCB] shadow-xs space-y-6">
              <h2 className="font-serif text-xl font-bold text-[#8F173D] border-b border-[#EADFCB] pb-3">
                Official Contact Channels
              </h2>

              {/* Email Card */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#8F173D]/10 text-[#8F173D] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Us</p>
                  <a href={`mailto:${contactInfo.email}`} className="text-sm font-bold text-[#24131D] hover:text-[#8F173D] transition-colors block mt-0.5">
                    {contactInfo.email}
                  </a>
                  <p className="text-[11px] text-gray-400 mt-0.5">Responses typically within 2-4 hours</p>
                </div>
              </div>

              {/* Phone Card */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#C59A4E]/15 text-[#9E6F18] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Call Support</p>
                  <a href={`tel:${contactInfo.phone}`} className="text-sm font-bold text-[#24131D] hover:text-[#8F173D] transition-colors block mt-0.5">
                    {contactInfo.phone}
                  </a>
                  <p className="text-[11px] text-gray-400 mt-0.5">Direct member helpline</p>
                </div>
              </div>

              {/* WhatsApp Card */}
              {contactInfo.whatsapp && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">WhatsApp Concierge</p>
                    <a 
                      href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-emerald-700 hover:underline block mt-0.5"
                    >
                      {contactInfo.whatsapp}
                    </a>
                    <p className="text-[11px] text-gray-400 mt-0.5">Quick text assistance on WhatsApp</p>
                  </div>
                </div>
              )}

              {/* Working Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Working Hours</p>
                  <p className="text-sm font-bold text-[#24131D] mt-0.5">{contactInfo.supportHours}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Emergency support available 24/7</p>
                </div>
              </div>

              {/* Office Address */}
              <div className="flex items-start gap-4 pt-2 border-t border-gray-100">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Registered Office</p>
                  <p className="text-xs font-medium text-[#4A3B43] mt-0.5 leading-relaxed">
                    {contactInfo.address}
                  </p>
                </div>
              </div>

            </div>

            {/* Privacy Shield Info */}
            <div className="p-4 rounded-2xl bg-[#C59A4E]/10 border border-[#C59A4E]/20 flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#9E6F18] shrink-0" />
              <p className="text-xs text-[#705662] leading-tight">
                All communications and inquiries are strictly confidential and governed by our strict community safety policy.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Support Ticket Form (Col 6-12) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#EADFCB] shadow-sm">
              <h2 className="font-serif text-xl font-bold text-[#8F173D] mb-1">
                Send a Message or Raise a Ticket
              </h2>
              <p className="text-xs text-gray-500 mb-6">
                Fill out the form below. Your request will be directly routed to our admin support team.
              </p>

              {submittedTicket ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-500/30">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-800">Support Ticket Created!</h3>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                    Thank you! Your ticket <strong className="font-mono">#{submittedTicket.id?.slice(0, 8)}</strong> has been registered. Our dedicated relationship team will review and reply to <span className="underline">{submittedTicket.user_email}</span> promptly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmittedTicket(null)}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-500/10 text-red-600 text-xs font-bold border border-red-500/20 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Shah"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-gray-50 border border-gray-200 outline-none focus:ring-1 focus:ring-[#8F173D]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Your Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rahul@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-gray-50 border border-gray-200 outline-none focus:ring-1 focus:ring-[#8F173D]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-gray-50 border border-gray-200 outline-none focus:ring-1 focus:ring-[#8F173D]"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="verification">ID & Biodata Verification</option>
                        <option value="billing">Membership & Plans</option>
                        <option value="matchmaking">Matchmaking & Profiles</option>
                        <option value="technical">Technical Support</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-gray-50 border border-gray-200 outline-none focus:ring-1 focus:ring-[#8F173D]"
                      >
                        <option value="low">Low - General Question</option>
                        <option value="medium">Medium - Normal Request</option>
                        <option value="high">High - Time Sensitive</option>
                        <option value="urgent">Urgent - Account / Payment Issue</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Subject *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Question regarding profile photo verification"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-gray-50 border border-gray-200 outline-none focus:ring-1 focus:ring-[#8F173D]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Message Description *</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Please provide complete details so we can best assist you..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-gray-50 border border-gray-200 outline-none focus:ring-1 focus:ring-[#8F173D] resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#8F173D] hover:bg-[#72002E] text-white font-bold text-xs uppercase tracking-wider shadow-md disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Submitting Your Inquiry...' : 'Submit Support Ticket'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
