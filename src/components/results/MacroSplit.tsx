"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

interface MacroSplitProps {
  macros: { protein: number; fat: number; carbs: number };
  macroGrams: { protein: number; fat: number; carbs: number };
}

const bars = [
  { key: "protein" as const, color: "bg-accent" },
  { key: "carbs" as const, color: "bg-green" },
  { key: "fat" as const, color: "bg-accent-muted" },
];

export function MacroSplit({ macros, macroGrams }: MacroSplitProps) {
  const t = useTranslations("results");

  return (
    <div className="rounded-2xl border border-surface-light bg-surface p-6">
      <h3 className="font-display text-xl font-bold">{t("macros_title")}</h3>
      <div className="mt-6 space-y-5">
        {bars.map(({ key, color }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center justify-between text-sm">
              <span className="font-display font-semibold">{t(key)}</span>
              <span className="text-foreground/60">
                {macroGrams[key]}{t("grams_short")} · {macros[key]}%
              </span>
            </div>
            <div className="mt-1.5 h-3 w-full rounded-full bg-background overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${color}`}
                initial={{ width: 0 }}
                animate={{ width: `${macros[key]}%` }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
