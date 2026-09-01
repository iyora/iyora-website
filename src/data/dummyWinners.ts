export type WinnerMedal =
  | "Grand Champion"
  | "Gold Medal"
  | "Silver Medal"
  | "Bronze Medal"
  | "Honorable Mention"
  | "Special Award";

export type WinnerLevel =
  | "SD / MI"
  | "SMP / MTs"
  | "SMA / MA / SMK"
  | "Universitas / Mahasiswa";

export interface WinnerItem {
  id: string;
  name: string;
  school: string;
  city: string;
  province: string;
  country: string;
  countryCode: string; // e.g. "ID", "MY", "TH", "KR", "US", "UZ"
  competition: string; // e.g. "NYGO", "IYGO", "NYEO", "IYEO", "NYBO", "IYBO", "NYPO", "IYPO", "NYCO", "IYCO", "NYMO", "IYMO", "OS2MN", "WSO"
  competitionFullName: string;
  category: string; // e.g. "Geography", "Economics", "Biology", "Physics", "Chemistry", "Mathematics", "Science"
  level: WinnerLevel;
  editionYear: number;
  editionName: string;
  medal: WinnerMedal;
  score?: string;
  photo?: string;
  certificateNumber?: string;
  simtVerified?: boolean;
  specialNote?: string;
}

export interface WinnerAnnouncementDoc {
  id: string;
  competition: string;
  competitionFullName: string;
  title: string;
  title_en: string;
  edition: string;
  publishDate: string;
  skNumber: string;
  downloadUrl: string;
  totalParticipants: number;
  totalMedals: number;
  badge: string;
  category: string;
}

/**
 * 🔗 KONFIGURASI LINK GOOGLE DRIVE SK PEMENANG (MANUAL)
 * Silakan tempel link Google Drive resmi untuk masing-masing cabang di bawah ini:
 */
export const MANUAL_SK_DRIVE_LINKS: Record<string, string> = {
  NYGO: "/sk/nygi-sk.pdf",
  IYGO: "",
  NYEO: "/sk/nyeo-sk.pdf",
  IYEO: "/sk/iyeo-list.pdf",
  NYMO: "",
  IYMO: "", // Tempel link SK IYMO di sini
  NYBO: "", // Tempel link SK NYBO di sini
  IYBO: "", // Tempel link SK IYBO di sini
  NYPO: "", // Tempel link SK NYPO di sini
  IYPO: "", // Tempel link SK IYPO di sini
  NYCO: "", // Tempel link SK NYCO di sini
  IYCO: "", // Tempel link SK IYCO di sini
  NYEnO: "", // Tempel link SK NYEnO di sini
  IYEnO: "", // Tempel link SK IYEnO di sini
  NYAO: "", // Tempel link SK NYAO di sini
  IYAO: "", // Tempel link SK IYAO di sini
  OS2MN: "", // Tempel link SK OS2MN di sini
  WSO: "", // Tempel link SK WSO di sini
  NSO: "", // Tempel link SK NSO di sini
  NSMO: "", // Tempel link SK NSMO di sini
  ALL: "", // Tempel link SK Gabungan / Umum di sini
};

/**
 * DAFTAR DOKUMEN SK PENGUMUMAN PEMENANG (DEFAULT / FALLBACK)
 */
