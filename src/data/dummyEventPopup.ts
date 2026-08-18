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
/* Event Dummy Popups (3 Slides strictly for Announcement / Pengumuman Event) */
export const DUMMY_EVENT_POPUPS: EventPopupData[] = [
  {
    id: "event-popup-lastday-2026",
    isActive: true,
    badge: "🔥 Last Day!! PENDAFTARAN DITUTUP!",
    badge_en: "🔥 Last Day!! REGISTRATION CLOSES TODAY!",
    title: "PENGUMUMAN: PENUTUPAN REGISTRASI NYGO, IYGO, NYEO & IYEO 2026",
    title_en: "ANNOUNCEMENT: REGISTRATION CLOSING FOR NYGO, IYGO, NYEO & IYEO 2026",
    subtitle: "Jangan tunggu hingga menit terakhir! Tantang diri Anda dan jadilah bagian dari IYORA Olympiad 2026.",
    subtitle_en: "Don't wait until the last minute! Challenge yourself and be part of IYORA Olympiad 2026.",
    image: "/images/pengumuman/lastday.jpg",
    content:
      "Indonesian Youth Outstanding Recognition Association (IYORA) mengumumkan kepada seluruh calon peserta bahwa pendaftaran National & International Youth Olympiad (NYGO, IYGO, NYEO, IYEO 2026) resmi ditutup hari ini. Seluruh sertifikat kejuaraan terintegrasi resmi dengan SIMT Puspresnas.",
    content_en:
      "The Indonesian Youth Outstanding Recognition Association (IYORA) announces that registration for NYGO, IYGO, NYEO & IYEO 2026 officially closes today. All competition certificates are officially integrated with SIMT Puspresnas.",
    author: "IyoraOlympiade",
    publishedAt: "2026-08-16",
    links: [
      {
        label: "Pendaftaran NYGO",
        label_en: "NYGO Registration",
        url: "https://nygo.iyora.or.id",
        variant: "teal",
      },
      {
        label: "Pendaftaran IYGO",
        label_en: "IYGO Registration",
        url: "https://iygo.iyora.or.id",
        variant: "teal",
      },
      {
        label: "Pendaftaran NYEO",
        label_en: "NYEO Registration",
        url: "https://nyeo.iyora.or.id",
        variant: "primary",
      },
      {
        label: "Pendaftaran IYEO",
        label_en: "IYEO Registration",
        url: "https://iyeo.iyora.or.id",
        variant: "primary",
      },
      {
        label: "Kunjungi Instagram",
        label_en: "Visit Instagram",
        url: "https://www.instagram.com/p/DcALqc9prQD/",
        variant: "instagram",
      },
    ],
  },
  {
    id: "event-popup-h1-2026",
    isActive: true,
    badge: "⏰ H-1 PENDAFTARAN DITUTUP!",
    badge_en: "⏰ 1 DAY LEFT BEFORE CLOSING!",
    title: "PENGUMUMAN: H-1 PENUTUPAN REGISTRASI EVENT OLIMPIADE 2026",
    title_en: "ANNOUNCEMENT: 1 DAY LEFT FOR OLYMPIAD EVENT REGISTRATION 2026",
    subtitle: "Tersisa 1 hari lagi! Daftarkan diri dan sekolah Anda di ajang olimpiade nasional & internasional.",
    subtitle_en: "Only 1 day left! Register yourself and your school for national & international olympiads.",
    image: "/images/pengumuman/H-1.jpg",
    content:
      "Pengumuman penting bagi seluruh peserta dan sekolah pendamping: Pendaftaran olimpiade sains IYORA (NYGO, IYGO, NYEO, IYEO 2026) menyisakan waktu 1 hari lagi. Segera amankan kuota pendaftaran Anda sekarang.",
    content_en:
      "Important announcement for all participants: Registration for IYORA science olympiads (NYGO, IYGO, NYEO, IYEO 2026) has 1 day left. Secure your registration slot today.",
    author: "IyoraOlympiade",
    publishedAt: "2026-08-15",
    links: [
      {
        label: "Pendaftaran NYGO",
        label_en: "NYGO Registration",
        url: "https://nygo.iyora.or.id",
        variant: "teal",
      },
      {
        label: "Pendaftaran IYGO",
        label_en: "IYGO Registration",
        url: "https://iygo.iyora.or.id",
        variant: "teal",
      },
      {
        label: "Pendaftaran NYEO",
        label_en: "NYEO Registration",
        url: "https://nyeo.iyora.or.id",
        variant: "primary",
      },
      {
        label: "Pendaftaran IYEO",
        label_en: "IYEO Registration",
        url: "https://iyeo.iyora.or.id",
        variant: "primary",
      },
      {
        label: "Kunjungi Instagram",
        label_en: "Visit Instagram",
        url: "https://www.instagram.com/p/DcALqc9prQD/",
        variant: "instagram",
      },
    ],
  },
  {
    id: "event-popup-h2-2026",
    isActive: true,
    badge: "📌 H-2 PENDAFTARAN DITUTUP!",
    badge_en: "📌 2 DAYS LEFT BEFORE CLOSING!",
    title: "PENGUMUMAN: H-2 PENUTUPAN REGISTRASI EVENT OLIMPIADE 2026",
    title_en: "ANNOUNCEMENT: 2 DAYS LEFT FOR OLYMPIAD EVENT REGISTRATION 2026",
    subtitle: "Persiapkan diri Anda mengikuti kompetisi sains terbaik bertaraf nasional & internasional.",
    subtitle_en: "Prepare yourself to compete in top national & international science olympiads.",
    image: "/images/pengumuman/h-2.PNG",
    content:
      "Pengumuman pendaftaran event olimpiade IYORA 2026: Pendaftaran gelombang utama memasuki H-2 penutupan. Seluruh sertifikat kejuaraan terintegrasi resmi dengan sistem Puspresnas Kemendikbudristek.",
    content_en:
      "Announcement on IYORA 2026 olympiad registration: Main registration phase entering H-2 before closing. All championship certificates are officially integrated with SIMT Puspresnas.",
    author: "IyoraOlympiade",
    publishedAt: "2026-08-14",
    links: [
      {
        label: "Pendaftaran NYGO",
        label_en: "NYGO Registration",
        url: "https://nygo.iyora.or.id",
        variant: "teal",
      },
      {
        label: "Pendaftaran IYGO",
        label_en: "IYGO Registration",
        url: "https://iygo.iyora.or.id",
        variant: "teal",
      },
      {
        label: "Pendaftaran NYEO",
        label_en: "NYEO Registration",
        url: "https://nyeo.iyora.or.id",
        variant: "primary",
      },
      {
        label: "Pendaftaran IYEO",
        label_en: "IYEO Registration",
        url: "https://iyeo.iyora.or.id",
        variant: "primary",
      },
      {
        label: "Kunjungi Instagram",
        label_en: "Visit Instagram",
        url: "https://www.instagram.com/p/DcALqc9prQD/",
        variant: "instagram",
      },
    ],
  },
];

export const DUMMY_EVENT_POPUP: EventPopupData = DUMMY_EVENT_POPUPS[0];

