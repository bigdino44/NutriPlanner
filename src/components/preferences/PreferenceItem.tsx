import React, { useState } from 'react';
import { Edit2, Trash2, X, Check } from 'lucide-react';
import { FoodCategorySelect } from './FoodCategorySelect';
import { PreferenceSelect } from './PreferenceSelect';
import { FrequencyInput } from './FrequencyInput';
import { useFoodPreferences } from '../../hooks/useFoodPreferences';
import type { Food } from '../../types';

interface PreferenceItemProps {
  food: Food;
  onUpdate: () => void;
}

export function PreferenceItem({ food, onUpdate }: PreferenceItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFood, setEditedFood] = useState(food);
  const { handleUpdate, handleDelete } = useFoodPreferences();

  const preferenceStyles = {
    like: 'bg-green-100 text-green-800',
    dislike: 'bg-red-100 text-red-800',
    tolerate: 'bg-yellow-100 text-yellow-800'
  };

  const handleSave = async () => {
    try {
      await handleUpdate(food.id, editedFood);
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      // Error is handled in the hook
    }
  };

  const handleDeleteClick = async () => {
    if (window.confirm('Are you sure you want to delete this food preference?')) {
      try {
        await handleDelete(food.id);
        onUpdate();
      } catch (err) {
        // Error is handled in the hook
      }
    }
  };

  if (isEditing) {
    return (
      <li className="px-4 py-4 sm:px-6">
        <div className="space-y-3">
          <input
            type="text"
            value={editedFood.name}
            onChange={(e) => setEditedFood({ ...editedFood, name: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <FoodCategorySelect
              value={editedFood.category}
              onChange={(category) => setEditedFood({ ...editedFood, category })}
            />
            <PreferenceSelect
              value={editedFood.preference}
              onChange={(preference) => setEditedFood({ ...editedFood, preference })}
            />
          </div>
          {editedFood.preference === 'like' && (
            <FrequencyInput
              value={editedFood.frequency_limit || 1}
              onChange={(frequency_limit) => setEditedFood({ ...editedFood, frequency_limit })}
            />
          )}
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Check className="w-4 h-4 mr-1" />
              Save
            </button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <p className="text-sm font-medium text-gray-900">{food.name}</p>
          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            {food.category}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            preferenceStyles[food.preference]
          }`}>
            {food.preference}
          </span>
          {food.frequency_limit && (
            <span className="text-sm text-gray-500">
              Max {food.frequency_limit}x/week
            </span>
          )}
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-blue-600"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDeleteClick}
            className="text-gray-400 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </li>
  );
}