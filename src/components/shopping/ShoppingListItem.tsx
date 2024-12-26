import React from 'react';
import { Check } from 'lucide-react';
import type { ShoppingListItem as Item } from '../../types';

interface Props {
  item: Item;
  onToggle: (id: string, purchased: boolean) => void;
}

export function ShoppingListItem({ item, onToggle }: Props) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center">
        <button
          onClick={() => onToggle(item.id, !item.isPurchased)}
          className={`w-5 h-5 rounded border ${
            item.isPurchased
              ? 'bg-blue-600 border-blue-600'
              : 'border-gray-300'
          } flex items-center justify-center`}
        >
          {item.isPurchased && <Check className="w-4 h-4 text-white" />}
        </button>
        <span className={`ml-3 ${item.isPurchased ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {item.name}
        </span>
      </div>
      <span className="text-sm text-gray-500">
        {item.quantity} {item.unit}
      </span>
    </div>
  );
}