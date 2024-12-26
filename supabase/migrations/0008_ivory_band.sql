/*
  # Shopping List Schema Update

  1. Changes
    - Add proper constraints and defaults for shopping list items
    - Add updated_at trigger
    - Add indexes for better performance

  2. Security
    - Update RLS policy for better security
*/

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_shopping_lists_updated_at ON shopping_lists;

-- Add NOT NULL constraints first
ALTER TABLE shopping_lists
  ALTER COLUMN item_name SET NOT NULL,
  ALTER COLUMN category SET NOT NULL,
  ALTER COLUMN quantity SET NOT NULL,
  ALTER COLUMN unit SET NOT NULL,
  ALTER COLUMN is_purchased SET NOT NULL,
  ALTER COLUMN is_pantry_staple SET NOT NULL,
  ALTER COLUMN meal_plan_id SET NOT NULL;

-- Then set defaults
ALTER TABLE shopping_lists
  ALTER COLUMN is_purchased SET DEFAULT false,
  ALTER COLUMN is_pantry_staple SET DEFAULT false;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_shopping_lists_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_shopping_lists_updated_at
    BEFORE UPDATE ON shopping_lists
    FOR EACH ROW
    EXECUTE FUNCTION update_shopping_lists_updated_at();

-- Add indexes for better performance
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