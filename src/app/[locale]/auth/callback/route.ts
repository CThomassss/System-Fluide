import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const quizB64 = searchParams.get("quiz");

  if (code) {
    const supabase = await createClient();
    const { data: sessionData } = await supabase.auth.exchangeCodeForSession(code);

    // If quiz data was encoded in the callback URL, save it to the profile
    if (quizB64 && sessionData?.user) {
      try {
        const quiz = JSON.parse(atob(quizB64));

        // Check if admin has overridden target calories
        const { data: currentProfile } = await supabase
          .from("profiles")
          .select("target_calories_override")
          .eq("id", sessionData.user.id)
          .single();
        const isOverride = currentProfile?.target_calories_override === true;

        await supabase
          .from("profiles")
          .update({
            sex: quiz.sex,
            height: quiz.height,
            weight: quiz.weight,
            age: quiz.age,
            activity_level: quiz.activity_level,
            goal: quiz.goal,
            training_data: quiz.training_data ?? null,
            ...(quiz.first_name ? { first_name: quiz.first_name } : {}),
            ...(quiz.last_name ? { last_name: quiz.last_name } : {}),
            ...(quiz.bmr ? { bmr: quiz.bmr } : {}),
            ...(quiz.tdee ? { tdee: quiz.tdee } : {}),
            ...(!isOverride && quiz.target_calories ? { target_calories: quiz.target_calories } : {}),
          })
          .eq("id", sessionData.user.id);
      } catch (e) {
        console.error("Failed to decode quiz data from callback URL:", e);
      }
    }
  }

  return NextResponse.redirect(`${origin}/compte`);
}
