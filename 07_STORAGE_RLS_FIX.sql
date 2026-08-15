-- ========================================================
-- JAINSAATHI STORAGE SECURITY - RED TEAM RLS FIX
-- ========================================================

DROP POLICY IF EXISTS "Authorized users can view biodata" ON storage.objects;

-- Biodata SELECT requires checking connections safely
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
                (candidate_a IN (SELECT id FROM candidate_profiles WHERE user_id = auth.uid()) 
                 AND candidate_b IN (SELECT id FROM candidate_profiles WHERE user_id::text = (storage.foldername(name))[1]))
                OR
                (candidate_b IN (SELECT id FROM candidate_profiles WHERE user_id = auth.uid()) 
                 AND candidate_a IN (SELECT id FROM candidate_profiles WHERE user_id::text = (storage.foldername(name))[1]))
            )
        )
    )
);
