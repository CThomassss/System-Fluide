"use client";

import { useTranslations } from "next-intl";
import type { Sex, QuizAction } from "@/types/quiz";
import { RadioCard } from "@/components/ui/RadioCard";

interface StepSexProps {
  value: Sex | null;
  dispatch: React.Dispatch<QuizAction>;
}

export function StepSex({ value, dispatch }: StepSexProps) {
  const t = useTranslations("quiz");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-condensed text-2xl font-bold">{t("step_sex_title")}</h2>
        <p className="mt-1 text-sm text-foreground/60">{t("step_sex_desc")}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label={t("step_sex_title")}>
        {(["male", "female"] as const).map((sex) => (
          <RadioCard
            key={sex}
            name="sex"
            value={sex}
            label={t(`sex_${sex}`)}
            selected={value === sex}
            onSelect={() => dispatch({ type: "SET_SEX", payload: sex })}
          />
        ))}
      </div>
    </div>
  );
}
