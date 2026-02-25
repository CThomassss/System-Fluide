"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { CaloriesSummary } from "./CaloriesSummary";
import { MacroSplit } from "./MacroSplit";
import { TriangleDiagram } from "./TriangleDiagram";
import { MealSuggestions } from "./MealSuggestions";
import { ExerciseRecommendations } from "./ExerciseRecommendations";
import { WeeklyPlanning } from "./WeeklyPlanning";
import { ProgressProtocol } from "./ProgressProtocol";
import { ReverseDiet } from "./ReverseDiet";
import { TrackingCTA } from "./TrackingCTA";
import { ProjectionChart } from "./ProjectionChart";
import type { CalculationResult, Goal, TrainingData } from "@/types/quiz";
import type { BaseMeal } from "@/lib/constants";
import { Share2, RotateCcw, Check } from "lucide-react";

interface ResultsDashboardProps {
  result: CalculationResult;
  goal: Goal;
  training: TrainingData;
  /** Controls which footer actions appear. Default: "results" */
  context?: "results" | "account" | "tracking";
  customMeals?: BaseMeal[] | null;
  customFoods?: { id: string; protein_per_100g: number; carbs_per_100g: number; fat_per_100g: number; calories_per_100g: number }[];
  weight?: number;
  /** When true, navigation buttons are disabled (DB save in progress) */
  saving?: boolean;
}

export function ResultsDashboard({ result, goal, training, context = "results", customMeals, customFoods, weight, saving }: ResultsDashboardProps) {
  const t = useTranslations("results");
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isEmbedded = context !== "results";

  return (
    <div className={isEmbedded ? "" : "mx-auto max-w-5xl px-6 pt-32 pb-12"}>
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-foreground/60">{t("subtitle")}</p>
      </div>

      {/* Top metrics — 2 col */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <CaloriesSummary
          bmr={result.bmr}
          tdee={result.tdee}
          target={result.targetCalories}
          goal={goal}
        />
        <MacroSplit macros={result.macros} macroGrams={result.macroGrams} />
      </div>

      {/* Triangle diagram — full width */}
      <div className="mt-6">
        <TriangleDiagram pillars={result.pillars} tdee={result.tdee} />
      </div>

      {/* Nutrition + Training — 2 col */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <MealSuggestions targetCalories={result.targetCalories} macroGrams={result.macroGrams} customMeals={customMeals} customFoods={customFoods} />
        <ExerciseRecommendations training={training} goal={goal} />
      </div>

      {/* Weekly planning — full width */}
      <div className="mt-6">
        <WeeklyPlanning training={training} />
      </div>

      {/* Protocol + Reverse — stacked */}
      <div className="mt-6 space-y-6">
        <ProgressProtocol goal={goal} />
        <ReverseDiet goal={goal} tdee={result.tdee} />
      </div>

      {/* Projection chart — account only */}
      {context === "account" && weight && (
        <div className="mt-6">
          <ProjectionChart
            currentWeight={weight}
            targetCalories={result.targetCalories}
            tdee={result.tdee}
            goal={goal}
          />
        </div>
      )}

      {/* Context-dependent footer */}
      {context === "results" && (
        <>
          <div className="mt-6">
            <TrackingCTA />
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button variant="secondary" onClick={handleShare} disabled={saving}>
              {copied ? <Check size={16} /> : <Share2 size={16} />}
              {copied ? t("copied") : t("share")}
            </Button>
            <Link href="/quiz" aria-disabled={saving} className={saving ? "pointer-events-none opacity-50" : ""}>
              <Button variant="ghost" disabled={saving}>
                <RotateCcw size={16} />
                {t("restart")}
              </Button>
            </Link>
          </div>
        </>
      )}
      {context === "account" && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/suivi">
            <Button>
              {t("go_tracking")}
            </Button>
          </Link>
          <Link href="/quiz">
            <Button variant="secondary">
              <RotateCcw size={16} />
              {t("restart")}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
