"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import type { MuscleGroup, QuizAction, TrainingData, DayPlan } from "@/types/quiz";
import { MUSCLE_GROUPS } from "@/lib/constants";
import { NumberInput } from "@/components/ui/NumberInput";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepTrainingProps {
  value: TrainingData | null;
  dispatch: React.Dispatch<QuizAction>;
}

const DAY_KEYS = ["day_mon", "day_tue", "day_wed", "day_thu", "day_fri", "day_sat", "day_sun"] as const;

const subVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 60 : -60, opacity: 0 }),
};

export function StepTraining({ value, dispatch }: StepTrainingProps) {
  const t = useTranslations("quiz");
  const tResults = useTranslations("results");

  // Sub-step 0: sessions + sets
  // Sub-step 1: pick weekdays
  // Sub-steps 2..N+1: muscles per selected day
  const [subStep, setSubStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [numSessions, setNumSessions] = useState(value?.days.length ?? 0);
  const [sets, setSets] = useState(value?.setsPerSession ?? 0);
  const [selectedDays, setSelectedDays] = useState<number[]>(
    value?.days.map((d) => d.dayIndex) ?? []
  );
  const [dayMuscles, setDayMuscles] = useState<Record<number, MuscleGroup[]>>(
    () => {
      const map: Record<number, MuscleGroup[]> = {};
      value?.days.forEach((d) => { map[d.dayIndex] = d.muscles; });
      return map;
    }
  );

  // Dispatch when all selected days have muscles and sets > 0
  useEffect(() => {
    if (
      selectedDays.length > 0 &&
      selectedDays.length === numSessions &&
      sets > 0 &&
      selectedDays.every((di) => (dayMuscles[di]?.length ?? 0) > 0)
    ) {
      const days: DayPlan[] = selectedDays
        .sort((a, b) => a - b)
        .map((di) => ({ dayIndex: di, muscles: dayMuscles[di] }));
      dispatch({ type: "SET_TRAINING", payload: { days, setsPerSession: sets } });
    }
  }, [selectedDays, dayMuscles, sets, numSessions, dispatch]);

  const toggleWeekday = (di: number) => {
    setSelectedDays((prev) => {
      if (prev.includes(di)) {
        // Deselect — also clear muscles for that day
        setDayMuscles((m) => { const next = { ...m }; delete next[di]; return next; });
        return prev.filter((d) => d !== di);
      }
      if (prev.length >= numSessions) return prev; // max reached
      return [...prev, di].sort((a, b) => a - b);
    });
  };

  const toggleMuscle = (di: number, mg: MuscleGroup) => {
    setDayMuscles((prev) => {
      const current = prev[di] ?? [];
      const has = current.includes(mg);
      return {
        ...prev,
        [di]: has ? current.filter((m) => m !== mg) : [...current, mg],
      };
    });
  };

  const goSub = (next: number) => {
    setDirection(next > subStep ? 1 : -1);
    setSubStep(next);
  };

  // Sorted selected days for consistent ordering
  const sortedDays = [...selectedDays].sort((a, b) => a - b);

  const canGoNext = (() => {
    if (subStep === 0) return numSessions > 0 && sets > 0;
    if (subStep === 1) return selectedDays.length === numSessions;
    // Sub-steps 2+: muscle selection for each day
    const dayIndex = sortedDays[subStep - 2];
    return (dayMuscles[dayIndex]?.length ?? 0) > 0;
  })();

  const totalSubSteps = 2 + selectedDays.length; // config + day picker + N muscle pages

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-condensed text-2xl font-bold">
          {t("step_training_title")}
        </h2>
        <p className="mt-1 text-sm text-foreground/60">
          {subStep === 0
            ? t("step_training_desc")
            : subStep === 1
              ? t("training_pick_days_desc", { count: numSessions })
              : t("training_day_desc")}
        </p>
      </div>

      {/* Sub-step indicator */}
      {numSessions > 0 && (
        <div className="flex items-center justify-center gap-1.5">
          {Array.from({ length: totalSubSteps }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === subStep
                  ? "w-6 bg-orange"
                  : i < subStep
                    ? "w-1.5 bg-orange/40"
                    : "w-1.5 bg-surface-light"
              }`}
            />
          ))}
        </div>
      )}

      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={subStep}
            custom={direction}
            variants={subVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {subStep === 0 ? (
              /* --- Sub-step 0: sessions count + sets --- */
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberInput
                  id="sessions"
                  label={t("training_sessions_title")}
                  unit={t("sessions_unit")}
                  value={numSessions || null}
                  onChange={(v) => {
                    setNumSessions(v);
                    // Reset day selection if count changes
                    setSelectedDays([]);
                    setDayMuscles({});
                  }}
                  min={1}
                  max={7}
                />
                <NumberInput
                  id="sets"
                  label={t("sets_per_session")}
                  unit={t("sets_unit")}
                  value={sets || null}
                  onChange={setSets}
                  min={1}
                  max={40}
                />
              </div>
            ) : subStep === 1 ? (
              /* --- Sub-step 1: pick weekdays --- */
              <div>
                <h3 className="font-condensed text-lg font-semibold mb-3">
                  {t("training_pick_days_title")}
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {DAY_KEYS.map((key, i) => {
                    const isSelected = selectedDays.includes(i);
                    const isFull = selectedDays.length >= numSessions && !isSelected;
                    return (
                      <motion.button
                        key={key}
                        type="button"
                        onClick={() => toggleWeekday(i)}
                        disabled={isFull}
                        className={`rounded-xl border-2 py-3 text-sm font-semibold font-condensed transition-colors ${
                          isSelected
                            ? "border-orange bg-orange/10 text-orange"
                            : isFull
                              ? "border-surface-light bg-surface text-foreground/20 cursor-not-allowed"
                              : "border-surface-light bg-surface text-foreground/60 hover:border-surface-light/80"
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        whileTap={isFull ? undefined : { scale: 0.95 }}
                      >
                        {tResults(key)}
                      </motion.button>
                    );
                  })}
                </div>
                <p className="mt-3 text-center text-xs text-foreground/40">
                  {selectedDays.length}/{numSessions}
                </p>
              </div>
            ) : (
              /* --- Sub-steps 2+: muscles for each selected day --- */
              (() => {
                const dayIndex = sortedDays[subStep - 2];
                const dayName = tResults(DAY_KEYS[dayIndex]);
                return (
                  <div>
                    <h3 className="font-condensed text-lg font-semibold mb-3">
                      {dayName}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                      {MUSCLE_GROUPS.map((mg, i) => {
                        const isSelected = dayMuscles[dayIndex]?.includes(mg);
                        return (
                          <motion.button
                            key={mg}
                            type="button"
                            onClick={() => toggleMuscle(dayIndex, mg)}
                            className={`rounded-xl border-2 px-3 py-2 text-sm font-semibold font-condensed transition-colors ${
                              isSelected
                                ? "border-orange bg-orange/10 text-orange"
                                : "border-surface-light bg-surface text-foreground/60 hover:border-surface-light/80"
                            }`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {t(`muscle_${mg}`)}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sub-navigation arrows */}
      <div className="flex items-center justify-between">
        <div>
          {subStep > 0 && (
            <button
              type="button"
              onClick={() => goSub(subStep - 1)}
              className="flex items-center gap-1 text-sm font-condensed font-semibold text-foreground/60 hover:text-foreground transition-colors"
            >
              <ArrowLeft size={14} />
              {t("back")}
            </button>
          )}
        </div>
        <div>
          {subStep < totalSubSteps - 1 && canGoNext && (
            <button
              type="button"
              onClick={() => goSub(subStep + 1)}
              className="flex items-center gap-1 text-sm font-condensed font-semibold text-orange hover:text-orange/80 transition-colors"
            >
              {subStep === 0
                ? t("next")
                : subStep === 1
                  ? t("next")
                  : tResults(DAY_KEYS[sortedDays[subStep - 1]])}
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
