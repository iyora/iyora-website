"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import {
  Download,
  Search,
  Calendar,
  ShieldCheck,
  FileCheck2,
  Filter,
  ArrowRight,
  ExternalLink,
  Award,
  Users,
} from "lucide-react";
import clsx from "clsx";
import { WinnerAnnouncementDoc, OLYMPIAD_CATEGORIES } from "@/data/dummyWinners";

interface SkDirectoryProps {
  announcements: WinnerAnnouncementDoc[];
}

export default function SkDirectory({ announcements }: SkDirectoryProps) {
  const t = useTranslations("sk_page");
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Filtered documents
  const filteredDocs = useMemo(() => {
    return announcements.filter((doc) => {
      // Search filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchComp = (doc.competition || "").toLowerCase().includes(q);
        const matchCompName = (doc.competitionFullName || "").toLowerCase().includes(q);
        const matchTitle = (doc.title || "").toLowerCase().includes(q);
        const matchTitleEn = (doc.title_en || "").toLowerCase().includes(q);
        const matchSk = (doc.skNumber || "").toLowerCase().includes(q);
        if (!matchComp && !matchCompName && !matchTitle && !matchTitleEn && !matchSk) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== "all") {
        const docCat = (doc.category || "").toLowerCase();
        const targetCat = selectedCategory.toLowerCase();
        if (!docCat.includes(targetCat) && !targetCat.includes(docCat)) {
          return false;
        }
      }

      return true;
    });
  }, [announcements, searchQuery, selectedCategory]);

  const handleDownload = (doc: WinnerAnnouncementDoc) => {
    setDownloadingId(doc.id);
    try {
      const comp = doc.competition || "IYORA";
      const filename = `SK_Pemenang_${comp}_2026.pdf`;
      const rawUrl = doc.downloadUrl || "";

      // 1. Local static file in public/
      if (rawUrl && !rawUrl.startsWith("http") && !rawUrl.includes("#")) {
        let cleanPath = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
        if (cleanPath.startsWith("/public/")) {
          cleanPath = cleanPath.slice("/public".length);
        }
        const link = document.createElement("a");
        link.href = cleanPath;
        link.setAttribute("download", filename);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // 2. Google Drive direct export
      if (rawUrl && rawUrl.includes("drive.google.com")) {
        const match =
          rawUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
          rawUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        const gdriveUrl =
          match && match[1]
            ? `https://drive.google.com/uc?export=download&id=${match[1]}`
            : rawUrl;
        window.open(gdriveUrl, "_blank");
        return;
      }

      // 3. Other remote URL
      if (rawUrl && rawUrl.startsWith("http") && !rawUrl.includes("#")) {
        window.open(rawUrl, "_blank");
        return;
      }

      // 4. Fallback generated PDF route
      const fallbackUrl = `/api/download-sk?comp=${encodeURIComponent(comp)}&compName=${encodeURIComponent(doc.competitionFullName || doc.title)}&skNumber=${encodeURIComponent(doc.skNumber || "")}&filename=${encodeURIComponent(filename)}`;
      const link = document.createElement("a");
      link.href = fallbackUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download SK:", err);
    } finally {
      setTimeout(() => {
        setDownloadingId(null);
      }, 1500);
    }
  };

  return (
    <section className="py-14 px-6 bg-gray-50/70 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Search & Category Filter Controls */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm mb-10">
          <div className="flex flex-col lg:flex-row gap-5 items-stretch lg:items-center justify-between">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search_placeholder")}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 text-sm font-medium transition-all outline-none placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 px-2 py-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Results Count & SIMT Notice */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-bold text-gray-500">
                {filteredDocs.length} Dokumen SK
              </span>
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Terakreditasi SIMT</span>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1 shrink-0 mr-1">
              <Filter size={13} />
              Cabang:
            </span>
            <button
              onClick={() => setSelectedCategory("all")}
              className={clsx(
                "px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer",
                selectedCategory === "all"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {t("filter_all")}
            </button>
            {OLYMPIAD_CATEGORIES.filter((c) => c.key !== "all").map((cat) => {
              const active = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={clsx(
                    "px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer",
                    active
                      ? "bg-primary text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {cat.shortName}
                </button>
              );
            })}
          </div>
        </div>

        {/* SK Grid Cards */}
        {filteredDocs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredDocs.map((doc) => {
              const isDownloading = downloadingId === doc.id;
              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Subtle top color bar */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-teal to-emerald-500 opacity-80" />

                  <div>
                    {/* Badges Header */}
                    <div className="flex items-center justify-between gap-2 mb-4 pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20">
                          {doc.competition}
                        </span>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200">
                          {doc.category || "General"}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {doc.badge || "Resmi"}
                      </span>
                    </div>

                    {/* Document Title */}
                    <h3 className="text-base font-extrabold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-3">
                      {locale === "en" ? doc.title_en : doc.title}
                    </h3>

                    {/* Official SK Decree Number */}
                    <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100 mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Nomor Surat Keputusan:
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600">✓ Sah Puspresnas</span>
                      </div>
                      <p className="text-xs font-mono font-bold text-gray-800 truncate">
                        {doc.skNumber}
                      </p>
                    </div>

                    {/* Info Metadata */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-5">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-400 shrink-0" />
                        <span className="text-[11px]">{doc.publishDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-end">
                        <FileCheck2 size={13} className="text-teal-600 shrink-0" />
                        <span className="text-[11px] font-medium">{doc.edition}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Download Button */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold text-gray-400">
                      Format: PDF Resmi
                    </span>
                    <button
                      onClick={() => handleDownload(doc)}
                      disabled={isDownloading}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-primary to-[#2a7590] hover:from-primary-dark hover:to-[#22637a] text-white text-xs font-extrabold shadow-md shadow-primary/20 transition-all cursor-pointer active:scale-95 disabled:opacity-75"
                    >
                      {isDownloading ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Download size={14} />
                      )}
                      <span>{isDownloading ? t("downloading") : t("download_btn")}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search State */
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm max-w-lg mx-auto mb-16">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
              <Search size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Dokumen Tidak Ditemukan</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              {t("no_results")}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all cursor-pointer"
            >
              Reset Pencarian
            </button>
          </div>
        )}

        {/* Bottom Cross-Promotion Banner to Winners Database */}
        <div className="bg-gradient-to-r from-[#1c2e42] via-[#1d4354] to-[#124b45] rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute right-0 top-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 border border-white/15 text-xs font-bold mb-3">
              <Award size={14} />
              <span>Direktori Interaktif Medalis</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
              {t("winners_cta_title")}
            </h3>
            <p className="text-sm text-gray-200 leading-relaxed">
              {t("winners_cta_desc")}
            </p>
          </div>
          <Link
            href={`/${locale}/winners`}
            className="relative z-10 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-[#1d4354] hover:bg-gray-100 text-xs font-black shadow-lg transition-all active:scale-95 shrink-0 group"
          >
            <span>{t("winners_cta_btn")}</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
