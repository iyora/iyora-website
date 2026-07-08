"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Menu, X, ChevronDown } from "lucide-react";
import clsx from "clsx";

const OLYMPIADS = [
  { name: "NYBO", emoji: "🧬", full: "National Youth Biology" },
  { name: "IYBO", emoji: "🧬", full: "International Youth Biology" },
  { name: "NYPO", emoji: "⚛️", full: "National Youth Physics" },
  { name: "IYPO", emoji: "⚛️", full: "International Youth Physics" },
  { name: "NYCO", emoji: "🧪", full: "National Youth Chemistry" },
  { name: "IYCO", emoji: "🧪", full: "International Youth Chemistry" },
  { name: "NYMO", emoji: "➗", full: "National Youth Mathematics" },
  { name: "IYMO", emoji: "➗", full: "International Youth Mathematics" },
  { name: "IYGO", emoji: "🌍", full: "International Youth Geography" },
  { name: "IYEO", emoji: "🌱", full: "International Youth Environment" },
  { name: "OS2MN", emoji: "🕌", full: "Olimpiade Sains Madrasah" },
  { name: "WSO", emoji: "🏆", full: "World Science Olympiad" },
];

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openDropdown() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropdownOpen(true);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 150);
  }

  const otherLocale = locale === "id" ? "en" : "id";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClass = clsx(
    "text-sm font-medium transition-colors duration-200 hover:opacity-80",
    scrolled || mobileOpen ? "text-gray-800" : "text-white"
  );

  const href = (path: string) => `/${locale}${path}`;

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white shadow-md shadow-black/5"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={href("/")} className="flex-shrink-0">
          <Image
            src="https://res.cloudinary.com/dvcufsiy1/image/upload/v1782429397/IYORA_BRAND_GUIDELINE_a6kwif.png"
            alt="IYORA"
            width={140}
            height={40}
            priority
            className={clsx(
              "object-contain h-7 md:h-10 w-auto transition-all duration-300",
              !scrolled && "brightness-0 invert"
            )}
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href={href("/about")} className={navLinkClass}>
            {t("about")}
          </Link>

          {/* Competitions dropdown */}
          <div
            className="relative"
            onMouseEnter={openDropdown}
            onMouseLeave={scheduleClose}
          >
            <button
              className={clsx(
                navLinkClass,
                "flex items-center gap-1 cursor-pointer"
              )}
            >
              {t("competitions")}
              <ChevronDown
                size={14}
                className={clsx(
                  "transition-transform duration-200",
                  dropdownOpen && "rotate-180"
                )}
              />
            </button>

            {/* pt-2 bridges the gap so hover stays continuous — no mt-2 */}
            <div
              className={clsx(
                "absolute top-full left-1/2 -translate-x-1/2 w-[480px] pt-2 transition-all duration-200",
                dropdownOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
              )}
            >
              <div className="bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100 p-4 grid grid-cols-2 gap-1">
                {OLYMPIADS.map((o) => (
                  <Link
                    key={o.name}
                    href={href("/competitions")}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-lg leading-none">{o.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors">
                        {o.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{o.full}</p>
                    </div>
                  </Link>
                ))}
                <div className="col-span-2 pt-2 mt-1 border-t border-gray-100">
                  <Link
                    href={href("/competitions")}
                    className="flex items-center justify-center w-full py-2 text-sm font-semibold text-primary hover:underline"
                  >
                    View All Competitions →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Link href={href("/news")} className={navLinkClass}>
            {t("news")}
          </Link>
          <Link href={href("/partners")} className={navLinkClass}>
            {t("partners")}
          </Link>
          <Link href={href("/contact")} className={navLinkClass}>
            {t("contact")}
          </Link>

          {/* Language switcher */}
          <Link
            href={`/${otherLocale}`}
            className={clsx(
              "text-xs font-bold px-3 py-1.5 rounded-full border transition-all duration-200",
              scrolled
                ? "border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
                : "border-white/60 text-white hover:border-white hover:bg-white/10"
            )}
          >
            {otherLocale.toUpperCase()}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className={clsx("md:hidden p-2 rounded-lg", navLinkClass)}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            <Link
              href={href("/about")}
              className="py-3 text-gray-800 font-medium border-b border-gray-50 hover:text-primary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {t("about")}
            </Link>
            <Link
              href={href("/competitions")}
              className="py-3 text-gray-800 font-medium border-b border-gray-50 hover:text-primary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {t("competitions")}
            </Link>
            <Link
              href={href("/news")}
              className="py-3 text-gray-800 font-medium border-b border-gray-50 hover:text-primary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {t("news")}
            </Link>
            <Link
              href={href("/partners")}
              className="py-3 text-gray-800 font-medium border-b border-gray-50 hover:text-primary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {t("partners")}
            </Link>
            <Link
              href={href("/contact")}
              className="py-3 text-gray-800 font-medium border-b border-gray-50 hover:text-primary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {t("contact")}
            </Link>
            <div className="pt-3">
              <Link
                href={`/${otherLocale}`}
                className="inline-block text-xs font-bold px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition-all"
                onClick={() => setMobileOpen(false)}
              >
                Switch to {otherLocale.toUpperCase()}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
