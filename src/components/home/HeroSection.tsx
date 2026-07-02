"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const PARTICLES = [
  { x: "10%", y: "20%", size: 120, opacity: 0.06, duration: 8 },
  { x: "80%", y: "10%", size: 200, opacity: 0.05, duration: 10 },
  { x: "60%", y: "70%", size: 160, opacity: 0.07, duration: 7 },
  { x: "25%", y: "75%", size: 90, opacity: 0.08, duration: 9 },
  { x: "90%", y: "50%", size: 130, opacity: 0.05, duration: 11 },
  { x: "45%", y: "35%", size: 70, opacity: 0.06, duration: 6 },
];

const easeOut = [0.25, 0, 0, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: easeOut },
  }),
};

const CAROUSEL_INTERVAL = 4000;

export default function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();

  const headlineLines = t("headline").split("\n");
  const subheadlines = t.raw("subheadlines") as string[];

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % subheadlines.length);
    }, CAROUSEL_INTERVAL);
    return () => clearInterval(timer);
  }, [subheadlines.length]);

  return (
    <section className="gradient-hero relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24">
      {/* Decorative particles */}
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: "white",
            opacity: p.opacity,
          }}
          animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto pb-20 sm:pb-0">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-6 flex justify-center"
        >
          <Image
            src="https://res.cloudinary.com/dvcufsiy1/image/upload/v1782429397/iyora_icon_logo_okhxbo.png"
            alt="IYORA Icon"
            width={80}
            height={80}
            className="object-contain drop-shadow-lg"
            priority
          />
        </motion.div>

        <motion.h1
          custom={0.15}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6"
        >
          {headlineLines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </motion.h1>

        <motion.div
          custom={0.3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative h-36 sm:h-28 md:h-24 max-w-2xl mx-auto mb-10 overflow-hidden"
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.p
              key={index}
              custom={direction}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.55, ease: [0.25, 0, 0, 1] }}
              className="absolute inset-0 flex items-center justify-center text-base sm:text-lg md:text-xl text-white/85 leading-relaxed text-center px-2"
            >
              {subheadlines[index]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <motion.div
          custom={0.45}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href={`/${locale}/about`}
            className="px-8 py-3.5 rounded-full bg-white text-primary font-semibold text-sm shadow-lg shadow-black/20 hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            {t("cta_primary")}
          </Link>
          <Link
            href={`/${locale}/competitions`}
            className="px-8 py-3.5 rounded-full border-2 border-white text-white font-semibold text-sm hover:bg-white hover:text-primary transition-all duration-200"
          >
            {t("cta_secondary")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
