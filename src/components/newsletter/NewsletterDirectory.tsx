"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import {
  BookOpen,
  FileText,
  Sparkles,
  X,
  Share2,
  Eye,
} from "lucide-react";
import clsx from "clsx";
import type { NewsletterItem } from "@/lib/supabase";

interface NewsletterDirectoryProps {
  newsletters: NewsletterItem[];
}

function getSafeViewerUrl(fileUrl: string | undefined): string {
  if (!fileUrl || fileUrl === "#") return "";
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
  }
  return fileUrl;
}

export default function NewsletterDirectory({ newsletters }: NewsletterDirectoryProps) {
  const t = useTranslations("newsletter_page");
  const locale = useLocale();

  const [activePdfModal, setActivePdfModal] = useState<NewsletterItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Default to overview so page navigation never triggers background downloads
  const [featuredViewMode, setFeaturedViewMode] = useState<"preview" | "overview">("overview");

  // Featured Newsletter (latest or explicitly featured)
  const featuredNewsletter = useMemo(() => {
    const feat = newsletters.find((n) => n.featured);
    return feat || newsletters[0] || null;
  }, [newsletters]);

  const handleShare = (item: NewsletterItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = typeof window !== "undefined" ? `${window.location.origin}/${locale}/newsletter` : "";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 pb-24">
      {/* ── 1. Hero Section ── */}
      <section className="gradient-hero pt-32 pb-20 text-white text-center px-6 relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs md:text-sm font-semibold mb-6 shadow-sm">
            <Sparkles size={14} className="text-amber-300 animate-pulse" />
            <span>{t("badge")}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            {t("title")}
          </h1>
          <p className="text-base md:text-xl max-w-2xl mx-auto text-white/90 leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20 space-y-16">
        {/* ── 2. Featured Issue Spotlight Card or Empty State ── */}
        {featuredNewsletter ? (
          <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8 items-start">
              {/* Cover & Quick Info (Left - 4 Cols) */}
              <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-6">
                <div className="relative group">
                  <div className="relative aspect-[3/4] max-w-[280px] lg:max-w-full mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-primary/15 border-4 border-white transform lg:-rotate-1 group-hover:rotate-0 transition-transform duration-500">
                    <Image
                      src={featuredNewsletter.cover_image}
                      alt={featuredNewsletter.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <button
                        onClick={() => setActivePdfModal(featuredNewsletter)}
                        className="w-full py-2 px-3 bg-white/95 text-gray-900 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg hover:bg-white transition-colors cursor-pointer"
                      >
                        <Eye size={14} className="text-primary" />
                        <span>{t("expand_fullscreen")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Preview & Reader (Right - 8 Cols) */}
              <div className="lg:col-span-8 flex flex-col h-full space-y-4">
                {/* Header with Title, Badges, and Mode Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-gradient-to-r from-teal-500 to-primary text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
                        <Sparkles size={11} />
                        {t("featured_badge")}
                      </span>
                      <span className="bg-gray-100 text-gray-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-gray-200">
                        {featuredNewsletter.edition}
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-extrabold px-3 py-0.5 rounded-full border border-emerald-200/80 shadow-2xs">
                        <Eye size={13} className="text-emerald-600 animate-pulse" />
                        <span>{(featuredNewsletter.views || 1485).toLocaleString(locale === "en" ? "en-US" : "id-ID")} {t("views_short")}</span>
                      </span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-snug">
                      {featuredNewsletter.title}
                    </h2>
                  </div>

                  {/* Tabs toggle & Share */}
                  <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-center">
                    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                      <button
                        onClick={() => setFeaturedViewMode("overview")}
                        className={clsx(
                          "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                          featuredViewMode === "overview"
                            ? "bg-white text-primary shadow-xs"
                            : "text-gray-600 hover:text-gray-900"
                        )}
                      >
                        <FileText size={13} />
                        <span>{t("tab_overview")}</span>
                      </button>
                      <button
                        onClick={() => setFeaturedViewMode("preview")}
                        className={clsx(
                          "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                          featuredViewMode === "preview"
                            ? "bg-white text-primary shadow-xs"
                            : "text-gray-600 hover:text-gray-900"
                        )}
                      >
                        <BookOpen size={13} />
                        <span>{t("tab_preview")}</span>
                      </button>
                    </div>

                    <button
                      onClick={(e) => handleShare(featuredNewsletter, e)}
                      className="p-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer relative"
                      title="Bagikan"
                    >
                      <Share2 size={15} />
                      {copiedId === featuredNewsletter.id && (
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap animate-fadeIn">
                          Tersalin!
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* ── View 1: Scrollable PDF Document Reader ── */}
                {featuredViewMode === "preview" ? (
                  <div className="space-y-2">
                    {/* Toolbar on top of viewer */}
                    <div className="flex items-center justify-between text-xs px-3 py-2 bg-gray-900 text-gray-200 rounded-t-2xl border border-b-0 border-gray-800">
                      <div className="flex items-center gap-2 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="truncate max-w-[200px] md:max-w-xs">{featuredNewsletter.title}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActivePdfModal(featuredNewsletter)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer text-xs"
                          title="Layar Penuh"
                        >
                          <Eye size={13} />
                          <span>{t("expand_fullscreen")}</span>
                        </button>
                      </div>
                    </div>

                    {/* Scrollable Frame using Safe Viewer (no download triggered) */}
                    <div className="relative w-full h-[480px] md:h-[530px] bg-gray-950 rounded-b-2xl border border-gray-800 overflow-hidden shadow-inner">
                      <iframe
                        src={getSafeViewerUrl(featuredNewsletter.file_url)}
                        title={featuredNewsletter.title}
                        className="w-full h-full border-0"
                      />
                    </div>

                    {/* Scroll Hint Helper */}
                    <div className="flex items-center justify-between text-[11px] text-gray-500 px-2 pt-1 font-medium">
                      <span>💡 {t("scroll_hint")}</span>
                      <span className="text-primary font-bold">100% Online Reader</span>
                    </div>
                  </div>
                ) : (
                  /* ── View 2: Detailed Overview & Highlights ── */
                  <div className="bg-gray-50/70 rounded-2xl p-6 border border-gray-100 flex flex-col justify-between space-y-6 min-h-[460px]">
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                        Ringkasan Isi Edisi
                      </h4>
                      <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                        {featuredNewsletter.description}
                      </p>

                      {/* Topic tags */}
                      {featuredNewsletter.tags && featuredNewsletter.tags.length > 0 && (
                        <div className="pt-2">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Topik Utama
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {featuredNewsletter.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-white text-primary text-xs font-bold px-3 py-1 rounded-lg border border-primary/20 shadow-xs"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-3">
                      <button
                        onClick={() => setFeaturedViewMode("preview")}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-bold text-xs shadow-md hover:bg-primary-dark transition-all cursor-pointer"
                      >
                        <BookOpen size={15} />
                        <span>Buka Preview Dokumen</span>
                      </button>
                      <button
                        onClick={() => setActivePdfModal(featuredNewsletter)}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-800 font-bold text-xs hover:bg-gray-50 transition-all cursor-pointer"
                      >
                        <Eye size={15} className="text-primary" />
                        <span>{t("expand_fullscreen")}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 md:p-16 border border-gray-100 shadow-xl shadow-black/5 text-center flex flex-col items-center justify-center max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
              <BookOpen size={36} />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-3">
              {locale === "en" ? "No Newsletters Published Yet" : "Belum Ada Newsletter Dipublikasikan"}
            </h3>
            <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto leading-relaxed mb-8">
              {locale === "en"
                ? "Official IYORA newsletters and bulletins will appear here once published via the dashboard. Stay tuned for the latest updates."
                : "Edisi buletin dan newsletter resmi IYORA akan segera hadir di sini setelah diunggah melalui dashboard. Pantau terus informasi dan berita terbaru seputar olimpiade sains."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/${locale}/news`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-xs md:text-sm font-bold shadow-md hover:bg-primary-dark transition-all"
              >
                <span>{locale === "en" ? "View Latest News" : "Lihat Berita Terkini"}</span>
              </Link>
              <Link
                href={`/${locale}/competitions`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 text-xs md:text-sm font-bold hover:bg-gray-200 transition-all"
              >
                <span>{locale === "en" ? "Browse Competitions" : "Jelajahi Kompetisi"}</span>
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* ── 6. PDF Interactive Preview Modal ── */}
      {activePdfModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
              <div className="flex items-center gap-3 min-w-0 pr-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm md:text-base font-extrabold text-gray-900 truncate">
                    {activePdfModal.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 truncate">
                    <span>{activePdfModal.edition}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                      <Eye size={12} />
                      {(activePdfModal.views || 1200).toLocaleString(locale === "en" ? "en-US" : "id-ID")} {t("views_short")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setActivePdfModal(null)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors ml-1 cursor-pointer"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal PDF Viewer / Iframe using Safe Viewer */}
            <div className="flex-1 bg-gray-900 relative">
              <iframe
                src={getSafeViewerUrl(activePdfModal.file_url)}
                title={activePdfModal.title}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
