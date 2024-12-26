/*
  # Add settings tables and columns

  1. New Tables
    - `user_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `daily_calories` (integer)
      - `daily_protein` (numeric)
      - `daily_carbs` (numeric)
      - `daily_fat` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_settings`
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_calories integer NOT NULL DEFAULT 2000,
  daily_protein numeric(5,2) NOT NULL DEFAULT 50,
  daily_carbs numeric(5,2) NOT NULL DEFAULT 275,
  daily_fat numeric(5,2) NOT NULL DEFAULT 55,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own settings"
  ON user_settings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);