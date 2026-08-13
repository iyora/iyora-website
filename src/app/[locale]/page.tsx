import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import OriginStory from "@/components/home/OriginStory";
import StatsSection from "@/components/home/StatsSection";
import CompetitionsSection from "@/components/home/CompetitionsSection";
import HomeNewsSection from "@/components/home/HomeNewsSection";
import WhyIYORA from "@/components/home/WhyIYORA";
import KurasiSection from "@/components/home/KurasiSection";
import CTASection from "@/components/home/CTASection";
import { fetchCompetitionsData, fetchAllNews } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IYORA — Indonesian Youth Outstanding Recognition Association",
  description:
    "Rumah resmi olimpiade sains pemuda Indonesia. Lahir dari IYSA, IYORA mendedikasikan diri sepenuhnya untuk mengangkat potensi terbaik generasi muda melalui kompetisi olimpiade bertaraf nasional dan internasional.",
};

export default async function HomePage() {
  const competitions = await fetchCompetitionsData();
  const { news, announcements, gallery } = await fetchAllNews();

  return (
    <>
      <HeroSection />
      <OriginStory />
      <StatsSection />
      <CompetitionsSection competitions={competitions} />
      <HomeNewsSection news={news} announcements={announcements} gallery={gallery} />
      <WhyIYORA />
      <KurasiSection />
      <CTASection />
    </>
  );
}
