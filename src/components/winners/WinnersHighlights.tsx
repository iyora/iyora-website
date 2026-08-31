"use client";

import { useTranslations, useLocale } from "next-intl";
import { Trophy, Award, MapPin, School, CheckCircle2, Star } from "lucide-react";
import { WinnerItem } from "@/data/dummyWinners";

interface WinnersHighlightsProps {
  grandChampions: WinnerItem[];
}

export default function WinnersHighlights({ grandChampions }: WinnersHighlightsProps) {
  const t = useTranslations("winners_page");
  const locale = useLocale();

  if (!grandChampions || grandChampions.length === 0) return null;

  return (
    <section className="py-14 px-6 bg-gradient-to-b from-gray-50/70 to-white relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Trophy size={14} className="text-amber-600" />
            <span>Spotlight Champions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            {t("grand_champions_title")}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {t("grand_champions_desc")}
          </p>
        </div>

        {/* Grand Champions Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grandChampions.map((winner, idx) => (
            <div
              key={winner.id}
              className="relative group bg-white rounded-2xl p-6 border-2 border-amber-200/90 shadow-xl shadow-amber-500/5 hover:shadow-2xl hover:shadow-amber-500/15 hover:border-amber-400 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Gold Top Banner Accent */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />

              {/* Decorative Watermark */}
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-50 rounded-full opacity-60 pointer-events-none group-hover:scale-110 transition-transform" />

              <div>
                {/* Header with Badges */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-black shadow-sm tracking-wide">
                    <Trophy size={13} className="text-yellow-100" />
                    <span>GRAND CHAMPION</span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200">
                    {winner.competition}
                  </span>
                </div>

                {/* Participant Name */}
                <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                  <span>{winner.name}</span>
                  {winner.countryCode === "ID" ? (
                    <span title="Indonesia" className="text-base">🇮🇩</span>
                  ) : winner.countryCode === "KR" ? (
                    <span title="South Korea" className="text-base">🇰🇷</span>
                  ) : winner.countryCode === "TH" ? (
                    <span title="Thailand" className="text-base">🇹🇭</span>
                  ) : winner.countryCode === "MY" ? (
                    <span title="Malaysia" className="text-base">🇲🇾</span>
                  ) : winner.countryCode === "US" ? (
                    <span title="United States" className="text-base">🇺🇸</span>
                  ) : (
                    <span title={winner.country} className="text-base">🌐</span>
                  )}
                </h3>

                {/* School & Location Info */}
                <div className="space-y-1.5 text-xs text-gray-600 mb-4">
                  <div className="flex items-start gap-2">
                    <School size={14} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-semibold text-gray-800 line-clamp-1">{winner.school}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                    <span>{winner.city}, {winner.province} ({winner.country})</span>
                  </div>
                </div>

                {/* Special Note / Distinction */}
                {winner.specialNote && (
                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-100/90 text-xs text-amber-950 mb-4 flex items-start gap-2">
                    <Star size={14} className="text-amber-600 mt-0.5 flex-shrink-0 fill-amber-500" />
                    <p className="font-medium leading-relaxed italic">{winner.specialNote}</p>
                  </div>
                )}
              </div>

              {/* Card Footer: Score & Verification */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                {winner.score && (
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">{t("score_label")}</span>
                    <span className="font-black text-sm text-primary">{winner.score} / 100</span>
                  </div>
                )}
                {winner.simtVerified && (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>SIMT Curated</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
