"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { LayoutGrid, Newspaper, Megaphone, Images, Calendar, ArrowRight, ImageOff, ExternalLink, X } from "lucide-react";
import clsx from "clsx";
import type { NewsArticle, GalleryItem } from "@/lib/supabase";

type TabKey = "all" | "news" | "announcements" | "gallery";

interface NewsTabsProps {
  news: NewsArticle[];
  announcements: NewsArticle[];
  gallery: GalleryItem[];
}

const TAB_ICONS = {
  all: LayoutGrid,
  news: Newspaper,
  announcements: Megaphone,
  gallery: Images,
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}



/* ── Article Card ── */
function ArticleCard({
  article,
  badge,
}: {
  article: NewsArticle;
  badge?: string;
}) {
  const locale = useLocale();

  return (
    <Link
      href={`/${locale}/news/${article.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full cursor-pointer"
    >
      {/* Cover image */}
      {article.cover_image ? (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          {badge && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
              {badge}
            </div>
          )}
        </div>
      ) : (
        <div className="relative aspect-[16/9] bg-gradient-to-br from-primary/5 to-teal/5 flex items-center justify-center">
          <ImageOff className="w-10 h-10 text-gray-300" />
          {badge && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
              {badge}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
          <Calendar size={12} />
          <time>{formatDate(article.published_at ?? article.created_at)}</time>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {article.title}
        </h3>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed mb-4 flex-1">
            {article.excerpt}
          </p>
        )}

        {/* Read more */}
        <div className="flex items-center gap-1 text-sm font-semibold text-primary mt-auto pt-2 group-hover:translate-x-1 transition-transform">
          <span>Selengkapnya</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
}

/* ── Gallery Card ── */
function GalleryCard({ item }: { item: GalleryItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={item.image_url}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div>
            <h4 className="text-white font-semibold text-sm line-clamp-2">{item.title}</h4>
            {item.description && (
              <p className="text-white/70 text-xs mt-1 line-clamp-1">{item.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={item.image_url}
              alt={item.title}
              width={1200}
              height={800}
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />
            <div className="text-center mt-3">
              <h4 className="text-white font-semibold">{item.title}</h4>
              {item.description && (
                <p className="text-white/60 text-sm mt-1">{item.description}</p>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-3 -right-3 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Empty State ── */
function EmptyState({ tab, t }: { tab: TabKey; t: ReturnType<typeof useTranslations> }) {
  const Icon = TAB_ICONS[tab];
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
        <Icon className="w-9 h-9 text-primary/40" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{t("empty_title")}</h3>
      <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
        {t(`empty_${tab}`)}
      </p>
    </div>
  );
}

/* ── Main Tabs Component ── */
export default function NewsTabs({ news, announcements, gallery }: NewsTabsProps) {
  const t = useTranslations("news_page");
  const searchParams = useSearchParams();

  const validTabs: TabKey[] = ["all", "news", "announcements", "gallery"];
  const tabParam = searchParams.get("tab") as TabKey | null;
  const initialTab = tabParam && validTabs.includes(tabParam) ? tabParam : "all";
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  // Sync tab when URL changes (e.g. navigating from navbar dropdown)
  useEffect(() => {
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabParam]);

  const totalCount = news.length + announcements.length + gallery.length;

  const tabs: { key: TabKey; count: number }[] = [
    { key: "all", count: totalCount },
    { key: "news", count: news.length },
    { key: "announcements", count: announcements.length },
    { key: "gallery", count: gallery.length },
  ];

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Tab buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map(({ key, count }) => {
            const Icon = TAB_ICONS[key];
            const isActive = activeTab === key;

            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={clsx(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/25 scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                )}
              >
                <Icon size={16} />
                <span>{t(`tab_${key}`)}</span>
                {count > 0 && (
                  <span
                    className={clsx(
                      "text-xs px-2 py-0.5 rounded-full font-bold",
                      isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="min-h-[300px]">
          {/* VIEW ALL (Semua) */}
          {activeTab === "all" && (
            totalCount > 0 ? (
              <div className="space-y-16">
                {/* News Section */}
                {news.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Newspaper className="text-primary" size={22} />
                        <h2 className="text-2xl font-bold text-gray-900">
                          {t("tab_news")}
                        </h2>
                      </div>
                      <button
                        onClick={() => setActiveTab("news")}
                        className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Lihat semua berita <ArrowRight size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {news.slice(0, 3).map((article) => (
                        <ArticleCard
                          key={article.id}
                          article={article}
                          badge="Berita"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Announcements Section */}
                {announcements.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Megaphone className="text-primary" size={22} />
                        <h2 className="text-2xl font-bold text-gray-900">
                          {t("tab_announcements")}
                        </h2>
                      </div>
                      <button
                        onClick={() => setActiveTab("announcements")}
                        className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Lihat semua pengumuman <ArrowRight size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {announcements.slice(0, 3).map((article) => (
                        <ArticleCard
                          key={article.id}
                          article={article}
                          badge="Pengumuman"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Gallery Section */}
                {gallery.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Images className="text-primary" size={22} />
                        <h2 className="text-2xl font-bold text-gray-900">
                          {t("tab_gallery")}
                        </h2>
                      </div>
                      <button
                        onClick={() => setActiveTab("gallery")}
                        className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Lihat semua galeri <ArrowRight size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {gallery.slice(0, 4).map((item) => (
                        <GalleryCard key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState tab="all" t={t} />
            )
          )}

          {/* News Tab */}
          {activeTab === "news" && (
            news.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                  />
                ))}
              </div>
            ) : (
              <EmptyState tab="news" t={t} />
            )
          )}

          {/* Announcements Tab */}
          {activeTab === "announcements" && (
            announcements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {announcements.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    badge="Pengumuman"
                  />
                ))}
              </div>
            ) : (
              <EmptyState tab="announcements" t={t} />
            )
          )}

          {/* Gallery Tab */}
          {activeTab === "gallery" && (
            gallery.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((item) => (
                  <GalleryCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <EmptyState tab="gallery" t={t} />
            )
          )}
        </div>
      </div>
    </section>
  );
}

