"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
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
  Eye,
  X,
  MapPin,
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
type StatusFilterKey = "open" | "coming_soon" | "ongoing" | "closed";

/*
 * "Berlangsung" (2026-11-23, permintaan pengguna): pendaftaran sudah ditutup
 * tetapi olimpiadenya masih berjalan sampai tanggal awarding. Tanggal awarding
 * = tanggal terakhir agenda Awarding / Penganugerahan / Pengumuman Pemenang /
 * Closing di jadwal dasbor; bila tidak ada, tanggal selesai edisi.
 */
const POLA_AWARDING = /award|penganugerahan|pengumuman pemenang|winner announcement|closing|penutupan/i;

function tanggalAwarding(c: CompetitionData): string | null {
  const daftar = (c.timeline ?? [])
    .filter((m) => m?.tanggal && POLA_AWARDING.test(m.milestone || ""))
    .map((m) => String(m.tanggal).slice(0, 10))
    .sort();
  return daftar.length ? daftar[daftar.length - 1] : (c.eventEndAt ? String(c.eventEndAt).slice(0, 10) : null);
}

/** Tanggal hari ini di WIB, "YYYY-MM-DD". */
function hariIniWib(): string {
  return new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);
}

function statusTampil(c: CompetitionData): StatusFilterKey {
  if (c.registrationStatus === "closed") {
    const aw = tanggalAwarding(c);
    if (aw && hariIniWib() <= aw) return "ongoing";
  }
  return c.registrationStatus as StatusFilterKey;
}

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

