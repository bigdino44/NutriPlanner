import { supabase } from '../supabase';
import type { Meal } from '../../types';

export async function createMealPlan(startDate: string, endDate: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');

  return supabase
    .from('meal_plans')
    .insert([{ user_id: user.id, start_date: startDate, end_date: endDate }])
    .select()
    .single();
}

export async function getMealPlans() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');

  const { data, error } = await supabase
    .from('meal_plans')
    .select(`
      id,
      start_date,
      end_date,
      meals (
        id,
        name,
        type,
        day_of_week,
        total_calories,
        total_protein,
        total_carbs,
        total_fat,
        meal_foods (
          id,
          quantity,
          unit,
          food:food_items (*)
        )
      )
    `)
    .eq('user_id', user.id)
    .order('start_date', { ascending: false });

  if (error) throw error;

  return {
    data: data?.map(plan => ({
      id: plan.id,
      startDate: plan.start_date,
      endDate: plan.end_date,
      meals: plan.meals?.map(meal => {
        const startDate = new Date(plan.start_date);
        const mealDate = new Date(startDate);
        mealDate.setDate(startDate.getDate() + meal.day_of_week);

        return {
          id: meal.id,
          name: meal.name,
          type: meal.type,
          date: mealDate.toISOString(),
          totalCalories: meal.total_calories,
          totalNutrients: {
            protein: meal.total_protein,
            carbs: meal.total_carbs,
            fat: meal.total_fat
          },
          foods: meal.meal_foods?.map(mf => ({
            ...mf.food,
            quantity: mf.quantity,
            unit: mf.unit
          })) || []
        };
      }) || []
    })) || [],
    error: null
  };
}

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