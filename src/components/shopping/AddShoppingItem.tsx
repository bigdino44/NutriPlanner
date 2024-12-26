import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface Props {
  onAdd: (item: { name: string; quantity: number; unit: string; category: string }) => Promise<void>;
  disabled?: boolean;
}

const CATEGORIES = [
  'produce',
  'dairy',
  'meat',
  'pantry',
  'frozen',
  'beverages',
  'snacks',
  'other'
];

const UNITS = [
  { value: 'unit', label: 'unit' },
  { value: 'g', label: 'grams' },
  { value: 'kg', label: 'kilograms' },
  { value: 'ml', label: 'milliliters' },
  { value: 'l', label: 'liters' },
  { value: 'oz', label: 'ounces' },
  { value: 'lb', label: 'pounds' }
];

export function AddShoppingItem({ onAdd, disabled }: Props) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('unit');
  const [category, setCategory] = useState('other');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || disabled) return;

    setIsSubmitting(true);
    try {
      await onAdd({ name: name.trim(), quantity, unit, category });
      setName('');
      setQuantity(1);
      setUnit('unit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Item name"
        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        required
        disabled={disabled || isSubmitting}
      />
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Math.max(0.1, parseFloat(e.target.value) || 0))}
        min="0.1"
        step="0.1"
        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        disabled={disabled || isSubmitting}
      />
      <select
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        disabled={disabled || isSubmitting}
      >
        {UNITS.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        disabled={disabled || isSubmitting}
      >
        {CATEGORIES.map(cat => (
          <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={disabled || isSubmitting}
        className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <Plus className="w-5 h-5" />
      </button>
    </form>
  );
}