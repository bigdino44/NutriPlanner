/*
  # Fix Meal Plans Structure

  1. Changes
    - Drop and recreate meal_plans table with proper structure
    - Drop and recreate meals table with proper structure
    - Drop and recreate meal_foods table with proper structure
    - Add proper constraints and defaults
    - Add performance indexes
    - Update RLS policies

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Drop existing tables in correct order
DROP TABLE IF EXISTS meal_foods CASCADE;
DROP TABLE IF EXISTS meals CASCADE;
DROP TABLE IF EXISTS meal_plans CASCADE;

-- Create meal_plans table
CREATE TABLE meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT meal_plans_date_range_check CHECK (end_date >= start_date)
);

-- Create meals table
CREATE TABLE meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id uuid NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  total_calories integer NOT NULL DEFAULT 0,
  total_protein numeric(5,2) NOT NULL DEFAULT 0,
  total_carbs numeric(5,2) NOT NULL DEFAULT 0,
  total_fat numeric(5,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create meal_foods junction table
CREATE TABLE meal_foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id uuid NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  food_id uuid NOT NULL REFERENCES food_items(id) ON DELETE CASCADE,
  quantity numeric(5,2) NOT NULL DEFAULT 1,
  unit text NOT NULL DEFAULT 'serving',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_foods ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_meal_plans_updated_at
    BEFORE UPDATE ON meal_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meals_updated_at
    BEFORE UPDATE ON meals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_foods_updated_at
    BEFORE UPDATE ON meal_foods
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX meal_plans_user_id_idx ON meal_plans(user_id);
CREATE INDEX meal_plans_date_range_idx ON meal_plans(start_date, end_date);
CREATE INDEX meals_meal_plan_id_idx ON meals(meal_plan_id);
CREATE INDEX meals_type_idx ON meals(type);
CREATE INDEX meal_foods_meal_id_idx ON meal_foods(meal_id);
CREATE INDEX meal_foods_food_id_idx ON meal_foods(food_id);

-- Create RLS policies
CREATE POLICY "Users can manage their meal plans"
  ON meal_plans
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage meals in their meal plans"
  ON meals
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM meal_plans mp
    WHERE mp.id = meal_plan_id
    AND mp.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM meal_plans mp
    WHERE mp.id = meal_plan_id
    AND mp.user_id = auth.uid()
  ));

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