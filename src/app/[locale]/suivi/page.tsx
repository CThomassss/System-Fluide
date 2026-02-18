import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DailyEntryForm } from "@/components/tracking/DailyEntryForm";
import { WeeklySummary } from "@/components/tracking/WeeklySummary";
import { Recommendation } from "@/components/tracking/Recommendation";
import { EntryCalendar } from "@/components/tracking/EntryCalendar";

export default async function SuiviPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("goal, target_calories")
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
      <main className="mx-auto max-w-6xl px-6 pt-24 pb-12">
        <h1 className="font-display text-3xl font-bold mb-6">Suivi quotidien</h1>
        <div className="grid gap-6 lg:grid-cols-2">
          <DailyEntryForm />
          <EntryCalendar entries={entries ?? []} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
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
