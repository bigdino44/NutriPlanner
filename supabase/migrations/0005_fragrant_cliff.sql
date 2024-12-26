/*
  # Fix settings schema and constraints

  1. Changes
    - Add NOT NULL constraints to required fields
    - Add default values for nutritional guidelines
    - Add unique constraint for user_id
    - Add trigger for updated_at
*/

-- Drop existing user_settings table if it exists
DROP TABLE IF EXISTS user_settings;

-- Recreate user_settings table with proper constraints
CREATE TABLE user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  daily_calories integer NOT NULL DEFAULT 2000,
  daily_protein numeric(5,2) NOT NULL DEFAULT 50,
  daily_carbs numeric(5,2) NOT NULL DEFAULT 275,
  daily_fat numeric(5,2) NOT NULL DEFAULT 55,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can manage their own settings"
  ON user_settings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add index
CREATE INDEX user_settings_user_id_idx ON user_settings(user_id);