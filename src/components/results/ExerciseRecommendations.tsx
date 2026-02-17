"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Dumbbell, Footprints } from "lucide-react";
import type { Goal, TrainingData } from "@/types/quiz";

interface ExerciseRecommendationsProps {
  training: TrainingData;
  goal: Goal;
}

export function ExerciseRecommendations({ training, goal }: ExerciseRecommendationsProps) {
  const t = useTranslations("results");

  const sessionsPerWeek = training.days.length;
  const allMuscles = [...new Set(training.days.flatMap((d) => d.muscles))];
  const weeklyVolume = training.exercisesPerSession * sessionsPerWeek;
  const setsPerMuscle = allMuscles.length > 0
    ? Math.round(weeklyVolume / allMuscles.length)
    : 0;

  const getVolumeStatus = () => {
    if (setsPerMuscle < 10) return "low";
    if (setsPerMuscle > 20) return "high";
    return "optimal";
  };

  const volumeStatus = getVolumeStatus();

  return (
    <div className="rounded-2xl border border-surface-light bg-surface p-6">
      <h3 className="font-display text-xl font-bold">{t("exercises_title")}</h3>

      <div className="mt-4 space-y-3">
        <motion.div
          className="rounded-xl bg-background/50 p-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3">
            <Dumbbell size={18} className="text-green shrink-0" />
            <div className="text-sm">
              <span className="font-semibold">
                {t("volume_weekly", { sets: weeklyVolume })}
              </span>
              <span className="text-foreground/60 ml-1">
                ({t("volume_per_muscle", { sets: setsPerMuscle })})
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={`rounded-xl p-3 ${
            volumeStatus === "optimal"
              ? "bg-green/10"
              : volumeStatus === "low"
                ? "bg-accent/10"
                : "bg-red-500/10"
          }`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08 }}
        >
          <span className="text-sm">{t(`volume_${volumeStatus}`)}</span>
        </motion.div>

        {allMuscles.map((mg, i) => (
          <motion.div
            key={mg}
            className="flex items-center gap-3 rounded-xl bg-background/50 p-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (i + 2) * 0.05 }}
          >
            <Dumbbell size={16} className="text-green shrink-0" />
            <span className="text-sm">{t(`muscle_${mg}`)}</span>
          </motion.div>
        ))}

        <motion.div
          className="flex items-center gap-3 rounded-xl bg-background/50 p-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: (allMuscles.length + 2) * 0.05 }}
        >
          <Footprints size={18} className="text-green shrink-0" />
          <span className="text-sm">{t("neat_steps_target")}</span>
        </motion.div>

        {goal !== "recomp" && (
          <motion.div
            className="flex items-center gap-3 rounded-xl bg-background/50 p-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (allMuscles.length + 3) * 0.05 }}
          >
            <Dumbbell size={16} className="text-green shrink-0" />
            <span className="text-sm">{t(`exercise_tip_${goal}`)}</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
