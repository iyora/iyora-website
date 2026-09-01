import type { Metadata } from "next";
import SkHero from "@/components/sk/SkHero";
import SkDirectory from "@/components/sk/SkDirectory";
import { fetchWinnerAnnouncements } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return {
    title: isEn ? "Download Official Decrees (SK) | IYORA" : "Download SK Penetapan Pemenang Resmi | IYORA",
    description: isEn
      ? "Official decrees (Surat Keputusan) and winner announcements of IYORA Science Olympiads (NYGO, IYGO, NYEO, IYEO, NYBO, IYBO, NYPO, IYPO, NYMO, IYMO, OS2MN, WSO). Curated and accredited by SIMT Puspresnas RI."
      : "Dokumen Surat Keputusan (SK) resmi penetapan pemenang dan medalis olimpiade sains IYORA (NYGO, IYGO, NYEO, IYEO, NYBO, IYBO, NYPO, IYPO, NYMO, IYMO, OS2MN, WSO). Terkurasi resmi SIMT Puspresnas Kemendikbudristek RI.",
    openGraph: {
      title: isEn ? "Download Official Decrees (SK) | IYORA" : "Download SK Penetapan Pemenang Resmi | IYORA",
      description: isEn
        ? "Official decrees and winner announcements from IYORA Science Olympiad competitions."
        : "Unduh dokumen Surat Keputusan (SK) resmi penetapan pemenang olimpiade sains IYORA terintegrasi SIMT Puspresnas.",
    },
  };
}

export default async function SkPage() {
  const announcements = await fetchWinnerAnnouncements();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header with Quick Highlights */}
      <SkHero announcements={announcements} />

      {/* Interactive SK Search, Filter & Download Directory */}
      <SkDirectory announcements={announcements} />
    </div>
  );
}
