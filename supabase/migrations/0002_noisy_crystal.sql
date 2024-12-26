/*
  # Add meal columns and nutrients

  1. Changes
    - Add total_calories column to meals table
    - Add nutrient columns to meals table for tracking macros
    - Add meal_foods junction table for tracking foods in meals (if not exists)

  2. Security
    - Enable RLS on new tables (if not already enabled)
    - Add policies for authenticated users (if not exists)
*/

-- Add columns to meals table
ALTER TABLE meals ADD COLUMN IF NOT EXISTS total_calories integer DEFAULT 0;
ALTER TABLE meals ADD COLUMN IF NOT EXISTS total_protein numeric(5,2) DEFAULT 0;
ALTER TABLE meals ADD COLUMN IF NOT EXISTS total_carbs numeric(5,2) DEFAULT 0;
ALTER TABLE meals ADD COLUMN IF NOT EXISTS total_fat numeric(5,2) DEFAULT 0;

-- Create meal_foods junction table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'meal_foods') THEN
    CREATE TABLE meal_foods (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      meal_id uuid REFERENCES meals(id) ON DELETE CASCADE,
      food_id uuid REFERENCES food_items(id) ON DELETE CASCADE,
      quantity numeric(5,2) NOT NULL DEFAULT 1,
      unit text NOT NULL DEFAULT 'serving',
      created_at timestamptz DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE meal_foods ENABLE ROW LEVEL SECURITY;

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
  END IF;
END $$;