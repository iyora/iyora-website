"use client";

import { useTranslations } from "next-intl";
import { FileText, ShieldCheck, Award, Sparkles, FolderCheck, CheckCircle2 } from "lucide-react";
import { WinnerAnnouncementDoc } from "@/data/dummyWinners";

interface SkHeroProps {
  announcements: WinnerAnnouncementDoc[];
}

export default function SkHero({ announcements }: SkHeroProps) {
  const t = useTranslations("sk_page");

  const totalDocs = announcements.length;
  const distinctComps = new Set(announcements.map((a) => a.competition).filter(Boolean)).size;
  const totalMedalsCount = announcements.reduce((acc, curr) => acc + (curr.totalMedals || 0), 0);

  const stats = [
    {
      icon: FileText,
      value: totalDocs > 0 ? `${totalDocs} SK` : "12 SK",
      label: t("stat_docs"),
      color: "text-amber-300",
      bg: "bg-amber-400/10 border-amber-300/30",
    },
    {
      icon: FolderCheck,
      value: distinctComps > 0 ? `${distinctComps} Cabang` : "12 Cabang",
      label: t("stat_competitions"),
      color: "text-teal-300",
      bg: "bg-teal-400/10 border-teal-300/30",
    },
    {
      icon: Award,
      value: totalMedalsCount > 0 ? `${totalMedalsCount.toLocaleString()}+` : "1,500+",
      label: "Medalis Terdata",
      color: "text-purple-300",
      bg: "bg-purple-400/10 border-purple-300/30",
    },
    {
      icon: ShieldCheck,
      value: "100% Resmi",
      label: t("stat_curated"),
      color: "text-emerald-300",
      bg: "bg-emerald-400/10 border-emerald-300/30",
    },
  ];

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-[#301c5c] via-[#24587e] to-[#1a6e78] text-white">
      {/* Background radial blurs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-white/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-400/20 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-400/20 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        {/* Accreditation Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs md:text-sm font-bold text-amber-200 shadow-lg shadow-black/10 mb-6">
          <Sparkles size={16} className="text-amber-300 animate-pulse" />
          <span>{t("badge")}</span>
          <CheckCircle2 size={16} className="text-emerald-300" />
        </div>

        {/* Headline & Subheadline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 leading-tight drop-shadow-md">
          {t("title")}
        </h1>
        <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-white/90 leading-relaxed font-normal mb-12">
          {t("subtitle")}
        </p>

        {/* Quick Highlights Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-2xl backdrop-blur-md border ${item.bg} shadow-lg transition-transform hover:-translate-y-1`}
              >
                <div className="flex justify-center mb-2">
                  <div className={`p-2.5 rounded-xl bg-white/10 ${item.color}`}>
                    <Icon size={24} />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {item.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-white/80 mt-0.5">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
