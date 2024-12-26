import React from 'react';
import { FoodItem } from './FoodItem';
import { useMealFoods } from '../../hooks/useMealFoods';
import type { Food } from '../../types';

interface Props {
  mealId: string;
  foods: (Food & { quantity: number; unit: string })[];
  onUpdate: () => void;
}

export function MealFoodList({ mealId, foods, onUpdate }: Props) {
  const { updateFood, removeFood, loading } = useMealFoods(mealId);

  const handleUpdateQuantity = async (food: Food & { quantity: number; unit: string }, quantity: number) => {
    await updateFood(food.id, quantity, food.unit);
    onUpdate();
  };

  const handleUpdateUnit = async (food: Food & { quantity: number; unit: string }, unit: string) => {
    await updateFood(food.id, food.quantity, unit);
    onUpdate();
  };

  const handleRemove = async (foodId: string) => {
    await removeFood(foodId);
    onUpdate();
  };

  return (
    <div className="space-y-2">
      {foods.map((food) => (
        <FoodItem
          key={food.id}
          food={food}
          onQuantityChange={(quantity) => handleUpdateQuantity(food, quantity)}
          onUnitChange={(unit) => handleUpdateUnit(food, unit)}
          onRemove={() => handleRemove(food.id)}
          disabled={loading}
        />
      ))}
    </div>
  );
}