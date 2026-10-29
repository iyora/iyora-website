"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";
import {
  Trophy,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  FileText,
  School,
  Globe2,
  Users,
  Award,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";
import type { WinnerItem, WinnerAnnouncementDoc } from "@/data/dummyWinners";

interface WinnersEventCardsProps {
  year: number;
  winners: WinnerItem[];
  announcements?: WinnerAnnouncementDoc[];
  onSelectEvent: (competitionCode: string) => void;
  onBackToYears: () => void;
}

export default function WinnersEventCards({
  year,
  winners,
  announcements = [],
  onSelectEvent,
  onBackToYears,
}: WinnersEventCardsProps) {
  const locale = useLocale();
  const isEn = locale === "en";

  // Filter pemenang sesuai tahun terpilih, lalu kelompokkan per event
  const eventsData = useMemo(() => {
    const yearWinners = winners.filter((w) => Number(w.editionYear || 2026) === year);

    const map = new Map<string, {
      code: string;
      fullName: string;
      total: number;
      gold: number;
      silver: number;
      bronze: number;
      categories: Set<string>;
      schools: Set<string>;
      countries: Set<string>;
      sampleWinner: WinnerItem;
    }>();

    yearWinners.forEach((w) => {
      const code = (w.competition || "").trim().toUpperCase();
      if (!code) return;

      if (!map.has(code)) {
        map.set(code, {
          code,
          fullName: w.competitionFullName || code,
          total: 0,
          gold: 0,
          silver: 0,
          bronze: 0,
          categories: new Set<string>(),
          schools: new Set<string>(),
          countries: new Set<string>(),
          sampleWinner: w,
        });
      }

      const item = map.get(code)!;
      item.total++;
      const medal = String(w.medal || "").toLowerCase();
      if (medal.includes("gold") || medal.includes("emas") || medal.includes("champion")) item.gold++;
      else if (medal.includes("silver") || medal.includes("perak")) item.silver++;
      else if (medal.includes("bronze") || medal.includes("perunggu")) item.bronze++;

      if (w.category && w.category !== "General") item.categories.add(w.category.trim());
      if (w.school && w.school !== "—") item.schools.add(w.school.trim());
      if (w.country) item.countries.add(w.country.trim());
    });

    // Urutkan event berdasarkan jumlah pemenang terbanyak (misal NSO 134, IYGO 55, dsb.)
    return Array.from(map.values())
      .filter((e) => e.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [winners, year]);

  return (
    <section className="py-12 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Navigation Breadcrumb Back to Years */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <button
            onClick={onBackToYears}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-gray-200 text-xs font-extrabold text-gray-700 hover:text-primary hover:border-primary shadow-xs hover:bg-gray-50 transition-all cursor-pointer group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            <span>{isEn ? "← Back to Years Selection" : "← Kembali ke Pilihan Tahun"}</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
            <Trophy size={13} />
            <span>{isEn ? `Step 2: Choose Event in ${year}` : `Langkah 2: Pilih Event Tahun ${year}`}</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {isEn ? `Olympiad Events in Season ${year}` : `Daftar Event Olimpiade Tahun ${year}`}
          </h2>
          <p className="mt-1.5 text-sm text-gray-600 max-w-2xl">
            {isEn
              ? `Select an event to explore the verified winner list, search participants, and download official decrees.`
              : `Pilih salah satu event olimpiade di bawah ini untuk melihat daftar medalis resmi, pencarian peserta, dan unduh SK pemenang.`}
          </p>
        </div>

        {/* Events Grid (Hanya yang memiliki pemenang terbit) */}
        {eventsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {eventsData.map((e) => {
              const isIntl =
                e.code.startsWith("I") ||
                e.fullName.toLowerCase().includes("international") ||
                Array.from(e.countries).some((c) => c.toLowerCase() !== "indonesia");

              // Cari dokumen SK Pemenang yang cocok jika ada
              const skDoc = announcements.find(
                (a) =>
                  a.competition.toUpperCase() === e.code &&
                  (a.edition.includes(String(year)) || a.title.includes(String(year)))
              );

              const catList = Array.from(e.categories);

              return (
                <div
                  key={e.code}
                  className="group relative rounded-3xl p-6 sm:p-7 bg-white border border-gray-200/90 shadow-md hover:shadow-2xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:scale-[1.015]"
                >
                  {/* Subtle top color banner */}
                  <div
                    className={clsx(
                      "absolute top-0 left-0 right-0 h-2 bg-gradient-to-r",
                      isIntl
                        ? "from-amber-400 via-orange-500 to-primary"
                        : "from-[#3B79A7] via-[#358EAA] to-[#2EA3AD]"
                    )}
                  />

                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-4 pt-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={clsx(
                            "text-xs font-black px-2.5 py-1 rounded-xl uppercase tracking-wider border shadow-xs",
                            isIntl
                              ? "bg-amber-50 text-amber-900 border-amber-300"
                              : "bg-blue-50 text-blue-900 border-blue-200"
                          )}
                        >
                          {e.code}
                        </span>
                        <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                          {isIntl ? (isEn ? "International" : "Internasional") : (isEn ? "National" : "Nasional")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <ShieldCheck size={12} className="text-emerald-600" />
                        <span>SIMT</span>
                      </div>
                    </div>

                    {/* Competition Name */}
                    <h3
                      onClick={() => onSelectEvent(e.code)}
                      className="text-lg sm:text-xl font-extrabold text-gray-900 group-hover:text-primary transition-colors cursor-pointer mb-2.5 leading-snug"
                    >
                      {e.fullName.replace(`${e.code} - `, "").replace(`${e.code} — `, "")}
                    </h3>

                    {/* Total Medalists Badge */}
                    <div className="flex items-baseline gap-2 mb-4 bg-primary/5 border border-primary/15 rounded-2xl p-3">
                      <span className="text-2xl font-black text-primary tabular-nums">
                        {e.total}
                      </span>
                      <span className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                        {isEn ? "Medalists Announced" : "Peserta Peraih Medali"}
                      </span>
                    </div>

                    {/* Medals Breakdown */}
                    <div className="grid grid-cols-3 gap-2 mb-5 text-center">
                      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-2">
                        <span className="text-base font-black text-amber-800 block">{e.gold}</span>
                        <span className="text-[10px] font-bold text-amber-700">🥇 {isEn ? "Gold" : "Emas"}</span>
                      </div>
                      <div className="bg-slate-100/80 border border-slate-300 rounded-xl p-2">
                        <span className="text-base font-black text-slate-800 block">{e.silver}</span>
                        <span className="text-[10px] font-bold text-slate-600">🥈 {isEn ? "Silver" : "Perak"}</span>
                      </div>
                      <div className="bg-orange-50/80 border border-orange-200 rounded-xl p-2">
                        <span className="text-base font-black text-orange-900 block">{e.bronze}</span>
                        <span className="text-[10px] font-bold text-orange-800">🥉 {isEn ? "Bronze" : "Perunggu"}</span>
                      </div>
                    </div>

                    {/* Bidang / Field Badges */}
                    {catList.length > 0 && (
                      <div className="space-y-1 mb-6">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          {isEn ? "Fields in this Event:" : "Bidang dalam Event ini:"}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {catList.map((cat) => (
                            <span
                              key={cat}
                              className="text-[11px] font-semibold text-gray-700 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <button
                      onClick={() => onSelectEvent(e.code)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-extrabold shadow-sm shadow-primary/25 transition-all cursor-pointer group-hover:scale-[1.01]"
                    >
                      <span>{isEn ? "View Winners List" : "Lihat Daftar Pemenang"}</span>
                      <ChevronRight size={15} />
                    </button>

                    {skDoc?.downloadUrl && skDoc.downloadUrl !== "#" && (
                      <a
                        href={skDoc.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-[11px] font-bold text-gray-600 border border-gray-200 transition-colors"
                      >
                        <FileText size={12} className="text-gray-400" />
                        <span>{isEn ? "Download Official SK (PDF)" : "Unduh SK Pemenang Resmi"}</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 max-w-md mx-auto">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="font-bold text-gray-700">
              {isEn ? `No Events Found for ${year}` : `Belum Ada Event di Tahun ${year}`}
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              {isEn
                ? "There are no published winner records in this edition."
                : "Belum ada penetapan data pemenang yang diterbitkan untuk tahun ini."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

