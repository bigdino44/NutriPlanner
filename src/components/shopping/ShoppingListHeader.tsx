import React from 'react';
import { ActiveMealPlanSelect } from './ActiveMealPlanSelect';

interface Props {
  selectedPlanId: string;
  onPlanChange: (id: string) => void;
}

export function ShoppingListHeader({ selectedPlanId, onPlanChange }: Props) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Shopping List</h1>
      <ActiveMealPlanSelect 
        value={selectedPlanId} 
        onChange={onPlanChange}
      />
    </div>
  );
}