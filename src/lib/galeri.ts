/**
 * Galeri IYORA (2026-11-17) — tampilan mengikuti situs IYSA (/galeri/foto).
 *
 * Foto = album per kegiatan dari dua sumber:
 *  1. Dashboard IYSA `GET /api/public/v1/_dokumentasi?lembaga=IYORA` — dokumentasi
 *     edisi yang diunggah panitia (foto + keterangan, folder Drive).
 *  2. Album galeri yang dikelola tim di `src/data/dummyNews.ts` (kategori
 *     `gallery` yang punya `photos`).
 * Video = item galeri `dummyNews.ts` yang tautannya YouTube.
 */
import { DUMMY_NEWS } from "@/data/dummyNews";

const API = (process.env.IYSA_PUBLIC_API || "https://api-dashboard.iysa.or.id/api/public/v1").replace(/\/$/, "");

export type FotoAlbum = { gambar: string; label: string; jenis: string };
export type Album = {
  kunci: string;
  judul: string;
  subjudul: string | null;
  tahun: string;
  tanggal: string | null;
  logo: string | null;
  foto: FotoAlbum[];
  folder: string | null;
};
export type VideoGaleri = { id: string; judul: string; tahun: string; keterangan: string | null };

type AlbumDasbor = {
  akronim: string; nama: string; tahun: string; slug: string; logo: string | null; mulai: string | null;
  foto: FotoAlbum[]; tautan: { luring: string | null; daring: string | null; sarpras: string | null };
};

/** Gambar dashboard diperkecil lewat proksi /media (?w=); gambar lokal apa adanya. */
export const kecil = (url: string, w: 320 | 640 | 960 | 1280) =>
  /\/media\//.test(url) ? `${url}${url.includes("?") ? "&" : "?"}w=${w}` : url;

async function albumDasbor(): Promise<Album[]> {
  try {
    const r = await fetch(`${API}/_dokumentasi?lembaga=IYORA`, { next: { revalidate: 900 }, signal: AbortSignal.timeout(10000) });
    if (!r.ok) return [];
    const j = (await r.json()) as { data?: { album?: AlbumDasbor[] } };
    return (j.data?.album ?? []).map((a) => ({
      kunci: a.slug,
      judul: `${a.akronim} ${a.tahun}`,
      subjudul: a.nama.replace(/\s+(19|20)\d{2}$/, ""),
      tahun: String(a.tahun),
      tanggal: a.mulai,
      logo: a.logo,
      foto: a.foto ?? [],
      folder: a.tautan.luring ?? a.tautan.daring ?? a.tautan.sarpras,
    }));
  } catch {
    return [];
  }
}

const galeriLokal = () => DUMMY_NEWS.filter((n) => n.category === "gallery");

function albumLokal(isEn: boolean): Album[] {
  return galeriLokal()
    .filter((n) => (n.photos?.length ?? 0) > 0)
    .map((n) => {
      const judul = isEn && n.title_en ? n.title_en : n.title;
      const ket = isEn && n.caption_en ? n.caption_en : n.caption;
      return {
        kunci: n.slug,
        judul,
        subjudul: ket,
        tahun: n.publishedAt.slice(0, 4),
        tanggal: n.publishedAt,
        logo: null,
        foto: (n.photos ?? []).map((g) => ({ gambar: g, label: judul, jenis: "" })),
        folder: n.link && /drive\.google/.test(n.link) ? n.link : null,
      };
    });
}

export async function ambilAlbum(locale: string): Promise<Album[]> {
  const isEn = locale === "en";
  const dasbor = await albumDasbor();
  return [...dasbor, ...albumLokal(isEn)]
    .filter((a) => a.foto.length > 0 || a.folder)
    /* Album berfoto lebih dulu; album yang baru punya folder Drive (acara belum/baru berjalan) di belakang. */
    .sort((a, b) => Number(b.foto.length > 0) - Number(a.foto.length > 0) || String(b.tanggal ?? b.tahun).localeCompare(String(a.tanggal ?? a.tahun)));
}

const idYoutube = (u: string) => u.match(/(?:youtu\.be\/|embed\/|v=|shorts\/)([\w-]{11})/)?.[1] ?? null;

export function ambilVideo(locale: string): VideoGaleri[] {
  const isEn = locale === "en";
  return galeriLokal()
    .map((n) => {
      const id = [n.link, n.link2, n.link3].map((l) => (l ? idYoutube(l) : null)).find(Boolean);
      return id
        ? { id, judul: isEn && n.title_en ? n.title_en : n.title, tahun: n.publishedAt.slice(0, 4), keterangan: (isEn && n.caption_en ? n.caption_en : n.caption) || null }
        : null;
    })
    .filter((v): v is VideoGaleri => !!v)
    .sort((a, b) => b.tahun.localeCompare(a.tahun));
}
