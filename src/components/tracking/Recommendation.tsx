"use client";

import { useTranslations } from "next-intl";
import { TrendingDown, TrendingUp, Target } from "lucide-react";

interface Entry {
  date: string;
  weight: number | null;
  steps: number | null;
  calories: number | null;
}

interface RecommendationProps {
  goal: string | null;
  targetCalories?: number | null;
  entries: Entry[];
}

export function Recommendation({ goal, entries }: RecommendationProps) {
  const t = useTranslations("tracking");

  const last7 = entries.slice(0, 7);
  const prev7 = entries.slice(7, 14);

  if (last7.length < 3) {
    return (
      <div className="rounded-2xl border border-surface-light bg-surface p-6">
        <h3 className="font-condensed text-xl font-bold">{t("reco_title")}</h3>
        <p className="mt-2 text-sm text-foreground/50">{t("reco_need_data")}</p>
      </div>
    );
  }

  const avgWeight = (entries: Entry[]) => {
    const valid = entries.map((e) => e.weight).filter((v): v is number => v !== null);
    if (valid.length === 0) return null;
    return valid.reduce((a, b) => a + b, 0) / valid.length;
  };

  const avgSteps = (entries: Entry[]) => {
    const valid = entries.map((e) => e.steps).filter((v): v is number => v !== null);
    if (valid.length === 0) return null;
    return valid.reduce((a, b) => a + b, 0) / valid.length;
  };

  const currentWeight = avgWeight(last7);
  const previousWeight = avgWeight(prev7);
  const currentSteps = avgSteps(last7);

  const tips: { icon: React.ReactNode; text: string }[] = [];

  if (goal === "cut" && currentWeight !== null && previousWeight !== null) {
    const change = currentWeight - previousWeight;
    if (change > -0.2) {
      tips.push({
        icon: <TrendingDown size={16} className="text-orange" />,
        text: t("reco_cut_reduce"),
      });
    } else {
      tips.push({
        icon: <Target size={16} className="text-green" />,
        text: t("reco_cut_good"),
      });
    }
  }

  if (goal === "bulk" && currentWeight !== null && previousWeight !== null) {
    const change = currentWeight - previousWeight;
    if (change < 0.1) {
      tips.push({
        icon: <TrendingUp size={16} className="text-orange" />,
        text: t("reco_bulk_increase"),
      });
    } else {
      tips.push({
        icon: <Target size={16} className="text-green" />,
        text: t("reco_bulk_good"),
      });
    }
  }

  if (currentSteps !== null && currentSteps < 10000) {
    tips.push({
      icon: <TrendingUp size={16} className="text-orange" />,
      text: t("reco_steps_low", { steps: Math.round(currentSteps) }),
    });
  } else if (currentSteps !== null) {
    tips.push({
      icon: <Target size={16} className="text-green" />,
      text: t("reco_steps_good", { steps: Math.round(currentSteps) }),
    });
  }

  return (
    <div className="rounded-2xl border border-surface-light bg-surface p-6">
      <h3 className="font-condensed text-xl font-bold">{t("reco_title")}</h3>
      <div className="mt-4 space-y-2">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl bg-background/50 p-3">
            {tip.icon}
            <span className="text-sm">{tip.text}</span>
          </div>
        ))}
        {tips.length === 0 && (
          <p className="text-sm text-foreground/50">{t("reco_keep_tracking")}</p>
        )}
      </div>
    </div>
  );
}
