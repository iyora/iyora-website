"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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
  GraduationCap,
  Download,
  FileText,
  FileCheck2,
  ArrowRight,
} from "lucide-react";
import clsx from "clsx";
import {
  WinnerItem,
  WinnerMedal,
  WinnerAnnouncementDoc,
  MANUAL_SK_DRIVE_LINKS,
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
  const [downloadingComp, setDownloadingComp] = useState<string | null>(null);

  // Match SK announcement document based on selected competition
  const currentAnnouncement = useMemo(() => {
    if (selectedCompetition === "all") {
      return announcements.length > 0 ? announcements[0] : null;
    }
    const targetComp = selectedCompetition.trim().toUpperCase();
    return (
      announcements.find(
        (a) => a.competition.trim().toUpperCase() === targetComp
      ) || null
    );
  }, [announcements, selectedCompetition]);

  // Direct download handler for official SK decree PDF
  const handleDirectDownloadSK = (compCode?: string) => {
    const targetComp = (compCode || selectedCompetition || "all").trim().toUpperCase();
    const doc =
      targetComp === "ALL"
        ? announcements.length > 0 ? announcements[0] : null
        : announcements.find(
            (a) => a.competition.trim().toUpperCase() === targetComp
          );

    setDownloadingComp(targetComp);

    try {
      const finalComp = targetComp !== "ALL" ? targetComp : (doc?.competition || "IYORA");
      const compName = doc?.competitionFullName || (targetComp !== "ALL" ? `${targetComp} Olympiad` : "IYORA Science Olympiad");
      const skNumber = doc?.skNumber || `SK.${finalComp}/PEM/2026/09.01`;
      const rawUrl = doc?.downloadUrl || MANUAL_SK_DRIVE_LINKS[finalComp] || MANUAL_SK_DRIVE_LINKS.ALL || "";
      const filename = `SK_Pemenang_${finalComp}_2026.pdf`;

      // 1. If it's a local static file (e.g. /sk/nygi-sk.pdf or public/sk/nygi-sk.pdf)
      if (rawUrl && !rawUrl.startsWith("http") && !rawUrl.includes("#")) {
        let cleanPath = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
        if (cleanPath.startsWith("/public/")) {
          cleanPath = cleanPath.slice("/public".length);
        }
        const link = document.createElement("a");
        link.href = cleanPath;
        link.setAttribute("download", filename);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // 2. If it's a Google Drive link
      if (rawUrl && rawUrl.includes("drive.google.com")) {
        const match =
          rawUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
          rawUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        const gdriveUrl =
          match && match[1]
            ? `https://drive.google.com/uc?export=download&id=${match[1]}`
            : rawUrl;
        window.open(gdriveUrl, "_blank");
        return;
      }

      // 3. If it's an external URL
      if (rawUrl && rawUrl.startsWith("http") && !rawUrl.includes("#")) {
        window.open(rawUrl, "_blank");
        return;
      }

      // 4. Fallback: Generated PDF via API Route
      const apiDownloadUrl = `/api/download-sk?comp=${encodeURIComponent(finalComp)}&compName=${encodeURIComponent(compName)}&skNumber=${encodeURIComponent(skNumber)}&filename=${encodeURIComponent(filename)}`;

      const link = document.createElement("a");
      link.href = apiDownloadUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download SK:", err);
    } finally {
      setTimeout(() => {
        setDownloadingComp(null);
      }, 1500);
    }
  };

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
      case "Gold Medal":
        return {
          icon: "🥇",
          label: locale === "en" ? "Gold Medal" : "Medali Emas",
          className: "bg-yellow-50 text-yellow-800 border-yellow-300 font-bold",
          bottomTabClass: "bg-gradient-to-r from-amber-100 via-amber-50 to-yellow-100 border-amber-300 text-amber-950",
          scoreClass: "text-amber-900",
          cardBorderClass: "hover:border-amber-400/70",
        };
      case "Silver Medal":
        return {
          icon: "🥈",
          label: locale === "en" ? "Silver Medal" : "Medali Perak",
          className: "bg-slate-100 text-slate-800 border-slate-300 font-bold",
          bottomTabClass: "bg-gradient-to-r from-slate-100 via-gray-50 to-slate-100 border-slate-300 text-slate-900",
          scoreClass: "text-slate-800",
          cardBorderClass: "hover:border-slate-400/70",
        };
      case "Bronze Medal":
        return {
          icon: "🥉",
          label: locale === "en" ? "Bronze Medal" : "Medali Perunggu",
          className: "bg-orange-50 text-orange-800 border-orange-200 font-bold",
          bottomTabClass: "bg-gradient-to-r from-orange-100 via-amber-50/50 to-orange-100 border-orange-300 text-orange-950",
          scoreClass: "text-orange-900",
          cardBorderClass: "hover:border-orange-400/70",
        };
      case "Honorable Mention":
        return {
          icon: "🎖️",
          label: locale === "en" ? "Honorable Mention" : "Peringkat Harapan",
          className: "bg-purple-50 text-purple-800 border-purple-200 font-semibold",
          bottomTabClass: "bg-gradient-to-r from-purple-100 via-purple-50 to-purple-100 border-purple-200 text-purple-950",
          scoreClass: "text-purple-900",
          cardBorderClass: "hover:border-purple-400/70",
        };
      default:
        return {
          icon: "⭐",
          label: medal,
          className: "bg-blue-50 text-blue-800 border-blue-200 font-semibold",
          bottomTabClass: "bg-gradient-to-r from-blue-50 via-sky-50 to-blue-50 border-blue-200 text-blue-950",
          scoreClass: "text-blue-900",
          cardBorderClass: "hover:border-blue-400/70",
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

        {/* Dynamic SK Decree Banner when a competition is selected */}
        {selectedCompetition !== "all" && (
          <div className="mb-8 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f283d] rounded-3xl p-5 sm:p-6 text-white border border-teal-500/25 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="absolute right-0 top-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0">
                <FileText size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    SK Resmi {selectedCompetition}
                  </span>
                  <span className="text-[11px] text-teal-200/80 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    No: {currentAnnouncement?.skNumber || `SK.${selectedCompetition}/PEM/2026/09.01`}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    ✓ Terverifikasi SIMT
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-white">
                  {locale === "en"
                    ? `Official Decree of Winners & Medalists — ${selectedCompetition}`
                    : `Surat Keputusan (SK) Penetapan Pemenang & Medalis — ${selectedCompetition}`}
                </h4>
                <p className="text-xs text-gray-300 mt-0.5">
                  {currentAnnouncement
                    ? (locale === "en" ? currentAnnouncement.title_en : currentAnnouncement.title)
                    : (locale === "en"
                        ? "Download the authenticated decree document of awardees and medalists."
                        : "Dokumen penetapan pemenang resmi yang telah disahkan Dewan Juri & Direksi IYORA.")}
                </p>
              </div>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto shrink-0">
              <button
                onClick={() => handleDirectDownloadSK(selectedCompetition)}
                disabled={downloadingComp === selectedCompetition}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/25 transition-all cursor-pointer active:scale-95 disabled:opacity-75"
              >
                {downloadingComp === selectedCompetition ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download size={15} />
                )}
                <span>
                  {downloadingComp === selectedCompetition
                    ? (locale === "en" ? "Downloading SK..." : "Mengunduh SK...")
                    : (locale === "en" ? `Download SK ${selectedCompetition} (PDF)` : `Unduh SK ${selectedCompetition} (PDF)`)}
                </span>
              </button>
              <Link
                href={`/${locale}/sk`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"
              >
                <span>{locale === "en" ? "All SK Decrees" : "Semua SK"}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )}

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
                      "bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden",
                      badge.cardBorderClass
                    )}
                  >
                    {/* Top Competition Code & Edition */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200">
                          {winner.competition} ({winner.editionYear})
                        </span>
                        <span className="text-[11px] font-bold text-gray-400">
                          {winner.editionName || `${winner.competition} ${winner.editionYear}`}
                        </span>
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

                    {/* Card Footer: Tab Bawah Sesuai Warna Medali yang Didapat */}
                    <div
                      className={clsx(
                        "mt-4 -mx-5 -mb-5 px-5 py-3 border-t flex items-center justify-between text-xs rounded-b-2xl transition-colors",
                        badge.bottomTabClass
                      )}
                    >
                      <div className="flex items-center gap-1.5 font-extrabold tracking-tight">
                        <span className="text-sm">{badge.icon}</span>
                        <span className="text-xs font-black">{badge.label}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        {winner.score ? (
                          <div className="flex items-baseline gap-1">
                            <span className="text-[10px] opacity-75 font-semibold">{t("score_label")}:</span>
                            <span className={clsx("font-extrabold text-sm", badge.scoreClass)}>{winner.score}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono opacity-80">{winner.certificateNumber}</span>
                        )}
                        {winner.simtVerified && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-white/95 px-2 py-0.5 rounded-md border border-emerald-300 shadow-sm">
                            <CheckCircle2 size={11} className="text-emerald-600" />
                            <span>SIMT</span>
                          </div>
                        )}
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
