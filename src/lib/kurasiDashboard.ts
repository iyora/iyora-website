/**
 * Hasil kurasi Puspresnas olimpiade IYORA dari API publik dashboard IYSA
 * (2026-11-17). Hanya edisi yang SUDAH SELESAI DIKURASI dan BERBINTANG
 * (bintang ≥ 1) yang ditampilkan di situs.
 *
 * Sumber: `/api/public/v1/_seri` (daftar ajang, jenis olympiad) lalu per ajang
 * `?sections=identitas,kurasi_progres,kurasi_dokumen` — `kurasi_progres.edisi_list`
 * memuat semua tahun, langkah `status_kurasi` membawa bintang & skor. Data
 * di-cache 15 menit, jadi catatan baru di dashboard muncul sendiri.
 */

const API = (process.env.IYSA_PUBLIC_API || "https://api-dashboard.iysa.or.id/api/public/v1").replace(/\/$/, "");
const SEGAR = 900;

export interface HasilKurasi {
  akronim: string;
  nama: string;
  tahun: string;
  bintang: number;
  skor: number | null;
  /** Tanggal selesai dikurasi (ISO) bila tercatat. */
  selesai: string | null;
  /** Folder/berkas kurasi edisi itu bila dibagikan. */
  dokumen: string | null;
  situs: string | null;
}

type Langkah = { langkah: string; status: string | null; terjadi_pada: string | null; bintang: number | null; skor: number | null };
type Seksi = { key: string; isi?: unknown; edisi_list?: Array<{ tahun: string; isi: Langkah[] }> };

async function ambil<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { next: { revalidate: SEGAR }, signal: AbortSignal.timeout(10000) });
    if (!r.ok) return null;
    const j = (await r.json()) as { data?: T };
    return j.data ?? null;
  } catch {
    return null;
  }
}

/** "National Youth Chemistry Olympiad 2026" → "National Youth Chemistry Olympiad". */
const tanpaTahun = (nama: string) => nama.replace(/\s+(19|20)\d{2}(\s*(batch|gelombang)\s*\d+)?$/i, "").trim();

export async function ambilHasilKurasi(): Promise<HasilKurasi[]> {
  const seri = (await ambil<{ seri: Array<{ akronim: string; nama: string; jenis: string; situs: string | null }> }>(`${API}/_seri`))?.seri ?? [];
  const olimpiade = seri.filter((s) => s.jenis === "olympiad");
  const per = await Promise.all(olimpiade.map(async (s) => {
    const d = await ambil<{ sections: Seksi[] }>(`${API}/${encodeURIComponent(s.akronim)}?sections=identitas,kurasi_progres,kurasi_dokumen`);
    if (!d) return [];
    const sk = Object.fromEntries(d.sections.map((x) => [x.key, x]));
    const idt = (sk.identitas?.isi ?? {}) as { nama?: string };
    const nama = tanpaTahun(idt.nama || s.nama || s.akronim);
    const dokumen = ((sk.kurasi_dokumen?.isi ?? []) as Array<{ url?: string; tahun?: string | null }>).filter((x) => x.url);
    const hasil: HasilKurasi[] = [];
    for (const e of sk.kurasi_progres?.edisi_list ?? []) {
      const st = e.isi.find((x) => x.langkah === "status_kurasi");
      const bintang = Number(st?.bintang ?? 0);
      if (!st || !/selesai/i.test(st.status ?? "") || !(bintang >= 1)) continue;
      hasil.push({
        akronim: s.akronim, nama, tahun: String(e.tahun), bintang,
        skor: st.skor == null ? null : Number(st.skor),
        selesai: st.terjadi_pada ?? null,
        dokumen: dokumen.find((x) => String(x.tahun ?? "") === String(e.tahun))?.url ?? null,
        situs: s.situs || null,
      });
    }
    return hasil;
  }));
  return per.flat().sort((a, b) =>
    b.tahun.localeCompare(a.tahun) || b.bintang - a.bintang || (b.skor ?? 0) - (a.skor ?? 0) || a.akronim.localeCompare(b.akronim));
}
