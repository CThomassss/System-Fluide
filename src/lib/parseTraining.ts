import type { MuscleGroup, TrainingData, DayPlan } from "@/types/quiz";
import { MUSCLE_GROUPS } from "./constants";

/**
 * Parse training data from URL-encoded string format:
 *   d = "0:chest.back|2:quads.hamstrings|4:shoulders.biceps"
 *   ex = "8"
 * OR from DB-stored JSON: { d: "0:chest.back|...", ex: "8" }
 */
export function parseTraining(
  dParam: string | null,
  exParam: string | null
): TrainingData | null {
  if (!dParam || !exParam) return null;
  const days: DayPlan[] = dParam.split("|").map((dayStr) => {
    const [indexStr, musclesStr] = dayStr.split(":");
    const dayIndex = Number(indexStr);
    const muscles = (musclesStr ?? "").split(".").filter((m): m is MuscleGroup =>
      (MUSCLE_GROUPS as readonly string[]).includes(m)
    );
    return { dayIndex: isNaN(dayIndex) ? 0 : dayIndex, muscles };
  });
  const exercises = Number(exParam);
  if (days.length === 0 || days.some((d) => d.muscles.length === 0) || isNaN(exercises) || exercises <= 0) {
    return null;
  }
  return { days, exercisesPerSession: exercises };
}

/**
 * Parse training from a DB-stored JSON string (training_data column).
 * Format: '{"d":"0:chest.back|2:quads","ex":"8"}'
 */
export function parseTrainingFromDB(trainingDataJson: string | null): TrainingData | null {
  if (!trainingDataJson) return null;
  try {
    const parsed = JSON.parse(trainingDataJson);
    return parseTraining(parsed.d ?? null, parsed.ex ?? null);
  } catch {
    return null;
  }
}

/**
 * Serialize TrainingData back to the DB JSON format.
 * Inverse of parseTrainingFromDB.
 */
export function serializeTrainingToDB(training: TrainingData): string {
  const d = training.days
    .map((day) => `${day.dayIndex}:${day.muscles.join(".")}`)
    .join("|");
  return JSON.stringify({ d, ex: String(training.exercisesPerSession) });
}
