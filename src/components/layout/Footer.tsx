"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";


const COMPETITIONS = [
  { name: "NYBO", url: "https://nybo.iyora.or.id" },
  { name: "IYBO", url: "https://iybo.iyora.or.id" },
  { name: "NYPO", url: "https://nypo.iyora.or.id" },
  { name: "IYPO", url: "https://iypo.iyora.or.id" },
  { name: "NYCO", url: "https://nyco.iyora.or.id" },
  { name: "IYCO", url: "https://iyco.iyora.or.id" },
  { name: "NYMO", url: "https://nymo.iyora.or.id" },
  { name: "IYMO", url: "https://iymo.iyora.or.id" },
  { name: "IYGO", url: "https://iygo.iyora.or.id" },
  { name: "IYEO", url: "https://iyeo.iyora.or.id" },
  { name: "OS2MN", url: "https://os2mn.iyora.or.id" },
  { name: "WSO", url: "https://wso.iyora.or.id" },
];

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  const href = (path: string) => `/${locale}${path}`;

  return (
    <footer style={{ backgroundColor: "#1a0a2e" }} className="text-white">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Logo + tagline */}
          <div className="md:col-span-1">
            <Image
              src="https://res.cloudinary.com/dvcufsiy1/image/upload/v1782429397/IYORA_BRAND_GUIDELINE_a6kwif.png"
              alt="IYORA"
              width={130}
              height={40}
              className="object-contain h-10 w-auto brightness-0 invert mb-4"
            />
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              {t("tagline")}
            </p>
            <div className="flex gap-3 mt-6">
              <a href="https://www.instagram.com/iyora.official" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Competitions */}
          <div>
            <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider mb-4">
              {t("competitions")}
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {COMPETITIONS.map((c) => (
                <li key={c.name}>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/50 hover:text-teal transition-colors"
                  >
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: About */}
          <div>
            <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider mb-4">
              {t("about_us")}
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href={href("/about")}
                  className="text-sm text-white/50 hover:text-teal transition-colors"
                >
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link
                  href={href("/about")}
                  className="text-sm text-white/50 hover:text-teal transition-colors"
                >
                  {t("vision")}
                </Link>
              </li>
              <li>
                <Link
                  href={href("/about")}
                  className="text-sm text-white/50 hover:text-teal transition-colors"
                >
                  {t("team")}
                </Link>
              </li>
              <li>
                <Link
                  href={href("/partners")}
                  className="text-sm text-white/50 hover:text-teal transition-colors"
                >
                  {t("partners_label")}
                </Link>
              </li>
              <li>
                <Link
                  href={href("/winners")}
                  className="text-sm text-white/50 hover:text-teal transition-colors"
                >
                  {t("winners_label")}
                </Link>
              </li>
              <li>
                <Link
                  href={href("/sk")}
                  className="text-sm text-white/50 hover:text-teal transition-colors"
                >
                  {t("sk_label")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Social / Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider mb-4">
              {t("follow")}
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="https://www.instagram.com/iyora.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/50 hover:text-teal transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@iyoraolympiad?si=8svhUizyVsl6ptvc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/50 hover:text-teal transition-colors"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-white/50 hover:text-teal transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <Link
                  href={href("/contact")}
                  className="text-sm text-white/50 hover:text-teal transition-colors"
                >
                  {t("about")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">{t("copyright")}</p>
          <p className="text-xs text-white/30 flex items-center gap-1.5">
            <span
              className="inline-block w-4 h-4 rounded-full"
              style={{ backgroundColor: "#39bcbe" }}
            />
            {t("born")}
          </p>
        </div>
      </div>
    </footer>
  );
}
