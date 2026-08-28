"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Sparkles,
  User,
  Calendar,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  Layers,
  Flame,
  Award,
  BookOpen,
} from "lucide-react";
import { DUMMY_EVENT_POPUPS, type EventPopupData, type EventPopupLink } from "@/data/dummyEventPopup";

const BUTTON_VARIANTS: Record<string, string> = {
  primary: "bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20",
  teal: "bg-teal hover:bg-teal-600 text-white shadow-md shadow-teal-500/20",
  indigo: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20",
  rose: "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20",
  instagram: "bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white shadow-md shadow-pink-500/20",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200",
};

function formatDate(dateStr: string | null, isEn: boolean): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString(isEn ? "en-US" : "id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getSlideShortLabel(id: string, isEn: boolean): string {
  if (id.includes("nso-nsmo-wso")) return isEn ? "All Upcoming" : "Semua Upcoming";
  if (id.includes("nso-2026")) return "NSO 2026";
  if (id.includes("nsmo-2026")) return "NSMO 2026";
  if (id.includes("wso-2026")) return "WSO 2026";
  if (id.includes("awarding")) return "Awarding";
  if (id.includes("opening")) return isEn ? "Opening" : "Pembukaan";
  return isEn ? "Event" : "Kegiatan";
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 320 : -320,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 320 : -320,
    opacity: 0,
  }),
};

