import React from 'react';
import type { WeeklyPlan } from '../../types';

interface LatestMealPlanProps {
  plan: WeeklyPlan;
  onViewPlan: () => void;
}

export function LatestMealPlan({ plan, onViewPlan }: LatestMealPlanProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Latest Meal Plan</h3>
          <p className="text-sm text-gray-500 mt-1">
            Week of {new Date(plan.startDate).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={onViewPlan}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View Plan
        </button>
      </div>
    </div>
  );
}