"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";
import { Trophy, Award, Calendar, ChevronRight, School, Globe2, ShieldCheck, Sparkles } from "lucide-react";
import clsx from "clsx";
import type { WinnerItem } from "@/data/dummyWinners";

interface WinnersYearCardsProps {
  winners: WinnerItem[];
  onSelectYear: (year: number) => void;
}

export default function WinnersYearCards({
  winners,
  onSelectYear,
}: WinnersYearCardsProps) {
  const locale = useLocale();
  const isEn = locale === "en";

  // Hitung data agregasi per tahun (hanya tahun yang memiliki pemenang terbit)
  const yearsData = useMemo(() => {
    const map = new Map<number, {
      year: number;
      total: number;
      gold: number;
      silver: number;
      bronze: number;
      competitions: Set<string>;
      schools: Set<string>;
      countries: Set<string>;
    }>();

    winners.forEach((w) => {
      const year = Number(w.editionYear) || 2026;
      if (!map.has(year)) {
        map.set(year, {
          year,
          total: 0,
          gold: 0,
          silver: 0,
          bronze: 0,
          competitions: new Set<string>(),
          schools: new Set<string>(),
          countries: new Set<string>(),
        });
      }
      const item = map.get(year)!;
      item.total++;
      const medal = String(w.medal || "").toLowerCase();
      if (medal.includes("gold") || medal.includes("emas") || medal.includes("champion")) item.gold++;
      else if (medal.includes("silver") || medal.includes("perak")) item.silver++;
      else if (medal.includes("bronze") || medal.includes("perunggu")) item.bronze++;

      if (w.competition) item.competitions.add(w.competition.trim().toUpperCase());
      if (w.school && w.school !== "—") item.schools.add(w.school.trim());
      if (w.country) item.countries.add(w.country.trim());
    });

    // Urutkan tahun menurun (2026 di depan, lalu 2025, 2024, dst.)
    return Array.from(map.values())
      .filter((y) => y.total > 0)
      .sort((a, b) => b.year - a.year);
  }, [winners]);

  return (
    <section className="py-12 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary mb-3">
            <Calendar size={14} />
            <span>{isEn ? "Step 1: Select Year" : "Langkah 1: Pilih Tahun"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {isEn ? "Select Competition Year" : "Pilih Tahun Olimpiade"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isEn
              ? "Browse verified winner archives and medalists categorized by competition edition year."
              : "Telusuri arsip resmi pemenang dan medalis IYORA berdasarkan edisi tahun penyelenggaraan."}
          </p>
        </div>

        {/* Years Grid (Mulai dari 2026) */}
        {yearsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {yearsData.map((y) => {
              const isCurrent = y.year === 2026;
              const compCodes = Array.from(y.competitions);

              return (
                <div
                  key={y.year}
                  onClick={() => onSelectYear(y.year)}
                  className={clsx(
                    "group relative rounded-3xl p-6 sm:p-7 border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden",
                    isCurrent
                      ? "bg-gradient-to-br from-[#3B79A7] via-[#358EAA] to-[#2EA3AD] text-white border-white/20 shadow-xl shadow-[#3B79A7]/25 hover:shadow-2xl hover:scale-[1.02]"
                      : "bg-white text-gray-800 border-gray-200/90 shadow-md hover:shadow-xl hover:scale-[1.02]"
                  )}
                >
                  {/* Background Balloon Accent for Current Year */}
                  {isCurrent && (
                    <>
                      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/[0.08] pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                    </>
                  )}

                  <div className="relative z-10">
                    {/* Top Header: Badge & Status */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={clsx(
                            "px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border",
                            isCurrent
                              ? "bg-amber-400 text-gray-900 border-amber-300 shadow-xs"
                              : "bg-gray-100 text-gray-700 border-gray-300"
                          )}
                        >
                          {isCurrent ? (isEn ? "Current Season" : "Edisi Berjalan") : (isEn ? "Archive" : "Arsip")}
                        </span>
                        <div
                          className={clsx(
                            "flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border",
                            isCurrent
                              ? "bg-white/15 text-white border-white/25"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          )}
                        >
                          <ShieldCheck size={12} className={isCurrent ? "text-emerald-300" : "text-emerald-600"} />
                          <span>SIMT</span>
                        </div>
                      </div>
                      <span className={clsx("text-xs font-mono font-bold", isCurrent ? "text-white/80" : "text-gray-400")}>
                        {compCodes.length} {isEn ? "Events" : "Event"}
                      </span>
                    </div>

                    {/* Year Typography Display */}
                    <div className="flex items-baseline gap-2 mb-2">
                      <h3
                        className={clsx(
                          "text-4xl sm:text-5xl font-black tracking-tight",
                          isCurrent ? "text-white group-hover:text-amber-200" : "text-gray-900 group-hover:text-primary",
                          "transition-colors"
                        )}
                      >
                        {y.year}
                      </h3>
                      <span className={clsx("text-xs font-bold uppercase", isCurrent ? "text-amber-200" : "text-gray-500")}>
                        {isEn ? "Season" : "Tahun Lomba"}
                      </span>
                    </div>

                    <p className={clsx("text-xs mb-6", isCurrent ? "text-white/85" : "text-gray-500")}>
                      {isEn
                        ? `Official winner decree and medalist records for the ${y.year} Olympiad season.`
                        : `Daftar resmi penetapan medalis dan pengumuman pemenang edisi olimpiade tahun ${y.year}.`}
                    </p>

                    {/* Medal Breakdown Badges */}
                    <div
                      className={clsx(
                        "rounded-2xl p-3.5 mb-5 border",
                        isCurrent ? "bg-white/10 border-white/20 backdrop-blur-sm" : "bg-gray-50 border-gray-200"
                      )}
                    >
                      <div className="text-[11px] font-bold uppercase tracking-wider mb-2 opacity-80">
                        {isEn ? "Total Medalists" : "Total Peraih Medali"} · <span className="font-extrabold">{y.total}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
                        <span className={clsx("px-2.5 py-1 rounded-lg border", isCurrent ? "bg-amber-400/25 border-amber-300/40 text-amber-200" : "bg-amber-50 text-amber-800 border-amber-200")}>
                          🥇 {y.gold} {isEn ? "Gold" : "Emas"}
                        </span>
                        <span className={clsx("px-2.5 py-1 rounded-lg border", isCurrent ? "bg-slate-300/25 border-slate-200/40 text-slate-100" : "bg-slate-100 text-slate-700 border-slate-300")}>
                          🥈 {y.silver} {isEn ? "Silver" : "Perak"}
                        </span>
                        <span className={clsx("px-2.5 py-1 rounded-lg border", isCurrent ? "bg-amber-700/25 border-amber-600/40 text-amber-300" : "bg-orange-50 text-orange-800 border-orange-200")}>
                          🥉 {y.bronze} {isEn ? "Bronze" : "Perunggu"}
                        </span>
                      </div>
                    </div>

                    {/* Competitions in this Year */}
                    <div className="space-y-1.5 mb-6">
                      <span className={clsx("text-[11px] font-bold uppercase tracking-wider block", isCurrent ? "text-white/75" : "text-gray-400")}>
                        {isEn ? "Published Competitions:" : "Kompetisi Diterbitkan:"}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {compCodes.map((code) => (
                          <span
                            key={code}
                            className={clsx(
                              "text-xs font-bold px-2.5 py-0.5 rounded-md border",
                              isCurrent
                                ? "bg-white/20 text-white border-white/30 backdrop-blur-xs"
                                : "bg-primary/5 text-primary border-primary/20"
                            )}
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  <div
                    className={clsx(
                      "relative z-10 flex items-center justify-between pt-4 border-t",
                      isCurrent ? "border-white/20 text-white" : "border-gray-100 text-primary"
                    )}
                  >
                    <span className="text-xs font-extrabold group-hover:underline flex items-center gap-1">
                      <span>{isEn ? `Explore Events in ${y.year}` : `Buka Event Tahun ${y.year}`}</span>
                    </span>
                    <div
                      className={clsx(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1",
                        isCurrent ? "bg-white text-[#3B79A7]" : "bg-primary text-white"
                      )}
                    >
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 max-w-md mx-auto">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="font-bold text-gray-700">{isEn ? "No Winner Data Found" : "Belum Ada Data Pemenang"}</h4>
            <p className="text-xs text-gray-500 mt-1">
              {isEn ? "Winner announcements have not been published yet." : "Data pemenang belum diterbitkan ke publik."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
