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
  Images,
  ImageOff,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import type { NewsArticle, GalleryItem } from "@/lib/supabase";

interface HomeNewsSectionProps {
  news: NewsArticle[];
  announcements: NewsArticle[];
  gallery: GalleryItem[];
}

type TabKey = "all" | "news" | "announcements" | "gallery";

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
  gallery,
}: HomeNewsSectionProps) {
  const locale = useLocale();
  const isEn = locale === "en";
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const totalCount = news.length + announcements.length + gallery.length;

  if (totalCount === 0) return null;

  // Filter items based on active tab
  let displayNews: NewsArticle[] = [];
  let displayAnnouncements: NewsArticle[] = [];
  let displayGallery: GalleryItem[] = [];

  if (activeTab === "all") {
    displayNews = news.slice(0, 3);
    displayAnnouncements = announcements.slice(0, 3);
    displayGallery = gallery.slice(0, 3);
  } else if (activeTab === "news") {
    displayNews = news.slice(0, 6);
  } else if (activeTab === "announcements") {
    displayAnnouncements = announcements.slice(0, 6);
  } else if (activeTab === "gallery") {
    displayGallery = gallery.slice(0, 6);
  }

  const tabs: { key: TabKey; label: string; count: number; icon: React.ElementType }[] = [
    { key: "all", label: isEn ? "All" : "Semua", count: totalCount, icon: Newspaper },
    { key: "news", label: isEn ? "News" : "Berita", count: news.length, icon: Newspaper },
    { key: "announcements", label: isEn ? "Announcements" : "Pengumuman", count: announcements.length, icon: Megaphone },
  ];

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
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
            <Megaphone size={14} />
            {isEn ? "News & Announcements" : "Berita & Pengumuman"}
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
            {isEn ? "Latest News & Updates" : "Informasi & Kabar Terbaru"}
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            {isEn
              ? "Stay updated with registration announcements, olympiad news, and latest updates from IYORA."
              : "Simak pengumuman pendaftaran, berita olimpiade, dan update terkini dari IYORA."}
          </p>
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
          {/* TAB ALL or NEWS */}
          {(activeTab === "all" || activeTab === "news") && displayNews.length > 0 && (
            <div className="mb-12">
              {activeTab === "all" && (
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-900 font-bold text-xl">
                    <Newspaper className="text-primary" size={20} />
                    <span>{isEn ? "Latest News" : "Berita Terbaru"}</span>
                  </div>
                  <Link
                    href={`/${locale}/news?tab=news`}
                    className="text-xs md:text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    {isEn ? "View All News" : "Lihat Semua Berita"} <ChevronRight size={14} />
                  </Link>
                </div>
              )}
              <motion.div
                key={`news-grid-${activeTab}`}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {displayNews.map((article) => (
                  <motion.div key={article.id} variants={itemVariants}>
                    <ArticleCard article={article} badge={isEn ? "News" : "Berita"} locale={locale} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {/* TAB ALL or ANNOUNCEMENTS */}
          {(activeTab === "all" || activeTab === "announcements") &&
            displayAnnouncements.length > 0 && (
              <div className="mb-12">
                {activeTab === "all" && (
                  <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-gray-900 font-bold text-xl">
                      <Megaphone className="text-primary" size={20} />
                      <span>{isEn ? "Registration & Schedule Announcements" : "Pengumuman Pendaftaran & Jadwal"}</span>
                    </div>
                    <Link
                      href={`/${locale}/news?tab=announcements`}
                      className="text-xs md:text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      {isEn ? "View All Announcements" : "Lihat Semua Pengumuman"} <ChevronRight size={14} />
                    </Link>
                  </div>
                )}
                <motion.div
                  key={`announcements-grid-${activeTab}`}
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {displayAnnouncements.map((article) => (
                    <motion.div key={article.id} variants={itemVariants}>
                      <ArticleCard article={article} badge={isEn ? "Announcement" : "Pengumuman"} locale={locale} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}

          {/* GALLERY */}
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
            <span>{isEn ? "Explore All News & Updates" : "Buka Halaman News Selengkapnya"}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
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
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full cursor-pointer"
    >
      {/* Cover Image */}
      {coverImage ? (
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
          <Image
            src={coverImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm uppercase tracking-wide">
            {badge}
          </div>
        </div>
      ) : (
        <div className="relative aspect-[16/9] bg-gradient-to-br from-primary/5 via-teal/5 to-purple-50 flex items-center justify-center">
          <ImageOff className="w-10 h-10 text-gray-300" />
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm uppercase tracking-wide">
            {badge}
          </div>
        </div>
      )}

      {/* Details */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2.5 font-medium">
          <Calendar size={13} className="text-primary/70" />
          <time>{formatDate(publishedAt, locale)}</time>
        </div>

        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200 leading-snug">
          {article.title}
        </h3>

        {excerpt && (
          <p className="text-xs md:text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4 flex-1">
            {excerpt}
          </p>
        )}

        <div className="flex items-center gap-1 text-xs md:text-sm font-semibold text-primary mt-auto pt-3 border-t border-gray-50 group-hover:translate-x-1 transition-transform">
          <span>{locale === "en" ? "Read More" : "Baca Selengkapnya"}</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
}

