import type { Metadata } from "next";
import TeamDirectory from "./TeamDirectory";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return {
    title: isEn ? "Our Team & Scientific Board | IYORA" : "Tim Kami & Dewan Pembina | IYORA",
    description: isEn
      ? "Meet the dedicated team, scientific curators, juries, and academic board empowering Indonesian youth in national and international science olympiads."
      : "Mengenal profil tim, kurator naskah soal, dewan juri, dan pimpinan IYORA yang berdedikasi memajukan talenta sains pemuda Indonesia.",
    openGraph: {
      title: isEn ? "Our Team & Scientific Board - IYORA" : "Tim Kami & Dewan Pembina - IYORA",
      description: isEn
        ? "Meet the dedicated team, scientific curators, juries, and academic board empowering Indonesian youth in science olympiads."
        : "Mengenal profil tim, kurator naskah soal, dewan juri, dan pimpinan IYORA.",
      images: [
        {
          url: "https://res.cloudinary.com/dvcufsiy1/image/upload/v1782429397/IYORA_BRAND_GUIDELINE_a6kwif.png",
          width: 1200,
          height: 630,
          alt: "IYORA Team",
        },
      ],
    },
  };
}

export default function TeamPage() {
  return <TeamDirectory />;
}
