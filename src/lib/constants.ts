import type { ActivityLevel, Goal, MuscleGroup } from "@/types/quiz";

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// Default daily steps per activity level (midpoint of each range)
export const DEFAULT_DAILY_STEPS: Record<ActivityLevel, number> = {
  sedentary: 3500,     // < 5,000
  light: 6250,         // 5,000 - 7,500
  moderate: 8750,      // 7,500 - 10,000
  active: 11250,       // 10,000 - 12,500
  very_active: 15000,  // > 12,500
};

// 1 step ≈ 0.75m = 0.00075 km
export const STEP_LENGTH_KM = 0.00075;

// Walking burns ~0.5 kcal per km per kg body weight
export const KCAL_PER_KM_PER_KG = 0.5;

// Intense weight training session burns ~400 kcal
export const KCAL_PER_SESSION = 400;

export const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  bulk: 100,
  cut: -100,
  recomp: 0,
};

export const PILLAR_PERCENTAGES = {
  bmr: { min: 60, max: 70, default: 65 },
  neat: { min: 15, max: 30, default: 20 },
  eat: { min: 5, max: 20, default: 10 },
  tef: { min: 8, max: 12, default: 10 },
} as const;

// Macro ratios per kg bodyweight
export const MACRO_RATIOS = {
  protein: { bulk: 2.2, cut: 2.2, recomp: 2.0 }, // g/kg
  fat: { bulk: 0.9, cut: 0.8, recomp: 0.85 }, // g/kg
} as const;

// Calories per gram
export const CALORIES_PER_GRAM = {
  protein: 4,
  fat: 9,
  carbs: 4,
} as const;

export const MUSCLE_GROUPS: MuscleGroup[] = [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "quads",
  "hamstrings",
  "glutes",
  "calves",
  "abs",
];

// Base meals calibrated for 2000 kcal/day — portions scale linearly
export interface BaseMealItem {
  key: string;
  grams: number;
}

export interface BaseMeal {
  slot: string;
  items: BaseMealItem[];
}

export const BASE_MEALS: BaseMeal[] = [
  {
    slot: "breakfast",
    items: [
      { key: "oats", grams: 80 },
      { key: "whole_eggs", grams: 100 },
      { key: "banana", grams: 120 },
    ],
  },
  {
    slot: "lunch",
    items: [
      { key: "chicken_breast", grams: 150 },
      { key: "rice", grams: 180 },
      { key: "vegetables", grams: 150 },
    ],
  },
  {
    slot: "preworkout",
    items: [
      { key: "cream_of_rice", grams: 80 },
      { key: "whey_shake", grams: 30 },
      { key: "milk", grams: 200 },
      { key: "raspberries", grams: 50 },
    ],
  },
  {
    slot: "dinner",
    items: [
      { key: "red_meat", grams: 150 },
      { key: "sweet_potato", grams: 200 },
      { key: "green_salad", grams: 100 },
    ],
  },
];
