import { useState, useCallback } from 'react';
import { getMealPlans } from '../lib/api/meal-plans';
import type { WeeklyPlan } from '../types';

export function useMealPlans() {
  const [plans, setPlans] = useState<WeeklyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      const { data, error: fetchError } = await getMealPlans();
      if (fetchError) throw fetchError;
      setPlans(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load meal plans');
    } finally {
      setLoading(false);
    }
  }, []);

  const getMealsForDate = useCallback((planId: string, date: Date) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return [];
    
    const dateStr = date.toISOString().split('T')[0];
    return plan.meals.filter(meal => 
      meal.date.split('T')[0] === dateStr
    );
  }, [plans]);

  return { 
    plans, 
    loading, 
    error, 
    fetchPlans,
    getMealsForDate
  };
}