"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, Menu, MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const WHATSAPP_NUMBER = "33769085097";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function Header() {
  const t = useTranslations("header");
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuth(!!user);
      if (user) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            setIsAdmin(data?.role === "admin");
          });
      }
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsAuth(false);
    setIsAdmin(false);
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/60 backdrop-blur-xl border-b border-surface-light/30"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-lg font-semibold tracking-tight text-foreground">
            {t("title")}
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinks
              t={t}
              isAuth={isAuth}
              isAdmin={isAdmin}
              onLogout={handleLogout}
            />
            <WhatsAppLink t={t} />
            <LanguageSwitcher />
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label={mobileOpen ? t("menu_close") : t("menu_open")}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {/* Mobile panel — outside header to avoid backdrop-blur containing block */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
            />
            <motion.div
              className="fixed inset-y-0 right-0 z-[70] w-64 bg-[#09090b] border-l border-surface-light p-6 flex flex-col gap-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <button
                onClick={closeMobile}
                className="self-end p-2 text-foreground"
                aria-label={t("menu_close")}
              >
                <X size={22} />
              </button>
              <div className="flex flex-col gap-4">
                <MobileNavLinks
                  t={t}
                  isAuth={isAuth}
                  isAdmin={isAdmin}
                  onLogout={handleLogout}
                  onNavigate={closeMobile}
                />
                <WhatsAppLink t={t} />
                <LanguageSwitcher />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLinks({
  t,
  isAuth,
  isAdmin,
  onLogout,
}: {
  t: ReturnType<typeof useTranslations<"header">>;
  isAuth: boolean;
  isAdmin: boolean;
  onLogout: () => void;
}) {
  return (
    <>
      <Link
        href="/quiz"
        className="text-sm text-accent-muted hover:text-foreground transition-colors"
      >
        {t("quiz")}
      </Link>
      {isAuth ? (
        <>
          <Link
            href="/suivi"
            className="text-sm text-accent-muted hover:text-foreground transition-colors"
          >
            {t("tracking")}
          </Link>
          <Link
            href="/compte"
            className="text-sm text-accent-muted hover:text-foreground transition-colors"
          >
            {t("account")}
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm text-accent-muted hover:text-foreground transition-colors"
            >
              {t("admin")}
            </Link>
          )}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-full border border-surface-light px-3 py-1.5 text-sm text-accent-muted hover:text-foreground hover:bg-surface transition-colors"
            title={t("logout")}
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">{t("logout")}</span>
          </button>
        </>
      ) : (
        <Link
          href="/auth/login"
          className="flex items-center gap-1.5 rounded-full border border-surface-light px-3 py-1.5 text-sm font-semibold text-foreground hover:bg-surface transition-colors"
        >
          <LogIn size={14} />
          <span className="hidden sm:inline">{t("login")}</span>
        </Link>
      )}
    </>
  );
}

function MobileNavLinks({
  t,
  isAuth,
  isAdmin,
  onLogout,
  onNavigate,
}: {
  t: ReturnType<typeof useTranslations<"header">>;
  isAuth: boolean;
  isAdmin: boolean;
  onLogout: () => void;
  onNavigate: () => void;
}) {
  const linkClass = "text-sm text-accent-muted hover:text-foreground transition-colors py-1";
  return (
    <>
      <Link href="/quiz" className={linkClass} onClick={onNavigate}>
        {t("quiz")}
      </Link>
      {isAuth ? (
        <>
          <Link href="/suivi" className={linkClass} onClick={onNavigate}>
            {t("tracking")}
          </Link>
          <Link href="/compte" className={linkClass} onClick={onNavigate}>
            {t("account")}
          </Link>
          {isAdmin && (
            <Link href="/admin" className={linkClass} onClick={onNavigate}>
              {t("admin")}
            </Link>
          )}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-sm text-accent-muted hover:text-foreground transition-colors py-1"
          >
            <LogOut size={14} />
            {t("logout")}
          </button>
        </>
      ) : (
        <Link
          href="/auth/login"
          className="flex items-center gap-1.5 text-sm font-semibold text-foreground py-1"
          onClick={onNavigate}
        >
          <LogIn size={14} />
          {t("login")}
        </Link>
      )}
    </>
  );
}

function WhatsAppLink({ t }: { t: ReturnType<typeof useTranslations<"header">> }) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 rounded-full bg-[#25D366]/10 px-3 py-1.5 text-sm font-semibold text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
      title="Thomas CEOLIN - Coach Sportif"
    >
      <MessageCircle size={14} />
      <span className="hidden sm:inline">{t("contact")}</span>
    </a>
  );
}
