"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BookOpen } from "lucide-react";
import type { CompetitionData } from "@/lib/supabase";

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
};

function getIcon(category: string | null) {
  if (!category) return "🏆";
  if (CATEGORY_ICONS[category]) return CATEGORY_ICONS[category];
  const cleanCat = category.replace(/\s+/g, " ").trim();
  return CATEGORY_ICONS[cleanCat] ?? "🏆";
}

const LEVEL_BADGE: Record<string, string> = {
  national:      "bg-teal/10 text-teal border border-teal/30",
  international: "bg-primary/10 text-primary border border-primary/30",
  madrasah:      "bg-accent/10 text-accent border border-accent/30",
  world:         "bg-yellow-100 text-yellow-700 border border-yellow-300",
};

type FilterKey = "all" | "national" | "international";

interface Props {
  competitions: CompetitionData[];
}

export default function CompetitionsGrid({ competitions }: Props) {
  const t = useTranslations("competitions_page");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: t("filter_all") },
    { key: "national", label: t("filter_national") },
    { key: "international", label: t("filter_international") },
  ];

  const filtered = activeFilter === "all"
    ? competitions
    : competitions.filter((c) => c.level === activeFilter);

  return (
    <>
      {/* Filter pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-200 cursor-pointer ${
              activeFilter === key
                ? "bg-primary text-white shadow-md shadow-primary/30 scale-105"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {filtered.map((comp) => {
          const isOpen   = comp.registrationStatus === "open";
          const isComing = comp.registrationStatus === "coming_soon";
          const targetUrl = comp.websiteUrl ?? `https://${comp.slug}.iyora.or.id`;
          const badge = LEVEL_BADGE[comp.level] ?? LEVEL_BADGE.national;

          return (
            <div
              key={comp.slug}
              className={`group rounded-2xl transition-all duration-300 overflow-hidden flex flex-col h-full relative ${
                isOpen
                  ? "bg-gradient-to-br from-[#3B79A7] via-[#358EAA] to-[#2EA3AD] text-white shadow-xl shadow-teal-900/20 border border-teal-300/30 hover:scale-[1.02] hover:shadow-2xl hover:shadow-teal-800/30"
                  : isComing
                    ? "bg-gradient-to-br from-[#66449b] via-[#523380] to-[#3f2366] text-white shadow-xl shadow-purple-950/20 border border-purple-300/30 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-900/30"
                    : "bg-white border border-gray-100 text-gray-900 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/50"
              }`}
            >
              {/* Decorative background watermark circles */}
              <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none ${isOpen || isComing ? "bg-white/10" : "bg-gray-200/50"}`} />
              <div className={`absolute -bottom-10 -right-4 w-32 h-32 rounded-full pointer-events-none ${isOpen || isComing ? "bg-white/10" : "bg-gray-200/50"}`} />

              <div className="p-6 flex flex-col flex-1 justify-between relative z-10">
                {/* Top content area with fixed layout for perfect button alignment */}
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-5xl leading-none flex-shrink-0">{getIcon(comp.category)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className={`text-xl font-extrabold ${(isOpen || isComing) ? "text-white" : "text-primary"}`}>
                          {comp.shortName}
                        </h3>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wide ${
                          (isOpen || isComing) ? "bg-white/20 text-white border border-white/30 backdrop-blur-xs" : badge
                        }`}>
                          {t(`filter_${comp.level}` as Parameters<typeof t>[0])}
                        </span>
                      </div>
                      <p className={`text-sm leading-snug line-clamp-2 min-h-[2.5rem] ${(isOpen || isComing) ? "text-white/90" : "text-gray-600"}`}>
                        {comp.name}
                      </p>
                    </div>
                  </div>

                  {/* Status dot */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                      isOpen
                        ? "bg-emerald-400/20 text-emerald-200 border border-emerald-300/40 backdrop-blur-xs"
                        : isComing
                          ? "bg-amber-400/20 text-amber-200 border border-amber-300/40 backdrop-blur-xs"
                          : "bg-gray-100 text-gray-500"
                    }`}>
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        isOpen
                          ? "bg-emerald-300 animate-pulse shadow-sm shadow-emerald-400"
                          : isComing
                            ? "bg-amber-300"
                            : "bg-gray-400"
                      }`} />
                      {isOpen ? t("status_open") : isComing ? t("coming_soon") : t("closed")}
                    </span>
                  </div>
                </div>

                {/* Footer CTA - Always aligned at the bottom */}
                <div className="pt-2 mt-auto">
                  <div className="flex gap-2">
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 text-center py-2.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-md ${
                        isOpen
                          ? "bg-white text-[#2b608a] hover:bg-white/95 hover:text-[#1d4669] hover:shadow-lg"
                          : isComing
                            ? "bg-white text-[#66449b] hover:bg-white/95 hover:text-[#4d2d7a] hover:shadow-lg"
                            : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-primary hover:text-white hover:border-primary"
                      }`}
                    >
                      {t("register")} →
                    </a>
                    {comp.guidebookUrl && (
                      <a
                        href={comp.guidebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 flex-shrink-0 ${
                          (isOpen || isComing)
                            ? "bg-white/15 text-white border border-white/30 hover:bg-white/25"
                            : "border-2 border-primary text-primary hover:bg-primary/5"
                        }`}
                        title={t("guidebook")}
                      >
                        <BookOpen size={15} />
                        <span className="hidden sm:inline">{t("guidebook")}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
