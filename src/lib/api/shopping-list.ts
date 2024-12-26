import { supabase } from '../supabase';
import type { ShoppingListItem, NewShoppingListItem } from '../../types';

export async function getShoppingList(mealPlanId: string) {
  const { data, error } = await supabase
    .from('shopping_lists')
    .select('*')
    .eq('meal_plan_id', mealPlanId)
    .order('category', { ascending: true })
    .order('item_name', { ascending: true });

  if (error) throw error;

  return {
    data: data?.map(item => ({
      id: item.id,
      name: item.item_name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      isPurchased: item.is_purchased,
      isPantryStaple: item.is_pantry_staple,
      mealPlanId: item.meal_plan_id
    })) as ShoppingListItem[],
    error: null
  };
}

export async function updateShoppingItem(id: string, updates: Partial<ShoppingListItem>) {
  const { data, error } = await supabase
    .from('shopping_lists')
    .update({
      item_name: updates.name,
      quantity: updates.quantity,
      unit: updates.unit,
      is_purchased: updates.isPurchased,
      is_pantry_staple: updates.isPantryStaple,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return { data, error: null };
}

export async function deleteShoppingItem(id: string) {
  const { error } = await supabase
    .from('shopping_lists')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return { error: null };
}

export async function addShoppingItem(item: NewShoppingListItem) {
  const { data, error } = await supabase
    .from('shopping_lists')
    .insert([{
      meal_plan_id: item.meal_plan_id,
      item_name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      is_purchased: item.is_purchased || false,
      is_pantry_staple: item.is_pantry_staple || false
    }])
    .select()
    .single();

  if (error) throw error;
  return { data, error: null };
}