import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchNewsBySlug, fetchAllNews } from "@/lib/supabase";
import { Calendar, User, ArrowLeft, ExternalLink, Share2, Tag, ChevronRight, Newspaper, Megaphone, Images } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchNewsBySlug(slug);

  if (!article) {
    return {
      title: "Berita Tidak Ditemukan - IYORA",
    };
  }

  return {
    title: `${article.title} - IYORA`,
    description: article.excerpt ?? "Informasi terbaru dari IYORA Science Olympiad.",
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.cover_image ? [article.cover_image] : [],
    },
  };
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function estimateReadingTime(text: string | null): string {
  if (!text) return "1 min baca";
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min baca`;
}

function getYouTubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.includes("youtube.com/embed/")) return url;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const article = await fetchNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  const { news, announcements, gallery } = await fetchAllNews();
  const galleryAsArticles = gallery.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug || item.id,
    excerpt: item.excerpt || item.description,
    content: item.content ?? null,
    cover_image: item.cover_image || item.image_url,
    category: "gallery" as const,
    published_at: item.published_at || item.created_at,
    created_at: item.created_at,
    external_link: item.external_link,
    author: item.author ?? "IyoraOlympiade",
  }));

  const allArticles = [...news, ...announcements, ...galleryAsArticles];
  const relatedArticles = allArticles
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);

  const isAnnouncement = article.category === "announcement";
  const isGallery = article.category === "gallery";
  const categoryLabel = isGallery ? "Galeri" : isAnnouncement ? "Pengumuman" : "Berita";
  const youtubeEmbedUrl = getYouTubeEmbedUrl(article.external_link);

  return (
    <article className="min-h-screen bg-gray-50/50 pt-28 pb-24">
      {/* ── Breadcrumb & Top Bar ── */}
      <div className="max-w-4xl mx-auto px-6 mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 overflow-x-auto py-2">
          <Link href={`/${locale}`} className="hover:text-primary transition-colors flex-shrink-0">
            Beranda
          </Link>
          <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
          <Link href={`/${locale}/news${isGallery ? "?tab=gallery" : isAnnouncement ? "?tab=announcements" : ""}`} className="hover:text-primary transition-colors flex-shrink-0">
            {isGallery ? "Galeri" : "Berita & Pengumuman"}
          </Link>
          <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
          <span className="text-gray-900 font-medium truncate">{article.title}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Main Card Container */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
          {/* Cover Image */}
          {article.cover_image && (
            <div className="relative aspect-[21/9] w-full bg-gray-900 overflow-hidden">
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                priority
                className="object-cover opacity-95"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute top-6 left-6">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-full shadow-lg tracking-wide uppercase">
                  {isGallery ? <Images size={13} /> : isAnnouncement ? <Megaphone size={13} /> : <Newspaper size={13} />}
                  {categoryLabel}
                </span>
              </div>
            </div>
          )}

          {/* Article Header & Body */}
          <div className="p-6 md:p-12">
            {!article.cover_image && (
              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-full shadow-sm tracking-wide uppercase">
                  {isGallery ? <Images size={13} /> : isAnnouncement ? <Megaphone size={13} /> : <Newspaper size={13} />}
                  {categoryLabel}
                </span>
              </div>
            )}

            {/* Meta details */}
            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100 font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar size={15} className="text-primary" />
                <time>{formatDate(article.published_at ?? article.created_at)}</time>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <User size={15} className="text-primary" />
                <span>{article.author || "IyoraOlympiade"}</span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="bg-gray-100 px-2.5 py-0.5 rounded-full text-xs text-gray-600 font-semibold">
                {estimateReadingTime(article.content)}
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Excerpt Lead */}
            {article.excerpt && (
              <div className="p-5 md:p-6 bg-gradient-to-r from-primary/5 to-teal/5 rounded-2xl border-l-4 border-primary mb-8">
                <p className="text-base md:text-lg font-medium text-gray-800 leading-relaxed italic">
                  &ldquo;{article.excerpt}&rdquo;
                </p>
              </div>
            )}

            {/* Embedded Video Player if YouTube link exists */}
            {youtubeEmbedUrl && (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 mb-8 bg-black">
                <iframe
                  src={youtubeEmbedUrl}
                  title={article.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Content Body */}
            {article.content && (
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4 mb-10 text-base md:text-lg">
                {article.content.split("\n\n").map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {/* External Link CTA (supports website link options) */}
            {( (article.external_link && article.external_link.startsWith("http")) ||
               (article.external_link2 && article.external_link2.startsWith("http")) ||
               (article.external_link3 && article.external_link3.startsWith("http")) ||
               (article.external_link4 && article.external_link4.startsWith("http")) ||
               (article.external_link5 && article.external_link5.startsWith("http")) ) && (
              <div className="my-8 p-6 bg-gradient-to-br from-primary/5 via-teal/5 to-purple-50 rounded-2xl border border-primary/20">
                <div className="mb-4">
                  <h4 className="font-bold text-gray-900 text-base mb-1">
                    Tautan Website Resmi & Terkait
                  </h4>
                  <p className="text-xs text-gray-500">
                    Silakan pilih opsi tautan website di bawah ini untuk mengakses berita resmi atau portal pendaftaran.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {/* Opsi Link 1 */}
                  {article.external_link && article.external_link.startsWith("http") && (
                    <a
                      href={article.external_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-full shadow-md shadow-primary/20 transition-all cursor-pointer"
                    >
                      <span>{article.external_link_label || (youtubeEmbedUrl ? "Tonton di YouTube" : "Opsi 1: Website Utama / Media")}</span>
                      <ExternalLink size={16} />
                    </a>
                  )}

                  {/* Opsi Link 2 */}
                  {article.external_link2 && article.external_link2.startsWith("http") && (
                    <a
                      href={article.external_link2}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-teal hover:bg-teal-600 text-white font-semibold text-sm rounded-full shadow-md shadow-teal-500/20 transition-all cursor-pointer"
                    >
                      <span>{article.external_link2_label || "Opsi 2: Portal Pendaftaran / Website Resmi"}</span>
                      <ExternalLink size={16} />
                    </a>
                  )}

                  {/* Opsi Link 3 */}
                  {article.external_link3 && article.external_link3.startsWith("http") && (
                    <a
                      href={article.external_link3}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-full shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                    >
                      <span>{article.external_link3_label || "Opsi 3: Portal Pendaftaran"}</span>
                      <ExternalLink size={16} />
                    </a>
                  )}

                  {/* Opsi Link 4 */}
                  {article.external_link4 && article.external_link4.startsWith("http") && (
                    <a
                      href={article.external_link4}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm rounded-full shadow-md shadow-violet-500/20 transition-all cursor-pointer"
                    >
                      <span>{article.external_link4_label || "Opsi 4: Portal Pendaftaran"}</span>
                      <ExternalLink size={16} />
                    </a>
                  )}

                  {/* Opsi Link 5 */}
                  {article.external_link5 && article.external_link5.startsWith("http") && (
                    <a
                      href={article.external_link5}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-full shadow-md shadow-rose-500/20 transition-all cursor-pointer"
                    >
                      <span>{article.external_link5_label || "Opsi 5: Portal Pendaftaran"}</span>
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Navigation back */}
            <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
              <Link
                href={`/${locale}/news`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Kembali ke Berita</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Related Articles Section ── */}
        {relatedArticles.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              Berita & Pengumuman Lainnya
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((item) => (
                <Link
                  key={item.id}
                  href={`/${locale}/news/${item.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
                >
                  {item.cover_image && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={item.cover_image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                      <Calendar size={12} />
                      <span>{formatDate(item.published_at ?? item.created_at)}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2 flex-1">
                      {item.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

