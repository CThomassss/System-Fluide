"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

interface TriangleDiagramProps {
  pillars: { bmr: number; neat: number; eat: number; tef: number };
  tdee: number;
}

const pillarConfig = [
  { key: "bmr" as const, color: "#f97316" },
  { key: "neat" as const, color: "#22c55e" },
  { key: "eat" as const, color: "#fb923c" },
  { key: "tef" as const, color: "#4ade80" },
];

export function TriangleDiagram({ pillars, tdee }: TriangleDiagramProps) {
  const t = useTranslations("results");

  return (
    <div className="rounded-2xl border border-surface-light bg-surface p-6">
      <h3 className="font-condensed text-xl font-bold">{t("pillars_title")}</h3>
      <div className="mt-6 space-y-3">
        {pillarConfig.map(({ key, color }, i) => {
          const pct = Math.round((pillars[key] / tdee) * 100);
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-condensed font-semibold">
                  {t(`pillar_${key}`)}
                </span>
                <span className="text-foreground/60">
                  {pillars[key]} kcal · {pct}%
                </span>
              </div>
              <div className="mt-1.5 h-4 w-full rounded-full bg-background overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
