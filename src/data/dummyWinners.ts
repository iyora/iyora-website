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

export const DUMMY_WINNER_ANNOUNCEMENTS: WinnerAnnouncementDoc[] = [];

export const DUMMY_WINNERS: WinnerItem[] = [];

export const WINNER_STATS = {
  totalWinners: 0,
  totalCompetitions: 0,
  totalSchools: 0,
  totalCountries: 0,
  simtCuratedPercent: 100,
};

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
  { key: "Grand Champion", labelId: "medal_gc", icon: "🏆" },
  { key: "Gold Medal", labelId: "medal_gold", icon: "🥇" },
  { key: "Silver Medal", labelId: "medal_silver", icon: "🥈" },
  { key: "Bronze Medal", labelId: "medal_bronze", icon: "🥉" },
  { key: "Honorable Mention", labelId: "medal_hm", icon: "🎖️" },
];
