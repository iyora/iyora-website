export interface DummyNewsletterItem {
  id: string;
  slug: string;
  title: string;
  title_en?: string;
  edition: string;
  edition_en?: string;
  description: string;
  description_en?: string;
  coverImage: string;
  fileUrl: string;
  publishedAt: string;
  author?: string;
  pages?: number;
  featured?: boolean;
  tags?: string[];
  readTime?: string;
  views?: number;
}

export const DUMMY_NEWSLETTERS: DummyNewsletterItem[] = [
  {
    id: "newsletter-edisi-03-2026",
    slug: "iyora-newsletter-edisi-03-agustus-2026",
    title: "IYORA Youth Science Bulletin: Semangat Juara Olimpiade Geografi & Ekonomi 2026",
    title_en: "IYORA Youth Science Bulletin: Champion Spirit in Geography & Economics Olympiad 2026",
    edition: "Edisi 03 — Agustus 2026",
    edition_en: "Issue 03 — August 2026",
    description: "Sorotan khusus pelaksanaan babak final NYGO, IYGO, NYEO, dan IYEO 2026, profil sang juara medalis emas, panduan persiapan menuju olimpiade sains berikutnya, serta ulasan kurasi SIMT Puspresnas.",
    description_en: "Special coverage of NYGO, IYGO, NYEO, and IYEO 2026 finals, gold medalist profiles, preparation guide for upcoming science olympiads, and SIMT Puspresnas accreditation insights.",
    coverImage: "/images/galeri/press.jpeg",
    fileUrl: "https://api.iyora.or.id/storage/v1/object/public/event-media/0a2f7235-47dc-4988-8096-b11665778032/guidebooks/1785738982960-GUIDEBOOK_NYGO_2026.pdf",
    publishedAt: "2026-08-30",
    author: "Redaksi IYORA Bulletin",
    pages: 16,
    featured: true,
    tags: ["Olimpiade 2026", "Prestasi", "Geografi", "Ekonomi", "SIMT Puspresnas"],
    readTime: "8 min read",
    views: 1485,
  },
  {
    id: "newsletter-edisi-02-2026",
    slug: "iyora-newsletter-edisi-02-juli-2026",
    title: "Menjelajah Batas Sains: Persiapan Pembukaan NSO & NSMO Musim 2026",
    title_en: "Exploring the Frontiers of Science: Preparing for NSO & NSMO Season 2026",
    edition: "Edisi 02 — Juli 2026",
    edition_en: "Issue 02 — July 2026",
    description: "Panduan lengkap pendaftaran National Science Olympiad (NSO) dan National Science and Math Olympiad (NSMO), wawancara eksklusif dewan juri, dan tips belajar olimpiade tingkat lanjut.",
    description_en: "Complete registration guide for NSO and NSMO, exclusive interviews with the jury board, and advanced science olympiad study tips.",
    coverImage: "/images/galeri/rondee2.png",
    fileUrl: "https://api.iyora.or.id/storage/v1/object/public/event-media/cf86f6fb-83e8-4fd4-8356-e3ac76936b50/guidebooks/1788455563288-BUKU-PANDUAN-NSO-2026.pdf",
    publishedAt: "2026-07-25",
    author: "Tim Riset & Edukasi IYORA",
    pages: 12,
    featured: false,
    tags: ["NSO", "NSMO", "Tips Olimpiade", "Sains Terapan"],
    readTime: "6 min read",
    views: 940,
  },
  {
    id: "newsletter-edisi-01-2026",
    slug: "iyora-newsletter-edisi-01-juni-2026",
    title: "Edisi Perdana: Transformasi IYORA Mewadahi Talenta Sains Terbaik Generasi Bangsa",
    title_en: "Inaugural Issue: IYORA Transformation in Empowering Top Young Scientific Talents",
    edition: "Edisi 01 — Juni 2026",
    edition_en: "Issue 01 — June 2026",
    description: "Mengenal lebih dalam perjalanan IYORA dari IYSA, peluncuran 14 cabang olimpiade sains nasional & internasional, serta integrasi resmi penghargaan siswa dengan sistem kurasi talenta Kemendikbudristek.",
    description_en: "Deep dive into IYORA's journey from IYSA, launch of 14 national and international science olympiad branches, and official talent accreditation.",
    coverImage: "/images/galeri/open.png",
    fileUrl: "https://api.iyora.or.id/storage/v1/object/public/event-media/99fe4bb3-2e06-4444-93ec-e8b2649b1ff3/guidebooks/1788772757309-JUKNIS_EVENT_DSCF_2026.pdf",
    publishedAt: "2026-06-15",
    author: "Direksi & Humas IYORA",
    pages: 14,
    featured: false,
    tags: ["Edisi Perdana", "Profil Lembaga", "Kurasi Puspresnas", "Visi 2026"],
    readTime: "7 min read",
    views: 2130,
  },
];

export function getDummyNewsletters() {
  return [...DUMMY_NEWSLETTERS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getDummyNewsletterBySlug(slug: string) {
  const decoded = decodeURIComponent(slug).toLowerCase().trim();
  const normalized = decoded.replace(/[^a-z0-9]+/g, "-");
  return DUMMY_NEWSLETTERS.find((item) => {
    const itemSlugDecoded = item.slug.toLowerCase().trim();
    const itemSlugNormalized = itemSlugDecoded.replace(/[^a-z0-9]+/g, "-");
    return (
      item.slug === slug ||
      itemSlugDecoded === decoded ||
      itemSlugNormalized === normalized ||
      item.id === slug
    );
  });
}
