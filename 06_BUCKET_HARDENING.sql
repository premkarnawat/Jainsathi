-- ========================================================
-- JAINSAATHI STORAGE - MIME TYPE & SIZE HARDENING
-- ========================================================

-- Hardening profile-photos to only allow images up to 5MB
UPDATE storage.buckets 
SET 
  file_size_limit = 5242880, -- 5MB in bytes
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
WHERE id = 'profile-photos';

-- Hardening biodata-pdfs to only allow PDFs up to 10MB
UPDATE storage.buckets 
SET 
  file_size_limit = 10485760, -- 10MB in bytes
  allowed_mime_types = ARRAY['application/pdf']
WHERE id = 'biodata-pdfs';
