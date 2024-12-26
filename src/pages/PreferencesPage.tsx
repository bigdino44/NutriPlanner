import React from 'react';
import { FoodPreferencesForm } from '../components/preferences/FoodPreferencesForm';
import { PreferencesList } from '../components/preferences/PreferencesList';

export function PreferencesPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Food Preferences</h1>
      <FoodPreferencesForm />
      <PreferencesList />
    </div>
  );
}