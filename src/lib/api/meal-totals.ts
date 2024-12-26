import type { Food } from '../../types';

export function calculateMealTotals(foods: (Food & { quantity: number })[]) {
  return foods.reduce((acc, food) => ({
    calories: acc.calories + (food.calories * food.quantity),
    protein: acc.protein + (food.protein * food.quantity),
    carbs: acc.carbs + (food.carbs * food.quantity),
    fat: acc.fat + (food.fat * food.quantity)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
}