"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { ResultsDashboard } from "@/components/results/ResultsDashboard";
import { computeAll } from "@/lib/calculations";
import { parseTrainingFromDB } from "@/lib/parseTraining";
import { syncQuizToProfile } from "@/lib/syncQuizToProfile";
import type { Sex, Goal, ActivityLevel } from "@/types/quiz";

interface Profile {
  first_name: string | null;
  last_name: string | null;
  sex: string | null;
  height: number | null;
  weight: number | null;
  age: number | null;
  activity_level: string | null;
  goal: string | null;
  training_data: string | null;
}

interface AccountContentProps {
  profile: Profile | null;
}

export function AccountContent({ profile }: AccountContentProps) {
  const t = useTranslations("compte");
  const tQuiz = useTranslations("quiz");
  const router = useRouter();

  // Sync pending quiz data from localStorage to DB on first visit
  useEffect(() => {
    syncQuizToProfile().then((synced) => {
      if (synced) router.refresh();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canCompute =
    profile?.sex &&
    profile?.goal &&
    profile?.age &&
    profile?.height &&
    profile?.weight &&
    profile?.activity_level;

  const training = parseTrainingFromDB(profile?.training_data ?? null);

  if (!canCompute || !training) {
    return (
      <div className="mx-auto max-w-6xl px-6 pt-24 pb-12 text-center">
        <h1 className="font-display text-3xl font-bold">{t("title")}</h1>
        <p className="mt-4 text-foreground/60">{t("no_data")}</p>
        <div className="mt-6">
          <Link href="/quiz">
            <Button>{t("do_quiz")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const result = computeAll(
    profile.sex as Sex,
    profile.goal as Goal,
    profile.age!,
    profile.height!,
    profile.weight!,
    profile.activity_level as ActivityLevel
  );

  const sexLabel = profile.sex === "male" ? tQuiz("sex_male") : tQuiz("sex_female");
  const goalLabel = profile.goal === "bulk" ? tQuiz("goal_bulk") : profile.goal === "cut" ? tQuiz("goal_cut") : tQuiz("goal_recomp");
  const activityKey = `activity_${profile.activity_level}` as const;

  return (
    <div className="mx-auto max-w-6xl px-6 pt-24 pb-12">
      {/* Profile info card */}
      <div className="mb-10">
        <h1 className="font-display text-3xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-foreground/60">{t("subtitle")}</p>

        <div className="mt-6 rounded-2xl border border-surface-light bg-surface p-6">
          <h2 className="font-display text-lg font-semibold">{t("profile_title")}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(profile.first_name || profile.last_name) && (
              <InfoItem label={t("name")} value={`${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim()} />
            )}
            <InfoItem label={t("info_sex")} value={sexLabel} />
            <InfoItem label={t("info_age")} value={`${profile.age} ${t("info_age_unit")}`} />
            <InfoItem label={t("info_height")} value={`${profile.height} cm`} />
            <InfoItem label={t("info_weight")} value={`${profile.weight} kg`} />
            <InfoItem label={t("info_goal")} value={goalLabel} />
            <InfoItem label={t("info_activity")} value={tQuiz(activityKey)} />
          </div>
        </div>
      </div>

      {/* Full personalized program */}
      <ResultsDashboard
        result={result}
        goal={profile.goal as Goal}
        training={training}
        context="account"
      />
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-foreground/40">{label}</p>
      <p className="mt-0.5 font-display text-sm font-semibold">{value}</p>
    </div>
  );
}
