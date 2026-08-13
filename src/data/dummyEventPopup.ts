export interface EventPopupLink {
  label: string;
  url: string;
  variant?: "primary" | "teal" | "indigo" | "rose" | "instagram" | "secondary";
}

export interface EventPopupData {
  id: string;
  isActive: boolean;
  badge: string;
  title: string;
  subtitle?: string;
  image: string;
  content: string;
  author: string;
  publishedAt: string;
  links: EventPopupLink[];
}
/*event dummy*/
export const DUMMY_EVENT_POPUP: EventPopupData = {
  id: "event-popup-nygo-iygo-2026",
  isActive: true,
  badge: "🔥 H-3 PENDAFTARAN DITUTUP!",
  title: "Penutupan Registrasi NYGO, IYGO, NYEO & IYEO 2026",
  subtitle: "Jangan tunggu hingga menit terakhir! Tantang diri Anda dan jadilah bagian dari IYORA Olympiad 2026.",
  image: "/images/pengumuman/feedolym.png",
  content:
    "Indonesian Youth Outstanding Recognition Association (IYORA) mengingatkan seluruh calon peserta bahwa pendaftaran National & International Youth Olympiad (NYGO, IYGO, NYEO, IYEO 2026) akan resmi ditutup dalam 3 hari lagi. Seluruh sertifikat kejuaraan terintegrasi resmi dengan SIMT Puspresnas.",
  author: "IyoraOlympiade",
  publishedAt: "2026-08-13",
  links: [
    {
      label: "Pendaftaran NYGO",
      url: "https://nygo.iyora.or.id",
      variant: "teal",
    },
    {
      label: "Pendaftaran IYGO",
      url: "https://iygo.iyora.or.id",
      variant: "primary",
    },
    {
      label: "Pendaftaran NYEO",
      url: "https://nyeo.iyora.or.id",
      variant: "indigo",
    },
    {
      label: "Pendaftaran IYEO",
      url: "https://iyeo.iyora.or.id",
      variant: "rose",
    },
    {
      label: "Kunjungi Instagram",
      url: "https://www.instagram.com/reel/Db92P8dJVmA/?igsh=aXExdW1nNjUzenNv&igsi=aXExdW1nNjUzenNv",
      variant: "instagram",
    },
  ],
};
