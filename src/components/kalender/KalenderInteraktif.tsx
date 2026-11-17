"use client";

import { useMemo, useState } from "react";

export type EntriKalender = {
  tanggal: string;
  judul: string;
  jenis: "kegiatan" | "penting";
  jalur: string;
  lokasi: string;
  jam: string;
  akronim: string;
  tahun: string;
  logo: string | null;
  situs: string | null;
};

type Teks = {
  hari: string[];
  kosongHari: string;
  kosongBulan: string;
  eventBulanIni: string;
  /** Templat jumlah agenda, `#` diganti angka: satu / banyak. */
  agendaSatu: string;
  agendaBanyak: string;
  lagi: string;
  penting: string;
  kegiatan: string;
  daring: string;
  luring: string;
  situsResmi: string;
  legendaKegiatan: string;
  legendaPenting: string;
};

/**
 * Kalender bulan + panel hari terpilih (disalin dari situs IYSA, warna IYORA, 2026-11-17).
 *
 * Halaman tidak lagi memuat seluruh agenda bulan ke bawah (Februari 2027 = 100
 * baris): pengunjung memilih tanggal, panel menampilkan agenda hari itu. Sel
 * kalender hanya menyebut ajang unik, bukan setiap baris jadwalnya.
 */
export default function KalenderInteraktif({
  kisi, entri, hariIni, locale, teks,
}: {
  kisi: (string | null)[];
  entri: EntriKalender[];
  hariIni: string;
  locale: "id" | "en";
  teks: Teks;
}) {
  const perTanggal = useMemo(() => {
    const m = new Map<string, EntriKalender[]>();
    for (const e of entri) m.set(e.tanggal, [...(m.get(e.tanggal) ?? []), e]);
    return m;
  }, [entri]);

  const awal = useMemo(() => {
    if (perTanggal.has(hariIni)) return hariIni;
    const nanti = [...perTanggal.keys()].find((t) => t >= hariIni);
    return nanti ?? [...perTanggal.keys()][0] ?? kisi.find(Boolean) ?? hariIni;
  }, [perTanggal, hariIni, kisi]);
  const [pilih, setPilih] = useState(awal);

  /* Satu baris per edisi: rentang tanggal kemunculannya di bulan ini. */
  const edisiBulan = useMemo(() => {
    const m = new Map<string, { e: EntriKalender; dari: string; sampai: string; n: number }>();
    for (const e of entri) {
      const k = `${e.akronim} ${e.tahun}`;
      const x = m.get(k);
      if (!x) m.set(k, { e, dari: e.tanggal, sampai: e.tanggal, n: 1 });
      else { x.sampai = e.tanggal > x.sampai ? e.tanggal : x.sampai; x.n++; }
    }
    return [...m.values()].sort((a, b) => a.dari.localeCompare(b.dari));
  }, [entri]);

  const fmt = (iso: string, o: Intl.DateTimeFormatOptions) =>
    new Date(`${iso}T00:00:00Z`).toLocaleDateString(locale === "en" ? "en-GB" : "id-ID", { timeZone: "UTC", ...o });
  const rentang = (a: string, b: string) =>
    a === b ? fmt(a, { day: "numeric", month: "short" }) : `${fmt(a, { day: "numeric" })}–${fmt(b, { day: "numeric", month: "short" })}`;

  const agendaHari = perTanggal.get(pilih) ?? [];
  const jumlah = (n: number) => (n === 1 ? teks.agendaSatu : teks.agendaBanyak).replace("#", String(n));

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
      {/* ── Kalender ── */}
      <div>
        <div className="grid grid-cols-7 overflow-hidden rounded-2xl border border-[#ece7f5]">
          {teks.hari.map((h) => (
            <div key={h} className="border-b border-[#ece7f5] bg-[#f7f4fc] py-2 text-center text-[11px] font-semibold tracking-wide text-[#9ca3af] uppercase">
              {h}
            </div>
          ))}
          {kisi.map((tgl, i) => {
            if (!tgl) return <div key={i} className="h-14 border-b border-[#ece7f5] bg-[#f7f4fc]/40 sm:h-[84px]" />;
            const isi = perTanggal.get(tgl) ?? [];
            const unik = [...new Map(isi.map((e) => [e.akronim, e])).values()];
            const adaPenting = isi.some((e) => e.jenis === "penting");
            const terpilih = tgl === pilih;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setPilih(tgl)}
                aria-pressed={terpilih}
                aria-label={`${fmt(tgl, { day: "numeric", month: "long" })}${isi.length ? ` — ${jumlah(isi.length)}` : ""}`}
                className={`group relative flex h-14 flex-col items-center gap-1 border-b border-[#ece7f5] p-1.5 text-left transition-colors sm:h-[84px] sm:items-stretch ${
                  terpilih ? "bg-[#39bcbe]/10" : "hover:bg-[#f7f4fc]"
                } ${i % 7 !== 6 ? "border-r" : ""}`}
              >
                <span className={`tabular-nums grid h-6 w-6 place-items-center rounded-full text-[12.5px] ${
                  tgl === hariIni
                    ? "bg-[#66449b] font-bold text-[#ffffff]"
                    : terpilih ? "font-bold text-[#39bcbe]" : "text-[#6b7280]"
                }`}>
                  {Number(tgl.slice(8))}
                </span>
                {/* Ponsel: titik saja. */}
                {isi.length > 0 && (
                  <span className={`h-1.5 w-1.5 rounded-full sm:hidden ${adaPenting ? "bg-[#fb9722]" : "bg-[#39bcbe]"}`} />
                )}
                {/* Layar lebar: ajang unik, maksimal dua. */}
                <span className="hidden flex-col gap-0.5 sm:flex">
                  {unik.slice(0, 2).map((e) => (
                    <span key={e.akronim} className="truncate rounded-sm bg-[#f7f4fc] px-1 text-[10.5px] leading-[1.5] font-semibold text-[#66449b]">
                      {e.akronim}
                    </span>
                  ))}
                  {unik.length > 2 && <span className="px-1 text-[10px] text-[#9ca3af]">+{unik.length - 2} {teks.lagi}</span>}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 flex flex-wrap gap-4 text-[12px] text-[#9ca3af]">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#39bcbe]" />{teks.legendaKegiatan}</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#fb9722]" />{teks.legendaPenting}</span>
        </p>
      </div>

      {/* ── Panel hari terpilih + ringkasan bulan ── */}
      <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
        <div className="rounded-2xl border border-[#ece7f5]">
          <div className="flex items-baseline justify-between gap-3 border-b border-[#ece7f5] px-4 py-3">
            <p className="text-[17px] font-bold text-[#111827]">{fmt(pilih, { weekday: "long", day: "numeric", month: "long" })}</p>
            {agendaHari.length > 0 && <span className="shrink-0 text-[12px] text-[#9ca3af]">{jumlah(agendaHari.length)}</span>}
          </div>
          {agendaHari.length === 0 ? (
            <p className="px-4 py-6 text-[14px] text-[#6b7280]">{teks.kosongHari}</p>
          ) : (
            <ul className="max-h-[440px] divide-y divide-[#ece7f5] overflow-y-auto">
              {agendaHari.map((e, k) => (
                <li key={k} className="flex gap-3 px-4 py-3">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${e.jenis === "penting" ? "bg-[#fb9722]" : "bg-[#39bcbe]"}`} />
                  <div className="min-w-0">
                    <p className="text-[14.5px] leading-snug font-medium text-[#111827]">{e.judul}</p>
                    <p className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-[12.5px] text-[#6b7280]">
                      {e.situs ? (
                        <a href={e.situs} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#66449b] hover:text-[#39bcbe]">
                          {e.akronim} {e.tahun} ↗
                        </a>
                      ) : <span className="font-semibold text-[#66449b]">{e.akronim} {e.tahun}</span>}
                      {e.jam && <span className="tabular-nums">· {e.jam} WIB</span>}
                      {e.jalur && <span>· {e.jalur === "online" ? teks.daring : e.jalur === "offline" ? teks.luring : e.jalur}</span>}
                    </p>
                    {e.lokasi && <p className="mt-0.5 truncate text-[12.5px] text-[#9ca3af]">{e.lokasi}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="mb-2 text-[11.5px] font-semibold tracking-wide text-[#9ca3af] uppercase">{teks.eventBulanIni}</p>
          {edisiBulan.length === 0 ? (
            <p className="text-[14px] text-[#6b7280]">{teks.kosongBulan}</p>
          ) : (
            <ul className="flex flex-col">
              {edisiBulan.map(({ e, dari, sampai }) => (
                <li key={`${e.akronim}${e.tahun}`}>
                  <button
                    type="button"
                    onClick={() => setPilih(dari)}
                    className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-[#f7f4fc]"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded bg-white p-0.5 ring-1 ring-[#ece7f5]">
                      {e.logo
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={`${e.logo}${e.logo.includes("?") ? "&" : "?"}w=64`} alt="" className="h-full w-full object-contain" loading="lazy" />
                        : <span className="text-[9px] font-bold text-[#66449b]">{e.akronim.slice(0, 4)}</span>}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-[#111827]">{e.akronim} {e.tahun}</span>
                    <span className="tabular-nums shrink-0 text-[12.5px] text-[#6b7280]">{rentang(dari, sampai)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
