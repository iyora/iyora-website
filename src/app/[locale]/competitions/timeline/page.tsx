import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchCompetitionsData } from "@/lib/supabase";
import TimelineClient from "./TimelineClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Timeline Event Olimpiade",
  description:
    "Jadwal lengkap pendaftaran dan pelaksanaan olimpiade sains nasional dan internasional IYORA.",
};

export default async function CompetitionTimelinePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isId = locale === "id";
  const competitions = await fetchCompetitionsData();

  return (
    <>
      <section className="gradient-hero pt-32 pb-20 text-white text-center px-6">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-xs text-xs font-bold uppercase tracking-wider mb-4 border border-white/25">
            {isId ? "Jadwal Resmi IYORA" : "Official IYORA Schedule"}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {isId ? "Timeline Event Olimpiade" : "Olympiad Event Timeline"}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            {isId
              ? "Pantau jadwal pembukaan dan penutupan pendaftaran seluruh cabang olimpiade sains nasional dan internasional IYORA."
              : "Track registration opening and closing dates across all national and international IYORA science olympiads."}
          </p>
        </div>
      </section>

      <section className="py-12 px-6 max-w-5xl mx-auto">
        <Suspense fallback={<div className="py-20 text-center text-gray-400">Loading...</div>}>
          <TimelineClient competitions={competitions} />
        </Suspense>
      </section>
    </>
  );
}
