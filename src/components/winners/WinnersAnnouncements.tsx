"use client";

import { useTranslations, useLocale } from "next-intl";
import { FileText, Download, Calendar, Users, Award, ExternalLink, ShieldCheck } from "lucide-react";
import { WinnerAnnouncementDoc } from "@/data/dummyWinners";

interface WinnersAnnouncementsProps {
  announcements: WinnerAnnouncementDoc[];
}

export default function WinnersAnnouncements({ announcements }: WinnersAnnouncementsProps) {
  const t = useTranslations("winners_page");
  const locale = useLocale();

  if (!announcements || announcements.length === 0) return null;

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

                {/* Meta info: participants & medals */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-gray-50 border border-gray-100">
                    <Users size={14} className="text-primary/70" />
                    <div>
                      <span className="text-[10px] text-gray-400 block">{t("sk_participants")}</span>
                      <span className="font-bold text-gray-800">{doc.totalParticipants.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-gray-50 border border-gray-100">
                    <Award size={14} className="text-amber-500" />
                    <div>
                      <span className="text-[10px] text-gray-400 block">{t("sk_medals")}</span>
                      <span className="font-bold text-gray-800">{doc.totalMedals}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                  <Calendar size={12} />
                  <span>{doc.publishDate}</span>
                </div>
                <a
                  href={doc.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark shadow-sm transition-all group-hover:shadow-primary/20"
                >
                  <Download size={13} />
                  <span>{t("sk_download_btn")}</span>
                  <ExternalLink size={11} className="opacity-70" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
