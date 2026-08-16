-- ========================================================
-- JAINSAATHI DATABASE SCHEMA - MIGRATION 01
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS & TAXONOMIES
CREATE TYPE profile_managed_by AS ENUM ('self', 'parent', 'guardian', 'sibling', 'relative');
CREATE TYPE profile_gender AS ENUM ('male', 'female');
CREATE TYPE marital_status_type AS ENUM ('never_married', 'divorced', 'widowed', 'separated');
CREATE TYPE diet_preference AS ENUM ('strict_jain', 'jain_vegetarian', 'vegetarian', 'other');
CREATE TYPE income_visibility_type AS ENUM ('visible', 'verified_only', 'matches_only', 'hidden');
CREATE TYPE privacy_level AS ENUM ('public', 'verified_users', 'matches_only', 'interest_accepted_only', 'private');
CREATE TYPE verification_status_type AS ENUM ('not_verified', 'pending', 'verified', 'rejected');
CREATE TYPE interest_status AS ENUM ('pending', 'accepted', 'declined');
CREATE TYPE relationship_role AS ENUM ('candidate', 'parent', 'guardian');
CREATE TYPE payment_status_type AS ENUM ('pending', 'success', 'failed', 'refunded', 'cancelled');
CREATE TYPE featured_status_type AS ENUM ('active', 'expired', 'cancelled');
CREATE TYPE admin_role_type AS ENUM ('super_admin', 'moderator', 'support');

-- 2. REFERENCE TABLES
CREATE TABLE IF NOT EXISTS states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    state_id INT REFERENCES states(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    UNIQUE(state_id, name)
);

CREATE TABLE IF NOT EXISTS jain_sects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS jain_communities (
    id SERIAL PRIMARY KEY,
    sect_id INT REFERENCES jain_sects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(sect_id, name)
);

