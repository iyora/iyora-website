"use client";

import { useEffect, useMemo, useState } from "react";
import type { VideoGaleri } from "@/lib/galeri";

/** Kisi video: thumbnail ringan, pemutar YouTube baru dimuat saat diklik. */
export default function GaleriVideo({ video, isEn }: { video: VideoGaleri[]; isEn: boolean }) {
  const daftarTahun = useMemo(() => [...new Set(video.map((v) => v.tahun))].sort((a, b) => b.localeCompare(a)), [video]);
  const [tahun, setTahun] = useState<string | null>(null);
  const [main, setMain] = useState<VideoGaleri | null>(null);
  const tampil = tahun ? video.filter((v) => v.tahun === tahun) : video;

  useEffect(() => {
    if (!main) return;
    const tutup = (e: KeyboardEvent) => e.key === "Escape" && setMain(null);
    window.addEventListener("keydown", tutup);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", tutup); document.body.style.overflow = ""; };
  }, [main]);

  const chip = (aktif: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-semibold tabular-nums transition-colors ${
      aktif ? "bg-primary text-white shadow" : "border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
    }`;

  if (!video.length) return <p className="py-16 text-center text-gray-500">{isEn ? "No videos yet." : "Belum ada video."}</p>;

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setTahun(null)} className={chip(tahun === null)} aria-pressed={tahun === null}>
          {isEn ? "All" : "Semua"}
        </button>
        {daftarTahun.map((y) => (
          <button key={y} type="button" onClick={() => setTahun(y)} className={chip(tahun === y)} aria-pressed={tahun === y}>{y}</button>
        ))}
        <span className="ml-auto text-sm text-gray-400">{tampil.length} video</span>
      </div>

      <ul className="grid gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
        {tampil.map((v) => (
          <li key={v.id}>
            <button type="button" onClick={() => setMain(v)} className="group block w-full text-left" aria-label={`${isEn ? "Play" : "Putar"}: ${v.judul}`}>
              <span className="relative block aspect-video overflow-hidden rounded-2xl bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-primary shadow-lg transition-transform group-hover:scale-110">
                  <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor" aria-hidden><path d="M8 5.5v13l11-6.5z" /></svg>
                </span>
                <span className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-white">{v.tahun}</span>
              </span>
              <span className="mt-2.5 block text-[15px] font-bold leading-snug text-gray-900 group-hover:text-primary">{v.judul}</span>
              {v.keterangan && <span className="mt-1 line-clamp-2 block text-xs text-gray-500">{v.keterangan}</span>}
            </button>
          </li>
        ))}
      </ul>

      {main && (
        <div role="dialog" aria-modal="true" aria-label={main.judul}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-[rgba(11,6,20,0.92)] p-4" onClick={() => setMain(null)}>
          <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-start justify-between gap-4">
              <p className="text-lg font-bold text-white">{main.judul}</p>
              <button type="button" onClick={() => setMain(null)} aria-label={isEn ? "Close" : "Tutup"}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 text-xl text-white hover:bg-white/25">×</button>
            </div>
            <div className="aspect-video overflow-hidden rounded-xl bg-black">
              <iframe src={`https://www.youtube-nocookie.com/embed/${main.id}?autoplay=1&rel=0`} title={main.judul}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="h-full w-full" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
