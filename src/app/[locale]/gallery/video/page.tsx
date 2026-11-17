import type { Metadata } from "next";
import GaleriKepala from "@/components/galeri/GaleriKepala";
import GaleriVideo from "@/components/galeri/GaleriVideo";
import { ambilVideo } from "@/lib/galeri";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Video Gallery" : "Galeri Video",
    description: isEn ? "IYORA olympiad videos and after-event highlights." : "Video olimpiade IYORA dan rangkuman after event.",
  };
}

/** Galeri video — kisi thumbnail per tahun; pemutar dimuat saat diklik (2026-11-17). */
export default async function GaleriVideoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <>
      <GaleriKepala locale={locale} aktif="video" judul={isEn ? "Video Gallery" : "Galeri Video"}
        lead={isEn ? "After-event highlights and official IYORA olympiad videos." : "Rangkuman after event dan video resmi olimpiade IYORA."} />
      <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <GaleriVideo video={ambilVideo(locale)} isEn={isEn} />
      </section>
    </>
  );
}
