-- ========================================================
-- JAINSAATHI PROFILE OWNERSHIP FIX
-- ========================================================

-- Create the trigger function to automatically assign ownership
CREATE OR REPLACE FUNCTION auto_insert_profile_member()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profile_members (candidate_id, user_id, can_edit, can_manage_interests)
    VALUES (NEW.id, NEW.user_id, TRUE, TRUE)
    ON CONFLICT (candidate_id, user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach the trigger to candidate_profiles
DROP TRIGGER IF EXISTS trg_auto_insert_profile_member ON candidate_profiles;
CREATE TRIGGER trg_auto_insert_profile_member
AFTER INSERT ON candidate_profiles
FOR EACH ROW
EXECUTE FUNCTION auto_insert_profile_member();

-- Backfill existing profiles that are missing their ownership records
INSERT INTO profile_members (candidate_id, user_id, can_edit, can_manage_interests)
SELECT id, user_id, TRUE, TRUE FROM candidate_profiles
WHERE NOT EXISTS (
    SELECT 1 FROM profile_members WHERE profile_members.candidate_id = candidate_profiles.id
);
