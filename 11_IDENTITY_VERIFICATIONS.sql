-- ========================================================
-- JAINSAATHI IDENTITY VERIFICATIONS STORAGE & DB SETUP
-- ========================================================

-- 1. Create Storage Buckets (PRIVATE by default)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('verification-selfies', 'verification-selfies', false, 15728640, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']),
  ('verification-documents', 'verification-documents', false, 15728640, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET 
  public = false,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage RLS Policies
-- Selfies: Users can upload, Admins can read
DROP POLICY IF EXISTS "Users can upload selfies" ON storage.objects;
CREATE POLICY "Users can upload selfies" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'verification-selfies');

-- Documents: Users can upload, Admins can read
DROP POLICY IF EXISTS "Users can upload documents" ON storage.objects;
CREATE POLICY "Users can upload documents" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'verification-documents');

-- 3. Database Table for Verification tracking
CREATE TABLE IF NOT EXISTS identity_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    selfie_path TEXT NOT NULL,
    document_path TEXT NOT NULL,
    status verification_status_type DEFAULT 'pending',
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES users(id),
    notes TEXT
);

-- 4. Enable RLS on identity_verifications
ALTER TABLE identity_verifications ENABLE ROW LEVEL SECURITY;

-- Users can insert their own verification records
DROP POLICY IF EXISTS "Users can insert own verification" ON identity_verifications;
CREATE POLICY "Users can insert own verification" ON identity_verifications FOR INSERT WITH CHECK (
    candidate_id IN (SELECT candidate_id FROM profile_members WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid()))
);

-- Users can view their own verification status
DROP POLICY IF EXISTS "Users can view own verification" ON identity_verifications;
CREATE POLICY "Users can view own verification" ON identity_verifications FOR SELECT USING (
    candidate_id IN (SELECT candidate_id FROM profile_members WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid()))
);
