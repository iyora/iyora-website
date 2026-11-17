import Link from "next/link";

/** Kepala halaman galeri: judul + tab Foto / Video (pola situs IYSA, warna IYORA). */
export default function GaleriKepala({
  locale, aktif, judul, lead,
}: { locale: string; aktif: "photo" | "video"; judul: string; lead: string }) {
  const isEn = locale === "en";
  const tab = (k: "photo" | "video", teks: string) => (
    <Link
      href={`/${locale}/gallery/${k}`}
      aria-current={aktif === k ? "page" : undefined}
      className={`rounded-full px-5 py-1.5 text-sm font-semibold transition-colors ${
        aktif === k ? "bg-white text-primary shadow" : "text-white/85 hover:text-white"
      }`}
    >
      {teks}
    </Link>
  );
  return (
    <section className="gradient-hero px-6 pb-10 pt-32 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">{isEn ? "IYORA Gallery" : "Galeri IYORA"}</p>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">{judul}</h1>
          <p className="mt-3 max-w-2xl text-base text-white/85">{lead}</p>
        </div>
        <nav className="flex w-fit gap-1 rounded-full border border-white/30 bg-white/10 p-1 backdrop-blur-sm">
          {tab("photo", isEn ? "Photos" : "Foto")}
          {tab("video", "Video")}
        </nav>
      </div>
    </section>
  );
}
