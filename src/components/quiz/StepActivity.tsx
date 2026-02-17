"use client";

import { useTranslations } from "next-intl";
import type { ActivityLevel, QuizAction } from "@/types/quiz";
import { RadioCard } from "@/components/ui/RadioCard";

interface StepActivityProps {
  value: ActivityLevel | null;
  dispatch: React.Dispatch<QuizAction>;
}

const levels: ActivityLevel[] = [
  "sedentary",
  "light",
  "moderate",
  "active",
  "very_active",
];

export function StepActivity({ value, dispatch }: StepActivityProps) {
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
    </div>
  );
}
