-- ========================================================
-- JAINSAATHI STORAGE SECURITY - ZERO TRUST ENFORCEMENT
-- ========================================================

-- Ensure buckets are PRIVATE
UPDATE storage.buckets SET public = false WHERE id IN ('profile-photos', 'biodata-pdfs');

-- Drop old policies if any
DROP POLICY IF EXISTS "Users can upload their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can manage their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own biodata" ON storage.objects;
DROP POLICY IF EXISTS "Connections can view biodata" ON storage.objects;
DROP POLICY IF EXISTS "Users can manage their own biodata" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own biodata" ON storage.objects;
DROP POLICY IF EXISTS "Authorized users can view biodata" ON storage.objects;

-- STRICT POLICIES FOR PROFILE-PHOTOS (PRIVATE BUCKET)
CREATE POLICY "Users can upload their own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'profile-photos' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Authenticated users can view photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can manage their own photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = auth.uid()::text);


-- STRICT POLICIES FOR BIODATA-PDFS (PRIVATE BUCKET)
CREATE POLICY "Users can upload their own biodata"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'biodata-pdfs' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can manage their own biodata"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'biodata-pdfs' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own biodata"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'biodata-pdfs' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Biodata SELECT requires checking connections
CREATE POLICY "Authorized users can view biodata"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'biodata-pdfs' AND (
        -- Owner
        (storage.foldername(name))[1] = auth.uid()::text
        OR 
        -- Or they are mutually connected (Mutual connection check via connections table)
        EXISTS (
            SELECT 1 FROM connections 
            WHERE (
                (candidate_a = (SELECT id FROM candidate_profiles WHERE user_id = auth.uid() LIMIT 1) AND candidate_b = (SELECT id FROM candidate_profiles WHERE user_id = (storage.foldername(name))[1]::uuid LIMIT 1))
                OR
                (candidate_b = (SELECT id FROM candidate_profiles WHERE user_id = auth.uid() LIMIT 1) AND candidate_a = (SELECT id FROM candidate_profiles WHERE user_id = (storage.foldername(name))[1]::uuid LIMIT 1))
            )
        )
    )
);
