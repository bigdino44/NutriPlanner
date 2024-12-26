import React from 'react';
import { X } from 'lucide-react';
import { FoodQuantityInput } from './FoodQuantityInput';
import type { Food } from '../../types';

interface Props {
  food: Food & { quantity: number; unit: string };
  onQuantityChange: (quantity: number) => void;
  onUnitChange: (unit: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export function FoodItem({ 
  food, 
  onQuantityChange, 
  onUnitChange, 
  onRemove, 
  disabled 
}: Props) {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
      <div>
        <div className="font-medium">{food.name}</div>
        <div className="text-xs text-gray-500">
          {food.calories * food.quantity} cal
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <FoodQuantityInput
          quantity={food.quantity}
          unit={food.unit}
          onQuantityChange={onQuantityChange}
          onUnitChange={onUnitChange}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="text-red-600 hover:text-red-700 disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}