-- ========================================================
-- JAINSAATHI SECURITY - FIX RECURSION & MISSING RLS
-- ========================================================

-- PHASE 1: CREATE SECURITY DEFINER TO BREAK RECURSION
CREATE OR REPLACE FUNCTION auth_is_blocked_by_either(p_target_candidate_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM blocks
    WHERE (
      -- I blocked them
      (blocked_candidate_id = p_target_candidate_id AND blocker_id IN (
        SELECT candidate_id FROM profile_members WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
      ))
      OR
      -- They blocked me
      (blocker_id = p_target_candidate_id AND blocked_candidate_id IN (
        SELECT candidate_id FROM profile_members WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid())
      ))
    )
  );
$$;

-- PHASE 2: REPLACE RECURSIVE CANDIDATE_PROFILES POLICY
DROP POLICY IF EXISTS "Authenticated users can view discoverable candidate profiles" ON candidate_profiles;
CREATE POLICY "Authenticated users can view discoverable candidate profiles"
ON candidate_profiles FOR SELECT
USING (
    is_active = TRUE 
    AND is_discoverable = TRUE
    AND NOT auth_is_blocked_by_either(id)
);


-- PHASE 3: ADD MISSING RLS FOR RELATIONSHIP TABLES

-- 1. PROFILE MEMBERS
DROP POLICY IF EXISTS "Users view own profile members" ON profile_members;
CREATE POLICY "Users view own profile members" ON profile_members FOR SELECT USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

DROP POLICY IF EXISTS "Users insert own profile members" ON profile_members;
CREATE POLICY "Users insert own profile members" ON profile_members FOR INSERT WITH CHECK (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

DROP POLICY IF EXISTS "Users update own profile members" ON profile_members;
CREATE POLICY "Users update own profile members" ON profile_members FOR UPDATE USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

DROP POLICY IF EXISTS "Users delete own profile members" ON profile_members;
CREATE POLICY "Users delete own profile members" ON profile_members FOR DELETE USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- 2. CONNECTIONS (Mutual acceptance)
DROP POLICY IF EXISTS "Users view own connections" ON connections;
CREATE POLICY "Users view own connections" ON connections FOR SELECT USING (
    candidate_a IN (SELECT candidate_id FROM profile_members WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid()))
    OR
    candidate_b IN (SELECT candidate_id FROM profile_members WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid()))
);

-- Note: INSERT/UPDATE/DELETE on connections is handled by secure Server Actions using Admin Client.

-- 3. INTEREST REQUESTS (Add missing Receiver view policy)
DROP POLICY IF EXISTS "Manage own received interests" ON interest_requests;
CREATE POLICY "Manage own received interests" ON interest_requests FOR SELECT USING (
    receiver_id IN (SELECT candidate_id FROM profile_members WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid()))
);

-- 4. SAVED PROFILES
DROP POLICY IF EXISTS "View own saved profiles" ON saved_profiles;
CREATE POLICY "View own saved profiles" ON saved_profiles FOR SELECT USING (auth_is_profile_manager(candidate_id));

-- Note: INSERT/DELETE handled by Server Action or Client (We already have 'Manage own saved profiles' FOR ALL but let's ensure SELECT explicitly works if FOR ALL failed)
DROP POLICY IF EXISTS "Manage own saved profiles" ON saved_profiles;
CREATE POLICY "Manage own saved profiles" ON saved_profiles FOR ALL USING (auth_is_profile_manager(candidate_id));

-- 5. NOT INTERESTED PROFILES
DROP POLICY IF EXISTS "Manage own not interested" ON not_interested_profiles;
CREATE POLICY "Manage own not interested" ON not_interested_profiles FOR ALL USING (auth_is_profile_manager(candidate_id));

-- 6. CONTACT REVEALS (View only, insert is Server Action)
DROP POLICY IF EXISTS "Contact reveals viewable by requester only" ON contact_reveals;
CREATE POLICY "Contact reveals viewable by requester only" ON contact_reveals FOR SELECT USING (
    requester_id IN (SELECT candidate_id FROM profile_members WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid()))
);

-- 7. REPORTS (Insert only, view is Admin only)
DROP POLICY IF EXISTS "Users can submit reports" ON reports;
CREATE POLICY "Users can submit reports" ON reports FOR INSERT WITH CHECK (
    reporter_id IN (SELECT candidate_id FROM profile_members WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid()))
);
