"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { LayoutGrid, Newspaper, Megaphone, FileText, Images, Calendar, ArrowRight, ImageOff, ExternalLink, X } from "lucide-react";
import clsx from "clsx";
import type { NewsArticle, GalleryItem } from "@/lib/supabase";

type TabKey = "all" | "news" | "announcements" | "press_release" | "gallery";

interface NewsTabsProps {
  news: NewsArticle[];
  announcements: NewsArticle[];
  pressRelease?: NewsArticle[];
  gallery: GalleryItem[];
}

const TAB_ICONS = {
  all: LayoutGrid,
  news: Newspaper,
  announcements: Megaphone,
  press_release: FileText,
  gallery: Images,
};

function formatDate(dateStr: string | null, locale: string = "id"): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
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
  article: NewsArticle | GalleryItem;
  badge?: string;
}) {
  const locale = useLocale();
  const slug = ("slug" in article && article.slug) ? article.slug : article.id;
  const coverImage = article.cover_image || ("image_url" in article ? article.image_url : null);
  const excerpt = article.excerpt || ("description" in article ? article.description : null);
  const publishedAt = ("published_at" in article && article.published_at)
    ? article.published_at
    : article.created_at;

  const displayBadge = badge
    ? locale === "en"
      ? badge === "Berita" ? "News" : badge === "Pengumuman" ? "Announcement" : badge === "Siaran Pers" ? "Press Release" : badge === "Galeri" ? "Gallery" : badge
      : badge
    : undefined;

  return (
    <Link
      href={`/${locale}/news/${slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative rounded-2xl overflow-hidden border border-gray-200/80 shadow-md hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between min-h-[380px] cursor-pointer"
    >
      {/* Full Card Background Image */}
      {coverImage ? (
        <Image
          src={coverImage}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-700 to-indigo-900" />
      )}

      {/* Soft Gradient Overlay for brightness */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

      {/* Top Badge */}
      <div className="relative z-10 p-3.5 flex items-start justify-between">
        {displayBadge && (
          <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold text-primary shadow-md uppercase tracking-wide">
            {displayBadge}
          </span>
        )}
      </div>

      {/* Bright Translucent Content Glass Panel ("Kotak Putih Cerah & Transparan") */}
      <div className="relative z-10 m-3 p-4 rounded-xl bg-white/75 backdrop-blur-md border border-white/80 shadow-md text-gray-900 flex flex-col justify-between transition-all duration-300 group-hover:bg-white/90">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2 font-semibold">
            <Calendar size={13} className="text-primary" />
            <time>{formatDate(publishedAt, locale)}</time>
          </div>

          <h3 className="text-base font-extrabold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {article.title}
          </h3>

          {excerpt && (
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
              {excerpt}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-primary pt-2.5 border-t border-gray-100 group-hover:translate-x-1 transition-transform">
          <span>{locale === "en" ? "Read More" : "Selengkapnya"}</span>
          <ArrowRight size={13} />
        </div>
      </div>
    </Link>
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
export default function NewsTabs({ news, announcements, pressRelease = [], gallery }: NewsTabsProps) {
  const t = useTranslations("news_page");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const validTabs: TabKey[] = ["all", "news", "announcements", "press_release", "gallery"];
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

  const totalCount = news.length + announcements.length + pressRelease.length + gallery.length;

  const tabs: { key: TabKey; count: number }[] = [
    { key: "all", count: totalCount },
    { key: "news", count: news.length },
    { key: "announcements", count: announcements.length },
    { key: "press_release", count: pressRelease.length },
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
                        {locale === "en" ? "View all news" : "Lihat semua berita"} <ArrowRight size={14} />
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
                        {locale === "en" ? "View all announcements" : "Lihat semua pengumuman"} <ArrowRight size={14} />
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

                {/* Press Release Section */}
                {pressRelease.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <FileText className="text-primary" size={22} />
                        <h2 className="text-2xl font-bold text-gray-900">
                          {t("tab_press_release")}
                        </h2>
                      </div>
                      <button
                        onClick={() => setActiveTab("press_release")}
                        className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {locale === "en" ? "View all press releases" : "Lihat semua siaran pers"} <ArrowRight size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pressRelease.slice(0, 3).map((article) => (
                        <ArticleCard
                          key={article.id}
                          article={article}
                          badge="Siaran Pers"
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
                        {locale === "en" ? "View all gallery items" : "Lihat semua galeri"} <ArrowRight size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {gallery.slice(0, 3).map((item) => (
                        <ArticleCard
                          key={item.id}
                          article={item}
                          badge="Galeri"
                        />
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
                    badge="Berita"
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

          {/* Press Release Tab */}
          {activeTab === "press_release" && (
            pressRelease.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pressRelease.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    badge="Siaran Pers"
                  />
                ))}
              </div>
            ) : (
              <EmptyState tab="press_release" t={t} />
            )
          )}

          {/* Gallery Tab */}
          {activeTab === "gallery" && (
            gallery.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map((item) => (
                  <ArticleCard
                    key={item.id}
                    article={item}
                    badge="Galeri"
                  />
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

