-- ========================================================
-- JAINSAATHI PROFILE METRICS - MIGRATION 06
-- ========================================================

CREATE TABLE IF NOT EXISTS profile_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    viewer_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    profile_owner_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent a user from artificially inflating views by repeatedly viewing
    -- We can enforce uniqueness per viewer-owner pair, or just let the application
    -- logic handle debouncing, but for analytics, unique pairs per day is good.
    -- For simplicity, we just log raw views here.
    CONSTRAINT viewer_not_owner CHECK (viewer_id != profile_owner_id)
);

-- Index for fast counting
CREATE INDEX IF NOT EXISTS idx_profile_views_owner ON profile_views(profile_owner_id);

-- RLS
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

-- Users can insert views if they are authenticated and are the viewer
CREATE POLICY "Users can create views"
ON profile_views FOR INSERT
TO authenticated
WITH CHECK (viewer_id = (SELECT id FROM candidate_profiles WHERE user_id = auth.uid()));

-- Users can read their own received views
CREATE POLICY "Users can read their received views"
ON profile_views FOR SELECT
TO authenticated
USING (profile_owner_id = (SELECT id FROM candidate_profiles WHERE user_id = auth.uid()));