CREATE TABLE IF NOT EXISTS jain_subcommunities (
    id SERIAL PRIMARY KEY,
    community_id INT REFERENCES jain_communities(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 3. CORE USER & ACCOUNT TABLES
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID UNIQUE, -- References auth.users(id) in Supabase Auth
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CANDIDATE PROFILE (Main Matrimonial Record)
CREATE TABLE IF NOT EXISTS candidate_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    profile_created_for VARCHAR(50),
    managed_by profile_managed_by DEFAULT 'self',
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    gender profile_gender NOT NULL,
    date_of_birth DATE NOT NULL,
    height_cm INT NOT NULL,
    weight_kg INT,
    marital_status marital_status_type DEFAULT 'never_married',
    birth_place VARCHAR(150),
    birth_time TIME,
    
    current_country VARCHAR(100) DEFAULT 'India',
    current_state VARCHAR(100) NOT NULL,
    current_city VARCHAR(100) NOT NULL,
    native_state VARCHAR(100),
    native_city VARCHAR(100),
    
    languages_known TEXT[] DEFAULT '{}',
    about_me TEXT,
    hobbies TEXT[] DEFAULT '{}',
    
    completion_percentage INT DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    is_discoverable BOOLEAN DEFAULT TRUE,
    verification_status verification_status_type DEFAULT 'not_verified',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROFILE OWNERSHIP & MANAGERS
CREATE TABLE IF NOT EXISTS profile_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role relationship_role DEFAULT 'candidate',
    can_edit BOOLEAN DEFAULT TRUE,
    can_manage_interests BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(candidate_id, user_id)
);

-- JAIN IDENTITY & LINEAGE
CREATE TABLE IF NOT EXISTS jain_identities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE UNIQUE,
    sect VARCHAR(100) NOT NULL, -- e.g., Shwetambar, Digambar
    community VARCHAR(100) NOT NULL, -- e.g., Oswal, Porwal, Khandelwal
    sub_community VARCHAR(100),
    saka_gotra VARCHAR(100),
    
    -- Detailed lineage (4 Gotra System)
    self_saka VARCHAR(100),
    mamasa_saka VARCHAR(100),
    dadisa_saka VARCHAR(100),
    nanisa_saka VARCHAR(100),
    family_kul_gotra VARCHAR(100),
    lineage_notes TEXT,
    
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PERSONAL & LIFESTYLE DETAILS
CREATE TABLE IF NOT EXISTS lifestyle_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE UNIQUE,
    diet diet_preference DEFAULT 'strict_jain',
    food_notes TEXT,
    smoking BOOLEAN DEFAULT FALSE,
    alcohol BOOLEAN DEFAULT FALSE,
    tobacco BOOLEAN DEFAULT FALSE,
    fitness_routine VARCHAR(100),
    manglik_status VARCHAR(50) DEFAULT 'non_manglik',
    rashi VARCHAR(100),
    nakshatra VARCHAR(100),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EDUCATION RECORDS
CREATE TABLE IF NOT EXISTS education_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    qualification_level VARCHAR(100) NOT NULL, -- e.g., Bachelors, Masters, Doctorate
    degree_name VARCHAR(150) NOT NULL, -- e.g., B.Tech, MBA, CA, MD
    specialization VARCHAR(150),
    institution VARCHAR(250),
    university VARCHAR(250),
    passout_year INT,
    is_highest BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- EMPLOYMENT & BUSINESS RECORDS
CREATE TABLE IF NOT EXISTS employment_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    employment_type VARCHAR(100) NOT NULL, -- e.g., Corporate, Business, Self-Employed, Family Business
    company_name VARCHAR(200),
    designation VARCHAR(150),
    industry VARCHAR(150),
    work_city VARCHAR(100),
    work_state VARCHAR(100),
    work_country VARCHAR(100) DEFAULT 'India',
    annual_income_lakhs NUMERIC(10,2),
    income_visibility income_visibility_type DEFAULT 'verified_only',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAMILY MEMBERS
CREATE TABLE IF NOT EXISTS family_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    relation_type VARCHAR(50) NOT NULL, -- e.g., Father, Mother, Brother, Sister, Kakasa, Mamasa, Jiju
    name VARCHAR(150) NOT NULL,
    occupation VARCHAR(150),
    business_details TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    marital_status VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PARTNER PREFERENCES
CREATE TABLE IF NOT EXISTS partner_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE UNIQUE,
    min_age INT DEFAULT 18,
    max_age INT DEFAULT 70,
    min_height_cm INT DEFAULT 140,
    max_height_cm INT DEFAULT 210,
    allowed_marital_statuses marital_status_type[] DEFAULT '{never_married}',
    preferred_states TEXT[] DEFAULT '{}',
    preferred_cities TEXT[] DEFAULT '{}',
    preferred_sects TEXT[] DEFAULT '{}',
    preferred_communities TEXT[] DEFAULT '{}',
    preferred_educations TEXT[] DEFAULT '{}',
    min_income_lakhs NUMERIC(10,2),
    preferred_diet diet_preference DEFAULT 'strict_jain',
    diet_is_mandatory BOOLEAN DEFAULT TRUE,
    sect_is_mandatory BOOLEAN DEFAULT FALSE,
    about_preferred_partner TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRIVACY SETTINGS
CREATE TABLE IF NOT EXISTS profile_privacies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE UNIQUE,
    photo_privacy privacy_level DEFAULT 'verified_users',
    biodata_privacy privacy_level DEFAULT 'interest_accepted_only',
    contact_privacy privacy_level DEFAULT 'interest_accepted_only',
    income_privacy income_visibility_type DEFAULT 'verified_only',
    family_privacy privacy_level DEFAULT 'verified_users',
    discoverability privacy_level DEFAULT 'public',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PHOTOS SYSTEM
CREATE TABLE IF NOT EXISTS photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    privacy privacy_level DEFAULT 'verified_users',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIODATA SYSTEM
CREATE TABLE IF NOT EXISTS biodatas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    file_path TEXT,
    pdf_url TEXT,
    generated_data JSONB,
    visibility privacy_level DEFAULT 'interest_accepted_only',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INTERACTIONS & MATCHING

-- INTEREST REQUESTS
CREATE TABLE IF NOT EXISTS interest_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    status interest_status DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(sender_id, receiver_id)
);

-- MUTUAL CONNECTIONS
CREATE TABLE IF NOT EXISTS connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_a UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    candidate_b UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    interest_request_id UUID REFERENCES interest_requests(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(candidate_a, candidate_b)
);

-- CONTACT REVEAL RECORDS
CREATE TABLE IF NOT EXISTS contact_reveals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    target_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    revealed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(requester_id, target_id)
);

