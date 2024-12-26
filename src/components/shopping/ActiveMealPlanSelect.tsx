import React from 'react';
import { useMealPlans } from '../../hooks/useMealPlans';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function ActiveMealPlanSelect({ value, onChange }: Props) {
  const { plans, loading } = useMealPlans();

  if (loading) return null;

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
    >
      <option value="">Select a meal plan</option>
      {plans.map((plan) => (
        <option key={plan.id} value={plan.id}>
          Week of {new Date(plan.startDate).toLocaleDateString()}
        </option>
      ))}
    </select>
  );
}