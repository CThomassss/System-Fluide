import type { Sex, Goal, ActivityLevel, CalculationResult, DayPlan } from "@/types/quiz";
import {
  GOAL_ADJUSTMENTS,
  CALORIES_PER_GRAM,
  BASE_MEALS,
  DEFAULT_DAILY_STEPS,
  STEP_LENGTH_KM,
  KCAL_PER_KM_PER_KG,
  KCAL_PER_SESSION,
} from "./constants";

/**
 * Harris-Benedict BMR formula (revised, Roza & Shizgal 1984)
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

/**
 * NEAT from daily steps only (no exercise).
 * 1 km walking ≈ 0.5 kcal × body weight (kg)
 */
export function calculateNEAT(dailySteps: number, weight: number): number {
  const km = dailySteps * STEP_LENGTH_KM;
  return Math.round(km * KCAL_PER_KM_PER_KG * weight);
}

/**
 * EAT from training sessions (~400 kcal per intense session).
 * Returns daily average.
 */
export function calculateEAT(sessionsPerWeek: number): number {
  return Math.round((KCAL_PER_SESSION * sessionsPerWeek) / 7);
}

/**
 * TDEE built from components: BMR + NEAT + EAT + TEF.
 * TEF = 10% of TDEE → TDEE = (BMR + NEAT + EAT) / 0.9
 */
export function calculateTDEE(
  bmr: number,
  activityLevel: ActivityLevel,
  weight: number,
  sessionsPerWeek: number,
  dailySteps?: number
): number {
  const steps = dailySteps ?? DEFAULT_DAILY_STEPS[activityLevel];
  const neat = calculateNEAT(steps, weight);
  const eat = calculateEAT(sessionsPerWeek);
  return Math.round((bmr + neat + eat) / 0.9);
}

export function calculateTargetCalories(tdee: number, goal: Goal): number {
  return tdee + GOAL_ADJUSTMENTS[goal];
}

/**
 * Decompose TDEE into its 4 pillars using real component values.
 */
export function calculatePillars(
  bmr: number,
  activityLevel: ActivityLevel,
  weight: number,
  sessionsPerWeek: number,
  dailySteps?: number
) {
  const steps = dailySteps ?? DEFAULT_DAILY_STEPS[activityLevel];
  const neat = calculateNEAT(steps, weight);
  const eat = calculateEAT(sessionsPerWeek);
  const tdee = Math.round((bmr + neat + eat) / 0.9);
  const tef = tdee - bmr - neat - eat; // remainder = ~10% of TDEE
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
  dailySteps?: number,
  sessionsPerWeek?: number
): CalculationResult {
  const sessions = sessionsPerWeek ?? 0;
  const bmr = calculateBMR(sex, weight, height, age);
  const tdee = calculateTDEE(bmr, activityLevel, weight, sessions, dailySteps);
  const targetCalories = calculateTargetCalories(tdee, goal);
  const pillars = calculatePillars(bmr, activityLevel, weight, sessions, dailySteps);
  const { macros, macroGrams } = calculateMacros(targetCalories, weight, goal);

  return { bmr, tdee, targetCalories, pillars, macros, macroGrams };
}
