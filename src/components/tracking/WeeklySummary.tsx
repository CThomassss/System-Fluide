"use client";

import { useTranslations } from "next-intl";
import { Scale, Footprints, Flame } from "lucide-react";

interface Entry {
  date: string;
  weight: number | null;
  steps: number | null;
  calories: number | null;
}

interface WeeklySummaryProps {
  entries: Entry[];
}

export function WeeklySummary({ entries }: WeeklySummaryProps) {
  const t = useTranslations("tracking");

  const last7 = entries.slice(0, 7);

  const avg = (values: (number | null)[]) => {
    const valid = values.filter((v): v is number => v !== null);
    if (valid.length === 0) return null;
    return Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10;
  };

  const avgWeight = avg(last7.map((e) => e.weight));
  const avgSteps = avg(last7.map((e) => e.steps));
  const avgCalories = avg(last7.map((e) => e.calories));

  if (last7.length === 0) {
    return (
      <div className="rounded-2xl border border-surface-light bg-surface p-6">
        <h3 className="font-display text-xl font-bold">{t("weekly_title")}</h3>
        <p className="mt-2 text-sm text-foreground/50">{t("no_data")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-surface-light bg-surface p-6">
      <h3 className="font-display text-xl font-bold">{t("weekly_title")}</h3>
      <p className="mt-1 text-sm text-foreground/50">{t("weekly_subtitle", { count: last7.length })}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl bg-background/50 p-3">
          <Scale size={18} className="text-foreground shrink-0" />
          <div>
            <p className="text-xs text-foreground/50">{t("avg_weight")}</p>
            <p className="text-sm font-semibold">{avgWeight !== null ? `${avgWeight} kg` : "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-background/50 p-3">
          <Footprints size={18} className="text-green shrink-0" />
          <div>
            <p className="text-xs text-foreground/50">{t("avg_steps")}</p>
            <p className="text-sm font-semibold">{avgSteps !== null ? Math.round(avgSteps) : "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-background/50 p-3">
          <Flame size={18} className="text-foreground shrink-0" />
          <div>
            <p className="text-xs text-foreground/50">{t("avg_calories")}</p>
            <p className="text-sm font-semibold">{avgCalories !== null ? `${Math.round(avgCalories)} kcal` : "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
