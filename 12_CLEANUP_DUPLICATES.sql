-- Clean up duplicates by keeping the most recently updated profile per user
DELETE FROM candidate_profiles a
USING candidate_profiles b
WHERE a.user_id = b.user_id 
AND a.updated_at < b.updated_at;

-- If there are exact timestamp matches, keep the one with the higher completion percentage
DELETE FROM candidate_profiles a
USING candidate_profiles b
WHERE a.user_id = b.user_id 
AND a.updated_at = b.updated_at
AND a.completion_percentage < b.completion_percentage;

-- If there are still exact duplicates, delete based on ID to force uniqueness
DELETE FROM candidate_profiles a
USING candidate_profiles b
WHERE a.user_id = b.user_id 
AND a.id < b.id;

-- Now add the UNIQUE constraint so it never happens again
ALTER TABLE candidate_profiles ADD CONSTRAINT candidate_profiles_user_id_key UNIQUE (user_id);
