import React, { useState } from 'react';
import { Check, X, Edit2, Trash2 } from 'lucide-react';
import type { ShoppingListItem } from '../../types';

interface Props {
  item: ShoppingListItem;
  onToggle: (id: string, purchased: boolean) => Promise<void>;
  onUpdate: (id: string, updates: Partial<ShoppingListItem>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  disabled?: boolean;
}

export function EditableShoppingItem({ 
  item, 
  onToggle, 
  onUpdate, 
  onDelete,
  disabled 
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onUpdate(item.id, {
        name: editedItem.name,
        quantity: editedItem.quantity,
        unit: editedItem.unit
      });
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async () => {
    if (disabled || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onToggle(item.id, !item.isPurchased);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (disabled || isSubmitting) return;
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setIsSubmitting(true);
    try {
      await onDelete(item.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            value={editedItem.name}
            onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            disabled={isSubmitting}
          />
          <input
            type="number"
            value={editedItem.quantity}
            onChange={(e) => setEditedItem({ ...editedItem, quantity: parseFloat(e.target.value) || 0 })}
            min="0.1"
            step="0.1"
            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            disabled={isSubmitting}
          />
          <select
            value={editedItem.unit}
            onChange={(e) => setEditedItem({ ...editedItem, unit: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            disabled={isSubmitting}
          >
            <option value="unit">unit</option>
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="l">l</option>
            <option value="oz">oz</option>
            <option value="lb">lb</option>
          </select>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="text-green-600 hover:text-green-700 disabled:opacity-50"
          >
            <Check className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsEditing(false)}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-500 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center">
        <button
          onClick={handleToggle}
          disabled={disabled || isSubmitting}
          className={`w-5 h-5 rounded border ${
            item.isPurchased
              ? 'bg-blue-600 border-blue-600'
              : 'border-gray-300'
          } flex items-center justify-center disabled:opacity-50`}
        >
          {item.isPurchased && <Check className="w-4 h-4 text-white" />}
        </button>
        <span className={`ml-3 ${item.isPurchased ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {item.name}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">
          {item.quantity} {item.unit}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(true)}
            disabled={disabled || isSubmitting}
            className="text-gray-400 hover:text-blue-600 disabled:opacity-50"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={disabled || isSubmitting}
            className="text-gray-400 hover:text-red-600 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}