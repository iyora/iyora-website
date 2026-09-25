"use client";

import { useState } from "react";
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
  ArrowLeft,
  ExternalLink,
  Download,
} from "lucide-react";
import clsx from "clsx";
import type { NewsletterItem } from "@/lib/supabase";

interface NewsletterDetailViewProps {
  newsletter: NewsletterItem;
}

function getSafeViewerUrl(fileUrl: string | undefined): string {
  if (!fileUrl || fileUrl === "#") return "";
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
  }
  return fileUrl;
}

export default function NewsletterDetailView({ newsletter }: NewsletterDetailViewProps) {
  const t = useTranslations("newsletter_page");
  const locale = useLocale();

  const [activePdfModal, setActivePdfModal] = useState<NewsletterItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"preview" | "overview">("overview");

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(newsletter.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 pt-28 pb-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb / Back Button */}
        <div className="flex items-center justify-between">
          <Link
            href={`/${locale}/newsletter`}
            className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-gray-600 hover:text-primary transition-colors bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-xs"
          >
            <ArrowLeft size={16} />
            <span>{locale === "en" ? "Back to All Newsletters" : "Kembali ke Direktori Newsletter"}</span>
          </Link>

          <div className="flex items-center gap-2">
            {newsletter.file_url && newsletter.file_url !== "#" && (
              <a
                href={newsletter.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                <Download size={14} />
                <span>{locale === "en" ? "Download PDF" : "Unduh File"}</span>
              </a>
            )}
          </div>
        </div>

        {/* ── Main Detail Card (Exact design requested in screenshot) ── */}
        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8 items-start">
            {/* Cover & Quick Info (Left - 4 Cols) */}
            <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-6">
              <div className="relative group">
                <div className="relative aspect-[3/4] max-w-[280px] lg:max-w-full mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-primary/15 border-4 border-white transform lg:-rotate-1 group-hover:rotate-0 transition-transform duration-500 bg-gradient-to-br from-gray-900 to-primary/80 flex items-center justify-center">
                  {newsletter.cover_image && !newsletter.cover_image.includes("placeholder") ? (
                    <Image
                      src={newsletter.cover_image}
                      alt={newsletter.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                  ) : (
                    <div className="p-6 text-center text-white flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <BookOpen size={32} className="text-amber-300" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-white/80">{newsletter.edition}</span>
                      <h4 className="text-sm font-extrabold line-clamp-3 leading-snug text-white">{newsletter.title}</h4>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <button
                      onClick={() => setActivePdfModal(newsletter)}
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
                      {newsletter.edition}
                    </span>
                  </div>
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-snug">
                    {newsletter.title}
                  </h1>
                </div>

                {/* Tabs toggle & Share */}
                <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-center">
                  <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                    <button
                      onClick={() => setViewMode("overview")}
                      className={clsx(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                        viewMode === "overview"
                          ? "bg-white text-primary shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                      )}
                    >
                      <FileText size={13} />
                      <span>{t("tab_overview")}</span>
                    </button>
                    <button
                      onClick={() => setViewMode("preview")}
                      className={clsx(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                        viewMode === "preview"
                          ? "bg-white text-primary shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                      )}
                    >
                      <BookOpen size={13} />
                      <span>{t("tab_preview")}</span>
                    </button>
                  </div>

                  <button
                    onClick={handleShare}
                    className="p-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer relative"
                    title="Bagikan"
                  >
                    <Share2 size={15} />
                    {copiedId === newsletter.id && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md whitespace-nowrap animate-fadeIn">
                        Tersalin!
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* ── View 1: Scrollable PDF Document Reader ── */}
              {viewMode === "preview" ? (
                <div className="space-y-2">
                  {/* Toolbar on top of viewer */}
                  <div className="flex items-center justify-between text-xs px-3 py-2 bg-gray-900 text-gray-200 rounded-t-2xl border border-b-0 border-gray-800">
                    <div className="flex items-center gap-2 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="truncate max-w-[200px] md:max-w-xs">{newsletter.title}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActivePdfModal(newsletter)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer text-xs"
                        title="Layar Penuh"
                      >
                        <Eye size={13} />
                        <span>{t("expand_fullscreen")}</span>
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Frame using Safe Viewer */}
                  <div className="relative w-full h-[520px] md:h-[600px] bg-gray-950 rounded-b-2xl border border-gray-800 overflow-hidden shadow-inner">
                    <iframe
                      src={getSafeViewerUrl(newsletter.file_url)}
                      title={newsletter.title}
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
                      Ringkasan Dokumen & Edisi
                    </h4>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                      {newsletter.description || `Publikasi resmi IYORA edisi ${newsletter.edition}. Silakan buka dokumen pratinjau untuk melihat isi lengkap buletin.`}
                    </p>

                    {/* Topic tags */}
                    {newsletter.tags && newsletter.tags.length > 0 && (
                      <div className="pt-2">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          Topik Utama
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {newsletter.tags.map((tag) => (
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
                      onClick={() => setViewMode("preview")}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-bold text-xs shadow-md hover:bg-primary-dark transition-all cursor-pointer"
                    >
                      <BookOpen size={15} />
                      <span>Buka Preview Dokumen</span>
                    </button>
                    <button
                      onClick={() => setActivePdfModal(newsletter)}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-800 font-bold text-xs hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      <Eye size={15} className="text-primary" />
                      <span>{t("expand_fullscreen")}</span>
                    </button>
                    {newsletter.file_url && newsletter.file_url !== "#" && (
                      <a
                        href={newsletter.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition-all"
                      >
                        <ExternalLink size={14} />
                        <span>Buka di Tab Baru</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── PDF Interactive Preview Modal ── */}
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

            {/* Modal PDF Viewer / Iframe */}
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
