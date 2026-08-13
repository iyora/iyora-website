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
/*event dummy*/
export const DUMMY_EVENT_POPUP: EventPopupData = {
  id: "event-popup-nygo-iygo-2026",
  isActive: true,
  badge: "🔥 H-3 PENDAFTARAN DITUTUP!",
  badge_en: "🔥 3 DAYS LEFT BEFORE REGISTRATION CLOSES!",
  title: "Penutupan Registrasi NYGO, IYGO, NYEO & IYEO 2026",
  title_en: "Registration Closing for NYGO, IYGO, NYEO & IYEO 2026",
  subtitle: "Jangan tunggu hingga menit terakhir! Tantang diri Anda dan jadilah bagian dari IYORA Olympiad 2026.",
  subtitle_en: "Don't wait until the last minute! Challenge yourself and be part of IYORA Olympiad 2026.",
  image: "/images/pengumuman/feedolym.png",
  content:
    "Indonesian Youth Outstanding Recognition Association (IYORA) mengingatkan seluruh calon peserta bahwa pendaftaran National & International Youth Olympiad (NYGO, IYGO, NYEO, IYEO 2026) akan resmi ditutup dalam 3 hari lagi. Seluruh sertifikat kejuaraan terintegrasi resmi dengan SIMT Puspresnas.",
  content_en:
    "The Indonesian Youth Outstanding Recognition Association (IYORA) reminds all prospective participants that registration for National & International Youth Olympiad (NYGO, IYGO, NYEO, IYEO 2026) will officially close in 3 days. All competition certificates are officially integrated with SIMT Puspresnas.",
  author: "IyoraOlympiade",
  publishedAt: "2026-08-13",
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
      variant: "primary",
    },
    {
      label: "Pendaftaran NYEO",
      label_en: "NYEO Registration",
      url: "https://nyeo.iyora.or.id",
      variant: "indigo",
    },
    {
      label: "Pendaftaran IYEO",
      label_en: "IYEO Registration",
      url: "https://iyeo.iyora.or.id",
      variant: "rose",
    },
    {
      label: "Kunjungi Instagram",
      label_en: "Visit Instagram",
      url: "https://www.instagram.com/reel/Db92P8dJVmA/?igsh=aXExdW1nNjUzenNv&igsi=aXExdW1nNjUzenNv",
      variant: "instagram",
    },
  ],
};
