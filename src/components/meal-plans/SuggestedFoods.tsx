import React from 'react';
import { getSuggestedFoods } from '../../lib/api/meal-suggestions';
import type { Food, MealType } from '../../types';

interface Props {
  mealType: MealType;
  onSelectFood: (food: Food) => void;
}

export function SuggestedFoods({ mealType, onSelectFood }: Props) {
  const [foods, setFoods] = React.useState<Food[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const { data } = await getSuggestedFoods(mealType);
        setFoods(data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, [mealType]);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading suggestions...</div>;
  }

  if (foods.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No food preferences found. Add some in the Preferences page!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">Suggested Foods</h4>
      <div className="grid grid-cols-2 gap-2">
        {foods.map((food) => (
          <button
            key={food.id}
            onClick={() => onSelectFood(food)}
            className="text-left p-2 text-sm rounded-md hover:bg-gray-50 border border-gray-200"
          >
            <div className="font-medium">{food.name}</div>
            <div className="text-xs text-gray-500 capitalize">{food.category}</div>
          </button>
        ))}
      </div>
    </div>
  );
}