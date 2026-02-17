"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(t("login_error"));
      setLoading(false);
      return;
    }

    router.push("/suivi");
    router.refresh();
  };

  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-surface-light bg-surface p-6">
          <h1 className="font-display text-2xl font-bold text-center">{t("login_title")}</h1>
          <p className="mt-1 text-center text-sm text-foreground/60">{t("login_subtitle")}</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold font-display">{t("email")}</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-surface-light bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold font-display">{t("password")}</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-surface-light bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("loading") : t("login_button")}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-foreground/60">
            {t("no_account")}{" "}
            <Link href="/auth/signup" className="text-foreground hover:underline">
              {t("signup_link")}
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
