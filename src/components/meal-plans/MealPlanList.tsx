import React, { useEffect } from 'react';
import { useMealPlans } from '../../hooks/useMealPlans';
import { MealPlanCard } from './MealPlanCard';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';

export function MealPlanList() {
  const { plans, loading, error, fetchPlans } = useMealPlans();

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  useRealtimeSubscription(
    { table: 'meal_plans' },
    fetchPlans
  );

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        {error}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No meal plans created yet. Click the button above to create your first meal plan!
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <MealPlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}