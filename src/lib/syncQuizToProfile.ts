import { createClient } from "@/lib/supabase/client";
import { getPendingQuiz, clearPendingQuiz } from "./pendingQuiz";

/**
 * Check if there's pending quiz data in localStorage and save it to the
 * user's profile in the database. Call this on any authenticated page load.
 * Returns true if data was synced.
 */
export async function syncQuizToProfile(): Promise<boolean> {
  const pending = getPendingQuiz();
  if (!pending) return false;

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("profiles")
    .update({
      sex: pending.sex,
      height: pending.height,
      weight: pending.weight,
      age: pending.age,
      activity_level: pending.activity_level,
      goal: pending.goal,
      bmr: pending.bmr,
      tdee: pending.tdee,
      target_calories: pending.target_calories,
      training_data: pending.training_data,
      ...(pending.first_name ? { first_name: pending.first_name } : {}),
      ...(pending.last_name ? { last_name: pending.last_name } : {}),
    })
    .eq("id", user.id);

  if (error) {
    console.error("Failed to sync quiz data:", error);
    return false;
  }

  clearPendingQuiz();
  return true;
}
