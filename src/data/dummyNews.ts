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
    photo: "/images/galeri/open.png",
    /* 📸 DOKUMENTASI FOTO (Bisa Diubah / Ditambah Foto Baru di Sini) */
    photos: [
      "/images/OPENING/dokum1.png",
      "/images/OPENING/dokum2.png",
      "/images/OPENING/dokum6.jpeg",
      "/images/OPENING/dokum5.jpeg",
      "/images/OPENING/dokum3.jpeg",
      "/images/OPENING/dokum4.jpeg",

    ],
    caption: "Resmi Dibuka! Opening Ceremony NYGO & IYGO serta NYEO & IYEO 2026 Sukses Digelar Secara Daring pada 20 Agustus 2026.",
    caption_en: "Officially Opened! Online Opening Ceremony for NYGO, IYGO, NYEO & IYEO 2026 Successfully Held on August 20th, 2026.",
    content: `DEPOK, 20 Agustus 2026 — Indonesian Youth Outstanding Recognition Association (IYORA) bekerjasama dengan Indonesian Young Scientist Association (IYSA) dan Malaysia Innovation Invention Creativity Association (MIICA) secara resmi menyelenggarakan Pembukaan Resmi (Opening Ceremony) kompetisi olimpiade tingkat nasional dan internasional: National Youth Geography Olympiad (NYGO), International Youth Geography Olympiad (IYGO), National Youth Economics Olympiad (NYEO), dan International Youth Economics Olympiad (IYEO) 2026.

Acara pembukaan yang digelar secara full online pada Kamis, 20 Agustus 2026 ini diikuti oleh pelajar bertalenta, guru pendamping, serta perwakilan dari beberapa negara Thailand, South Korea, Uzbekistan, United States.

Rangkaian Olimpiade NYGO, IYGO, NYEO, dan IYEO 2026 menjadi wadah prestisius bagi generasi muda untuk menguji pemahaman mendalam di bidang ilmu Geografi dan Ekonomi. Selain memperebutkan medali seluruh sertifikat kejuaraan IYORA telah terintegrasi dengan Sistem Informasi Manajemen Talenta (SIMT) Puspresnas Kemendikbudristek RI, memberikan bobot rekam jejak akademik yang diakui untuk jalur seleksi perguruan tinggi dan beasiswa.

"Opening Ceremony hari ini menandai dimulainya persaingan sehat dan sportif antar pelajar terbaik dari seluruh provinsi di Indonesia hingga mancanegara. Kami berkomitmen menyajikan kompetisi yang transparan, objektif, dan berstandar internasional,"

Tahap ujian online akan berlangsung sesuai jadwal teknis yang disiapkan platform IYORA. Masyarakat dan sekolah dapat memantau update pengumuman dan hasil babak final melalui portal resmi https://iyora.or.id.`,
    content_en: `DEPOK, August 20, 2026 — The Indonesian Youth Outstanding Recognition Association (IYORA), in collaboration with the Indonesian Young Scientist Association (IYSA) and the Malaysia Innovation Invention Creativity Association (MIICA), has officially held the opening ceremony for the 2026 national and international olympiad competitions: the National Youth Geography Olympiad (NYGO), International Youth Geography Olympiad (IYGO), National Youth Economics Olympiad (NYEO), and International Youth Economics Olympiad (IYEO).

The opening ceremony, held entirely online on Thursday, August 20, 2026, was attended by talented students, supervising teachers, and representatives from several countries, including Thailand, South Korea, Uzbekistan, and the United States.

The 2026 NYGO, IYGO, NYEO, and IYEO series serves as a prestigious platform for the younger generation to test their in-depth understanding of Geography and Economics. Beyond competing for medals, all IYORA championship certificates are integrated with the Talent Management Information System (SIMT) of the National Achievement Center (Puspresnas) under the Indonesian Ministry of Education, Culture, Research, and Technology; this provides recognized academic credentials for university admissions and scholarship applications.

"Today's opening ceremony marks the beginning of healthy, sportsmanlike competition among the best students from every province in Indonesia and from abroad. We are committed to delivering competitions that are transparent, objective, and meet international standards."

The online examination phase will proceed according to the technical schedule established by the IYORA platform. The public and schools can monitor updates regarding announcements and final round results via the official portal at https://iyora.or.id.`,
    publishedAt: "2026-08-20",
    author: "IyoraOlympiad",
  },
  {
    id: "press-releas-nygo-iygo-nyeo-iyeo-2026",
    slug: "siaran-pers-nygo-iygo-nyeo-iyeo-2026",
    title: "4 ajang olympiad bergengsi tingkat Nasional dan Internasional",
    title_en: "4 Prestigious National and International Olympiad Competitions",
    category: "press_release",
    photo: "/images/galeri/press.jpeg",
    /* 📸 DOKUMENTASI FOTO (Bisa Diubah / Ditambah Foto Baru di Sini) */
    photos: [
      "/images/press/iyora.png",
      "/images/press/open.jpg",
      "/images/OPENING/dokum3.jpeg",
      "/images/press/award.png",
      "/images/press/spc1.png",
      "/images/OPENING/dokum6.jpeg",
      "/images/press/spc2.png",

      "/images/press/spc3.png",
      "/images/OPENING/dokum5.jpeg",
      "/images/press/spc4.png",
      "/images/OPENING/dokum2.png",
      "/images/press/spc5.jpg",
      "/images/OPENING/dokum1.png",
    ],
    caption: "NYGO & IYGO serta NYEO & IYEO 2026 Sukses Digelar Secara Daring pada 20 Agustus 2026.",
    caption_en: "NYGO, IYGO, NYEO & IYEO 2026 Successfully Held on August 20th, 2026.",
    content: `Depok, 28 September 2026 - Indonesia Young Scientist Association (IYSA) kembali sukses menyelenggarakan empat ajang olimpiade bergengsi, yaitu National Youth Geography Olympiad (NYGO), International Youth Geography Olympiad (IYGO), National Youth Economics Olympiad (NYEO), dan International Youth Economics Olympiad (IYEO) secara daring pada 20 - 27 September 2026. Kegiatan ini menjadi wadah bagi pelajar untuk menguji kemampuan akademik sekaligus memperluas jejaring internasional di bidang Geografi dan Ekonomi.

Pelaksanaan olimpiade dilakukan melalui dua putaran ujian. Putaran pertama diselenggarakan pada 20 September 2026, sementara putaran kedua berlangsung pada 21 September 2026. Sistem kompetisi yang dirancang secara bertahap ini memberikan kesempatan kepada peserta untuk menunjukkan kemampuan terbaik mereka melalui proses seleksi yang objektif dan kompetitif.

Dalam penyelenggaraannya, IYSA bekerja sama dengan Yayasan Prestasi Belia Indonesia (YPBI) sebagai mitra akademik yang mendukung kelancaran dan kredibilitas pelaksanaan kegiatan. Kolaborasi ini menjadi bentuk komitmen bersama dalam mendorong peningkatan kualitas pendidikan serta pengembangan sumber daya manusia yang unggul di bidang sains.

Tahun ini, olimpiade berhasil menarik partisipasi sebanyak 146 tim dari 5 negara. Untuk bidang Geografi, NYGO dan IYGO diikuti oleh 71 tim, sedangkan bidang Ekonomi melalui NYEO dan IYEO diikuti oleh 75 tim. Antusiasme peserta menunjukkan tingginya minat generasi muda terhadap kompetisi akademik yang menantang dan berstandar internasional.

Lima negara yang turut berpartisipasi dalam ajang ini adalah Indonesia, Thailand, Korea Selatan, Amerika Serikat, dan Uzbekistan. Kehadiran peserta dari berbagai negara menciptakan suasana kompetisi yang dinamis sekaligus memperkuat semangat kolaborasi global di kalangan pelajar.

Setelah melalui proses ujian yang dilakukan secara profesional dengan adanya pengawasan oleh tim IYSA, para peserta terbaik berhasil menunjukkan kemampuan luar biasa dalam menyelesaikan berbagai tantangan akademik yang diberikan. Prestasi yang diraih para pemenang menjadi bukti kerja keras, dedikasi, dan semangat belajar yang tinggi dalam mengembangkan kompetensi di bidang Geografi maupun Ekonomi.

Pengumuman pemenang dan pelaksanaan Awarding Ceremony diselenggarakan pada 27 September 2026 dan diumumkan bersamaan dengan rangkaian kegiatan kompetisi dan invensi lainnya yang diselenggarakan oleh IYSA, yaitu Indonesia International Invention Expo (IIIEX). Momentum ini menjadi ajang apresiasi bagi para peserta yang telah menunjukkan pencapaian terbaiknya selama kompetisi berlangsung.

Selamat kepada seluruh peraih penghargaan atas prestasi yang telah diraih. Bagi peserta yang belum memperoleh hasil sesuai harapan, semoga pengalaman berharga selama kompetisi menjadi motivasi untuk terus belajar dan berkembang. Terima kasih atas partisipasi seluruh peserta, guru pembimbing, orang tua, dan pihak yang telah mendukung terselenggaranya olimpiade ini. Sampai bertemu kembali pada olimpiade IYSA tahun depan dengan semangat, inovasi, dan prestasi yang lebih gemilang.
`,
    content_en: `Depok, September 28, 2026 — Indonesia Young Scientist Association (IYSA) has once again successfully organized four prestigious Olympiad competitions, namely the National Youth Geography Olympiad (NYGO), International Youth Geography Olympiad (IYGO), National Youth Economics Olympiad (NYEO), and International Youth Economics Olympiad (IYEO), which were held online from September 20–27, 2026. The event served as a platform for students to test their academic abilities while expanding their international networks in the fields of Geography and Economics.

The Olympiads were conducted through two examination rounds. The first round was held on September 20, 2026, while the second round took place on September 21, 2026. This structured competition system provided participants with an opportunity to demonstrate their best abilities through an objective and competitive selection process.

In organizing the Olympiads, IYSA collaborated with Yayasan Prestasi Belia Indonesia (YPBI) as an academic partner supporting the smooth and credible implementation of the event. This collaboration reflects a shared commitment to improving the quality of education and developing outstanding human resources in the field of science.

This year, the Olympiads successfully attracted 146 teams from 5 countries. In the field of Geography, NYGO and IYGO were participated in by 71 teams, while the Economics competitions, NYEO and IYEO, attracted 75 teams. The strong enthusiasm from participants demonstrates the high level of interest among young people in challenging academic competitions with international standards.

The five countries participating in the event were Indonesia, Thailand, South Korea, the United States, and Uzbekistan. The participation of students from various countries created a dynamic competitive atmosphere while strengthening the spirit of global collaboration among young learners.

After completing the examination process, which was professionally conducted under the supervision of the IYSA team, the top participants demonstrated outstanding abilities in tackling various academic challenges. The achievements of the winners are a testament to their hard work, dedication, and strong enthusiasm for learning and developing their competencies in Geography and Economics.

The winners were announced and the Awarding Ceremony was held on September 27, 2026, as part of a series of competitions and invention activities organized by IYSA, namely the Indonesia International Invention Expo (IIIEX). This moment served as an opportunity to recognize and appreciate the participants who achieved outstanding results throughout the competition.

Congratulations to all award recipients on their achievements. For participants who did not achieve the results they had hoped for, may the valuable experience gained throughout the competition serve as motivation to continue learning and growing. We extend our sincere gratitude to all participants, supervising teachers, parents, and everyone who supported the successful implementation of these Olympiads.

We look forward to welcoming you again at the IYSA Olympiads next year, with greater enthusiasm, innovation, and outstanding achievements.`,
    publishedAt: "2026-09-28",
    author: "IyoraOlympiad",
  },
  // ── NEWS / ANNOUNCEMENT ──
  /*{
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
  },*/
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
    id: "gallery-round2-2026",
    slug: "dokumentasi-round2-nygo-iygo-nyeo-iyeo-2026",
    title: "Dokumentasi Acara Round 2: NYGO, IYGO, NYEO & IYEO 2026",
    title_en: "Event Documentation Round 2: NYGO, IYGO, NYEO & IYEO 2026",
    category: "gallery",
    photo: "/images/galeri/rondee2.png",
    photos: [
      "/images/rond2/ron1.jpeg",
      "/images/rond2/ron2.jpeg",
      "/images/rond2/ron3.jpeg",
      "/images/rond2/ron4.jpeg",
      "/images/rond2/ron5.jpeg",
      "/images/rond2/ron6.jpeg",
      "/images/rond2/ron7.jpeg",


    ],
    caption: "Kumpulan foto dokumentasi Round 2 NYGO & IYGO serta NYEO & IYEO 2026 yang digelar secara daring pada 24 Agustus 2026..",
    caption_en: "Photo documentation collection of Round 2 of NYGO, IYGO, NYEO & IYEO 2026 held online on August 24th, 2026.",
    content: "Berikut adalah dokumentasi foto lengkap dari pelaksanaan Round 2 kompetisi olimpiade tingkat nasional dan internasional NYGO, IYGO, NYEO, dan IYEO 2026. Kegiatan diselenggarakan secara daring bekerja sama dengan IYSA & MIICA serta terintegrasi resmi dengan SIMT Puspresnas Kemendikbudristek RI.",
    content_en: "Here is the complete photo documentation gallery of Round 2 of the NYGO, IYGO, NYEO, and IYEO 2026 national and international olympiads, held online in collaboration with IYSA & MIICA and officially integrated with SIMT Puspresnas, Ministry of Education, Culture, Research, and Technology of the Republic of Indonesia.",
    publishedAt: "2026-08-24",
    author: "IyoraOlympiad",
    link: "https://drive.google.com/drive/folders/1sVDgJRPsJlt9B8n_jTP_pcq1XNY5k8oC?usp=sharing",
    linkLabel: "FULL DOKUMENTASI ROUND 2",
    linkLabel_en: "Full Documentation of Round 2",
  },
  {
    id: "gallery-opening-ceremony-2026",
    slug: "dokumentasi-opening-ceremony-nygo-iygo-nyeo-iyeo-2026",
    title: "Dokumentasi Acara Round 1: Upacara Pembukaan Resmi NYGO, IYGO, NYEO & IYEO 2026",
    title_en: "Event Documentation Round 1: Official Opening Ceremony of NYGO, IYGO, NYEO & IYEO 2026",
    category: "gallery",
    photo: "/images/galeri/round1doc.png",
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
    author: "IyoraOlympiad",
    link: "https://drive.google.com/drive/folders/139SZyKKk2xDc6-Kx5FN3zFTsrIhWaLp0?usp=sharing",
    linkLabel: "FULL DOKUMENTASI ROUND 1",
    linkLabel_en: "Full Documentation of Round 1",
  },
  /* {
     id: "gallery-1",
     slug: "after-event-biology-physics-olympiad-2026",
     title: "After Event Biology & Physics Olympiad 2026",
     title_en: "After Event Biology & Physics Olympiad 2026",
     category: "gallery",
     photo: "/images/galeri/afterevent.png",
     caption: "Momen berkesan dan rangkuman keseruan kompetisi sains nasional Biology & Physics Olympiad 2026.",
     caption_en: "Memorable moments and highlight summary of the national science competition Biology & Physics Olympiad 2026.",
     content: "Kami bangga mempersembahkan video rangkuman dari acara yang tak terlupakan ini, sebagai bukti semangat, dedikasi, dan kecemerlangan yang telah ditunjukkan oleh setiap peserta. Melalui video pasca-acara ini, Anda akan disuguhi berbagai momen berkesan yang telah kita lalui bersama.",
     content_en: "We are proud to present a summary video of this unforgettable event, as a testament to the passion, dedication, and brilliance demonstrated by every participant. Through this post-event video, you will be treated to various memorable moments we shared together.",
     publishedAt: "2026-08-13",
     author: "IyoraOlympiade",
     link: "https://www.youtube.com/embed/05RdQgvQiVY?si=KSSadgHGYFNm9do1",
     linkLabel: "Tonton Video Dokumentasi YouTube",
     linkLabel_en: "Watch Video Documentation on YouTube",
   },*/
  {
    id: "gallery-2",
    slug: "after-event-nygo-iygo-nyeo-iyeo-2026",
    title: "After Event NYGO & IYGO serta NYEO & IYEO 2026",
    title_en: "After Event NYGO & IYGO and NYEO & IYEO 2026",
    category: "gallery",
    photo: "/images/galeri/aftereventiyora.png",
    caption: "Momen berkesan, penganugerahan pemenang (Awarding Ceremony), dan rangkuman keseruan kompetisi sains bergengsi NYGO & IYGO serta NYEO & IYEO Season 2026.",
    caption_en: "Memorable moments, official Awarding Ceremony, and highlight summary of the prestigious science competitions NYGO & IYGO as well as NYEO & IYEO Season 2026.",
    content: "Kami bangga mempersembahkan dokumentasi after event dan rangkuman momen terbaik dari perhelatan akbar National Youth Geography Olympiad (NYGO), International Youth Geography Olympiad (IYGO), National Youth Earth Science Olympiad (NYEO), dan International Youth Earth Science Olympiad (IYEO) 2026. Melalui kegiatan ini, para peserta dari berbagai sekolah dan negara telah menunjukkan dedikasi, integritas, dan kecemerlangan ilmiah luar biasa dari babak awal hingga penganugerahan pemenang (Awarding Ceremony) resmi yang terintegrasi dengan SIMT Puspresnas Kemendikbudristek RI.",
    content_en: "We are proud to present the official after-event documentation and highlight summary of the National Youth Geography Olympiad (NYGO), International Youth Geography Olympiad (IYGO), National Youth Earth Science Olympiad (NYEO), and International Youth Earth Science Olympiad (IYEO) 2026. This celebrates the dedication, integrity, and brilliant scientific achievements of participants across schools and countries, up to the official Awarding Ceremony integrated with SIMT Puspresnas.",
    publishedAt: "2026-08-28",
    author: "IyoraOlympiad",
    link: "https://youtu.be/mM9zkqo98pE?si=cWUdxFLbMOHDvAqO",
    linkLabel: "Tonton Dokumentasi Resmi di YouTube",
    linkLabel_en: "Watch Official Documentation on YouTube",
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
      itemSlugNormalized === normalized ||
      item.id === slug
    );
  });
}
