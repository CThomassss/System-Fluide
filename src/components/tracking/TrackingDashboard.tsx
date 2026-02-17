"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ResultsDashboard } from "@/components/results/ResultsDashboard";
import { computeAll } from "@/lib/calculations";
import { parseTrainingFromDB } from "@/lib/parseTraining";
import { syncQuizToProfile } from "@/lib/syncQuizToProfile";
import type { Sex, Goal, ActivityLevel } from "@/types/quiz";

interface Profile {
  sex: string | null;
  height: number | null;
  weight: number | null;
  age: number | null;
  activity_level: string | null;
  goal: string | null;
  training_data: string | null;
}

interface TrackingDashboardProps {
  profile: Profile | null;
}

export function TrackingDashboard({ profile }: TrackingDashboardProps) {
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
    return null;
  }

  const result = computeAll(
    profile.sex as Sex,
    profile.goal as Goal,
    profile.age!,
    profile.height!,
    profile.weight!,
    profile.activity_level as ActivityLevel
  );

  return (
    <ResultsDashboard
      result={result}
      goal={profile.goal as Goal}
      training={training}
      context="tracking"
    />
  );
}
