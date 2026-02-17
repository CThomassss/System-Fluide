import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DailyEntryForm } from "@/components/tracking/DailyEntryForm";
import { WeeklySummary } from "@/components/tracking/WeeklySummary";
import { Recommendation } from "@/components/tracking/Recommendation";

export default async function SuiviPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("goal, target_calories, tdee, bmr")
    .eq("id", user.id)
    .single();

  const { data: entries } = await supabase
    .from("daily_entries")
    .select("date, weight, steps, calories")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(30);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-xl px-4 py-8">
        <DailyEntryForm />
        <div className="mt-6 space-y-6">
          <WeeklySummary entries={entries ?? []} />
          <Recommendation
            goal={profile?.goal ?? null}
            targetCalories={profile?.target_calories ?? null}
            entries={entries ?? []}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
