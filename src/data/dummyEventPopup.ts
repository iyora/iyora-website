export interface EventPopupLink {
  label: string;
  label_en?: string;
  url: string;
  variant?: "primary" | "teal" | "indigo" | "rose" | "instagram" | "secondary";
}

export interface EventPopupData {
  id: string;
  isActive: boolean;
  badge: string;
  badge_en?: string;
  title: string;
  title_en?: string;
  subtitle?: string;
  subtitle_en?: string;
  image: string;
  content: string;
  content_en?: string;
  author: string;
  publishedAt: string;
  links: EventPopupLink[];
}
/* Press Release Dummy Popups (Strictly for Press Release / Siaran Pers Event) */
export const DUMMY_EVENT_POPUPS: EventPopupData[] = [
 {
    id: "popup-coming-soon-awarding-2026",
    isActive: true,
    badge: "🏆 COMING SOON: AWARDING CEREMONY",
    badge_en: "🏆 COMING SOON: AWARDING CEREMONY",
    title: "COMING SOON: AWARDING CEREMONY NYGO, IYGO, NYEO & IYEO 2026",
    title_en: "COMING SOON: AWARDING CEREMONY OF NYGO, IYGO, NYEO & IYEO 2026",
    subtitle: "awarding ceremony akan di laksanakan pada tanggal 27 Agustus 2026",
    subtitle_en: "The awarding ceremony will be held on August 27, 2026.",
    image: "/images/galeri/awarding.png",
    content:
      "Nantikan pengumuman pemenang olimpiade NYGO, IYGO, NYEO, & IYEO 2026 ! Bersiaplah menyaksikan para talenta muda terbaik dari seluruh Indonesia dan mancanegara meraih medali dan sertifikat terintegrasi SIMT Puspresnas Kemendikbudristek RI.",
    content_en:
      "Stay tuned for the grand awarding ceremony & winners announcement of NYGO, IYGO, NYEO, & IYEO 2026! Get ready to witness the best young talents from Indonesia and around the world receive their medals and official SIMT Puspresnas integrated certificates.",
    author: "Panitia IYORA",
    publishedAt: "2026-08-24",
    links: [
      {
        label: "Portal Resmi IYORA",
        label_en: "Official IYORA Portal",
        url: "https://iyora.or.id",
        variant: "primary",
      },
      {
        label: "Instagram @iyoraofficial",
        label_en: "Instagram @iyoraofficial",
        url: "https://www.instagram.com/iyoraofficial",
        variant: "instagram",
      },
    ],
  },
  {
    id: "press-release-popup-opening-2026",
    isActive: true,
    badge: "📰 SIARAN PERS RESMI",
    badge_en: "📰 OFFICIAL PRESS RELEASE",
    title: "SIARAN PERS: PEMBUKAAN RESMI (OPENING CEREMONY) NYGO, IYGO, NYEO & IYEO 2026",
    title_en: "PRESS RELEASE: OFFICIAL OPENING CEREMONY OF NYGO, IYGO, NYEO & IYEO 2026",
    subtitle: "Resmi Dibuka! Opening Ceremony NYGO & IYGO serta NYEO & IYEO 2026 Sukses Digelar Secara Daring pada 20 Agustus 2026.",
    subtitle_en: "Officially Opened! Online Opening Ceremony for NYGO, IYGO, NYEO & IYEO 2026 Successfully Held on August 20th, 2026.",
    /* 🖼️ GAMBAR UTAMA POP-UP (Ganti path / URL gambar di sini) */
    image: "/images/galeri/open.png",
    content:
      "DEPOK, 20 Agustus 2026 — Indonesian Youth Outstanding Recognition Association (IYORA) bekerjasama dengan Indonesian Young Scientist Association (IYSA) dan Malaysia Innovation Invention Creativity Association (MIICA) secara resmi membuka kompetisi olimpiade sains tingkat nasional dan internasional NYGO, IYGO, NYEO, dan IYEO 2026 secara daring. Seluruh sertifikat pemenang terintegrasi resmi dengan SIMT Puspresnas Kemendikbudristek RI.",
    content_en:
      "DEPOK, August 20, 2026 — Indonesian Youth Outstanding Recognition Association (IYORA) in collaboration with IYSA & MIICA officially opened the NYGO, IYGO, NYEO, and IYEO 2026 national and international science olympiads online. All winner certificates are officially integrated with SIMT Puspresnas.",
    author: "Humas IYORA",
    publishedAt: "2026-08-20",
    links: [
      {
        label: "Baca Siaran Pers Lengkap",
        label_en: "Read Full Press Release",
        url: "/news/siaran-pers-opening-ceremony-nygo-iygo-nyeo-iyeo-2026",
        variant: "primary",
      },
      {
        label: "Portal Resmi IYORA",
        label_en: "Official IYORA Portal",
        url: "https://iyora.or.id",
        variant: "teal",
      },
      {
        label: "Instagram IyoraOfficial",
        label_en: "IyoraOfficial Instagram",
        url: "https://www.instagram.com/iyoraofficial",
        variant: "instagram",
      },
    ],
  },
  
];

export const DUMMY_EVENT_POPUP: EventPopupData = DUMMY_EVENT_POPUPS[0];


