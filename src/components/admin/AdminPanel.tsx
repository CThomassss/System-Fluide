"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { computeAll, scaleMeals } from "@/lib/calculations";
import { parseTrainingFromDB } from "@/lib/parseTraining";
import { CaloriesSummary } from "@/components/results/CaloriesSummary";
import { MacroSplit } from "@/components/results/MacroSplit";
import { MealSuggestions } from "@/components/results/MealSuggestions";
import { ExerciseRecommendations } from "@/components/results/ExerciseRecommendations";
import { WeeklyPlanning } from "@/components/results/WeeklyPlanning";
import { MealPlanEditor } from "./MealPlanEditor";
import { TrainingEditor } from "./TrainingEditor";
import { ChevronDown, ChevronUp, Users } from "lucide-react";
import type { Sex, Goal, ActivityLevel } from "@/types/quiz";

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  sex: string | null;
  height: number | null;
  weight: number | null;
  age: number | null;
  activity_level: string | null;
  goal: string | null;
  bmr: number | null;
  tdee: number | null;
  target_calories: number | null;
  training_data: string | null;
  custom_meals: string | null;
  role: string | null;
  created_at: string | null;
}

interface AdminPanelProps {
  users: UserProfile[];
}

export function AdminPanel({ users }: AdminPanelProps) {
  const t = useTranslations("admin");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const nonAdminUsers = users.filter((u) => u.role !== "admin");

  return (
    <div>
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">{t("title")}</h1>
        <p className="mt-2 text-foreground/60">{t("subtitle")}</p>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-foreground/50">
        <Users size={16} />
        <span>{t("user_count", { count: nonAdminUsers.length })}</span>
      </div>

      <div className="mt-8 space-y-4">
        {nonAdminUsers.map((user) => (
          <UserRow
            key={user.id}
            user={user}
            isExpanded={expandedUser === user.id}
            onToggle={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
          />
        ))}
        {nonAdminUsers.length === 0 && (
          <p className="text-center text-foreground/50">{t("no_users")}</p>
        )}
      </div>
    </div>
  );
}

function UserRow({
  user,
  isExpanded,
  onToggle,
}: {
  user: UserProfile;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const t = useTranslations("admin");
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ") || "—";
  const goalMap: Record<string, string> = { bulk: "PDM", cut: "Seche", recomp: "Recomp" };

  return (
    <div className="rounded-2xl border border-surface-light bg-surface overflow-hidden">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-6 text-left cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 font-display font-bold text-sm">
            {(user.first_name?.[0] ?? "?").toUpperCase()}
          </div>
          <div>
            <p className="font-display font-semibold">{name}</p>
            <p className="text-sm text-foreground/50">
              {goalMap[user.goal ?? ""] ?? "—"} · {user.target_calories ?? "—"} kcal
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user.custom_meals && (
            <span className="rounded-full bg-green/10 px-2 py-0.5 text-xs font-semibold text-green">
              {t("custom_badge")}
            </span>
          )}
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {isExpanded && <UserDetail user={user} />}
    </div>
  );
}

function UserDetail({ user }: { user: UserProfile }) {
  const t = useTranslations("admin");

  // Recompute results from profile data
  const canCompute =
    user.sex && user.goal && user.age && user.height && user.weight && user.activity_level;

  const training = parseTrainingFromDB(user.training_data);

  const result = canCompute
    ? computeAll(
        user.sex as Sex,
        user.goal as Goal,
        user.age!,
        user.height!,
        user.weight!,
        user.activity_level as ActivityLevel,
        undefined,
        training?.days.length
      )
    : null;

  const customMeals = user.custom_meals ? JSON.parse(user.custom_meals) : null;
  const computedMeals = user.target_calories ? scaleMeals(user.target_calories) : null;

  return (
    <div className="border-t border-surface-light px-6 pb-6">
      {/* Profile stats */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label={t("user_sex")} value={user.sex === "male" ? "Homme" : user.sex === "female" ? "Femme" : "—"} />
        <Stat label={t("user_age")} value={user.age ? `${user.age} ans` : "—"} />
        <Stat label={t("user_height")} value={user.height ? `${user.height} cm` : "—"} />
        <Stat label={t("user_weight")} value={user.weight ? `${user.weight} kg` : "—"} />
      </div>

      {/* Full results dashboard */}
      {result && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <CaloriesSummary
            bmr={result.bmr}
            tdee={result.tdee}
            target={result.targetCalories}
            goal={user.goal as Goal}
          />
          <MacroSplit macros={result.macros} macroGrams={result.macroGrams} />
        </div>
      )}

      {/* Meals + Training */}
      {result && training && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <MealSuggestions targetCalories={result.targetCalories} macroGrams={result.macroGrams} />
          <ExerciseRecommendations training={training} goal={user.goal as Goal} />
        </div>
      )}

      {/* Weekly planning */}
      {training && (
        <div className="mt-6">
          <WeeklyPlanning training={training} />
        </div>
      )}

      {/* Meal plan editor */}
      <div className="mt-6">
        <MealPlanEditor
          userId={user.id}
          initialMeals={customMeals}
          computedMeals={computedMeals}
        />
      </div>

      {/* Training editor */}
      <div className="mt-6">
        <TrainingEditor userId={user.id} initialTraining={training} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-background/50 p-3">
      <p className="text-xs text-foreground/50">{label}</p>
      <p className="mt-1 font-display font-semibold text-sm">{value}</p>
    </div>
  );
}
