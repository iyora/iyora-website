import type { Metadata } from "next";
import WinnersHero from "@/components/winners/WinnersHero";
import WinnersAnnouncements from "@/components/winners/WinnersAnnouncements";
import WinnersFilterGrid from "@/components/winners/WinnersFilterGrid";
import {
  fetchWinnersData,
  fetchWinnerAnnouncements,
  fetchWinnerStats,
} from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return {
    title: isEn ? "Winners & Medalists" : "Daftar Pemenang & Medalis",
    description: isEn
      ? "Official winner and medalist announcement of IYORA Science Olympiads (NYGO, IYGO, NYEO, IYEO, NYBO, IYBO, NYPO, IYPO, NYMO, IYMO, OS2MN, WSO). Curated by SIMT Puspresnas."
      : "Pengumuman pemenang dan daftar medalis resmi olimpiade sains IYORA (NYGO, IYGO, NYEO, IYEO, NYBO, IYBO, NYPO, IYPO, NYMO, IYMO, OS2MN, WSO). Terkurasi resmi SIMT Puspresnas Kemendikbudristek RI.",
    openGraph: {
      title: isEn ? "Winners & Medalists | IYORA" : "Daftar Pemenang & Medalis | IYORA",
      description: isEn
        ? "Official list of winners and medalists from IYORA Science Olympiad competitions."
        : "Daftar resmi peraih medali emas, perak, perunggu, dan medalis olimpiade sains IYORA.",
    },
  };
}

export default async function WinnersPage() {
  const [winners, announcements] = await Promise.all([
    fetchWinnersData(),
    fetchWinnerAnnouncements(),
  ]);
  const stats = await fetchWinnerStats(winners);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Dynamic Stats */}
      <WinnersHero stats={stats} />

      {/* Official SK Announcements & Decree Documents */}
      <WinnersAnnouncements announcements={announcements} />

      {/* Interactive Searchable & Filterable Winners Database */}
      <WinnersFilterGrid initialWinners={winners} announcements={announcements} />
    </div>
  );
}
