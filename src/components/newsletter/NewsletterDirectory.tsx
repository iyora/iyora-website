"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { BookOpen, Sparkles } from "lucide-react";
import type { NewsletterItem } from "@/lib/supabase";

interface NewsletterDirectoryProps {
  newsletters: NewsletterItem[];
}

export default function NewsletterDirectory({ newsletters }: NewsletterDirectoryProps) {
  const t = useTranslations("newsletter_page");
  const locale = useLocale();

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

            {/* Grid of Newsletter Cards - Compact & Full Cover Visible */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {newsletters.map((item) => {
                const detailUrl = `/${locale}/newsletter/${encodeURIComponent(item.slug || item.id)}`;

                return (
                  <Link
                    key={item.id}
                    href={detailUrl}
                    className="group relative flex flex-col w-full rounded-2xl overflow-hidden border border-gray-200/80 bg-white shadow-sm hover:shadow-xl hover:shadow-primary/15 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
                  >
                    {/* Cover Container - Aspect ratio + Ambient blur + Object Contain to show 100% of cover */}
                    <div className="relative aspect-[16/11] w-full bg-slate-900 overflow-hidden flex items-center justify-center">
                      {item.cover_image && !item.cover_image.includes("placeholder") ? (
                        <>
                          {/* Ambient background blur */}
                          <Image
                            src={item.cover_image}
                            alt=""
                            fill
                            aria-hidden="true"
                            className="object-cover blur-lg scale-125 opacity-40"
                          />
                          {/* Main Image Fitted Completely (No Cropping) */}
                          <div className="relative w-full h-full p-2 z-10">
                            <Image
                              src={item.cover_image}
                              alt={item.title || "Newsletter"}
                              fill
                              className="object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-white">
                          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
                            <BookOpen size={24} className="text-amber-300" />
                          </div>
                        </div>
                      )}

                      {/* Edition Badge */}
                      {item.edition && (
                        <div className="absolute top-2.5 left-2.5 z-20">
                          <span className="bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-primary shadow-xs uppercase tracking-wider">
                            {item.edition.split("—")[0].trim()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Compact Card Footer Info */}
                    <div className="p-3.5 flex flex-col justify-between flex-1 bg-white">
                      <h3 className="text-xs md:text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-primary">
                        <span>{locale === "en" ? "Read Issue" : "Baca Edisi"}</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </Link>
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
    </div>
  );
}
