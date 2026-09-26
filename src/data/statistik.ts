/**
 * Angka untuk blok "Pencapaian Sejauh Ini".
 *
 * Nilai yang tampil diambil hidup dari dashboard (`/api/public/stats`), yang
 * menjumlahkan dua sumber: CBT lama IYSA (November 2025 – Juni 2026, sudah
 * dibekukan karena sistemnya tidak dipakai lagi) dan basis data IYORA sekarang.
 *
 * Angka di bawah hanya cadangan kalau dashboard tidak bisa dihubungi. Ia hasil
 * pembacaan 27 September 2026 — bukan karangan, dan bukan pula yang dulu
 * terpasang di sini (20+ negara, 50.000+ siswa, 10+ tahun) yang tidak berasal
 * dari data mana pun.
 *
 * Kalau nilai cadangan ini perlu disegarkan, panggil endpoint yang sama dan
 * salin hasilnya — jangan menaksir.
 */
export interface StatistikSitus {
  /** Cabang olimpiade yang sudah benar-benar digelar sampai pengumuman hasil. */
  disciplines: number;
  /** Negara asal peserta yang tercatat, setelah isian bukan-negara dibuang. */
  countries: number;
  /** Orang unik di kedua sistem; yang ikut di dua-duanya dihitung sekali. */
  students: number;
  /** Medali yang sudah diumumkan resmi. */
  medals: number;
}

export const STATISTIK_CADANGAN: StatistikSitus = {
  disciplines: 14,
  countries: 8,
  students: 708,
  medals: 138,
};
