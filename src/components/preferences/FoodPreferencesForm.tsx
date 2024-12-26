import React from 'react';
import { FoodCategory, FoodPreference } from '../../types';
import { FoodCategorySelect } from './FoodCategorySelect';
import { PreferenceSelect } from './PreferenceSelect';
import { FrequencyInput } from './FrequencyInput';
import { useFoodPreferences } from '../../hooks/useFoodPreferences';

export function FoodPreferencesForm() {
  const {
    foodName,
    setFoodName,
    category,
    setCategory,
    preference,
    setPreference,
    frequency,
    setFrequency,
    handleSubmit,
    isLoading,
    error
  } = useFoodPreferences();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Food Preference</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="foodName" className="block text-sm font-medium text-gray-700">
            Food Name
          </label>
          <input
            type="text"
            id="foodName"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <FoodCategorySelect value={category} onChange={setCategory} />
        <PreferenceSelect value={preference} onChange={setPreference} />
        <FrequencyInput 
          value={frequency} 
          onChange={setFrequency}
          disabled={preference !== 'like'}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Add Food Preference'}
        </button>
      </form>
    </div>
  );
}