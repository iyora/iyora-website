"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Menu, X, ChevronDown, Newspaper, Megaphone, FileText, Images, Calendar, ArrowRight } from "lucide-react";
import clsx from "clsx";
import type { NewsPreviewData } from "@/lib/supabase";

interface OlympiadItem {
  name: string;
  emoji: string;
  side: "left" | "right";
  full: string;
  level: string;
  badgeStyle: string;
  url: string;
  openAt: string;
  closeAt: string;
}

function computeOlympiadStatus(openAt: string, closeAt: string): "open" | "coming_soon" | "closed" {
  const now = new Date();
  if (now < new Date(openAt)) return "coming_soon";
  const closeDate = new Date(closeAt);
  if (closeAt.length <= 10) closeDate.setHours(23, 59, 59, 999);
  if (now > closeDate) return "closed";
  return "open";
}

const RAW_OLYMPIADS: OlympiadItem[] = [
  { name: "NYBO", emoji: "🧬", side: "left", full: "National Youth Biology Olympiad", level: "Nasional", badgeStyle: "bg-blue-50 text-blue-700 border-blue-200", url: "https://nybo.iyora.or.id", openAt: "2026-07-01", closeAt: "2026-07-31" },
  { name: "IYBO", emoji: "🧬", side: "right", full: "International Youth Biology Olympiad", level: "Internasional", badgeStyle: "bg-purple-50 text-purple-700 border-purple-200", url: "https://iybo.iyora.or.id", openAt: "2026-07-01", closeAt: "2026-07-31" },
  { name: "NYPO", emoji: "⚛️", side: "left", full: "National Youth Physics Olympiad", level: "Nasional", badgeStyle: "bg-blue-50 text-blue-700 border-blue-200", url: "https://nypo.iyora.or.id", openAt: "2026-06-01", closeAt: "2026-06-30" },
  { name: "IYPO", emoji: "⚛️", side: "right", full: "International Youth Physics Olympiad", level: "Internasional", badgeStyle: "bg-purple-50 text-purple-700 border-purple-200", url: "https://iypo.iyora.or.id", openAt: "2026-06-01", closeAt: "2026-06-30" },
  { name: "NYCO", emoji: "🧪", side: "left", full: "National Youth Chemistry Olympiad", level: "Nasional", badgeStyle: "bg-blue-50 text-blue-700 border-blue-200", url: "https://nyco.iyora.or.id", openAt: "2026-05-01", closeAt: "2026-05-31" },
  { name: "IYCO", emoji: "🧪", side: "right", full: "International Youth Chemistry Olympiad", level: "Internasional", badgeStyle: "bg-purple-50 text-purple-700 border-purple-200", url: "https://iyco.iyora.or.id", openAt: "2026-05-01", closeAt: "2026-05-31" },
  { name: "NYMO", emoji: "➗", side: "left", full: "National Youth Mathematics Olympiad", level: "Nasional", badgeStyle: "bg-blue-50 text-blue-700 border-blue-200", url: "https://nymo.iyora.or.id", openAt: "2026-04-01", closeAt: "2026-05-02" },
  { name: "IYMO", emoji: "➗", side: "right", full: "International Youth Mathematics Olympiad", level: "Internasional", badgeStyle: "bg-purple-50 text-purple-700 border-purple-200", url: "https://iymo.iyora.or.id", openAt: "2026-06-01", closeAt: "2026-07-30" },
  { name: "NYGO", emoji: "🌍", side: "left", full: "National Youth Geography Olympiad", level: "Nasional", badgeStyle: "bg-teal-50 text-teal-700 border-teal-200", url: "https://nygo.iyora.or.id", openAt: "2026-08-01", closeAt: "2026-08-16" },
  { name: "IYGO", emoji: "🌍", side: "right", full: "International Youth Geography Olympiad", level: "Internasional", badgeStyle: "bg-teal-50 text-teal-700 border-teal-200", url: "https://iygo.iyora.or.id", openAt: "2026-08-01", closeAt: "2026-08-16" },
  { name: "NYEO", emoji: "📊", side: "left", full: "National Youth Economics Olympiad", level: "Nasional", badgeStyle: "bg-indigo-50 text-indigo-700 border-indigo-200", url: "https://nyeo.iyora.or.id", openAt: "2026-08-01", closeAt: "2026-08-16" },
  { name: "IYEO", emoji: "📊", side: "right", full: "International Youth Economics Olympiad", level: "Internasional", badgeStyle: "bg-indigo-50 text-indigo-700 border-indigo-200", url: "https://iyeo.iyora.or.id", openAt: "2026-08-01", closeAt: "2026-08-16" },
  { name: "NYEnO", emoji: "🌱", side: "left", full: "National Youth Environment Olympiad", level: "Nasional", badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200", url: "https://nyeo.iyora.or.id", openAt: "2026-04-01", closeAt: "2026-04-30" },
  { name: "IYEnO", emoji: "🌱", side: "right", full: "International Youth Environment Olympiad", level: "Internasional", badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200", url: "https://iyeo.iyora.or.id", openAt: "2026-04-01", closeAt: "2026-04-30" },
  { name: "NYAO", emoji: "🔭", side: "left", full: "National Youth Astronomy Olympiad", level: "Nasional", badgeStyle: "bg-sky-50 text-sky-700 border-sky-200", url: "https://nyao.iyora.or.id", openAt: "2026-03-01", closeAt: "2026-03-31" },
  { name: "IYAO", emoji: "🔭", side: "right", full: "International Youth Astronomy Olympiad", level: "Internasional", badgeStyle: "bg-sky-50 text-sky-700 border-sky-200", url: "https://iyao.iyora.or.id", openAt: "2026-03-01", closeAt: "2026-03-31" },
  { name: "OS2MN", emoji: "🕌", side: "left", full: "Olimpiade Sains Madrasah Nasional", level: "Nasional", badgeStyle: "bg-teal-50 text-teal-700 border-teal-200", url: "https://os2mn.iyora.or.id", openAt: "2026-02-01", closeAt: "2026-02-28" },
  { name: "WSO", emoji: "🏆", side: "right", full: "World Science Olympiad", level: "Internasional", badgeStyle: "bg-indigo-50 text-indigo-700 border-indigo-200", url: "https://wso.iyora.or.id", openAt: "2026-01-01", closeAt: "2026-01-31" },
  { name: "NSO", emoji: "🔬", side: "left", full: "National Science Olympiad", level: "Nasional", badgeStyle: "bg-teal-50 text-teal-700 border-teal-200", url: "https://nso.iyora.or.id", openAt: "2026-09-01", closeAt: "2026-09-30" },
  { name: "NSMO", emoji: "🔬", side: "right", full: "National Science and Math Olympiad", level: "Nasional", badgeStyle: "bg-blue-50 text-blue-700 border-blue-200", url: "https://nsmo.iyora.or.id", openAt: "2026-09-01", closeAt: "2026-09-30" },
];

const STATUS_PRIORITY = { open: 0, coming_soon: 1, closed: 2 };

export const OLYMPIADS = [...RAW_OLYMPIADS]
  .map((o) => ({
    ...o,
    status: computeOlympiadStatus(o.openAt, o.closeAt),
  }))
  .sort((a, b) => STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status]);

const NEWS_MENU = [
  { key: "news", icon: Newspaper, labelId: "tab_news", hash: "news", descId: "preview_news" },
  { key: "announcements", icon: Megaphone, labelId: "tab_announcements", hash: "announcements", descId: "preview_announcements" },
  { key: "press_release", icon: FileText, labelId: "tab_press_release", hash: "press_release", descId: "preview_press_release" },
  { key: "gallery", icon: Images, labelId: "tab_gallery", hash: "gallery", descId: "preview_gallery" },
] as const;

type NewsMenuKey = typeof NEWS_MENU[number]["key"];

function formatPreviewDate(dateStr: string | null, locale: string = "id"): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale === "en" ? "en-US" : "id-ID", { day: "numeric", month: "short", year: "numeric" });
}

