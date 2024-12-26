import { supabase } from '../supabase';
import type { Meal } from '../../types';

export async function createMeal(planId: string, meal: Omit<Meal, 'id'>) {
  try {
    const { data: mealData, error: mealError } = await supabase
      .from('meals')
      .insert([{
        meal_plan_id: planId,
        name: meal.name,
        type: meal.type,
        day_of_week: new Date(meal.date).getDay(),
        total_calories: meal.totalCalories,
        total_protein: meal.totalNutrients.protein,
        total_carbs: meal.totalNutrients.carbs,
        total_fat: meal.totalNutrients.fat
      }])
      .select()
      .single();

    if (mealError) throw mealError;

    if (meal.foods.length > 0) {
      const { error: foodsError } = await supabase
        .from('meal_foods')
        .insert(
          meal.foods.map(food => ({
            meal_id: mealData.id,
            food_id: food.id,
            quantity: food.quantity || 1,
            unit: food.unit || 'serving'
          }))
        );

      if (foodsError) throw foodsError;
    }

    return { data: mealData, error: null };
  } catch (error) {
    console.error('Error creating meal:', error);
    return { data: null, error };
  }
}

export async function getMeal(mealId: string) {
  return supabase
    .from('meals')
    .select(`
      *,
      meal_foods (
        quantity,
        unit,
        food:food_items (*)
      )
    `)
    .eq('id', mealId)
    .single();
}