-- SAVED & HIDDEN PROFILES
CREATE TABLE IF NOT EXISTS saved_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    saved_candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(candidate_id, saved_candidate_id)
);

CREATE TABLE IF NOT EXISTS not_interested_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    ignored_candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(candidate_id, ignored_candidate_id)
);

-- 5. PLANS & PAYMENTS ARCHITECTURE

CREATE TABLE IF NOT EXISTS plans (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE, -- e.g., free, pro_3m, super_3m, deluxe_6m
    name VARCHAR(100) NOT NULL,
    price_inr NUMERIC(10,2) NOT NULL DEFAULT 0,
    duration_days INT NOT NULL DEFAULT 0,
    contact_reveal_limit INT DEFAULT 0,
    biodata_download_limit INT DEFAULT 0,
    is_featured_allowed BOOLEAN DEFAULT FALSE,
    features JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    plan_id INT REFERENCES plans(id),
    status VARCHAR(50) DEFAULT 'active',
    contact_reveals_remaining INT DEFAULT 0,
    biodata_downloads_remaining INT DEFAULT 0,
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id INT REFERENCES plans(id),
    amount_inr NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status payment_status_type DEFAULT 'pending',
    provider VARCHAR(50) DEFAULT 'razorpay',
    provider_order_id VARCHAR(100),
    provider_payment_id VARCHAR(100),
    provider_signature VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FEATURED LISTINGS
CREATE TABLE IF NOT EXISTS featured_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
    status featured_status_type DEFAULT 'active',
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. NOTIFICATIONS & REPORTS

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reported_candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    reason VARCHAR(100) NOT NULL,
    details TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blocker_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    blocked_candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(blocker_id, blocked_candidate_id)
);

-- AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID,
    action VARCHAR(100) NOT NULL,
    target_table VARCHAR(100),
    target_id UUID,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
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
-- ========================================================
-- JAINSAATHI REFERENCE SEED DATA - MIGRATION 03
-- ========================================================

-- 1. SEED JAIN SECTS & COMMUNITIES TAXONOMY
INSERT INTO jain_sects (id, name, description) VALUES
(1, 'Shwetambar', 'White-clad tradition of Jainism'),
(2, 'Digambar', 'Sky-clad tradition of Jainism'),
(3, 'Sthanakvasi', 'Sub-tradition focusing on non-idol worship'),
(4, 'Terapanthi', 'Modern reformist Shwetambar order')
ON CONFLICT (id) DO NOTHING;

INSERT INTO jain_communities (id, sect_id, name, description) VALUES
(1, 1, 'Oswal', 'Prominent merchant community of Rajasthan and Gujarat'),
(2, 1, 'Porwal', 'Traditional business and trading Jain community'),
(3, 1, 'Shrimali', 'Historic Jain community with roots in Bhinmal'),
(4, 2, 'Khandelwal', 'Digambar Jain community predominant in North India'),
(5, 2, 'Agrawal Jain', 'Digambar community following traditional business values'),
(6, 2, 'Parwar', 'Digambar Jain community centered around Bundelkhand'),
(7, 2, 'Humbad', 'Digambar Jain community from Rajasthan and Maharashtra'),
(8, 3, 'Gujarati Jain', 'Regional Jain community across western India')
ON CONFLICT (id) DO NOTHING;

INSERT INTO jain_subcommunities (id, community_id, name) VALUES
(1, 1, 'Visa Oswal'),
(2, 1, 'Dasa Oswal'),
(3, 2, 'Visa Porwal'),
(4, 2, 'Dasa Porwal'),
(5, 4, 'Visa Khandelwal'),
(6, 4, 'Dasa Khandelwal')
ON CONFLICT (id) DO NOTHING;

