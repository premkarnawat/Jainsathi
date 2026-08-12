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
