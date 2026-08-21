"use client";

import { useTranslations } from "next-intl";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

interface StatItem {
  value: number;
  suffix: string;
  labelKey: "olympiads" | "countries" | "students" | "years";
  color: string;
}

const STATS: StatItem[] = [
  { value: 12, suffix: "+", labelKey: "olympiads", color: "#66449b" },
  { value: 20, suffix: "+", labelKey: "countries", color: "#39bcbe" },
  { value: 50000, suffix: "+", labelKey: "students", color: "#fb9722" },
  { value: 10, suffix: "+", labelKey: "years", color: "#66449b" },
];

function CountUp({
  target,
  suffix,
  color,
}: {
  target: number;
  suffix: string;
  color: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) =>
    target >= 1000
      ? `${Math.round(v / 1000)}K`
      : Math.round(v).toString()
  );

  useEffect(() => {
    if (inView) {
      const controls = animate(count, target, {
        duration: 2,
        ease: [0.25, 0, 0, 1] as const,
      });
      return controls.stop;
    }
  }, [inView, count, target]);

  return (
    <span
      ref={ref}
      className="text-5xl md:text-6xl font-extrabold tabular-nums"
      style={{ color }}
    >
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const t = useTranslations("stats");

  return (
    <section className="bg-gray-50 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-primary">
            {t("title")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.labelKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <CountUp target={stat.value} suffix={stat.suffix} color={stat.color} />
              <p className="mt-3 text-sm font-medium text-gray-500 leading-snug">
                {t(stat.labelKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
