"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { computeCalorieAdjustment } from "@/lib/autoAdjust";
import { getCurrentWeekBounds, getPreviousWeekBounds } from "@/lib/weekUtils";
import { TrendingDown, TrendingUp, Target, Zap } from "lucide-react";

interface Entry {
  date: string;
  weight: number | null;
  steps: number | null;
  calories: number | null;
}

interface RecommendationProps {
  goal: string | null;
  targetCalories?: number | null;
  bmr?: number | null;
  entries: Entry[];
}

export function Recommendation({ goal, targetCalories, bmr, entries }: RecommendationProps) {
  const t = useTranslations("tracking");
  const router = useRouter();
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const { mondayStr, sundayStr } = getCurrentWeekBounds();
  const { mondayStr: prevMondayStr, sundayStr: prevSundayStr } = getPreviousWeekBounds();
  const last7 = entries.filter((e) => e.date >= mondayStr && e.date <= sundayStr);
  const prev7 = entries.filter((e) => e.date >= prevMondayStr && e.date <= prevSundayStr);

  if (last7.length < 3) {
    return (
      <div className="rounded-2xl border border-surface-light bg-surface p-6">
        <h3 className="font-display text-xl font-bold">{t("reco_title")}</h3>
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
        icon: <TrendingDown size={16} className="text-foreground" />,
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
        icon: <TrendingUp size={16} className="text-foreground" />,
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
      icon: <TrendingUp size={16} className="text-foreground" />,
      text: t("reco_steps_low", { steps: Math.round(currentSteps) }),
    });
  } else if (currentSteps !== null) {
    tips.push({
      icon: <Target size={16} className="text-green" />,
      text: t("reco_steps_good", { steps: Math.round(currentSteps) }),
    });
  }

  // Auto-adjustment suggestion
  const adjustment =
    goal && targetCalories && bmr
      ? computeCalorieAdjustment(goal, targetCalories, bmr, entries)
      : null;

  const handleApplyAdjustment = async () => {
    if (!adjustment) return;
    setApplying(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ target_calories: adjustment.newTargetCalories })
        .eq("id", user.id);
      setApplied(true);
      setTimeout(() => router.refresh(), 500);
    }
    setApplying(false);
  };

  return (
    <div className="rounded-2xl border border-surface-light bg-surface p-6">
      <h3 className="font-display text-xl font-bold">{t("reco_title")}</h3>
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

      {/* Auto-adjustment suggestion */}
      {adjustment && !applied && (
        <div className="mt-4 rounded-xl border border-accent/30 bg-accent/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} className="text-accent" />
            <h4 className="font-display font-semibold text-sm">{t("adjust_title")}</h4>
          </div>
          <p className="text-sm text-foreground/70">
            {t(`${adjustment.reason}` as Parameters<typeof t>[0], { calories: adjustment.newTargetCalories })}
          </p>
          <div className="mt-3">
            <Button onClick={handleApplyAdjustment} disabled={applying} className="px-3 py-1.5 text-xs">
              {t("adjust_apply")}
            </Button>
          </div>
        </div>
      )}
      {applied && (
        <div className="mt-4 rounded-xl bg-green/10 p-3 text-center">
          <p className="text-sm font-semibold text-green">{t("adjust_applied")}</p>
        </div>
      )}
    </div>
  );
}
