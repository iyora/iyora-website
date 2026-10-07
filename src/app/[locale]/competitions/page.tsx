import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { fetchCompetitionsData } from "@/lib/supabase";
import CompetitionsGrid from "./CompetitionsGrid";

export const dynamic = "force-dynamic";

export default async function CompetitionsPage() {
  const [t, competitions] = await Promise.all([
    getTranslations("competitions_page"),
    fetchCompetitionsData(),
  ]);

  return (
    <>
      <section className="gradient-hero pt-32 pb-20 text-white text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">{t("title")}</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">{t("subtitle")}</p>
      </section>

      <section className="py-12 px-6 max-w-6xl mx-auto">
        <Suspense fallback={<div className="py-20 text-center text-gray-400">Loading...</div>}>
          <CompetitionsGrid competitions={competitions} />
        </Suspense>
      </section>
    </>
  );
}
