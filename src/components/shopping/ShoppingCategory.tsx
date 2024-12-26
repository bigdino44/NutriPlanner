import React from 'react';
import { EditableShoppingItem } from './EditableShoppingItem';
import type { ShoppingListItem } from '../../types';

interface Props {
  category: string;
  items: ShoppingListItem[];
  onToggleItem: (id: string, purchased: boolean) => Promise<void>;
  onUpdateItem: (id: string, updates: Partial<ShoppingListItem>) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  disabled?: boolean;
}

export function ShoppingCategory({ 
  category, 
  items,
  onToggleItem,
  onUpdateItem,
  onDeleteItem,
  disabled
}: Props) {
  const sortedItems = [...items].sort((a, b) => {
    // Sort by purchased status first, then by name
    if (a.isPurchased !== b.isPurchased) {
      return a.isPurchased ? 1 : -1;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-gray-900 capitalize">
          {category}
        </h3>
        <span className="text-sm text-gray-500">
          {items.filter(i => i.isPurchased).length}/{items.length} items purchased
        </span>
      </div>
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {sortedItems.map(item => (
          <EditableShoppingItem
            key={item.id}
            item={item}
            onToggle={onToggleItem}
            onUpdate={onUpdateItem}
            onDelete={onDeleteItem}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}