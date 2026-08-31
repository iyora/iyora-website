"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Search,
  Filter,
  Trophy,
  Award,
  School,
  MapPin,
  CheckCircle2,
  LayoutGrid,
  List,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Building2,
  GraduationCap
} from "lucide-react";
import clsx from "clsx";
import {
  WinnerItem,
  WinnerMedal,
  OLYMPIAD_CATEGORIES,
  MEDAL_TABS,
} from "@/data/dummyWinners";

interface WinnersFilterGridProps {
  initialWinners: WinnerItem[];
}

export default function WinnersFilterGrid({ initialWinners }: WinnersFilterGridProps) {
  const t = useTranslations("winners_page");
  const locale = useLocale();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMedal, setSelectedMedal] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

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
        const matchComp = winner.competition.toLowerCase().includes(q);
        const matchCert = (winner.certificateNumber || "").toLowerCase().includes(q);
        if (!matchName && !matchSchool && !matchCity && !matchProvince && !matchComp && !matchCert) {
          return false;
        }
      }

      // Category match
      if (selectedCategory !== "all" && winner.category !== selectedCategory) {
        return false;
      }

      // Medal match
      if (selectedMedal !== "all" && winner.medal !== selectedMedal) {
        return false;
      }

      // Level match
      if (selectedLevel !== "all" && winner.level !== selectedLevel) {
        return false;
      }

      return true;
    });
  }, [initialWinners, searchQuery, selectedCategory, selectedMedal, selectedLevel]);

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "all" ||
    selectedMedal !== "all" ||
    selectedLevel !== "all";

  function resetFilters() {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedMedal("all");
    setSelectedLevel("all");
  }

  const getMedalBadge = (medal: WinnerMedal) => {
    switch (medal) {
      case "Grand Champion":
        return {
          icon: "🏆",
          label: locale === "en" ? "Grand Champion" : "Juara Umum",
          className: "bg-amber-100 text-amber-900 border-amber-300 font-extrabold",
        };
      case "Gold Medal":
        return {
          icon: "🥇",
          label: locale === "en" ? "Gold Medal" : "Medali Emas",
          className: "bg-yellow-50 text-yellow-800 border-yellow-300 font-bold",
        };
      case "Silver Medal":
        return {
          icon: "🥈",
          label: locale === "en" ? "Silver Medal" : "Medali Perak",
          className: "bg-slate-100 text-slate-800 border-slate-300 font-bold",
        };
      case "Bronze Medal":
        return {
          icon: "🥉",
          label: locale === "en" ? "Bronze Medal" : "Medali Perunggu",
          className: "bg-orange-50 text-orange-800 border-orange-200 font-bold",
        };
      case "Honorable Mention":
        return {
          icon: "🎖️",
          label: locale === "en" ? "Honorable Mention" : "Peringkat Harapan",
          className: "bg-purple-50 text-purple-800 border-purple-200 font-semibold",
        };
      default:
        return {
          icon: "⭐",
          label: medal,
          className: "bg-blue-50 text-blue-800 border-blue-200 font-semibold",
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
        {/* Controls Container: Search & View Modes */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-lg shadow-black/5 mb-8 space-y-6">
          {/* Top Row: Search Input & View Switcher */}
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="relative w-full md:w-96">
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

            {/* Level Filter Dropdown & View Mode Switcher */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3.5 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="all">{t("level_all")}</option>
                <option value="SD / MI">{t("level_sd")}</option>
                <option value="SMP / MTs">{t("level_smp")}</option>
                <option value="SMA / MA / SMK">{t("level_sma")}</option>
                <option value="Universitas / Mahasiswa">{t("level_univ")}</option>
              </select>

              <div className="flex items-center bg-gray-100 p-1 rounded-2xl border border-gray-200/80">
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
                  className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-colors cursor-pointer"
                  title={t("reset_filter")}
                >
                  <RotateCcw size={13} />
                  <span className="hidden sm:inline">{t("reset_filter")}</span>
                </button>
              )}
            </div>
          </div>

          {/* Middle Row: Medal Filter Tabs */}
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
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

          {/* Bottom Row: Category / Branch Filter Pills */}
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Cabang Olimpiade:
            </span>
            <div className="flex flex-wrap gap-2">
              {OLYMPIAD_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={clsx(
                      "px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border",
                      isActive
                        ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    {cat.shortName}
                  </button>
                );
              })}
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
                    className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                  >
                    {/* Top Competition & Medal Badge */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200">
                          {winner.competition} ({winner.editionYear})
                        </span>
                        <div className={clsx("inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full border", badge.className)}>
                          <span>{badge.icon}</span>
                          <span>{badge.label}</span>
                        </div>
                      </div>

                      {/* Participant Name */}
                      <h3 className="text-base font-extrabold text-gray-900 group-hover:text-primary transition-colors flex items-center gap-2 mb-2">
                        <span>{winner.name}</span>
                        <span title={winner.country}>{flag}</span>
                      </h3>

                      {/* School & Location Info */}
                      <div className="space-y-1.5 text-xs text-gray-600 mb-4">
                        <div className="flex items-start gap-2">
                          <School size={13} className="text-primary mt-0.5 flex-shrink-0" />
                          <span className="font-semibold text-gray-800 line-clamp-1">{winner.school}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={13} className="text-gray-400 flex-shrink-0" />
                          <span className="line-clamp-1">{winner.city}, {winner.province} ({winner.country})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap size={13} className="text-gray-400 flex-shrink-0" />
                          <span>{winner.level}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Certificate & Score */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <div>
                        {winner.score ? (
                          <div className="flex items-baseline gap-1">
                            <span className="text-[10px] text-gray-400">{t("score_label")}:</span>
                            <span className="font-extrabold text-primary">{winner.score}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-gray-400">{winner.certificateNumber}</span>
                        )}
                      </div>
                      {winner.simtVerified && (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 size={12} className="text-emerald-600" />
                          <span>SIMT</span>
                        </div>
                      )}
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
                      <th className="px-5 py-3.5">Peserta</th>
                      <th className="px-5 py-3.5">Sekolah / Asal</th>
                      <th className="px-5 py-3.5">Cabang</th>
                      <th className="px-5 py-3.5">Jenjang</th>
                      <th className="px-5 py-3.5">Penghargaan</th>
                      <th className="px-5 py-3.5 text-right">Nilai / SIMT</th>
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
                            <span className={clsx("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px]", badge.className)}>
                              <span>{badge.icon}</span>
                              <span>{badge.label}</span>
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="font-extrabold text-primary">{winner.score ? `${winner.score}` : "-"}</div>
                            {winner.simtVerified && (
                              <div className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700">
                                <CheckCircle2 size={10} />
                                <span>SIMT</span>
                              </div>
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
