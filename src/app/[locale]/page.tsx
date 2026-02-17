import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { TriangleExplainer } from "@/components/landing/TriangleExplainer";
import { CTASection } from "@/components/landing/CTASection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale,
    },
  };
}

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TriangleExplainer />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
