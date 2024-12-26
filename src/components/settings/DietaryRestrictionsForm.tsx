import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Plus } from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { DietaryRestrictionItem } from './DietaryRestrictionItem';

export function DietaryRestrictionsForm() {
  const { guidelines, restrictions, loading, error, saveSettings } = useSettings();
  const [values, setValues] = useState(restrictions);
  const [newRestriction, setNewRestriction] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setValues(restrictions);
  }, [restrictions]);

  const handleAdd = () => {
    if (!newRestriction.trim()) return;
    setValues([...values, { 
      id: crypto.randomUUID(),
      name: newRestriction.trim(),
      description: ''
    }]);
    setNewRestriction('');
  };

  const handleRemove = (id: string) => {
    setValues(values.filter(r => r.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    try {
      const success = await saveSettings(guidelines, values);
      if (!success) {
        throw new Error('Failed to save restrictions');
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save restrictions');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Dietary Restrictions
      </h2>

      {saveError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {saveError}
        </div>
      )}
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newRestriction}
            onChange={e => setNewRestriction(e.target.value)}
            placeholder="Add a restriction..."
            className="block flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <ul className="space-y-2">
          {values.map(restriction => (
            <DietaryRestrictionItem
              key={restriction.id}
              restriction={restriction}
              onRemove={handleRemove}
            />
          ))}
        </ul>

        <button
          type="submit"
          disabled={saving}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Restrictions'}
        </button>
      </div>
    </form>
  );
}