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
 * DAFTAR DOKUMEN SK PENGUMUMAN PEMENANG (DEFAULT / FALLBACK)
 * Anda dapat menaruh Link Google Drive pada properti `downloadUrl`.
 * Format link: https://drive.google.com/file/d/ID_FILE/view?usp=sharing
 */
export const DUMMY_WINNER_ANNOUNCEMENTS: WinnerAnnouncementDoc[] = [
  {
    id: "sk-nygo-2026",
    competition: "NYGO",
    competitionFullName: "National Youth Geography Olympiad",
    title: "SK Penetapan Pemenang Resmi NYGO Season 2026",
    title_en: "Official Winners Decree of NYGO Season 2026",
    edition: "Season 2026",
    publishDate: "2026-08-20",
    skNumber: "SK.NYGO/PEM/2026/08.01",
    downloadUrl: "", // Tempel Link Google Drive SK NYGO di sini
    totalParticipants: 1420,
    totalMedals: 180,
    badge: "Terbaru",
    category: "Geography",
  },
  {
    id: "sk-iygo-2026",
    competition: "IYGO",
    competitionFullName: "International Youth Geography Olympiad",
    title: "SK Penetapan Pemenang Resmi IYGO Season 2026",
    title_en: "Official Winners Decree of IYGO Season 2026",
    edition: "Season 2026",
    publishDate: "2026-08-20",
    skNumber: "SK.IYGO/PEM/2026/08.02",
    downloadUrl: "", // Tempel Link Google Drive SK IYGO di sini
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
    title_en: "Official Winners Decree of NYEO Season 2026",
    edition: "Season 2026",
    publishDate: "2026-08-20",
    skNumber: "SK.NYEO/PEM/2026/08.03",
    downloadUrl: "", // Tempel Link Google Drive SK NYEO di sini
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
    title_en: "Official Winners Decree of IYEO Season 2026",
    edition: "Season 2026",
    publishDate: "2026-08-20",
    skNumber: "SK.IYEO/PEM/2026/08.04",
    downloadUrl: "", // Tempel Link Google Drive SK IYEO di sini
    totalParticipants: 720,
    totalMedals: 95,
    badge: "Terbaru",
    category: "Economics",
  },
  {
    id: "sk-nymo-2026",
    competition: "NYMO",
    competitionFullName: "National Youth Mathematics Olympiad",
    title: "SK Penetapan Pemenang Resmi NYMO Season 2026",
    title_en: "Official Winners Decree of NYMO Season 2026",
    edition: "Season 2026",
    publishDate: "2026-05-10",
    skNumber: "SK.NYMO/PEM/2026/05.01",
    downloadUrl: "", // Tempel Link Google Drive SK NYMO di sini
    totalParticipants: 1850,
    totalMedals: 210,
    badge: "Resmi",
    category: "Mathematics",
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
    downloadUrl: "", // Tempel Link Google Drive SK OS2MN di sini
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
    downloadUrl: "", // Tempel Link Google Drive SK WSO di sini
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
    downloadUrl: "", // Tempel Link Google Drive SK NSO di sini
    totalParticipants: 1350,
    totalMedals: 160,
    badge: "Resmi",
    category: "Science",
  },
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
