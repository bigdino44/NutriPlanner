/*
  # Fix Meal Plans and Shopping List Structure

  1. Changes
    - Add missing columns to meals table
    - Fix meal_foods junction table
    - Update shopping_lists table structure
    - Add proper indexes and constraints

  2. Security
    - Update RLS policies
*/

-- Add missing columns to meals table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'meals' AND column_name = 'total_calories'
  ) THEN
    ALTER TABLE meals ADD COLUMN total_calories integer NOT NULL DEFAULT 0;
    ALTER TABLE meals ADD COLUMN total_protein numeric(5,2) NOT NULL DEFAULT 0;
    ALTER TABLE meals ADD COLUMN total_carbs numeric(5,2) NOT NULL DEFAULT 0;
    ALTER TABLE meals ADD COLUMN total_fat numeric(5,2) NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Fix meal_foods junction table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'meal_foods'
  ) THEN
    CREATE TABLE meal_foods (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      meal_id uuid NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
      food_id uuid NOT NULL REFERENCES food_items(id) ON DELETE CASCADE,
      quantity numeric(5,2) NOT NULL DEFAULT 1,
      unit text NOT NULL DEFAULT 'serving',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    ALTER TABLE meal_foods ENABLE ROW LEVEL SECURITY;

    CREATE INDEX meal_foods_meal_id_idx ON meal_foods(meal_id);
    CREATE INDEX meal_foods_food_id_idx ON meal_foods(food_id);

    CREATE TRIGGER update_meal_foods_updated_at
      BEFORE UPDATE ON meal_foods
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();

    CREATE POLICY "Users can manage foods in their meals"
      ON meal_foods
      FOR ALL
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM meals m
        JOIN meal_plans mp ON mp.id = m.meal_plan_id
        WHERE m.id = meal_id
        AND mp.user_id = auth.uid()
      ))
      WITH CHECK (EXISTS (
        SELECT 1 FROM meals m
        JOIN meal_plans mp ON mp.id = m.meal_plan_id
        WHERE m.id = meal_id
        AND mp.user_id = auth.uid()
      ));
  END IF;
END $$;

-- Fix shopping_lists table
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

-- Create trigger
CREATE TRIGGER update_shopping_lists_updated_at
    BEFORE UPDATE ON shopping_lists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add indexes
CREATE INDEX shopping_lists_meal_plan_id_idx ON shopping_lists(meal_plan_id);
CREATE INDEX shopping_lists_category_idx ON shopping_lists(category);
CREATE INDEX shopping_lists_is_purchased_idx ON shopping_lists(is_purchased);

-- Create RLS policy
CREATE POLICY "Users can manage their shopping lists"
  ON shopping_lists
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM meal_plans mp
    WHERE mp.id = meal_plan_id
    AND mp.user_id = auth.uid()
  ));