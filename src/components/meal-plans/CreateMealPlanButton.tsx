import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useMealPlans } from '../../hooks/useMealPlans';

export function CreateMealPlanButton() {
  const [isCreating, setIsCreating] = useState(false);
  const { createPlan } = useMealPlans();

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const today = new Date();
      const startDate = today.toISOString().split('T')[0];
      const endDate = new Date(today.setDate(today.getDate() + 6))
        .toISOString()
        .split('T')[0];
      
      await createPlan(startDate, endDate);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <button
      onClick={handleCreate}
      disabled={isCreating}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
    >
      <Plus className="w-4 h-4 mr-2" />
      {isCreating ? 'Creating...' : 'Create Meal Plan'}
    </button>
  );
}