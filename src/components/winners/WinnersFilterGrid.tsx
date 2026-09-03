"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Search,
  School,
  MapPin,
  CheckCircle2,
  LayoutGrid,
  List,
  RotateCcw,
  ShieldCheck,
  GraduationCap,
  Medal,
  Award,
  Trophy,
  Star,
} from "lucide-react";
import clsx from "clsx";
import {
  WinnerItem,
  WinnerMedal,
  WinnerAnnouncementDoc,
  ALL_COMPETITIONS,
  MEDAL_TABS,
} from "@/data/dummyWinners";

interface WinnersFilterGridProps {
  initialWinners: WinnerItem[];
  announcements?: WinnerAnnouncementDoc[];
}

export default function WinnersFilterGrid({
  initialWinners,
  announcements = [],
}: WinnersFilterGridProps) {
  const t = useTranslations("winners_page");
  const locale = useLocale();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompetition, setSelectedCompetition] = useState("all");
  const [selectedMedal, setSelectedMedal] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Get available competition options including any dynamic competition codes from initialWinners
  const availableCompetitions = useMemo(() => {
    const predefinedCodes = new Set(ALL_COMPETITIONS.map((c) => c.code.toUpperCase()));
    const extraFromData: { code: string; name: string }[] = [];
    initialWinners.forEach((w) => {
      const code = (w.competition || "").trim().toUpperCase();
      if (code && !predefinedCodes.has(code)) {
        predefinedCodes.add(code);
        extraFromData.push({
          code,
          name: w.competitionFullName || code,
        });
      }
    });
    return [...ALL_COMPETITIONS, ...extraFromData];
  }, [initialWinners]);

  // Filtering Logic
  const filteredWinners = useMemo(() => {
    return initialWinners.filter((winner) => {
      // Search query match
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchName = winner.name.toLowerCase().includes(q);
        const matchSchool = winner.school.toLowerCase().includes(q);
        const matchCity = winner.city.toLowerCase().includes(q);
        const matchProvince = winner.province.toLowerCase().includes(q);
        const matchComp = (winner.competition || "").toLowerCase().includes(q) || (winner.competitionFullName || "").toLowerCase().includes(q);
        const matchCert = (winner.certificateNumber || "").toLowerCase().includes(q);
        if (!matchName && !matchSchool && !matchCity && !matchProvince && !matchComp && !matchCert) {
          return false;
        }
      }

      // Competition match (individual NYGO, IYGO, NYEO, IYEO, etc.)
      if (selectedCompetition !== "all") {
        const winnerComp = (winner.competition || "").trim().toUpperCase();
        const targetComp = selectedCompetition.trim().toUpperCase();
        if (winnerComp !== targetComp && !winnerComp.startsWith(targetComp) && !targetComp.startsWith(winnerComp)) {
          return false;
        }
      }

      // Medal match (Grand Champion dialihkan ke Gold Medal)
      if (selectedMedal !== "all") {
        const effectiveMedal = (winner.medal as string) === "Grand Champion" ? "Gold Medal" : winner.medal;
        if (effectiveMedal !== selectedMedal) {
          return false;
        }
      }

      // Level match
      if (selectedLevel !== "all" && winner.level !== selectedLevel) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Urutan prioritas medali: Gold (1) -> Silver (2) -> Bronze (3) -> Honorable Mention (4) -> Lainnya
      const getMedalPriority = (medal: WinnerMedal | string): number => {
        const m = String(medal || "").toLowerCase().trim();
        if (m.includes("grand") || m.includes("gold") || m.includes("emas") || m.includes("juara 1") || m === "1") {
          return 1;
        }
        if (m.includes("silver") || m.includes("perak") || m.includes("juara 2") || m === "2") {
          return 2;
        }
        if (m.includes("bronze") || m.includes("perunggu") || m.includes("juara 3") || m === "3") {
          return 3;
        }
        if (m.includes("harapan") || m.includes("honorable") || m.includes("mention")) {
          return 4;
        }
        if (m.includes("special") || m.includes("khusus") || m.includes("award")) {
          return 5;
        }
        return 6;
      };

      const priorityA = getMedalPriority(a.medal);
      const priorityB = getMedalPriority(b.medal);

      if (priorityA !== priorityB) {
        return priorityA - priorityB; // Gold Medal (1) berada paling atas
      }

      // Jika sama-sama medali emas, urutkan berdasarkan nilai tertinggi
      const scoreA = parseFloat(a.score || "0");
      const scoreB = parseFloat(b.score || "0");
      if (!isNaN(scoreA) && !isNaN(scoreB) && scoreA !== scoreB) {
        return scoreB - scoreA;
      }

      return (a.name || "").localeCompare(b.name || "");
    });
  }, [initialWinners, searchQuery, selectedCompetition, selectedMedal, selectedLevel]);

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCompetition !== "all" ||
    selectedMedal !== "all" ||
    selectedLevel !== "all";

  function resetFilters() {
    setSearchQuery("");
    setSelectedCompetition("all");
    setSelectedMedal("all");
    setSelectedLevel("all");
  }

  const getMedalBadge = (medal: WinnerMedal | string) => {
    switch (medal) {
      case "Grand Champion":
        return {
          icon: Trophy,
          iconColor: "text-amber-200",
          label: locale === "en" ? "Grand Champion" : "Juara Umum",
          displayLabel: "GRAND CHAMPION",
          className: "bg-yellow-50 text-yellow-800 border-yellow-300 font-bold",
          blockBg: "bg-[#CF9B12] shadow-sm shadow-[#CF9B12]/25 hover:brightness-105",
          pillBg: "bg-white/15 text-white border-white/30 shadow-xs",
          tableBadgeBg: "bg-[#CF9B12] text-white",
          cardHoverClass: "hover:border-amber-300/60 hover:shadow-amber-400/20",
        };
      case "Gold Medal":
        return {
          icon: Medal,
          iconColor: "text-amber-300",
          label: locale === "en" ? "Gold Medal" : "Medali Emas",
          displayLabel: "GOLD MEDAL",
          className: "bg-yellow-50 text-yellow-800 border-yellow-300 font-bold",
          blockBg: "bg-[#CF9B12] shadow-sm shadow-[#CF9B12]/25 hover:brightness-105",
          pillBg: "bg-white/15 text-white border-white/30 shadow-xs",
          tableBadgeBg: "bg-[#CF9B12] text-white",
          cardHoverClass: "hover:border-amber-300/60 hover:shadow-amber-400/20",
        };
      case "Silver Medal":
        return {
          icon: Medal,
          iconColor: "text-slate-100",
          label: locale === "en" ? "Silver Medal" : "Medali Perak",
          displayLabel: "SILVER MEDAL",
          className: "bg-slate-100 text-slate-800 border-slate-300 font-bold",
          blockBg: "bg-[#8494A1] shadow-sm shadow-[#8494A1]/25 hover:brightness-105",
          pillBg: "bg-white/15 text-white border-white/30 shadow-xs",
          tableBadgeBg: "bg-[#8494A1] text-white",
          cardHoverClass: "hover:border-slate-200/60 hover:shadow-cyan-200/20",
        };
      case "Bronze Medal":
        return {
          icon: Medal,
          iconColor: "text-orange-200",
          label: locale === "en" ? "Bronze Medal" : "Medali Perunggu",
          displayLabel: "BRONZE MEDAL",
          className: "bg-orange-50 text-orange-800 border-orange-200 font-bold",
          blockBg: "bg-[#BA6832] shadow-sm shadow-[#BA6832]/25 hover:brightness-105",
          pillBg: "bg-white/15 text-white border-white/30 shadow-xs",
          tableBadgeBg: "bg-[#BA6832] text-white",
          cardHoverClass: "hover:border-orange-300/60 hover:shadow-orange-400/20",
        };
      case "Honorable Mention":
        return {
          icon: Award,
          iconColor: "text-purple-200",
          label: locale === "en" ? "Honorable Mention" : "Peringkat Harapan",
          displayLabel: "HONORABLE MENTION",
          className: "bg-purple-50 text-purple-800 border-purple-200 font-semibold",
          blockBg: "bg-[#7C3AED] shadow-sm shadow-[#7C3AED]/25 hover:brightness-105",
          pillBg: "bg-white/15 text-white border-white/30 shadow-xs",
          tableBadgeBg: "bg-[#7C3AED] text-white",
          cardHoverClass: "hover:border-purple-300/60 hover:shadow-purple-400/20",
        };
      default:
        return {
          icon: Star,
          iconColor: "text-teal-200",
          label: medal,
          displayLabel: String(medal || "SPECIAL AWARD").toUpperCase(),
          className: "bg-blue-50 text-blue-800 border-blue-200 font-semibold",
          blockBg: "bg-[#0D9488] shadow-sm shadow-[#0D9488]/25 hover:brightness-105",
          pillBg: "bg-white/15 text-white border-white/30 shadow-xs",
          tableBadgeBg: "bg-[#0D9488] text-white",
          cardHoverClass: "hover:border-teal-300/60 hover:shadow-teal-400/20",
        };
    }
  };

  const getCountryFlag = (code: string, country: string) => {
    switch (code) {
      case "ID": return "🇮🇩";
      case "KR": return "🇰🇷";
      case "TH": return "🇹🇭";
      case "MY": return "🇲🇾";
      case "US": return "🇺🇸";
      case "UZ": return "🇺🇿";
      default: return "🌐";
    }
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-white to-gray-50/70">
      <div className="max-w-7xl mx-auto">
        {/* Controls Container: Search & Filters */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-lg shadow-black/5 mb-8 space-y-5">
          {/* Top Row: Search Input & Dropdowns (Kompetisi & Jenjang) & View Switcher */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 justify-between">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[260px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search_placeholder")}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary focus:outline-none text-sm transition-all shadow-inner text-gray-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Dropdowns (Kompetisi Terpisah + Jenjang) & View Mode Switcher & Download SK Button */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap justify-between lg:justify-end">
              {/* Dropdown 1 Menu: Cabang / Nama Olimpiade (Terpisah NYGO, IYGO, NYEO, IYEO, dll.) */}
              <select
                value={selectedCompetition}
                onChange={(e) => setSelectedCompetition(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:border-primary cursor-pointer hover:bg-gray-100 transition-colors shadow-sm max-w-[240px]"
              >
                <option value="all">🏆 {locale === "en" ? "All Competitions" : "Semua Kompetisi"}</option>
                {availableCompetitions.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name.replace(`${c.code} - `, "").replace(`${c.code} — `, "")}
                  </option>
                ))}
              </select>

              {/* Dropdown Jenjang */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:border-primary cursor-pointer hover:bg-gray-100 transition-colors shadow-sm"
              >
                <option value="all">{t("level_all")}</option>
                <option value="SD / MI">{t("level_sd")}</option>
                <option value="SMP / MTs">{t("level_smp")}</option>
                <option value="SMA / MA / SMK">{t("level_sma")}</option>
                <option value="Universitas / Mahasiswa">{t("level_univ")}</option>
              </select>

              {/* View Mode Switcher */}
              <div className="flex items-center bg-gray-100 p-1 rounded-2xl border border-gray-200/80 shrink-0">
                <button
                  onClick={() => setViewMode("cards")}
                  className={clsx(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                    viewMode === "cards"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  )}
                  title={t("view_cards")}
                >
                  <LayoutGrid size={14} />
                  <span className="hidden sm:inline">{t("view_cards")}</span>
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={clsx(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer",
                    viewMode === "table"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  )}
                  title={t("view_table")}
                >
                  <List size={14} />
                  <span className="hidden sm:inline">{t("view_table")}</span>
                </button>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-colors cursor-pointer shrink-0"
                  title={t("reset_filter")}
                >
                  <RotateCcw size={13} />
                  <span className="hidden sm:inline">{t("reset_filter")}</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Medali Row */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
                Filter Medali:
              </span>
              <div className="flex flex-wrap gap-2">
                {MEDAL_TABS.map((tab) => {
                  const isActive = selectedMedal === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setSelectedMedal(tab.key)}
                      className={clsx(
                        "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border",
                        isActive
                          ? "bg-primary text-white border-primary shadow-md shadow-primary/25 scale-105"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <span>{tab.icon}</span>
                      <span>{t(tab.labelId)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>



        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-xs font-bold text-gray-500">
            {t("showing_results", { count: filteredWinners.length })}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Terkurasi SIMT Puspresnas RI</span>
          </div>
        </div>

        {/* CONTENT VIEW: CARDS vs TABLE */}
        {filteredWinners.length > 0 ? (
          viewMode === "cards" ? (
            /* Cards View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWinners.map((winner) => {
                const badge = getMedalBadge(winner.medal);
                const flag = getCountryFlag(winner.countryCode, winner.country);

                return (
                  <div
                    key={winner.id}
                    className={clsx(
                      "relative rounded-3xl p-5 border border-white/20 shadow-lg shadow-[#3B79A7]/20 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between group overflow-hidden bg-[#3B79A7] text-white hover:scale-[1.02]",
                      badge.cardHoverClass
                    )}
                  >
                    {/* Animated Floating Balloons / Bubbles */}
                    <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/10 pointer-events-none animate-balloon-1 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute -bottom-10 -left-6 w-28 h-28 rounded-full bg-white/[0.08] pointer-events-none animate-balloon-2 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-1/2 -right-4 w-16 h-16 rounded-full bg-white/[0.07] pointer-events-none animate-balloon-3 group-hover:scale-125 transition-transform duration-700" />
                    <div className="absolute bottom-16 left-1/3 w-8 h-8 rounded-full bg-white/[0.12] pointer-events-none animate-balloon-1 group-hover:scale-125 transition-transform duration-700" />

                    {/* Foreground Content */}
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      {/* Top Competition, Category & SIMT Badge */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-white/20 text-white border border-white/30 backdrop-blur-md shadow-xs">
                              {winner.competition} ({winner.editionYear})
                            </span>
                            {winner.category && (
                              <span className="text-[11px] font-semibold text-white/90 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20 backdrop-blur-md">
                                {winner.category}
                              </span>
                            )}
                          </div>
                          {winner.simtVerified && (
                            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-100 bg-emerald-500/25 px-2 py-0.5 rounded-md border border-emerald-300/40 backdrop-blur-md shrink-0 shadow-xs">
                              <CheckCircle2 size={12} className="text-emerald-300" />
                              <span>SIMT</span>
                            </div>
                          )}
                        </div>

                        {/* Participant Name */}
                        <h3 className="text-base font-extrabold text-white group-hover:text-amber-200 transition-colors flex items-center gap-2 mb-2 drop-shadow-xs">
                          <span>{winner.name}</span>
                          <span title={winner.country}>{flag}</span>
                        </h3>

                        {/* School & Location Info */}
                        <div className="space-y-1.5 text-xs text-white/85 mb-4">
                          <div className="flex items-start gap-2">
                            <School size={13} className="text-amber-300 mt-0.5 flex-shrink-0 drop-shadow-xs" />
                            <span className="font-semibold text-white line-clamp-1">{winner.school}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={13} className="text-teal-200/90 flex-shrink-0" />
                            <span className="line-clamp-1 text-white/80">{winner.city}, {winner.province} ({winner.country})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <GraduationCap size={13} className="text-teal-200/90 flex-shrink-0" />
                            <span className="text-white/80">{winner.level}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Medal Label: Label kecil yang menyesuaikan tema card */}
                      <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between">
                        <div
                          className={clsx(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold backdrop-blur-md border shadow-xs transition-transform group-hover:scale-105",
                            badge.pillBg
                          )}
                        >
                          <badge.icon size={13} className={clsx("shrink-0", badge.iconColor)} />
                          <span className="text-[11px] font-extrabold tracking-wider uppercase drop-shadow-xs">
                            {badge.displayLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">{locale === "en" ? "Participant" : "Peserta"}</th>
                      <th className="px-5 py-3.5">{locale === "en" ? "School / Origin" : "Sekolah / Asal"}</th>
                      <th className="px-5 py-3.5">{locale === "en" ? "Competition" : "Cabang"}</th>
                      <th className="px-5 py-3.5">{locale === "en" ? "Level" : "Jenjang"}</th>
                      <th className="px-5 py-3.5">{locale === "en" ? "Award" : "Penghargaan"}</th>
                      <th className="px-5 py-3.5 text-right">SIMT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredWinners.map((winner) => {
                      const badge = getMedalBadge(winner.medal);
                      const flag = getCountryFlag(winner.countryCode, winner.country);
                      return (
                        <tr key={winner.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="px-5 py-3.5 font-extrabold text-gray-900 flex items-center gap-2">
                            <span>{winner.name}</span>
                            <span>{flag}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="font-semibold text-gray-800">{winner.school}</div>
                            <div className="text-[10px] text-gray-400">{winner.city}, {winner.province}</div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                              {winner.competition}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-gray-600">{winner.level}</td>
                          <td className="px-5 py-3.5">
                            <span
                              className={clsx(
                                "inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold font-medal-serif tracking-wider uppercase shadow-xs",
                                badge.tableBadgeBg
                              )}
                            >
                              {badge.displayLabel}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            {winner.simtVerified ? (
                              <div className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700">
                                <CheckCircle2 size={10} />
                                <span>SIMT</span>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/90 shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-primary/40" />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-2">
              {t("empty_search_title")}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              {t("empty_search_desc")}
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary-dark shadow-md shadow-primary/20 transition-all cursor-pointer"
            >
              {t("reset_filter")}
            </button>
          </div>
        )}

        {/* SIMT Puspresnas Accreditation Box */}
        <div className="mt-16 bg-gradient-to-r from-[#1a0a2e] to-[#2d1b4e] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-teal-300 flex-shrink-0">
              <ShieldCheck size={36} />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-extrabold mb-2">
                {t("curation_notice_title")}
              </h4>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-3xl">
                {t("curation_notice_desc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
