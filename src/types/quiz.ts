export type Sex = "male" | "female";

export type Goal = "bulk" | "cut" | "recomp";

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "abs";

export interface DayPlan {
  dayIndex: number; // 0=Monday .. 6=Sunday
  muscles: MuscleGroup[];
}

export interface TrainingData {
  days: DayPlan[];
  exercisesPerSession: number;
}

export interface QuizState {
  step: number;
  sex: Sex | null;
  goal: Goal | null;
  age: number | null;
  height: number | null;
  weight: number | null;
  activityLevel: ActivityLevel | null;
  training: TrainingData | null;
}

export type QuizAction =
  | { type: "SET_SEX"; payload: Sex }
  | { type: "SET_GOAL"; payload: Goal }
  | { type: "SET_PERSONAL_INFO"; payload: { age: number; height: number; weight: number } }
  | { type: "SET_ACTIVITY"; payload: ActivityLevel }
  | { type: "SET_TRAINING"; payload: TrainingData }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "RESET" };

export interface CalculationResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  pillars: {
    bmr: number;
    neat: number;
    eat: number;
    tef: number;
  };
  macros: {
    protein: number;
    fat: number;
    carbs: number;
  };
  macroGrams: {
    protein: number;
    fat: number;
    carbs: number;
  };
}
