import React from 'react';
import { FoodCategory } from '../../types';

interface FoodCategorySelectProps {
  value: FoodCategory;
  onChange: (value: FoodCategory) => void;
}

const categories: FoodCategory[] = ['fruits', 'vegetables', 'proteins', 'carbs', 'dairy', 'snacks'];

export function FoodCategorySelect({ value, onChange }: FoodCategorySelectProps) {
  return (
    <div>
      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
        Category
      </label>
      <select
        id="category"
        value={value}
        onChange={(e) => onChange(e.target.value as FoodCategory)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}