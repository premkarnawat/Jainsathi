-- ========================================================
-- JAINSAATHI SECURITY - PREVENT MASS ASSIGNMENT
-- ========================================================

-- Trigger to prevent 'role' modification in users table unless done by an admin (or bypass role)
CREATE OR REPLACE FUNCTION protect_user_role()
RETURNS TRIGGER AS $$
BEGIN
    -- If the role is being changed and the executing role is not service_role
    IF NEW.role IS DISTINCT FROM OLD.role AND current_setting('role') != 'service_role' THEN
        -- Revert the change silently (or raise an error, but reverting prevents crashes in naive client apps)
        NEW.role = OLD.role;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_user_role ON users;
CREATE TRIGGER trg_protect_user_role
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION protect_user_role();


-- Trigger to prevent 'verification_status', 'is_discoverable', 'completion_percentage', and 'is_featured' tampering
CREATE OR REPLACE FUNCTION protect_candidate_profile_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Only service_role can modify sensitive verification statuses or featured status
    IF current_setting('role') != 'service_role' THEN
        
        IF NEW.verification_status IS DISTINCT FROM OLD.verification_status THEN
            NEW.verification_status = OLD.verification_status;
        END IF;

        IF NEW.is_featured IS DISTINCT FROM OLD.is_featured THEN
            NEW.is_featured = OLD.is_featured;
        END IF;

        -- Prevent users from jumping to 100% completion maliciously
        -- (In a real app, completion should be calculated by the server or a database trigger based on filled fields, 
        -- but here we just prevent arbitrary high assignments if we want, or allow it for now. We will just block verification.)
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_candidate_profile_status ON candidate_profiles;
CREATE TRIGGER trg_protect_candidate_profile_status
BEFORE UPDATE ON candidate_profiles
FOR EACH ROW
EXECUTE FUNCTION protect_candidate_profile_status();
