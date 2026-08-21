"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion, type Variants } from "framer-motion";
import {
  Calendar,
  ArrowRight,
  Newspaper,
  Megaphone,
  FileText,
  Images,
  ImageOff,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import type { NewsArticle, GalleryItem } from "@/lib/supabase";

interface HomeNewsSectionProps {
  news: NewsArticle[];
  announcements: NewsArticle[];
  pressRelease?: NewsArticle[];
  gallery: GalleryItem[];
}

type TabKey = "all" | "news" | "announcements" | "press_release" | "gallery";

function formatDate(dateStr: string | null, locale: string = "id"): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0, 0, 1] } },
};

export default function HomeNewsSection({
  news,
  announcements,
  pressRelease = [],
  gallery,
}: HomeNewsSectionProps) {
  const locale = useLocale();
  const isEn = locale === "en";
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const totalCount = pressRelease.length + gallery.length;

  if (totalCount === 0) return null;

  // Filter items based on active tab
  let displayPressRelease: NewsArticle[] = [];
  let displayGallery: GalleryItem[] = [];

  if (activeTab === "all") {
    displayPressRelease = pressRelease.slice(0, 3);
    displayGallery = gallery.slice(0, 6);
  } else if (activeTab === "press_release") {
    displayPressRelease = pressRelease;
  } else if (activeTab === "gallery") {
    displayGallery = gallery;
  }

  const tabs: { key: TabKey; label: string; count: number; icon: React.ElementType }[] = [
    { key: "all", label: isEn ? "All" : "Semua", count: totalCount, icon: Newspaper },
  ];

  if (pressRelease.length > 0) {
    tabs.push({ key: "press_release", label: isEn ? "Press Release" : "Siaran Pers", count: pressRelease.length, icon: FileText });
  }

  if (gallery.length > 0) {
    tabs.push({ key: "gallery", label: isEn ? "Gallery" : "Galeri", count: gallery.length, icon: Images });
  }

  return (
    <section className="py-16 md:py-24 bg-white relative border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-primary mb-4">
            {isEn ? "Official Press Release & Activity Gallery" : "Siaran Pers Resmi & Galeri Kegiatan"}
          </h2>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map(({ key, label, count, icon: Icon }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/25 scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                }`}
              >
                <Icon size={15} />
                <span>{label}</span>
                {count > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Container */}
        <div className="min-h-[300px]">
          {/* PRESS RELEASE SECTION (Foto Full Layout) */}
          {(activeTab === "all" || activeTab === "press_release") &&
            displayPressRelease.length > 0 && (
              <div className="mb-14">
                {activeTab === "all" && (
                  <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-gray-900 font-bold text-xl">
                      <FileText className="text-primary" size={20} />
                      <span>{isEn ? "Official Press Release" : "Siaran Pers Resmi"}</span>
                    </div>
                    <Link
                      href={`/${locale}/news?tab=press_release`}
                      className="text-xs md:text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      {isEn ? "View All Press Releases" : "Lihat Semua Siaran Pers"} <ChevronRight size={14} />
                    </Link>
                  </div>
                )}
                <motion.div
                  key={`press-release-grid-${activeTab}`}
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  {displayPressRelease.map((article) => (
                    <motion.div key={article.id} variants={itemVariants}>
                      <PressReleaseCard article={article} locale={locale} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}

          {/* GALLERY SECTION */}
          {(activeTab === "all" || activeTab === "gallery") && displayGallery.length > 0 && (
            <div className="mb-12">
              {activeTab === "all" && (
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-900 font-bold text-xl">
                    <Images className="text-primary" size={20} />
                    <span>{isEn ? "Activity Gallery" : "Galeri Kegiatan"}</span>
                  </div>
                  <Link
                    href={`/${locale}/news?tab=gallery`}
                    className="text-xs md:text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    {isEn ? "View All Gallery" : "Lihat Semua Galeri"} <ChevronRight size={14} />
                  </Link>
                </div>
              )}
              <motion.div
                key={`gallery-grid-${activeTab}`}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {displayGallery.map((item) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <ArticleCard article={item} badge={isEn ? "Gallery" : "Galeri"} locale={locale} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </div>

        {/* View All Button Footer */}
        <div className="text-center mt-8">
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            <span>{isEn ? "Explore All News & Updates" : "Buka Halaman News & Galeri Selengkapnya"}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Press Release Full Photo Card Sub-component ── */
function PressReleaseCard({
  article,
  locale,
}: {
  article: NewsArticle;
  locale: string;
}) {
  const isEn = locale === "en";
  const slug = article.slug || article.id;
  const coverImage = article.cover_image;
  const excerpt = article.excerpt;
  const publishedAt = article.published_at || article.created_at;

  return (
    <Link
      href={`/${locale}/news/${slug}`}
      className="group relative bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-md hover:shadow-2xl hover:shadow-primary/15 transition-all duration-300 hover:-translate-y-1.5 flex flex-col md:flex-row cursor-pointer"
    >
      {/* Full Photo Frame (Foto Full Tanpa Space) */}
      <div className="relative w-full md:w-1/2 aspect-[16/10] md:aspect-auto min-h-[260px] md:min-h-[340px] bg-gray-900 overflow-hidden flex-shrink-0">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-700 to-indigo-900 flex items-center justify-center">
            <FileText className="w-14 h-14 text-white/30" />
          </div>
        )}

        {/* Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-primary text-white px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-md uppercase tracking-wide flex items-center gap-1.5">
            <FileText size={13} />
            {isEn ? "Official Press Release" : "Siaran Pers Resmi"}
          </span>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-6 md:p-8 flex flex-col justify-between flex-1 bg-white">
        <div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3 font-semibold">
            <div className="flex items-center gap-1.5 text-primary font-bold">
              <Calendar size={14} />
              <time>{formatDate(publishedAt, locale)}</time>
            </div>
            {article.author && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-gray-600">{article.author}</span>
              </>
            )}
          </div>

          <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-3 leading-snug group-hover:text-primary transition-colors">
            {article.title}
          </h3>

          {excerpt && (
            <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed mb-6 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
              {excerpt}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs md:text-sm shadow-md shadow-primary/20 group-hover:bg-primary-dark transition-all">
            <span>{isEn ? "Read Full Press Release" : "Baca Siaran Pers Selengkapnya"}</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Article Card Sub-component ── */
function ArticleCard({
  article,
  badge,
  locale,
}: {
  article: NewsArticle | GalleryItem;
  badge: string;
  locale: string;
}) {
  const slug = ("slug" in article && article.slug) ? article.slug : article.id;
  const coverImage = article.cover_image || ("image_url" in article ? article.image_url : null);
  const excerpt = article.excerpt || ("description" in article ? article.description : null);
  const publishedAt = ("published_at" in article && article.published_at)
    ? article.published_at
    : article.created_at;

  return (
    <Link
      href={`/${locale}/news/${slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-md hover:shadow-xl hover:shadow-primary/15 transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full cursor-pointer"
    >
      {/* Frame Foto (Top Image Container) */}
      <div className="relative w-full aspect-[16/10] bg-gray-900 overflow-hidden flex-shrink-0">
        {coverImage ? (
          <>
            {/* Soft Ambient Blur Backdrop */}
            <Image
              src={coverImage}
              alt=""
              fill
              aria-hidden="true"
              className="object-cover blur-md scale-110 opacity-30"
            />
            {/* Main Foto menyesuaikan frame */}
            <Image
              src={coverImage}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-700 to-indigo-900 flex items-center justify-center">
            <Newspaper className="w-10 h-10 text-white/30" />
          </div>
        )}

        {/* Top Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold text-primary shadow-md uppercase tracking-wide">
            {badge}
          </span>
        </div>
      </div>

      {/* Content Section Below Image Frame */}
      <div className="p-5 flex flex-col justify-between flex-1 bg-white">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2 font-semibold">
            <Calendar size={13} className="text-primary" />
            <time>{formatDate(publishedAt, locale)}</time>
          </div>

          <h3 className="text-base font-extrabold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {article.title}
          </h3>

          {excerpt && (
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
              {excerpt}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-primary pt-3 border-t border-gray-100 group-hover:translate-x-1 transition-transform">
          <span>{locale === "en" ? "Read More" : "Baca Selengkapnya"}</span>
          <ArrowRight size={13} />
        </div>
      </div>
    </Link>
  );
}

