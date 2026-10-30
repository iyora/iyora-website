import type { Metadata } from "next";
import { fetchAllNews } from "@/lib/supabase";
import NewsTabs from "@/components/news/NewsTabs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Berita & Galeri",
  description: "Berita terbaru, pengumuman, siaran pers, dan galeri resmi dari IYORA.",
};

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { news, announcements, pressRelease, gallery } = await fetchAllNews(locale);

  return (
    <NewsTabs
      news={news}
      announcements={announcements}
      pressRelease={pressRelease}
      gallery={gallery}
    />
  );
}
