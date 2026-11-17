"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  BookOpen,
  Search,
  ArrowRight,
  Globe,
  Award,
} from "lucide-react";
import type { CompetitionData } from "@/lib/supabase";
import { getValidEventRegistrationUrl, getValidEventWebsiteUrl } from "@/lib/supabase";

const CATEGORY_ICONS: Record<string, string> = {
  Biology:            "🧬",
  Physics:            "⚛️",
  Chemistry:          "🧪",
  Mathematics:        "➗",
  Geography:          "🌍",
  Economics:          "📊",
  Astronomy:          "🔭",
  Environment:        "🌱",
  Madrasah:           "🕌",
  Science:            "🏆",
  "Science and Math": "🔬",
  "Science & Math":   "🔬",
  NSO:                "🔬",
  NSMO:               "🔬",
  Biologi:            "🧬",
  Fisika:             "⚛️",
  Kimia:              "🧪",
  Matematika:         "➗",
  Geografi:           "🌍",
  Ekonomi:            "📊",
  Astronomi:          "🔭",
  Lingkungan:         "🌱",
  Sains:              "🏆",
};

function getIcon(category: string | null) {
  if (!category) return "🏆";
  if (CATEGORY_ICONS[category]) return CATEGORY_ICONS[category];
  const cleanCat = category.replace(/\s+/g, " ").trim();
  return CATEGORY_ICONS[cleanCat] ?? "🏆";
}

type LevelFilterKey = "all" | "national" | "international";
type StatusFilterKey = "all" | "open" | "coming_soon" | "closed";

