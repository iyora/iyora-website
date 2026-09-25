import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchNewsletterBySlug, fetchNewslettersData } from "@/lib/supabase";
import NewsletterDetailView from "@/components/newsletter/NewsletterDetailView";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const isEn = locale === "en";
  const item = await fetchNewsletterBySlug(slug, locale);

  if (!item) {
    return {
      title: isEn ? "Newsletter Not Found | IYORA" : "Newsletter Tidak Ditemukan | IYORA",
    };
  }

  return {
    title: `${item.title} - ${item.edition} | IYORA Newsletter`,
    description: item.description || (isEn ? "Official IYORA publication and bulletin." : "Publikasi dan warta buletin resmi IYORA."),
    openGraph: {
      title: `${item.title} | IYORA Newsletter`,
      description: item.description || (isEn ? "Official IYORA publication." : "Publikasi resmi IYORA."),
      images: item.cover_image ? [{ url: item.cover_image }] : [],
    },
  };
}

export default async function NewsletterDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const newsletter = await fetchNewsletterBySlug(slug, locale);

  if (!newsletter) {
    notFound();
  }

  return <NewsletterDetailView newsletter={newsletter} />;
}
