"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, Clock, MapPin, CheckCircle2, ArrowRight, Globe, BookOpen, Flame, Award } from "lucide-react";
import type { AcaraPopup, TitikTimeline } from "@/lib/popupTimeline";

/**
 * Popup event beranda (2026-11-17): TIMELINE olimpiade yang pendaftarannya
 * dibuka, dari API dashboard (`ambilAcaraPopup`). Satu tab per ajang; isi =
 * Jadwal utama, atau timeline rinci Luring/Daring lengkap dengan jam (WIB).
 * Sejak 2026-11-23 juga ajang yang sedang berlangsung (pendaftaran ditutup,
 * belum lewat awarding): label "Sedang berlangsung · awarding …", tanpa tombol daftar.
 */

type Tampilan = "utama" | "offline" | "online";

/** "EXAM SESSION ROUND 1 ONLINE" → "Exam Session Round 1 Online"; singkatan tetap. */
function rapiJudul(s: string, akronim: string): string {
  if (s !== s.toUpperCase()) return s;
  const tetap = new Set([akronim.toUpperCase(), "IYORA", "IYSA", "CBT", "WIB", "SK", "TNC", "II", "III", "IV"]);
  return s
    .toLowerCase()
    .split(" ")
    .map((w) => (tetap.has(w.toUpperCase()) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

const tanggalLokal = (t: string) => new Date(`${t.slice(0, 10)}T12:00:00`);

function hariIni(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());
}

export default function EventPopup({ acara = [] }: { acara?: AcaraPopup[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [aktif, setAktif] = useState(0);
  const [tampilan, setTampilan] = useState<Tampilan>("utama");
  const pathname = usePathname();
  const locale = useLocale();
  const isEn = locale === "en";
  const loc = isEn ? "en-GB" : "id-ID";

  const isHomepage = /^\/(id|en)?\/?$/.test(pathname || "/");
  const ev = acara[aktif] ?? acara[0];

  useEffect(() => {
    if (!acara.length || !isHomepage) {
      setIsOpen(false);
      return;
    }
    const timer = setTimeout(() => setIsOpen(true), 600);
    return () => clearTimeout(timer);
  }, [pathname, isHomepage, acara.length]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
      else if (e.key === "ArrowRight" && acara.length > 1) pilihAcara((aktif + 1) % acara.length);
      else if (e.key === "ArrowLeft" && acara.length > 1) pilihAcara((aktif - 1 + acara.length) % acara.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const pilihAcara = (i: number) => {
    setAktif(i);
    setTampilan("utama");
  };

  const hari = hariIni();
  const daftar: TitikTimeline[] = useMemo(() => {
    if (!ev) return [];
    return tampilan === "utama" ? ev.jadwal : ev.rinci.filter((k) => k.jalur === tampilan);
  }, [ev, tampilan]);
  const idxBerikut = daftar.findIndex((k) => k.tanggal >= hari);

  if (!acara.length || !ev) return null;

  const adaJalur = (["offline", "online"] as const).filter((j) => ev.rinci.some((k) => k.jalur === j));
  const berlangsung = ev.status === "ongoing";
  const sisaHari = !berlangsung && ev.tutup
    ? Math.round((tanggalLokal(ev.tutup).getTime() - tanggalLokal(hari).getTime()) / 86400000)
    : null;
  const fmt = (t: string, o: Intl.DateTimeFormatOptions) => tanggalLokal(t).toLocaleDateString(loc, o);
  const label = {
    trigger: isEn ? `Event Timeline (${acara.length})` : `Timeline Event (${acara.length})`,
    buka: isEn ? "Registration open" : "Pendaftaran dibuka",
    berlangsung: isEn ? "Ongoing" : "Sedang berlangsung",
    awarding: (d: string) => (isEn ? `awarding ${d}` : `awarding ${d}`),
    tutup: (d: string) => (isEn ? `closes ${d}` : `ditutup ${d}`),
    sisa: (n: number) => (n === 0 ? (isEn ? "last day" : "hari terakhir") : isEn ? `${n} days left` : `${n} hari lagi`),
    utama: isEn ? "Key dates" : "Jadwal utama",
    offline: isEn ? "Offline" : "Luring",
    online: isEn ? "Online" : "Daring",
    berikut: isEn ? "Next" : "Berikutnya",
    daftar: isEn ? "Register now" : "Daftar sekarang",
    situs: isEn ? "Website" : "Situs resmi",
    panduan: isEn ? "Guidebook" : "Buku panduan",
    tutupPopup: isEn ? "Close" : "Tutup",
  };

  return (
    <>
      {!isOpen && isHomepage && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary via-teal-600 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-primary/25 border border-white/20 cursor-pointer group"
          aria-label={label.trigger}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
          </span>
          <CalendarDays size={16} className="text-amber-300" />
          <span className="tracking-wide">{label.trigger}</span>
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="popup-judul">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/45 backdrop-blur-[2px] cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative z-10 flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]"
            >
              {/* Kepala: banner ajang + status pendaftaran */}
              <div className="relative shrink-0 text-white" style={{ background: "linear-gradient(135deg, #66449b, #39bcbe)" }}>
                {ev.banner && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ev.banner} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2d1b4e]/80 to-transparent" />
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/70 cursor-pointer"
                  aria-label={label.tutupPopup}
                >
                  <X size={18} />
                </button>
                <div className="relative flex items-end gap-4 px-5 pb-4 pt-6 sm:px-6">
                  {ev.logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ev.logo} alt={ev.akronim} className="h-16 w-16 shrink-0 rounded-2xl bg-white object-contain p-1.5 shadow-lg" />
                  )}
                  <div className="min-w-0">
                    <span className="inline-flex flex-wrap items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold backdrop-blur-sm">
                      {berlangsung ? <Award size={12} className="text-amber-300" /> : <Flame size={12} className="text-amber-300" />}
                      {berlangsung ? label.berlangsung : label.buka}
                      {berlangsung
                        ? ev.awarding && <span className="font-medium text-white/85">· {label.awarding(fmt(ev.awarding, { day: "numeric", month: "short", year: "numeric" }))}</span>
                        : ev.tutup && <span className="font-medium text-white/85">· {label.tutup(fmt(ev.tutup, { day: "numeric", month: "short", year: "numeric" }))}</span>}
                      {sisaHari !== null && sisaHari >= 0 && sisaHari <= 30 && (
                        <span className="rounded-full bg-amber-400 px-1.5 text-[10px] text-gray-900">{label.sisa(sisaHari)}</span>
                      )}
                    </span>
                    <h2 id="popup-judul" className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">{ev.akronim} {ev.tahun}</h2>
                    <p className="truncate text-sm text-white/85">{ev.nama}</p>
                  </div>
                </div>
                {acara.length > 1 && (
                  <div className="relative flex gap-1.5 overflow-x-auto px-5 pb-3 sm:px-6" role="tablist">
                    {acara.map((a, i) => (
                      <button
                        key={a.akronim}
                        role="tab"
                        aria-selected={i === aktif}
                        onClick={() => pilihAcara(i)}
                        className={`shrink-0 rounded-full px-3.5 py-1 text-xs font-bold transition cursor-pointer ${
                          i === aktif ? "bg-white text-primary shadow" : "bg-white/15 text-white hover:bg-white/25"
                        }`}
                      >
                        {a.akronim} {a.tahun}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Pilihan tampilan timeline */}
              {adaJalur.length > 0 && (
                <div className="flex shrink-0 gap-1 border-b border-gray-100 bg-gray-50 px-5 py-2 sm:px-6">
                  {(["utama", ...adaJalur] as Tampilan[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => setTampilan(v)}
                      aria-pressed={tampilan === v}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                        tampilan === v ? "bg-white text-primary shadow-sm ring-1 ring-purple-100" : "text-gray-500 hover:text-primary"
                      }`}
                    >
                      {label[v]}
                    </button>
                  ))}
                </div>
              )}

              {/* Isi timeline */}
              <ol key={`${ev.akronim}-${tampilan}`} className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
                {daftar.map((k, i) => {
                  const lewat = k.tanggal < hari;
                  const berikut = i === idxBerikut;
                  const jam = [k.jam_mulai, k.jam_selesai].filter(Boolean).join("–");
                  return (
                    <li key={i} className="relative flex gap-4 pb-4 last:pb-0">
                      {i < daftar.length - 1 && <span className="absolute left-[1.6rem] top-14 bottom-0 w-px bg-purple-100" aria-hidden />}
                      <div
                        className={`flex h-14 w-[3.25rem] shrink-0 flex-col items-center justify-center rounded-xl border text-center ${
                          berikut ? "border-primary bg-primary text-white shadow-md shadow-primary/25"
                            : lewat ? "border-gray-100 bg-gray-50 text-gray-400" : "border-purple-100 bg-purple-50 text-primary"
                        }`}
                      >
                        <span className="text-lg font-extrabold leading-none">{fmt(k.tanggal, { day: "numeric" })}</span>
                        <span className="mt-0.5 text-[10px] font-bold uppercase">{fmt(k.tanggal, { month: "short" })}</span>
                      </div>
                      <div className={`min-w-0 flex-1 pt-1 ${lewat ? "opacity-60" : ""}`}>
                        <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-gray-900">
                          {rapiJudul(k.milestone, ev.akronim)}
                          {berikut && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">{label.berikut}</span>}
                          {lewat && <CheckCircle2 size={14} className="text-teal-600" aria-hidden />}
                        </p>
                        <p className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500">
                          <span>{fmt(k.tanggal, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
                          {jam && <span className="inline-flex items-center gap-1"><Clock size={11} />{jam} WIB</span>}
                          {k.lokasi && <span className="inline-flex items-center gap-1"><MapPin size={11} />{k.lokasi}</span>}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>

              {/* Tombol aksi */}
              <div className="flex shrink-0 flex-wrap gap-2 border-t border-gray-100 px-5 py-3 sm:px-6">
                {ev.daftar && !berlangsung && (
                  <a href={ev.daftar} target="_blank" rel="noopener noreferrer"
                    className="inline-flex w-full sm:w-auto sm:flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/20 transition hover:opacity-90">
                    {label.daftar}<ArrowRight size={15} />
                  </a>
                )}
                {ev.situs && (
                  <a href={ev.situs} target="_blank" rel="noopener noreferrer"
                    className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-teal-500 hover:text-teal-700">
                    <Globe size={15} />{label.situs}
                  </a>
                )}
                {ev.guidebook && (
                  <a href={ev.guidebook} target="_blank" rel="noopener noreferrer"
                    className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary">
                    <BookOpen size={15} />{label.panduan}
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
