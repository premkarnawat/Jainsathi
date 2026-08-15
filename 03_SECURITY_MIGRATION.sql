-- ========================================================
-- JAINSAATHI SECURITY OVERHAUL - STRICT RLS ENFORCEMENT
-- ========================================================

-- Enable RLS on ALL tables to ensure DENY BY DEFAULT
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE jain_identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifestyle_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE employment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_privacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE biodatas ENABLE ROW LEVEL SECURITY;
ALTER TABLE interest_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_reveals ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE not_interested_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

-- Utility Function for determining if user manages profile
CREATE OR REPLACE FUNCTION auth_is_profile_manager(p_candidate_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profile_members
    WHERE candidate_id = p_candidate_id
    AND user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );
$$;

-- Utility Function for checking connection
CREATE OR REPLACE FUNCTION auth_is_connected(p_candidate_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM connections
    WHERE (candidate_a = p_candidate_id AND candidate_b IN (SELECT candidate_id FROM profile_members WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid())))
       OR (candidate_b = p_candidate_id AND candidate_a IN (SELECT candidate_id FROM profile_members WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid())))
  );
$$;

-- Drop missing or poorly formed policies on sub-tables and recreate
DROP POLICY IF EXISTS "Manage own lifestyle" ON lifestyle_profiles;
CREATE POLICY "Manage own lifestyle" ON lifestyle_profiles FOR ALL USING (auth_is_profile_manager(candidate_id));
CREATE POLICY "View lifestyle" ON lifestyle_profiles FOR SELECT USING (TRUE); -- Usually public or visible to authenticated

DROP POLICY IF EXISTS "Manage own education" ON education_records;
CREATE POLICY "Manage own education" ON education_records FOR ALL USING (auth_is_profile_manager(candidate_id));
CREATE POLICY "View education" ON education_records FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Manage own employment" ON employment_records;
CREATE POLICY "Manage own employment" ON employment_records FOR ALL USING (auth_is_profile_manager(candidate_id));
CREATE POLICY "View employment" ON employment_records FOR SELECT USING (
    income_visibility = 'visible' 
    OR (income_visibility = 'matches_only' AND auth_is_connected(candidate_id))
    OR auth_is_profile_manager(candidate_id)
);

DROP POLICY IF EXISTS "Manage own family" ON family_members;
CREATE POLICY "Manage own family" ON family_members FOR ALL USING (auth_is_profile_manager(candidate_id));
CREATE POLICY "View family" ON family_members FOR SELECT USING (
    candidate_id IN (SELECT candidate_id FROM profile_privacies WHERE family_privacy IN ('public', 'verified_users'))
    OR auth_is_connected(candidate_id)
    OR auth_is_profile_manager(candidate_id)
);

DROP POLICY IF EXISTS "Manage own partner preferences" ON partner_preferences;
CREATE POLICY "Manage own partner preferences" ON partner_preferences FOR ALL USING (auth_is_profile_manager(candidate_id));
CREATE POLICY "View partner preferences" ON partner_preferences FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Manage own profile privacies" ON profile_privacies;
CREATE POLICY "Manage own profile privacies" ON profile_privacies FOR ALL USING (auth_is_profile_manager(candidate_id));
CREATE POLICY "View profile privacies" ON profile_privacies FOR SELECT USING (TRUE);

-- PHOTOS (Fixing UPDATE/DELETE)
DROP POLICY IF EXISTS "Users can manage photos" ON photos;
CREATE POLICY "Users can manage photos" ON photos FOR ALL USING (auth_is_profile_manager(candidate_id));

-- BIODATAS (Fixing UPDATE/DELETE/INSERT)
DROP POLICY IF EXISTS "Manage own biodatas" ON biodatas;
CREATE POLICY "Manage own biodatas" ON biodatas FOR ALL USING (auth_is_profile_manager(candidate_id));

-- INTEREST REQUESTS (Fixing DELETE/UPDATE)
DROP POLICY IF EXISTS "Manage own sent interests" ON interest_requests;
CREATE POLICY "Manage own sent interests" ON interest_requests FOR ALL USING (
    sender_id IN (SELECT candidate_id FROM profile_members WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid()))
);

-- BLOCKS / SAVED / NOT INTERESTED
DROP POLICY IF EXISTS "Manage own blocks" ON blocks;
CREATE POLICY "Manage own blocks" ON blocks FOR ALL USING (auth_is_profile_manager(blocker_id));

DROP POLICY IF EXISTS "Manage own saved profiles" ON saved_profiles;
CREATE POLICY "Manage own saved profiles" ON saved_profiles FOR ALL USING (auth_is_profile_manager(candidate_id));

DROP POLICY IF EXISTS "Manage own not interested" ON not_interested_profiles;
CREATE POLICY "Manage own not interested" ON not_interested_profiles FOR ALL USING (auth_is_profile_manager(candidate_id));

-- FIX CANDIDATE PROFILE (Missing DELETE)
DROP POLICY IF EXISTS "Users can delete candidate profiles they manage" ON candidate_profiles;
CREATE POLICY "Users can delete candidate profiles they manage" ON candidate_profiles FOR DELETE USING (
    id IN (SELECT candidate_id FROM profile_members WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid()))
);
