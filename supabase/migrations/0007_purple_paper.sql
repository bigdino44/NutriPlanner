/*
  # Update Settings Components
  
  1. Changes
    - Create or replace trigger function for updating timestamps
    - Drop and recreate trigger for user_settings table
    - Create index on user_id if it doesn't exist
*/

-- Create or replace trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;

-- Create trigger
CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS user_settings_user_id_idx ON user_settings(user_id);