export const DUMMY_WINNER_ANNOUNCEMENTS: WinnerAnnouncementDoc[] = [
  {
    id: "sk-nygo-2026",
    competition: "NYGO",
    competitionFullName: "National Youth Geography Olympiad",
    title: "SK Penetapan Pemenang Resmi NYGO Season 2026",
    title_en: "List of Winners NYGO Season 2026",
    edition: "Season 2026",
    publishDate: "2026-08-20",
    skNumber: "192/DJ.NYGO/IYSA-YPBI/VIII/2026",
    downloadUrl: MANUAL_SK_DRIVE_LINKS.NYGO || "",
    totalParticipants: 12,
    totalMedals: 12,
    badge: "Terbaru",
    category: "Geography",
  },
  {
    id: "sk-iygo-2026",
    competition: "IYGO",
    competitionFullName: "International Youth Geography Olympiad",
    title: "SK Penetapan Pemenang Resmi IYGO Season 2026",
    title_en: "List of Winners IYGO Season 2026",
    edition: "Season 2026",
    publishDate: "2026-08-20",
    skNumber: "SK.IYGO/PEM/2026/08.02",
    downloadUrl: MANUAL_SK_DRIVE_LINKS.IYGO || "",
    totalParticipants: 850,
    totalMedals: 120,
    badge: "Terbaru",
    category: "Geography",
  },
  {
    id: "sk-nyeo-2026",
    competition: "NYEO",
    competitionFullName: "National Youth Economics Olympiad",
    title: "SK Penetapan Pemenang Resmi NYEO Season 2026",
    title_en: "List of Winners NYEO Season 2026",
    edition: "Season 2026",
    publishDate: "2026-08-20",
    skNumber: "193/DJ.NYEO/IYSA-YPBI/VIII/2026",
    downloadUrl: MANUAL_SK_DRIVE_LINKS.NYEO || "",
    totalParticipants: 1100,
    totalMedals: 150,
    badge: "Terbaru",
    category: "Economics",
  },
  {
    id: "sk-iyeo-2026",
    competition: "IYEO",
    competitionFullName: "International Youth Economics Olympiad",
    title: "SK Penetapan Pemenang Resmi IYEO Season 2026",
    title_en: "List of Winners IYEO Season 2026",
    edition: "Season 2026",
    publishDate: "2026-08-20",
    skNumber: "191/DJ.IYEO/IYSA-YPBI/VIII/2026",
    downloadUrl: MANUAL_SK_DRIVE_LINKS.IYEO || "",
    totalParticipants: 720,
    totalMedals: 95,
    badge: "Terbaru",
    category: "Economics",
  },
  /*{
    id: "sk-nymo-2026",
    competition: "NYMO",
    competitionFullName: "National Youth Mathematics Olympiad",
    title: "SK Penetapan Pemenang Resmi NYMO Season 2026",
    title_en: "Official Winners Decree of NYMO Season 2026",
    edition: "Season 2026",
    publishDate: "2026-05-10",
    skNumber: "SK.NYMO/PEM/2026/05.01",
    downloadUrl: MANUAL_SK_DRIVE_LINKS.NYMO || "",
    totalParticipants: 1850,
    totalMedals: 210,
    badge: "Resmi",
    category: "Mathematics",
  },
  {
    id: "sk-iymo-2026",
    competition: "IYMO",
    competitionFullName: "International Youth Mathematics Olympiad",
    title: "SK Penetapan Pemenang Resmi IYMO Season 2026",
    title_en: "Official Winners Decree of IYMO Season 2026",
    edition: "Season 2026",
    publishDate: "2026-06-15",
    skNumber: "SK.IYMO/PEM/2026/06.01",
    downloadUrl: MANUAL_SK_DRIVE_LINKS.IYMO || "",
    totalParticipants: 920,
    totalMedals: 110,
    badge: "Resmi",
    category: "Mathematics",
  },
  {
    id: "sk-nybo-2026",
    competition: "NYBO",
    competitionFullName: "National Youth Biology Olympiad",
    title: "SK Penetapan Pemenang Resmi NYBO Season 2026",
    title_en: "Official Winners Decree of NYBO Season 2026",
    edition: "Season 2026",
    publishDate: "2026-07-20",
    skNumber: "SK.NYBO/PEM/2026/07.01",
    downloadUrl: MANUAL_SK_DRIVE_LINKS.NYBO || "",
    totalParticipants: 1250,
    totalMedals: 140,
    badge: "Resmi",
    category: "Biology",
  },
  {
    id: "sk-iybo-2026",
    competition: "IYBO",
    competitionFullName: "International Youth Biology Olympiad",
    title: "SK Penetapan Pemenang Resmi IYBO Season 2026",
    title_en: "Official Winners Decree of IYBO Season 2026",
    edition: "Season 2026",
    publishDate: "2026-07-20",
    skNumber: "SK.IYBO/PEM/2026/07.02",
    downloadUrl: MANUAL_SK_DRIVE_LINKS.IYBO || "",
    totalParticipants: 680,
    totalMedals: 85,
    badge: "Resmi",
    category: "Biology",
  },
  {
    id: "sk-os2mn-2026",
    competition: "OS2MN",
    competitionFullName: "Olimpiade Sains Madrasah Nasional",
    title: "SK Penetapan Pemenang Resmi OS2MN Season 2026",
    title_en: "Official Winners Decree of OS2MN Season 2026",
    edition: "Season 2026",
    publishDate: "2026-03-05",
    skNumber: "SK.OS2MN/PEM/2026/03.01",
    downloadUrl: MANUAL_SK_DRIVE_LINKS.OS2MN || "",
    totalParticipants: 2100,
    totalMedals: 250,
    badge: "Resmi",
    category: "Madrasah",
  },
  {
    id: "sk-wso-2026",
    competition: "WSO",
    competitionFullName: "World Science Olympiad",
    title: "SK Penetapan Pemenang Resmi WSO Season 2026",
    title_en: "Official Winners Decree of WSO Season 2026",
    edition: "Season 2026",
    publishDate: "2026-08-15",
    skNumber: "SK.WSO/PEM/2026/08.01",
    downloadUrl: MANUAL_SK_DRIVE_LINKS.WSO || "",
    totalParticipants: 1600,
    totalMedals: 200,
    badge: "Internasional",
    category: "Science",
  },
  {
    id: "sk-nso-2026",
    competition: "NSO",
    competitionFullName: "National Science Olympiad",
    title: "SK Penetapan Pemenang Resmi NSO Season 2026",
    title_en: "Official Winners Decree of NSO Season 2026",
    edition: "Season 2026",
    publishDate: "2026-08-28",
    skNumber: "SK.NSO/PEM/2026/08.01",
    downloadUrl: MANUAL_SK_DRIVE_LINKS.NSO || "",
    totalParticipants: 1350,
    totalMedals: 160,
    badge: "Resmi",
    category: "Science",
  },
  {
    id: "sk-nsmo-2026",
    competition: "NSMO",
    competitionFullName: "National Science and Math Olympiad",
    title: "SK Penetapan Pemenang Resmi NSMO Season 2026",
    title_en: "Official Winners Decree of NSMO Season 2026",
    edition: "Season 2026",
    publishDate: "2026-09-01",
    skNumber: "SK.NSMO/PEM/2026/09.01",
    downloadUrl: MANUAL_SK_DRIVE_LINKS.NSMO || "",
    totalParticipants: 1500,
    totalMedals: 175,
    badge: "Resmi",
    category: "Science and Math",
  },
  */
];

