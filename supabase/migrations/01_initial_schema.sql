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
