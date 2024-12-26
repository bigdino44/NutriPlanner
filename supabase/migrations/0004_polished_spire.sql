/*
  # Settings table fixes and improvements
  
  1. Changes
    - Add unique constraint on user_id for user_settings
    - Add trigger to auto-update updated_at
    - Add indexes for better query performance
*/

-- Add unique constraint to prevent duplicate settings per user
ALTER TABLE user_settings 
ADD CONSTRAINT user_settings_user_id_key UNIQUE (user_id);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for auto-updating timestamp
CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS user_settings_user_id_idx ON user_settings(user_id);