/**
 * Kalender olimpiade IYORA (2026-11-17) — pola kalender situs IYSA.
 *
 * Sumber: dashboard IYSA `GET /api/public/v1/_kalender` (jadwal kegiatan peserta
 * + tanggal penting tiap edisi), disaring ke seri berjenis olympiad dari `_seri`
 * (IYORA + OS2MN yang berlembaga IYSA). Cache 15 menit.
 */

const API = (process.env.IYSA_PUBLIC_API || "https://api-dashboard.iysa.or.id/api/public/v1").replace(/\/$/, "");
const SEGAR = 900;

export type AgendaKalender = {
  tanggal: string; judul: string; jenis: "kegiatan" | "penting";
  jalur: string; lokasi: string; jam_mulai: string; jam_selesai: string;
};
export type EdisiKalender = {
  akronim: string; nama: string; tahun: string; slug: string; logo: string | null; situs: string | null;
  mulai: string | null; selesai: string | null; moda: string | null; lingkup: string | null;
  pendaftaran_dibuka: boolean; agenda: AgendaKalender[];
};

async function ambil<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { next: { revalidate: SEGAR }, signal: AbortSignal.timeout(8000) });
    if (!r.ok) return null;
    return ((await r.json()) as { data?: T }).data ?? null;
  } catch {
    return null;
  }
}

export async function ambilKalender(dari: string, sampai: string, bahasa: "id" | "en"): Promise<EdisiKalender[] | null> {
  const [seri, kal] = await Promise.all([
    ambil<{ seri: Array<{ akronim: string; jenis: string }> }>(`${API}/_seri`),
    ambil<{ edisi: EdisiKalender[] }>(`${API}/_kalender?lembaga=IYORA,IYSA&dari=${dari}&sampai=${sampai}&bahasa=${bahasa}`),
  ]);
  if (!seri || !kal) return null;
  const olimpiade = new Set(seri.seri.filter((s) => s.jenis === "olympiad").map((s) => s.akronim.toUpperCase()));
  return kal.edisi.filter((e) => olimpiade.has(e.akronim.toUpperCase()));
}

/** "2026-11" → { tahun, bulan } yang sah; selain itu bulan berjalan (WIB). */
export function bacaBulan(v: string | undefined, kini = new Date()) {
  const m = v?.match(/^(\d{4})-(\d{2})$/);
  if (m) {
    const t = Number(m[1]), b = Number(m[2]);
    if (t >= 2018 && t <= 2100 && b >= 1 && b <= 12) return { tahun: t, bulan: b };
  }
  const [t, b] = kini.toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" }).split("-").map(Number);
  return { tahun: t, bulan: b };
}

export const kunciBulan = (tahun: number, bulan: number) => `${tahun}-${String(bulan).padStart(2, "0")}`;

export function geserBulan(tahun: number, bulan: number, langkah: number) {
  const d = new Date(Date.UTC(tahun, bulan - 1 + langkah, 1));
  return { tahun: d.getUTCFullYear(), bulan: d.getUTCMonth() + 1 };
}

/** Sel kisi bulan (Senin pertama). `null` = di luar bulan. */
export function kisiBulan(tahun: number, bulan: number): (string | null)[] {
  const pertama = new Date(Date.UTC(tahun, bulan - 1, 1));
  const geser = (pertama.getUTCDay() + 6) % 7;
  const jumlah = new Date(Date.UTC(tahun, bulan, 0)).getUTCDate();
  const sel: (string | null)[] = Array(geser).fill(null);
  for (let h = 1; h <= jumlah; h++) sel.push(`${kunciBulan(tahun, bulan)}-${String(h).padStart(2, "0")}`);
  while (sel.length % 7) sel.push(null);
  return sel;
}
