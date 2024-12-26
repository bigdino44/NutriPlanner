/*
  # Fix Shopping List Table Structure

  1. Changes
    - Drop and recreate shopping_lists table with proper structure
    - Add proper constraints and defaults
    - Add updated_at trigger
    - Add performance indexes
    - Update RLS policy

  2. Security
    - Enable RLS
    - Add policy for authenticated users
*/

-- Drop existing table and recreate with proper structure
DROP TABLE IF EXISTS shopping_lists CASCADE;

CREATE TABLE shopping_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id uuid NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  category text NOT NULL,
  quantity numeric(10,2) NOT NULL DEFAULT 1,
  unit text NOT NULL DEFAULT 'unit',
  is_purchased boolean NOT NULL DEFAULT false,
  is_pantry_staple boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_shopping_lists_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_shopping_lists_updated_at
    BEFORE UPDATE ON shopping_lists
    FOR EACH ROW
    EXECUTE FUNCTION update_shopping_lists_updated_at();

-- Add indexes
CREATE INDEX IF NOT EXISTS shopping_lists_meal_plan_id_idx ON shopping_lists(meal_plan_id);
CREATE INDEX IF NOT EXISTS shopping_lists_category_idx ON shopping_lists(category);
CREATE INDEX IF NOT EXISTS shopping_lists_is_purchased_idx ON shopping_lists(is_purchased);

-- Create RLS policy
CREATE POLICY "Users can manage their shopping lists"
  ON shopping_lists
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM meal_plans mp
      WHERE mp.id = meal_plan_id
      AND mp.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM meal_plans mp
      WHERE mp.id = meal_plan_id
      AND mp.user_id = auth.uid()
    )
  );