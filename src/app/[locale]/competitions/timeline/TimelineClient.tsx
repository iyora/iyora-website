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
type StatusFilterKey = "open" | "coming_soon" | "closed";

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

  const [activeStatus, setActiveStatus] = useState<StatusFilterKey>("open");
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
      const matchStatus = c.registrationStatus === activeStatus;
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
        <div className="bg-white rounded-2xl p-5 border border-primary/15 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Calendar size={22} />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-primary">{counts.all}</div>
            <div className="text-xs text-gray-500 font-medium">
              {isId ? "Total Olimpiade" : "Total Olympiads"}
            </div>
          </div>
        </div>

        <div className="bg-teal/5 rounded-2xl p-5 border border-teal/25 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal text-white flex items-center justify-center shrink-0 shadow-sm shadow-teal/30">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-teal-dark">{counts.open}</div>
            <div className="text-xs text-teal-dark/80 font-semibold">
              {isId ? "Sedang Berlangsung" : "Open Registration"}
            </div>
          </div>
        </div>

        <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-sm shadow-primary/30">
            <Clock size={22} />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-primary">{counts.coming_soon}</div>
            <div className="text-xs text-primary/80 font-semibold">
              {isId ? "Segera Dibuka" : "Coming Soon"}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-500 text-white flex items-center justify-center shrink-0">
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
      <div className="bg-white rounded-3xl border border-primary/15 shadow-sm p-5 md:p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Status Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200/80">
            {statusFilters.map(({ key, label, count }) => {
              const isActive = activeStatus === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveStatus(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? key === "open"
                        ? "gradient-hero text-white shadow-md shadow-primary/20"
                        : key === "coming_soon"
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "bg-gray-600 text-white shadow-md shadow-gray-600/20"
                      : "text-gray-600 hover:text-primary hover:bg-white/80"
                  }`}
                >
                  {key === "open" && (
                    <span
                      className={`w-2 h-2 rounded-full animate-pulse ${
                        isActive ? "bg-white" : "bg-teal"
                      }`}
                    />
                  )}
                  {key === "coming_soon" && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive ? "bg-amber-300" : "bg-accent"
                      }`}
                    />
                  )}
                  {key === "closed" && <span className="w-2 h-2 rounded-full bg-gray-400" />}
                  <span>{label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? "bg-white/25 text-white" : "bg-gray-200 text-gray-700"
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
                    ? "bg-primary text-white shadow-xs shadow-primary/20"
                    : "bg-gray-50 text-gray-600 hover:text-primary hover:bg-primary/5 border border-gray-200/80"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <Link
            href={`/${locale}/competitions`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark hover:underline"
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
              setActiveStatus("open");
              setSearchQuery("");
            }}
            className="text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            {isId ? "Reset Filter" : "Reset Filters"}
          </button>
        </div>
      ) : (
        /* Timeline List */
        <div className="relative pl-6 md:pl-10 before:content-[''] before:absolute before:top-4 before:bottom-4 before:left-[11px] md:before:left-[19px] before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-teal before:to-primary/20 space-y-6">
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
                      ? "gradient-hero text-white shadow-primary/30"
                      : isComing
                        ? "bg-primary text-white shadow-primary/25"
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

                {/* Timeline Card - Clean Theme Styling */}
                <div
                  className={`relative rounded-2xl overflow-hidden bg-white p-6 transition-all duration-300 border ${
                    isOpen
                      ? "border-primary/25 shadow-lg shadow-primary/8 hover:border-teal hover:shadow-xl hover:shadow-primary/12"
                      : isComing
                        ? "border-primary/20 shadow-md shadow-primary/5 hover:border-primary/40 hover:shadow-lg"
                        : "border-gray-200/80 shadow-xs hover:border-gray-300"
                  }`}
                >
                  {/* Top Theme Gradient Accent Bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 ${
                      isOpen
                        ? "gradient-hero"
                        : isComing
                          ? "bg-gradient-to-r from-primary to-primary-light"
                          : "bg-gray-200"
                    }`}
                  />

                  {/* Top Row: Period Badge & Status Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-5 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                          isOpen
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : isComing
                              ? "bg-primary/8 text-primary border border-primary/15"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        <Calendar size={13} className={isOpen || isComing ? "text-primary" : "text-gray-500"} />
                        {hasDates && (isOpen || comp.registrationStatus === "closed")
                          ? `${formatShortDate(comp.registrationOpenAt, locale)} – ${formatShortDate(comp.registrationCloseAt, locale)}`
                          : isId
                            ? "Jadwal Segera Diumumkan"
                            : "Schedule To Be Announced"}
                      </span>

                      {daysLeft !== null && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-accent/15 text-accent-dark border border-accent/30">
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
                          ? "bg-teal/15 text-teal-dark border border-teal/30"
                          : isComing
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isOpen
                            ? "bg-teal animate-pulse"
                            : isComing
                              ? "bg-primary"
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
                        <div className="h-14 w-16 sm:w-20 flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/5 to-teal/10 border border-primary/10 p-2">
                          <img
                            src={comp.logoUrl}
                            alt={comp.shortName}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 bg-gradient-to-br from-primary/10 to-teal/10 border border-primary/15">
                          {getIcon(comp.category)}
                        </div>
                      )}

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-xl font-extrabold text-primary">
                            {comp.shortName}
                          </h3>

                          <span
                            className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              comp.level === "international" || comp.level === "world"
                                ? "bg-primary/10 text-primary border border-primary/25"
                                : "bg-teal/10 text-teal-dark border border-teal/30"
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
                            <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-gray-100 text-gray-600 border border-gray-200/80">
                              {comp.category}
                            </span>
                          )}
                        </div>

                        <p className="text-sm sm:text-base font-medium text-gray-600">
                          {comp.name}
                        </p>
                      </div>
                    </div>

                    {/* Timeline Milestones Box */}
                    <div
                      className={`grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl text-xs min-w-[280px] ${
                        isOpen
                          ? "bg-gradient-to-r from-primary/5 to-teal/10 border border-primary/15"
                          : "bg-gray-50 border border-gray-100"
                      }`}
                    >
                      <div>
                        <div className="font-semibold mb-0.5 text-gray-500">
                          {isId ? "Pembukaan Pendaftaran" : "Registration Opens"}
                        </div>
                        <div className="font-bold text-gray-900">
                          {isComing
                            ? isId
                              ? "Segera Diumumkan"
                              : "To Be Announced"
                            : formatTimelineDate(comp.registrationOpenAt, locale)}
                        </div>
                      </div>

                      <div>
                        <div className="font-semibold mb-0.5 text-gray-500">
                          {isId ? "Penutupan Pendaftaran" : "Registration Closes"}
                        </div>
                        <div
                          className={`font-bold ${
                            isOpen ? "text-primary" : "text-gray-900"
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

                  {/* Detailed Event Timeline Milestones from Dashboard */}
                  {comp.timeline && comp.timeline.length > 0 && (() => {
                    const sortByDateAndTime = (
                      a: NonNullable<typeof comp.timeline>[number],
                      b: NonNullable<typeof comp.timeline>[number]
                    ) =>
                      (a.tanggal || "").localeCompare(b.tanggal || "") ||
                      (a.jam_mulai || "").localeCompare(b.jam_mulai || "");

                    const onlineItems = comp.timeline
                      .filter((m) => (m.jalur || "").toLowerCase() === "online")
                      .sort(sortByDateAndTime);
                    const offlineItems = comp.timeline
                      .filter((m) => (m.jalur || "").toLowerCase() === "offline")
                      .sort(sortByDateAndTime);
                    const generalItems = comp.timeline
                      .filter((m) => {
                        const j = (m.jalur || "").toLowerCase();
                        return j !== "online" && j !== "offline";
                      })
                      .sort(sortByDateAndTime);

                    const renderMilestoneCard = (
                      m: NonNullable<typeof comp.timeline>[number],
                      idx: number
                    ) => {
                      const isOfflineItem = (m.jalur || "").toLowerCase() === "offline";
                      return (
                        <div
                          key={`${m.milestone}-${m.tanggal}-${m.jalur || ""}-${idx}`}
                          className={`p-3.5 rounded-xl border flex flex-col justify-between gap-1.5 transition-all ${
                            isOfflineItem
                              ? "bg-gradient-to-br from-amber-50/60 to-orange-50/40 border-accent/25"
                              : "bg-gradient-to-br from-primary/[0.04] to-teal/[0.06] border-primary/15"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-gray-900 leading-snug">
                              {m.milestone}
                            </span>
                            {m.jalur && (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                                  isOfflineItem
                                    ? "bg-accent/15 text-accent-dark border border-accent/30"
                                    : "bg-teal/15 text-teal-dark border border-teal/30"
                                }`}
                              >
                                {m.jalur}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-semibold text-primary">
                            📅 {formatShortDate(m.tanggal, locale)}
                            {m.jam_mulai
                              ? ` · ${m.jam_mulai}${m.jam_selesai ? `–${m.jam_selesai}` : ""}`
                              : ""}
                          </div>
                          {m.lokasi && (
                            <div className="text-[11px] text-gray-500 truncate" title={m.lokasi}>
                              📍 {m.lokasi}
                            </div>
                          )}
                        </div>
                      );
                    };

                    return (
                      <div className="mt-5 pt-4 border-t border-primary/10 space-y-4">
                        <div className="text-xs font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                          <Clock size={13} className="text-teal-dark" />
                          <span>
                            {isId ? "Rangkaian Jadwal Kegiatan:" : "Event Schedule Milestones:"}
                          </span>
                        </div>

                        {/* General Milestones (if any) */}
                        {generalItems.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                            {generalItems.map((m, idx) => renderMilestoneCard(m, idx))}
                          </div>
                        )}

                        {/* Online Milestones (Top) */}
                        {onlineItems.length > 0 && (
                          <div className="space-y-2.5">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-teal/15 text-teal-dark border border-teal/30">
                                💻 {isId ? "Jadwal Online (Daring)" : "Online Schedule"}
                              </span>
                              <div className="h-px flex-1 bg-teal/20" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                              {onlineItems.map((m, idx) => renderMilestoneCard(m, idx))}
                            </div>
                          </div>
                        )}

                        {/* Divider between Online and Offline */}
                        {onlineItems.length > 0 && offlineItems.length > 0 && (
                          <div className="border-t border-dashed border-primary/15 my-1" />
                        )}

                        {/* Offline Milestones (Bottom) */}
                        {offlineItems.length > 0 && (
                          <div className="space-y-2.5">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-accent/15 text-accent-dark border border-accent/30">
                                🏛️ {isId ? "Jadwal Offline (Luring)" : "Offline Schedule"}
                              </span>
                              <div className="h-px flex-1 bg-accent/25" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                              {offlineItems.map((m, idx) => renderMilestoneCard(m, idx))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Action Buttons Footer */}
                  {(isOpen || comp.guidebookUrl || webUrl) && (
                    <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-end gap-2.5">
                      {comp.guidebookUrl && (
                        <a
                          href={comp.guidebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
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
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary/10 text-primary hover:bg-primary/15 border border-primary/20 transition-all"
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
                          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold gradient-hero text-white hover:opacity-95 shadow-md shadow-primary/20 transition-all"
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
