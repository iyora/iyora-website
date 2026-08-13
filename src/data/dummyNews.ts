export interface DummyNewsItem {
  id: string;
  slug: string;
  title: string;
  title_en?: string;
  category: "news" | "announcement" | "gallery";
  photo: string;
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
 /* {
    id: "news-4",
    slug: "kurasi-puspresnas-12-cabang-olimpiade-iyora",
    title: "12 Cabang Olimpiade IYORA Resmi Tercatat dan Terkurasi di Puspresnas",
    category: "news",
    photo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    caption: "Seluruh sertifikat pemenang ajang IYORA resmi terintegrasi secara otomatis dengan Sistem Informasi Manajemen Talenta (SIMT) Puspresnas Kemendikdasmen RI.",
    content: "IYORA memastikan seluruh sertifikat kejuaraan terintegrasi secara otomatis dengan Sistem Informasi Manajemen Talenta (SIMT) Puspresnas. Hal ini memberikan nilai tambah yang signifikan bagi peserta untuk jalur prestasi PPDB maupun SNBT perguruan tinggi negeri.",
    link: "/news",
    publishedAt: "2026-07-15",
    author: "IyoraOlumpiad",
  },*/

  // ── ANNOUNCEMENTS (Pengumuman) ──
  /*{
    id: "announcement-1",
    slug: "jadwal-dan-petunjuk-teknis-nyco-2026",
    title: "Pengumuman Jadwal & Petunjuk Teknis Pelaksanaan NYCO & IYCO 2026",
    category: "announcement",
    photo: "-",
    caption: "Simak jadwal penting, tata cara ujian CBT online, serta pembagian sesi pelaksanaan National & International Youth Chemistry Olympiad.",
    content: "Panitia Pelaksana NYCO 2026 menyampaikan jadwal rinci dan petunjuk teknis ujian yang wajib dipelajari oleh seluruh peserta terdaftar. Pengawasan akan dilakukan melalui sistem AI proctoring dan Zoom meeting terintegrasi.",
    link: "https://nyco.iyora.or.id",
    publishedAt: "2026-08-11",
    author: "IyoraOlumpiad",
  },
  {
    id: "announcement-2",
    slug: "pembaruan-sistem-cbt-olimpiade-iyora-2026",
    title: "Pembaruan Platform CBT Online & Aturan Pengawasan Ujian Olimpiade",
    category: "announcement",
    photo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    caption: "Pemberitahuan mengenai update fitur portal ujian online dan panduan teknis bagi peserta olimpiade matematika & geografi.",
    content: "Demi menjaga integritas dan kelancaran ujian, IYORA telah memperbarui platform Computer Based Test (CBT) dengan fitur anti-cheat lanjutan dan simulasi ujian gratis yang dapat diakses mulai pekan depan.",
    link: "/news",
    publishedAt: "2026-08-02",
    author: "IyoraOlumpiad",
  },
  {
    id: "announcement-3",
    slug: "prosedur-klaim-sertifikat-simt-puspresnas",
    title: "Prosedur Klaim Sertifikat Terintegrasi SIMT Puspresnas untuk Pemenang",
    category: "announcement",
    photo: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
    caption: "Tata cara verifikasi data dan pengunduhan e-sertifikat terkurasi bagi seluruh peraih medali olimpiade sains IYORA.",
    content: "Seluruh pemenang medali emas, perak, dan perunggu dapat melakukan klaim e-sertifikat ber-QR Code melalui portal resmi IYORA. Sertifikat ini terhubung langsung dengan SIMT Puspresnas Kemendikdasmen.",
    link: "/news",
    publishedAt: "2026-07-20",
    author: "IyoraOlumpiad",
  },*/

  // ── GALLERY (Galeri) ──
  {
    id: "gallery-1",
    slug: "after-event-biology-physics-olympiad-2026",
    title: "After Event Biology & Physics Olympiad 2026",
    category: "gallery",
    photo: "/images/Galery Pemenang/AFTER EVENT.png",
    caption: "Momen berkesan dan rangkuman keseruan kompetisi sains nasional Biology & Physics Olympiad 2026.",
    content: "Kami bangga mempersembahkan video rangkuman dari acara yang tak terlupakan ini, sebagai bukti semangat, dedikasi, dan kecemerlangan yang telah ditunjukkan oleh setiap peserta. Melalui video pasca-acara ini, Anda akan disuguhi berbagai momen berkesan yang telah kita lalui bersama.",
    publishedAt: "2026-08-13",
    author: "IyoraOlympiade",
    link: "https://www.youtube.com/embed/05RdQgvQiVY?si=KSSadgHGYFNm9do1",
    linkLabel: "Tonton Video Dokumentasi YouTube",
  },
];

export function getDummyNewsByCategory(category: "news" | "announcement" | "gallery") {
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


