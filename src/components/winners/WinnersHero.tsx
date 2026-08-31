"use client";

import { useTranslations } from "next-intl";
import { Trophy, Award, School, Globe2, ShieldCheck, Sparkles } from "lucide-react";
import { WINNER_STATS } from "@/data/dummyWinners";

interface WinnersHeroProps {
  stats?: typeof WINNER_STATS;
}

export default function WinnersHero({ stats = WINNER_STATS }: WinnersHeroProps) {
  const t = useTranslations("winners_page");

  const statItems = [
    {
      icon: Award,
      value: stats.totalWinners > 0 ? stats.totalWinners.toLocaleString() : "0",
      label: t("stat_winners"),
      color: "text-amber-300",
      bg: "bg-amber-400/10 border-amber-300/30",
    },
    {
      icon: Trophy,
      value: `${stats.totalCompetitions}`,
      label: t("stat_competitions"),
      color: "text-teal-300",
      bg: "bg-teal-400/10 border-teal-300/30",
    },
    {
      icon: School,
      value: stats.totalSchools > 0 ? stats.totalSchools.toLocaleString() : "0",
      label: t("stat_schools"),
      color: "text-purple-300",
      bg: "bg-purple-400/10 border-purple-300/30",
    },
    {
      icon: Globe2,
      value: `${stats.totalCountries}`,
      label: t("stat_countries"),
      color: "text-sky-300",
      bg: "bg-sky-400/10 border-sky-300/30",
    },
  ];

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-[#4b277b] via-[#356d9c] to-[#258b94] text-white">
      {/* Subtle background glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-white/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-400/20 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-400/20 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs md:text-sm font-bold text-amber-200 shadow-lg shadow-black/10 mb-6">
          <Sparkles size={16} className="text-amber-300 animate-pulse" />
          <span>{t("badge")}</span>
          <ShieldCheck size={16} className="text-emerald-300" />
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight drop-shadow-md">
          {t("title")}
        </h1>
        <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-white/90 leading-relaxed font-normal mb-12">
          {t("subtitle")}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {statItems.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-2xl backdrop-blur-md border ${stat.bg} shadow-lg transition-transform hover:-translate-y-1`}
              >
                <div className="flex justify-center mb-2">
                  <div className={`p-2.5 rounded-xl bg-white/10 ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-white/80 mt-0.5">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
