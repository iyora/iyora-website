"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Download, Calendar, ShieldCheck, FileCheck } from "lucide-react";
import { WinnerAnnouncementDoc } from "@/data/dummyWinners";

interface WinnersAnnouncementsProps {
  announcements: WinnerAnnouncementDoc[];
}

export default function WinnersAnnouncements({ announcements }: WinnersAnnouncementsProps) {
  const t = useTranslations("winners_page");
  const locale = useLocale();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  if (!announcements || announcements.length === 0) return null;

  const handleDirectDownload = (doc: WinnerAnnouncementDoc) => {
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

      // 2. Google Drive
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
      const downloadUrl = `/api/download-sk?comp=${encodeURIComponent(comp)}&compName=${encodeURIComponent(doc.competitionFullName || doc.title)}&skNumber=${encodeURIComponent(doc.skNumber || "")}&filename=${encodeURIComponent(filename)}`;
      const link = document.createElement("a");
      link.href = downloadUrl;
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
    <section className="py-14 px-6 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck size={14} className="text-teal-600" />
              <span>Dokumen Resmi Puspresnas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {t("sk_section_title")}
            </h2>
            <p className="text-sm text-gray-600 mt-1 max-w-xl">
              {t("sk_section_desc")}
            </p>
          </div>
        </div>

        {/* SK Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {announcements.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                    {doc.competition}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {doc.badge}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
                  {locale === "en" ? doc.title_en : doc.title}
                </h3>

                <p className="text-[11px] font-mono text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 mb-4 truncate">
                  No: {doc.skNumber}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                  <Calendar size={12} />
                  <span>{doc.publishDate}</span>
                </div>
                <button
                  onClick={() => handleDirectDownload(doc)}
                  disabled={downloadingId === doc.id}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark shadow-sm transition-all group-hover:shadow-primary/20 cursor-pointer active:scale-95 disabled:opacity-75"
                >
                  {downloadingId === doc.id ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download size={13} />
                  )}
                  <span>
                    {downloadingId === doc.id
                      ? (locale === "en" ? "Downloading..." : "Mengunduh...")
                      : t("sk_download_btn")}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

