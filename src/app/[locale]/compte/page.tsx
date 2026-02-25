import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AccountContent } from "@/components/compte/AccountContent";

export default async function ComptePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Compte: failed to fetch profile:", profileError);
  }

  const { data: customFoods } = await supabase
    .from("custom_foods")
    .select("id, protein_per_100g, carbs_per_100g, fat_per_100g, calories_per_100g");

  return (
    <>
      <Header />
      <main>
        <AccountContent profile={profile} customFoods={customFoods ?? []} />
      </main>
      <Footer />
    </>
  );
}
