import React from 'react';
import { FoodPreference } from '../../types';

interface PreferenceSelectProps {
  value: FoodPreference;
  onChange: (value: FoodPreference) => void;
}

const preferences: FoodPreference[] = ['like', 'dislike', 'tolerate'];

export function PreferenceSelect({ value, onChange }: PreferenceSelectProps) {
  return (
    <div>
      <label htmlFor="preference" className="block text-sm font-medium text-gray-700">
        Preference
      </label>
      <select
        id="preference"
        value={value}
        onChange={(e) => onChange(e.target.value as FoodPreference)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      >
        {preferences.map((preference) => (
          <option key={preference} value={preference}>
            {preference.charAt(0).toUpperCase() + preference.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}