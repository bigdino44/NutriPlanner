import { useState, useCallback } from 'react';
import { 
  getShoppingList, 
  updateShoppingItem, 
  deleteShoppingItem,
  addShoppingItem 
} from '../lib/api/shopping-list';
import type { ShoppingListItem, NewShoppingListItem } from '../types';

export function useShoppingList(mealPlanId: string) {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      const { data, error: fetchError } = await getShoppingList(mealPlanId);
      if (fetchError) throw fetchError;
      setItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load shopping list');
    } finally {
      setLoading(false);
    }
  }, [mealPlanId]);

  const togglePurchased = async (id: string, purchased: boolean) => {
    try {
      const { error: updateError } = await updateShoppingItem(id, { isPurchased: purchased });
      if (updateError) throw updateError;
      setItems(items.map(item => 
        item.id === id ? { ...item, isPurchased: purchased } : item
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
      throw err;
    }
  };

  const updateItem = async (id: string, updates: Partial<ShoppingListItem>) => {
    try {
      const { error: updateError } = await updateShoppingItem(id, updates);
      if (updateError) throw updateError;
      setItems(items.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error: deleteError } = await deleteShoppingItem(id);
      if (deleteError) throw deleteError;
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      throw err;
    }
  };

  const addItem = async (newItem: Omit<NewShoppingListItem, 'meal_plan_id'>) => {
    try {
      const { data, error: addError } = await addShoppingItem({
        ...newItem,
        meal_plan_id: mealPlanId
      });
      if (addError) throw addError;
      if (data) {
        setItems([...items, {
          id: data.id,
          name: data.item_name,
          category: data.category,
          quantity: data.quantity,
          unit: data.unit,
          isPurchased: data.is_purchased,
          isPantryStaple: data.is_pantry_staple,
          mealPlanId: data.meal_plan_id
        }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
      throw err;
    }
  };

  return { 
    items, 
    loading,
    error, 
    fetchItems, 
    togglePurchased,
    updateItem,
    deleteItem,
    addItem
  };
}