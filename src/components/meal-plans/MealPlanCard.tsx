import React from 'react';
import { Calendar, ShoppingCart } from 'lucide-react';
import { DayMeals } from './DayMeals';
import { generateShoppingList } from '../../lib/api/meal-suggestions';
import { useNavigate } from 'react-router-dom';
import type { WeeklyPlan } from '../../types';

interface MealPlanCardProps {
  plan: WeeklyPlan;
}

export function MealPlanCard({ plan }: MealPlanCardProps) {
  const navigate = useNavigate();
  const startDate = new Date(plan.startDate);
  const endDate = new Date(plan.endDate);
  
  // Generate array of dates between start and end
  const dates = [];
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    dates.push(new Date(date));
  }

  const handleGenerateShoppingList = async () => {
    try {
      await generateShoppingList(plan.id);
      navigate(`/shopping?plan=${plan.id}`);
    } catch (error) {
      console.error('Failed to generate shopping list:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">
            Week of {startDate.toLocaleDateString()}
          </h3>
        </div>
        <button
          onClick={handleGenerateShoppingList}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <ShoppingCart className="w-4 h-4 mr-1" />
          Shopping List
        </button>
      </div>
      
      <div className="space-y-6">
        {dates.map((date) => (
          <DayMeals 
            key={date.toISOString()}
            date={date}
            planId={plan.id}
          />
        ))}
      </div>
    </div>
  );
}