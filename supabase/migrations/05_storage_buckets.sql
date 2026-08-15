-- ========================================================
-- JAINSAATHI STORAGE BUCKETS & RLS - MIGRATION 05
-- ========================================================

-- Insert standard buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('biodata-pdfs', 'biodata-pdfs', false)
ON CONFLICT (id) DO NOTHING;

-- RLS for profile-photos
-- 1. Users can upload their own photos
CREATE POLICY "Users can upload their own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'profile-photos' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 2. Users can view public or verified-only photos if they are authenticated
-- In a real scenario we might need complex joins via a DB function, but for storage RLS
-- it's usually simpler to restrict by user_id and handle visibility at the application level
-- or via signed URLs. We'll allow authenticated users to view photos.
CREATE POLICY "Authenticated users can view photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'profile-photos');

-- 3. Users can manage their own photos
CREATE POLICY "Users can update their own photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'profile-photos' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'profile-photos' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS for biodata-pdfs
CREATE POLICY "Users can upload their own biodata"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'biodata-pdfs' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Authenticated users can view biodatas"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'biodata-pdfs');

CREATE POLICY "Users can update their own biodata"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'biodata-pdfs' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own biodata"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'biodata-pdfs' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);
