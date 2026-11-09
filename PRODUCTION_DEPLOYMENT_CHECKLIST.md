# JAINSAATHI – PRODUCTION DEPLOYMENT CHECKLIST
**Target Environment:** Vercel + Supabase Production  
**Branch:** `main`  
**Node Version:** 20.x  

---

## 1. Environment Variables Configuration (Vercel Project Settings)

Ensure the following environment variables are set in the Vercel dashboard (`Settings -> Environment Variables`):

### Core Application & Supabase
| Variable Name | Required | Description | Example / Note |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **YES** | Active Supabase project URL | `https://vqnbypdytxkmqgdsbswv.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **YES** | Public Supabase anon key | Standard Supabase anon JWT |
| `SUPABASE_SERVICE_ROLE_KEY` | **YES** | Service role key for admin auth provisioning | Required for `/api/auth/phone-login` and admin OTP |
| `DATABASE_URL` | **YES** | Direct PostgreSQL connection string | `postgres://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres` |

### Security & Rate Limiting
| Variable Name | Required | Description | Example / Note |
|---|---|---|---|
| `UPSTASH_REDIS_REST_URL` | OPTIONAL | Distributed Redis URL | In-memory fallback is active if omitted |
| `UPSTASH_REDIS_REST_TOKEN` | OPTIONAL | Distributed Redis Token | In-memory fallback is active if omitted |

### Payments (Razorpay)
| Variable Name | Required | Description | Example / Note |
|---|---|---|---|
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | OPTIONAL | Razorpay Public Key ID | When omitted, app runs in Mock Simulation Mode |
| `RAZORPAY_SECRET` | OPTIONAL | Razorpay Secret Key | Required for live HMAC verification |

### SMTP / Email Service
| Variable Name | Required | Description | Example / Note |
|---|---|---|---|
| `SMTP_HOST` | OPTIONAL | Outgoing SMTP host | Defaults to `smtp.gmail.com` |
| `SMTP_PORT` | OPTIONAL | Outgoing SMTP port | Defaults to `587` |
| `SMTP_USER` | OPTIONAL | SMTP login username | When omitted, OTP falls back to dev logging |
| `SMTP_PASS` | OPTIONAL | SMTP application password | When omitted, OTP falls back to dev logging |

---

## 2. Supabase Database Migration Checklist

Run the following SQL migrations in the Supabase SQL Editor if not already applied:
- [x] `supabase/migrations/01_initial_schema.sql`
- [x] `supabase/migrations/02_security_rls.sql`
- [x] `supabase/migrations/03_plans_and_payments.sql`
- [x] `supabase/migrations/04_matching_rpc.sql`
- [x] `supabase/migrations/05_matching_rpc_v2.sql` (Applies block exclusion & fixes saved profiles retention)

---

## 3. Storage Bucket Configuration (Supabase Dashboard)

1. Verify `avatars` bucket exists and is set to **Public**.
2. Verify `photos` bucket exists and is set to **Public**.
3. Verify `biodata` bucket exists and is set to **Private** (documents accessed strictly via signed URLs from `/api/biodata/[id]`).

---

## 4. Final Deployment Verification Steps

1. **Push to `main` Branch:**
   ```bash
   git push origin main
   ```
2. **Monitor Vercel Deployment:**
   - Verify build completes with 0 errors.
   - Verify Edge Middleware bundle is ~86 kB.
3. **Smoke Test Production URL:**
   - [ ] Visit home page `/` (instant load, no 504).
   - [ ] Visit `/pricing` (loads interactive horizontal rope carousel).
   - [ ] Test admin login `/admin/login`.
   - [ ] Test user login `/login`.
   - [ ] Test candidate registration `/register`.
