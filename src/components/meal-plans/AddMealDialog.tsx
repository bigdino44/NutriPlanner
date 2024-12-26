import React, { useState } from 'react';
import { X } from 'lucide-react';
import { SuggestedFoods } from './SuggestedFoods';
import { FoodItem } from './FoodItem';
import { createMeal } from '../../lib/api/meals';
import { calculateMealTotals } from '../../lib/api/meal-totals';
import type { Meal, MealType, Food } from '../../types';

interface Props {
  planId: string;
  date: string;
  onClose: () => void;
  onAdd: () => void;
}

export function AddMealDialog({ planId, date, onClose, onAdd }: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState<MealType>('breakfast');
  const [selectedFoods, setSelectedFoods] = useState<(Food & { quantity: number; unit: string })[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddFood = (food: Food) => {
    if (!selectedFoods.find(f => f.id === food.id)) {
      setSelectedFoods([...selectedFoods, { ...food, quantity: 1, unit: 'serving' }]);
    }
  };

  const handleUpdateQuantity = (foodId: string, quantity: number) => {
    setSelectedFoods(foods => 
      foods.map(f => f.id === foodId ? { ...f, quantity } : f)
    );
  };

  const handleUpdateUnit = (foodId: string, unit: string) => {
    setSelectedFoods(foods => 
      foods.map(f => f.id === foodId ? { ...f, unit } : f)
    );
  };

  const handleRemoveFood = (foodId: string) => {
    setSelectedFoods(foods => foods.filter(f => f.id !== foodId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const totals = calculateMealTotals(selectedFoods);
      const { error: createError } = await createMeal(planId, {
        name,
        type,
        date,
        foods: selectedFoods,
        totalCalories: totals.calories,
        totalNutrients: {
          protein: totals.protein,
          carbs: totals.carbs,
          fat: totals.fat
        }
      });

      if (createError) throw createError;
      onAdd();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add meal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Add Meal</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Meal Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Meal Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as MealType)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>

          <div className="border-t pt-4">
            <SuggestedFoods mealType={type} onSelectFood={handleAddFood} />
          </div>

          {selectedFoods.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Foods</h4>
              <div className="space-y-2">
                {selectedFoods.map((food) => (
                  <FoodItem
                    key={food.id}
                    food={food}
                    onQuantityChange={(quantity) => handleUpdateQuantity(food.id, quantity)}
                    onUnitChange={(unit) => handleUpdateUnit(food.id, unit)}
                    onRemove={() => handleRemoveFood(food.id)}
                    disabled={isSubmitting}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Meal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}