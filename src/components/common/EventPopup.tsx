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
  ChevronLeft,
  ChevronRight,
  Layers,
  Flame,
  Award,
} from "lucide-react";
import { DUMMY_EVENT_POPUPS, type EventPopupData, type EventPopupLink } from "@/data/dummyEventPopup";
import type { CompetitionData } from "@/lib/supabase";

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
  if (id.includes("sk-pemenang") || id.includes("sk")) return isEn ? "SK Pemenang" : "SK Pemenang";
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

interface EventPopupProps {
  competitions?: CompetitionData[];
}

export default function EventPopup({ competitions }: EventPopupProps) {
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

  const isSkSlide = currentSlide.id.includes("sk");
  const isUpcomingSlide =
    !isSkSlide &&
    (currentSlide.id.includes("nso") ||
      currentSlide.id.includes("nsmo") ||
      currentSlide.id.includes("wso") ||
      currentSlide.id.includes("upcoming"));

  // Generate dynamic button label based on active slides
  const hasSk = slides.some((s) => s.id.includes("sk"));
  const hasUpcoming = slides.some((s) => !s.id.includes("sk"));
  const triggerLabel = hasSk && hasUpcoming
    ? (isEn ? "Event Info: SK & Upcoming" : "Info Event: SK & Upcoming")
    : hasSk
    ? (isEn ? "Event Info: SK Pemenang" : "Info Event: SK Pemenang")
    : (isEn ? "Event Info: Upcoming Olympiads" : "Info Event: Upcoming Olympiads");

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
          aria-label={triggerLabel}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
          </span>
          <Flame size={16} className="text-amber-300 group-hover:rotate-12 transition-transform" />
          <span className="tracking-wide">{triggerLabel}</span>
        </motion.button>
      )}

      {/* 🌟 Modal Pop Up */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Subtle Translucent Backdrop (Thin dark tint & light blur to make popup pop) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/25 backdrop-blur-[2px] cursor-pointer"
            />

            {/* Modal Box with Floating Drop Shadow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="relative rounded-2xl overflow-visible max-w-lg w-full z-10 my-auto group shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] drop-shadow-2xl"
            >
              {/* Close Button Floating Outside / Top-Right */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-110 border border-white/30"
                aria-label={isEn ? "Close Pop Up" : "Tutup Pop Up"}
              >
                <X size={18} />
              </button>

              {/* Main Image Poster Container - Pure Image Display */}
              {(() => {
                const primaryLink = currentSlide.links?.[0]?.url || "#";
                const isExternal = primaryLink.startsWith("http");
                return (
                  <div className="relative w-full overflow-hidden bg-transparent">
                    <AnimatePresence custom={direction} mode="wait">
                      <motion.div
                        key={currentSlide.id}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="relative w-full"
                      >
                        <a
                          href={primaryLink}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noopener noreferrer" : undefined}
                          className="block relative w-full cursor-pointer group"
                        >
                          {currentSlide.image && (
                            <img
                              src={currentSlide.image}
                              alt={titleText}
                              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-[1.01]"
                            />
                          )}
                        </a>
                      </motion.div>
                    </AnimatePresence>

                    {/* Carousel Navigation Arrows */}
                    {totalSlides > 1 && (
                      <>
                        <button
                          onClick={prevSlide}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-110 border border-white/10"
                          aria-label="Previous Slide"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={nextSlide}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-110 border border-white/10"
                          aria-label="Next Slide"
                        >
                          <ChevronRight size={20} />
                        </button>

                        {/* Minimalist Floating Dots Indicator at bottom */}
                        <div className="absolute bottom-3 left-0 right-0 z-20 flex items-center justify-center gap-1.5 pointer-events-none">
                          {slides.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => goToSlide(idx)}
                              aria-label={`Go to slide ${idx + 1}`}
                              className={`h-2 rounded-full transition-all duration-300 pointer-events-auto cursor-pointer ${
                                idx === currentIndex
                                  ? "w-6 bg-white shadow-lg shadow-black/50"
                                  : "w-2 bg-white/50 hover:bg-white/80 backdrop-blur-sm"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
