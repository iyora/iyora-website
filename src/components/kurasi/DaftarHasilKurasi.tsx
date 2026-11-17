"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Star, FolderOpen, ExternalLink } from "lucide-react";
import type { HasilKurasi } from "@/lib/kurasiDashboard";

/**
 * Daftar edisi olimpiade yang sudah selesai dikurasi Puspresnas dan berbintang
 * (2026-11-17). Data dari API dashboard (`ambilHasilKurasi`), dikelompokkan per
 * tahun. `penyaring` menampilkan pilihan ajang (halaman /kurasi).
 */
export function Bintang({ n, ukuran = 20 }: { n: number; ukuran?: number }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`${n}`}>
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={ukuran} className="fill-amber-400 text-amber-400 drop-shadow-2xs" />
      ))}
    </span>
  );
}

export default function DaftarHasilKurasi({ hasil, penyaring = false }: { hasil: HasilKurasi[]; penyaring?: boolean }) {
  const t = useTranslations("kurasi");
  const locale = useLocale();
  const [ajang, setAjang] = useState("");
  const pilihan = useMemo(() => [...new Set(hasil.map((h) => h.akronim))].sort(), [hasil]);
  const tampil = ajang ? hasil.filter((h) => h.akronim === ajang) : hasil;
  const perTahun = useMemo(() => {
    const m = new Map<string, HasilKurasi[]>();
    for (const h of tampil) m.set(h.tahun, [...(m.get(h.tahun) ?? []), h]);
    return [...m.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [tampil]);
  const skor = (s: number) => s.toLocaleString(locale === "en" ? "en-US" : "id-ID", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  const tgl = (iso: string) =>
    new Date(iso).toLocaleDateString(locale === "en" ? "en-GB" : "id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" });

  if (!hasil.length) return null;

  return (
    <div>
      {penyaring && pilihan.length > 1 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2" role="group" aria-label={t("hasil_saring")}>
          {["", ...pilihan].map((a) => (
            <button
              key={a || "semua"}
              type="button"
              onClick={() => setAjang(a)}
              aria-pressed={ajang === a}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                ajang === a ? "border-primary bg-primary text-white" : "border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary"
              }`}
            >
              {a || t("hasil_semua")}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-10">
        {perTahun.map(([tahun, daftar]) => (
          <section key={tahun}>
            <h3 className="mb-4 flex items-center gap-3 text-lg font-extrabold text-primary">
              {t("hasil_edisi", { tahun })}
              <span className="h-px flex-1 bg-purple-100" />
              <span className="text-xs font-semibold text-gray-400">{t("hasil_jumlah", { n: daftar.length })}</span>
            </h3>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {daftar.map((h) => (
                <li key={`${h.akronim}-${h.tahun}`} className="flex flex-col rounded-2xl border border-purple-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="min-w-0">
                    <p className="text-xl font-extrabold text-gray-900">{h.akronim} {h.tahun}</p>
                    <p className="mt-0.5 text-[13px] leading-snug text-gray-500">{h.nama}</p>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 items-center gap-3 rounded-xl bg-purple-50/60 p-3.5 text-[13px]">
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-purple-700">{t("hasil_predikat")}</dt>
                      <dd className="mt-0.5 font-bold text-gray-900">{t("hasil_bintang", { n: h.bintang })}</dd>
                    </div>
                    <div className="flex items-center">
                      <Bintang n={h.bintang} ukuran={22} />
                    </div>
                  </dl>
                  {h.selesai && <p className="mt-3 text-xs text-gray-400">{t("hasil_selesai", { tgl: tgl(h.selesai) })}</p>}
                  {(h.dokumen || h.situs) && (
                    <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4 text-xs font-semibold">
                      {h.dokumen && (
                        <a href={h.dokumen} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                          <FolderOpen size={13} />{t("hasil_dokumen")}
                        </a>
                      )}
                      {h.situs && (
                        <a href={h.situs} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-teal-700 hover:underline">
                          <ExternalLink size={13} />{t("hasil_situs")}
                        </a>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
