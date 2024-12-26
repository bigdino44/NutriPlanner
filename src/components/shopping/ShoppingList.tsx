import React, { useEffect } from 'react';
import { useShoppingList } from '../../hooks/useShoppingList';
import { ShoppingCategory } from './ShoppingCategory';
import { AddShoppingItem } from './AddShoppingItem';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ShoppingListEmpty } from './ShoppingListEmpty';
import { useRealtimeSubscription } from '../../hooks/useRealtimeSubscription';

interface Props {
  mealPlanId: string;
}

export function ShoppingList({ mealPlanId }: Props) {
  const { 
    items, 
    loading,
    error, 
    fetchItems, 
    togglePurchased,
    updateItem,
    deleteItem,
    addItem 
  } = useShoppingList(mealPlanId);

  useEffect(() => {
    fetchItems();
  }, [mealPlanId, fetchItems]);

  useRealtimeSubscription(
    { table: 'shopping_lists', filter: `meal_plan_id=eq.${mealPlanId}` },
    fetchItems
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>;
  }

  const categories = Array.from(new Set(items.map(item => item.category))).sort();

  return (
    <div className="space-y-6">
      <AddShoppingItem 
        onAdd={async (item) => {
          await addItem({
            ...item,
            meal_plan_id: mealPlanId,
            is_purchased: false,
            is_pantry_staple: false
          });
        }} 
      />

      {items.length === 0 ? (
        <ShoppingListEmpty />
      ) : (
        categories.map(category => (
          <ShoppingCategory
            key={category}
            category={category}
            items={items.filter(item => item.category === category)}
            onToggleItem={togglePurchased}
            onUpdateItem={updateItem}
            onDeleteItem={deleteItem}
          />
        ))
      )}
    </div>
  );
}