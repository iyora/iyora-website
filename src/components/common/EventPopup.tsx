"use client";

import { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { DUMMY_EVENT_POPUPS, type EventPopupData, type EventPopupLink } from "@/data/dummyEventPopup";

const BUTTON_VARIANTS: Record<string, string> = {
  primary: "bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20",
  teal: "bg-teal hover:bg-teal-600 text-white shadow-md shadow-teal-500/20",
  indigo: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20",
  rose: "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20",
  instagram: "bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white shadow-md shadow-pink-500/20",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
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

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export default function EventPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const pathname = usePathname();
  const locale = useLocale();
  const isEn = locale === "en";

  // Active popup slides (only active items)
  const slides: EventPopupData[] = DUMMY_EVENT_POPUPS.filter((item) => item.isActive);
  const totalSlides = slides.length;
  const currentSlide = slides[currentIndex] || slides[0];

  const isHomepage =
    pathname === "/" ||
    pathname === "/id" ||
    pathname === "/en" ||
    pathname === "/id/" ||
    pathname === "/en/";

  // Trigger popup when homepage is loaded
  useEffect(() => {
    if (totalSlides === 0 || !isHomepage) {
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname, isHomepage, totalSlides]);

  // Handle slide navigation
  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Auto-play timer (6s per slide), pauses on hover
  useEffect(() => {
    if (!isOpen || isPaused || totalSlides <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [isOpen, isPaused, totalSlides, nextSlide]);

  // Listen for Keyboard Arrow Keys & Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
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
  };

  if (totalSlides === 0 || !isHomepage) return null;

  const badgeText = isEn ? (currentSlide.badge_en || currentSlide.badge) : currentSlide.badge;
  const titleText = isEn ? (currentSlide.title_en || currentSlide.title) : currentSlide.title;
  const subtitleText = isEn ? (currentSlide.subtitle_en || currentSlide.subtitle) : currentSlide.subtitle;
  const contentText = isEn ? (currentSlide.content_en || currentSlide.content) : currentSlide.content;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Content Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full max-h-[92vh] flex flex-col z-10 border border-gray-100 my-auto"
          >
            {/* Close Button Top Right */}
            <button
              onClick={handleClose}
              className="absolute top-3.5 right-3.5 z-30 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-110"
              aria-label={isEn ? "Close Pop Up" : "Tutup Pop Up"}
            >
              <X size={18} />
            </button>

            {/* Slide Index Badge Top Left */}
            <div className="absolute top-3.5 left-3.5 z-30 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md text-xs font-bold shadow-md">
              <Layers size={13} className="text-teal-400" />
              <span>{currentIndex + 1} / {totalSlides}</span>
            </div>

            {/* Scrollable Container */}
            <div className="overflow-y-auto max-h-[88vh] custom-scrollbar">
              {/* Image Banner Carousel Container */}
              <div className="relative aspect-[16/9] w-full bg-gray-900 overflow-hidden">
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
                        sizes="(max-width: 640px) 100vw, 600px"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    
                    {/* Badge inside banner */}
                    <div className="absolute bottom-3 left-4 right-14 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white text-xs font-extrabold rounded-full shadow-lg animate-pulse tracking-wide uppercase max-w-full truncate">
                        <Sparkles size={13} className="flex-shrink-0" />
                        <span className="truncate">{badgeText}</span>
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Arrow Controls over Banner */}
                {totalSlides > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-110"
                      aria-label="Previous Slide"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-110"
                      aria-label="Next Slide"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>

              {/* Event Details & Body with Animated Slide Transition */}
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentSlide.id + "-body"}
                  custom={direction}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="p-6 sm:p-8"
                >
                  {/* Meta details */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-500 font-medium mb-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-extrabold uppercase tracking-wider text-[11px] whitespace-nowrap">
                      <Megaphone size={13} className="flex-shrink-0" />
                      <span>{isEn ? `Announcement ${currentIndex + 1}/${totalSlides}` : `Pengumuman Event ${currentIndex + 1}/${totalSlides}`}</span>
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

                  {/* Subtitle / Excerpt */}
                  {subtitleText && (
                    <p className="text-sm font-semibold text-primary mb-4 leading-relaxed">
                      {subtitleText}
                    </p>
                  )}

                  {/* Main Content */}
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    {contentText}
                  </p>

                  {/* Action Links */}
                  {currentSlide.links && currentSlide.links.length > 0 && (
                    <div className="space-y-2.5 pt-1">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        {isEn ? "Registration & Info Links:" : "Pilih Akses Pendaftaran & Informasi:"}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {currentSlide.links.map((link: EventPopupLink, idx: number) => {
                          const styleClass =
                            BUTTON_VARIANTS[link.variant ?? "primary"] ?? BUTTON_VARIANTS.primary;
                          const labelText = isEn ? (link.label_en || link.label) : link.label;
                          return (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${styleClass}`}
                            >
                              <span className="truncate pr-1">{labelText}</span>
                              <ExternalLink size={14} className="flex-shrink-0" />
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
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2 text-xs text-gray-500">
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
                    <span className="text-[11px] font-medium text-gray-500">
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
  );
}

