import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DailyEntryForm } from "@/components/tracking/DailyEntryForm";
import { WeeklySummary } from "@/components/tracking/WeeklySummary";
import { Recommendation } from "@/components/tracking/Recommendation";
import { EntryCalendar } from "@/components/tracking/EntryCalendar";
import { FoodLogForm } from "@/components/tracking/FoodLogForm";

export default async function SuiviPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("goal, target_calories, bmr")
    .eq("id", user.id)
    .single();

  const { data: entries } = await supabase
    .from("daily_entries")
    .select("date, weight, steps, calories")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(30);

  const today = new Date().toISOString().split("T")[0];

  const { data: foodLogs } = await supabase
    .from("food_logs")
    .select("id, food_key, food_label, grams, calories, protein, carbs, fat")
    .eq("user_id", user.id)
    .eq("date", today)
    .order("created_at", { ascending: true });

  const { data: customFoods } = await supabase
    .from("custom_foods")
    .select("id, name, protein_per_100g, carbs_per_100g, fat_per_100g, calories_per_100g");

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-6 pt-24 pb-12">
        <h1 className="font-display text-3xl font-bold mb-6">Suivi quotidien</h1>
        <div className="grid gap-6 lg:grid-cols-2">
          <DailyEntryForm />
          <EntryCalendar entries={entries ?? []} />
        </div>

        <div className="mt-6">
          <FoodLogForm
            date={today}
            initialLogs={foodLogs ?? []}
            customFoods={customFoods ?? []}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <WeeklySummary entries={entries ?? []} />
          <Recommendation
            goal={profile?.goal ?? null}
            targetCalories={profile?.target_calories ?? null}
            bmr={profile?.bmr ?? null}
            entries={entries ?? []}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
