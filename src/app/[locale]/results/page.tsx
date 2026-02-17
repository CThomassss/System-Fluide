"use client";

import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ResultsDashboard } from "@/components/results/ResultsDashboard";
import { computeAll } from "@/lib/calculations";
import type { Sex, Goal, ActivityLevel, MuscleGroup, TrainingData, DayPlan } from "@/types/quiz";
import { MUSCLE_GROUPS } from "@/lib/constants";
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

function parseTraining(
  dParam: string | null,
  ssParam: string | null
): TrainingData | null {
  if (!dParam || !ssParam) return null;
  const days: DayPlan[] = dParam.split("|").map((dayStr) => {
    // Format: "dayIndex:muscle1.muscle2" e.g. "0:chest.back"
    const [indexStr, musclesStr] = dayStr.split(":");
    const dayIndex = Number(indexStr);
    const muscles = (musclesStr ?? "").split(".").filter((m): m is MuscleGroup =>
      (MUSCLE_GROUPS as readonly string[]).includes(m)
    );
    return { dayIndex: isNaN(dayIndex) ? 0 : dayIndex, muscles };
  });
  const sets = Number(ssParam);
  if (days.length === 0 || days.some((d) => d.muscles.length === 0) || isNaN(sets) || sets <= 0) {
    return null;
  }
  return { days, setsPerSession: sets };
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const t = useTranslations("results");

  const s = searchParams.get("s");
  const g = searchParams.get("g");
  const a = searchParams.get("a");
  const h = searchParams.get("h");
  const w = searchParams.get("w");
  const al = searchParams.get("al");

  const training = parseTraining(
    searchParams.get("d"),
    searchParams.get("ss")
  );

  const valid =
    isValidSex(s) &&
    isValidGoal(g) &&
    a && !isNaN(Number(a)) &&
    h && !isNaN(Number(h)) &&
    w && !isNaN(Number(w)) &&
    isValidActivity(al) &&
    training !== null;

  if (!valid) {
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

  const result = computeAll(
    s as Sex,
    g as Goal,
    Number(a),
    Number(h),
    Number(w),
    al as ActivityLevel
  );

  return (
    <>
      <Header />
      <main>
        <ResultsDashboard result={result} goal={g as Goal} training={training!} />
      </main>
      <Footer />
    </>
  );
}
