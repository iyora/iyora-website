"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Target, Globe, ShieldCheck } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  titleKey: "focus_title" | "network_title" | "trust_title";
  descKey: "focus_desc" | "network_desc" | "trust_desc";
  accent: string;
  bg: string;
}

const FEATURES: Feature[] = [
  {
    icon: <Target className="w-5 h-5 md:w-6 md:h-6" />,
    titleKey: "focus_title",
    descKey: "focus_desc",
    accent: "#66449b",
    bg: "#66449b18",
  },
  {
    icon: <Globe className="w-5 h-5 md:w-6 md:h-6" />,
    titleKey: "network_title",
    descKey: "network_desc",
    accent: "#39bcbe",
    bg: "#39bcbe18",
  },
  {
    icon: <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />,
    titleKey: "trust_title",
    descKey: "trust_desc",
    accent: "#fb9722",
    bg: "#fb972218",
  },
];

export default function WhyIYORA() {
  const t = useTranslations("why");

  return (
    <section className="bg-white py-16 md:py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3">
            {t("title")}
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto">{t("subtitle")}</p>
        </motion.div>

        {/* Mobile: 2-col flex wrap, Desktop: 3-col grid */}
        <div className="flex flex-wrap justify-center gap-3 md:grid md:grid-cols-3 md:gap-8">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="w-[calc(50%-6px)] md:w-auto"
            >
              <div
                className="h-full rounded-2xl border overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-white"
                style={{ borderColor: `${feature.accent}28` }}
              >
                {/* Accent top stripe */}
                <div className="h-1 flex-shrink-0" style={{ backgroundColor: feature.accent }} />

                <div className="p-4 md:p-7 flex flex-col gap-3 md:gap-4 flex-1">
                  {/* Icon */}
                  <div
                    className="w-10 h-10 md:w-13 md:h-13 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${feature.bg}, ${feature.accent}25)`,
                      color: feature.accent,
                    }}
                  >
                    {feature.icon}
                  </div>

                  {/* Title */}
                  <h3
                    className="text-[13px] md:text-xl font-extrabold leading-snug"
                    style={{ color: feature.accent }}
                  >
                    {t(feature.titleKey)}
                  </h3>

                  {/* Desc */}
                  <p className="text-[11px] md:text-[15px] text-gray-500 leading-relaxed flex-1">
                    {t(feature.descKey)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
