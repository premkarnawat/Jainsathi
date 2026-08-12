# 🛕 JainSaathi - Verified Jain Matrimony Platform

> **Tagline**: *"Find Your Jain Saathi."*  
> **Product Category**: Verified Jain-Only Matrimonial Platform (Web + Mobile)

---

## 📖 Architecture & Technical Overview

JainSaathi is a production-grade matrimonial platform built for Jain families and candidates across India and abroad. It replaces traditional PDF biodata & WhatsApp sharing workflows with a secure, culture-focused platform featuring:

1. **Responsive Web App**: Built with Next.js (App Router), TypeScript, Tailwind CSS, and Framer Motion.
2. **Mobile App**: Built with Expo (React Native) sharing the Supabase backend.
3. **Database & Storage**: Supabase PostgreSQL with 25+ normalized tables and Row Level Security (RLS).
4. **Auth & OTP**: Real phone number authentication flow with rate limiting.
5. **Deterministic Matching Engine**: 100% weighted score pipeline evaluating hard constraints and soft criteria.
6. **Privacy & Contact Reveals**: Server-side authorized contact reveals with plan entitlement enforcement.
7. **Payment Architecture**: Server-side Razorpay order creation and HMAC-SHA256 signature verification.
8. **Admin Portal**: Candidate verification queues, taxonomy management, moderation, and auditing.

---

## 🛠️ Local Development & Setup

### 1. Prerequisites
- Node.js v18.0.0+
- npm or yarn

### 2. Environment Variables
Copy `.env.example` to `.env.local` and set your credentials:
```bash
cp .env.example .env.local
```

### 3. Database Migration & RLS Execution
Apply the PostgreSQL migration files in order in your Supabase SQL Editor:
1. `supabase/migrations/01_initial_schema.sql` (Schema DDL)
2. `supabase/migrations/02_rls_policies.sql` (Row Level Security)
3. `supabase/migrations/03_reference_seed_data.sql` (Taxonomy & States/Cities)

### 4. Running the Web Application
```bash
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🔒 Security & Privacy Architecture

- **No Exposed Secrets**: `SUPABASE_SERVICE_ROLE_KEY` and `RAZORPAY_SECRET` are strictly used on server routes (`src/app/api/`).
- **Contact Reveal Authorization**: Sensitive phone numbers and email addresses are NOT included in public profile API responses. They require mutual connection and active plan entitlements checked on the server.
- **Image Security**: Photos and Biodata PDFs use Supabase private storage buckets with signed URLs.