function rapiJudul(s: string, akronim?: string): string {
  if (s !== s.toUpperCase()) return s;
  const tetap = new Set([
    (akronim || "").toUpperCase(),
    "IYORA",
    "IYSA",
    "CBT",
    "WIB",
    "SK",
    "TNC",
    "II",
    "III",
    "IV",
  ]);
  return s
    .toLowerCase()
    .split(" ")
    .map((w) =>
      tetap.has(w.toUpperCase())
        ? w.toUpperCase()
        : w.charAt(0).toUpperCase() + w.slice(1)
    )
    .join(" ");
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
  const [previewComp, setPreviewComp] = useState<CompetitionData | null>(null);
  const [previewTab, setPreviewTab] = useState<"all" | "online" | "offline">("all");

  useEffect(() => {
    if (!previewComp) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewComp(null);
    };
    window.addEventListener("keydown", onKey);
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = origOverflow;
    };
  }, [previewComp]);

  const counts = useMemo(() => {
    return {
      all: competitions.length,
      open: competitions.filter((c) => c.registrationStatus === "open").length,
      coming_soon: competitions.filter((c) => c.registrationStatus === "coming_soon").length,
      ongoing: competitions.filter((c) => statusTampil(c) === "ongoing").length,
      closed: competitions.filter((c) => statusTampil(c) === "closed").length,
    };
  }, [competitions]);

  const statusFilters: { key: StatusFilterKey; label: string; count: number }[] = [
    { key: "open", label: isId ? "Pendaftaran Dibuka" : "Open Register", count: counts.open },
    { key: "coming_soon", label: isId ? "Segera Dibuka" : "Coming Soon", count: counts.coming_soon },
    { key: "ongoing", label: isId ? "Sedang Berlangsung" : "Ongoing", count: counts.ongoing },
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
      const matchStatus = statusTampil(c) === activeStatus;
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

      // Ongoing: nearest awarding date first
      if (activeStatus === "ongoing") {
        const awA = tanggalAwarding(a) ?? "9999";
        const awB = tanggalAwarding(b) ?? "9999";
        if (awA !== awB) return awA < awB ? -1 : 1;
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
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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
              {isId ? "Pendaftaran Dibuka" : "Open Registration"}
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

        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/30">
            <Award size={22} />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-amber-700">{counts.ongoing}</div>
            <div className="text-xs text-amber-700/80 font-semibold">
              {isId ? "Sedang Berlangsung" : "Ongoing"}
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
                          : key === "ongoing"
                            ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
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
                  {key === "ongoing" && (
                    <span className={`w-2 h-2 rounded-full ${isActive ? "bg-white" : "bg-amber-500"}`} />
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
            const isOngoing = statusTampil(comp) === "ongoing";
            const awarding = isOngoing ? tanggalAwarding(comp) : null;
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
                        : isOngoing
                          ? "bg-amber-500 text-white shadow-amber-500/25"
                          : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {isOpen ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  ) : isComing ? (
                    <Clock size={14} />
                  ) : isOngoing ? (
                    <Award size={14} />
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
                        : isOngoing
                          ? "border-amber-200 shadow-md shadow-amber-500/5 hover:border-amber-300"
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
                          : isOngoing
                            ? "bg-amber-400"
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

                      {awarding && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          <Award size={13} />
                          {isId ? "Awarding" : "Awarding"} {formatShortDate(awarding, locale)}
                        </span>
                      )}

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
                            : isOngoing
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isOpen
                            ? "bg-teal animate-pulse"
                            : isComing
                              ? "bg-primary"
                              : isOngoing
                                ? "bg-amber-500 animate-pulse"
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
                          : isOngoing
                            ? isId
                              ? "Sedang Berlangsung"
                              : "Ongoing"
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

                  {/* Action Buttons Footer */}
                  {(isOpen || comp.guidebookUrl || webUrl || (comp.timeline && comp.timeline.length > 0)) && (
                    <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-end gap-2.5">
                      {comp.timeline && comp.timeline.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewComp(comp);
                            setPreviewTab("all");
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 transition-all cursor-pointer shadow-xs"
                        >
                          <Eye size={14} />
                          {isId ? "Preview Lengkap Timeline" : "Full Timeline Preview"}
                        </button>
                      )}

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

      {/* Full Timeline Preview Modal */}
      <AnimatePresence>
        {previewComp && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6"
            role="dialog"
            aria-modal="true"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewComp(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-100"
            >
              {/* Header */}
              <div className="relative shrink-0 text-white p-6 gradient-hero">
                <button
                  onClick={() => setPreviewComp(null)}
                  className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white/35 cursor-pointer"
                  aria-label={isId ? "Tutup" : "Close"}
                >
                  <X size={18} />
                </button>

                <div className="flex items-center gap-4 pr-10">
                  {previewComp.logoUrl ? (
                    <div className="h-16 w-16 shrink-0 rounded-2xl bg-white p-2 shadow-md flex items-center justify-center">
                      <img
                        src={previewComp.logoUrl}
                        alt={previewComp.shortName}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 shrink-0 rounded-2xl bg-white/20 backdrop-blur-sm text-3xl flex items-center justify-center shadow-md">
                      {getIcon(previewComp.category)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs uppercase tracking-wider">
                        {previewComp.level === "international" || previewComp.level === "world"
                          ? (isId ? "Internasional" : "International")
                          : (isId ? "Nasional" : "National")}
                      </span>
                      {previewComp.category && (
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-black/20 text-white/90">
                          {previewComp.category}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-black leading-tight tracking-tight">
                      {previewComp.shortName}
                    </h2>
                    <p className="text-xs text-white/85 line-clamp-1 mt-0.5 font-medium">
                      {previewComp.name}
                    </p>
                  </div>
                </div>

                {/* Quick Date summary banner */}
                <div className="mt-4 pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 font-medium text-white/90">
                    <Calendar size={13} className="text-white" />
                    {isId ? "Pendaftaran:" : "Registration:"}{" "}
                    <strong className="text-white">
                      {previewComp.registrationOpenAt && previewComp.registrationCloseAt
                        ? `${formatShortDate(previewComp.registrationOpenAt, locale)} – ${formatShortDate(previewComp.registrationCloseAt, locale)}`
                        : isId
                          ? "Segera Diumumkan"
                          : "To Be Announced"}
                    </strong>
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                      previewComp.registrationStatus === "open"
                        ? "bg-teal text-white shadow-xs"
                        : previewComp.registrationStatus === "coming_soon"
                          ? "bg-amber-400 text-gray-900"
                          : "bg-white/20 text-white"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {previewComp.registrationStatus === "open"
                      ? isId
                        ? "Pendaftaran Dibuka"
                        : "Registration Open"
                      : previewComp.registrationStatus === "coming_soon"
                        ? isId
                          ? "Segera Dibuka"
                          : "Coming Soon"
                        : isId
                          ? "Pendaftaran Ditutup"
                          : "Closed"}
                  </span>
                </div>
              </div>

              {/* Tab Filters for Modal: Semua, Online, Offline */}
              {(() => {
                const rawMilestones = previewComp.timeline || [];
                const sortByDateAndTime = (
                  a: typeof rawMilestones[number],
                  b: typeof rawMilestones[number]
                ) =>
                  (a.tanggal || "").localeCompare(b.tanggal || "") ||
                  (a.jam_mulai || "").localeCompare(b.jam_mulai || "");

                const sortedAll = [...rawMilestones].sort(sortByDateAndTime);
                const onlineCount = sortedAll.filter(
                  (m) => (m.jalur || "").toLowerCase() === "online"
                ).length;
                const offlineCount = sortedAll.filter(
                  (m) => (m.jalur || "").toLowerCase() === "offline"
                ).length;

                const displayItems = sortedAll.filter((m) => {
                  if (previewTab === "all") return true;
                  return (m.jalur || "").toLowerCase() === previewTab;
                });

                return (
                  <>
                    {/* Tab Selector */}
                    <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/80 px-6 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setPreviewTab("all")}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            previewTab === "all"
                              ? "bg-white text-primary shadow-xs ring-1 ring-primary/20"
                              : "text-gray-600 hover:text-primary"
                          }`}
                        >
                          {isId ? "Semua Jadwal" : "All Milestones"} ({sortedAll.length})
                        </button>

                        {onlineCount > 0 && (
                          <button
                            onClick={() => setPreviewTab("online")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                              previewTab === "online"
                                ? "bg-teal text-white shadow-xs"
                                : "text-teal-dark hover:bg-teal/10"
                            }`}
                          >
                            <span>💻 {isId ? "Online" : "Online"}</span>
                            <span className="text-[10px] opacity-80">({onlineCount})</span>
                          </button>
                        )}

                        {offlineCount > 0 && (
                          <button
                            onClick={() => setPreviewTab("offline")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                              previewTab === "offline"
                                ? "bg-accent-dark text-white shadow-xs"
                                : "text-accent-dark hover:bg-accent/10"
                            }`}
                          >
                            <span>🏛️ {isId ? "Offline" : "Offline"}</span>
                            <span className="text-[10px] opacity-80">({offlineCount})</span>
                          </button>
                        )}
                      </div>

                      <span className="text-[11px] font-semibold text-gray-400 hidden sm:inline">
                        {isId ? "Rangkaian Jadwal Lengkap" : "Complete Schedule Preview"}
                      </span>
                    </div>

                    {/* Milestones Stepper Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                      {displayItems.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                          <p className="text-sm font-semibold">
                            {isId ? "Tidak ada jadwal untuk kategori ini." : "No milestones for this filter."}
                          </p>
                        </div>
                      ) : (
                        <ol className="relative space-y-4 before:content-[''] before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-primary/30 before:via-teal/30 before:to-primary/10">
                          {displayItems.map((m, idx) => {
                            const isOfflineItem = (m.jalur || "").toLowerCase() === "offline";
                            const isOnlineItem = (m.jalur || "").toLowerCase() === "online";
                            const dateObj = m.tanggal ? new Date(`${m.tanggal.slice(0, 10)}T12:00:00`) : null;
                            const dayNumber = dateObj ? dateObj.getDate() : "--";
                            const monthShort = dateObj
                              ? dateObj.toLocaleDateString(isId ? "id-ID" : "en-US", { month: "short" })
                              : "";
                            const fullDate = dateObj
                              ? dateObj.toLocaleDateString(isId ? "id-ID" : "en-US", {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })
                              : m.tanggal;

                            const timeStr = [m.jam_mulai, m.jam_selesai].filter(Boolean).join(" – ");

                            return (
                              <li key={`${m.milestone}-${m.tanggal}-${idx}`} className="relative flex items-start gap-4">
                                {/* Date Block Node */}
                                <div
                                  className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border text-center shadow-xs z-10 ${
                                    isOfflineItem
                                      ? "bg-gradient-to-br from-amber-50 to-orange-50 border-accent/30 text-accent-dark"
                                      : "bg-gradient-to-br from-primary/5 to-teal/10 border-primary/20 text-primary"
                                  }`}
                                >
                                  <span className="text-lg font-black leading-none">{dayNumber}</span>
                                  <span className="mt-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                                    {monthShort}
                                  </span>
                                </div>

                                {/* Detail Card */}
                                <div
                                  className={`flex-1 rounded-2xl p-4 border transition-all ${
                                    isOfflineItem
                                      ? "bg-amber-50/40 border-accent/25 hover:border-accent/40"
                                      : "bg-white border-gray-200/90 hover:border-primary/30 shadow-xs"
                                  }`}
                                >
                                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                                    <h4 className="text-sm font-bold text-gray-900 leading-snug">
                                      {rapiJudul(m.milestone, previewComp.shortName)}
                                    </h4>
                                    {m.jalur && (
                                      <span
                                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                                          isOfflineItem
                                            ? "bg-accent/15 text-accent-dark border border-accent/30"
                                            : isOnlineItem
                                              ? "bg-teal/15 text-teal-dark border border-teal/30"
                                              : "bg-gray-100 text-gray-700 border border-gray-200"
                                        }`}
                                      >
                                        {m.jalur}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                                    <span className="font-semibold text-primary">
                                      📅 {fullDate}
                                    </span>
                                    {timeStr && (
                                      <span className="inline-flex items-center gap-1 font-medium text-gray-700">
                                        <Clock size={12} className="text-gray-400" />
                                        {timeStr} WIB
                                      </span>
                                    )}
                                    {m.lokasi && (
                                      <span className="inline-flex items-center gap-1 font-medium text-gray-700">
                                        <MapPin size={12} className="text-gray-400" />
                                        {m.lokasi}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ol>
                      )}
                    </div>
                  </>
                );
              })()}

              {/* Modal Action Footer */}
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/80 px-6 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  {previewComp.guidebookUrl && (
                    <a
                      href={previewComp.guidebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 transition-all"
                    >
                      <BookOpen size={14} />
                      {isId ? "Buku Panduan" : "Guidebook"}
                    </a>
                  )}

                  {previewComp.websiteUrl && (
                    <a
                      href={getValidEventWebsiteUrl(previewComp.slug, previewComp.websiteUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-primary border border-primary/20 hover:bg-primary/5 transition-all"
                    >
                      <ExternalLink size={14} />
                      {isId ? "Website Event" : "Event Website"}
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewComp(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200/80 transition-all cursor-pointer"
                  >
                    {isId ? "Tutup" : "Close"}
                  </button>

                  {previewComp.registrationStatus === "open" && (
                    <a
                      href={getValidEventRegistrationUrl(
                        previewComp.slug,
                        previewComp.registrationUrl,
                        previewComp.websiteUrl
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold gradient-hero text-white hover:opacity-95 shadow-md shadow-primary/20 transition-all"
                    >
                      {isId ? "Daftar Sekarang →" : "Register Now →"}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
