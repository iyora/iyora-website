"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { CompetitionData } from "@/lib/supabase";

type FilterKey = "all" | "national" | "international";

const MOBILE_LIMIT = 4;

const CATEGORY_ICONS: Record<string, string> = {
  Biology:     "🧬",
  Physics:     "⚛️",
  Chemistry:   "🧪",
  Mathematics: "➗",
  Geography:   "🌍",
  Economics:   "📊",
  Astronomy:   "🔭",
  Environment: "🌱",
  Madrasah:    "🕌",
  Science:     "🏆",
};

function getIcon(category: string | null) {
  return category ? (CATEGORY_ICONS[category] ?? "🏆") : "🏆";
}

const LEVEL_STYLES: Record<string, { badge: string; border: string }> = {
  national:      { badge: "bg-teal/10 text-teal border border-teal/25",         border: "hover:border-teal/50" },
  international: { badge: "bg-primary/10 text-primary border border-primary/25", border: "hover:border-primary/50" },
  madrasah:      { badge: "bg-accent/10 text-accent border border-accent/25",    border: "hover:border-accent/50" },
  world:         { badge: "bg-yellow-100 text-yellow-700 border border-yellow-300", border: "hover:border-yellow-400" },
};

const STATUS_STYLE: Record<string, string> = {
  open:        "bg-green-100 text-green-700",
  coming_soon: "bg-yellow-100 text-yellow-700",
  closed:      "bg-gray-100 text-gray-500",
};

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariant: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0, 0, 1] } },
};

interface Props {
  competitions: CompetitionData[];
}

