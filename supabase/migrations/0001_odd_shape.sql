/*
  # Initial Schema for NutriPlanner

  1. New Tables
    - users (managed by Supabase Auth)
    - food_items
      - Basic food information and nutritional data
    - dietary_restrictions
      - User's dietary restrictions and allergies
    - nutritional_guidelines
      - User's nutritional targets
    - meal_plans
      - Weekly meal plans
    - meals
      - Individual meals within plans
    - meal_foods
      - Foods used in each meal
    - shopping_lists
      - Generated shopping lists

  2. Security
    - RLS enabled on all tables
    - Policies for user data access
*/

-- Food Items table
CREATE TABLE food_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('fruits', 'vegetables', 'proteins', 'carbs', 'dairy', 'snacks')),
  preference text NOT NULL CHECK (preference IN ('like', 'dislike', 'tolerate')),
  frequency_limit integer,
  calories integer NOT NULL,
  protein numeric(5,2) NOT NULL,
  carbs numeric(5,2) NOT NULL,
  fat numeric(5,2) NOT NULL,
  iron numeric(5,2),
  calcium numeric(5,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Dietary Restrictions table
CREATE TABLE dietary_restrictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Nutritional Guidelines table
CREATE TABLE nutritional_guidelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  calories integer NOT NULL,
  protein numeric(5,2) NOT NULL,
  carbs numeric(5,2) NOT NULL,
  fat numeric(5,2) NOT NULL,
  iron numeric(5,2),
  calcium numeric(5,2),
  age_range text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Meal Plans table
CREATE TABLE meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Meals table
CREATE TABLE meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id uuid REFERENCES meal_plans(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  created_at timestamptz DEFAULT now()
);

-- Meal Foods junction table
CREATE TABLE meal_foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id uuid REFERENCES meals(id) ON DELETE CASCADE,
  food_id uuid REFERENCES food_items(id) ON DELETE CASCADE,
  quantity numeric(5,2) NOT NULL,
  unit text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Shopping Lists table
CREATE TABLE shopping_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id uuid REFERENCES meal_plans(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  category text NOT NULL,
  quantity numeric(5,2) NOT NULL,
  unit text NOT NULL,
  is_pantry_staple boolean DEFAULT false,
  is_purchased boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE dietary_restrictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutritional_guidelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own food items"
  ON food_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their dietary restrictions"
  ON dietary_restrictions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their nutritional guidelines"
  ON nutritional_guidelines
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

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
  ));

CREATE POLICY "Users can manage their shopping lists"
  ON shopping_lists
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM meal_plans mp
    WHERE mp.id = meal_plan_id
    AND mp.user_id = auth.uid()
  ));