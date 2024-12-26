import React, { useState } from 'react';
import { Clock, Edit2, Trash2 } from 'lucide-react';
import { MealFoodList } from './MealFoodList';
import type { Meal } from '../../types';

interface Props {
  meal: Meal;
  onUpdate: () => void;
}

export function MealItem({ meal, onUpdate }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-50 rounded-md p-3">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-sm font-medium text-gray-900">{meal.name}</h5>
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            <span className="capitalize">{meal.type}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-xs text-gray-500">
            {meal.totalCalories} cal
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-blue-600"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isExpanded && meal.foods && meal.foods.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <MealFoodList
            mealId={meal.id}
            foods={meal.foods}
            onUpdate={onUpdate}
          />
        </div>
      )}
    </div>
  );
}