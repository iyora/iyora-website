"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { CompetitionData } from "@/lib/supabase";

type FilterKey = "all" | "national" | "international" | "madrasah" | "world";

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

  const levels = Array.from(new Set(competitions.map((c) => c.level)));

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: t("filter_all") },
    ...(levels.includes("national")      ? [{ key: "national"      as FilterKey, label: t("national") }]      : []),
    ...(levels.includes("international") ? [{ key: "international" as FilterKey, label: t("international") }] : []),
    ...(levels.includes("madrasah")      ? [{ key: "madrasah"      as FilterKey, label: t("madrasah") }]      : []),
    ...(levels.includes("world")         ? [{ key: "world"         as FilterKey, label: t("world") }]         : []),
  ];

  const filtered = activeFilter === "all"
    ? competitions
    : competitions.filter((c) => c.level === activeFilter);

  const visibleOnMobile = showAll ? filtered : filtered.slice(0, MOBILE_LIMIT);
  const hiddenCount = Math.max(0, filtered.length - MOBILE_LIMIT);

  function StatusBadge({ status }: { status: string }) {
    const cls = STATUS_STYLE[status] ?? STATUS_STYLE.coming_soon;
    const label = status === "open"
      ? t("open")
      : status === "closed"
        ? t("closed")
        : t("coming_soon");
    return (
      <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded-full font-bold ${cls}`}>
        {label}
      </span>
    );
  }

  function OlympiadCard({ c, size }: { c: CompetitionData; size: "sm" | "lg" }) {
    const styles = LEVEL_STYLES[c.level] ?? LEVEL_STYLES.national;
    if (size === "sm") {
      return (
        <div className={`group bg-white rounded-2xl border border-gray-100 ${styles.border} hover:shadow-xl transition-all duration-300 flex flex-col p-4 cursor-pointer`}>
          <div className="text-3xl mb-2 leading-none">{getIcon(c.category)}</div>
          <div className="flex items-start gap-1.5 flex-wrap mb-1">
            <h3 className="text-sm font-extrabold text-gray-900">{c.shortName}</h3>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide ${styles.badge} self-center`}>
              {t(c.level as Parameters<typeof t>[0])}
            </span>
          </div>
          <p className="text-gray-400 text-xs leading-snug flex-1 mb-2 line-clamp-2">{c.name}</p>
          <div className="mb-2"><StatusBadge status={c.registrationStatus} /></div>
          <Link
            href={`/${locale}/competitions`}
            className="block text-center py-2 rounded-xl text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-200"
          >
            {t("view_detail")}
          </Link>
        </div>
      );
    }
    return (
      <div className={`group bg-white rounded-2xl border border-gray-100 ${styles.border} hover:shadow-xl transition-all duration-300 flex flex-col p-6 cursor-pointer`}>
        <div className="text-5xl mb-4 leading-none">{getIcon(c.category)}</div>
        <div className="flex items-start gap-2 flex-wrap mb-2">
          <h3 className="text-lg font-extrabold text-gray-900">{c.shortName}</h3>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${styles.badge} self-center`}>
            {t(c.level as Parameters<typeof t>[0])}
          </span>
        </div>
        <p className="text-gray-400 text-sm leading-snug flex-1 mb-3">{c.name}</p>
        <div className="mb-4"><StatusBadge status={c.registrationStatus} /></div>
        <Link
          href={`/${locale}/competitions`}
          className="block text-center py-2.5 rounded-xl text-sm font-semibold bg-gray-50 text-gray-600 border border-gray-200 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-200"
        >
          {t("view_detail")}
        </Link>
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
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">{t("title")}</h2>
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
      </div>
    </section>
  );
}