export const DUMMY_WINNERS: WinnerItem[] = [];

export const WINNER_STATS = {
  totalWinners: 0,
  totalCompetitions: 0,
  totalSchools: 0,
  totalCountries: 0,
  simtCuratedPercent: 100,
};

export interface OlympiadCompetitionOption {
  code: string;
  name: string;
  category: string;
}

export const ALL_COMPETITIONS: OlympiadCompetitionOption[] = [
  { code: "NYGO", name: "NYGO - National Youth Geography Olympiad", category: "Geography" },
  { code: "IYGO", name: "IYGO - International Youth Geography Olympiad", category: "Geography" },
  { code: "NYEO", name: "NYEO - National Youth Economics Olympiad", category: "Economics" },
  { code: "IYEO", name: "IYEO - International Youth Economics Olympiad", category: "Economics" },
  { code: "NYMO", name: "NYMO - National Youth Mathematics Olympiad", category: "Mathematics" },
  { code: "IYMO", name: "IYMO - International Youth Mathematics Olympiad", category: "Mathematics" },
  { code: "NYBO", name: "NYBO - National Youth Biology Olympiad", category: "Biology" },
  { code: "IYBO", name: "IYBO - International Youth Biology Olympiad", category: "Biology" },
  { code: "NYPO", name: "NYPO - National Youth Physics Olympiad", category: "Physics" },
  { code: "IYPO", name: "IYPO - International Youth Physics Olympiad", category: "Physics" },
  { code: "NYCO", name: "NYCO - National Youth Chemistry Olympiad", category: "Chemistry" },
  { code: "IYCO", name: "IYCO - International Youth Chemistry Olympiad", category: "Chemistry" },
  { code: "NYEnO", name: "NYEnO - National Youth Environment Olympiad", category: "Environment" },
  { code: "IYEnO", name: "IYEnO - International Youth Environment Olympiad", category: "Environment" },
  { code: "NYAO", name: "NYAO - National Youth Astronomy Olympiad", category: "Astronomy" },
  { code: "IYAO", name: "IYAO - International Youth Astronomy Olympiad", category: "Astronomy" },
  { code: "OS2MN", name: "OS2MN - Olimpiade Sains Madrasah Nasional", category: "Madrasah" },
  { code: "WSO", name: "WSO - World Science Olympiad", category: "Science" },
  { code: "NSO", name: "NSO - National Science Olympiad", category: "Science" },
  { code: "NSMO", name: "NSMO - National Science and Math Olympiad", category: "Science and Math" },
];

export const OLYMPIAD_CATEGORIES = [
  { key: "all", labelId: "filter_all", shortName: "Semua" },
  { key: "Geography", labelId: "cat_geography", shortName: "Geografi (NYGO/IYGO)" },
  { key: "Economics", labelId: "cat_economics", shortName: "Ekonomi (NYEO/IYEO)" },
  { key: "Biology", labelId: "cat_biology", shortName: "Biologi (NYBO/IYBO)" },
  { key: "Physics", labelId: "cat_physics", shortName: "Fisika (NYPO/IYPO)" },
  { key: "Chemistry", labelId: "cat_chemistry", shortName: "Kimia (NYCO/IYCO)" },
  { key: "Mathematics", labelId: "cat_math", shortName: "Matematika (NYMO/IYMO)" },
  { key: "Madrasah", labelId: "cat_madrasah", shortName: "Madrasah (OS2MN)" },
  { key: "Science", labelId: "cat_science", shortName: "Sains Dunia (WSO/NSO)" },
];

export const MEDAL_TABS = [
  { key: "all", labelId: "medal_all", icon: "🌟" },
  { key: "Gold Medal", labelId: "medal_gold", icon: "🥇" },
  { key: "Silver Medal", labelId: "medal_silver", icon: "🥈" },
  { key: "Bronze Medal", labelId: "medal_bronze", icon: "🥉" },
];
