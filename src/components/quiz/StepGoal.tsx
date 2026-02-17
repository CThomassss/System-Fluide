"use client";

import { useTranslations } from "next-intl";
import type { Goal, QuizAction } from "@/types/quiz";
import { RadioCard } from "@/components/ui/RadioCard";

interface StepGoalProps {
  value: Goal | null;
  dispatch: React.Dispatch<QuizAction>;
}

const goals: Goal[] = ["bulk", "cut", "recomp"];

export function StepGoal({ value, dispatch }: StepGoalProps) {
  const t = useTranslations("quiz");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-condensed text-2xl font-bold">{t("step_goal_title")}</h2>
        <p className="mt-1 text-sm text-foreground/60">{t("step_goal_desc")}</p>
      </div>
      <div className="grid gap-3" role="radiogroup" aria-label={t("step_goal_title")}>
        {goals.map((goal) => (
          <RadioCard
            key={goal}
            name="goal"
            value={goal}
            label={t(`goal_${goal}`)}
            description={t(`goal_${goal}_desc`)}
            selected={value === goal}
            onSelect={() => dispatch({ type: "SET_GOAL", payload: goal })}
          />
        ))}
      </div>
    </div>
  );
}
