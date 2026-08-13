"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Sparkles, User, Calendar, Megaphone } from "lucide-react";
import { DUMMY_EVENT_POPUP, type EventPopupLink } from "@/data/dummyEventPopup";

const BUTTON_VARIANTS: Record<string, string> = {
  primary: "bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20",
  teal: "bg-teal hover:bg-teal-600 text-white shadow-md shadow-teal-500/20",
  indigo: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20",
  rose: "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20",
  instagram: "bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white shadow-md shadow-pink-500/20",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
};

export default function EventPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const event = DUMMY_EVENT_POPUP;

  const isHomepage =
    pathname === "/" ||
    pathname === "/id" ||
    pathname === "/en" ||
    pathname === "/id/" ||
    pathname === "/en/";

  useEffect(() => {
    if (!event.isActive || !isHomepage) {
      setIsOpen(false);
      return;
    }

    // Delay popup slightly for smooth entrance animation when accessing Beranda
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname, isHomepage, event.isActive]);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!event.isActive || !isHomepage) return null;

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
            className="fixed inset-0 bg-black/70 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Content Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full max-h-[90vh] flex flex-col z-10 border border-gray-100 my-auto"
          >
            {/* Close Button Top Right */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-110"
              aria-label="Tutup Pop Up"
            >
              <X size={18} />
            </button>

            {/* Scrollable Container */}
            <div className="overflow-y-auto max-h-[88vh] custom-scrollbar">
              {/* Event Image Banner */}
              {event.image && (
                <div className="relative aspect-[16/9] w-full bg-gray-900 overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 600px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white text-xs font-extrabold rounded-full shadow-lg animate-pulse tracking-wide uppercase">
                      <Sparkles size={13} />
                      {event.badge}
                    </span>
                  </div>
                </div>
              )}

              {/* Event Details & Body */}
              <div className="p-6 sm:p-8">
                {/* Meta details */}
                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mb-3">
                  <div className="flex items-center gap-1 text-primary">
                    <Megaphone size={14} />
                    <span className="font-bold uppercase tracking-wider">Pengumuman Event</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <User size={13} className="text-gray-400" />
                    <span>{event.author}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar size={13} className="text-gray-400" />
                    <span>{event.publishedAt}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug mb-2">
                  {event.title}
                </h3>

                {/* Subtitle / Excerpt */}
                {event.subtitle && (
                  <p className="text-sm font-semibold text-primary mb-4 leading-relaxed">
                    {event.subtitle}
                  </p>
                )}

                {/* Main Content */}
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  {event.content}
                </p>

                {/* Action Links */}
                {event.links && event.links.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Pilih Akses Pendaftaran & Informasi:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {event.links.map((link: EventPopupLink, idx: number) => {
                        const styleClass =
                          BUTTON_VARIANTS[link.variant ?? "primary"] ?? BUTTON_VARIANTS.primary;
                        return (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${styleClass}`}
                          >
                            <span className="truncate pr-1">{link.label}</span>
                            <ExternalLink size={14} className="flex-shrink-0" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center flex items-center justify-between text-xs text-gray-500">
              <span>Event Resmi IYORA Olympiad</span>
              <button
                onClick={handleClose}
                className="text-gray-600 hover:text-primary font-semibold underline cursor-pointer"
              >
                Tutup & Lanjutkan ke Web
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
