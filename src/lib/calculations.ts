import type { Sex, Goal, ActivityLevel, CalculationResult, DayPlan } from "@/types/quiz";
import {
  ACTIVITY_MULTIPLIERS,
  GOAL_ADJUSTMENTS,
  MACRO_RATIOS,
  CALORIES_PER_GRAM,
  BASE_MEALS,
} from "./constants";

/**
 * Harris-Benedict BMR formula
 * Men:   88.362 + 13.397 * weight(kg) + 4.799 * height(cm) - 5.677 * age
 * Women: 447.593 + 9.247 * weight(kg) + 3.098 * height(cm) - 4.330 * age
 */
export function calculateBMR(
  sex: Sex,
  weight: number,
  height: number,
  age: number
): number {
  if (sex === "male") {
    return Math.round(88.362 + 13.397 * weight + 4.799 * height - 5.677 * age);
  }
  return Math.round(447.593 + 9.247 * weight + 3.098 * height - 4.330 * age);
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

export function calculateTargetCalories(tdee: number, goal: Goal): number {
  return tdee + GOAL_ADJUSTMENTS[goal];
}

export function calculatePillars(tdee: number) {
  // Approximate pillar decomposition of TDEE
  const bmr = Math.round(tdee * 0.65);
  const neat = Math.round(tdee * 0.20);
  const eat = Math.round(tdee * 0.10);
  const tef = tdee - bmr - neat - eat; // remainder to avoid rounding issues
  return { bmr, neat, eat, tef };
}

export function calculateMacros(
  targetCalories: number,
  weight: number,
  goal: Goal
) {
  const proteinGrams = Math.round(weight * MACRO_RATIOS.protein[goal]);
  const fatGrams = Math.round(weight * MACRO_RATIOS.fat[goal]);

  const proteinCalories = proteinGrams * CALORIES_PER_GRAM.protein;
  const fatCalories = fatGrams * CALORIES_PER_GRAM.fat;
  const carbCalories = Math.max(0, targetCalories - proteinCalories - fatCalories);
  const carbGrams = Math.round(carbCalories / CALORIES_PER_GRAM.carbs);

  const total = proteinCalories + fatCalories + carbCalories;

  return {
    macros: {
      protein: Math.round((proteinCalories / total) * 100),
      fat: Math.round((fatCalories / total) * 100),
      carbs: 100 - Math.round((proteinCalories / total) * 100) - Math.round((fatCalories / total) * 100),
    },
    macroGrams: {
      protein: proteinGrams,
      fat: fatGrams,
      carbs: carbGrams,
    },
  };
}

/**
 * Scale base meals (calibrated at 2000 kcal) to the target calorie amount.
 * Returns new meal objects with adjusted gram values.
 */
export function scaleMeals(targetCalories: number) {
  const ratio = targetCalories / 2000;
  return BASE_MEALS.map((meal) => ({
    slot: meal.slot,
    items: meal.items.map((item) => ({
      key: item.key,
      grams: Math.round(item.grams * ratio),
    })),
  }));
}

/**
 * Generate a 7-day training split from user-defined day plans.
 * Each DayPlan has a dayIndex (0=Mon..6=Sun) indicating its position.
 */
export function generateWeeklySplit(
  days: DayPlan[]
): { day: number; muscles: DayPlan["muscles"]; isRest: boolean }[] {
  const dayMap = new Map(days.map((d) => [d.dayIndex, d.muscles]));

  return Array.from({ length: 7 }, (_, d) => {
    const muscles = dayMap.get(d);
    return muscles
      ? { day: d, muscles, isRest: false }
      : { day: d, muscles: [] as DayPlan["muscles"], isRest: true };
  });
}

export function computeAll(
  sex: Sex,
  goal: Goal,
  age: number,
  height: number,
  weight: number,
  activityLevel: ActivityLevel
): CalculationResult {
  const bmr = calculateBMR(sex, weight, height, age);
  const tdee = calculateTDEE(bmr, activityLevel);
  const targetCalories = calculateTargetCalories(tdee, goal);
  const pillars = calculatePillars(tdee);
  const { macros, macroGrams } = calculateMacros(targetCalories, weight, goal);

  return { bmr, tdee, targetCalories, pillars, macros, macroGrams };
}
