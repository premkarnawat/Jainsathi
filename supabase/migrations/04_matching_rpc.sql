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
