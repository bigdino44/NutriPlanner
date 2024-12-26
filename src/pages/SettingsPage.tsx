import React from 'react';
import { NutritionalGuidelinesForm } from '../components/settings/NutritionalGuidelinesForm';
import { DietaryRestrictionsForm } from '../components/settings/DietaryRestrictionsForm';

export function SettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <NutritionalGuidelinesForm />
        <DietaryRestrictionsForm />
      </div>
    </div>
  );
}