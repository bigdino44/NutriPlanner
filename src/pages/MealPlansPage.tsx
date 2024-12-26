import React from 'react';
import { MealPlanList } from '../components/meal-plans/MealPlanList';
import { CreateMealPlanButton } from '../components/meal-plans/CreateMealPlanButton';

export function MealPlansPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Meal Plans</h1>
        <CreateMealPlanButton />
      </div>
      <MealPlanList />
    </div>
  );
}