import React, { useEffect, useState, useCallback } from 'react';
import { getFoodPreferences } from '../../lib/api/food-preferences';
import { PreferenceItem } from './PreferenceItem';
import { useAuth } from '../../hooks/useAuth';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';
import type { Food } from '../../types';

export function PreferencesList() {
  const { isAuthenticated } = useAuth();
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFoods = useCallback(async () => {
    try {
      const { data, error: fetchError } = await getFoodPreferences();
      if (fetchError) throw fetchError;
      setFoods(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load food preferences');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchFoods();
  }, [isAuthenticated, fetchFoods]);

  useRealtimeSubscription(
    { table: 'food_items' },
    fetchFoods
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

  if (foods.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No food preferences added yet. Start by adding some foods above!
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Preferences</h3>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {foods.map((food) => (
            <PreferenceItem 
              key={food.id} 
              food={food} 
              onUpdate={fetchFoods}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}