"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X, Images, Sparkles } from "lucide-react";

interface ImageGallerySliderProps {
  photos: string[];
  title: string;
  isEn?: boolean;
}

export default function ImageGallerySlider({ photos, title, isEn = false }: ImageGallerySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const totalPhotos = photos.length;

  const nextSlide = useCallback(() => {
    if (totalPhotos <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalPhotos);
  }, [totalPhotos]);

  const prevSlide = useCallback(() => {
    if (totalPhotos <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  }, [totalPhotos]);

  const goToSlide = (idx: number) => {
    if (idx === currentIndex) return;
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "Escape") setIsLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  if (!photos || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="my-8 space-y-4">
      {/* Header Info Banner */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
          <Images className="w-4 h-4 text-primary" />
          <span>{isEn ? "Event Documentation Gallery" : "Galeri Dokumentasi Foto Acara"}</span>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
          {currentIndex + 1} / {totalPhotos} {isEn ? "Photos" : "Foto"}
        </span>
      </div>

      {/* Main Slider Container */}
      <div className="relative aspect-[16/9] w-full rounded-2xl bg-gray-950 overflow-hidden shadow-xl border border-gray-100 group">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full cursor-pointer"
            onClick={() => setIsLightboxOpen(true)}
          >
            <Image
              src={currentPhoto}
              alt={`${title} - Documentation ${currentIndex + 1}`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </motion.div>
        </AnimatePresence>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-full shadow-md">
            <Sparkles size={13} className="text-amber-400" />
            <span>{isEn ? `Slide ${currentIndex + 1} of ${totalPhotos}` : `Dokumentasi ${currentIndex + 1} dari ${totalPhotos}`}</span>
          </span>
        </div>

        {/* Zoom Lightbox Trigger Button */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all shadow-md hover:scale-110 cursor-pointer"
          title={isEn ? "View Fullscreen" : "Lihat Ukuran Penuh"}
        >
          <Maximize2 size={16} />
        </button>

        {/* Navigation Arrows */}
        {totalPhotos > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/85 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-110"
              aria-label="Previous Photo"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/85 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-110"
              aria-label="Next Photo"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip Slider below main view */}
      {totalPhotos > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto py-2 px-1 custom-scrollbar">
          {photos.map((photo, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                idx === currentIndex
                  ? "border-primary ring-2 ring-primary/40 scale-105 shadow-md"
                  : "border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-300"
              }`}
            >
              <Image
                src={photo}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-5 right-5 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all cursor-pointer hover:scale-110"
              aria-label="Close Lightbox"
            >
              <X size={24} />
            </button>

            <div className="relative w-full max-w-5xl aspect-[16/9] max-h-[85vh]">
              <Image
                src={currentPhoto}
                alt={`${title} Fullscreen`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {/* Lightbox Nav controls */}
            {totalPhotos > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all cursor-pointer hover:scale-110"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all cursor-pointer hover:scale-110"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm font-semibold bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
              {currentIndex + 1} / {totalPhotos}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
