import React from 'react';

interface FrequencyInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function FrequencyInput({ value, onChange, disabled }: FrequencyInputProps) {
  return (
    <div>
      <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
        Maximum Times Per Week
      </label>
      <input
        type="number"
        id="frequency"
        min="1"
        max="7"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        disabled={disabled}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:opacity-50 disabled:bg-gray-100"
      />
    </div>
  );
}