import type { Metadata } from "next";
import GaleriKepala from "@/components/galeri/GaleriKepala";
import GaleriFoto from "@/components/galeri/GaleriFoto";
import { ambilAlbum } from "@/lib/galeri";

export const revalidate = 900;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Photo Gallery" : "Galeri Foto",
    description: isEn ? "Photo documentation of IYORA olympiads, per event." : "Dokumentasi foto olimpiade IYORA, per kegiatan.",
  };
}

/** Galeri foto — album dokumentasi per kegiatan, dipilih per tahun (2026-11-17). */
export default async function GaleriFotoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === "en";
  const album = await ambilAlbum(locale);
  return (
    <>
      <GaleriKepala locale={locale} aktif="photo" judul={isEn ? "Photo Gallery" : "Galeri Foto"}
        lead={isEn ? "Documentation of every IYORA olympiad — opening ceremonies, exam rounds and awarding." : "Dokumentasi setiap olimpiade IYORA — pembukaan, babak ujian, hingga penganugerahan."} />
      <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <GaleriFoto album={album} isEn={isEn} />
      </section>
    </>
  );
}
