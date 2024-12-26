import React from 'react';
import { X } from 'lucide-react';
import type { DietaryRestriction } from '../../types';

interface DietaryRestrictionItemProps {
  restriction: DietaryRestriction;
  onRemove: (id: string) => void;
}

export function DietaryRestrictionItem({ restriction, onRemove }: DietaryRestrictionItemProps) {
  return (
    <li className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
      <span>{restriction.name}</span>
      <button
        type="button"
        onClick={() => onRemove(restriction.id)}
        className="text-gray-400 hover:text-red-600"
      >
        <X className="w-4 h-4" />
      </button>
    </li>
  );
}