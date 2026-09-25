import type { Metadata } from "next";
import { fetchNewslettersData } from "@/lib/supabase";
import NewsletterDirectory from "@/components/newsletter/NewsletterDirectory";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return {
    title: isEn ? "Newsletter & Publications" : "Newsletter & Warta Resmi",
    description: isEn
      ? "Official IYORA Newsletter and youth science bulletins. Stay informed with latest competition highlights, medalist spotlights, and scientific updates."
      : "Newsletter dan buletin sains pemuda resmi IYORA. Pantau terus informasi olimpiade, sorotan prestasi medalis, dan perkembangan kurasi SIMT Puspresnas.",
    openGraph: {
      title: isEn ? "Newsletter | IYORA" : "Newsletter | IYORA",
      description: isEn
        ? "Official IYORA Newsletter and youth science bulletins."
        : "Newsletter dan buletin sains pemuda resmi IYORA.",
    },
  };
}

export default async function NewsletterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const newsletters = await fetchNewslettersData(locale);

  return <NewsletterDirectory newsletters={newsletters} />;
}
