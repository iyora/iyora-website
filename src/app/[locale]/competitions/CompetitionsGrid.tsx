"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BookOpen } from "lucide-react";
import type { CompetitionLiveData } from "@/lib/supabase";

type Level = "national" | "international" | "madrasah";
type ParticipantKey = "sma" | "sd_sma" | "mi_ma";
type FormatKey = "online" | "hybrid";
type FilterKey = "all" | Level;

interface Olympiad {
  id: string;
  name: string;
  full: string;
  icon: string;
  level: Level;
  participants: ParticipantKey;
  format: FormatKey;
  url: string;
}

const OLYMPIADS: Olympiad[] = [
  { id: "nybo", name: "NYBO", full: "National Youth Biology Olympiad", icon: "🧬", level: "national", participants: "sma", format: "online", url: "https://www.nybo-iysa.or.id" },
  { id: "iybo", name: "IYBO", full: "International Youth Biology Olympiad", icon: "🧬", level: "international", participants: "sma", format: "online", url: "https://www.iybo-iysa.or.id" },
  { id: "nypo", name: "NYPO", full: "National Youth Physics Olympiad", icon: "⚛️", level: "national", participants: "sma", format: "online", url: "https://www.nypo-iysa.or.id" },
  { id: "iypo", name: "IYPO", full: "International Youth Physics Olympiad", icon: "⚛️", level: "international", participants: "sma", format: "online", url: "https://www.iypo-iysa.or.id" },
  { id: "nyco", name: "NYCO", full: "National Youth Chemistry Olympiad", icon: "🧪", level: "national", participants: "sma", format: "online", url: "https://www.nyco-iysa.or.id" },
  { id: "iyco", name: "IYCO", full: "International Youth Chemistry Olympiad", icon: "🧪", level: "international", participants: "sma", format: "online", url: "https://www.iyco-iysa.or.id" },
  { id: "nymo", name: "NYMO", full: "National Youth Mathematics Olympiad", icon: "➗", level: "national", participants: "sd_sma", format: "online", url: "https://www.nymo-iysa.or.id" },
  { id: "iymo", name: "IYMO", full: "International Youth Mathematics Olympiad", icon: "➗", level: "international", participants: "sd_sma", format: "online", url: "https://www.iymo-iysa.or.id" },
  { id: "iygo", name: "IYGO", full: "International Youth Geography Olympiad", icon: "🌍", level: "international", participants: "sma", format: "online", url: "https://www.iygo-iysa.or.id" },
  { id: "iyeo", name: "IYEO", full: "International Youth Environmental Olympiad", icon: "🌱", level: "international", participants: "sma", format: "online", url: "#" },
  { id: "os2mn", name: "OS2MN", full: "Olimpiade Sains Siswa Madrasah Nasional", icon: "🕌", level: "madrasah", participants: "mi_ma", format: "online", url: "https://www.os2mn.or.id" },
  { id: "wso", name: "WSO", full: "World Science Olympiad", icon: "🏆", level: "international", participants: "sd_sma", format: "hybrid", url: "https://www.wso.or.id" },
];

const LEVEL_BADGE_STYLES: Record<Level, string> = {
  national: "bg-teal/10 text-teal border border-teal/30",
  international: "bg-primary/10 text-primary border border-primary/30",
  madrasah: "bg-accent/10 text-accent border border-accent/30",
};

const EVENTS_DOMAIN = process.env.NEXT_PUBLIC_EVENTS_DOMAIN ?? "iyora.or.id";

interface Props {
  liveData: Record<string, CompetitionLiveData>;
}

export default function CompetitionsGrid({ liveData }: Props) {
  const t = useTranslations("competitions_page");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: t("filter_all") },
    { key: "national", label: t("filter_national") },
    { key: "international", label: t("filter_international") },
    { key: "madrasah", label: t("filter_madrasah") },
  ];

  const filtered =
    activeFilter === "all"
      ? OLYMPIADS
      : OLYMPIADS.filter((o) => o.level === activeFilter);

  return (
    <>
      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
              activeFilter === key
                ? "bg-primary text-white shadow-md shadow-primary/30"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((olympiad) => {
          const live = liveData[olympiad.id];
          const isOpen = live?.registrationStatus === "open";
          const isComing = live?.registrationStatus === "coming_soon";
          const registerUrl = `https://${olympiad.id}.${EVENTS_DOMAIN}/daftar`;

          return (
            <div
              key={olympiad.id}
              className="group bg-white rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Card Header */}
              <div className="p-6 flex items-start gap-4">
                <div className="text-5xl leading-none">{olympiad.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-xl font-bold text-primary">{olympiad.name}</h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wide ${LEVEL_BADGE_STYLES[olympiad.level]}`}>
                      {t(`filter_${olympiad.level}` as Parameters<typeof t>[0])}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm leading-snug">{olympiad.full}</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-6 pb-2 flex-1">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{t("participants")}</p>
                    <p className="text-sm font-semibold text-gray-700">{t(olympiad.participants as Parameters<typeof t>[0])}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{t("format")}</p>
                    <p className="text-sm font-semibold text-gray-700">{t(olympiad.format as Parameters<typeof t>[0])}</p>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-4">
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
                    {live.guidebookUrl && (
                      <a
                        href={live.guidebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-semibold text-sm border-2 border-primary text-primary hover:bg-primary/5 transition-all duration-200 flex-shrink-0"
                        title={t("guidebook")}
                      >
                        <BookOpen size={15} />
                        <span>{t("guidebook")}</span>
                      </a>
                    )}
                  </div>
                ) : isComing ? (
                  <div className="block w-full text-center py-2.5 rounded-xl font-semibold text-sm bg-gray-100 text-gray-400 cursor-default">
                    {t("coming_soon")}
                  </div>
                ) : live?.registrationStatus === "closed" ? (
                  <div className="block w-full text-center py-2.5 rounded-xl font-semibold text-sm bg-gray-100 text-gray-400 cursor-default">
                    {t("closed")}
                  </div>
                ) : (
                  <a
                    href={olympiad.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full text-center py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                      olympiad.url === "#"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-primary text-white hover:bg-primary-dark group-hover:shadow-md group-hover:shadow-primary/25"
                    }`}
                    onClick={olympiad.url === "#" ? (e) => e.preventDefault() : undefined}
                  >
                    {olympiad.url === "#" ? t("coming_soon") : t("visit_site")}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
