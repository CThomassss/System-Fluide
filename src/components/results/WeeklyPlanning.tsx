"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import type { TrainingData } from "@/types/quiz";
import { generateWeeklySplit } from "@/lib/calculations";

const dayKeys = ["day_mon", "day_tue", "day_wed", "day_thu", "day_fri", "day_sat", "day_sun"] as const;

interface WeeklyPlanningProps {
  training: TrainingData;
}

export function WeeklyPlanning({ training }: WeeklyPlanningProps) {
  const t = useTranslations("results");
  const split = generateWeeklySplit(training.days);

  return (
    <div className="rounded-2xl border border-surface-light bg-surface p-6">
      <h3 className="font-condensed text-xl font-bold">{t("weekly_title")}</h3>
      <div className="mt-4 grid grid-cols-7 gap-2">
        {split.map(({ day, muscles, isRest }, i) => (
          <motion.div
            key={day}
            className={`flex flex-col items-center gap-1 rounded-xl p-2 text-center ${
              isRest ? "bg-background/30" : "bg-background/50"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <span className="text-[10px] font-condensed font-semibold text-foreground/50 uppercase">
              {t(dayKeys[day])}
            </span>
            {isRest ? (
              <span className="text-xs font-semibold text-foreground/30">
                {t("split_rest")}
              </span>
            ) : (
              <div className="flex flex-col items-center gap-0.5">
                {muscles.map((mg) => (
                  <span key={mg} className="text-[10px] font-semibold text-orange leading-tight">
                    {t(`muscle_${mg}`)}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
