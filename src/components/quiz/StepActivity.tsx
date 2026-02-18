"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import type { ActivityLevel, QuizAction } from "@/types/quiz";
import { RadioCard } from "@/components/ui/RadioCard";

interface StepActivityProps {
  value: ActivityLevel | null;
  dailySteps: number | null;
  dispatch: React.Dispatch<QuizAction>;
}

const levels: ActivityLevel[] = [
  "sedentary",
  "light",
  "moderate",
  "active",
  "very_active",
];

export function StepActivity({ value, dailySteps, dispatch }: StepActivityProps) {
  const t = useTranslations("quiz");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-bold">
          {t("step_activity_title")}
        </h2>
        <p className="mt-1 text-sm text-foreground/60">
          {t("step_activity_desc")}
        </p>
      </div>
      <div className="grid gap-3" role="radiogroup" aria-label={t("step_activity_title")}>
        {levels.map((level) => (
          <RadioCard
            key={level}
            name="activity"
            value={level}
            label={t(`activity_${level}`)}
            description={t(`activity_${level}_desc`)}
            selected={value === level}
            onSelect={() => dispatch({ type: "SET_ACTIVITY", payload: level })}
          />
        ))}
      </div>

      {value === "very_active" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-2xl border border-surface-light bg-surface p-4"
        >
          <label htmlFor="daily-steps" className="block font-display text-sm font-semibold">
            {t("daily_steps_label")}
          </label>
          <p className="mt-1 text-xs text-foreground/50">{t("daily_steps_desc")}</p>
          <input
            id="daily-steps"
            type="number"
            min={12000}
            max={50000}
            step={500}
            placeholder={t("daily_steps_placeholder")}
            value={dailySteps ?? ""}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v)) dispatch({ type: "SET_DAILY_STEPS", payload: v });
            }}
            className="mt-2 w-full rounded-xl border border-surface-light bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </motion.div>
      )}
    </div>
  );
}
