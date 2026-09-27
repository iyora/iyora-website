import type { Metadata } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Mitra",
  description:
    "Bergabunglah sebagai mitra strategis IYORA dan jadilah bagian dari ekosistem olimpiade sains pemuda Indonesia.",
};

interface Tier {
  name: string;
  color: string;
  accentBg: string;
  accentText: string;
  borderColor: string;
  benefits: string[];
  cta: string;
}

function PartnersContent() {
  const t = useTranslations("nav");

  const tiers: Tier[] = [
    {
      name: "Gold Partner",
      color: "#fb9722",
      accentBg: "bg-accent/10",
      accentText: "text-accent",
      borderColor: "border-accent",
      benefits: [
        "Logo utama di semua materi & platform IYORA",
        "Booth eksklusif di setiap event olimpiade",
        "Hak naming pada kategori olimpiade pilihan",
        "Fitur khusus dalam laporan tahunan IYORA",
        "Akses data agregat peserta (anonim)",
        "Undangan ke semua upacara pembukaan & penutupan",
        "Konten promosi co-branded di media sosial IYORA",
      ],
      cta: "Diskusikan Kemitraan Gold",
    },
    {
      name: "Silver Partner",
      color: "#39bcbe",
      accentBg: "bg-teal/10",
      accentText: "text-teal",
      borderColor: "border-teal",
      benefits: [
        "Logo di website resmi IYORA",
        "Tampilan banner di venue olimpiade",
        "Mention di siaran pers & pengumuman resmi",
        "Partisipasi dalam program beasiswa IYORA",
        "Undangan ke upacara pemberian penghargaan",
        "Konten kolaborasi di media sosial",
      ],
      cta: "Diskusikan Kemitraan Silver",
    },
    {
      name: "Supporting Partner",
      color: "#66449b",
      accentBg: "bg-primary/10",
      accentText: "text-primary",
      borderColor: "border-primary",
      benefits: [
        "Logo di halaman mitra website IYORA",
        "Acknowledgment di materi event",
        "Sertifikat apresiasi dari IYORA",
        "Akses ke komunitas alumni olimpiade IYORA",
      ],
      cta: "Diskusikan Kemitraan",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero pt-32 pb-24 text-white text-center px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest opacity-70 mb-4">
            Kemitraan Strategis
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Jadilah Bagian dari Gerakan
          </h1>
          <p className="text-lg md:text-xl opacity-90 leading-relaxed">
            IYORA mengundang institusi, perusahaan, dan organisasi yang
            berkomitmen pada kemajuan generasi muda Indonesia untuk bergabung
            sebagai mitra strategis kami.
          </p>
        </div>
      </section>

      {/* Why Partner */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            Mengapa Bermitra dengan IYORA?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-14 leading-relaxed">
            Lebih dari sekadar sponsor — kemitraan dengan IYORA adalah investasi
            nyata dalam ekosistem sains pemuda Indonesia yang terus berkembang.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: "Jangkauan Luas",
                desc: "Akses ke peserta olimpiade IYORA dari delapan negara, ditambah jaringan ekosistem IYSA yang mencatat 19.727 peserta dari 55 negara sejak 2021.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Reputasi Terpercaya",
                desc: "Dibangun di atas fondasi IYSA yang beroperasi sejak November 2018 dengan rekam jejak yang teruji.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Dampak Nyata",
                desc: "Investasi langsung dalam pengembangan talenta sains muda yang akan menjadi pemimpin masa depan bangsa.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-8 border border-gray-100 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                  {icon}
                </div>
                <h3 className="font-bold text-primary text-lg mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Tiers */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Paket Kemitraan
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Pilih tingkat kemitraan yang sesuai dengan tujuan dan komitmen
              lembaga Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => (
              <div
                key={tier.name}
                className={`relative bg-white rounded-2xl border-2 ${tier.borderColor} flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl`}
              >
                {/* Tier header */}
                <div
                  className="p-6"
                  style={{ backgroundColor: `${tier.color}15` }}
                >
                  {idx === 0 && (
                    <span className="inline-block text-xs font-bold uppercase tracking-widest bg-accent text-white px-3 py-1 rounded-full mb-3">
                      Most Impactful
                    </span>
                  )}
                  <h3
                    className="text-2xl font-bold mb-1"
                    style={{ color: tier.color }}
                  >
                    {tier.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Kemitraan{" "}
                    {idx === 0 ? "Utama" : idx === 1 ? "Menengah" : "Pendukung"}
                  </p>
                </div>

                {/* Benefits */}
                <div className="p-6 flex-1">
                  <ul className="space-y-3">
                    {tier.benefits.map((benefit) => (
                      <li key={benefit} className="flex gap-3 text-sm text-gray-600">
                        <svg
                          className="w-5 h-5 shrink-0 mt-0.5"
                          style={{ color: tier.color }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="p-6 pt-0">
                  <Link
                    href="/id/contact"
                    className="block w-full text-center py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg"
                    style={{ backgroundColor: tier.color }}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            Tertarik Bermitra?
          </h2>
          <p className="text-gray-600 text-lg mb-10 leading-relaxed">
            Tim kami siap mendiskusikan paket kemitraan yang paling sesuai
            dengan kebutuhan dan tujuan institusi Anda. Hubungi kami sekarang.
          </p>
          <Link
            href="/id/contact"
            className="inline-block px-10 py-4 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors duration-200 shadow-lg shadow-primary/30"
          >
            Hubungi Tim IYORA
          </Link>
        </div>
      </section>
    </>
  );
}

export default function PartnersPage() {
  return <PartnersContent />;
}
