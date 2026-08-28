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

/* Event Popups Data (Upcoming Events: NSO, NSMO, WSO & Press Releases) */
export const DUMMY_EVENT_POPUPS: EventPopupData[] = [
  {
    id: "popup-upcoming-nso-nsmo-wso-2026",
    isActive: true,
    badge: "🚀 UPCOMING OLYMPIADS 2026",
    badge_en: "🚀 UPCOMING OLYMPIADS 2026",
    title: "UPCOMING EVENTS: NSO, NSMO & WSO 2026",
    title_en: "UPCOMING EVENTS: NSO, NSMO & WSO 2026",
    subtitle: "Pendaftaran 3 Olimpiade Bergengsi (NSO, NSMO, WSO) Segera Dibuka — Terkurasi Resmi SIMT Puspresnas RI.",
    subtitle_en: "Registrations for 3 Prestigious Olympiads (NSO, NSMO, WSO) Opening Soon — Officially Curated by SIMT Puspresnas.",
    image: "/images/events/upcoming-olympiads-2026.jpg",
    content:
      "Persiapkan diri Anda untuk ajang olimpiade sains & matematika paling bergengsi musim ini! IYORA menghadirkan NSO (National Science Olympiad), NSMO (National Science and Math Olympiad), dan WSO (World Science Olympiad) 2026. Terbuka untuk jenjang SD, SMP, SMA/SMK hingga Mahasiswa/Umum dengan sertifikat resmi SIMT Puspresnas Kemendikdasmen RI.",
    content_en:
      "Prepare yourself for the most prestigious science & mathematics olympiads of the season! IYORA proudly presents NSO (National Science Olympiad), NSMO (National Science and Math Olympiad), and WSO (World Science Olympiad) 2026. Open for Elementary, Junior High, Senior High, and University levels with official SIMT Puspresnas accredited certificates.",
    author: "IyoraOlympiad",
    publishedAt: "2026-08-28",
    links: [
      {
        label: "Website NSO 2026",
        label_en: "NSO 2026 Website",
        url: "https://nso.iyora.or.id",
        variant: "teal",
      },
      {
        label: "Website NSMO 2026",
        label_en: "NSMO 2026 Website",
        url: "https://nsmo.iyora.or.id",
        variant: "indigo",
      },
      {
        label: "Website WSO 2026",
        label_en: "WSO 2026 Website",
        url: "https://wso.iyora.or.id",
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
    id: "popup-upcoming-nso-2026",
    isActive: true,
    badge: "🔬 UPCOMING: NATIONAL SCIENCE OLYMPIAD",
    badge_en: "🔬 UPCOMING: NATIONAL SCIENCE OLYMPIAD",
    title: "NSO 2026 — National Science Olympiad",
    title_en: "NSO 2026 — National Science Olympiad",
    subtitle: "Kompetisi Sains Terpadu Nasional untuk Jenjang SD, SMP, SMA & Mahasiswa se-Indonesia.",
    subtitle_en: "Prestigious National Science Competition for Elementary, Junior High, High School & University.",
    image: "/images/events/nso-upcoming.jpg",
    content:
      "NSO (National Science Olympiad) 2026 menguji penguasaan sains mendalam (Biologi, Fisika, Kimia, IPA Terpadu) melalui ujian berbasis CBT daring dengan standarisasi nasional. Dapatkan medali penghargaan eksklusif, e-sertifikat resmi SIMT Puspresnas, serta piagam pembina berprestasi untuk mendukung portofolio PPDB & SNBT.",
    content_en:
      "NSO (National Science Olympiad) 2026 evaluates comprehensive scientific mastery (Biology, Physics, Chemistry, Integrated Science) via standardized online CBT. Win exclusive medals, SIMT Puspresnas verified certificates, and mentor honors to bolster your academic portfolio.",
    author: "IyoraOlympiad",
    publishedAt: "2026-08-28",
    links: [
      {
        label: "Website Resmi NSO",
        label_en: "Official NSO Website",
        url: "https://nso.iyora.or.id",
        variant: "teal",
      },
      {
        label: "Lihat Semua Kompetisi",
        label_en: "View All Competitions",
        url: "/competitions",
        variant: "primary",
      },
      {
        label: "Instagram IYORA",
        label_en: "Official Instagram",
        url: "https://www.instagram.com/iyoraofficial",
        variant: "instagram",
      },
    ],
  },
  {
    id: "popup-upcoming-nsmo-2026",
    isActive: true,
    badge: "📐 UPCOMING: SCIENCE & MATH OLYMPIAD",
    badge_en: "📐 UPCOMING: SCIENCE & MATH OLYMPIAD",
    title: "NSMO 2026 — National Science and Math Olympiad",
    title_en: "NSMO 2026 — National Science and Math Olympiad",
    subtitle: "Tantangan Integrasi Sains & Matematika untuk Mengasah Daya Nalar & Berpikir Kritis.",
    subtitle_en: "Integrated Science & Math Challenge to Elevate Analytical & Critical Thinking.",
    image: "/images/events/nsmo-upcoming.jpg",
    content:
      "NSMO (National Science and Math Olympiad) 2026 hadir sebagai wadah unjuk kebolehan dalam pemecahan soal analitis matematika dan penerapan konsep sains terintegrasi. Dirancang khusus untuk mengasah daya nalar kuantitatif dan logika ilmiah generasi muda berprestasi.",
    content_en:
      "NSMO (National Science and Math Olympiad) 2026 provides a premier arena for analytical mathematical problem solving and integrated science applications. Specially designed to foster higher-order quantitative reasoning and scientific logic.",
    author: "IyoraOlympiad",
    publishedAt: "2026-08-28",
    links: [
      {
        label: "Website Resmi NSMO",
        label_en: "Official NSMO Website",
        url: "https://nsmo.iyora.or.id",
        variant: "indigo",
      },
      {
        label: "Lihat Semua Kompetisi",
        label_en: "View All Competitions",
        url: "/competitions",
        variant: "primary",
      },
      {
        label: "Instagram IYORA",
        label_en: "Official Instagram",
        url: "https://www.instagram.com/iyoraofficial",
        variant: "instagram",
      },
    ],
  },
  {
    id: "popup-upcoming-wso-2026",
    isActive: true,
    badge: "🌍 UPCOMING: WORLD SCIENCE OLYMPIAD",
    badge_en: "🌍 UPCOMING: WORLD SCIENCE OLYMPIAD",
    title: "WSO 2026 — World Science Olympiad",
    title_en: "WSO 2026 — World Science Olympiad",
    subtitle: "Panggung Olimpiade Sains Tingkat Dunia Berkolaborasi dengan Delegasi 20+ Negara.",
    subtitle_en: "World-Class Science Olympiad Stage Collaborating with International Delegates from 20+ Countries.",
    image: "/images/events/wso-upcoming.jpg",
    content:
      "WSO (World Science Olympiad) 2026 adalah kompetisi sains tingkat global puncak yang diselenggarakan bersama asosiasi sains dunia (IYSA & MIICA Malaysia). Mempertemukan pelajar berprestasi dari berbagai belahan dunia untuk memperebutkan medali dunia dan sertifikat internasional resmi.",
    content_en:
      "WSO (World Science Olympiad) 2026 is a premier global science competition organized in collaboration with international science associations (IYSA & MIICA Malaysia). Bringing together top-tier youth delegates worldwide to compete for world medals and recognized international credentials.",
    author: "IyoraOlympiad",
    publishedAt: "2026-08-28",
    links: [
      {
        label: "Website Resmi WSO",
        label_en: "Official WSO Website",
        url: "https://wso.iyora.or.id",
        variant: "primary",
      },
      {
        label: "Lihat Semua Kompetisi",
        label_en: "View All Competitions",
        url: "/competitions",
        variant: "teal",
      },
      {
        label: "Instagram IYORA",
        label_en: "Official Instagram",
        url: "https://www.instagram.com/iyoraofficial",
        variant: "instagram",
      },
    ],
  },
  ];

export const DUMMY_EVENT_POPUP: EventPopupData = DUMMY_EVENT_POPUPS[0];
