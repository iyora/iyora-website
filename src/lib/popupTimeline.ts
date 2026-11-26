/**
 * Isi popup event beranda (2026-11-17): timeline olimpiade yang PENDAFTARANNYA
 * DIBUKA, dibaca dari API publik dashboard — tidak lagi poster gambar statis.
 *
 * 2026-11-23: juga ajang yang SEDANG BERLANGSUNG — pendaftaran sudah ditutup
 * (tanggal tutup lewat) tetapi tanggal awarding belum lewat (WIB). Tanggal
 * awarding = agenda Awarding/Penganugerahan/Pengumuman Pemenang/Closing
 * terakhir di jadwal, atau tanggal selesai edisi. Aturannya sama dengan tab
 * "Sedang Berlangsung" di /competitions/timeline.
 *
 * Ajang ikut popup bila: jenis olympiad, `identitas.pendaftaran_dibuka`, dan
 * punya `jadwal_kegiatan`. Togel pendaftaran di dashboard otomatis
 * memunculkan/menyembunyikan ajangnya di sini. Cache 15 menit.
 */

const API = (process.env.IYSA_PUBLIC_API || "https://api-dashboard.iysa.or.id/api/public/v1").replace(/\/$/, "");
const SEGAR = 900;

export interface TitikTimeline {
  milestone: string;
  tanggal: string;
  jalur: string | null;
  lokasi: string | null;
  jam_mulai: string | null;
  jam_selesai: string | null;
}

export interface AcaraPopup {
  akronim: string;
  nama: string;
  tahun: string;
  logo: string | null;
  banner: string | null;
  situs: string | null;
  daftar: string | null;
  guidebook: string | null;
  tutup: string | null;
  lingkup: string | null;
  /** "open" = pendaftaran dibuka; "ongoing" = pendaftaran ditutup, acara berjalan sampai awarding. */
  status: "open" | "ongoing";
  /** Tanggal awarding (YYYY-MM-DD) bila diketahui. */
  awarding: string | null;
  /** Tonggak utama (jadwal kegiatan) — urut tanggal. */
  jadwal: TitikTimeline[];
  /** Timeline rinci luring/daring dengan jam. */
  rinci: TitikTimeline[];
}

type Seksi = { key: string; isi?: unknown };

async function ambil<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { next: { revalidate: SEGAR }, signal: AbortSignal.timeout(8000) });
    if (!r.ok) return null;
    return ((await r.json()) as { data?: T }).data ?? null;
  } catch {
    return null;
  }
}

const urut = (a: TitikTimeline, b: TitikTimeline) =>
  a.tanggal.localeCompare(b.tanggal) || (a.jam_mulai ?? "").localeCompare(b.jam_mulai ?? "");

const rapikan = (x: Partial<TitikTimeline>): TitikTimeline | null =>
  x.milestone && x.tanggal
    ? {
        milestone: x.milestone.replace(/\s+/g, " ").trim(),
        tanggal: x.tanggal.slice(0, 10),
        jalur: x.jalur || null,
        lokasi: x.lokasi || null,
        jam_mulai: x.jam_mulai || null,
        jam_selesai: x.jam_selesai || null,
      }
    : null;

const POLA_AWARDING = /award|penganugerahan|pengumuman pemenang|winner announcement|closing|penutupan/i;
const hariIniWib = () => new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);

export async function ambilAcaraPopup(): Promise<AcaraPopup[]> {
  const seri = (await ambil<{ seri: Array<{ akronim: string; jenis: string }> }>(`${API}/_seri`))?.seri ?? [];
  const hasil = await Promise.all(
    seri.filter((s) => s.jenis === "olympiad").map(async (s): Promise<AcaraPopup | null> => {
      const d = await ambil<{ sections: Seksi[] }>(
        `${API}/${encodeURIComponent(s.akronim)}?sections=identitas,jadwal_kegiatan,timeline,guidebook`);
      if (!d) return null;
      const sk = Object.fromEntries(d.sections.map((x) => [x.key, x.isi]));
      const i = (sk.identitas ?? {}) as Record<string, any>;
      const jadwal = ((sk.jadwal_kegiatan ?? []) as Partial<TitikTimeline>[]).map(rapikan).filter((x): x is TitikTimeline => !!x).sort(urut);
      if (!jadwal.length) return null;
      const rinci = ((sk.timeline ?? []) as Partial<TitikTimeline>[]).map(rapikan).filter((x): x is TitikTimeline => !!x).sort(urut);
      const tglAward = [...jadwal, ...rinci].filter((k) => POLA_AWARDING.test(k.milestone)).map((k) => k.tanggal).sort();
      const awarding = tglAward.length ? tglAward[tglAward.length - 1] : (i.selesai ? String(i.selesai).slice(0, 10) : null);
      const kini = hariIniWib();
      const tutup = i.pendaftaran_tutup ? String(i.pendaftaran_tutup).slice(0, 10) : null;
      let status: AcaraPopup["status"];
      if (i.pendaftaran_dibuka) status = "open";
      else if (tutup && tutup < kini && awarding && awarding >= kini) status = "ongoing";
      else return null;
      const situs = (i.situs as string) || null;
      return {
        akronim: i.akronim || s.akronim,
        nama: String(i.nama || s.akronim).replace(/\s+(19|20)\d{2}$/, ""),
        tahun: String(i.tahun ?? ""),
        logo: i.logo || null,
        banner: i.banner || null,
        situs,
        daftar: i.pendaftaran_url || (situs ? `${situs.replace(/\/$/, "")}/register` : null),
        guidebook:
          ((sk.guidebook ?? {}) as { url?: string; berkas?: Array<{ jenis?: string; url?: string }> }).url ||
          ((sk.guidebook ?? {}) as { url?: string; berkas?: Array<{ jenis?: string; url?: string }> }).berkas?.find(
            (b) => b.jenis === "guidebook" || (typeof b.url === "string" && b.url.toLowerCase().endsWith(".pdf"))
          )?.url ||
          null,
        tutup: i.pendaftaran_tutup || null,
        lingkup: i.lingkup || null,
        status,
        awarding,
        jadwal,
        rinci,
      };
    }),
  );
  /* Pendaftaran dibuka dulu, lalu yang berlangsung (awarding terdekat dulu). */
  return hasil.filter((x): x is AcaraPopup => !!x).sort((a, b) =>
    (a.status === b.status ? 0 : a.status === "open" ? -1 : 1)
    || (a.status === "ongoing" ? (a.awarding ?? "").localeCompare(b.awarding ?? "") : 0)
    || (a.jadwal[0]?.tanggal ?? "").localeCompare(b.jadwal[0]?.tanggal ?? ""));
}
