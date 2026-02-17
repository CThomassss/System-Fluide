"use client";

import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { useQuiz } from "@/hooks/useQuiz";
import { useRouter } from "@/i18n/navigation";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { StepSex } from "./StepSex";
import { StepGoal } from "./StepGoal";
import { StepPersonalInfo } from "./StepPersonalInfo";
import { StepActivity } from "./StepActivity";
import { StepTraining } from "./StepTraining";
import { ArrowLeft, ArrowRight } from "lucide-react";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
};

export function QuizShell() {
  const t = useTranslations("quiz");
  const { state, dispatch, totalSteps } = useQuiz();
  const router = useRouter();

  const isStepValid = (): boolean => {
    switch (state.step) {
      case 0:
        return state.sex !== null;
      case 1:
        return state.goal !== null;
      case 2:
        return (
          state.age !== null &&
          state.age > 0 &&
          state.height !== null &&
          state.height > 0 &&
          state.weight !== null &&
          state.weight > 0
        );
      case 3:
        return state.activityLevel !== null;
      case 4:
        return (
          state.training !== null &&
          state.training.days.length > 0 &&
          state.training.days.every((d) => d.muscles.length > 0) &&
          state.training.setsPerSession > 0
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (state.step === totalSteps - 1) {
      // Navigate to results with URL params
      // Encode days as pipe-separated, each prefixed with dayIndex: then muscles dot-separated
      const dParam = state.training!.days
        .map((d) => `${d.dayIndex}:${d.muscles.join(".")}`)
        .join("|");
      const params = new URLSearchParams({
        s: state.sex!,
        g: state.goal!,
        a: String(state.age),
        h: String(state.height),
        w: String(state.weight),
        al: state.activityLevel!,
        d: dParam,
        ss: String(state.training!.setsPerSession),
      });
      router.push(`/results?${params.toString()}`);
    } else {
      dispatch({ type: "NEXT_STEP" });
    }
  };

  const steps = [
    <StepSex key="sex" value={state.sex} dispatch={dispatch} />,
    <StepGoal key="goal" value={state.goal} dispatch={dispatch} />,
    <StepPersonalInfo
      key="info"
      age={state.age}
      height={state.height}
      weight={state.weight}
      dispatch={dispatch}
    />,
    <StepActivity key="activity" value={state.activityLevel} dispatch={dispatch} />,
    <StepTraining key="training" value={state.training} dispatch={dispatch} />,
  ];

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <ProgressBar current={state.step} total={totalSteps} />

      <p className="mt-4 text-center text-sm text-foreground/50 font-condensed">
        {t("progress", { step: state.step + 1, total: totalSteps })}
      </p>

      <div className="mt-8 overflow-hidden">
        <AnimatePresence mode="wait" custom={1}>
          <motion.div
            key={state.step}
            custom={1}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {steps[state.step]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <div>
          {state.step > 0 && (
            <Button
              variant="ghost"
              onClick={() => dispatch({ type: "PREV_STEP" })}
            >
              <ArrowLeft size={16} />
              {t("back")}
            </Button>
          )}
        </div>
        <Button onClick={handleNext} disabled={!isStepValid()}>
          {state.step === totalSteps - 1 ? t("start") : t("next")}
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
