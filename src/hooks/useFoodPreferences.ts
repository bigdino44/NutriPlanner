import { useState } from 'react';
import { 
  createFoodPreference, 
  updateFoodPreference, 
  deleteFoodPreference 
} from '../lib/api/food-preferences';
import type { FoodCategory, FoodPreference, Food } from '../types';

export function useFoodPreferences() {
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('fruits');
  const [preference, setPreference] = useState<FoodPreference>('like');
  const [frequency, setFrequency] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error: insertError } = await createFoodPreference({
        name: foodName,
        category,
        preference,
        frequencyLimit: preference === 'like' ? frequency : undefined,
      });

      if (insertError) throw insertError;

      // Reset form
      setFoodName('');
      setCategory('fruits');
      setPreference('like');
      setFrequency(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save food preference');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<Food>) => {
    setError(null);
    try {
      const { error: updateError } = await updateFoodPreference(id, {
        name: data.name,
        category: data.category,
        preference: data.preference,
        frequencyLimit: data.frequency_limit,
      });

      if (updateError) throw updateError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update food preference');
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      const { error: deleteError } = await deleteFoodPreference(id);
      if (deleteError) throw deleteError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete food preference');
      throw err;
    }
  };

  return {
    foodName,
    setFoodName,
    category,
    setCategory,
    preference,
    setPreference,
    frequency,
    setFrequency,
    handleSubmit,
    handleUpdate,
    handleDelete,
    isLoading,
    error,
  };
}