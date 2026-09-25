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
  Eye,
  ArrowRight,
  ExternalLink,
  Calendar,
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

      {/* ── 2. Newsletter Cards Grid Section ── */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20 space-y-12">
        {newsletters && newsletters.length > 0 ? (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
                  {t("all_issues_title")}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {t("all_issues_subtitle")} ({newsletters.length} {locale === "en" ? "publications" : "dokumen rilis"})
                </p>
              </div>
            </div>

            {/* Grid of Newsletter Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsletters.map((item) => {
                const detailUrl = `/${locale}/newsletter/${encodeURIComponent(item.slug || item.id)}`;

                return (
                  <div
                    key={item.id}
                    className="group bg-white rounded-3xl overflow-hidden border border-gray-200/90 shadow-md hover:shadow-2xl hover:shadow-primary/15 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between h-full"
                  >
                    {/* Top Cover / Media Banner - Clickable in Same Tab */}
                    <Link
                      href={detailUrl}
                      className="relative block w-full aspect-[16/10] bg-gradient-to-br from-gray-900 via-[#1e3a5f] to-[#122842] overflow-hidden"
                    >
                      {item.cover_image && !item.cover_image.includes("placeholder") ? (
                        <>
                          <Image
                            src={item.cover_image}
                            alt=""
                            fill
                            aria-hidden="true"
                            className="object-cover blur-md scale-110 opacity-30"
                          />
                          <Image
                            src={item.cover_image}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white space-y-2">
                          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
                            <BookOpen size={28} className="text-amber-300" />
                          </div>
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-300">
                            {item.edition}
                          </span>
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                        <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-extrabold text-primary shadow-md uppercase tracking-wider">
                          {item.edition}
                        </span>
                      </div>
                    </Link>

                    {/* Card Content */}
                    <div className="p-6 flex flex-col justify-between flex-1 space-y-4 bg-white">
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                          <Calendar size={13} className="text-primary" />
                          <time>{item.published_at ? item.published_at.slice(0, 10) : "2026-09-25"}</time>
                        </div>

                        {/* Title - Clickable in Same Tab */}
                        <Link
                          href={detailUrl}
                          className="block"
                        >
                          <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                            {item.title}
                          </h3>
                        </Link>

                        {/* Description */}
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {item.description || `Publikasi resmi IYORA edisi ${item.edition}. Klik untuk membaca dokumen lengkap buletin.`}
                        </p>

                        {/* Topic Tags */}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {item.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-bold text-primary bg-primary/5 border border-primary/15 px-2.5 py-0.5 rounded-lg"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                        <Link
                          href={detailUrl}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-primary text-white font-bold text-xs shadow-md shadow-primary/20 hover:bg-primary-dark transition-all group-hover:shadow-lg"
                        >
                          <span>{locale === "en" ? "Read Issue" : "Baca Dokumen"}</span>
                          <ArrowRight size={13} />
                        </Link>

                        <button
                          onClick={() => setActivePdfModal(item)}
                          className="p-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors cursor-pointer"
                          title="Layar Penuh"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Empty State */
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
