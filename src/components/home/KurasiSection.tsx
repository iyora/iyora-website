"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { BadgeCheck, Database, GraduationCap, ShieldCheck } from "lucide-react";

const BENEFITS = [
  { icon: BadgeCheck,     key: "b1", color: "#66449b", bg: "#66449b18", light: "#f3eeff" },
  { icon: Database,       key: "b2", color: "#39bcbe", bg: "#39bcbe18", light: "#edfafa" },
  { icon: GraduationCap,  key: "b3", color: "#fb9722", bg: "#fb972218", light: "#fff7ed" },
  { icon: ShieldCheck,    key: "b4", color: "#66449b", bg: "#66449b18", light: "#f3eeff" },
] as const;

export default function KurasiSection() {
  const t = useTranslations("kurasi");

  return (
    <section className="bg-white py-16 md:py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <span
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-white text-sm font-bold shadow-md"
            style={{ background: "linear-gradient(135deg, #66449b, #39bcbe)" }}
          >
            <BadgeCheck size={16} />
            {t("badge")}
          </span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-center mb-5"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            {t("title")}
          </h2>
          <p className="mt-4 text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* "What is kurasi?" callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="mb-10 md:mb-12 rounded-2xl border border-purple-100 bg-purple-50/50 p-5 md:p-8 flex gap-5"
          style={{ borderLeftColor: "#66449b", borderLeftWidth: 4 }}
        >
          <div className="flex-1">
            <p className="text-xs md:text-sm font-bold text-purple-700 uppercase tracking-wide mb-2">
              {t("what_is_title")}
            </p>
            <p className="text-gray-600 leading-relaxed text-[13px] md:text-[15px]">
              {t("what_is_desc")}
            </p>
          </div>
        </motion.div>

        {/* Benefits grid — 2 cols on mobile, 4 on lg */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-10">
          {BENEFITS.map(({ icon: Icon, key, color, bg, light }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl overflow-hidden border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
              style={{ borderColor: `${color}28` }}
            >
              {/* Colored icon header */}
              <div
                className="px-4 pt-5 pb-3 md:px-5 md:pt-6 md:pb-4 flex flex-col items-start gap-3"
                style={{ background: `linear-gradient(145deg, ${light}, white)` }}
              >
                <div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: color }}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-[12px] md:text-[14px] font-extrabold text-gray-900 leading-snug">
                  {t(`${key}_title` as Parameters<typeof t>[0])}
                </h3>
              </div>

              {/* Description */}
              <div className="bg-white px-4 py-3 md:px-5 md:py-4 flex-1">
                <p className="text-[11px] md:text-[13px] text-gray-500 leading-relaxed">
                  {t(`${key}_desc` as Parameters<typeof t>[0])}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Source attribution */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-xs text-gray-400"
        >
          {t("source")}{" "}
          <a
            href="https://kurasi-prestasi.kemendikdasmen.go.id"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600 transition"
          >
            kurasi-prestasi.kemendikdasmen.go.id
          </a>
        </motion.p>

      </div>
    </section>
  );
}
