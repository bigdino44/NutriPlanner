import { supabase } from '../supabase';
import type { FoodCategory, FoodPreference, Food } from '../../types';

interface CreateFoodPreference {
  name: string;
  category: FoodCategory;
  preference: FoodPreference;
  frequencyLimit?: number;
}

export async function createFoodPreference(data: CreateFoodPreference) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }

  return supabase
    .from('food_items')
    .insert([{
      user_id: user.id,
      name: data.name,
      category: data.category,
      preference: data.preference,
      frequency_limit: data.frequencyLimit,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    }])
    .select()
    .single();
}

export async function updateFoodPreference(id: string, data: Partial<CreateFoodPreference>) {
  return supabase
    .from('food_items')
    .update({
      name: data.name,
      category: data.category,
      preference: data.preference,
      frequency_limit: data.frequencyLimit
    })
    .eq('id', id)
    .select()
    .single();
}

export async function deleteFoodPreference(id: string) {
  return supabase
    .from('food_items')
    .delete()
    .eq('id', id);
}

export async function getFoodPreferences() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }

  return supabase
    .from('food_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
}