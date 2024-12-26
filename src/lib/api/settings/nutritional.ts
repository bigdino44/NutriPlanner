import { supabase } from '../../supabase';
import { DEFAULT_GUIDELINES } from './defaults';
import type { NutritionalGuidelines } from '../../../types';

async function ensureUserSettings(userId: string) {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (!data && !error) {
    // No settings exist, create defaults
    const { data: newData, error: insertError } = await supabase
      .from('user_settings')
      .insert([{
        user_id: userId,
        daily_calories: DEFAULT_GUIDELINES.calories,
        daily_protein: DEFAULT_GUIDELINES.protein,
        daily_carbs: DEFAULT_GUIDELINES.carbs,
        daily_fat: DEFAULT_GUIDELINES.fat
      }])
      .select()
      .single();

    if (insertError) throw insertError;
    return newData;
  }

  if (error) throw error;
  return data;
}

export async function getNutritionalGuidelines() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');

  try {
    const data = await ensureUserSettings(user.id);
    
    return {
      data: {
        calories: data.daily_calories,
        protein: data.daily_protein,
        carbs: data.daily_carbs,
        fat: data.daily_fat
      },
      error: null
    };
  } catch (error) {
    console.error('Failed to get nutritional guidelines:', error);
    return { data: DEFAULT_GUIDELINES, error };
  }
}

export async function updateNutritionalGuidelines(guidelines: NutritionalGuidelines) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');

  // Ensure settings exist before updating
  await ensureUserSettings(user.id);

  return supabase
    .from('user_settings')
    .update({
      daily_calories: guidelines.calories,
      daily_protein: guidelines.protein,
      daily_carbs: guidelines.carbs,
      daily_fat: guidelines.fat,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id)
    .select()
    .single();
}