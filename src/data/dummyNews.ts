export interface DummyNewsItem {
  id: string;
  slug: string;
  title: string;
  category: "news" | "announcement" | "gallery";
  photo: string;
  caption: string;
  content?: string;
  link?: string;
  linkLabel?: string;
  link2?: string;
  link2Label?: string;
  link3?: string;
  link3Label?: string;
  link4?: string;
  link4Label?: string;
  link5?: string;
  link5Label?: string;
  publishedAt: string;
  author?: string;
}

export const DUMMY_NEWS: DummyNewsItem[] = [
  // ── NEWS / ANNOUNCEMENT ──
  {
    id: "announcement-1",
    slug: "penutupan-registrasi-nygo-iygo-nyeo-iyeo",
    title: "Penutupan Registrasi NYGO, IYGO, NYEO, IYEO tinggal 3 hari lagi",
    category: "announcement",
    photo: "/images/pengumuman/feedolym.png",
    caption: "H-3 PENDAFTARAN DITUTUP, YUK BURUAN DAFTAR!",
    content: "Jangan tunggu hingga menit terakhir! Tantang diri sendiri, tunjukkan pengetahuan Anda, dan jadilah bagian dari IYORA Olympiad 2026.",
    link: "https://www.instagram.com/reel/Db92P8dJVmA/?igsh=aXExdW1nNjUzenNv&igsi=aXExdW1nNjUzenNv",
    linkLabel: "Kunjungi Instagram IyoraOfficial",
    link2: "https://nygo.iyora.or.id",
    link2Label: "Website Pendaftaran NYGO",
    link3: "https://iygo.iyora.or.id",
    link3Label: "Website Pendaftaran IYGO",
    link4: "https://nyeo.iyora.or.id",
    link4Label: "Website Pendaftaran NYEO",
    link5: "https://iyeo.iyora.or.id",
    link5Label: "Website Pendaftaran IYEO",
    publishedAt: "2026-08-13",
    author: "IyoraOlympiade",
  },
  {
    id: "news-1",
    slug: "pendaftaran-nybo-iybo-2026-resmi-dibuka",
    title: "National Youth Biology Olympiad Perdana dan International Youth Biology Olympiad ke-3 Sukses Terlaksana Secara Full Online",
    category: "news",
    photo: "/images/berita/nybologo.jpeg",
    caption: "National Youth Biology Olympiad Perdana dan International Youth Biology Olympiad",
    content: "National Youth Biology Olympiad Perdana dan International Youth Biology Olympiad ke-3 Sukses Terlaksana Secara Full Online. Indonesian Youth Outstanding Recognition Association (IYORA) dengan bangga mengumumkan pembukaan pendaftaran National Youth Biology Olympiad (NYBO) dan International Youth Biology Olympiad (IYBO) 2026. Kompetisi ini dirancang untuk menguji kedalaman pemahaman sains dan biologi generasi muda Indonesia serta memberikan pengakuan bertaraf nasional dan internasional.",
    link: "https://www.depokpos.com/2024/05/national-youth-biology-olympiad-perdana-dan-international-youth-biology-olympiad-ke-3-sukses-terlaksana-secara-full-online/#google_vignette",
    linkLabel: "Berita di DepokPos",
    link2: "https://nybo.iyora.or.id",
    link2Label: "Website Resmi NYBO",
    publishedAt: "2024-04-07",
    author: "IyoraOlympiade",
  },
  {
    id: "news-2",
    slug: "os2mn-2025-sukses-digelar",
    title: "OS2MN 2025 Sukses Digelar, Tampilkan Semangat Kompetisi Ilmiah Pelajar Madrasah Se-Indonesia",
    category: "news",
    photo: "https://jabaran.id/wp-content/uploads/2025/04/IYSA-gelar-OS2MN-2025-696x381.jpg",
    caption: "OS2MN 2025 menerapkan sistem kompetisi dua putaran yang ketat dan berstandar tinggi.",
    content: "Dunia pendidikan madrasah Indonesia kembali menunjukkan prestasi gemilang melalui penyelenggaraan Olimpiade Sains Siswa Madrasah Nasional (OS2MN) 2025. Ajang bergengsi yang dihelat oleh Indonesian Young Scientist Association (IYSA) untuk kedua kalinya ini berlangsung secara daring dari tanggal 10 hingga 17 April 2025, berhasil menyedot antusiasme ratusan pelajar madrasah dari berbagai penjuru tanah air.",
    link: "https://jabaran.id/os2mn-2025-sukses-digelar-tampilkan-semangat-kompetisi-ilmiah-pelajar-madrasah-se-indonesia/",
    linkLabel: "Berita Media Jabaran.id",
    link2: "https://os2mn.iyora.or.id",
    link2Label: "Website Resmi OS2MN",
    publishedAt: "2025-04-25",
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
    author: "Sekretariat IYORA",
  },*/

  // ── ANNOUNCEMENTS (Pengumuman) ──
  /*{
    id: "announcement-1",
    slug: "jadwal-dan-petunjuk-teknis-nyco-2026",
    title: "Pengumuman Jadwal & Petunjuk Teknis Pelaksanaan NYCO & IYCO 2026",
    category: "announcement",
    photo: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    caption: "Simak jadwal penting, tata cara ujian CBT online, serta pembagian sesi pelaksanaan National & International Youth Chemistry Olympiad.",
    content: "Panitia Pelaksana NYCO 2026 menyampaikan jadwal rinci dan petunjuk teknis ujian yang wajib dipelajari oleh seluruh peserta terdaftar. Pengawasan akan dilakukan melalui sistem AI proctoring dan Zoom meeting terintegrasi.",
    link: "https://nyco.iyora.or.id",
    publishedAt: "2026-08-11",
    author: "Panitia Kompetisi",
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
    author: "Tim IT IYORA",
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
    author: "Sekretariat IYORA",
  },*/

  // ── GALLERY (Galeri) ──
/*  {
    id: "gallery-1",
    slug: "galeri-penganugerahan-wso-2026",
    title: "Upacara Penganugerahan Medali World Science Olympiad",
    category: "gallery",
    photo: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    caption: "Momen kebahagiaan dan kebanggaan para pemenang saat menerima medali dan trofi penganugerahan WSO.",
    publishedAt: "2026-07-20",
    author: "Tim Dokumentasi",
    link: "/news",
  },*/
 
];

export function getDummyNewsByCategory(category: "news" | "announcement" | "gallery") {
  return DUMMY_NEWS.filter((item) => item.category === category).sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export function getDummyNewsBySlug(slug: string) {
  return DUMMY_NEWS.find((item) => item.slug === slug);
}

