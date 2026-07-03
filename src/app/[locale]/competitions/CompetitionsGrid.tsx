"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BookOpen, ExternalLink } from "lucide-react";
import type { CompetitionData } from "@/lib/supabase";

type LevelFilter = "all" | "national" | "international" | "madrasah" | "world";
type StatusFilter = "all" | "open" | "coming_soon" | "closed";

const CATEGORY_ICONS: Record<string, string> = {
  Biology: "🧬",
  Physics: "⚛️",
  Chemistry: "🧪",
  Mathematics: "➗",
  Geography: "🌍",
  Economics: "📊",
  Astronomy: "🔭",
  Environment: "🌱",
};

function getIcon(category: string | null) {
  return category ? (CATEGORY_ICONS[category] ?? "🏆") : "🏆";
}

const LEVEL_BADGE: Record<string, string> = {
  national:      "bg-teal/10 text-teal border border-teal/30",
  international: "bg-primary/10 text-primary border border-primary/30",
  madrasah:      "bg-accent/10 text-accent border border-accent/30",
  world:         "bg-yellow-100 text-yellow-700 border border-yellow-300",
};

const EVENTS_DOMAIN = process.env.NEXT_PUBLIC_EVENTS_DOMAIN ?? "iyora.or.id";

interface Props {
  competitions: CompetitionData[];
}

export default function CompetitionsGrid({ competitions }: Props) {
  const t = useTranslations("competitions_page");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const levels = Array.from(new Set(competitions.map((c) => c.level)));

  const levelFilters: { key: LevelFilter; label: string }[] = [
    { key: "all", label: t("filter_all") },
    ...(levels.includes("national")      ? [{ key: "national"      as LevelFilter, label: t("filter_national") }]      : []),
    ...(levels.includes("international") ? [{ key: "international" as LevelFilter, label: t("filter_international") }] : []),
    ...(levels.includes("madrasah")      ? [{ key: "madrasah"      as LevelFilter, label: t("filter_madrasah") }]      : []),
    ...(levels.includes("world")         ? [{ key: "world"         as LevelFilter, label: t("filter_world") }]         : []),
  ];

  const statusFilters: { key: StatusFilter; label: string; activeClass: string }[] = [
    { key: "all",        label: t("filter_status_all"),   activeClass: "bg-primary text-white border-primary" },
    { key: "open",       label: t("filter_open"),         activeClass: "bg-green-600 text-white border-green-600" },
    { key: "coming_soon",label: t("filter_coming_soon"),  activeClass: "bg-yellow-500 text-white border-yellow-500" },
    { key: "closed",     label: t("filter_closed"),       activeClass: "bg-gray-500 text-white border-gray-500" },
  ];

  const filtered = competitions.filter((c) => {
    if (levelFilter  !== "all" && c.level               !== levelFilter)  return false;
    if (statusFilter !== "all" && c.registrationStatus  !== statusFilter) return false;
    return true;
  });

  return (
    <>
      {/* Level filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {levelFilters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setLevelFilter(key)}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
              levelFilter === key
                ? "bg-primary text-white shadow-md shadow-primary/30"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {statusFilters.map(({ key, label, activeClass }) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={`px-4 py-1.5 rounded-full font-semibold text-xs border transition-all duration-200 ${
              statusFilter === key
                ? activeClass
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-semibold text-gray-500">{t("no_results")}</p>
        </div>
      )}

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((comp) => {
          const isOpen   = comp.registrationStatus === "open";
          const isComing = comp.registrationStatus === "coming_soon";
          const registerUrl = `https://${comp.slug}.${EVENTS_DOMAIN}/register`;
          const badge = LEVEL_BADGE[comp.level] ?? LEVEL_BADGE.national;

          return (
            <div
              key={comp.slug}
              className="group bg-white rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 flex items-start gap-4">
                <div className="text-5xl leading-none">{getIcon(comp.category)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-xl font-bold text-primary">{comp.shortName}</h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wide ${badge}`}>
                      {t(`filter_${comp.level}` as Parameters<typeof t>[0])}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm leading-snug">{comp.name}</p>
                </div>
              </div>

              {/* Status dot */}
              <div className="px-6 pb-4">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                  isOpen
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : isComing
                      ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                      : "bg-gray-100 text-gray-500"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    isOpen ? "bg-green-500 animate-pulse" : isComing ? "bg-yellow-500" : "bg-gray-400"
                  }`} />
                  {isOpen ? t("status_open") : isComing ? t("coming_soon") : t("closed")}
                </span>
              </div>

              {/* Footer CTA */}
              <div className="px-6 pb-6 mt-auto">
                {isOpen ? (
                  <div className="flex gap-2">
                    <a
                      href={registerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2.5 rounded-xl font-semibold text-sm bg-primary text-white hover:bg-primary-dark group-hover:shadow-md group-hover:shadow-primary/25 transition-all duration-200"
                    >
                      {t("register")}
                    </a>
                    {comp.guidebookUrl && (
                      <a
                        href={comp.guidebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-semibold text-sm border-2 border-primary text-primary hover:bg-primary/5 transition-all duration-200 flex-shrink-0"
                        title={t("guidebook")}
                      >
                        <BookOpen size={15} />
                        <span className="hidden sm:inline">{t("guidebook")}</span>
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="flex-1 text-center py-2.5 rounded-xl font-semibold text-sm bg-gray-100 text-gray-400 cursor-default">
                      {isComing ? t("coming_soon") : t("closed")}
                    </div>
                    {comp.websiteUrl && (
                      <a
                        href={comp.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-3 py-2.5 rounded-xl text-sm border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all duration-200"
                        title={t("visit_site")}
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
