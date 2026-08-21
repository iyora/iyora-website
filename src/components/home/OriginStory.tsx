"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

function withIYSALink(text: string) {
  return text.split("IYSA").map((part, i, arr) =>
    i < arr.length - 1 ? (
      <span key={i}>
        {part}
        <a
          href="https://www.iysa.or.id"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-teal underline underline-offset-2 hover:opacity-80 transition-opacity"
          style={{ color: "#39bcbe" }}
        >
          IYSA
        </a>
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

const slideIn = (direction: "left" | "right") => ({
  hidden: { opacity: 0, x: direction === "left" ? -50 : 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0, 0, 1] as const },
  },
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0, 0, 1] as const } },
};

export default function OriginStory() {
  const t = useTranslations("origin");

  const bodyParagraphs = t("body").split("\n\n").filter(Boolean);

  return (
    <section className="bg-white py-16 md:py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-primary mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">{t("subtitle")}</p>
        </motion.div>

        {/* Narrative text */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-6"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {bodyParagraphs.map((para, i) => (
              <p key={i} className="text-gray-600 leading-relaxed text-[15px]">
                {withIYSALink(para)}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Conclusion */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-20"
        >
          <p className="text-lg md:text-xl font-bold italic text-accent max-w-2xl mx-auto">
            &ldquo;{t("conclusion")}&rdquo;
          </p>
        </motion.div>

        {/* Comparison cards */}
        <div className="flex flex-col md:flex-row items-stretch gap-0 md:gap-0 relative">
          {/* IYSA card */}
          <motion.div
            variants={slideIn("left")}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex-1 rounded-3xl md:rounded-r-none p-6 md:p-8 text-white flex flex-col"
            style={{
              background: "linear-gradient(135deg, #4f3280 0%, #66449b 100%)",
            }}
          >
            <div className="text-5xl mb-4">🔬</div>
            <div className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">
              {t("iysa_label")}
            </div>
            <h3 className="text-2xl font-extrabold mb-3">{t("iysa_desc")}</h3>
            <p className="text-white/70 text-sm mb-6 leading-relaxed">
              Invention, innovation, and creative scientific works — the original
              mission that built the foundation.
            </p>
            <ul className="flex flex-wrap gap-2 mt-auto">
              {["WYIIA", "GYIIF", "YNSF", "NSIF"].map((item) => (
                <li
                  key={item}
                  className="text-xs font-semibold px-3 py-1 rounded-full bg-white/15 text-white"
                >
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Arrow divider */}
          <div className="flex items-center justify-center z-10 my-3 md:my-0 md:-mx-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-white font-bold text-lg flex-shrink-0"
              style={{ backgroundColor: "#fb9722" }}
            >
              <span className="md:hidden">↓</span>
              <span className="hidden md:inline">→</span>
            </div>
          </div>

          {/* IYORA card */}
          <motion.div
            variants={slideIn("right")}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex-1 rounded-3xl md:rounded-l-none p-6 md:p-8 text-white flex flex-col"
            style={{
              background: "linear-gradient(135deg, #2a9496 0%, #39bcbe 100%)",
            }}
          >
            <div className="text-5xl mb-4">🏆</div>
            <div className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">
              {t("iyora_label")}
            </div>
            <h3 className="text-2xl font-extrabold mb-3">{t("iyora_desc")}</h3>
            <p className="text-white/70 text-sm mb-6 leading-relaxed">
              Dedicated entirely to one pursuit: recognizing and elevating
              Indonesia&apos;s finest young scientists through olympiads.
            </p>
            <ul className="flex flex-wrap gap-2 mt-auto">
              {["IYBO", "IYPO", "IYCO", "IYMO", "IYGO", "WSO"].map((item) => (
                <li
                  key={item}
                  className="text-xs font-semibold px-3 py-1 rounded-full bg-white/15 text-white"
                >
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
