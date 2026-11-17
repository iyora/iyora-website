import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BadgeCheck, Layers, Star } from "lucide-react";
import DaftarHasilKurasi from "@/components/kurasi/DaftarHasilKurasi";
import { ambilHasilKurasi } from "@/lib/kurasiDashboard";

/* Hasil kurasi Puspresnas (2026-11-17): edisi berbintang semua ajang olimpiade, dari API dashboard. */
export const revalidate = 900;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "kurasi" });
  return { title: `${t("halaman_judul")} | IYORA`, description: t("halaman_sub") };
}

export default async function KurasiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "kurasi" });
  const hasil = await ambilHasilKurasi();
  const stat = [
    { ikon: BadgeCheck, nilai: hasil.length, label: t("stat_edisi") },
    { ikon: Layers, nilai: new Set(hasil.map((h) => h.akronim)).size, label: t("stat_ajang") },
    { ikon: Star, nilai: hasil.length ? `${Math.max(...hasil.map((h) => h.bintang))} ★` : "—", label: t("stat_tertinggi") },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="px-6 pb-12 pt-32 md:pt-40 text-white" style={{ background: "linear-gradient(135deg, #66449b, #39bcbe)" }}>
        <div className="mx-auto max-w-6xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold">
            <BadgeCheck size={16} />{t("badge")}
          </span>
          <h1 className="mt-5 text-3xl md:text-5xl font-extrabold leading-tight">{t("halaman_judul")}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-white/85">{t("halaman_sub")}</p>
          {hasil.length > 0 && (
            <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-3">
              {stat.map(({ ikon: Ikon, nilai, label }) => (
                <div key={label} className="rounded-2xl border border-white/25 bg-white/10 px-3 py-4">
                  <Ikon className="mx-auto mb-1.5 h-5 w-5 text-amber-300" />
                  <p className="text-2xl md:text-3xl font-extrabold tabular-nums">{nilai}</p>
                  <p className="text-[11px] md:text-xs text-white/75">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          {hasil.length ? <DaftarHasilKurasi hasil={hasil} penyaring /> : <p className="py-16 text-center text-gray-500">{t("halaman_kosong")}</p>}
          <p className="mt-12 text-center text-xs text-gray-400">
            {t("source")}{" "}
            <a href="https://kurasi-prestasi.kemendikdasmen.go.id" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
              kurasi-prestasi.kemendikdasmen.go.id
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
