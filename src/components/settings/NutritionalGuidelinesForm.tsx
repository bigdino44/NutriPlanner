import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { NutritionalInput } from './NutritionalInput';

export function NutritionalGuidelinesForm() {
  const { guidelines, loading, error, saveSettings } = useSettings();
  const [values, setValues] = useState(guidelines);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setValues(guidelines);
  }, [guidelines]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      const success = await saveSettings(values, []);
      if (!success) {
        throw new Error('Failed to save guidelines');
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save guidelines');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Nutritional Guidelines
      </h2>
      
      {saveError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {saveError}
        </div>
      )}

      <div className="space-y-4">
        <NutritionalInput
          label="Daily Calories"
          value={values.calories}
          onChange={(calories) => setValues(v => ({ ...v, calories }))}
        />
        <NutritionalInput
          label="Protein (g)"
          value={values.protein}
          onChange={(protein) => setValues(v => ({ ...v, protein }))}
        />
        <NutritionalInput
          label="Carbs (g)"
          value={values.carbs}
          onChange={(carbs) => setValues(v => ({ ...v, carbs }))}
        />
        <NutritionalInput
          label="Fat (g)"
          value={values.fat}
          onChange={(fat) => setValues(v => ({ ...v, fat }))}
        />

        <button
          type="submit"
          disabled={saving}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Guidelines'}
        </button>
      </div>
    </form>
  );
}