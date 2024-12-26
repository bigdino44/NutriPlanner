import React from 'react';
import type { WeeklyPlan, NutritionalGuidelines } from '../../types';

interface DashboardStatsProps {
  plans: WeeklyPlan[];
  guidelines: NutritionalGuidelines;
}

export function DashboardStats({ plans, guidelines }: DashboardStatsProps) {
  const activePlanCount = plans.length;
  const totalMeals = plans.reduce((acc, plan) => acc + plan.meals.length, 0);
  const completedMeals = plans.reduce((acc, plan) => 
    acc + plan.meals.filter(meal => new Date(meal.date) < new Date()).length, 0);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard
        label="Active Plans"
        value={activePlanCount}
      />
      <StatCard
        label="Total Meals"
        value={totalMeals}
      />
      <StatCard
        label="Completed Meals"
        value={completedMeals}
      />
      <StatCard
        label="Daily Calorie Target"
        value={guidelines.calories}
        unit="cal"
      />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  unit?: string;
}

function StatCard({ label, value, unit }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-semibold mt-1">
        {value.toLocaleString()}{unit ? ` ${unit}` : ''}
      </p>
    </div>
  );
}