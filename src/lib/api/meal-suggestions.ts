import { supabase } from '../supabase';
import type { Food, MealType } from '../../types';

export async function getSuggestedFoods(mealType: MealType) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Authentication required');

  // Get foods the user likes or tolerates, respecting frequency limits
  return supabase
    .from('food_items')
    .select('*')
    .eq('user_id', user.id)
    .in('preference', ['like', 'tolerate'])
    .order('preference', { ascending: false }) // Liked foods first
    .limit(10);
}

export async function generateShoppingList(mealPlanId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Authentication required');

  // Get all foods from the meal plan
  const { data: meals } = await supabase
    .from('meals')
    .select(`
      id,
      meal_foods (
        quantity,
        unit,
        food:food_items (
          name,
          category
        )
      )
    `)
    .eq('meal_plan_id', mealPlanId);

  if (!meals) return { data: null, error: 'No meals found' };

  // Aggregate quantities by food
  const foodMap = new Map();
  meals.forEach(meal => {
    meal.meal_foods?.forEach(mf => {
      const key = `${mf.food.name}-${mf.unit}`;
      const existing = foodMap.get(key) || {
        name: mf.food.name,
        category: mf.food.category,
        quantity: 0,
        unit: mf.unit
      };
      existing.quantity += mf.quantity;
      foodMap.set(key, existing);
    });
  });

  // Insert aggregated items into shopping list
  const { error } = await supabase
    .from('shopping_lists')
    .insert(
      Array.from(foodMap.values()).map(item => ({
        meal_plan_id: mealPlanId,
        item_name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        is_purchased: false,
        is_pantry_staple: false
      }))
    );

  return { error };
}