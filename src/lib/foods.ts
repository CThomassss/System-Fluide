export const FOOD_ITEMS = [
  "oats",
  "whole_eggs",
  "banana",
  "chicken_breast",
  "rice",
  "vegetables",
  "cream_of_rice",
  "whey_shake",
  "milk",
  "raspberries",
  "red_meat",
  "sweet_potato",
  "green_salad",
] as const;

export type FoodKey = (typeof FOOD_ITEMS)[number];

// Macros per 100g for each standard food item
interface MacrosPer100g {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const FOOD_MACRO_DATA: Record<FoodKey, MacrosPer100g> = {
  oats:            { calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9 },
  whole_eggs:      { calories: 155, protein: 13.0, carbs: 1.1,  fat: 11.0 },
  banana:          { calories: 89,  protein: 1.1,  carbs: 22.8, fat: 0.3 },
  chicken_breast:  { calories: 165, protein: 31.0, carbs: 0.0,  fat: 3.6 },
  rice:            { calories: 130, protein: 2.7,  carbs: 28.2, fat: 0.3 },
  vegetables:      { calories: 25,  protein: 2.0,  carbs: 4.0,  fat: 0.3 },
  cream_of_rice:   { calories: 370, protein: 7.0,  carbs: 82.0, fat: 1.0 },
  whey_shake:      { calories: 400, protein: 80.0, carbs: 8.0,  fat: 6.0 },
  milk:            { calories: 42,  protein: 3.4,  carbs: 5.0,  fat: 1.0 },
  raspberries:     { calories: 52,  protein: 1.2,  carbs: 11.9, fat: 0.7 },
  red_meat:        { calories: 250, protein: 26.0, carbs: 0.0,  fat: 15.0 },
  sweet_potato:    { calories: 86,  protein: 1.6,  carbs: 20.1, fat: 0.1 },
  green_salad:     { calories: 15,  protein: 1.4,  carbs: 2.2,  fat: 0.2 },
};

interface CustomFoodMacro {
  id: string;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  calories_per_100g: number;
}

interface MealItem {
  key: string;
  grams: number;
}

interface Meal {
  slot: string;
  items: MealItem[];
}

export function computeMealMacros(
  meals: Meal[],
  customFoods: CustomFoodMacro[]
): { protein: number; carbs: number; fat: number; calories: number } {
  const customMap = new Map(
    customFoods.map((f) => [`custom_${f.id}`, {
      calories: f.calories_per_100g,
      protein: f.protein_per_100g,
      carbs: f.carbs_per_100g,
      fat: f.fat_per_100g,
    }])
  );

  let protein = 0;
  let carbs = 0;
  let fat = 0;
  let calories = 0;

  for (const meal of meals) {
    for (const item of meal.items) {
      const macros = (FOOD_MACRO_DATA as Record<string, MacrosPer100g>)[item.key] ?? customMap.get(item.key);
      if (!macros) continue;
      const ratio = item.grams / 100;
      protein += macros.protein * ratio;
      carbs += macros.carbs * ratio;
      fat += macros.fat * ratio;
      calories += macros.calories * ratio;
    }
  }

  return {
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    calories: Math.round(calories),
  };
}
