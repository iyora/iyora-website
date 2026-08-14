"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const PARTICLES = [
  { x: "8%", size: 130, duration: 7, delay: 0, opacity: 0.12 },
  { x: "18%", size: 60, duration: 5, delay: 0.8, opacity: 0.1 },
  { x: "28%", size: 180, duration: 9, delay: 0.3, opacity: 0.08 },
  { x: "42%", size: 90, duration: 6, delay: 1.2, opacity: 0.11 },
  { x: "55%", size: 45, duration: 4.5, delay: 0.5, opacity: 0.1 },
  { x: "65%", size: 150, duration: 8, delay: 1.0, opacity: 0.09 },
  { x: "78%", size: 80, duration: 6.5, delay: 0.2, opacity: 0.12 },
  { x: "88%", size: 160, duration: 8.5, delay: 0.7, opacity: 0.07 },
  { x: "94%", size: 70, duration: 5.5, delay: 1.5, opacity: 0.1 },
];

export default function HomePreloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lock body scroll while loading
    document.body.style.overflow = "hidden";

    // Auto dismiss loading screen after 1.6s
    const timer = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = "";
    }, 1600);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(8px)",
            transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
          }}
          className="fixed inset-0 z-[99999] gradient-hero flex flex-col items-center justify-center select-none overflow-hidden"
        >
          {/* Ambient Glow Aura */}
          <div className="absolute w-[600px] h-[600px] bg-white/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />

          {/* Exact Hero Section Animated Floating Bubbles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {PARTICLES.map((p, i) => (
              <motion.div
                key={i}
                initial={{ y: "105vh", opacity: 0 }}
                animate={{
                  y: "-25vh",
                  opacity: [0, p.opacity, p.opacity, 0],
                  scale: [1, 1.06, 1],
                  x: [0, i % 2 === 0 ? 25 : -25, 0],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: p.delay,
                }}
                style={{
                  width: p.size,
                  height: p.size,
                  left: p.x,
                  backgroundColor: "white",
                }}
                className="absolute rounded-full backdrop-blur-[1px]"
              />
            ))}
          </div>

          <div className="relative flex flex-col items-center z-10 px-6 text-center">
            {/* Logo Wrapper with Orbit Ring */}
            <div className="relative mb-8 flex items-center justify-center">
              {/* Rotating Orbit Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-3.5 rounded-3xl border border-white/20 border-t-white border-r-teal-300"
              />
              
              {/* Logo Box */}
              <div className="relative bg-white/10 backdrop-blur-xl px-8 py-5 rounded-2xl border border-white/20 shadow-2xl shadow-black/20 flex items-center justify-center">
                <Image
                  src="https://res.cloudinary.com/dvcufsiy1/image/upload/v1782429397/IYORA_BRAND_GUIDELINE_a6kwif.png"
                  alt="IYORA"
                  width={180}
                  height={50}
                  priority
                  className="h-10 md:h-12 w-auto object-contain brightness-0 invert"
                />
              </div>
            </div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-xs md:text-sm font-semibold tracking-widest text-white/90 uppercase flex items-center justify-center gap-2"
            >
              <Sparkles size={16} className="text-amber-300 animate-spin" />
              <span>Indonesian Youth Outstanding Recognition Association</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
