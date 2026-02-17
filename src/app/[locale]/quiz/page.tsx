import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { QuizShell } from "@/components/quiz/QuizShell";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: `Quiz | ${t("title")}`,
  };
}

export default function QuizPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-60px)]">
        <QuizShell />
      </main>
    </>
  );
}
