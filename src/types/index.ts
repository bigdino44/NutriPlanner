export type FoodCategory = 'fruits' | 'vegetables' | 'proteins' | 'carbs' | 'dairy' | 'snacks';
export type FoodPreference = 'like' | 'dislike' | 'tolerate';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Food {
  id: string;
  name: string;
  category: FoodCategory;
  preference: FoodPreference;
  frequency_limit?: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DietaryRestriction {
  id: string;
  name: string;
  description: string;
}

export interface NutritionalGuidelines {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  name: string;
  type: MealType;
  date: string;
  foods: Food[];
  totalCalories: number;
  totalNutrients: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface WeeklyPlan {
  id: string;
  startDate: string;
  endDate: string;
  meals: Meal[];
}

export interface ShoppingListItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  isPurchased: boolean;
  isPantryStaple: boolean;
  mealPlanId: string;
}

export interface NewShoppingListItem {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  meal_plan_id: string;
  is_purchased?: boolean;
  is_pantry_staple?: boolean;
}