"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  ChevronDown,
  Search,
  HelpCircle,
  ShieldCheck,
  FileText,
  Calendar,
  Award,
  Mail,
  ArrowRight,
} from "lucide-react";

type FaqCategoryKey = "all" | "general" | "registration" | "exam" | "awards";

interface FaqItem {
  id: string;
  category: Exclude<FaqCategoryKey, "all">;
  q_id: string;
  a_id: string;
  q_en: string;
  a_en: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "what-is-iyora",
    category: "general",
    q_id: "Apa itu IYORA dan apa hubungannya dengan IYSA?",
    a_id: "IYORA (Indonesian Youth Outstanding Recognition Association) adalah lembaga resmi penyelenggara olimpiade sains nasional dan internasional yang lahir dari IYSA (Indonesian Young Scientist Association). Sementara IYSA berfokus pada kompetisi invensi dan riset inovasi, IYORA didedikasikan 100% untuk menyelenggarakan olimpiade sains bagi pelajar dan mahasiswa.",
    q_en: "What is IYORA and how is it related to IYSA?",
    a_en: "IYORA (Indonesian Youth Outstanding Recognition Association) is an official national and international science olympiad organization born from IYSA (Indonesian Young Scientist Association). While IYSA focuses on invention and innovation competitions, IYORA is 100% dedicated to organizing science olympiads for students and youth.",
  },
  {
    id: "puspresnas-curation",
    category: "general",
    q_id: "Apakah olimpiade yang diselenggarakan IYORA sudah terkurasi Puspresnas / SIMT?",
    a_id: "Ya. Cabang-cabang olimpiade IYORA telah melalui proses kurasi resmi oleh Pusat Prestasi Nasional (Puspresnas) di bawah Kementerian Pendidikan, sehingga prestasi dan sertifikat pemenang terintegrasi dengan Sistem Informasi Manajemen Talenta (SIMT).",
    q_en: "Are IYORA olympiads officially curated by Puspresnas / SIMT?",
    a_en: "Yes. IYORA olympiad disciplines have undergone official accreditation by the National Achievement Center (Puspresnas) under the Ministry of Education, allowing winner achievements and certificates to be integrated into the Talent Management Information System (SIMT).",
  },
  {
    id: "certificate-benefits",
    category: "general",
    q_id: "Apakah sertifikat IYORA dapat digunakan untuk PPDB, SNBP, dan beasiswa?",
    a_id: "Tentu. Karena olimpiade IYORA terkurasi resmi dan tercatat di pangkalan data SIMT Puspresnas, sertifikat serta piagam penghargaan medalis memiliki validitas tinggi untuk mendukung pendaftaran seleksi masuk sekolah unggulan (PPDB Jalur Prestasi), seleksi masuk perguruan tinggi negeri (SNBP/SNBT), maupun pengajuan beasiswa.",
    q_en: "Can IYORA certificates be used for school/university admissions and scholarships?",
    a_en: "Absolutely. Because IYORA olympiads are officially accredited and recorded in the SIMT Puspresnas database, medalist certificates carry high validity to support achievement-track school admissions, national university admissions (SNBP/SNBT), and scholarship applications.",
  },
  {
    id: "who-can-join",
    category: "registration",
    q_id: "Siapa saja yang dapat mengikuti olimpiade IYORA?",
    a_id: "Kompetisi IYORA terbuka bagi pelajar tingkat SD/MI, SMP/MTs, SMA/MA/SMK, hingga Mahasiswa perguruan tinggi (tergantung ketentuan masing-masing cabang olimpiade), baik dari seluruh provinsi di Indonesia maupun peserta internasional.",
    q_en: "Who is eligible to participate in IYORA olympiads?",
    a_en: "IYORA competitions are open to Elementary (SD/MI), Junior High (SMP/MTs), Senior High (SMA/MA/SMK), and University students (depending on each competition's guidelines), welcoming participants from across Indonesia and around the world.",
  },
  {
    id: "how-to-register",
    category: "registration",
    q_id: "Bagaimana cara mendaftar kompetisi yang sedang dibuka?",
    a_id: "Anda dapat membuka menu Kompetisi atau Timeline Event di website ini, memilih event yang berstatus 'Pendaftaran Dibuka' (Open Register), lalu menekan tombol 'Daftar Sekarang' untuk mengisi formulir pendaftaran resmi pada portal event tersebut.",
    q_en: "How do I register for an open competition?",
    a_en: "Visit the Competitions or Event Timeline menu on this website, select an event marked 'Registration Open', and click 'Register Now' to complete the official registration form on the event portal.",
  },
  {
    id: "where-is-guidebook",
    category: "registration",
    q_id: "Di mana saya bisa mengunduh Buku Panduan (Guidebook) olimpiade?",
    a_id: "Buku Panduan (Guidebook) resmi yang memuat silabus, jadwal rinci, ketentuan peserta, dan tata tertib dapat diunduh melalui halaman Timeline Event atau langsung di website resmi masing-masing olimpiade.",
    q_en: "Where can I download the official Olympiad Guidebook?",
    a_en: "The official Guidebook containing the syllabus, detailed schedule, eligibility rules, and regulations can be downloaded from the Event Timeline page or directly on each competition's official website.",
  },
  {
    id: "exam-system",
    category: "exam",
    q_id: "Bagaimana sistem pelaksanaan ujian olimpiade IYORA?",
    a_id: "Pelaksanaan ujian diselenggarakan secara daring (Online CBT) yang diawasi secara ketat oleh tim pengawas IYORA, serta tersedia mode luring (Offline) pada ajang-ajang tertentu sesuai informasi yang tertera pada Buku Panduan event.",
    q_en: "How are IYORA olympiad exams conducted?",
    a_en: "Exams are conducted via supervised Online CBT, with Offline participation modes also available for selected events as specified in the respective event Guidebook.",
  },
  {
    id: "schedule-timeline",
    category: "exam",
    q_id: "Bagaimana cara melihat jadwal lengkap pendaftaran dan pelaksanaan event?",
    a_id: "Anda dapat mengakses menu 'Timeline Event' di bawah menu Kompetisi untuk memantau tanggal pembukaan pendaftaran, batas akhir penutupan pendaftaran, serta status pelaksanaan setiap olimpiade secara real-time.",
    q_en: "How can I check the full registration and event schedule?",
    a_en: "You can open the 'Event Timeline' submenu under Competitions to track registration opening dates, closing deadlines, and the real-time status of every olympiad.",
  },
  {
    id: "medals-and-awards",
    category: "awards",
    q_id: "Apa saja kategori medali yang diperebutkan?",
    a_id: "Peserta terbaik di setiap jenjang dan bidang akan memperebutkan penghargaan Gold Medal (Medali Emas), Silver Medal (Medali Perak), dan Bronze Medal (Medali Perunggu), beserta sertifikat resmi.",
    q_en: "What medal categories are awarded?",
    a_en: "Top-performing participants in each level and discipline compete for Gold Medal, Silver Medal, and Bronze Medal honors, along with official certificates.",
  },
  {
    id: "winner-sk-download",
    category: "awards",
    q_id: "Di mana saya bisa melihat pengumuman pemenang dan mengunduh Surat Keputusan (SK)?",
    a_id: "Daftar pemenang resmi beserta dokumen Surat Keputusan (SK) penetapan pemenang yang telah disahkan Dewan Juri dapat diakses dan diunduh langsung pada menu 'Daftar Pemenang' di website ini.",
    q_en: "Where can I view winner announcements and download Official Decrees (SK)?",
    a_en: "The official winners list and ratified Winner Decree (SK) PDF documents signed by the Board of Juries can be viewed and downloaded directly from the 'Winners' menu on this website.",
  },
];