interface NavbarProps {
  newsPreview?: NewsPreviewData;
}

export default function Navbar({ newsPreview }: NavbarProps) {
  const t = useTranslations("nav");
  const tNews = useTranslations("news_page");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newsDropdownOpen, setNewsDropdownOpen] = useState(false);
  const [mobileNewsOpen, setMobileNewsOpen] = useState(false);
  const [hoveredNewsKey, setHoveredNewsKey] = useState<NewsMenuKey>("news");
  const [hoveredOlympiadName, setHoveredOlympiadName] = useState<string>(OLYMPIADS[0]?.name || "NYGO");
  const [hoveredSide, setHoveredSide] = useState<"left" | "right">("left");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const newsCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeOlympiad = OLYMPIADS.find((o) => o.name === hoveredOlympiadName) || OLYMPIADS[0];

  function openDropdown() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropdownOpen(true);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 150);
  }

  function openNewsDropdown() {
    if (newsCloseTimer.current) clearTimeout(newsCloseTimer.current);
    setNewsDropdownOpen(true);
  }

  function scheduleNewsClose() {
    newsCloseTimer.current = setTimeout(() => setNewsDropdownOpen(false), 150);
  }

  const otherLocale = locale === "id" ? "en" : "id";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClass = clsx(
    "text-sm font-medium transition-colors duration-200 hover:opacity-80",
    scrolled || mobileOpen ? "text-gray-800" : "text-white"
  );

  const href = (path: string) => `/${locale}${path}`;

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white shadow-md shadow-black/5"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href={href("/")} className="flex-shrink-0">
          <Image
            src="https://res.cloudinary.com/dvcufsiy1/image/upload/v1782429397/IYORA_BRAND_GUIDELINE_a6kwif.png"
            alt="IYORA"
            width={140}
            height={40}
            priority
            className={clsx(
              "object-contain h-7 md:h-10 w-auto transition-all duration-300",
              !scrolled && "brightness-0 invert"
            )}
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href={href("/")} className={navLinkClass}>
            {t("home")}
          </Link>

          <div
            className="relative"
            onMouseEnter={openDropdown}
            onMouseLeave={scheduleClose}
          >
            <Link
              href={href("/competitions")}
              onClick={() => setDropdownOpen(false)}
              className={clsx(
                navLinkClass,
                "flex items-center gap-1 cursor-pointer"
              )}
            >
              {t("competitions")}
              <ChevronDown
                size={14}
                className={clsx(
                  "transition-transform duration-200",
                  dropdownOpen && "rotate-180"
                )}
              />
            </Link>

            <div
              className={clsx(
                "absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200",
                dropdownOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
              )}
            >
              <div className="relative bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100 p-3 w-[350px]">
                <div className="grid grid-cols-2 gap-1 max-h-[340px] overflow-y-auto pr-0.5">
                  {OLYMPIADS.map((o) => {
                    const isHovered = hoveredOlympiadName === o.name;
                    const isOpen = o.status === "open";
                    return (
                      <Link
                        key={`${o.name}-${o.full}`}
                        href={href("/competitions")}
                        onClick={() => setDropdownOpen(false)}
                        onMouseEnter={() => {
                          setHoveredOlympiadName(o.name);
                          setHoveredSide(o.side);
                        }}
                        className={clsx(
                          "flex items-center justify-between px-2.5 py-2 rounded-xl transition-all duration-150 group relative overflow-hidden",
                          isHovered
                            ? isOpen
                              ? "bg-teal-500/10 text-teal-900 font-bold"
                              : "bg-primary/10"
                            : "hover:bg-gray-50"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base leading-none flex-shrink-0">{o.emoji}</span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <p className={clsx(
                                "text-xs font-bold transition-colors",
                                isHovered ? "text-primary" : "text-gray-800 group-hover:text-primary"
                              )}>
                                {o.name}
                              </p>
                              {isOpen && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-[10px] text-gray-400 truncate leading-tight">{o.level}</p>
                          </div>
                        </div>
                        {isOpen && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex-shrink-0 ml-1">
                            Open
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
                <div className="pt-2 mt-2 border-t border-gray-100">
                  <Link
                    href={href("/competitions")}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center justify-center w-full py-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    {locale === "id" ? "Lihat Semua Kompetisi" : "View All Competitions"} →
                  </Link>
                </div>

                {activeOlympiad && (
                  <div
                    className={clsx(
                      "absolute top-0 w-[270px] min-h-full p-4 rounded-2xl shadow-xl transition-all duration-200 animate-fadeIn overflow-hidden flex flex-col justify-between",
                      hoveredSide === "left" ? "right-full mr-3" : "left-full ml-3",
                      activeOlympiad.status === "open"
                        ? "bg-gradient-to-br from-[#3B79A7] via-[#358EAA] to-[#2EA3AD] text-white border border-teal-300/30 shadow-teal-900/20"
                        : activeOlympiad.status === "coming_soon"
                          ? "bg-gradient-to-br from-[#66449b] via-[#523380] to-[#3f2366] text-white border border-purple-300/30 shadow-purple-950/20"
                          : "bg-white text-gray-900 border border-gray-100 shadow-black/10"
                    )}
                  >
                    {/* Decorative watermark circles */}
                    <div className={clsx(
                      "absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none",
                      (activeOlympiad.status === "open" || activeOlympiad.status === "coming_soon") ? "bg-white/10" : "bg-gray-200/50"
                    )} />
                    <div className={clsx(
                      "absolute -bottom-10 -right-4 w-28 h-28 rounded-full pointer-events-none",
                      (activeOlympiad.status === "open" || activeOlympiad.status === "coming_soon") ? "bg-white/10" : "bg-gray-200/50"
                    )} />

                    <div className="flex flex-col h-full justify-between relative z-10">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-3xl">{activeOlympiad.emoji}</span>
                          <span className={clsx(
                            "text-[10px] font-bold px-2.5 py-0.5 rounded-full border",
                            (activeOlympiad.status === "open" || activeOlympiad.status === "coming_soon")
                              ? "bg-white/20 text-white border-white/30 backdrop-blur-xs"
                              : activeOlympiad.badgeStyle
                          )}>
                            {activeOlympiad.level}
                          </span>
                        </div>
                        <h4 className={clsx(
                          "text-sm font-extrabold mb-1 leading-snug",
                          (activeOlympiad.status === "open" || activeOlympiad.status === "coming_soon") ? "text-white" : "text-gray-900"
                        )}>
                          {activeOlympiad.name}
                        </h4>
                        <p className={clsx(
                          "text-xs font-semibold mb-3 leading-snug",
                          (activeOlympiad.status === "open" || activeOlympiad.status === "coming_soon") ? "text-white/90" : "text-primary"
                        )}>
                          {activeOlympiad.full}
                        </p>

                        <div className="mb-2">
                          <span className={clsx(
                            "inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full",
                            activeOlympiad.status === "open"
                              ? "bg-emerald-400/20 text-emerald-200 border border-emerald-300/40 backdrop-blur-xs"
                              : activeOlympiad.status === "coming_soon"
                                ? "bg-amber-400/20 text-amber-200 border border-amber-300/40 backdrop-blur-xs"
                                : "bg-gray-100 text-gray-500 border border-gray-200"
                          )}>
                            <span className={clsx(
                              "w-1.5 h-1.5 rounded-full flex-shrink-0",
                              activeOlympiad.status === "open"
                                ? "bg-emerald-300 animate-pulse"
                                : activeOlympiad.status === "coming_soon"
                                  ? "bg-amber-300"
                                  : "bg-gray-400"
                            )} />
                            {activeOlympiad.status === "open"
                              ? (locale === "id" ? "Pendaftaran Dibuka" : "Registration Open")
                              : activeOlympiad.status === "coming_soon"
                                ? (locale === "id" ? "Segera Dibuka" : "Coming Soon")
                                : (locale === "id" ? "Ditutup" : "Closed")}
                          </span>
                        </div>
                      </div>

                      <div className={clsx(
                        "flex flex-col gap-1.5 pt-3 border-t",
                        (activeOlympiad.status === "open" || activeOlympiad.status === "coming_soon") ? "border-white/20" : "border-gray-100"
                      )}>
                        {activeOlympiad.url && (
                          <a
                            href={activeOlympiad.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setDropdownOpen(false)}
                            className={clsx(
                              "flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-bold transition-all shadow-sm group",
                              activeOlympiad.status === "open"
                                ? "bg-white text-[#2b608a] hover:bg-white/95 hover:text-[#1d4669]"
                                : activeOlympiad.status === "coming_soon"
                                  ? "bg-white text-[#66449b] hover:bg-white/95 hover:text-[#4d2d7a]"
                                  : "bg-primary text-white hover:bg-primary-dark"
                            )}
                          >
                            <span>{locale === "id" ? "Kunjungi Website" : "Visit Website"}</span>
                            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                          </a>
                        )}

                        <Link
                          href={href("/competitions")}
                          onClick={() => setDropdownOpen(false)}
                          className={clsx(
                            "flex items-center justify-center gap-1 w-full py-1 text-xs font-semibold transition-colors",
                            (activeOlympiad.status === "open" || activeOlympiad.status === "coming_soon")
                              ? "text-white/80 hover:text-white"
                              : "text-gray-500 hover:text-primary"
                          )}
                        >
                          <span>{locale === "id" ? "Detail Kompetisi" : "Competition Details"}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Link href={href("/winners")} className={navLinkClass}>
            {t("winners")}
          </Link>

          <div
            className="relative"
            onMouseEnter={openNewsDropdown}
            onMouseLeave={scheduleNewsClose}
          >
            <Link
              href={href("/news")}
              className={clsx(
                navLinkClass,
                "flex items-center gap-1"
              )}
            >
              {t("news")}
              <ChevronDown
                size={14}
                className={clsx(
                  "transition-transform duration-200",
                  newsDropdownOpen && "rotate-180"
                )}
              />
            </Link>

            <div
              className={clsx(
                "absolute top-full left-0 w-[560px] pt-2 transition-all duration-200",
                newsDropdownOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
              )}
            >
              <div className="bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100 overflow-hidden flex">
                {/* Left: menu items */}
                <div className="w-[200px] p-3 flex flex-col gap-0.5 border-r border-gray-100">
                  {NEWS_MENU.map((item) => {
                    const Icon = item.icon;
                    const isHovered = hoveredNewsKey === item.key;
                    return (
                      <Link
                        key={item.key}
                        href={`${href("/news")}?tab=${item.hash}`}
                        className={clsx(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                          isHovered ? "bg-primary/5" : "hover:bg-gray-50"
                        )}
                        onMouseEnter={() => setHoveredNewsKey(item.key)}
                      >
                        <div className={clsx(
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                          isHovered ? "bg-primary/10" : "bg-gray-50"
                        )}>
                          <Icon size={16} className={clsx(isHovered ? "text-primary" : "text-gray-400")} />
                        </div>
                        <span className={clsx(
                          "text-sm font-medium transition-colors",
                          isHovered ? "text-primary" : "text-gray-700"
                        )}>
                          {tNews(item.labelId)}
                        </span>
                      </Link>
                    );
                  })}
                  <div className="pt-2 mt-auto border-t border-gray-100">
                    <Link
                      href={href("/news")}
                      className="flex items-center justify-center w-full py-2 text-xs font-semibold text-primary hover:underline"
                    >
                      {locale === "id" ? "Lihat Semua Berita" : "View All News"} →
                    </Link>
                  </div>
                </div>

                {/* Right: preview panel */}
                <div className="flex-1 p-4 bg-gray-50/50 min-h-[200px]">
                  {/* News preview */}
                  {hoveredNewsKey === "news" && (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        {locale === "id" ? "Berita Terkini" : "Latest News"}
                      </p>
                      {newsPreview && newsPreview.news.length > 0 ? (
                        newsPreview.news.map((item) => (
                          <Link
                            key={item.id}
                            href={href(`/news/${item.slug}`)}
                            onClick={() => setNewsDropdownOpen(false)}
                            className="flex gap-3 p-2 rounded-xl hover:bg-white transition-colors group"
                          >
                            {item.cover_image ? (
                              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                <Image src={item.cover_image} alt={item.title} width={56} height={56} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-14 h-14 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                                <Newspaper size={20} className="text-primary/30" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-primary transition-colors">{item.title}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Calendar size={10} className="text-gray-300" />
                                <span className="text-xs text-gray-400">{formatPreviewDate(item.published_at ?? item.created_at, locale)}</span>
                              </div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                          <Newspaper size={28} className="text-gray-200 mb-2" />
                          <p className="text-xs text-gray-400">{locale === "id" ? "Belum ada berita" : "No news yet"}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Announcements preview */}
                  {hoveredNewsKey === "announcements" && (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        {locale === "id" ? "Pengumuman Terbaru" : "Recent Announcements"}
                      </p>
                      {newsPreview && newsPreview.announcements.length > 0 ? (
                        newsPreview.announcements.map((item) => (
                          <Link
                            key={item.id}
                            href={href(`/news/${item.slug}`)}
                            onClick={() => setNewsDropdownOpen(false)}
                            className="flex gap-3 p-2 rounded-xl hover:bg-white transition-colors group"
                          >
                            {item.cover_image ? (
                              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                <Image src={item.cover_image} alt={item.title} width={56} height={56} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-14 h-14 rounded-lg bg-accent/5 flex items-center justify-center flex-shrink-0">
                                <Megaphone size={20} className="text-accent/40" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-primary transition-colors">{item.title}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Calendar size={10} className="text-gray-300" />
                                <span className="text-xs text-gray-400">{formatPreviewDate(item.published_at ?? item.created_at, locale)}</span>
                              </div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                          <Megaphone size={28} className="text-gray-200 mb-2" />
                          <p className="text-xs text-gray-400">{locale === "id" ? "Belum ada pengumuman" : "No announcements yet"}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Press Release preview */}
                  {hoveredNewsKey === "press_release" && (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        {locale === "id" ? "Siaran Pers Terbaru" : "Recent Press Releases"}
                      </p>
                      {newsPreview && newsPreview.pressRelease && newsPreview.pressRelease.length > 0 ? (
                        newsPreview.pressRelease.map((item) => (
                          <Link
                            key={item.id}
                            href={href(`/news/${item.slug}`)}
                            onClick={() => setNewsDropdownOpen(false)}
                            className="flex gap-3 p-2 rounded-xl hover:bg-white transition-colors group"
                          >
                            {item.cover_image ? (
                              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                <Image src={item.cover_image} alt={item.title} width={56} height={56} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-14 h-14 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                                <FileText size={20} className="text-primary/40" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-primary transition-colors">{item.title}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Calendar size={10} className="text-gray-300" />
                                <span className="text-xs text-gray-400">{formatPreviewDate(item.published_at ?? item.created_at, locale)}</span>
                              </div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                          <FileText size={28} className="text-gray-200 mb-2" />
                          <p className="text-xs text-gray-400">{locale === "id" ? "Belum ada siaran pers" : "No press releases yet"}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Gallery preview */}
                  {hoveredNewsKey === "gallery" && (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        {locale === "id" ? "Galeri Terbaru" : "Recent Gallery"}
                      </p>
                      {newsPreview && newsPreview.gallery.length > 0 ? (
                        newsPreview.gallery.map((item) => (
                          <Link
                            key={item.id}
                            href={item.slug ? href(`/news/${item.slug}`) : `${href("/news")}?tab=gallery`}
                            onClick={() => setNewsDropdownOpen(false)}
                            className="flex gap-3 p-2 rounded-xl hover:bg-white transition-colors group"
                          >
                            {item.image_url ? (
                              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                                <Image src={item.image_url} alt={item.title} width={56} height={56} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-14 h-14 rounded-lg bg-accent/5 flex items-center justify-center flex-shrink-0">
                                <Images size={20} className="text-accent/40" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-primary transition-colors">{item.title}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Calendar size={10} className="text-gray-300" />
                                <span className="text-xs text-gray-400">{formatPreviewDate(item.created_at || null, locale)}</span>
                              </div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                          <Images size={28} className="text-gray-200 mb-2" />
                          <p className="text-xs text-gray-400">{locale === "id" ? "Belum ada galeri" : "No gallery yet"}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Link href={href("/partners")} className={navLinkClass}>
            {t("partners")}
          </Link>
          <Link href={href("/about")} className={navLinkClass}>
            {t("about")}
          </Link>
          <Link href={href("/contact")} className={navLinkClass}>
            {t("contact")}
          </Link>

          {/* Language switcher */}
          <Link
            href={`/${otherLocale}`}
            className={clsx(
              "text-xs font-bold px-3 py-1.5 rounded-full border transition-all duration-200",
              scrolled
                ? "border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
                : "border-white/60 text-white hover:border-white hover:bg-white/10"
            )}
          >
            {otherLocale.toUpperCase()}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className={clsx("md:hidden p-2 rounded-lg", navLinkClass)}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            <Link
              href={href("/")}
              className="py-3 text-gray-800 font-medium border-b border-gray-50 hover:text-primary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {t("home")}
            </Link>
            <Link
              href={href("/competitions")}
              className="py-3 text-gray-800 font-medium border-b border-gray-50 hover:text-primary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {t("competitions")}
            </Link>
            <Link
              href={href("/winners")}
              className="py-3 text-gray-800 font-medium border-b border-gray-50 hover:text-primary transition-colors flex items-center justify-between"
              onClick={() => setMobileOpen(false)}
            >
              <span>{t("winners")}</span>
              <span className="text-[11px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">🏆 New</span>
            </Link>
            {/* Mobile News accordion */}
            <button
              className="py-3 text-gray-800 font-medium border-b border-gray-50 hover:text-primary transition-colors flex items-center justify-between w-full cursor-pointer"
              onClick={() => setMobileNewsOpen((v) => !v)}
            >
              <span>{t("news")}</span>
              <ChevronDown
                size={16}
                className={clsx(
                  "transition-transform duration-200",
                  mobileNewsOpen && "rotate-180"
                )}
              />
            </button>
            {mobileNewsOpen && (
              <div className="pl-4 pb-2 flex flex-col gap-0.5">
                <Link
                  href={href("/news")}
                  className="py-2 text-sm text-gray-600 hover:text-primary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {locale === "id" ? "Semua Berita" : "All News"}
                </Link>
                {NEWS_MENU.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.key}
                      href={`${href("/news")}?tab=${item.hash}`}
                      className="py-2 text-sm text-gray-600 hover:text-primary transition-colors flex items-center gap-2"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon size={14} />
                      <span>{tNews(item.labelId)}</span>
                    </Link>
                  );
                })}
              </div>
            )}
            <Link
              href={href("/partners")}
              className="py-3 text-gray-800 font-medium border-b border-gray-50 hover:text-primary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {t("partners")}
            </Link>
            <Link
              href={href("/about")}
              className="py-3 text-gray-800 font-medium border-b border-gray-50 hover:text-primary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {t("about")}
            </Link>
            <Link
              href={href("/contact")}
              className="py-3 text-gray-800 font-medium border-b border-gray-50 hover:text-primary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {t("contact")}
            </Link>
            <div className="pt-3">
              <Link
                href={`/${otherLocale}`}
                className="inline-block text-xs font-bold px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition-all"
                onClick={() => setMobileOpen(false)}
              >
                Switch to {otherLocale.toUpperCase()}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
