"use client";

import { useTranslations } from "next-intl";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Goal } from "@/types/quiz";

interface ProjectionChartProps {
  currentWeight: number;
  targetCalories: number;
  tdee: number;
  goal: Goal;
}

export function ProjectionChart({
  currentWeight,
  targetCalories,
  tdee,
  goal,
}: ProjectionChartProps) {
  const t = useTranslations("results");

  // Weight change per week: surplus or deficit × 7 days / 7700 kcal per kg
  const weeklyChange =
    goal === "recomp"
      ? 0
      : goal === "bulk"
        ? ((targetCalories - tdee) * 7) / 7700
        : -((tdee - targetCalories) * 7) / 7700;

  const data = Array.from({ length: 13 }, (_, i) => ({
    week: i,
    weight: parseFloat((currentWeight + weeklyChange * i).toFixed(1)),
  }));

  return (
    <div className="rounded-2xl border border-surface-light bg-surface p-6">
      <h3 className="font-display text-xl font-bold">{t("projection_title")}</h3>
      <p className="mt-1 text-sm text-foreground/50">{t("projection_subtitle")}</p>

      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--surface-light))" />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 12, fill: "hsl(var(--foreground) / 0.5)" }}
              label={{ value: t("projection_weeks"), position: "insideBottom", offset: -2, fontSize: 12, fill: "hsl(var(--foreground) / 0.5)" }}
            />
            <YAxis
              domain={["dataMin - 1", "dataMax + 1"]}
              tick={{ fontSize: 12, fill: "hsl(var(--foreground) / 0.5)" }}
              label={{ value: "kg", angle: -90, position: "insideLeft", fontSize: 12, fill: "hsl(var(--foreground) / 0.5)" }}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--surface))",
                border: "1px solid hsl(var(--surface-light))",
                borderRadius: "0.75rem",
                fontSize: 12,
              }}
              formatter={(value) => [`${value} kg`, t("projection_weight")]}
              labelFormatter={(week) => `${t("projection_week")} ${week}`}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--accent))", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
