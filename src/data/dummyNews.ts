export interface DummyNewsItem {
  id: string;
  slug: string;
  title: string;
  title_en?: string;
  category: "news" | "announcement" | "press_release" | "gallery";
  photo: string;
  photos?: string[];
  caption: string;
  caption_en?: string;
  content?: string;
  content_en?: string;
  link?: string;
  linkLabel?: string;
  linkLabel_en?: string;
  link2?: string;
  link2Label?: string;
  link2Label_en?: string;
  link3?: string;
  link3Label?: string;
  link3Label_en?: string;
  link4?: string;
  link4Label?: string;
  link4Label_en?: string;
  link5?: string;
  link5Label?: string;
  link5Label_en?: string;
  publishedAt: string;
  author?: string;
}

export const DUMMY_NEWS: DummyNewsItem[] = [
  // ── PRESS RELEASE ──
  {
    id: "press-release-opening-ceremony-2026",
    slug: "siaran-pers-opening-ceremony-nygo-iygo-nyeo-iyeo-2026",
    title: "Siaran Pers: Pembukaan Resmi (Opening Ceremony) NYGO, IYGO, NYEO & IYEO 2026 Sukses Digelar Secara Daring",
    title_en: "Press Release: Official Opening Ceremony of NYGO, IYGO, NYEO & IYEO 2026 Successfully Held Online",
    category: "press_release",
    photo: "/images/OPENING/dokum1.png",
    /* 📸 DOKUMENTASI FOTO (Bisa Diubah / Ditambah Foto Baru di Sini) */
    photos: [
      "/images/OPENING/dokum1.png",
      "/images/OPENING/dokum2.png",
      "/images/OPENING/dokum3.jpeg",
      "/images/OPENING/dokum4.jpeg",
      "/images/OPENING/dokum5.jpeg",
    ],
    caption: "Resmi Dibuka! Opening Ceremony NYGO & IYGO serta NYEO & IYEO 2026 Sukses Digelar Secara Daring pada 20 Agustus 2026.",
    caption_en: "Officially Opened! Online Opening Ceremony for NYGO, IYGO, NYEO & IYEO 2026 Successfully Held on August 20th, 2026.",
    content: `DEPOK, 20 Agustus 2026 — Indonesian Youth Outstanding Recognition Association (IYORA) bekerjasama dengan Indonesian Young Scientist Association (IYSA) dan Malaysia Innovation Invention Creativity Association (MIICA) secara resmi menyelenggarakan Pembukaan Resmi (Opening Ceremony) kompetisi olimpiade tingkat nasional dan internasional: National Youth Geography Olympiad (NYGO), International Youth Geography Olympiad (IYGO), National Youth Economics Olympiad (NYEO), dan International Youth Economics Olympiad (IYEO) 2026.

Acara pembukaan yang digelar secara full online pada Kamis, 20 Agustus 2026 ini dihadiri oleh ribuan pelajar bertalenta, guru pendamping, dewan juri internasional, serta perwakilan dari berbagai asosiasi pendidikan sains nasional dan mancanegara.

Rangkaian kompetisi NYGO, IYGO, NYEO, dan IYEO 2026 menjadi wadah prestisius bagi generasi muda untuk menguji pemahaman mendalam di bidang ilmu Geografi dan Ekonomi. Selain memperebutkan medali dan penghargaan internasional, seluruh sertifikat kejuaraan IYORA telah terintegrasi dengan Sistem Informasi Manajemen Talenta (SIMT) Puspresnas Kemendikbudristek RI, memberikan bobot rekam jejak akademik yang diakui untuk jalur seleksi perguruan tinggi dan beasiswa.

"Opening Ceremony hari ini menandai dimulainya persaingan sehat dan sportif antar pelajar terbaik dari seluruh provinsi di Indonesia hingga mancanegara. Kami berkomitmen menyajikan kompetisi yang transparan, objektif, dan berstandar internasional," tegas Humas IYORA.

Tahap ujian online akan berlangsung sesuai jadwal teknis yang disiapkan platform IYORA. Masyarakat dan sekolah dapat memantau update pengumuman dan hasil babak final melalui portal resmi https://iyora.or.id.`,
    content_en: `DEPOK, August 20, 2026 — Indonesian Youth Outstanding Recognition Association (IYORA) in collaboration with Indonesian Young Scientist Association (IYSA) and Malaysia Innovation Invention Creativity Association (MIICA) officially held the Opening Ceremony for prestigious national and international olympiads: National Youth Geography Olympiad (NYGO), International Youth Geography Olympiad (IYGO), National Youth Economics Olympiad (NYEO), and International Youth Economics Olympiad (IYEO) 2026.

The opening event, held fully online on Thursday, August 20th, 2026, was attended by thousands of talented students, mentor teachers, international jury members, and representatives from educational and scientific associations across Indonesia and abroad.

The NYGO, IYGO, NYEO, and IYEO 2026 competition series serve as an elite platform for youth to demonstrate analytical prowess in Geography and Economics. Beyond competing for medals and global recognition, all official IYORA winner certificates are integrated into SIMT Puspresnas (Ministry of Education, Culture, Research, and Technology of the Republic of Indonesia), providing recognized academic merit for university selection pathways and scholarships.

"Today's Opening Ceremony marks the beginning of high-level, fair competition among top students nationwide and internationally. We are dedicated to providing a transparent, objective, and globally standardized competition," emphasized IYORA Public Relations.

The online examination phases will proceed according to the schedule hosted on the IYORA platform. Schools, mentors, and participants can monitor official updates and final results via https://iyora.or.id.`,
    publishedAt: "2026-08-20",
    author: "Humas IYORA",
  },
  // ── NEWS / ANNOUNCEMENT ──
  {
    id: "announcement-1",
    slug: "penutupan-registrasi-nygo-iygo-nyeo-iyeo",
    title: "Penutupan Registrasi NYGO, IYGO, NYEO, IYEO tinggal 3 hari lagi",
    title_en: "NYGO, IYGO, NYEO & IYEO 2026 Registration Closing in 3 Days",
    category: "announcement",
    photo: "/images/pengumuman/feedolym.png",
    caption: "H-3 PENDAFTARAN DITUTUP, YUK BURUAN DAFTAR!",
    caption_en: "3 DAYS LEFT BEFORE REGISTRATION CLOSES, REGISTER NOW!",
    content: "Jangan tunggu hingga menit terakhir! Tantang diri sendiri, tunjukkan pengetahuan Anda, dan jadilah bagian dari IYORA Olympiad 2026.",
    content_en: "Don't wait until the last minute! Challenge yourself, showcase your knowledge, and be part of IYORA Olympiad 2026.",
    link: "https://www.instagram.com/reel/Db92P8dJVmA/?igsh=aXExdW1nNjUzenNv&igsi=aXExdW1nNjUzenNv",
    linkLabel: "Kunjungi Instagram IyoraOfficial",
    linkLabel_en: "Visit Instagram IyoraOfficial",
    link2: "https://nygo.iyora.or.id",
    link2Label: "Website Pendaftaran NYGO",
    link2Label_en: "NYGO Registration Website",
    link3: "https://iygo.iyora.or.id",
    link3Label: "Website Pendaftaran IYGO",
    link3Label_en: "IYGO Registration Website",
    link4: "https://nyeo.iyora.or.id",
    link4Label: "Website Pendaftaran NYEO",
    link4Label_en: "NYEO Registration Website",
    link5: "https://iyeo.iyora.or.id",
    link5Label: "Website Pendaftaran IYEO",
    link5Label_en: "IYEO Registration Website",
    publishedAt: "2026-08-13",
    author: "IyoraOlympiade",
  },
  {
    id: "announcement-2",
    slug: "penutupan-registrasi-nygo-iygo-nyeo-iyeo",
    title: "Penutupan Registrasi NYGO, IYGO, NYEO, IYEO tinggal 2 hari lagi",
    title_en: "NYGO, IYGO, NYEO & IYEO 2026 Registration Closing in 3 Days",
    category: "announcement",
    photo: "/images/pengumuman/2.png",
    caption: "H-2 PENDAFTARAN DITUTUP, YUK BURUAN DAFTAR!",
    caption_en: "2 DAYS LEFT BEFORE REGISTRATION CLOSES, REGISTER NOW!",
    content: "Jangan tunggu hingga menit terakhir! Tantang diri sendiri, tunjukkan pengetahuan Anda, dan jadilah bagian dari IYORA Olympiad 2026.",
    content_en: "Don't wait until the last minute! Challenge yourself, showcase your knowledge, and be part of IYORA Olympiad 2026.",
    link: "https://www.instagram.com/p/DcALqc9prQD/?igsh=ejd2YXU4NW9qcDd4&igsi=ejd2YXU4NW9qcDd4",
    linkLabel: "Kunjungi Instagram IyoraOfficial",
    linkLabel_en: "Visit Instagram IyoraOfficial",
    link2: "https://nygo.iyora.or.id",
    link2Label: "Website Pendaftaran NYGO",
    link2Label_en: "NYGO Registration Website",
    link3: "https://iygo.iyora.or.id",
    link3Label: "Website Pendaftaran IYGO",
    link3Label_en: "IYGO Registration Website",
    link4: "https://nyeo.iyora.or.id",
    link4Label: "Website Pendaftaran NYEO",
    link4Label_en: "NYEO Registration Website",
    link5: "https://iyeo.iyora.or.id",
    link5Label: "Website Pendaftaran IYEO",
    link5Label_en: "IYEO Registration Website",
    publishedAt: "2026-08-14",
    author: "IyoraOlympiade",
  },
  {
    id: "announcement-3",
    slug: "penutupan-registrasi-nygo-iygo-nyeo-iyeo",
    title: "Penutupan Registrasi NYGO, IYGO, NYEO, IYEO tinggal 1 hari lagi",
    title_en: "NYGO, IYGO, NYEO & IYEO 2026 Registration Closing in 1 Days",
    category: "announcement",
    photo: "/images/pengumuman/h-1.jpg",
    caption: "H-1 PENDAFTARAN DITUTUP, YUK BURUAN DAFTAR!",
    caption_en: "1 DAYS LEFT BEFORE REGISTRATION CLOSES, REGISTER NOW!",
    content: "Jangan tunggu hingga menit terakhir! Tantang diri sendiri, tunjukkan pengetahuan Anda, dan jadilah bagian dari IYORA Olympiad 2026.",
    content_en: "Don't wait until the last minute! Challenge yourself, showcase your knowledge, and be part of IYORA Olympiad 2026.",
    link: "https://www.instagram.com/p/DcALqc9prQD/?igsh=ejd2YXU4NW9qcDd4&igsi=ejd2YXU4NW9qcDd4",
    linkLabel: "Kunjungi Instagram IyoraOfficial",
    linkLabel_en: "Visit Instagram IyoraOfficial",
    link2: "https://nygo.iyora.or.id",
    link2Label: "Website Pendaftaran NYGO",
    link2Label_en: "NYGO Registration Website",
    link3: "https://iygo.iyora.or.id",
    link3Label: "Website Pendaftaran IYGO",
    link3Label_en: "IYGO Registration Website",
    link4: "https://nyeo.iyora.or.id",
    link4Label: "Website Pendaftaran NYEO",
    link4Label_en: "NYEO Registration Website",
    link5: "https://iyeo.iyora.or.id",
    link5Label: "Website Pendaftaran IYEO",
    link5Label_en: "IYEO Registration Website",
    publishedAt: "2026-08-15",
    author: "IyoraOlympiade",
  },
  {
    id: "announcement-4",
    slug: "penutupan-registrasi-nygo-iygo-nyeo-iyeo",
    title: "Penutupan Registrasi NYGO, IYGO, NYEO, IYEO tinggal",
    title_en: "NYGO, IYGO, NYEO & IYEO 2026 Registration Closing",
    category: "announcement",
    photo: "/images/pengumuman/lastday.jpg",
    caption: "Last Day!! PENDAFTARAN DITUTUP, YUK BURUAN DAFTAR!",
    caption_en: "Last Day!! LEFT BEFORE REGISTRATION CLOSES, REGISTER NOW!",
    content: "Jangan tunggu hingga menit terakhir! Tantang diri sendiri, tunjukkan pengetahuan Anda, dan jadilah bagian dari IYORA Olympiad 2026.",
    content_en: "Don't wait until the last minute! Challenge yourself, showcase your knowledge, and be part of IYORA Olympiad 2026.",
    link: "https://www.instagram.com/p/DcALqc9prQD/?igsh=ejd2YXU4NW9qcDd4&igsi=ejd2YXU4NW9qcDd4",
    linkLabel: "Kunjungi Instagram IyoraOfficial",
    linkLabel_en: "Visit Instagram IyoraOfficial",
    link2: "https://nygo.iyora.or.id",
    link2Label: "Website Pendaftaran NYGO",
    link2Label_en: "NYGO Registration Website",
    link3: "https://iygo.iyora.or.id",
    link3Label: "Website Pendaftaran IYGO",
    link3Label_en: "IYGO Registration Website",
    link4: "https://nyeo.iyora.or.id",
    link4Label: "Website Pendaftaran NYEO",
    link4Label_en: "NYEO Registration Website",
    link5: "https://iyeo.iyora.or.id",
    link5Label: "Website Pendaftaran IYEO",
    link5Label_en: "IYEO Registration Website",
    publishedAt: "2026-08-16",
    author: "IyoraOlympiade",
  },
  {
    id: "news-1",
    slug: "pendaftaran-nybo-iybo-2026-resmi-dibuka",
    title: "National Youth Biology Olympiad Perdana dan International Youth Biology Olympiad ke-3 Sukses Terlaksana Secara Full Online",
    title_en: "The Inaugural National Youth Biology Olympiad and 3rd International Youth Biology Olympiad Successfully Held Full Online",
    category: "news",
    photo: "/images/berita/nybologo.jpeg",
    caption: "National Youth Biology Olympiad Perdana dan International Youth Biology Olympiad",
    caption_en: "The Inaugural National Youth Biology Olympiad and International Youth Biology Olympiad",
    content: "National Youth Biology Olympiad Perdana dan International Youth Biology Olympiad ke-3 Sukses Terlaksana Secara Full Online. Indonesian Youth Outstanding Recognition Association (IYORA) dengan bangga mengumumkan pembukaan pendaftaran National Youth Biology Olympiad (NYBO) dan International Youth Biology Olympiad (IYBO) 2026. Kompetisi ini dirancang untuk menguji kedalaman pemahaman sains dan biologi generasi muda Indonesia serta memberikan pengakuan bertaraf nasional dan internasional.",
    content_en: "The Inaugural National Youth Biology Olympiad and 3rd International Youth Biology Olympiad were successfully conducted fully online. Indonesian Youth Outstanding Recognition Association (IYORA) proudly announces registration opening for NYBO & IYBO 2026. This competition is designed to test scientific and biological understanding of youth and provide national and international recognition.",
    link: "https://www.depokpos.com/2024/05/national-youth-biology-olympiad-perdana-dan-international-youth-biology-olympiad-ke-3-sukses-terlaksana-secara-full-online/#google_vignette",
    linkLabel: "Berita di DepokPos",
    linkLabel_en: "News on DepokPos",
    link2: "https://nybo.iyora.or.id",
    link2Label: "Website Resmi NYBO",
    link2Label_en: "Official NYBO Website",
    publishedAt: "2026-08-13",
    author: "IyoraOlympiade",
  },
  {
    id: "news-2",
    slug: "os2mn-2025-sukses-digelar",
    title: "OS2MN 2025 Sukses Digelar, Tampilkan Semangat Kompetisi Ilmiah Pelajar Madrasah Se-Indonesia",
    title_en: "OS2MN 2025 Successfully Held, Showcasing Scientific Spirit of Madrasah Students Across Indonesia",
    category: "news",
    photo: "https://jabaran.id/wp-content/uploads/2025/04/IYSA-gelar-OS2MN-2025-696x381.jpg",
    caption: "OS2MN 2025 menerapkan sistem kompetisi dua putaran yang ketat dan berstandar tinggi.",
    caption_en: "OS2MN 2025 implemented a rigorous two-round competition system with high standards.",
    content: "Dunia pendidikan madrasah Indonesia kembali menunjukkan prestasi gemilang melalui penyelenggaraan Olimpiade Sains Siswa Madrasah Nasional (OS2MN) 2025. Ajang bergengsi yang dihelat oleh Indonesian Young Scientist Association (IYSA) untuk kedua kalinya ini berlangsung secara daring dari tanggal 10 hingga 17 April 2025, berhasil menyedot antusiasme ratusan pelajar madrasah dari berbagai penjuru tanah air.",
    content_en: "Indonesian madrasah education showcased brilliant achievements through the National Madrasah Student Science Olympiad (OS2MN) 2025. This prestigious event organized by IYSA attracted hundreds of madrasah students nationwide.",
    link: "https://jabaran.id/os2mn-2025-sukses-digelar-tampilkan-semangat-kompetisi-ilmiah-pelajar-madrasah-se-indonesia/",
    linkLabel: "Berita Media Jabaran.id",
    linkLabel_en: "News Article on Jabaran.id",
    link2: "https://os2mn.iyora.or.id",
    link2Label: "Website Resmi OS2MN",
    link2Label_en: "Official OS2MN Website",
    publishedAt: "2026-08-13",
    author: "IyoraOlympiade",
  },
  // ── GALLERY (Galeri) ──
  {
    id: "gallery-opening-ceremony-2026",
    slug: "dokumentasi-opening-ceremony-nygo-iygo-nyeo-iyeo-2026",
    title: "Dokumentasi Pembukaan Resmi (Opening Ceremony) NYGO, IYGO, NYEO & IYEO 2026",
    title_en: "Photo Documentation: Official Opening Ceremony of NYGO, IYGO, NYEO & IYEO 2026",
    category: "gallery",
    photo: "/images/pengumuman/opening.png",
    photos: [
      "/images/OPENING/dokum6.jpeg",
      "/images/OPENING/dokum2.png",
      "/images/OPENING/dokum5.jpeg",
      "/images/OPENING/dokum1.png",
      "/images/OPENING/dokum3.jpeg",
      "/images/OPENING/dokum4.jpeg",
      
     
    ],
    caption: "Kumpulan foto dokumentasi Pembukaan Resmi (Opening Ceremony) NYGO & IYGO serta NYEO & IYEO 2026 yang digelar secara daring pada 20 Agustus 2026.",
    caption_en: "Photo documentation collection of the Online Opening Ceremony for NYGO, IYGO, NYEO & IYEO 2026 held on August 20th, 2026.",
    content: "Berikut adalah dokumentasi foto lengkap dari acara Pembukaan Resmi (Opening Ceremony) kompetisi olimpiade tingkat nasional dan internasional NYGO, IYGO, NYEO, dan IYEO 2026. Acara diselenggarakan secara daring bekerja sama dengan IYSA & MIICA serta terintegrasi resmi dengan SIMT Puspresnas Kemendikbudristek RI.",
    content_en: "Here is the complete photo documentation gallery of the Online Opening Ceremony for NYGO, IYGO, NYEO, and IYEO 2026 national and international olympiads held in collaboration with IYSA & MIICA.",
    publishedAt: "2026-08-20",
    author: "Humas IYORA",
    link: "https://iyora.or.id",
    linkLabel: "Kunjungi Portal Resmi IYORA",
    linkLabel_en: "Visit Official IYORA Portal",
  },
  {
    id: "gallery-1",
    slug: "after-event-biology-physics-olympiad-2026",
    title: "After Event Biology & Physics Olympiad 2026",
    title_en: "After Event Biology & Physics Olympiad 2026",
    category: "gallery",
    photo: "/images/Galery Pemenang/AFTER EVENT.png",
    caption: "Momen berkesan dan rangkuman keseruan kompetisi sains nasional Biology & Physics Olympiad 2026.",
    caption_en: "Memorable moments and highlight summary of the national science competition Biology & Physics Olympiad 2026.",
    content: "Kami bangga mempersembahkan video rangkuman dari acara yang tak terlupakan ini, sebagai bukti semangat, dedikasi, dan kecemerlangan yang telah ditunjukkan oleh setiap peserta. Melalui video pasca-acara ini, Anda akan disuguhi berbagai momen berkesan yang telah kita lalui bersama.",
    content_en: "We are proud to present a summary video of this unforgettable event, as a testament to the passion, dedication, and brilliance demonstrated by every participant. Through this post-event video, you will be treated to various memorable moments we shared together.",
    publishedAt: "2026-08-13",
    author: "IyoraOlympiade",
    link: "https://www.youtube.com/embed/05RdQgvQiVY?si=KSSadgHGYFNm9do1",
    linkLabel: "Tonton Video Dokumentasi YouTube",
    linkLabel_en: "Watch Video Documentation on YouTube",
  },
];

export function getDummyNewsByCategory(category: "news" | "announcement" | "press_release" | "gallery") {
  return DUMMY_NEWS.filter((item) => item.category === category).sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export function getDummyNewsBySlug(slug: string) {
  const decoded = decodeURIComponent(slug).toLowerCase().trim();
  const normalized = decoded.replace(/[^a-z0-9]+/g, "-");
  return DUMMY_NEWS.find((item) => {
    const itemSlugDecoded = item.slug.toLowerCase().trim();
    const itemSlugNormalized = itemSlugDecoded.replace(/[^a-z0-9]+/g, "-");
    return (
      item.slug === slug ||
      itemSlugDecoded === decoded ||
      itemSlugNormalized === normalized
    );
  });
}
