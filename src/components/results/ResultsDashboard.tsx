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
import type { CalculationResult, Goal, TrainingData } from "@/types/quiz";
import { Share2, RotateCcw, Check } from "lucide-react";

interface ResultsDashboardProps {
  result: CalculationResult;
  goal: Goal;
  training: TrainingData;
}

export function ResultsDashboard({ result, goal, training }: ResultsDashboardProps) {
  const t = useTranslations("results");
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="text-center">
        <h1 className="font-condensed text-3xl font-bold sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-foreground/60">{t("subtitle")}</p>
      </div>

      <div className="mt-10 space-y-6">
        <CaloriesSummary
          bmr={result.bmr}
          tdee={result.tdee}
          target={result.targetCalories}
          goal={goal}
        />
        <MacroSplit macros={result.macros} macroGrams={result.macroGrams} />
        <TriangleDiagram pillars={result.pillars} tdee={result.tdee} />

        <MealSuggestions targetCalories={result.targetCalories} />
        <ExerciseRecommendations training={training} goal={goal} />
        <WeeklyPlanning training={training} />
        <ProgressProtocol goal={goal} />
        <ReverseDiet goal={goal} tdee={result.tdee} />
        <TrackingCTA />
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Button variant="secondary" onClick={handleShare}>
          {copied ? <Check size={16} /> : <Share2 size={16} />}
          {copied ? t("copied") : t("share")}
        </Button>
        <Link href="/quiz">
          <Button variant="ghost">
            <RotateCcw size={16} />
            {t("restart")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
