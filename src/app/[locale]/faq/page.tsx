import type { Metadata } from "next";
import FaqClient from "./FaqClient";

export const metadata: Metadata = {
  title: "FAQ — Pertanyaan yang Sering Diajukan",
  description:
    "Temukan jawaban atas pertanyaan yang sering diajukan seputar pendaftaran olimpiade sains IYORA, kurasi Puspresnas SIMT, sistem ujian, dan sertifikat pemenang.",
};

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isId = locale === "id";

  return (
    <>
      <section className="gradient-hero pt-32 pb-20 text-white text-center px-6">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-xs text-xs font-bold uppercase tracking-wider mb-4 border border-white/25">
            {isId ? "Pusat Bantuan & Informasi" : "Help & Information Center"}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {isId ? "Pertanyaan Umum (FAQ)" : "Frequently Asked Questions"}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            {isId
              ? "Jawaban lengkap seputar pendaftaran olimpiade sains IYORA, kurasi resmi SIMT Puspresnas, mekanisme ujian, hingga pengunduhan SK pemenang."
              : "Complete answers regarding IYORA science olympiad registration, official SIMT Puspresnas accreditation, exam procedures, and winner decrees."}
          </p>
        </div>
      </section>

      <section className="py-12 px-6 max-w-4xl mx-auto">
        <FaqClient />
      </section>
    </>
  );
}
