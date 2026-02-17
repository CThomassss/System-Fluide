"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { QuizAction } from "@/types/quiz";
import { NumberInput } from "@/components/ui/NumberInput";

interface StepPersonalInfoProps {
  age: number | null;
  height: number | null;
  weight: number | null;
  dispatch: React.Dispatch<QuizAction>;
}

export function StepPersonalInfo({
  age,
  height,
  weight,
  dispatch,
}: StepPersonalInfoProps) {
  const t = useTranslations("quiz");
  const [localAge, setLocalAge] = useState(age ?? 0);
  const [localHeight, setLocalHeight] = useState(height ?? 0);
  const [localWeight, setLocalWeight] = useState(weight ?? 0);

  useEffect(() => {
    if (localAge > 0 && localHeight > 0 && localWeight > 0) {
      dispatch({
        type: "SET_PERSONAL_INFO",
        payload: { age: localAge, height: localHeight, weight: localWeight },
      });
    }
  }, [localAge, localHeight, localWeight, dispatch]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-bold">{t("step_info_title")}</h2>
        <p className="mt-1 text-sm text-foreground/60">{t("step_info_desc")}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <NumberInput
          id="age"
          label={t("age")}
          unit={t("age_unit")}
          value={localAge || null}
          onChange={setLocalAge}
          min={14}
          max={100}
        />
        <NumberInput
          id="height"
          label={t("height")}
          unit={t("height_unit")}
          value={localHeight || null}
          onChange={setLocalHeight}
          min={100}
          max={250}
        />
        <NumberInput
          id="weight"
          label={t("weight")}
          unit={t("weight_unit")}
          value={localWeight || null}
          onChange={setLocalWeight}
          min={30}
          max={300}
        />
      </div>
    </div>
  );
}
