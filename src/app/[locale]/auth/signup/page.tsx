"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { getPendingQuiz, savePendingQuiz } from "@/lib/pendingQuiz";
import { computeAll } from "@/lib/calculations";
import { parseTraining } from "@/lib/parseTraining";
import type { Sex, Goal, ActivityLevel } from "@/types/quiz";

export default function SignupPage() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  // Quiz params from URL (forwarded from results page)
  const quizSex = searchParams.get("s");
  const quizGoal = searchParams.get("g");
  const quizAge = searchParams.get("a");
  const quizHeight = searchParams.get("h");
  const quizWeight = searchParams.get("w");
  const quizActivity = searchParams.get("al");
  const quizDays = searchParams.get("d");
  const quizExercises = searchParams.get("ex");
  const hasQuizData = !!(quizSex && quizGoal && quizAge && quizHeight && quizWeight && quizActivity);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [height, setHeight] = useState(quizHeight ?? "");
  const [weight, setWeight] = useState(quizWeight ?? "");
  const [age, setAge] = useState(quizAge ?? "");
  const [goal, setGoal] = useState(quizGoal ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    // Build quiz data to encode in the confirmation email callback URL
    const pending = getPendingQuiz();
    const quizPayload = pending
      ? { ...pending, first_name: firstName, last_name: lastName,
          ...(height ? { height: parseFloat(height) } : {}),
          ...(weight ? { weight: parseFloat(weight) } : {}),
          ...(age ? { age: parseInt(age, 10) } : {}),
          ...(goal ? { goal } : {}),
        }
      : hasQuizData
        ? {
            sex: quizSex as string,
            goal: (goal || quizGoal) as string,
            age: age ? parseInt(age, 10) : Number(quizAge),
            height: height ? parseFloat(height) : Number(quizHeight),
            weight: weight ? parseFloat(weight) : Number(quizWeight),
            activity_level: quizActivity as string,
            training_data: quizDays && quizExercises ? JSON.stringify({ d: quizDays, ex: quizExercises }) : null,
            first_name: firstName,
            last_name: lastName,
          }
        : null;

    const quizParam = quizPayload ? `?quiz=${btoa(JSON.stringify(quizPayload))}` : "";
    const redirectUrl = `${window.location.origin}/auth/callback${quizParam}`;

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl },
    });

    if (signUpError) {
      setError(t("signup_error"));
      setLoading(false);
      return;
    }

    if (data.user && quizPayload) {
      // Keep localStorage as fallback for same-browser confirmation
      const trainingData = quizPayload.training_data ?? null;
      const parsedTraining = parseTraining(
        quizDays ?? (trainingData ? JSON.parse(trainingData).d : null),
        quizExercises ?? (trainingData ? JSON.parse(trainingData).ex : null)
      );
      const result = computeAll(
        (quizPayload.sex) as Sex,
        (quizPayload.goal) as Goal,
        quizPayload.age as number,
        quizPayload.height as number,
        quizPayload.weight as number,
        (quizPayload.activity_level) as ActivityLevel,
        undefined,
        parsedTraining?.days.length
      );
      savePendingQuiz({
        sex: quizPayload.sex as string,
        goal: quizPayload.goal as string,
        age: quizPayload.age as number,
        height: quizPayload.height as number,
        weight: quizPayload.weight as number,
        activity_level: quizPayload.activity_level as string,
        training_data: trainingData,
        bmr: result.bmr,
        tdee: result.tdee,
        target_calories: result.targetCalories,
        first_name: firstName,
        last_name: lastName,
      });
    }

    setSuccess(true);
    setLoading(false);
  };

  const inputClass = "mt-1 w-full rounded-xl border border-surface-light bg-background px-3 py-2 text-sm outline-none focus:border-accent";

  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center px-4 pt-24 pb-8">
        <div className="w-full max-w-md rounded-2xl border border-surface-light bg-surface p-6">
          <h1 className="font-display text-2xl font-bold text-center">{t("signup_title")}</h1>
          <p className="mt-1 text-center text-sm text-foreground/60">{t("signup_subtitle")}</p>

          {success ? (
            <div className="mt-6 rounded-xl bg-green/10 p-4 text-center">
              <p className="text-sm font-semibold text-green">{t("signup_success")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold font-display">{t("first_name")}</label>
                  <input id="firstName" type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold font-display">{t("last_name")}</label>
                  <input id="lastName" type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold font-display">{t("email")}</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold font-display">{t("password")}</label>
                <input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="profileHeight" className="block text-sm font-semibold font-display">{t("profile_height")}</label>
                  <input id="profileHeight" type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="175" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="profileWeight" className="block text-sm font-semibold font-display">{t("profile_weight")}</label>
                  <input id="profileWeight" type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="75" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="profileAge" className="block text-sm font-semibold font-display">{t("profile_age")}</label>
                  <input id="profileAge" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" className={inputClass} />
                </div>
              </div>

              <div>
                <label htmlFor="profileGoal" className="block text-sm font-semibold font-display">{t("profile_goal")}</label>
                <select id="profileGoal" value={goal} onChange={(e) => setGoal(e.target.value)} className={inputClass}>
                  <option value="">—</option>
                  <option value="bulk">{t("goal_bulk")}</option>
                  <option value="cut">{t("goal_cut")}</option>
                  <option value="recomp">{t("goal_recomp")}</option>
                </select>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("loading") : t("signup_button")}
              </Button>
            </form>
          )}

          <p className="mt-4 text-center text-sm text-foreground/60">
            {t("has_account")}{" "}
            <Link href="/auth/login" className="text-foreground hover:underline">
              {t("login_link")}
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
