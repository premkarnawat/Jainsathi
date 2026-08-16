CREATE POLICY "Users can insert their own user account"
ON users FOR INSERT
WITH CHECK (auth.uid() = auth_id);