export default function EventPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const pathname = usePathname();
  const locale = useLocale();
  const isEn = locale === "en";

  // Active popup slides
  const slides: EventPopupData[] = DUMMY_EVENT_POPUPS.filter((item) => item.isActive);
  const totalSlides = slides.length;
  const currentSlide = slides[currentIndex] || slides[0];

  const isHomepage =
    pathname === "/" ||
    pathname === "/id" ||
    pathname === "/en" ||
    pathname === "/id/" ||
    pathname === "/en/";

  // Auto show on first homepage load
  useEffect(() => {
    if (totalSlides === 0 || !isHomepage) {
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 600);

    return () => clearTimeout(timer);
  }, [pathname, isHomepage, totalSlides]);

  // Handle slide navigation
  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setProgress(0);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setProgress(0);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setProgress(0);
  };

  // Progress Bar and Auto-Play Interval (6s duration)
  useEffect(() => {
    if (!isOpen || isPaused || totalSlides <= 1) return;

    const intervalTime = 6000; // 6s per slide
    const stepTime = 100;
    const progressIncrement = (stepTime / intervalTime) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + progressIncrement;
      });
    }, stepTime);

    return () => clearInterval(timer);
  }, [isOpen, isPaused, totalSlides, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setHasInteracted(true);
      } else if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextSlide, prevSlide]);

  const handleClose = () => {
    setIsOpen(false);
    setHasInteracted(true);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setProgress(0);
  };

  if (totalSlides === 0) return null;

  const badgeText = isEn ? currentSlide.badge_en || currentSlide.badge : currentSlide.badge;
  const titleText = isEn ? currentSlide.title_en || currentSlide.title : currentSlide.title;
  const subtitleText = isEn ? currentSlide.subtitle_en || currentSlide.subtitle : currentSlide.subtitle;
  const contentText = isEn ? currentSlide.content_en || currentSlide.content : currentSlide.content;

  const isUpcomingSlide =
    currentSlide.id.includes("nso") ||
    currentSlide.id.includes("nsmo") ||
    currentSlide.id.includes("wso") ||
    currentSlide.id.includes("upcoming");

  return (
    <>
      {/* 🚀 Floating Quick Trigger Button (When popup is closed) */}
      {!isOpen && isHomepage && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary via-teal-600 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-primary/25 border border-white/20 backdrop-blur-md cursor-pointer transition-transform group"
          aria-label={isEn ? "Open Upcoming Events" : "Buka Info Event Upcoming"}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
          </span>
          <Flame size={16} className="text-amber-300 group-hover:rotate-12 transition-transform" />
          <span className="tracking-wide">
            {isEn ? "Upcoming Events: NSO, NSMO, WSO" : "Event Upcoming: NSO, NSMO, WSO"}
          </span>
        </motion.button>
      )}

      {/* 🌟 Modal Pop Up */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-xl w-full max-h-[92vh] flex flex-col z-10 border border-gray-100 my-auto"
            >
              {/* Close Button Top Right */}
              <button
                onClick={handleClose}
                className="absolute top-3.5 right-3.5 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-110"
                aria-label={isEn ? "Close Pop Up" : "Tutup Pop Up"}
              >
                <X size={18} />
              </button>

              {/* Slide Counter & Mode Badge Top Left */}
              <div className="absolute top-3.5 left-3.5 z-30 flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md text-xs font-bold shadow-md">
                  <Layers size={13} className="text-teal-400" />
                  <span>
                    {currentIndex + 1} / {totalSlides}
                  </span>
                </div>
                {isUpcomingSlide && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 text-white backdrop-blur-md text-[11px] font-extrabold shadow-md uppercase tracking-wider">
                    <Flame size={12} className="text-amber-200" />
                    <span>Upcoming 2026</span>
                  </span>
                )}
              </div>

              {/* Interactive Quick Tabs Selector */}
              {totalSlides > 1 && (
                <div className="bg-gray-900/95 border-b border-gray-800 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar z-20">
                  {slides.map((s, idx) => {
                    const label = getSlideShortLabel(s.id, isEn);
                    const isActiveTab = idx === currentIndex;
                    return (
                      <button
                        key={s.id}
                        onClick={() => goToSlide(idx)}
                        className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                          isActiveTab
                            ? "bg-gradient-to-r from-primary to-teal text-white shadow-md shadow-teal/30 scale-105"
                            : "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Scrollable Modal Content */}
              <div className="overflow-y-auto max-h-[85vh] custom-scrollbar">
                {/* Image Banner Carousel Container */}
                <div className="relative aspect-[16/9] w-full bg-gray-950 overflow-hidden">
                  <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                      key={currentSlide.id}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="absolute inset-0 w-full h-full"
                    >
                      {currentSlide.image && (
                        <Image
                          src={currentSlide.image}
                          alt={titleText}
                          fill
                          priority
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 640px"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                      {/* Badge overlay inside banner */}
                      <div className="absolute bottom-3 left-4 right-14 z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white text-xs font-extrabold rounded-full shadow-lg animate-pulse tracking-wide uppercase max-w-full truncate">
                          <Sparkles size={13} className="flex-shrink-0" />
                          <span className="truncate">{badgeText}</span>
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Carousel Left / Right Buttons */}
                  {totalSlides > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/45 hover:bg-black/80 text-white backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-110"
                        aria-label="Previous Slide"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/45 hover:bg-black/80 text-white backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-110"
                        aria-label="Next Slide"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}

                  {/* Auto-play Progress Bar at banner bottom */}
                  {totalSlides > 1 && !isPaused && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
                      <div
                        className="h-full bg-gradient-to-r from-teal-400 to-amber-400 transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Event Details Body */}
                <AnimatePresence custom={direction} mode="wait">
                  <motion.div
                    key={currentSlide.id + "-body"}
                    custom={direction}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="p-5 sm:p-7"
                  >
                    {/* Meta tags */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500 font-medium mb-3.5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-extrabold uppercase tracking-wider text-[11px] whitespace-nowrap">
                        {isUpcomingSlide ? (
                          <Flame size={13} className="text-amber-500 flex-shrink-0" />
                        ) : (
                          <Megaphone size={13} className="flex-shrink-0" />
                        )}
                        <span>
                          {isUpcomingSlide
                            ? isEn
                              ? "Upcoming Event"
                              : "Event Akan Datang"
                            : isEn
                            ? "Press Release"
                            : "Siaran Pers"}
                        </span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center gap-1.5 whitespace-nowrap text-gray-600">
                        <User size={13} className="text-gray-400 flex-shrink-0" />
                        <span>{currentSlide.author}</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center gap-1.5 whitespace-nowrap text-gray-600">
                        <Calendar size={13} className="text-gray-400 flex-shrink-0" />
                        <span>{formatDate(currentSlide.publishedAt, isEn)}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug mb-2">
                      {titleText}
                    </h3>

                    {/* Subtitle */}
                    {subtitleText && (
                      <p className="text-sm font-semibold text-primary mb-4 leading-relaxed">
                        {subtitleText}
                      </p>
                    )}

                    {/* Description Paragraph */}
                    <div className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100/80">
                      {contentText}
                    </div>

                    {/* Action Links Grid */}
                    {currentSlide.links && currentSlide.links.length > 0 && (
                      <div className="space-y-2.5 pt-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            {isEn ? "Action & Registration Links:" : "Akses Pendaftaran & Informasi:"}
                          </p>
                          <span className="text-[11px] font-semibold text-teal-600 flex items-center gap-1">
                            <Sparkles size={12} />
                            {isEn ? "Official Portals" : "Portal Resmi"}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {currentSlide.links.map((link: EventPopupLink, idx: number) => {
                            const styleClass =
                              BUTTON_VARIANTS[link.variant ?? "primary"] ?? BUTTON_VARIANTS.primary;
                            const labelText = isEn ? link.label_en || link.label : link.label;
                            return (
                              <a
                                key={idx}
                                href={link.url}
                                target={link.url.startsWith("http") ? "_blank" : undefined}
                                rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                                className={`inline-flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${styleClass}`}
                              >
                                <span className="truncate pr-1.5">{labelText}</span>
                                <ExternalLink size={14} className="flex-shrink-0 opacity-80" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Modal Footer with Slide Indicators & Nav Controls */}
              <div className="p-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2 text-xs text-gray-500">
                {/* Pagination Dots */}
                <div className="flex items-center gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentIndex
                          ? "w-6 bg-primary shadow-sm shadow-primary/30"
                          : "w-2 bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>

                {/* Prev / Next & Close Action */}
                <div className="flex items-center gap-3">
                  {totalSlides > 1 && (
                    <div className="flex items-center gap-1 text-gray-400">
                      <button
                        onClick={prevSlide}
                        className="p-1 hover:text-gray-800 rounded transition-colors cursor-pointer"
                        title={isEn ? "Previous Slide" : "Slide Sebelumnya"}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="text-[11px] font-medium text-gray-600">
                        {currentIndex + 1} / {totalSlides}
                      </span>
                      <button
                        onClick={nextSlide}
                        className="p-1 hover:text-gray-800 rounded transition-colors cursor-pointer"
                        title={isEn ? "Next Slide" : "Slide Berikutnya"}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                  <button
                    onClick={handleClose}
                    className="text-gray-600 hover:text-primary font-bold underline cursor-pointer whitespace-nowrap"
                  >
                    {isEn ? "Close" : "Tutup"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
