import type { Sex, Goal, ActivityLevel, CalculationResult, DayPlan } from "@/types/quiz";
import {
  ACTIVITY_MULTIPLIERS,
  GOAL_ADJUSTMENTS,
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

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel, dailySteps?: number): number {
  if (activityLevel === "very_active" && dailySteps && dailySteps > 12500) {
    // More precise multiplier based on actual step count
    // Base: 1.9 at 12,500 steps, +0.04 per 1,000 additional steps, capped at 2.5
    const multiplier = Math.min(2.5, 1.9 + (dailySteps - 12500) / 25000);
    return Math.round(bmr * multiplier);
  }
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

export function calculateTargetCalories(tdee: number, goal: Goal): number {
  return tdee + GOAL_ADJUSTMENTS[goal];
}

export function calculatePillars(tdee: number, bmr: number) {
  // Use real BMR; TEF ≈ 10% of intake; split remainder into NEAT/EAT (2:1)
  const tef = Math.round(tdee * 0.10);
  const remaining = tdee - bmr - tef;
  const neat = Math.round(remaining * 0.67);
  const eat = remaining - neat; // remainder to avoid rounding issues
  return { bmr, neat, eat, tef };
}

export function calculateMacros(
  targetCalories: number,
  _weight: number,
  _goal: Goal
) {
  // Fixed macro split: 25% protein, 50% carbs, 25% fat
  const proteinCalories = targetCalories * 0.25;
  const carbCalories = targetCalories * 0.50;
  const fatCalories = targetCalories * 0.25;

  return {
    macros: {
      protein: 25,
      fat: 25,
      carbs: 50,
    },
    macroGrams: {
      protein: Math.round(proteinCalories / CALORIES_PER_GRAM.protein),
      fat: Math.round(fatCalories / CALORIES_PER_GRAM.fat),
      carbs: Math.round(carbCalories / CALORIES_PER_GRAM.carbs),
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
  activityLevel: ActivityLevel,
  dailySteps?: number
): CalculationResult {
  const bmr = calculateBMR(sex, weight, height, age);
  const tdee = calculateTDEE(bmr, activityLevel, dailySteps);
  const targetCalories = calculateTargetCalories(tdee, goal);
  const pillars = calculatePillars(tdee, bmr);
  const { macros, macroGrams } = calculateMacros(targetCalories, weight, goal);

  return { bmr, tdee, targetCalories, pillars, macros, macroGrams };
}
