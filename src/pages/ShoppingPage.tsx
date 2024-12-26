import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingList } from '../components/shopping/ShoppingList';
import { ShoppingListHeader } from '../components/shopping/ShoppingListHeader';

export function ShoppingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedPlanId = searchParams.get('plan') || '';

  const handlePlanChange = (planId: string) => {
    setSearchParams(planId ? { plan: planId } : {});
  };

  return (
    <div className="space-y-8">
      <ShoppingListHeader 
        selectedPlanId={selectedPlanId}
        onPlanChange={handlePlanChange}
      />
      
      {selectedPlanId ? (
        <ShoppingList mealPlanId={selectedPlanId} />
      ) : (
        <div className="text-center py-8 text-gray-500">
          Select a meal plan to view its shopping list
        </div>
      )}
    </div>
  );
}