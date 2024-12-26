import React from 'react';
import { PlusCircle } from 'lucide-react';
import { MealItem } from './MealItem';
import { AddMealDialog } from './AddMealDialog';
import { useMealPlans } from '../../hooks/useMealPlans';
import type { Meal } from '../../types';

interface Props {
  date: Date;
  planId: string;
}

export function DayMeals({ date, planId }: Props) {
  const [isAddingMeal, setIsAddingMeal] = React.useState(false);
  const { getMealsForDate, fetchPlans } = useMealPlans();
  const meals = getMealsForDate(planId, date);

  return (
    <div className="border-t pt-4 first:border-t-0 first:pt-0">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-900">
          {date.toLocaleDateString('en-US', { weekday: 'long' })}
        </h4>
        <button
          onClick={() => setIsAddingMeal(true)}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
        >
          <PlusCircle className="w-4 h-4 mr-1" />
          Add Meal
        </button>
      </div>

      <div className="space-y-2">
        {meals.map((meal) => (
          <MealItem key={meal.id} meal={meal} onUpdate={fetchPlans} />
        ))}
        {meals.length === 0 && (
          <p className="text-sm text-gray-500 italic">No meals planned</p>
        )}
      </div>

      {isAddingMeal && (
        <AddMealDialog
          planId={planId}
          date={date.toISOString()}
          onClose={() => setIsAddingMeal(false)}
          onAdd={fetchPlans}
        />
      )}
    </div>
  );
}