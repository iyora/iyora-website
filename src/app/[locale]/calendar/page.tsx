import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import KalenderInteraktif, { type EntriKalender } from "@/components/kalender/KalenderInteraktif";
import { ambilKalender, bacaBulan, geserBulan, kisiBulan, kunciBulan } from "@/lib/kalender";

export const revalidate = 900;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Olympiad Calendar" : "Kalender Olimpiade",
    description: isEn
      ? "Schedule of IYORA olympiads: registration deadlines, opening ceremonies, exam rounds and awarding."
      : "Jadwal olimpiade IYORA: batas pendaftaran, pembukaan, babak ujian, hingga penganugerahan.",
  };
}

const HARI = {
  id: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};

/**
 * Kalender olimpiade (2026-11-17) — pola kalender situs IYSA: kisi bulan +
 * panel hari terpilih + ringkasan ajang bulan ini, `?bulan=YYYY-MM`.
 */
export default async function KalenderPage({
  params, searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ bulan?: string }>;
}) {
  const { locale: loc } = await params;
  const locale = loc === "en" ? "en" : "id";
  const isEn = locale === "en";
  const { tahun, bulan } = bacaBulan((await searchParams).bulan);
  const kunci = kunciBulan(tahun, bulan);
  const akhir = `${kunci}-${String(new Date(Date.UTC(tahun, bulan, 0)).getUTCDate()).padStart(2, "0")}`;
  const data = await ambilKalender(`${kunci}-01`, akhir, locale);

  const entri: EntriKalender[] = (data ?? [])
    .flatMap((e) => e.agenda.map((a) => ({
      tanggal: a.tanggal,
      judul: a.judul,
      jenis: a.jenis,
      jalur: a.jalur,
      lokasi: a.lokasi,
      jam: a.jam_mulai ? `${a.jam_mulai}${a.jam_selesai ? `–${a.jam_selesai}` : ""}` : "",
      akronim: e.akronim,
      tahun: e.tahun,
      logo: e.logo,
      situs: e.situs,
    })))
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal) || a.akronim.localeCompare(b.akronim));

  const hariIni = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
  const kini = bacaBulan(undefined);
  const sebelum = geserBulan(tahun, bulan, -1);
  const sesudah = geserBulan(tahun, bulan, 1);
  const judulBulan = new Date(Date.UTC(tahun, bulan - 1, 1)).toLocaleDateString(isEn ? "en-GB" : "id-ID", { month: "long", year: "numeric", timeZone: "UTC" });
  const tautan = (t: number, b: number) => `/${locale}/calendar?bulan=${kunciBulan(t, b)}`;
  const tombol = "grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/20";

  return (
    <>
      <section className="gradient-hero px-6 pb-10 pt-32 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">IYORA</p>
            <h1 className="mt-2 text-4xl font-bold md:text-5xl">{isEn ? "Olympiad Calendar" : "Kalender Olimpiade"}</h1>
            <p className="mt-3 max-w-2xl text-base text-white/85">
              {isEn
                ? "Registration deadlines, opening ceremonies, exam rounds and awarding of every IYORA olympiad."
                : "Batas pendaftaran, pembukaan, babak ujian, hingga penganugerahan setiap olimpiade IYORA."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={tautan(sebelum.tahun, sebelum.bulan)} scroll={false} className={tombol} aria-label={isEn ? "Previous month" : "Bulan sebelumnya"}>
              <ChevronLeft size={18} />
            </Link>
            <p className="min-w-[10rem] text-center text-lg font-bold capitalize">{judulBulan}</p>
            <Link href={tautan(sesudah.tahun, sesudah.bulan)} scroll={false} className={tombol} aria-label={isEn ? "Next month" : "Bulan berikutnya"}>
              <ChevronRight size={18} />
            </Link>
            {(kini.tahun !== tahun || kini.bulan !== bulan) && (
              <Link href={tautan(kini.tahun, kini.bulan)} scroll={false} className="ml-1 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow">
                {isEn ? "Today" : "Hari ini"}
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        {data === null ? (
          <p className="py-16 text-center text-gray-500">
            {isEn ? "The calendar could not be loaded. Please try again shortly." : "Kalender belum dapat dimuat. Silakan coba beberapa saat lagi."}
          </p>
        ) : (
          <KalenderInteraktif
            key={kunci}
            kisi={kisiBulan(tahun, bulan)}
            entri={entri}
            hariIni={hariIni}
            locale={locale}
            teks={isEn ? {
              hari: HARI.en, kosongHari: "No olympiad agenda on this date.", kosongBulan: "No olympiad agenda this month.",
              eventBulanIni: "Olympiads this month", agendaSatu: "# agenda", agendaBanyak: "# agenda items", lagi: "more",
              penting: "Deadline", kegiatan: "Activity", daring: "Online", luring: "Offline", situsResmi: "Official website",
              legendaKegiatan: "Activity", legendaPenting: "Important date",
            } : {
              hari: HARI.id, kosongHari: "Tidak ada agenda olimpiade pada tanggal ini.", kosongBulan: "Tidak ada agenda olimpiade bulan ini.",
              eventBulanIni: "Olimpiade bulan ini", agendaSatu: "# agenda", agendaBanyak: "# agenda", lagi: "lagi",
              penting: "Tanggal penting", kegiatan: "Kegiatan", daring: "Daring", luring: "Luring", situsResmi: "Situs resmi",
              legendaKegiatan: "Kegiatan", legendaPenting: "Tanggal penting",
            }}
          />
        )}
      </section>
    </>
  );
}
