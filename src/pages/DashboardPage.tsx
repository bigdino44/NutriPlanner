import React from 'react';
import { useMealPlans } from '../hooks/useMealPlans';
import { useSettings } from '../hooks/useSettings';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { QuickActions } from '../components/dashboard/QuickActions';
import { LatestMealPlan } from '../components/dashboard/LatestMealPlan';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const navigate = useNavigate();
  const { plans = [], error: plansError } = useMealPlans();
  const { guidelines, error: settingsError } = useSettings();

  const error = plansError || settingsError;

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to your meal planning dashboard</p>
      </div>

      <DashboardStats plans={plans} guidelines={guidelines} />
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <QuickActions />
      </div>

      {plans.length > 0 && (
        <LatestMealPlan 
          plan={plans[0]} 
          onViewPlan={() => navigate('/meal-plans')} 
        />
      )}
    </div>
  );
}