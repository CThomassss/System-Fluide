"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { MUSCLE_GROUPS } from "@/lib/constants";
import { serializeTrainingToDB } from "@/lib/parseTraining";
import { Dumbbell, Save } from "lucide-react";
import type { MuscleGroup, TrainingData, DayPlan } from "@/types/quiz";

const DAY_KEYS = ["day_mon", "day_tue", "day_wed", "day_thu", "day_fri", "day_sat", "day_sun"] as const;

interface TrainingEditorProps {
  userId: string;
  initialTraining: TrainingData | null;
}

export function TrainingEditor({ userId, initialTraining }: TrainingEditorProps) {
  const t = useTranslations("admin");
  const tr = useTranslations("results");

  const [exercisesPerSession, setExercisesPerSession] = useState(
    initialTraining?.exercisesPerSession ?? 8
  );
  const [activeDays, setActiveDays] = useState<Set<number>>(() => {
    if (!initialTraining) return new Set<number>();
    return new Set(initialTraining.days.map((d) => d.dayIndex));
  });
  const [dayMuscles, setDayMuscles] = useState<Record<number, MuscleGroup[]>>(() => {
    if (!initialTraining) return {};
    const map: Record<number, MuscleGroup[]> = {};
    for (const d of initialTraining.days) {
      map[d.dayIndex] = [...d.muscles];
    }
    return map;
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleDay = (dayIndex: number) => {
    const next = new Set(activeDays);
    if (next.has(dayIndex)) {
      next.delete(dayIndex);
      const nm = { ...dayMuscles };
      delete nm[dayIndex];
      setDayMuscles(nm);
    } else {
      next.add(dayIndex);
      setDayMuscles({ ...dayMuscles, [dayIndex]: [] });
    }
    setActiveDays(next);
  };

  const toggleMuscle = (dayIndex: number, muscle: MuscleGroup) => {
    const current = dayMuscles[dayIndex] ?? [];
    const next = current.includes(muscle)
      ? current.filter((m) => m !== muscle)
      : [...current, muscle];
    setDayMuscles({ ...dayMuscles, [dayIndex]: next });
  };

  const handleSave = async () => {
    const days: DayPlan[] = Array.from(activeDays)
      .sort()
      .filter((d) => (dayMuscles[d] ?? []).length > 0)
      .map((d) => ({ dayIndex: d, muscles: dayMuscles[d] }));

    if (days.length === 0) return;

    const training: TrainingData = { days, exercisesPerSession };
    const serialized = serializeTrainingToDB(training);

    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ training_data: serialized })
      .eq("id", userId);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  };

  return (
    <div className="rounded-2xl border border-surface-light bg-background/50 p-6">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Dumbbell size={18} className="text-foreground" />
          <h4 className="font-display font-semibold">{t("training_editor")}</h4>
        </div>
        <Button onClick={handleSave} disabled={saving} className="px-3 py-2 text-xs">
          <Save size={14} />
          {saved ? t("training_saved") : saving ? t("saving") : t("save_training")}
        </Button>
      </div>

      {/* Exercises per session */}
      <div className="mb-4">
        <label className="text-sm text-foreground/60">{t("exercises_per_session")}</label>
        <input
          type="number"
          value={exercisesPerSession}
          onChange={(e) => setExercisesPerSession(Number(e.target.value))}
          min={1}
          max={20}
          className="ml-3 w-20 rounded-lg border border-surface-light bg-background px-2 py-1 text-sm text-center outline-none focus:border-accent"
        />
      </div>

      {/* Day grid */}
      <div className="mb-2">
        <p className="text-sm text-foreground/60 mb-2">{t("training_days")}</p>
        <p className="text-xs text-foreground/40 mb-3">{t("click_day_hint")}</p>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {DAY_KEYS.map((key, i) => (
            <button
              key={key}
              onClick={() => toggleDay(i)}
              className={`rounded-xl px-2 py-2 text-xs font-display font-semibold text-center transition-colors cursor-pointer ${
                activeDays.has(i)
                  ? "bg-accent/20 text-accent border border-accent/30"
                  : "bg-background/50 text-foreground/40 border border-surface-light hover:border-foreground/20"
              }`}
            >
              {tr(key)}
            </button>
          ))}
        </div>
      </div>

      {/* Muscle chips per active day */}
      {Array.from(activeDays)
        .sort()
        .map((dayIndex) => (
          <div key={dayIndex} className="mt-4">
            <p className="text-sm font-semibold text-foreground/70 mb-2">
              {tr(DAY_KEYS[dayIndex])}
            </p>
            <div className="flex flex-wrap gap-2">
              {MUSCLE_GROUPS.map((muscle) => {
                const selected = (dayMuscles[dayIndex] ?? []).includes(muscle);
                return (
                  <button
                    key={muscle}
                    onClick={() => toggleMuscle(dayIndex, muscle)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                      selected
                        ? "bg-accent/20 text-accent border border-accent/30"
                        : "bg-background/50 text-foreground/50 border border-surface-light hover:border-foreground/20"
                    }`}
                  >
                    {tr(`muscle_${muscle}`)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
}