export default function CompetitionsSection({ competitions }: Props) {
  const t = useTranslations("competitions_section");
  const locale = useLocale();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [showAll, setShowAll] = useState(false);

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: t("filter_all") },
    { key: "national", label: t("national") },
    { key: "international", label: t("international") },
  ];

  const filtered = activeFilter === "all"
    ? competitions
    : competitions.filter((c) => c.level === activeFilter);

  const visibleOnMobile = showAll ? filtered : filtered.slice(0, MOBILE_LIMIT);
  const hiddenCount = Math.max(0, filtered.length - MOBILE_LIMIT);

  function StatusBadge({ status }: { status: string }) {
    const cls = status === "open"
      ? "bg-emerald-400/20 text-emerald-200 border border-emerald-300/40 backdrop-blur-xs"
      : status === "coming_soon"
        ? "bg-amber-400/20 text-amber-200 border border-amber-300/40 backdrop-blur-xs"
        : STATUS_STYLE[status] ?? STATUS_STYLE.coming_soon;
    const label = status === "open"
      ? t("open")
      : status === "closed"
        ? t("closed")
        : t("coming_soon");
    return (
      <span className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-0.5 rounded-full font-bold ${cls}`}>
        {status === "open" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />}
        {status === "coming_soon" && <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />}
        {label}
      </span>
    );
  }

  function OlympiadCard({ c, size }: { c: CompetitionData; size: "sm" | "lg" }) {
    const styles = LEVEL_STYLES[c.level] ?? LEVEL_STYLES.national;
    const targetUrl = c.websiteUrl ?? `https://${c.slug}.iyora.or.id`;
    const isOpen = c.registrationStatus === "open";
    const isComing = c.registrationStatus === "coming_soon";

    if (size === "sm") {
      return (
        <div className={`group rounded-2xl transition-all duration-300 flex flex-col p-4 cursor-pointer overflow-hidden relative h-full justify-between ${
          isOpen
            ? "bg-gradient-to-br from-[#3B79A7] via-[#358EAA] to-[#2EA3AD] text-white shadow-xl shadow-teal-900/20 border border-teal-300/30 hover:scale-[1.02]"
            : isComing
              ? "bg-gradient-to-br from-[#66449b] via-[#523380] to-[#3f2366] text-white shadow-xl shadow-purple-950/20 border border-purple-300/30 hover:scale-[1.02]"
              : `bg-white border border-gray-100 ${styles.border} hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5`
        }`}>
          {/* Decorative background watermark circles */}
          <div className={`absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none ${isOpen || isComing ? "bg-white/10" : "bg-gray-200/50"}`} />
          <div className={`absolute -bottom-10 -right-4 w-28 h-28 rounded-full pointer-events-none ${isOpen || isComing ? "bg-white/10" : "bg-gray-200/50"}`} />
          <div className="flex-1 flex flex-col justify-between relative z-10">
            <div>
              <div className="text-3xl mb-2 leading-none transition-transform duration-300 group-hover:scale-110 origin-left">{getIcon(c.category)}</div>
              <div className="flex items-start gap-1.5 flex-wrap mb-1">
                <h3 className={`text-sm font-extrabold ${(isOpen || isComing) ? "text-white" : "text-gray-900 group-hover:text-primary"}`}>{c.shortName}</h3>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide self-center ${
                  (isOpen || isComing) ? "bg-white/20 text-white border border-white/30 backdrop-blur-xs" : styles.badge
                }`}>
                  {t(c.level as Parameters<typeof t>[0])}
                </span>
              </div>
              <p className={`text-xs leading-snug mb-2 line-clamp-2 min-h-[2rem] ${(isOpen || isComing) ? "text-white/90" : "text-gray-500"}`}>{c.name}</p>
              <div className="mb-2"><StatusBadge status={c.registrationStatus} /></div>
            </div>
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`block text-center py-2 rounded-xl text-xs font-bold transition-all duration-200 mt-auto shadow-md ${
                isOpen
                  ? "bg-white text-[#2b608a] hover:bg-white/95 hover:text-[#1d4669]"
                  : isComing
                    ? "bg-white text-[#66449b] hover:bg-white/95 hover:text-[#4d2d7a]"
                    : "bg-gray-50 text-gray-600 border border-gray-200 group-hover:bg-primary group-hover:text-white group-hover:border-primary"
              }`}
            >
              {t("visit_website")}
            </a>
          </div>
        </div>
      );
    }
    return (
      <div className={`group rounded-2xl transition-all duration-300 flex flex-col p-6 cursor-pointer overflow-hidden relative h-full justify-between ${
        isOpen
          ? "bg-gradient-to-br from-[#3B79A7] via-[#358EAA] to-[#2EA3AD] text-white shadow-xl shadow-teal-900/20 border border-teal-300/30 hover:scale-[1.02] hover:shadow-2xl"
          : isComing
            ? "bg-gradient-to-br from-[#66449b] via-[#523380] to-[#3f2366] text-white shadow-xl shadow-purple-950/20 border border-purple-300/30 hover:scale-[1.02] hover:shadow-2xl"
            : `bg-white border border-gray-100 ${styles.border} hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2`
      }`}>
        {/* Decorative background watermark circles */}
        <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none ${isOpen || isComing ? "bg-white/10" : "bg-gray-200/50"}`} />
        <div className={`absolute -bottom-10 -right-4 w-32 h-32 rounded-full pointer-events-none ${isOpen || isComing ? "bg-white/10" : "bg-gray-200/50"}`} />
        <div className="flex-1 flex flex-col justify-between relative z-10">
          <div>
            <div className="text-5xl mb-4 leading-none transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 origin-left">{getIcon(c.category)}</div>
            <div className="flex items-start gap-2 flex-wrap mb-2">
              <h3 className={`text-lg font-extrabold transition-colors ${(isOpen || isComing) ? "text-white" : "text-gray-900 group-hover:text-primary"}`}>{c.shortName}</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide self-center ${
                (isOpen || isComing) ? "bg-white/20 text-white border border-white/30 backdrop-blur-xs" : styles.badge
              }`}>
                {t(c.level as Parameters<typeof t>[0])}
              </span>
            </div>
            <p className={`text-sm leading-snug mb-4 line-clamp-2 min-h-[2.5rem] ${(isOpen || isComing) ? "text-white/90" : "text-gray-500"}`}>{c.name}</p>
            <div className="mb-4"><StatusBadge status={c.registrationStatus} /></div>
          </div>
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`block text-center py-2.5 rounded-xl text-sm font-bold transition-all duration-200 mt-auto shadow-md ${
              isOpen
                ? "bg-white text-[#2b608a] hover:bg-white/95 hover:text-[#1d4669]"
                : isComing
                  ? "bg-white text-[#66449b] hover:bg-white/95 hover:text-[#4d2d7a]"
                  : "bg-gray-50 text-gray-700 border border-gray-200 group-hover:bg-primary group-hover:text-white group-hover:border-primary"
            }`}
          >
            {t("visit_website")} →
          </a>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-16 md:py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-10"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-primary mb-4">{t("title")}</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
        </motion.div>

        {/* Filter — mobile: dropdown, desktop: pills */}
        {filters.length > 1 && (
          <>
            {/* Mobile dropdown */}
            <div className="sm:hidden mb-6">
              <div className={`relative mx-auto max-w-xs rounded-xl border-2 transition-colors ${activeFilter !== "all" ? "border-primary bg-primary/5" : "border-gray-200 bg-white"}`}>
                <select
                  value={activeFilter}
                  onChange={(e) => { setActiveFilter(e.target.value as FilterKey); setShowAll(false); }}
                  className={`w-full appearance-none bg-transparent pl-4 pr-10 py-3 text-sm font-bold focus:outline-none cursor-pointer ${activeFilter !== "all" ? "text-primary" : "text-gray-700"}`}
                >
                  {filters.map(({ key, label }) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <ChevronDown size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${activeFilter !== "all" ? "text-primary" : "text-gray-400"}`} />
              </div>
            </div>

            {/* Desktop pills */}
            <div className="hidden sm:flex flex-wrap justify-center gap-2 mb-8">
              {filters.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => { setActiveFilter(key); setShowAll(false); }}
                  className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${
                    activeFilter === key
                      ? "bg-primary text-white shadow-md shadow-primary/30"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Mobile grid */}
        <div className="sm:hidden">
          <motion.div
            key={`mobile-${activeFilter}`}
            variants={container}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-3"
          >
            {visibleOnMobile.map((c) => (
              <motion.div key={c.slug} variants={cardVariant}>
                <OlympiadCard c={c} size="sm" />
              </motion.div>
            ))}
          </motion.div>

          <AnimatePresence>
            {showAll && hiddenCount <= 0 && null}
          </AnimatePresence>

          {hiddenCount > 0 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAll((v) => !v)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold border-2 transition-all duration-200"
                style={{
                  borderColor: "#66449b",
                  color: showAll ? "#fff" : "#66449b",
                  backgroundColor: showAll ? "#66449b" : "transparent",
                }}
              >
                {showAll ? t("show_less") : `${t("show_more")} (${hiddenCount})`}
              </button>
            </div>
          )}
        </div>

        {/* Desktop grid */}
        <motion.div
          key={`desktop-${activeFilter}`}
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {filtered.map((c) => (
            <motion.div key={c.slug} variants={cardVariant}>
              <OlympiadCard c={c} size="lg" />
            </motion.div>
          ))}
        </motion.div>

        {/* View All Competitions Button */}
        <div className="text-center mt-12">
          <Link
            href={`/${locale}/competitions`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            {locale === "id" ? "Lihat Semua Kompetisi" : "View All Competitions"} →
          </Link>
        </div>
      </div>
    </section>
  );
}