export default function FaqClient() {
  const locale = useLocale();
  const isId = locale === "id";

  const [activeCategory, setActiveCategory] = useState<FaqCategoryKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const categories: { key: FaqCategoryKey; label: string; icon: typeof HelpCircle }[] = [
    { key: "all", label: isId ? "Semua Pertanyaan" : "All Questions", icon: HelpCircle },
    { key: "general", label: isId ? "Tentang & Kurasi SIMT" : "About & Accreditation", icon: ShieldCheck },
    { key: "registration", label: isId ? "Pendaftaran" : "Registration", icon: FileText },
    { key: "exam", label: isId ? "Ujian & Jadwal" : "Exams & Schedule", icon: Calendar },
    { key: "awards", label: isId ? "Medali & SK Pemenang" : "Medals & Decrees", icon: Award },
  ];

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FAQ_ITEMS.filter((item) => {
      const matchCat = activeCategory === "all" || item.category === activeCategory;
      const question = isId ? item.q_id : item.q_en;
      const answer = isId ? item.a_id : item.a_en;
      const matchSearch =
        !q || question.toLowerCase().includes(q) || answer.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery, isId]);

  return (
    <div className="space-y-10">
      {/* Search & Category Filter */}
      <div className="bg-white rounded-3xl border border-primary/15 shadow-sm p-5 md:p-6 space-y-5">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isId
                ? "Cari pertanyaan seputar pendaftaran, kurasi SIMT, ujian, atau SK pemenang..."
                : "Search questions about registration, SIMT accreditation, exams, or decrees..."
            }
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 text-sm font-medium outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(({ key, label, icon: Icon }) => {
            const isActive = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "gradient-hero text-white shadow-md shadow-primary/20"
                    : "bg-gray-50 text-gray-600 hover:text-primary hover:bg-primary/5 border border-gray-200/80"
                }`}
              >
                <Icon size={14} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accordion List */}
      {filteredFaqs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="text-4xl mb-3">❓</div>
          <p className="font-semibold text-gray-700 mb-2">
            {isId
              ? "Pertanyaan tidak ditemukan untuk kata kunci tersebut."
              : "No questions matched your search."}
          </p>
          <button
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            className="text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            {isId ? "Reset Pencarian" : "Reset Search"}
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredFaqs.map((item) => {
            const isOpen = openId === item.id;
            const question = isId ? item.q_id : item.q_en;
            const answer = isId ? item.a_id : item.a_en;

            return (
              <div
                key={item.id}
                className={`rounded-2xl bg-white border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-primary/35 shadow-md shadow-primary/5"
                    : "border-gray-200/80 hover:border-primary/25 shadow-2xs"
                }`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left cursor-pointer"
                >
                  <span
                    className={`text-sm md:text-base font-bold transition-colors ${
                      isOpen ? "text-primary" : "text-gray-900"
                    }`}
                  >
                    {question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                      isOpen
                        ? "gradient-hero text-white rotate-180"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 md:px-6 pb-6 pt-0 text-sm md:text-base text-gray-600 leading-relaxed border-t border-gray-100/80">
                    <div className="pt-4">{answer}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Still have questions CTA */}
      <div className="rounded-3xl p-8 md:p-10 gradient-hero text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-primary/15">
        <div>
          <h3 className="text-xl md:text-2xl font-extrabold mb-2">
            {isId ? "Masih Punya Pertanyaan Lain?" : "Still Have Questions?"}
          </h3>
          <p className="text-sm md:text-base text-white/90 max-w-xl">
            {isId
              ? "Tim sekretariat IYORA siap membantu menjawab pertanyaan Anda seputar pendaftaran sekolah, kemitraan, maupun teknis pelaksanaan olimpiade."
              : "Our secretariat team is ready to assist you with school registrations, partnerships, and technical olympiad inquiries."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href={`/${locale}/competitions/timeline`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 text-white border border-white/30 transition-all"
          >
            <Calendar size={15} />
            <span>{isId ? "Timeline Event" : "Event Timeline"}</span>
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold bg-white text-primary hover:bg-white/95 shadow-md transition-all"
          >
            <Mail size={15} />
            <span>{isId ? "Hubungi Kami" : "Contact Us"}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
