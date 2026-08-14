import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { fetchAllNews } from "@/lib/supabase";
import NewsTabs from "@/components/news/NewsTabs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Berita",
  description: "Berita terbaru, pengumuman, dokumentasi, dan galeri dari IYORA.",
};

function NewsHero() {
  const t = useTranslations("news_page");

  return (
    <section className="gradient-hero pt-32 pb-20 text-white text-center px-6">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">{t("title")}</h1>
      <p className="text-lg md:text-xl max-w-xl mx-auto opacity-90">
        {t("subtitle")}
      </p>
    </section>
  );
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { news, announcements, pressRelease, gallery } = await fetchAllNews(locale);

  return (
    <>
      <NewsHero />
      <NewsTabs
        news={news}
        announcements={announcements}
        pressRelease={pressRelease}
        gallery={gallery}
      />
    </>
  );
}
