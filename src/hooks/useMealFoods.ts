import { useState } from 'react';
import { addFoodToMeal, updateMealFood, removeFoodFromMeal } from '../lib/api/meal-foods';
import type { Food } from '../types';

export function useMealFoods(mealId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFood = async (food: Food, quantity: number = 1, unit: string = 'serving') => {
    setLoading(true);
    setError(null);
    try {
      await addFoodToMeal(mealId, { ...food, quantity, unit });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add food');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFood = async (foodId: string, quantity: number, unit: string) => {
    setLoading(true);
    setError(null);
    try {
      await updateMealFood(mealId, foodId, { quantity, unit });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update food');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFood = async (foodId: string) => {
    setLoading(true);
    setError(null);
    try {
      await removeFoodFromMeal(mealId, foodId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove food');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    addFood,
    updateFood,
    removeFood
  };
}