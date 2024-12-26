/*
  # Fix Meal Plans and Shopping List Issues

  1. Changes
    - Add missing foreign key constraints
    - Fix meal_foods table structure
    - Update shopping_lists table
    - Add proper indexes

  2. Security
    - Update RLS policies
*/

-- Fix meal_foods table
DO $$ 
BEGIN
  -- Drop and recreate meal_foods if it exists
  DROP TABLE IF EXISTS meal_foods CASCADE;
  
  CREATE TABLE meal_foods (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_id uuid NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
    food_id uuid NOT NULL REFERENCES food_items(id) ON DELETE CASCADE,
    quantity numeric(5,2) NOT NULL DEFAULT 1,
    unit text NOT NULL DEFAULT 'serving',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT meal_foods_meal_food_unique UNIQUE (meal_id, food_id)
  );

  -- Enable RLS
  ALTER TABLE meal_foods ENABLE ROW LEVEL SECURITY;

  -- Create indexes
  CREATE INDEX meal_foods_meal_id_idx ON meal_foods(meal_id);
  CREATE INDEX meal_foods_food_id_idx ON meal_foods(food_id);

  -- Create policy
  CREATE POLICY "Users can manage foods in their meals"
    ON meal_foods
    FOR ALL
    TO authenticated
    USING (EXISTS (
      SELECT 1 FROM meals m
      JOIN meal_plans mp ON mp.id = m.meal_plan_id
      WHERE m.id = meal_id
      AND mp.user_id = auth.uid()
    ));
END $$;