"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { kecil, type Album } from "@/lib/galeri";

/**
 * Album dokumentasi per kegiatan + penampil foto (‹ ›, panah keyboard, Esc),
 * dipilih per tahun. Pola sama dengan galeri foto situs IYSA.
 */
export default function GaleriFoto({ album, isEn }: { album: Album[]; isEn: boolean }) {
  const daftarTahun = useMemo(() => [...new Set(album.map((a) => a.tahun))].sort((a, b) => b.localeCompare(a)), [album]);
  const [tahun, setTahun] = useState(daftarTahun[0] ?? "");
  const tampil = album.filter((a) => a.tahun === tahun);
  const [buka, setBuka] = useState<{ a: number; i: number } | null>(null);
  const a = buka ? tampil[buka.a] : null;

  const teks = isEn
    ? { foto: (n: number) => `${n} photos`, album: (n: number) => `${n} albums`, tutup: "Close", sebelum: "Previous", sesudah: "Next", folder: "Open Drive folder", luring: "Offline", daring: "Online", sarpras: "Venue", kosong: "No photos yet." }
    : { foto: (n: number) => `${n} foto`, album: (n: number) => `${n} album`, tutup: "Tutup", sebelum: "Sebelumnya", sesudah: "Berikutnya", folder: "Buka folder Drive", luring: "Luring", daring: "Daring", sarpras: "Sarana", kosong: "Belum ada foto." };

  const geser = useCallback((d: number) => {
    setBuka((b) => (b ? { a: b.a, i: (b.i + d + tampil[b.a].foto.length) % tampil[b.a].foto.length } : b));
  }, [tampil]);

  useEffect(() => {
    if (!buka) return;
    const kunci = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBuka(null);
      if (e.key === "ArrowRight") geser(1);
      if (e.key === "ArrowLeft") geser(-1);
    };
    window.addEventListener("keydown", kunci);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", kunci); document.body.style.overflow = ""; };
  }, [buka, geser]);

  /* Sampul: foto kegiatan, bukan foto gedung/lokasi/sarana. */
  const sampul = (al: Album) => {
    const tempat = /^(gedung|building|venue|lokasi|tempat|kampus|campus)\b/i;
    const i = al.foto.findIndex((f) => !tempat.test(f.label) && f.jenis !== "sarpras");
    return i >= 0 ? i : 0;
  };
  const label = (j: string) => (j === "luring" ? teks.luring : j === "daring" ? teks.daring : j === "sarpras" ? teks.sarpras : j);

  if (!album.length) return <p className="py-16 text-center text-gray-500">{teks.kosong}</p>;

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {daftarTahun.map((y) => (
          <button
            key={y}
            type="button"
            onClick={() => { setTahun(y); setBuka(null); }}
            aria-pressed={y === tahun}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold tabular-nums transition-colors ${
              y === tahun ? "bg-primary text-white shadow" : "border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
            }`}
          >
            {y}
          </button>
        ))}
        <span className="ml-auto text-sm text-gray-400">{teks.album(tampil.length)}</span>
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tampil.map((al, ai) => {
          const si = sampul(al);
          const s = al.foto[si];
          return (
            <li key={al.kunci} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
              {s ? (
                <button type="button" onClick={() => setBuka({ a: ai, i: si })} className="group relative block aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={kecil(s.gambar, 640)} alt={s.label} loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-2.5 right-2.5 rounded-full bg-black/55 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-white">
                    {teks.foto(al.foto.length)}
                  </span>
                </button>
              ) : (
                <a href={al.folder ?? "#"} target="_blank" rel="noreferrer"
                  className="grid aspect-[4/3] w-full place-items-center bg-purple-50 text-sm font-semibold text-primary">
                  {teks.folder} ↗
                </a>
              )}
              <div className="flex items-center gap-3 px-4 py-3">
                {al.logo && (
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white p-0.5 ring-1 ring-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={kecil(al.logo, 320)} alt="" className="h-full w-full object-contain" loading="lazy" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-[15px] font-bold leading-snug text-gray-900">{al.judul}</p>
                  {al.subjudul && <p className="truncate text-xs text-gray-500" title={al.subjudul}>{al.subjudul}</p>}
                </div>
                {al.folder && s && (
                  <a href={al.folder} target="_blank" rel="noreferrer" title={teks.folder}
                    className="shrink-0 rounded-full border border-gray-200 px-2.5 py-1 text-xs text-gray-500 hover:border-primary hover:text-primary">
                    Drive ↗
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {a && buka && (
        <div role="dialog" aria-modal="true" aria-label={a.judul}
          className="fixed inset-0 z-[10000] flex flex-col bg-[#0b0614] text-white" onClick={() => setBuka(null)}>
          <div className="flex items-center justify-between gap-4 px-4 py-3" onClick={(e) => e.stopPropagation()}>
            <p className="min-w-0 truncate text-base font-bold">
              {a.judul}
              <span className="ml-3 text-sm font-normal tabular-nums text-white/60">{buka.i + 1} / {a.foto.length}</span>
            </p>
            <button type="button" onClick={() => setBuka(null)} aria-label={teks.tutup}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 text-xl hover:bg-white/25">×</button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={a.foto[buka.i].gambar} src={kecil(a.foto[buka.i].gambar, 1280)} alt={a.foto[buka.i].label}
              className="max-h-full max-w-full rounded object-contain" />
            {a.foto.length > 1 && (
              <>
                <button type="button" onClick={() => geser(-1)} aria-label={teks.sebelum}
                  className="absolute left-3 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-2xl hover:bg-white/30">‹</button>
                <button type="button" onClick={() => geser(1)} aria-label={teks.sesudah}
                  className="absolute right-3 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-2xl hover:bg-white/30">›</button>
              </>
            )}
          </div>

          <div className="px-4 pb-4 pt-3" onClick={(e) => e.stopPropagation()}>
            <p className="mx-auto max-w-3xl text-center text-sm leading-relaxed text-white/85">
              {a.foto[buka.i].jenis && (
                <span className="mr-2 rounded-full bg-white/15 px-2 py-0.5 text-[11px] uppercase tracking-wide">{label(a.foto[buka.i].jenis)}</span>
              )}
              {a.foto[buka.i].label}
            </p>
            {a.foto.length > 1 && (
              <div className="mx-auto mt-3 flex max-w-4xl gap-2 overflow-x-auto pb-1">
                {a.foto.map((f, i) => (
                  <button key={i} type="button" onClick={() => setBuka({ a: buka.a, i })}
                    className={`h-14 w-20 shrink-0 overflow-hidden rounded ${i === buka.i ? "ring-2 ring-white" : "opacity-55 hover:opacity-100"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={kecil(f.gambar, 320)} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
