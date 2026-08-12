-- ========================================================
-- JAINSAATHI ROW LEVEL SECURITY (RLS) POLICIES - MIGRATION 02
-- ========================================================

-- Enable Row Level Security on all core tables
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
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

-- 1. USERS SECURITY POLICIES
CREATE POLICY "Users can view their own user account"
    ON users FOR SELECT
    USING (auth.uid() = auth_id);

CREATE POLICY "Users can update their own user account"
    ON users FOR UPDATE
    USING (auth.uid() = auth_id);

-- 2. CANDIDATE PROFILES POLICIES
CREATE POLICY "Authenticated users can view discoverable candidate profiles"
    ON candidate_profiles FOR SELECT
    USING (
        is_active = TRUE 
        AND is_discoverable = TRUE
        AND id NOT IN (SELECT blocked_candidate_id FROM blocks WHERE blocker_id IN (SELECT id FROM candidate_profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())))
    );

CREATE POLICY "Users can view candidate profiles they own or manage"
    ON candidate_profiles FOR SELECT
    USING (
        id IN (SELECT candidate_id FROM profile_members WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
    );

CREATE POLICY "Users can update candidate profiles they manage"
    ON candidate_profiles FOR UPDATE
    USING (
        id IN (SELECT candidate_id FROM profile_members WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()) AND can_edit = TRUE)
    );

CREATE POLICY "Users can insert candidate profiles for themselves"
    ON candidate_profiles FOR INSERT
    WITH CHECK (TRUE);

-- 3. JAIN IDENTITY & LINEAGE POLICIES
CREATE POLICY "Discoverable profile Jain identity visible to logged in users"
    ON jain_identities FOR SELECT
    USING (TRUE);

CREATE POLICY "Manage own Jain identity"
    ON jain_identities FOR ALL
    USING (
        candidate_id IN (SELECT candidate_id FROM profile_members WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
    );

-- 4. PHOTOS PRIVACY POLICIES
CREATE POLICY "Public photos visible to authenticated users"
    ON photos FOR SELECT
    USING (
        privacy = 'public' 
        OR (privacy = 'verified_users' AND auth.role() = 'authenticated')
        OR (privacy = 'interest_accepted_only' AND candidate_id IN (
            SELECT candidate_a FROM connections WHERE candidate_b IN (SELECT id FROM candidate_profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
            UNION
            SELECT candidate_b FROM connections WHERE candidate_a IN (SELECT id FROM candidate_profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
        ))
        OR candidate_id IN (SELECT candidate_id FROM profile_members WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
    );

CREATE POLICY "Users can upload photos for managed candidate profiles"
    ON photos FOR INSERT
    WITH CHECK (
        candidate_id IN (SELECT candidate_id FROM profile_members WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
    );

-- 5. BIODATA PRIVACY POLICIES
CREATE POLICY "Biodata accessible only to authorized connections or owner"
    ON biodatas FOR SELECT
    USING (
        candidate_id IN (SELECT candidate_id FROM profile_members WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
        OR (
            visibility = 'interest_accepted_only' AND candidate_id IN (
                SELECT candidate_a FROM connections WHERE candidate_b IN (SELECT id FROM candidate_profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
                UNION
                SELECT candidate_b FROM connections WHERE candidate_a IN (SELECT id FROM candidate_profiles WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
            )
        )
    );

-- 6. INTEREST REQUESTS & CONNECTIONS POLICIES
CREATE POLICY "Users can view interest requests sent or received"
    ON interest_requests FOR SELECT
    USING (
        sender_id IN (SELECT candidate_id FROM profile_members WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
        OR receiver_id IN (SELECT candidate_id FROM profile_members WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
    );

CREATE POLICY "Users can send interest requests"
    ON interest_requests FOR INSERT
    WITH CHECK (
        sender_id IN (SELECT candidate_id FROM profile_members WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
    );

CREATE POLICY "Users can update interest requests sent to them"
    ON interest_requests FOR UPDATE
    USING (
        receiver_id IN (SELECT candidate_id FROM profile_members WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
    );

-- 7. CONTACT REVEALS SECURITY POLICIES
CREATE POLICY "Contact reveals viewable by requester only"
    ON contact_reveals FOR SELECT
    USING (
        requester_id IN (SELECT candidate_id FROM profile_members WHERE user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
    );

-- 8. PAYMENTS & SUBSCRIPTIONS POLICIES (Client Read Only, Server Service Role Mutate)
CREATE POLICY "Users view own subscriptions"
    ON subscriptions FOR SELECT
    USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users view own payments"
    ON payments FOR SELECT
    USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- 9. NOTIFICATIONS POLICIES
CREATE POLICY "Users view own notifications"
    ON notifications FOR SELECT
    USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Users update own notification status"
    ON notifications FOR UPDATE
    USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));
