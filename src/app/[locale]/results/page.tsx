"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ResultsDashboard } from "@/components/results/ResultsDashboard";
import { computeAll } from "@/lib/calculations";
import { parseTraining } from "@/lib/parseTraining";
import { createClient } from "@/lib/supabase/client";
import { savePendingQuiz } from "@/lib/pendingQuiz";
import type { Sex, Goal, ActivityLevel } from "@/types/quiz";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

function isValidSex(s: string | null): s is Sex {
  return s === "male" || s === "female";
}
function isValidGoal(g: string | null): g is Goal {
  return g === "bulk" || g === "cut" || g === "recomp";
}
function isValidActivity(a: string | null): a is ActivityLevel {
  return ["sedentary", "light", "moderate", "active", "very_active"].includes(a ?? "");
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const t = useTranslations("results");
  const [isAuth, setIsAuth] = useState(false);

  const s = searchParams.get("s");
  const g = searchParams.get("g");
  const a = searchParams.get("a");
  const h = searchParams.get("h");
  const w = searchParams.get("w");
  const al = searchParams.get("al");
  const dParam = searchParams.get("d");
  const exParam = searchParams.get("ex");

  const training = parseTraining(dParam, exParam);

  const valid =
    isValidSex(s) &&
    isValidGoal(g) &&
    a && !isNaN(Number(a)) &&
    h && !isNaN(Number(h)) &&
    w && !isNaN(Number(w)) &&
    isValidActivity(al) &&
    training !== null;

  const result = valid
    ? computeAll(s as Sex, g as Goal, Number(a), Number(h), Number(w), al as ActivityLevel)
    : null;

  // Save quiz results: always to localStorage, and to DB if logged in
  useEffect(() => {
    if (!valid || !result) return;

    const trainingData = dParam && exParam
      ? JSON.stringify({ d: dParam, ex: exParam })
      : null;

    // Always save to localStorage (bridge for signup flow)
    savePendingQuiz({
      sex: s as string,
      goal: g as string,
      age: Number(a),
      height: Number(h),
      weight: Number(w),
      activity_level: al as string,
      training_data: trainingData,
      bmr: result.bmr,
      tdee: result.tdee,
      target_calories: result.targetCalories,
    });

    // If logged in, also save directly to DB
    const saveToDb = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setIsAuth(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          sex: s,
          height: Number(h),
          weight: Number(w),
          age: Number(a),
          activity_level: al,
          goal: g,
          bmr: result.bmr,
          tdee: result.tdee,
          target_calories: result.targetCalories,
          training_data: trainingData,
        })
        .eq("id", user.id);

      if (error) {
        console.error("Failed to save quiz results to DB:", error);
      }
    };

    saveToDb();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!valid || !result) {
    return (
      <>
        <Header />
        <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <p className="text-foreground/60">Donnees invalides.</p>
          <div className="mt-4">
            <Link href="/quiz">
              <Button>{t("restart")}</Button>
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <ResultsDashboard
          result={result}
          goal={g as Goal}
          training={training!}
          context={isAuth ? "account" : "results"}
        />
      </main>
      <Footer />
    </>
  );
}
