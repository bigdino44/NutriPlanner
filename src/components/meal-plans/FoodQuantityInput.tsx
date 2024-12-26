import React from 'react';

interface Props {
  quantity: number;
  unit: string;
  onQuantityChange: (quantity: number) => void;
  onUnitChange: (unit: string) => void;
  disabled?: boolean;
}

export function FoodQuantityInput({ 
  quantity, 
  unit, 
  onQuantityChange, 
  onUnitChange, 
  disabled 
}: Props) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="number"
        min="0.1"
        step="0.1"
        value={quantity}
        onChange={(e) => onQuantityChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
      />
      <select
        value={unit}
        onChange={(e) => onUnitChange(e.target.value)}
        disabled={disabled}
        className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
      >
        <option value="serving">serving</option>
        <option value="g">g</option>
        <option value="oz">oz</option>
        <option value="cup">cup</option>
        <option value="tbsp">tbsp</option>
        <option value="tsp">tsp</option>
      </select>
    </div>
  );
}