function formatTimelineDate(dateStr: string | null | undefined, locale: string): string {
  if (!dateStr) return locale === "id" ? "Segera Diumumkan" : "To Be Announced";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(dateStr: string | null | undefined, locale: string): string {
  if (!dateStr) return "TBA";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDaysRemaining(closeAt: string | null | undefined): number | null {
  if (!closeAt) return null;
  const closeDate = new Date(closeAt);
  if (isNaN(closeDate.getTime())) return null;
  if (closeAt.length <= 10) closeDate.setHours(23, 59, 59, 999);
  const diffMs = closeDate.getTime() - Date.now();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return days >= 0 ? days : null;
}

interface Props {
  competitions: CompetitionData[];
}

export default function TimelineClient({ competitions }: Props) {
  const t = useTranslations("competitions_page");
  const locale = useLocale();
  const isId = locale === "id";

  const [activeStatus, setActiveStatus] = useState<StatusFilterKey>("all");
  const [activeLevel, setActiveLevel] = useState<LevelFilterKey>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const counts = useMemo(() => {
    return {
      all: competitions.length,
      open: competitions.filter((c) => c.registrationStatus === "open").length,
      coming_soon: competitions.filter((c) => c.registrationStatus === "coming_soon").length,
      closed: competitions.filter((c) => c.registrationStatus === "closed").length,
    };
  }, [competitions]);

  const statusFilters: { key: StatusFilterKey; label: string; count: number }[] = [
    { key: "all", label: isId ? "Semua Jadwal" : "All Schedules", count: counts.all },
    { key: "open", label: isId ? "Pendaftaran Dibuka" : "Open Register", count: counts.open },
    { key: "coming_soon", label: isId ? "Segera Dibuka" : "Coming Soon", count: counts.coming_soon },
    { key: "closed", label: isId ? "Selesai / Ditutup" : "Closed", count: counts.closed },
  ];

  const levelFilters: { key: LevelFilterKey; label: string }[] = [
    { key: "all", label: t("filter_all") },
    { key: "national", label: t("filter_national") },
    { key: "international", label: t("filter_international") },
  ];

  const sortedAndFiltered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = competitions.filter((c) => {
      const matchLevel =
        activeLevel === "all" ||
        (activeLevel === "international"
          ? c.level === "international" || c.level === "world"
          : c.level === activeLevel);
      const matchStatus = activeStatus === "all" || c.registrationStatus === activeStatus;
      const matchSearch =
        !q ||
        c.shortName.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        (c.category && c.category.toLowerCase().includes(q));

      return matchLevel && matchStatus && matchSearch;
    });

    const statusOrder: Record<string, number> = {
      open: 0,
      coming_soon: 1,
      closed: 2,
    };

    return [...filtered].sort((a, b) => {
      const sA = statusOrder[a.registrationStatus] ?? 99;
      const sB = statusOrder[b.registrationStatus] ?? 99;
      if (sA !== sB) return sA - sB;

      // For open events, sort by closing date ascending (nearest deadline first)
      if (a.registrationStatus === "open") {
        const closeA = a.registrationCloseAt ? new Date(a.registrationCloseAt).getTime() : Infinity;
        const closeB = b.registrationCloseAt ? new Date(b.registrationCloseAt).getTime() : Infinity;
        if (closeA !== closeB) return closeA - closeB;
      }

      // For closed events, sort by closing date descending (most recent first)
      if (a.registrationStatus === "closed") {
        const closeA = a.registrationCloseAt ? new Date(a.registrationCloseAt).getTime() : 0;
        const closeB = b.registrationCloseAt ? new Date(b.registrationCloseAt).getTime() : 0;
        if (closeA !== closeB) return closeB - closeA;
      }

      return a.shortName.localeCompare(b.shortName);
    });
  }, [competitions, activeLevel, activeStatus, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Calendar size={22} />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-gray-900">{counts.all}</div>
            <div className="text-xs text-gray-500 font-medium">
              {isId ? "Total Olimpiade" : "Total Olympiads"}
            </div>
          </div>
        </div>

        <div className="bg-emerald-50/70 rounded-2xl p-5 border border-emerald-200/70 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/30">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-emerald-700">{counts.open}</div>
            <div className="text-xs text-emerald-700/80 font-semibold">
              {isId ? "Sedang Berlangsung" : "Open Registration"}
            </div>
          </div>
        </div>

        <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200/70 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/30">
            <Clock size={22} />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-amber-700">{counts.coming_soon}</div>
            <div className="text-xs text-amber-700/80 font-semibold">
              {isId ? "Segera Dibuka" : "Coming Soon"}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-600 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-gray-700">{counts.closed}</div>
            <div className="text-xs text-gray-500 font-medium">
              {isId ? "Telah Selesai" : "Completed"}
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 md:p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Status Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200/80">
            {statusFilters.map(({ key, label, count }) => {
              const isActive = activeStatus === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveStatus(key)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? key === "open"
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-700/20"
                        : key === "coming_soon"
                          ? "bg-purple-700 text-white shadow-md shadow-purple-800/20"
                          : key === "closed"
                            ? "bg-gray-700 text-white shadow-md shadow-gray-700/20"
                            : "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                  }`}
                >
                  {key === "open" && <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />}
                  {key === "coming_soon" && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                  {key === "closed" && <span className="w-2 h-2 rounded-full bg-gray-400" />}
                  <span>{label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isId ? "Cari nama olimpiade atau bidang..." : "Search olympiad or subject..."}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>

        {/* Level Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 mr-1">
              {isId ? "Tingkat:" : "Level:"}
            </span>
            {levelFilters.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveLevel(key)}
                className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all duration-200 cursor-pointer ${
                  activeLevel === key
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "bg-gray-50 text-gray-500 hover:text-gray-800 hover:bg-gray-100 border border-gray-200/70"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <Link
            href={`/${locale}/competitions`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <span>{isId ? "Lihat Tampilan Kartu Kompetisi" : "View Competition Cards Grid"}</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Empty State */}
      {sortedAndFiltered.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="text-5xl mb-4">📅</div>
          <p className="font-semibold text-gray-600 mb-2">{t("no_results")}</p>
          <button
            onClick={() => {
              setActiveLevel("all");
              setActiveStatus("all");
              setSearchQuery("");
            }}
            className="text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            {isId ? "Reset Filter" : "Reset Filters"}
          </button>
        </div>
      ) : (
        /* Timeline List */
        <div className="relative pl-6 md:pl-10 before:content-[''] before:absolute before:top-4 before:bottom-4 before:left-[11px] md:before:left-[19px] before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-primary/40 before:to-gray-200 space-y-6">
          {sortedAndFiltered.map((comp) => {
            const isOpen = comp.registrationStatus === "open";
            const isComing = comp.registrationStatus === "coming_soon";
            const regUrl = getValidEventRegistrationUrl(comp.slug, comp.registrationUrl, comp.websiteUrl);
            const webUrl = getValidEventWebsiteUrl(comp.slug, comp.websiteUrl);
            const daysLeft = isOpen ? getDaysRemaining(comp.registrationCloseAt) : null;
            const hasDates = Boolean(comp.registrationOpenAt || comp.registrationCloseAt);

            return (
              <div key={comp.slug} className="relative group">
                {/* Timeline Node Dot */}
                <div
                  className={`absolute -left-6 md:-left-10 top-6 w-6 h-6 md:w-10 md:h-10 rounded-full flex items-center justify-center border-4 border-white shadow-md z-10 transition-transform duration-300 group-hover:scale-110 ${
                    isOpen
                      ? "bg-emerald-500 text-white shadow-emerald-500/30"
                      : isComing
                        ? "bg-amber-500 text-white shadow-amber-500/30"
                        : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {isOpen ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  ) : isComing ? (
                    <Clock size={14} />
                  ) : (
                    <CheckCircle2 size={14} />
                  )}
                </div>

                {/* Timeline Card */}
                <div
                  className={`rounded-2xl p-6 transition-all duration-300 border ${
                    isOpen
                      ? "bg-gradient-to-br from-[#1b0d30] via-[#10192b] to-[#0a2026] text-white border-purple-400/30 shadow-xl shadow-purple-950/20 hover:border-teal-400/50"
                      : isComing
                        ? "bg-white border-purple-200/80 shadow-md shadow-purple-900/5 hover:border-primary/40 hover:shadow-lg"
                        : "bg-white border-gray-200/80 shadow-xs hover:border-gray-300"
                  }`}
                >
                  {/* Top Row: Period Badge & Status Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                          isOpen
                            ? "bg-white/10 text-teal-200 border border-teal-400/30"
                            : isComing
                              ? "bg-purple-50 text-primary border border-purple-200"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Calendar size={13} />
                        {hasDates && (isOpen || comp.registrationStatus === "closed")
                          ? `${formatShortDate(comp.registrationOpenAt, locale)} – ${formatShortDate(comp.registrationCloseAt, locale)}`
                          : isId
                            ? "Jadwal Segera Diumumkan"
                            : "Schedule To Be Announced"}
                      </span>

                      {daysLeft !== null && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/40">
                          ⏳{" "}
                          {daysLeft === 0
                            ? isId
                              ? "Hari Terakhir Pendaftaran!"
                              : "Last Day to Register!"
                            : isId
                              ? `${daysLeft} hari tersisa`
                              : `${daysLeft} days left`}
                        </span>
                      )}
                    </div>

                    {/* Status Pill */}
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                        isOpen
                          ? "bg-emerald-400/20 text-emerald-200 border border-emerald-300/40"
                          : isComing
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isOpen
                            ? "bg-emerald-300 animate-pulse"
                            : isComing
                              ? "bg-amber-500"
                              : "bg-gray-400"
                        }`}
                      />
                      {isOpen
                        ? isId
                          ? "Pendaftaran Dibuka"
                          : "Registration Open"
                        : isComing
                          ? isId
                            ? "Segera Dibuka"
                            : "Coming Soon"
                          : isId
                            ? "Pendaftaran Ditutup"
                            : "Registration Closed"}
                    </span>
                  </div>

                  {/* Main Content Row */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      {comp.logoUrl ? (
                        <div className="h-14 w-14 sm:w-20 flex-shrink-0 flex items-center justify-center rounded-xl bg-white/10 p-1.5">
                          <img
                            src={comp.logoUrl}
                            alt={comp.shortName}
                            className="max-h-full max-w-full object-contain drop-shadow-sm"
                          />
                        </div>
                      ) : (
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${
                            isOpen ? "bg-white/10" : "bg-primary/5"
                          }`}
                        >
                          {getIcon(comp.category)}
                        </div>
                      )}

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3
                            className={`text-xl font-extrabold ${
                              isOpen ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {comp.shortName}
                          </h3>

                          <span
                            className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              isOpen
                                ? "bg-gradient-to-r from-[#66449b]/60 to-[#39bcbe]/40 text-white border border-[#39bcbe]/50"
                                : comp.level === "international" || comp.level === "world"
                                  ? "bg-primary/10 text-primary border border-primary/25"
                                  : "bg-teal/10 text-teal border border-teal/25"
                            }`}
                          >
                            {comp.level === "international" || comp.level === "world" ? (
                              <Globe size={11} />
                            ) : (
                              <Award size={11} />
                            )}
                            {t(`filter_${comp.level}` as Parameters<typeof t>[0])}
                          </span>

                          {comp.category && (
                            <span
                              className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
                                isOpen
                                  ? "bg-white/10 text-white/80"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {comp.category}
                            </span>
                          )}
                        </div>

                        <p
                          className={`text-sm sm:text-base font-medium ${
                            isOpen ? "text-white/90" : "text-gray-600"
                          }`}
                        >
                          {comp.name}
                        </p>
                      </div>
                    </div>

                    {/* Timeline Milestones Box */}
                    <div
                      className={`grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl text-xs min-w-[280px] ${
                        isOpen
                          ? "bg-white/10 border border-white/15 backdrop-blur-xs"
                          : "bg-gray-50 border border-gray-100"
                      }`}
                    >
                      <div>
                        <div
                          className={`font-semibold mb-0.5 ${
                            isOpen ? "text-white/60" : "text-gray-400"
                          }`}
                        >
                          {isId ? "Pembukaan Pendaftaran" : "Registration Opens"}
                        </div>
                        <div
                          className={`font-bold ${
                            isOpen ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {isComing
                            ? isId
                              ? "Segera Diumumkan"
                              : "To Be Announced"
                            : formatTimelineDate(comp.registrationOpenAt, locale)}
                        </div>
                      </div>

                      <div>
                        <div
                          className={`font-semibold mb-0.5 ${
                            isOpen ? "text-white/60" : "text-gray-400"
                          }`}
                        >
                          {isId ? "Penutupan Pendaftaran" : "Registration Closes"}
                        </div>
                        <div
                          className={`font-bold ${
                            isOpen ? "text-emerald-300" : "text-gray-800"
                          }`}
                        >
                          {isComing
                            ? isId
                              ? "Segera Diumumkan"
                              : "To Be Announced"
                            : formatTimelineDate(comp.registrationCloseAt, locale)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Footer */}
                  {(isOpen || comp.guidebookUrl || webUrl) && (
                    <div
                      className={`mt-5 pt-4 border-t flex flex-wrap items-center justify-end gap-2.5 ${
                        isOpen ? "border-white/10" : "border-gray-100"
                      }`}
                    >
                      {comp.guidebookUrl && (
                        <a
                          href={comp.guidebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            isOpen
                              ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          <BookOpen size={14} />
                          {isId ? "Buku Panduan" : "Guidebook"}
                        </a>
                      )}

                      {webUrl && (
                        <a
                          href={webUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            isOpen
                              ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                              : "bg-primary/10 text-primary hover:bg-primary/15"
                          }`}
                        >
                          <ExternalLink size={14} />
                          {isId ? "Website Event" : "Event Website"}
                        </a>
                      )}

                      {isOpen && (
                        <a
                          href={regUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-white text-[#1a0f30] hover:bg-white/95 hover:text-[#66449b] shadow-md transition-all"
                        >
                          {isId ? "Daftar Sekarang →" : "Register Now →"}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
