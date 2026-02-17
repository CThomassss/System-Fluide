import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdminPanel } from "@/components/admin/AdminPanel";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/compte");
  }

  // Admin can read all profiles via RLS policy
  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, sex, height, weight, age, activity_level, goal, bmr, tdee, target_calories, training_data, custom_meals, role, created_at")
    .order("created_at", { ascending: false });

  if (usersError) {
    console.error("Admin: failed to fetch users:", usersError);
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-6 pt-24 pb-12">
        <AdminPanel users={users ?? []} />
      </main>
      <Footer />
    </>
  );
}
