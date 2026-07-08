import { getLocale } from "next-intl/server";
import "./globals.css";

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://iyora.or.id/#organization",
      "name": "IYORA",
      "alternateName": [
        "Indonesian Youth Outstanding Recognition Association",
        "IYORA Olympiad",
        "IYORA Indonesia",
      ],
      "url": "https://iyora.or.id",
      "logo": {
        "@type": "ImageObject",
        "url": "https://res.cloudinary.com/dvcufsiy1/image/upload/v1782429397/iyora_icon_logo_okhxbo.png",
        "width": 512,
        "height": 512,
      },
      "image": "https://res.cloudinary.com/dvcufsiy1/image/upload/v1782429397/IYORA_BRAND_GUIDELINE_a6kwif.png",
      "description": "IYORA (Indonesian Youth Outstanding Recognition Association) adalah lembaga olimpiade sains pemuda Indonesia yang menyelenggarakan 14 cabang olimpiade bertaraf nasional dan internasional, seluruhnya terkurasi resmi oleh Puspresnas Kemendikbud RI.",
      "foundingDate": "2025",
      "areaServed": {
        "@type": "Country",
        "name": "Indonesia",
      },
      "knowsAbout": [
        "Science Olympiad",
        "Youth Competition",
        "Biology Olympiad",
        "Physics Olympiad",
        "Chemistry Olympiad",
        "Mathematics Olympiad",
        "Geography Olympiad",
        "Environment Olympiad",
        "Olimpiade Sains Indonesia",
      ],
      "parentOrganization": {
        "@type": "Organization",
        "@id": "https://www.iysa.or.id/#organization",
        "name": "IYSA",
        "alternateName": "Indonesian Youth Science Association",
        "url": "https://www.iysa.or.id",
      },
      "subOrganization": [
        { "@type": "Organization", "name": "IYGO", "url": "https://iygo.iyora.or.id" },
        { "@type": "Organization", "name": "NYGO", "url": "https://nygo.iyora.or.id" },
        { "@type": "Organization", "name": "IYEO", "url": "https://iyeo.iyora.or.id" },
        { "@type": "Organization", "name": "NYEO", "url": "https://nyeo.iyora.or.id" },
        { "@type": "Organization", "name": "IYBO", "url": "https://iybo.iyora.or.id" },
        { "@type": "Organization", "name": "NYBO", "url": "https://nybo.iyora.or.id" },
        { "@type": "Organization", "name": "IYCO", "url": "https://iyco.iyora.or.id" },
        { "@type": "Organization", "name": "NYCO", "url": "https://nyco.iyora.or.id" },
        { "@type": "Organization", "name": "IYMO", "url": "https://iymo.iyora.or.id" },
        { "@type": "Organization", "name": "NYMO", "url": "https://nymo.iyora.or.id" },
        { "@type": "Organization", "name": "IYPO", "url": "https://iypo.iyora.or.id" },
        { "@type": "Organization", "name": "NYPO", "url": "https://nypo.iyora.or.id" },
        { "@type": "Organization", "name": "WSO",  "url": "https://wso.iyora.or.id" },
        { "@type": "Organization", "name": "OS2MN","url": "https://os2mn.iyora.or.id" },
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://iyora.or.id/#website",
      "name": "IYORA",
      "url": "https://iyora.or.id",
      "publisher": { "@id": "https://iyora.or.id/#organization" },
      "inLanguage": ["id-ID", "en-US"],
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://iyora.or.id/id/competitions",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="https://res.cloudinary.com/dvcufsiy1/image/upload/v1782429397/iyora_icon_logo_okhxbo.png"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
