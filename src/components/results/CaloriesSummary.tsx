"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import type { Goal } from "@/types/quiz";

interface CaloriesSummaryProps {
  bmr: number;
  tdee: number;
  target: number;
  goal: Goal;
}

export function CaloriesSummary({ bmr, tdee, target, goal }: CaloriesSummaryProps) {
  const t = useTranslations("results");

  const rows = [
    { label: t("bmr_label"), value: bmr, color: "text-foreground" },
    { label: t("tdee_label"), value: tdee, color: "text-foreground" },
    { label: t("target_label"), value: target, color: "text-green" },
  ];

  const targetNote = goal === "cut" ? t("target_note_cut") : goal === "bulk" ? t("target_note_bulk") : t("target_note_recomp");

  return (
    <div className="rounded-2xl border border-surface-light bg-surface p-6">
      <h3 className="font-display text-xl font-bold">{t("calories_title")}</h3>
      <div className="mt-4 space-y-4">
        {rows.map(({ label, value, color }, i) => (
          <motion.div
            key={label}
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <span className="text-sm text-foreground/60">{label}</span>
            <span className={`font-display text-2xl font-bold ${color}`}>
              {value.toLocaleString()} <span className="text-sm font-normal text-foreground/40">{t("kcal")}</span>
            </span>
          </motion.div>
        ))}
      </div>
      <p className="mt-4 text-sm text-accent-muted leading-relaxed">{targetNote}</p>
    </div>
  );
}
