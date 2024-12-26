import { supabase } from '../supabase';
import type { Food } from '../../types';

export async function addFoodToMeal(
  mealId: string, 
  food: Food & { quantity: number; unit: string }
) {
  return supabase
    .from('meal_foods')
    .insert([{
      meal_id: mealId,
      food_id: food.id,
      quantity: food.quantity,
      unit: food.unit
    }])
    .select()
    .single();
}

export async function updateMealFood(
  mealId: string,
  foodId: string,
  updates: { quantity?: number; unit?: string }
) {
  return supabase
    .from('meal_foods')
    .update(updates)
    .eq('meal_id', mealId)
    .eq('food_id', foodId)
    .select()
    .single();
}

export async function removeFoodFromMeal(mealId: string, foodId: string) {
  return supabase
    .from('meal_foods')
    .delete()
    .eq('meal_id', mealId)
    .eq('food_id', foodId);
}