-- 2. SEED INDIAN STATES & MAJOR CITIES TAXONOMY
INSERT INTO states (id, name, code) VALUES
(1, 'Maharashtra', 'MH'),
(2, 'Gujarat', 'GJ'),
(3, 'Rajasthan', 'RJ'),
(4, 'Delhi', 'DL'),
(5, 'Karnataka', 'KA'),
(6, 'Madhya Pradesh', 'MP'),
(7, 'Telangana', 'TG'),
(8, 'Tamil Nadu', 'TN'),
(9, 'West Bengal', 'WB'),
(10, 'Uttar Pradesh', 'UP'),
(11, 'Punjab', 'PB'),
(12, 'Haryana', 'HR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO cities (state_id, name) VALUES
(1, 'Mumbai'), (1, 'Pune'), (1, 'Nagpur'), (1, 'Thane'), (1, 'Nashik'), (1, 'Solapur'), (1, 'Aurangabad'),
(2, 'Ahmedabad'), (2, 'Surat'), (2, 'Vadodara'), (2, 'Rajkot'), (2, 'Jamnagar'), (2, 'Bhavnagar'),
(3, 'Jaipur'), (3, 'Jodhpur'), (3, 'Udaipur'), (3, 'Kota'), (3, 'Bikaner'), (3, 'Ajmer'),
(4, 'New Delhi'), (4, 'South Delhi'), (4, 'North Delhi'),
(5, 'Bengaluru'), (5, 'Mysuru'), (5, 'Hubballi'),
(6, 'Indore'), (6, 'Bhopal'), (6, 'Gwalior'), (6, 'Jabalpur'),
(7, 'Hyderabad'), (7, 'Secunderabad'),
(8, 'Chennai'), (8, 'Coimbatore'),
(9, 'Kolkata'),
(10, 'Noida'), (10, 'Lucknow'), (10, 'Kanpur'), (10, 'Agra'),
(11, 'Ludhiana'), (11, 'Amritsar'),
(12, 'Gurugram'), (12, 'Faridabad')
ON CONFLICT DO NOTHING;

-- 3. SEED SUBSCRIPTION PLANS ARCHITECTURE
INSERT INTO plans (code, name, price_inr, duration_days, contact_reveal_limit, biodata_download_limit, is_featured_allowed, features) VALUES
('free', 'Free', 0, 365, 0, 2, FALSE, '["Create Profile", "Smart Matching", "Receive Interests", "Basic Search"]'),
('pro_3m', 'Pro', 1999, 90, 10, 25, FALSE, '["View Full Profiles", "10 Contact Reveals", "Send Unlimited Interests", "Direct Chat/Message Request", "Verified Profile Badge"]'),
('super_3m', 'Super', 3499, 90, 25, 50, TRUE, '["Most Popular", "25 Contact Reveals", "Featured Listing for 14 Days", "Priority Recommendation", "Full Biodata Access", "Dedicated Relationship Manager"]'),
('deluxe_6m', 'Deluxe', 5999, 180, 60, 150, TRUE, '["Best Value", "60 Contact Reveals", "Featured Profile for 30 Days", "Top Ranking in Search", "Personalized Assistance", "Exclusive Family Verification"]');
-- ========================================================
-- JAINSAATHI MATCHING ENGINE RPC - MIGRATION 04
-- ========================================================

-- Type to return match results
CREATE TYPE match_result AS (
    candidate_id UUID,
    user_id UUID,
    first_name VARCHAR,
    last_name VARCHAR,
    gender VARCHAR,
    date_of_birth DATE,
    age INT,
    height_cm INT,
    current_city VARCHAR,
    current_state VARCHAR,
    sect VARCHAR,
    community VARCHAR,
    compatibility_score INT,
    matching_reasons TEXT[]
);

CREATE OR REPLACE FUNCTION get_recommended_matches(p_user_profile_id UUID, p_limit INT DEFAULT 20)
RETURNS SETOF match_result
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_gender profile_gender;
    v_user_prefs RECORD;
    v_user_age INT;
    v_user_height INT;
    v_user_sect VARCHAR;
    v_user_community VARCHAR;
    v_user_state VARCHAR;
    v_user_city VARCHAR;
BEGIN
    -- 1. Get the user's details and preferences
    SELECT 
        c.gender, 
        DATE_PART('year', AGE(c.date_of_birth))::INT, 
        c.height_cm,
        c.current_state,
        c.current_city,
        j.sect,
        j.community
    INTO 
        v_user_gender, v_user_age, v_user_height, v_user_state, v_user_city, v_user_sect, v_user_community
    FROM candidate_profiles c
    LEFT JOIN jain_identities j ON c.id = j.candidate_id
    WHERE c.id = p_user_profile_id AND c.is_active = TRUE;

    -- If user not found, exit
    IF NOT FOUND THEN
        RETURN;
    END IF;

    -- Get user preferences
    SELECT * INTO v_user_prefs 
    FROM partner_preferences 
    WHERE candidate_id = p_user_profile_id;

    -- 2. Find matches
    RETURN QUERY
    WITH potential_matches AS (
        SELECT 
            c.id AS candidate_id,
            c.user_id,
            c.first_name,
            c.last_name,
            c.gender::VARCHAR,
            c.date_of_birth,
            DATE_PART('year', AGE(c.date_of_birth))::INT AS age,
            c.height_cm,
            c.current_city,
            c.current_state,
            j.sect,
            j.community,
            c.marital_status
        FROM candidate_profiles c
        LEFT JOIN jain_identities j ON c.id = j.candidate_id
        WHERE c.id != p_user_profile_id
          AND c.is_active = TRUE
          AND c.is_discoverable = TRUE
          -- Basic opposite gender filter (adjust if necessary for specific use cases, but standard is opposite)
          AND c.gender != v_user_gender
          -- Ensure they haven't been blocked/saved/rejected already (Simplified for this query)
          AND c.id NOT IN (
              SELECT saved_candidate_id FROM saved_profiles WHERE candidate_id = p_user_profile_id
              UNION
              SELECT target_id FROM contact_reveals WHERE requester_id = p_user_profile_id
              UNION
              SELECT receiver_id FROM interest_requests WHERE sender_id = p_user_profile_id
          )
    ),
    scored_matches AS (
        SELECT 
            pm.*,
            -- Calculate Score
            (
                -- Age check
                (CASE WHEN v_user_prefs.min_age IS NULL OR pm.age >= v_user_prefs.min_age THEN 15 ELSE 0 END) +
                (CASE WHEN v_user_prefs.max_age IS NULL OR pm.age <= v_user_prefs.max_age THEN 15 ELSE 0 END) +
                -- Height check
                (CASE WHEN v_user_prefs.min_height_cm IS NULL OR pm.height_cm >= v_user_prefs.min_height_cm THEN 10 ELSE 0 END) +
                (CASE WHEN v_user_prefs.max_height_cm IS NULL OR pm.height_cm <= v_user_prefs.max_height_cm THEN 10 ELSE 0 END) +
                -- Sect check
                (CASE WHEN array_length(v_user_prefs.preferred_sects, 1) IS NULL OR pm.sect = ANY(v_user_prefs.preferred_sects) THEN 25 ELSE 0 END) +
                -- Community check
                (CASE WHEN array_length(v_user_prefs.preferred_communities, 1) IS NULL OR pm.community = ANY(v_user_prefs.preferred_communities) THEN 15 ELSE 0 END) +
                -- Location check
                (CASE WHEN array_length(v_user_prefs.preferred_states, 1) IS NULL OR pm.current_state = ANY(v_user_prefs.preferred_states) THEN 10 ELSE 0 END)
            ) AS score,
            
            -- Generate Reasons
            ARRAY_REMOVE(ARRAY[
                (CASE WHEN pm.age BETWEEN COALESCE(v_user_prefs.min_age, 18) AND COALESCE(v_user_prefs.max_age, 60) THEN '✓ Age preference matches' ELSE NULL END),
                (CASE WHEN pm.sect = ANY(v_user_prefs.preferred_sects) THEN '✓ Jain sect matches' ELSE NULL END),
                (CASE WHEN pm.community = ANY(v_user_prefs.preferred_communities) THEN '✓ Community matches' ELSE NULL END),
                (CASE WHEN pm.current_state = ANY(v_user_prefs.preferred_states) THEN '✓ Location preference matches' ELSE NULL END)
            ], NULL) AS reasons
        FROM potential_matches pm
        -- Only allow valid marital status
        WHERE v_user_prefs.allowed_marital_statuses IS NULL OR pm.marital_status = ANY(v_user_prefs.allowed_marital_statuses)
    )
    SELECT 
        candidate_id,
        user_id,
        first_name,
        last_name,
        gender,
        date_of_birth,
        age,
        height_cm,
        current_city,
        current_state,
        sect,
        community,
        -- Normalize score to max 100
        LEAST((score::FLOAT / 100.0 * 100)::INT, 100) AS compatibility_score,
        reasons
    FROM scored_matches
    WHERE score >= 40 -- Minimum threshold
    ORDER BY compatibility_score DESC, age ASC
    LIMIT p_limit;
END;
$$;
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
