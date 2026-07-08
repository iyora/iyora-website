import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://iyora.or.id"),
  title: {
    default: "IYORA — Indonesian Youth Outstanding Recognition Association",
    template: "%s | IYORA",
  },
  description:
    "IYORA (Indonesian Youth Outstanding Recognition Association) adalah lembaga olimpiade sains pemuda Indonesia. Menyelenggarakan 14 cabang olimpiade bertaraf nasional & internasional, seluruhnya terkurasi resmi Puspresnas Kemendikbud RI.",
  keywords: [
    "IYORA",
    "Indonesian Youth Outstanding Recognition Association",
    "olimpiade sains Indonesia",
    "science olympiad Indonesia",
    "IYGO", "NYGO", "IYEO", "NYEO",
    "IYBO", "NYBO", "IYCO", "NYCO",
    "IYMO", "NYMO", "IYPO", "NYPO",
    "WSO", "OS2MN",
    "olimpiade sains nasional",
    "olimpiade sains internasional",
    "kompetisi sains pelajar",
    "Puspresnas",
    "olimpiade terkurasi Kemendikbud",
    "PPDB olimpiade",
    "SNBT olimpiade sains",
    "IYSA olimpiade",
    "youth olympiad Indonesia",
    "biology olympiad Indonesia",
    "physics olympiad Indonesia",
    "chemistry olympiad Indonesia",
    "mathematics olympiad Indonesia",
    "geography olympiad Indonesia",
  ],
  authors: [{ name: "IYORA", url: "https://iyora.or.id" }],
  creator: "IYORA — Indonesian Youth Outstanding Recognition Association",
  publisher: "IYORA",
  category: "Education",
  classification: "Science Olympiad, Youth Competition, Education",
  openGraph: {
    title: "IYORA — Indonesian Youth Outstanding Recognition Association",
    description:
      "Lembaga olimpiade sains pemuda Indonesia. 14 cabang olimpiade nasional & internasional, terkurasi resmi Puspresnas Kemendikbud RI. Lahir dari IYSA.",
    url: "https://iyora.or.id",
    siteName: "IYORA",
    locale: "id_ID",
    alternateLocale: "en_US",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dvcufsiy1/image/upload/v1782429397/IYORA_BRAND_GUIDELINE_a6kwif.png",
        width: 1200,
        height: 630,
        alt: "IYORA — Indonesian Youth Outstanding Recognition Association",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IYORA — Indonesian Youth Outstanding Recognition Association",
    description:
      "Lembaga olimpiade sains pemuda Indonesia. 14 cabang olimpiade nasional & internasional, terkurasi resmi Puspresnas.",
    images: ["https://res.cloudinary.com/dvcufsiy1/image/upload/v1782429397/IYORA_BRAND_GUIDELINE_a6kwif.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://iyora.or.id/id",
    languages: {
      "id-ID": "https://iyora.or.id/id",
      "en-US": "https://iyora.or.id/en",
    },
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "id" | "en")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
