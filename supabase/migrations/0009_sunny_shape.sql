/*
  # Shopping List Constraints Update

  1. Changes
    - Add NOT NULL constraints to required columns
    - Set default values for boolean fields
    - Add updated_at trigger
    - Add performance indexes
    - Update RLS policy

  2. Security
    - Maintain RLS policy for authenticated users
*/

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_shopping_lists_updated_at ON shopping_lists;

-- Create or replace trigger function
CREATE OR REPLACE FUNCTION update_shopping_lists_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add NOT NULL constraints and set defaults in separate steps
ALTER TABLE shopping_lists 
  ALTER COLUMN item_name SET NOT NULL,
  ALTER COLUMN category SET NOT NULL,
  ALTER COLUMN quantity SET NOT NULL,
  ALTER COLUMN unit SET NOT NULL,
  ALTER COLUMN meal_plan_id SET NOT NULL;

ALTER TABLE shopping_lists 
  ALTER COLUMN is_purchased SET DEFAULT false,
  ALTER COLUMN is_purchased SET NOT NULL;

ALTER TABLE shopping_lists 
  ALTER COLUMN is_pantry_staple SET DEFAULT false,
  ALTER COLUMN is_pantry_staple SET NOT NULL;

-- Create trigger
CREATE TRIGGER update_shopping_lists_updated_at
    BEFORE UPDATE ON shopping_lists
    FOR EACH ROW
    EXECUTE FUNCTION update_shopping_lists_updated_at();

-- Add indexes
CREATE INDEX IF NOT EXISTS shopping_lists_meal_plan_id_idx ON shopping_lists(meal_plan_id);
CREATE INDEX IF NOT EXISTS shopping_lists_category_idx ON shopping_lists(category);

-- Update RLS policy
DROP POLICY IF EXISTS "Users can manage their shopping lists" ON shopping_lists;

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