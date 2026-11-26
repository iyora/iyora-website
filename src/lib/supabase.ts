import { createClient } from "@supabase/supabase-js";
import { STATISTIK_CADANGAN, type StatistikSitus } from "@/data/statistik";
import {
  WinnerItem,
  WinnerMedal,
  WinnerLevel,
  WinnerAnnouncementDoc,
  getAnnouncementMode,
  DUMMY_WINNERS,
  DUMMY_WINNER_ANNOUNCEMENTS,
  WINNER_STATS,
} from "@/data/dummyWinners";
import {
  DUMMY_NEWS,
  getDummyNews,
  getDummyNewsByCategory,
  getDummyNewsBySlug,
} from "@/data/dummyNews";

export type RegistrationStatus = "open" | "coming_soon" | "closed";

export interface CompetitionTimelineMilestone {
  milestone: string;
  tanggal: string;
  jalur?: string;
  lokasi?: string;
  jam_mulai?: string;
  jam_selesai?: string;
  keterangan?: string;
}

export interface CompetitionData {
  slug: string;
  shortName: string;
  name: string;
  level: "national" | "international" | "madrasah" | "world";
  category: string | null;   // first element of the DB array, or null
  websiteUrl: string | null;
  registrationUrl?: string | null;
  registrationStatus: RegistrationStatus;
  guidebookUrl: string | null;
  registrationOpenAt?: string | null;
  registrationCloseAt?: string | null;
  eventStartAt?: string | null;
  eventEndAt?: string | null;
  bannerUrl?: string | null;
  heroUrl?: string | null;
  logoUrl?: string | null;
  edition?: number | string | null;
  year?: number | null;
  timeline?: CompetitionTimelineMilestone[];
}

export function normalizeUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function getValidEventWebsiteUrl(slug: string, url?: string | null): string {
  if (!url) return `https://${slug}.iyora.or.id`;
  const clean = normalizeUrl(url);
  if (!clean || /^https?:\/\/(www\.)?iyora\.or\.id\/?$/i.test(clean)) {
    return `https://${slug}.iyora.or.id`;
  }
  return clean;
}

export function getValidEventRegistrationUrl(slug: string, regUrl?: string | null, webUrl?: string | null): string {
  const eventBase = getValidEventWebsiteUrl(slug, webUrl);
  if (regUrl) {
    const cleanReg = normalizeUrl(regUrl);
    if (
      cleanReg &&
      !/^https?:\/\/(www\.)?iyora\.or\.id(\/(en|id))?\/register\/?$/i.test(cleanReg) &&
      !/^https?:\/\/(www\.)?iyora\.or\.id\/?$/i.test(cleanReg) &&
      cleanReg !== "/register"
    ) {
      return cleanReg.endsWith("/register") ? cleanReg : cleanReg;
    }
  }
  return `${eventBase.replace(/\/+$/, "")}/register`;
}

function createSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    console.warn("[Supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in environment.");
  }
  return createClient(
    url || "https://placeholder.supabase.co",
    anonKey || "placeholder"
  );
}

function computeStatus(
  openAt: string | null,
  closeAt: string | null
): RegistrationStatus {
  if (!openAt || !closeAt) return "coming_soon";
  const now = new Date();
  if (now < new Date(openAt)) return "coming_soon";

  const closeDate = new Date(closeAt);
  if (closeAt.length <= 10) {
    closeDate.setHours(23, 59, 59, 999);
  }
  if (now > closeDate) return "closed";
  return "open";
}

const STATUS_ORDER: Record<string, number> = {
  open: 0,
  coming_soon: 1,
  closed: 2,
};

function sortCompetitionsByStatus(competitions: CompetitionData[]): CompetitionData[] {
  return [...competitions].sort((a, b) => {
    const orderA = STATUS_ORDER[a.registrationStatus] ?? 99;
    const orderB = STATUS_ORDER[b.registrationStatus] ?? 99;
    return orderA - orderB;
  });
}

interface RawDefaultCompetition {
  slug: string;
  shortName: string;
  name: string;
  level: "national" | "international" | "madrasah" | "world";
  category: string | null;
  websiteUrl: string | null;
  registrationUrl?: string | null;
  guidebookUrl: string | null;
  openAt: string | null;
  closeAt: string | null;
}

const RAW_DEFAULT_COMPETITIONS: RawDefaultCompetition[] = [
  // 1. Open Registration
  { slug: "nso", shortName: "NSO", name: "National Science Olympiad", level: "national", category: "Science", websiteUrl: "https://nso.iyora.or.id", registrationUrl: "https://nso.iyora.or.id/register", guidebookUrl: "https://api-dashboard.iysa.or.id/media/coreapps/iyora/event-media/cf86f6fb-83e8-4fd4-8356-e3ac76936b50/guidebooks/1790573374035-Guidebook-NSO-2026.pdf", openAt: "2026-09-03", closeAt: "2026-10-16" },
  { slug: "nsmo", shortName: "NSMO", name: "National Science Math Olympiad", level: "national", category: "Mathematics", websiteUrl: "https://nsmo.iyora.or.id", registrationUrl: "https://nsmo.iyora.or.id/register", guidebookUrl: "https://api-dashboard.iysa.or.id/media/coreapps/events/guidebooks/nsmo-2026-1794637340172-o.pdf", openAt: "2026-09-08", closeAt: "2026-11-20" },
  { slug: "wso", shortName: "WSO", name: "World Science Olympiad", level: "world", category: "Science", websiteUrl: "https://wso.iyora.or.id", registrationUrl: "https://wso.iyora.or.id/register", guidebookUrl: "https://api-dashboard.iysa.or.id/media/coreapps/events/guidebooks/wso-2026-1794469585996-o.pdf", openAt: "2026-09-20", closeAt: "2026-11-20" },
  { slug: "tiso", shortName: "TISO", name: "THAILAND INTERNATIONAL SCIENCE OLYMPIAD", level: "international", category: "Physics", websiteUrl: "https://tiso.iyora.or.id", registrationUrl: "https://tiso.iyora.or.id/register", guidebookUrl: "https://api-dashboard.iysa.or.id/media/coreapps/events/guidebooks/tiso-2027-1795404273206-o.pdf", openAt: "2026-10-02", closeAt: "2026-12-05" },

  // 2. Coming Soon
  { slug: "gyso", shortName: "GYSO", name: "GLOBAL YOUTH SCIENCE OLYMPIAD", level: "international", category: "Science", websiteUrl: "https://gyso.iyora.or.id", registrationUrl: null, guidebookUrl: "https://api-dashboard.iysa.or.id/media/coreapps/iyora/event-media/80c9f1b9-0b30-439f-9905-981afe8cdaf6/guidebooks/1791256275558-Guidebook-GYSO-2027.pdf", openAt: null, closeAt: null },
  { slug: "nymo", shortName: "NYMO", name: "National Youth Mathematics Olympiad", level: "national", category: "Mathematics", websiteUrl: "https://nymo.iyora.or.id", registrationUrl: null, guidebookUrl: null, openAt: "2026-06-01", closeAt: "2026-08-01" },
  { slug: "iymo", shortName: "IYMO", name: "International Youth Mathematics Olympiad", level: "international", category: "Mathematics", websiteUrl: "https://iymo.iyora.or.id", registrationUrl: null, guidebookUrl: null, openAt: "2026-06-01", closeAt: "2026-08-01" },
  { slug: "nybo", shortName: "NYBO", name: "National Youth Biology Olympiad", level: "national", category: "Biology", websiteUrl: "https://nybo.iyora.or.id", registrationUrl: null, guidebookUrl: null, openAt: "2026-06-01", closeAt: "2026-08-01" },
  { slug: "iybo", shortName: "IYBO", name: "International Youth Biology Olympiad", level: "international", category: "Biology", websiteUrl: "https://iybo.iyora.or.id", registrationUrl: null, guidebookUrl: null, openAt: "2026-06-01", closeAt: "2026-08-01" },
  { slug: "nypo", shortName: "NYPO", name: "National Youth Physics Olympiad", level: "national", category: "Physics", websiteUrl: "https://nypo.iyora.or.id", registrationUrl: null, guidebookUrl: null, openAt: "2026-06-01", closeAt: "2026-08-01" },
  { slug: "iypo", shortName: "IYPO", name: "International Youth Physics Olympiad", level: "international", category: "Physics", websiteUrl: "https://iypo.iyora.or.id", registrationUrl: null, guidebookUrl: null, openAt: "2026-06-01", closeAt: "2026-08-01" },
  { slug: "nyco", shortName: "NYCO", name: "National Youth Chemistry Olympiad", level: "national", category: "Chemistry", websiteUrl: "https://nyco.iyora.or.id", registrationUrl: null, guidebookUrl: null, openAt: "2026-06-01", closeAt: "2026-08-01" },
  { slug: "iyco", shortName: "IYCO", name: "International Youth Chemistry Olympiad", level: "international", category: "Chemistry", websiteUrl: "https://iyco.iyora.or.id", registrationUrl: null, guidebookUrl: null, openAt: "2026-06-01", closeAt: "2026-08-01" },
  { slug: "os2mn", shortName: "OS2MN", name: "Olimpiade Sains Siswa Madrasah Nasional", level: "madrasah", category: "Madrasah", websiteUrl: "https://os2mn.iyora.or.id", registrationUrl: null, guidebookUrl: null, openAt: "2026-06-01", closeAt: "2026-08-01" },
  { slug: "kiso", shortName: "KISO", name: "KOREA INTERNATIONAL SCIENCE OLYMPIAD", level: "international", category: "Science", websiteUrl: "https://kiso.iyora.or.id", registrationUrl: null, guidebookUrl: null, openAt: null, closeAt: null },
  { slug: "hiso", shortName: "HISO", name: "HANOI INTERNATIONAL SCIENCE OLYMPIAD", level: "international", category: "Science", websiteUrl: "https://hiso.iyora.or.id", registrationUrl: null, guidebookUrl: null, openAt: null, closeAt: null },
  { slug: "miso", shortName: "MISO", name: "MANILA INTERNATIONAL SCIENCE OLYMPIAD", level: "international", category: "Science", websiteUrl: "https://miso.iyora.or.id", registrationUrl: null, guidebookUrl: null, openAt: null, closeAt: null },
  { slug: "meiso", shortName: "MEISO", name: "MEXICO INTERNATIONAL SCIENCE OLYMPIAD", level: "international", category: "Science", websiteUrl: "https://meiso.iyora.or.id", registrationUrl: null, guidebookUrl: null, openAt: null, closeAt: null },
  { slug: "nmiso", shortName: "NMISO", name: "NORTH MACEDONIA INTERNATIONAL SCIENCE OLYMPIAD", level: "international", category: "Science", websiteUrl: "https://nmiso.iyora.or.id", registrationUrl: null, guidebookUrl: null, openAt: null, closeAt: null },

  // 3. Closed (Past Competitions)
  { slug: "dmo", shortName: "DMO", name: "Diponegoro Mathematics Olympiad", level: "national", category: "Mathematics", websiteUrl: "https://dmo.iyora.or.id", registrationUrl: null, guidebookUrl: "https://api-dashboard.iysa.or.id/media/coreapps/iyora/event-media/63ed6c00-dd94-4bfa-9df8-00285c0335c0/guidebooks/1788772757309-JUKNIS_EVENT_DSCF_2026.pdf", openAt: "2026-06-01", closeAt: "2026-08-01" },
  { slug: "nygo", shortName: "NYGO", name: "National Youth Geography Olympiad", level: "national", category: "Geography", websiteUrl: "https://nygo.iyora.or.id", registrationUrl: null, guidebookUrl: "https://api-dashboard.iysa.or.id/media/coreapps/iyora/event-media/0a2f7235-47dc-4988-8096-b11665778032/guidebooks/1785738982960-GUIDEBOOK_NYGO_2026.pdf", openAt: "2026-06-30", closeAt: "2026-08-16" },
  { slug: "iygo", shortName: "IYGO", name: "International Youth Geography Olympiad", level: "international", category: "Geography", websiteUrl: "https://iygo.iyora.or.id", registrationUrl: null, guidebookUrl: "https://api-dashboard.iysa.or.id/media/coreapps/iyora/event-media/028b2c71-c7d7-4bfa-98f5-0be973bdd2ff/guidebooks/1785738887590-GUIDEBOOK_IYGO_2026__1_.pdf", openAt: "2026-06-30", closeAt: "2026-08-16" },
  { slug: "nyeo", shortName: "NYEO", name: "National Youth Economics Olympiad", level: "national", category: "Economics", websiteUrl: "https://nyeo.iyora.or.id", registrationUrl: null, guidebookUrl: "https://api-dashboard.iysa.or.id/media/coreapps/iyora/event-media/3c12e84f-ced0-457b-a4cc-7bb06aae1e1e/guidebooks/1787733952986-Guidebook-NYEO-2026.pdf", openAt: "2026-06-30", closeAt: "2026-08-16" },
  { slug: "iyeo", shortName: "IYEO", name: "International Youth Economics Olympiad", level: "international", category: "Economics", websiteUrl: "https://iyeo.iyora.or.id", registrationUrl: null, guidebookUrl: "https://api-dashboard.iysa.or.id/media/coreapps/iyora/event-media/189299c9-d901-42cc-9650-0464c33e6026/guidebooks/1785116985719-GUIDEBOOK_IYEO_2026.pdf", openAt: "2026-06-30", closeAt: "2026-08-19" },
];

export const KNOWN_EVENT_MEDIA: Record<string, { banner?: string; logo?: string }> = {
  nsmo: {
    banner: "https://api-dashboard.iysa.or.id/media/coreapps/coreapps/events/iyora/banner-aa800a1bcad9ffe0.png",
    logo: "https://api-dashboard.iysa.or.id/media/coreapps/coreapps/events/iyora/logo-42e31a735d0eead8.png",
  },
  wso: {
    banner: "https://api-dashboard.iysa.or.id/media/coreapps/coreapps/events/iyora/banner-8dc8a520fdad22f4.png",
    logo: "https://api-dashboard.iysa.or.id/media/coreapps/coreapps/events/iyora/logo-2b0ff3a467f366d4.png",
  },
  nso: {
    banner: "https://api.iyora.or.id/storage/v1/object/public/event-media/cf86f6fb-83e8-4fd4-8356-e3ac76936b50/banner.png",
    logo: "https://api.iyora.or.id/storage/v1/object/public/event-media/cf86f6fb-83e8-4fd4-8356-e3ac76936b50/logo.png",
  },
  tiso: {
    banner: "https://api.iyora.or.id/storage/v1/object/public/event-media/f46a573a-fede-45e0-a3c0-c8635ee1f14f/banner-1791182905339.png",
    logo: "https://api.iyora.or.id/storage/v1/object/public/event-media/f46a573a-fede-45e0-a3c0-c8635ee1f14f/logo-1790850309781.png",
  },
};

export const MANUAL_COMPETITION_OVERRIDES: Record<string, {
  openAt?: string;
  closeAt?: string;
  status?: RegistrationStatus;
  guidebookUrl?: string;
  registrationUrl?: string;
}> = {
  /*
   * 2026-11-23: tanggal & status pendaftaran TIDAK lagi ditulis di sini —
   * semuanya dari dasbor (sakelar Pendaftaran + tanggal buka/tutup edisi).
   * Tulisan manual sebelumnya membuat NSMO/WSO tetap "dibuka" sesudah tutup
   * 20 Nov dan GYSO "ditutup" padahal dibuka. Yang tersisa hanya tautan
   * cadangan bila dasbor tidak mengirimnya.
   */
  nsmo: {
    guidebookUrl: "https://api-dashboard.iysa.or.id/media/coreapps/events/guidebooks/nsmo-2026-1794637340172-o.pdf",
    registrationUrl: "https://nsmo.iyora.or.id/register",
  },
  wso: {
    guidebookUrl: "https://api-dashboard.iysa.or.id/media/coreapps/events/guidebooks/wso-2026-1794469585996-o.pdf",
    registrationUrl: "https://wso.iyora.or.id/register",
  },
  tiso: {
    guidebookUrl: "https://api-dashboard.iysa.or.id/media/coreapps/events/guidebooks/tiso-2027-1795404273206-o.pdf",
    registrationUrl: "https://tiso.iyora.or.id/register",
  },
};

export function resolveEventMedia(
  slug: string,
  rawBanner?: string | null,
  rawLogo?: string | null,
  guidebookUrl?: string | null
): { bannerUrl: string | null; logoUrl: string | null } {
  let banner = rawBanner || null;
  let logo = rawLogo || null;

  const key = slug?.toLowerCase() || "";
  const known = KNOWN_EVENT_MEDIA[key];
  if (!banner && known?.banner) banner = known.banner;
  if (!logo && known?.logo) logo = known.logo;

  if ((!banner || !logo) && guidebookUrl) {
    const match = guidebookUrl.match(/event-media\/([a-f0-9-]+)\//i);
    if (match?.[1]) {
      const uuid = match[1];
      if (!banner) banner = `https://api.iyora.or.id/storage/v1/object/public/event-media/${uuid}/banner.png`;
      if (!logo) logo = `https://api.iyora.or.id/storage/v1/object/public/event-media/${uuid}/logo.png`;
    }
  }

  return { bannerUrl: banner, logoUrl: logo };
}

export function getDefaultCompetitions(): CompetitionData[] {
  return RAW_DEFAULT_COMPETITIONS.map((c) => {
    const websiteUrl = getValidEventWebsiteUrl(c.slug, c.websiteUrl);
    const registrationUrl = getValidEventRegistrationUrl(c.slug, c.registrationUrl, websiteUrl);
    const media = resolveEventMedia(c.slug, null, null, c.guidebookUrl);
    return {
      slug: c.slug,
      shortName: c.shortName,
      name: c.name,
      level: c.level,
      category: c.category,
      websiteUrl,
      registrationUrl,
      registrationStatus: computeStatus(c.openAt, c.closeAt),
      guidebookUrl: c.guidebookUrl,
      registrationOpenAt: c.openAt,
      registrationCloseAt: c.closeAt,
      bannerUrl: media.bannerUrl,
      heroUrl: media.bannerUrl,
      logoUrl: media.logoUrl,
    };
  });
}

export const DEFAULT_COMPETITIONS: CompetitionData[] = getDefaultCompetitions();

const DASHBOARD_ORG_HEADERS = {
  "X-Organization-Slug": "iysa",
};

function inferCategoryFromAcronym(akronim: string, name: string): string | null {
  const s = (akronim || "").toUpperCase();
  const n = (name || "").toLowerCase();
  if (s === "NSMO" || n.includes("science math")) return "Mathematics";
  if (s.includes("BO") || n.includes("biolog")) return "Biology";
  if (s.includes("PO") || n.includes("physic") || s === "TISO") return "Physics";
  if (s.includes("CO") || n.includes("chemi")) return "Chemistry";
  if (s.includes("MO") || n.includes("math")) return "Mathematics";
  if (s.includes("GO") || n.includes("geograph")) return "Geography";
  if (s.includes("EO") || n.includes("econom")) return "Economics";
  if (s.includes("OS2MN") || n.includes("madrasah")) return "Madrasah";
  return "Science";
}

async function fetchDashboardV1IyoraSeries(dashboardUrl: string): Promise<any[]> {
  const res = await fetch(`${dashboardUrl}/api/public/v1/_seri`, {
    headers: DASHBOARD_ORG_HEADERS,
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return [];
  const json = await res.json();
  const allSeri = Array.isArray(json?.data?.seri) ? json.data.seri : [];
  return allSeri.filter(
    (s: any) =>
      s.lembaga === "IYORA" ||
      s.jenis === "olympiad" ||
      (typeof s.situs === "string" && s.situs.toLowerCase().includes("iyora.or.id"))
  );
}

export async function fetchCompetitionsData(): Promise<CompetitionData[]> {
  const dashboardUrl =
    process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://dashboard.iyora.or.id";

  // 1. Ambil dari Endpoint Public API v1 Dashboard (/api/public/v1/_seri + detail seksi)
  try {
    const iyoraSeri = await fetchDashboardV1IyoraSeries(dashboardUrl);
    if (iyoraSeri.length > 0) {
      const defaultsBySlug = new Map(
        DEFAULT_COMPETITIONS.map((d) => [d.slug.toLowerCase(), d])
      );

      const enriched: CompetitionData[] = await Promise.all(
        iyoraSeri.map(async (s: any): Promise<CompetitionData> => {
          const slug = String(s.akronim || s.slug || "")
            .toLowerCase()
            .replace(/-\d{4}$/, "")
            .trim();
          const shortName = String(s.akronim || slug).toUpperCase();
          const cleanName = String(s.nama || shortName).replace(/\s+\d{4}$/, "").trim();
          const def = defaultsBySlug.get(slug);
          const override = MANUAL_COMPETITION_OVERRIDES[slug];

          let resolvedLevel: CompetitionData["level"] = "national";
          if (slug === "os2mn") {
            resolvedLevel = "madrasah";
          } else if (slug === "wso") {
            resolvedLevel = "world";
          } else if (s.lingkup === "international" || slug.startsWith("i") || slug.endsWith("iso") || slug === "gyso") {
            resolvedLevel = "international";
          }

          let detailGuidebookUrl: string | null = null;
          let timelineMilestones: CompetitionTimelineMilestone[] = [];
          try {
            const detailRes = await fetch(
              `${dashboardUrl}/api/public/v1/${encodeURIComponent(shortName)}?sections=timeline,jadwal_kegiatan,guidebook`,
              {
                headers: DASHBOARD_ORG_HEADERS,
                cache: "no-store",
                signal: AbortSignal.timeout(6000),
              }
            );
            if (detailRes.ok) {
              const detailJson = await detailRes.json();
              const sections: any[] = detailJson?.data?.sections || [];
              const gbSec = sections.find((sec) => sec.key === "guidebook")?.isi;
              if (gbSec?.url) {
                detailGuidebookUrl = gbSec.url;
              } else if (Array.isArray(gbSec?.berkas)) {
                const gbFile = gbSec.berkas.find(
                  (b: any) =>
                    b.jenis === "guidebook" ||
                    (typeof b.url === "string" && b.url.toLowerCase().endsWith(".pdf"))
                );
                if (gbFile?.url) detailGuidebookUrl = gbFile.url;
              }

              const tlSec = sections.find((sec) => sec.key === "timeline")?.isi;
              const jkSec = sections.find((sec) => sec.key === "jadwal_kegiatan")?.isi;
              if (Array.isArray(tlSec) && tlSec.length > 0) {
                timelineMilestones = tlSec;
              } else if (Array.isArray(jkSec) && jkSec.length > 0) {
                timelineMilestones = jkSec;
              }
            }
          } catch {
            // Abaikan jika detail seksi gagal
          }

          if (!detailGuidebookUrl && (s.panduan || s.guidebook || s.guidebook_url)) {
            detailGuidebookUrl = s.panduan || s.guidebook || s.guidebook_url;
          }

          const websiteUrl = getValidEventWebsiteUrl(slug, s.situs || def?.websiteUrl);
          const registrationUrl = getValidEventRegistrationUrl(
            slug,
            override?.registrationUrl || s.pendaftaran_url || def?.registrationUrl,
            websiteUrl
          );
          const guidebookUrl =
            detailGuidebookUrl || override?.guidebookUrl || def?.guidebookUrl || null;
          const openAt =
            override?.openAt || s.pendaftaran_buka || def?.registrationOpenAt || null;
          const closeAt =
            override?.closeAt || s.pendaftaran_tutup || def?.registrationCloseAt || null;

          /*
           * Sakelar Pendaftaran dasbor yang memutuskan "dibuka". Tanggal hanya
           * membedakan "segera" dan "ditutup" saat sakelarnya mati.
           */
          const akhirHari = (v: string) => { const d = new Date(v); if (v.length <= 10) d.setHours(23, 59, 59, 999); return d; };
          const kini = new Date();
          let registrationStatus: RegistrationStatus;
          if (override?.status) {
            registrationStatus = override.status;
          } else if (s.pendaftaran_dibuka === true) {
            registrationStatus = "open";
          } else if (openAt && kini < new Date(openAt)) {
            registrationStatus = "coming_soon";
          } else if (closeAt && kini > akhirHari(closeAt)) {
            registrationStatus = "closed";
          } else if (openAt || closeAt) {
            registrationStatus = "coming_soon";
          } else {
            registrationStatus = def?.registrationStatus || "coming_soon";
          }

          const media = resolveEventMedia(slug, s.banner, s.logo, guidebookUrl);

          return {
            slug,
            shortName,
            name: cleanName,
            level: resolvedLevel,
            category: def?.category || inferCategoryFromAcronym(shortName, cleanName),
            websiteUrl,
            registrationUrl,
            registrationStatus,
            guidebookUrl,
            registrationOpenAt: openAt,
            registrationCloseAt: closeAt,
            eventStartAt: s.mulai || null,
            eventEndAt: s.selesai || null,
            bannerUrl: media.bannerUrl,
            heroUrl: media.bannerUrl,
            logoUrl: media.logoUrl,
            edition: s.slug || null,
            year: Number(s.tahun) || null,
            timeline: timelineMilestones,
          } satisfies CompetitionData;
        })
      );

      // Pastikan kompetisi default yang belum ada di _seri tetap disertakan
      const existingSlugs = new Set(enriched.map((c) => c.slug.toLowerCase()));
      for (const def of DEFAULT_COMPETITIONS) {
        if (!existingSlugs.has(def.slug.toLowerCase())) {
          enriched.push(def);
        }
      }

      return sortCompetitionsByStatus(enriched);
    }
  } catch (err) {
    console.warn("[Dashboard v1 API] Competitions fetch failed, trying legacy/fallbacks:", err);
  }

  // 2. Fallback Legacy Endpoint (/api/public/competitions)
  try {
    const res = await fetch(`${dashboardUrl}/api/public/competitions`, {
      headers: DASHBOARD_ORG_HEADERS,
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.ok && Array.isArray(json.data) && json.data.length > 0) {
        return sortCompetitionsByStatus(json.data.map((c: any) => {
          let resolvedLevel: CompetitionData["level"] = "national";
          const rawLevel = c.level;
          if (rawLevel === "international" || rawLevel === "madrasah" || rawLevel === "world") {
            resolvedLevel = rawLevel;
          } else if (c.slug === "os2mn") {
            resolvedLevel = "madrasah";
          } else if (c.slug === "wso") {
            resolvedLevel = "world";
          } else if (c.slug?.startsWith("i")) {
            resolvedLevel = "international";
          }

          const override = MANUAL_COMPETITION_OVERRIDES[c.slug?.toLowerCase() || ""];
          const websiteUrl = getValidEventWebsiteUrl(c.slug, c.websiteUrl || c.website_url);
          const registrationUrl = getValidEventRegistrationUrl(c.slug, override?.registrationUrl || c.registrationUrl || c.registration_url, websiteUrl);
          const guidebookUrl = override?.guidebookUrl || c.guidebookUrl || c.guidebook_url || null;
          const openAt = override?.openAt || c.registrationOpenAt || c.registration_open_at || null;
          const closeAt = override?.closeAt || c.registrationCloseAt || c.registration_close_at || null;

          const rawBanner =
            c.bannerUrl ||
            c.banner_url ||
            c.heroUrl ||
            c.hero_url ||
            c.heroImageUrl ||
            c.hero_image_url ||
            c.banner ||
            c.hero ||
            c.coverUrl ||
            c.cover_url ||
            null;
          const rawLogo =
            c.logoUrl ||
            c.logo_url ||
            c.logo ||
            c.iconUrl ||
            c.icon_url ||
            null;

          const media = resolveEventMedia(c.slug, rawBanner, rawLogo, guidebookUrl);

          return {
            slug: c.slug,
            shortName: c.shortName || c.short_name,
            name: c.name,
            level: resolvedLevel,
            category: c.category || null,
            websiteUrl,
            registrationUrl,
            registrationStatus: (override?.status || (override ? computeStatus(openAt, closeAt) : (c.registrationStatus || computeStatus(openAt, closeAt)))) as RegistrationStatus,
            guidebookUrl,
            registrationOpenAt: openAt,
            registrationCloseAt: closeAt,
            bannerUrl: media.bannerUrl,
            heroUrl: media.bannerUrl,
            logoUrl: media.logoUrl,
            edition: c.edition ?? null,
            year: c.year ?? null,
          };
        }));
      }
    }
  } catch (err) {
    console.warn("[Dashboard API] Fetch failed or timed out, falling back to Supabase/defaults:", err);
  }

  // 2. Fallback: Ambil langsung dari Supabase Client (Tabel competitions + events + guidebooks)
  try {
    const supabase = createSupabase();

    const { data: comps, error } = await supabase
      .from("competitions")
      .select("slug, short_name, name, level, category, website_url, active_edition_id, is_active")
      .eq("is_active", true)
      .order("level")
      .order("name");

    if (!error && comps && comps.length > 0) {
      const editionIds = comps
        .map((c: { active_edition_id: string | null }) => c.active_edition_id)
        .filter(Boolean) as string[];

      const [eventsRes, guidebooksRes] = await Promise.all([
        editionIds.length > 0
          ? supabase
              .from("events")
              .select("id, level, category, is_active, registration_open_at, registration_close_at")
              .in("id", editionIds)
          : Promise.resolve({ data: [] as any[] }),
        editionIds.length > 0
          ? supabase
              .from("guidebooks")
              .select("event_id, file_url, is_current")
              .in("event_id", editionIds)
              .order("created_at", { ascending: false })
          : Promise.resolve({ data: [] as any[] }),
      ]);

      const events = eventsRes.data ?? [];
      const guidebooks = guidebooksRes.data ?? [];

      const result: CompetitionData[] = comps.map((comp: any) => {
        const event = events.find((e: any) => e.id === comp.active_edition_id);
        const guidebook = guidebooks.find(
          (g: any) => g.event_id === comp.active_edition_id && (g.is_current === true || g.is_current == null)
        ) || guidebooks.find((g: any) => g.event_id === comp.active_edition_id);

        let resolvedLevel: CompetitionData["level"] = "national";
        const rawLevel = comp.level || event?.level;
        if (rawLevel === "international" || rawLevel === "madrasah" || rawLevel === "world") {
          resolvedLevel = rawLevel;
        } else if (comp.slug === "os2mn") {
          resolvedLevel = "madrasah";
        } else if (comp.slug === "wso") {
          resolvedLevel = "world";
        } else if (comp.slug?.startsWith("i")) {
          resolvedLevel = "international";
        }

        const override = MANUAL_COMPETITION_OVERRIDES[comp.slug?.toLowerCase() || ""];
        const rawCat = comp.category || event?.category;
        const category = Array.isArray(rawCat) ? (rawCat[0] ?? null) : (rawCat ?? null);
        const isEventActive = event?.is_active ?? comp.is_active ?? true;
        const openAt = override?.openAt ?? event?.registration_open_at ?? null;
        const closeAt = override?.closeAt ?? event?.registration_close_at ?? null;
        const status = override?.status
          ? override.status
          : override
            ? computeStatus(openAt, closeAt)
            : isEventActive
              ? computeStatus(openAt, closeAt)
              : "closed";

        const websiteUrl = getValidEventWebsiteUrl(comp.slug, comp.website_url);
        const registrationUrl = getValidEventRegistrationUrl(comp.slug, override?.registrationUrl || comp.registration_url, websiteUrl);

        const rawBanner =
          comp.banner_url ||
          comp.bannerUrl ||
          comp.hero_url ||
          comp.heroUrl ||
          comp.hero_image_url ||
          event?.banner_url ||
          event?.hero_url ||
          null;
        const rawLogo =
          comp.logo_url ||
          comp.logoUrl ||
          event?.logo_url ||
          null;

        const guidebookUrl = override?.guidebookUrl ?? guidebook?.file_url ?? null;
        const media = resolveEventMedia(comp.slug, rawBanner, rawLogo, guidebookUrl);

        return {
          slug: comp.slug,
          shortName: comp.short_name,
          name: comp.name,
          level: resolvedLevel,
          category,
          websiteUrl,
          registrationUrl,
          registrationStatus: status,
          guidebookUrl,
          registrationOpenAt: openAt,
          registrationCloseAt: closeAt,
          bannerUrl: media.bannerUrl,
          heroUrl: media.bannerUrl,
          logoUrl: media.logoUrl,
        };
      });

      if (result.length > 0) {
        return sortCompetitionsByStatus(result);
      }
    }

    return sortCompetitionsByStatus(DEFAULT_COMPETITIONS);
  } catch {
    return sortCompetitionsByStatus(DEFAULT_COMPETITIONS);
  }
}


/* ───────────────────────────────────────────────
   NEWS / BERITA
   ─────────────────────────────────────────────── */

export type NewsCategory = "news" | "announcement" | "press_release" | "documentation" | "gallery";

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  photos?: string[] | null;
  category: NewsCategory;
  published_at: string | null;
  created_at: string;
  external_link?: string | null;
  external_link_label?: string | null;
  external_link2?: string | null;
  external_link2_label?: string | null;
  external_link3?: string | null;
  external_link3_label?: string | null;
  external_link4?: string | null;
  external_link4_label?: string | null;
  external_link5?: string | null;
  external_link5_label?: string | null;
  author?: string | null;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  photos?: string[] | null;
  category: string | null;
  created_at: string;
  slug?: string;
  excerpt?: string | null;
  content?: string | null;
  cover_image?: string | null;
  published_at?: string | null;
  external_link?: string | null;
  external_link_label?: string | null;
  author?: string | null;
}

export function mapRawToNewsArticle(row: any, isEn: boolean = false): NewsArticle {
  return {
    id: String(row.id),
    title: (isEn && (row.title_en || row.judul_en)) ? (row.title_en || row.judul_en) : (row.title || row.judul || ""),
    slug: row.slug || String(row.id),
    excerpt: (isEn && (row.caption_en || row.excerpt_en || row.summary_en))
      ? (row.caption_en || row.excerpt_en || row.summary_en)
      : (row.excerpt || row.caption || row.summary || row.ringkasan || null),
    content: (isEn && (row.content_en || row.body_en || row.isi_en))
      ? (row.content_en || row.body_en || row.isi_en)
      : (row.content || row.body || row.isi || null),
    cover_image: row.cover_image || row.image_url || row.photo || row.thumbnail_url || row.cover || null,
    photos: Array.isArray(row.photos) ? row.photos : (Array.isArray(row.gallery_images) ? row.gallery_images : null),
    category: (row.category || row.kategori || "news") as NewsCategory,
    published_at: row.published_at || row.publish_date || row.tanggal_terbit || row.created_at || null,
    created_at: row.created_at || row.published_at || new Date().toISOString(),
    external_link: row.external_link || row.link || row.url || null,
    external_link_label: (isEn && (row.external_link_label_en || row.linkLabel_en || row.link_label_en))
      ? (row.external_link_label_en || row.linkLabel_en || row.link_label_en)
      : (row.external_link_label || row.linkLabel || row.link_label || null),
    external_link2: row.external_link2 || row.link2 || null,
    external_link2_label: (isEn && (row.external_link2_label_en || row.link2Label_en))
      ? (row.external_link2_label_en || row.link2Label_en)
      : (row.external_link2_label || row.link2Label || null),
    external_link3: row.external_link3 || row.link3 || null,
    external_link3_label: (isEn && (row.external_link3_label_en || row.link3Label_en))
      ? (row.external_link3_label_en || row.link3Label_en)
      : (row.external_link3_label || row.link3Label || null),
    external_link4: row.external_link4 || row.link4 || null,
    external_link4_label: (isEn && (row.external_link4_label_en || row.link4Label_en))
      ? (row.external_link4_label_en || row.link4Label_en)
      : (row.external_link4_label || row.link4Label || null),
    external_link5: row.external_link5 || row.link5 || null,
    external_link5_label: (isEn && (row.external_link5_label_en || row.link5Label_en))
      ? (row.external_link5_label_en || row.link5Label_en)
      : (row.external_link5_label || row.link5Label || null),
    author: row.author || row.penulis || "IyoraOlympiade",
  };
}

export function mapRawToGalleryItem(row: any, isEn: boolean = false): GalleryItem {
  return {
    id: String(row.id),
    title: (isEn && (row.title_en || row.judul_en)) ? (row.title_en || row.judul_en) : (row.title || row.judul || ""),
    slug: row.slug || String(row.id),
    description: (isEn && (row.caption_en || row.description_en))
      ? (row.caption_en || row.description_en)
      : (row.description || row.caption || row.excerpt || null),
    excerpt: (isEn && (row.caption_en || row.excerpt_en))
      ? (row.caption_en || row.excerpt_en)
      : (row.excerpt || row.description || row.caption || null),
    content: (isEn && (row.content_en || row.body_en))
      ? (row.content_en || row.body_en)
      : (row.content || row.description || null),
    image_url: row.image_url || row.cover_image || row.photo || "",
    cover_image: row.cover_image || row.image_url || row.photo || null,
    photos: Array.isArray(row.photos) ? row.photos : (Array.isArray(row.gallery_images) ? row.gallery_images : null),
    category: row.category || "gallery",
    created_at: row.created_at || row.published_at || new Date().toISOString(),
    published_at: row.published_at || row.created_at || null,
    external_link: row.external_link || row.link || null,
    external_link_label: (isEn && (row.external_link_label_en || row.linkLabel_en))
      ? (row.external_link_label_en || row.linkLabel_en)
      : (row.external_link_label || row.linkLabel || null),
    author: row.author || row.penulis || "IyoraOlympiade",
  };
}

export async function fetchNewsByCategory(
  category: NewsCategory,
  locale?: string
): Promise<NewsArticle[]> {
  const isEn = locale === "en";
  const dashboardUrl =
    process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://dashboard.iyora.or.id";

  const dummyCategoryItems = getDummyNewsByCategory(category as any, locale) as NewsArticle[];

  // 1. Coba ambil dari Dashboard API
  try {
    const res = await fetch(`${dashboardUrl}/api/public/news?category=${category}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        const items = json.data.map((row: any) => mapRawToNewsArticle(row, isEn));
        if (category === "gallery") {
          const existing = new Set(items.map((i: NewsArticle) => (i.slug ? i.slug.toLowerCase() : String(i.id))));
          const extra = dummyCategoryItems.filter((d) => !existing.has(d.slug?.toLowerCase() || "") && !existing.has(String(d.id)));
          return [...items, ...extra];
        }
        return items;
      }
    }
  } catch {
    // Lanjut ke Supabase client
  }

  // 2. Query langsung ke Supabase
  try {
    const supabase = createSupabase();
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("category", category)
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (!error && data && data.length > 0) {
      const items = data.map((row: any) => mapRawToNewsArticle(row, isEn));
      if (category === "gallery") {
        const existing = new Set(items.map((i: NewsArticle) => (i.slug ? i.slug.toLowerCase() : String(i.id))));
        const extra = dummyCategoryItems.filter((d) => !existing.has(d.slug?.toLowerCase() || "") && !existing.has(String(d.id)));
        return [...items, ...extra];
      }
      return items;
    }
  } catch {
    // Fallback ke dummy
  }

  // 3. Fallback ke Dummy News
  return dummyCategoryItems;
}

export async function fetchNewsBySlug(
  slug: string,
  locale?: string
): Promise<NewsArticle | null> {
  const isEn = locale === "en";
  const dashboardUrl =
    process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://dashboard.iyora.or.id";

  // 1. Coba ambil dari Dashboard API
  try {
    const res = await fetch(`${dashboardUrl}/api/public/news/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        return mapRawToNewsArticle(json.data, isEn);
      }
    }
  } catch {
    // Lanjut ke Supabase client
  }

  // 2. Query ke Supabase table news
  try {
    const supabase = createSupabase();
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (data) {
      return mapRawToNewsArticle(data, isEn);
    }

    // Coba cari berdasarkan ID jika slug berupa UUID/ID
    const { data: idData } = await supabase
      .from("news")
      .select("*")
      .eq("id", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (idData) return mapRawToNewsArticle(idData, isEn);
  } catch {
    // Fallback ke dummy
  }

  // 3. Fallback ke Dummy News
  const dummyItem = getDummyNewsBySlug(slug, locale);
  if (dummyItem) {
    return dummyItem as NewsArticle;
  }

  return null;
}

function mergeGalleryWithDummy(primary: GalleryItem[], dummy: GalleryItem[]): GalleryItem[] {
  const existingSlugsAndIds = new Set<string>();
  for (const item of primary) {
    if (item.slug) existingSlugsAndIds.add(item.slug.toLowerCase().trim());
    if (item.id) existingSlugsAndIds.add(String(item.id).toLowerCase().trim());
  }
  const additional = dummy.filter((item) => {
    const slugKey = item.slug ? item.slug.toLowerCase().trim() : "";
    const idKey = String(item.id).toLowerCase().trim();
    return (!slugKey || !existingSlugsAndIds.has(slugKey)) && !existingSlugsAndIds.has(idKey);
  });
  return [...primary, ...additional];
}

export async function fetchAllNews(locale?: string): Promise<{
  news: NewsArticle[];
  announcements: NewsArticle[];
  pressRelease: NewsArticle[];
  documentation: NewsArticle[];
  gallery: GalleryItem[];
}> {
  const isEn = locale === "en";
  const dashboardUrl =
    process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://dashboard.iyora.or.id";

  const dummyAll = getDummyNews(locale);
  const dummyNews = dummyAll.filter((a) => a.category === "news") as NewsArticle[];
  const dummyAnnouncements = dummyAll.filter((a) => a.category === "announcement") as NewsArticle[];
  const dummyPressRelease = dummyAll.filter((a) => a.category === "press_release") as NewsArticle[];
  const dummyGallery: GalleryItem[] = dummyAll
    .filter((a) => a.category === "gallery")
    .map((a) => ({
      id: a.id,
      title: a.title,
      description: a.excerpt,
      image_url: a.cover_image || "",
      photos: a.photos,
      category: "gallery",
      created_at: a.created_at,
      slug: a.slug,
      excerpt: a.excerpt,
      content: a.content,
      cover_image: a.cover_image,
      published_at: a.published_at,
      external_link: a.external_link,
      external_link_label: a.external_link_label,
      author: a.author,
    }));

  // 1. Coba ambil dari Dashboard Public API
  try {
    const [newsRes, galleryRes] = await Promise.all([
      fetch(`${dashboardUrl}/api/public/news`, { next: { revalidate: 60 } }),
      fetch(`${dashboardUrl}/api/public/gallery`, { next: { revalidate: 60 } }),
    ]);

    if (newsRes.ok) {
      const newsJson = await newsRes.json();
      if (Array.isArray(newsJson.data) && newsJson.data.length > 0) {
        const allArticles: NewsArticle[] = newsJson.data.map((row: any) => mapRawToNewsArticle(row, isEn));
        let galleryItems: GalleryItem[] = [];

        if (galleryRes.ok) {
          const galleryJson = await galleryRes.json();
          if (Array.isArray(galleryJson.data) && galleryJson.data.length > 0) {
            galleryItems = galleryJson.data.map((row: any) => mapRawToGalleryItem(row, isEn));
          }
        }

        const apiNews = allArticles.filter((a: NewsArticle) => a.category === "news");
        const apiAnnounce = allArticles.filter((a: NewsArticle) => a.category === "announcement");
        const apiPress = allArticles.filter((a: NewsArticle) => a.category === "press_release");
        const apiGallery = galleryItems.length > 0 ? galleryItems : allArticles.filter((a: NewsArticle) => a.category === "gallery").map((a: NewsArticle) => ({
          id: a.id,
          title: a.title,
          description: a.excerpt,
          image_url: a.cover_image || "",
          photos: a.photos,
          category: "gallery",
          created_at: a.created_at,
          slug: a.slug,
          excerpt: a.excerpt,
          content: a.content,
          cover_image: a.cover_image,
          published_at: a.published_at,
          external_link: a.external_link,
          external_link_label: a.external_link_label,
          author: a.author,
        }));

        return {
          news: apiNews.length > 0 ? apiNews : dummyNews,
          announcements: apiAnnounce.length > 0 ? apiAnnounce : dummyAnnouncements,
          pressRelease: apiPress.length > 0 ? apiPress : dummyPressRelease,
          documentation: allArticles.filter((a: NewsArticle) => a.category === "documentation"),
          gallery: mergeGalleryWithDummy(apiGallery, dummyGallery),
        };
      }
    }
  } catch {
    // Fallback ke Supabase langsung
  }

  // 2. Query langsung ke tabel Supabase
  try {
    const supabase = createSupabase();

    const [newsRes, galleryRes] = await Promise.all([
      supabase
        .from("news")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false }),
      supabase
        .from("gallery")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false }),
    ]);

    const rawNews = (newsRes.data as any[]) ?? [];
    const rawGallery = (galleryRes.data as any[]) ?? [];

    const articles: NewsArticle[] = rawNews.map((r: any) => mapRawToNewsArticle(r, isEn));
    const galleryItems: GalleryItem[] = rawGallery.map((g: any) => mapRawToGalleryItem(g, isEn));

    const dbNews = articles.filter((a: NewsArticle) => a.category === "news");
    const dbAnnounce = articles.filter((a: NewsArticle) => a.category === "announcement");
    const dbPress = articles.filter((a: NewsArticle) => a.category === "press_release");
    const dbGallery = galleryItems.length > 0 ? galleryItems : articles.filter((a: NewsArticle) => a.category === "gallery").map((a: NewsArticle) => ({
      id: a.id,
      title: a.title,
      description: a.excerpt,
      image_url: a.cover_image || "",
      photos: a.photos,
      category: "gallery",
      created_at: a.created_at,
      slug: a.slug,
      excerpt: a.excerpt,
      content: a.content,
      cover_image: a.cover_image,
      published_at: a.published_at,
      external_link: a.external_link,
      author: a.author,
    }));

    return {
      news: dbNews.length > 0 ? dbNews : dummyNews,
      announcements: dbAnnounce.length > 0 ? dbAnnounce : dummyAnnouncements,
      pressRelease: dbPress.length > 0 ? dbPress : dummyPressRelease,
      documentation: articles.filter((a: NewsArticle) => a.category === "documentation"),
      gallery: mergeGalleryWithDummy(dbGallery, dummyGallery),
    };
  } catch {
    return {
      news: dummyNews,
      announcements: dummyAnnouncements,
      pressRelease: dummyPressRelease,
      documentation: [],
      gallery: dummyGallery,
    };
  }
}

/* ───────────────────────────────────────────────
   NEWS PREVIEW (for Navbar mega-menu)
   ─────────────────────────────────────────────── */

export interface NewsPreviewItem {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  published_at: string | null;
  created_at: string;
}

export interface GalleryPreviewItem {
  id: string;
  title: string;
  slug?: string;
  image_url: string;
  created_at?: string;
}

export interface NewsPreviewData {
  news: NewsPreviewItem[];
  announcements: NewsPreviewItem[];
  pressRelease: NewsPreviewItem[];
  gallery: GalleryPreviewItem[];
}

export async function fetchNewsPreview(locale?: string): Promise<NewsPreviewData> {
  try {
    const all = await fetchAllNews(locale);

    return {
      news: all.news.slice(0, 3).map((item) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        cover_image: item.cover_image,
        published_at: item.published_at,
        created_at: item.created_at,
      })),
      announcements: all.announcements.slice(0, 3).map((item) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        cover_image: item.cover_image,
        published_at: item.published_at,
        created_at: item.created_at,
      })),
      pressRelease: all.pressRelease.slice(0, 3).map((item) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        cover_image: item.cover_image,
        published_at: item.published_at,
        created_at: item.created_at,
      })),
      gallery: all.gallery.slice(0, 3).map((item) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        image_url: item.image_url,
        created_at: item.created_at,
      })),
    };
  } catch {
    return { news: [], announcements: [], pressRelease: [], gallery: [] };
  }
}

/* ───────────────────────────────────────────────
   WINNERS & ANNOUNCEMENTS (Opsi 2: Published Results)
   ─────────────────────────────────────────────── */

function normalizeMedal(rawMedal: any): WinnerMedal {
  if (!rawMedal) return "Gold Medal";
  const m = String(rawMedal).trim().toLowerCase();
  // Alihkan peraih Grand Champion / Juara Umum ke Gold Medal
  if (m.includes("grand") || m.includes("juara umum") || m.includes("champion") || m.includes("overall")) {
    return "Gold Medal";
  }
  if (m.includes("emas") || m.includes("gold") || m === "1" || m === "juara 1") {
    return "Gold Medal";
  }
  if (m.includes("perak") || m.includes("silver") || m === "2" || m === "juara 2") {
    return "Silver Medal";
  }
  if (m.includes("perunggu") || m.includes("bronze") || m === "3" || m === "juara 3") {
    return "Bronze Medal";
  }
  if (m.includes("harapan") || m.includes("honorable") || m.includes("mention")) {
    return "Honorable Mention";
  }
  if (m.includes("special") || m.includes("khusus") || m.includes("award")) {
    return "Special Award";
  }
  return (rawMedal as WinnerMedal) || "Gold Medal";
}

function resolveCountryCode(country?: string, rawCode?: string): string {
  if (rawCode && rawCode.trim()) return rawCode.trim().toUpperCase();
  const c = (country || "").trim().toLowerCase();
  if (!c || c === "indonesia") return "ID";
  if (c.includes("malaysia")) return "MY";
  if (c.includes("thailand")) return "TH";
  if (c.includes("uzbekistan")) return "UZ";
  if (c.includes("korea")) return "KR";
  if (c.includes("united states") || c === "usa" || c.includes("america")) return "US";
  if (c.includes("philippines") || c.includes("filipina")) return "PH";
  if (c.includes("vietnam")) return "VN";
  if (c.includes("singapore") || c.includes("singapura")) return "SG";
  if (c.includes("mexico") || c.includes("meksiko")) return "MX";
  if (c.includes("macedonia")) return "MK";
  if (c.includes("turkey") || c.includes("türkiye") || c.includes("turki")) return "TR";
  if (c.includes("india")) return "IN";
  if (c.includes("japan") || c.includes("jepang")) return "JP";
  if (c.includes("china") || c.includes("tiongkok")) return "CN";
  return "ID";
}

function normalizeWinnerLevel(rawLevel: any): WinnerLevel {
  const l = String(rawLevel || "").trim().toLowerCase();
  if (
    l === "elementary" ||
    l === "sd" ||
    l === "mi" ||
    l.includes("elementary") ||
    l.includes("sd / mi") ||
    l.includes("primary")
  ) {
    return "SD / MI";
  }
  if (
    l === "junior_high" ||
    l === "smp" ||
    l === "mts" ||
    l.includes("junior") ||
    l.includes("smp / mts") ||
    l.includes("middle")
  ) {
    return "SMP / MTs";
  }
  if (
    l === "university" ||
    l === "universitas" ||
    l === "mahasiswa" ||
    l.includes("univ") ||
    l.includes("mahasiswa") ||
    l.includes("college")
  ) {
    return "Universitas / Mahasiswa";
  }
  return "SMA / MA / SMK";
}

function mapRawToWinnerItem(row: any): WinnerItem {
  const medal = normalizeMedal(row.medal || row.medali || row.kategori_juara || row.award || row.rank_label);
  const compCode = (row.competition || row.kompetisi || row.event_code || row.code || "").trim().toUpperCase();
  const compName = row.competition_full_name || row.competitionFullName || row.event_name || row.nama_kompetisi || compCode;

  const rawMode = (row.mode || row.moda || row.jalur || row.metode || row.participation_type || row.tipe_partisipasi || "").toLowerCase();
  const certStr = String(row.certificate_number || row.certificateNumber || row.nomor_sertifikat || row.no_sertifikat || "").toUpperCase();
  const noteStr = String(row.special_note || row.specialNote || row.special_award || row.catatan || "").toUpperCase();
  const catStr = String(row.category || row.subject || row.bidang || row.kategori || "").toUpperCase();
  const schoolStr = String(row.school || row.sekolah || row.institusi || row.institution || "").toUpperCase();

  let mode: "online" | "offline" = "online";
  if (
    rawMode === "offline" ||
    rawMode === "luring" ||
    certStr.includes("NOFF") ||
    certStr.includes("IOFF") ||
    (certStr.includes("OFF") && !certStr.includes("OFFICIAL")) ||
    noteStr.includes("OFFLINE") ||
    catStr.includes("OFFLINE") ||
    (compCode === "NSO" &&
      (schoolStr.includes("AL FAKHIR") ||
        schoolStr.includes("AL-FAKHIR") ||
        schoolStr.includes("AL HIDAYAH") ||
        schoolStr.includes("AL-HIDAYAH")))
  ) {
    mode = "offline";
  }

  const countryName = row.country || row.negara || "Indonesia";
  const countryCode = resolveCountryCode(countryName, row.country_code || row.countryCode || row.kode_negara);
  const yearNum = Number(row.edition_year || row.editionYear || row.tahun || row.year) || new Date().getFullYear();

  return {
    id: String(row.id || `${compCode}-${yearNum}-${row.team || row.name || Math.random().toString(36).substring(2, 9)}-${row.subject || row.category || ""}-${row.rank || ""}`),
    name: row.name || row.team || row.team_name || row.peserta || row.nama_peserta || row.full_name || "Peserta",
    school: row.school || row.sekolah || row.institusi || row.institution || row.asal_sekolah || "—",
    city: row.city || row.kota || row.kabupaten || "",
    province: row.province || row.provinsi || "",
    country: countryName,
    countryCode,
    competition: compCode,
    competitionFullName: compName,
    category: row.category || row.subject || row.bidang || row.kategori || "General",
    level: normalizeWinnerLevel(row.level || row.jenjang),
    editionYear: yearNum,
    editionName: row.edition_name || row.editionName || `${compCode} ${yearNum}`.trim(),
    medal,
    score: row.score !== undefined && row.score !== null ? String(row.score) : (row.nilai !== undefined && row.nilai !== null ? String(row.nilai) : undefined),
    photo: row.photo || row.foto || undefined,
    certificateNumber: row.certificate_number || row.certificateNumber || row.nomor_sertifikat || row.no_sertifikat || undefined,
    simtVerified: row.simt_verified ?? row.simtVerified ?? row.is_simt ?? true,
    specialNote: row.special_note || row.specialNote || row.special_award || row.catatan || undefined,
    mode,
  };
}

function sortWinnersByMedal(items: WinnerItem[]): WinnerItem[] {
  const getMedalPriority = (medal: WinnerMedal | string): number => {
    const m = String(medal || "").toLowerCase().trim();
    if (m.includes("grand") || m.includes("gold") || m.includes("emas") || m.includes("juara 1") || m === "1") {
      return 1;
    }
    if (m.includes("silver") || m.includes("perak") || m.includes("juara 2") || m === "2") {
      return 2;
    }
    if (m.includes("bronze") || m.includes("perunggu") || m.includes("juara 3") || m === "3") {
      return 3;
    }
    if (m.includes("harapan") || m.includes("honorable") || m.includes("mention")) {
      return 4;
    }
    if (m.includes("special") || m.includes("khusus") || m.includes("award")) {
      return 5;
    }
    return 6;
  };

  return items.sort((a, b) => {
    const pA = getMedalPriority(a.medal);
    const pB = getMedalPriority(b.medal);
    if (pA !== pB) return pA - pB;
    const scoreA = parseFloat(a.score || "0");
    const scoreB = parseFloat(b.score || "0");
    if (!isNaN(scoreA) && !isNaN(scoreB) && scoreA !== scoreB) {
      return scoreB - scoreA;
    }
    return (a.name || "").localeCompare(b.name || "");
  });
}

export async function fetchWinnersData(): Promise<WinnerItem[]> {
  const dashboardUrl =
    process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://dashboard.iyora.or.id";

  // 1. Ambil langsung dari Endpoint Public API v1 Dashboard (/api/public/v1/{AKRONIM}?sections=results)
  try {
    const iyoraSeri = await fetchDashboardV1IyoraSeries(dashboardUrl);
    if (iyoraSeri.length > 0) {
      const perSeriesWinners = await Promise.all(
        iyoraSeri.map(async (s: any) => {
          const code = String(s.akronim || "").toUpperCase();
          const fullName = String(s.nama || code).replace(/\s+\d{4}$/, "").trim();
          const editionYear = Number(s.tahun) || 2026;
          try {
            const res = await fetch(
              `${dashboardUrl}/api/public/v1/${encodeURIComponent(code)}?sections=results`,
              {
                headers: DASHBOARD_ORG_HEADERS,
                cache: "no-store",
                next: { revalidate: 0 },
                signal: AbortSignal.timeout(8000),
              }
            );
            if (!res.ok) return [] as WinnerItem[];
            const json = await res.json();
            const resSec = (json?.data?.sections || []).find((sec: any) => sec.key === "results")?.isi;
            const resultsList: any[] = Array.isArray(resSec?.results) ? resSec.results : [];
            return resultsList.map((item: any, idx: number) =>
              mapRawToWinnerItem({
                ...item,
                id: `${code}-${editionYear}-${idx}`,
                competition: code,
                competition_full_name: fullName,
                edition_year: editionYear,
                edition_name: `${code} ${editionYear}`,
              })
            );
          } catch {
            return [] as WinnerItem[];
          }
        })
      );

      const allWinners = perSeriesWinners.flat();
      if (allWinners.length > 0) {
        return sortWinnersByMedal(allWinners);
      }
    }
  } catch (err) {
    console.warn("[Dashboard v1 API] Failed fetching winners:", err);
  }

  // 2. Fallback Legacy Endpoint (/api/public/winners)
  try {
    const res = await fetch(`${dashboardUrl}/api/public/winners`, {
      headers: DASHBOARD_ORG_HEADERS,
      cache: "no-store",
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.ok && Array.isArray(json.data) && json.data.length > 0) {
        return sortWinnersByMedal(json.data.map(mapRawToWinnerItem));
      }
    }
  } catch {
    // Lanjut ke fallback Supabase jika API dashboard tidak merespons
  }

  // 2. Fallback: Ambil langsung dari Supabase Client (Tabel winners)
  try {
    const supabase = createSupabase();

    const { data, error } = await supabase
      .from("winners")
      .select("*")
      .eq("is_published", true)
      .order("edition_year", { ascending: false })
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return sortWinnersByMedal(data.map(mapRawToWinnerItem));
    }

    // 3. Fallback alternatif: cek tabel rekap_nilai jika tabel winners belum terisi
    try {
      const { data: rekapData } = await supabase
        .from("rekap_nilai")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (rekapData && rekapData.length > 0) {
        return sortWinnersByMedal(rekapData.map(mapRawToWinnerItem));
      }
    } catch {
      // Abaikan jika tabel rekap_nilai tidak ada
    }

    return [];
  } catch {
    return [];
  }
}

export async function fetchWinnerAnnouncements(): Promise<WinnerAnnouncementDoc[]> {
  const dashboardUrl =
    process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://dashboard.iyora.or.id";

  // 1. Ambil langsung dari Endpoint Public API v1 Dashboard (/api/public/v1/{AKRONIM}?sections=results,sk_pemenang,peserta)
  try {
    const iyoraSeri = await fetchDashboardV1IyoraSeries(dashboardUrl);
    if (iyoraSeri.length > 0) {
      const perSeriesDocs = await Promise.all(
        iyoraSeri.map(async (s: any) => {
          const code = String(s.akronim || "").toUpperCase();
          const fullName = String(s.nama || code).replace(/\s+\d{4}$/, "").trim();
          const editionYear = String(s.tahun || "2026");
          const category = inferCategoryFromAcronym(code, fullName) || "General";

          try {
            const res = await fetch(
              `${dashboardUrl}/api/public/v1/${encodeURIComponent(code)}?sections=results,sk_pemenang,peserta`,
              {
                headers: DASHBOARD_ORG_HEADERS,
                cache: "no-store",
                next: { revalidate: 0 },
                signal: AbortSignal.timeout(8000),
              }
            );
            if (!res.ok) return [] as WinnerAnnouncementDoc[];
            const json = await res.json();
            const sections: any[] = json?.data?.sections || [];
            const resSec = sections.find((sec) => sec.key === "results")?.isi;
            const skSec: any[] = sections.find((sec) => sec.key === "sk_pemenang")?.isi || [];
            const pesSec = sections.find((sec) => sec.key === "peserta")?.isi;

            const totalParticipants = Number(pesSec?.tim) || 0;
            const totalMedals = Array.isArray(resSec?.results) ? resSec.results.length : 0;

            const docs: WinnerAnnouncementDoc[] = [];
            const seenUrls = new Set<string>();

            const rawDocs: any[] = Array.isArray(resSec?.documents) ? resSec.documents : [];
            const skDocs = rawDocs.filter((d) => d.type === "sk" || d.type === "winner_list");

            // Prioritaskan dokumen bertipe "winner_list" dan "sk" dari results.documents
            skDocs.forEach((d, idx) => {
              const url = d.url || "#";
              if (!url || url === "#" || seenUrls.has(url)) return;
              seenUrls.add(url);

              // Cari nomor SK & tanggal dari pasangan "sk" jika ada
              const matchingSk = rawDocs.find(
                (other) => other.type === "sk" && (other.url === url || other.sk_number)
              );
              const skNumber =
                d.sk_number ||
                matchingSk?.sk_number ||
                skSec[0]?.nomor ||
                `SK/${code}/${editionYear}`;
              const publishDate =
                d.date ||
                matchingSk?.date ||
                skSec[0]?.tanggal ||
                resSec?.announced_at ||
                `${editionYear}-08-28`;

              const rawTitle = d.title || `SK Penetapan Pemenang Resmi ${code} ${editionYear}`;
              const cleanTitle = rawTitle.includes("—")
                ? rawTitle.split("—").slice(1).join("—").trim()
                : rawTitle;

              docs.push({
                id: `v1-doc-${code}-${editionYear}-${idx}`,
                competition: code,
                competitionFullName: fullName,
                title: cleanTitle,
                title_en: cleanTitle,
                edition: `Season ${editionYear}`,
                publishDate: String(publishDate).substring(0, 10),
                skNumber,
                downloadUrl: url,
                totalParticipants,
                totalMedals,
                badge: "Terbaru",
                category,
                mode: getAnnouncementMode({
                  title: rawTitle,
                  downloadUrl: url,
                  category: d.category,
                }),
              });
            });

            // Tambahkan dari sk_pemenang jika URL-nya belum ada
            if (Array.isArray(skSec)) {
              skSec.forEach((sk, idx) => {
                const url = sk.url || "#";
                if (!url || url === "#" || seenUrls.has(url)) return;
                seenUrls.add(url);

                const title = sk.perihal || `SK Penetapan Pemenang Resmi ${code} ${editionYear}`;
                docs.push({
                  id: `v1-sk-${code}-${editionYear}-${idx}`,
                  competition: code,
                  competitionFullName: fullName,
                  title,
                  title_en: title,
                  edition: `Season ${editionYear}`,
                  publishDate: sk.tanggal ? String(sk.tanggal).substring(0, 10) : `${editionYear}-08-28`,
                  skNumber: sk.nomor || `SK/${code}/${editionYear}`,
                  downloadUrl: url,
                  totalParticipants,
                  totalMedals,
                  badge: "Resmi",
                  category,
                  mode: getAnnouncementMode({
                    title,
                    downloadUrl: url,
                  }),
                });
              });
            }

            return docs;
          } catch {
            return [] as WinnerAnnouncementDoc[];
          }
        })
      );

      const allDocs = perSeriesDocs
        .flat()
        .sort((a, b) => (b.publishDate || "").localeCompare(a.publishDate || ""));

      if (allDocs.length > 0) {
        return allDocs;
      }
    }
  } catch (err) {
    console.warn("[Dashboard v1 API] Failed fetching winner announcements:", err);
  }

  // 2. Fallback Legacy Endpoint (/api/public/announcements)
  try {
    const res = await fetch(`${dashboardUrl}/api/public/announcements`, {
      headers: DASHBOARD_ORG_HEADERS,
      cache: "no-store",
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.ok && Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map((row: any) => ({
          id: String(row.id),
          competition: row.competition || row.kompetisi || "",
          competitionFullName: row.competition_full_name || row.competitionFullName || row.competition || "",
          title: row.title || row.judul || "",
          title_en: row.title_en || row.title || row.judul || "",
          edition: row.edition || row.edisi || "Season 2026",
          publishDate: row.publish_date ? String(row.publish_date).substring(0, 10) : (row.tanggal_sk ? String(row.tanggal_sk).substring(0, 10) : ""),
          skNumber: row.sk_number || row.skNumber || row.nomor_sk || "",
          downloadUrl: row.download_url || row.downloadUrl || row.file_url || "#",
          totalParticipants: Number(row.total_participants || row.totalParticipants || row.total_peserta) || 0,
          totalMedals: Number(row.total_medals || row.totalMedals || row.total_medali) || 0,
          badge: row.badge || "Resmi",
          category: row.category || row.bidang || row.kategori || "General",
          mode: getAnnouncementMode(row),
        }));
      }
    }
  } catch {
    // Fallback ke Supabase jika API dashboard tidak merespons
  }

  // 2. Fallback: Ambil langsung dari Supabase Client (Tabel winner_announcements)
  try {
    const supabase = createSupabase();

    const { data, error } = await supabase
      .from("winner_announcements")
      .select("*")
      .eq("is_published", true)
      .order("publish_date", { ascending: false });

    if (error || !data || data.length === 0) {
      return DUMMY_WINNER_ANNOUNCEMENTS;
    }

    const dbDocs: WinnerAnnouncementDoc[] = data.map((row: any) => ({
      id: row.id,
      competition: row.competition || row.kompetisi || "",
      competitionFullName: row.competition_full_name || row.competition || "",
      title: row.title || row.judul || "",
      title_en: row.title_en || row.title || row.judul || "",
      edition: row.edition || row.edisi || "Season 2026",
      publishDate: row.publish_date ? String(row.publish_date).substring(0, 10) : (row.tanggal_sk ? String(row.tanggal_sk).substring(0, 10) : ""),
      skNumber: row.sk_number || row.nomor_sk || "",
      downloadUrl: row.download_url || row.file_url || "#",
      totalParticipants: Number(row.total_participants || row.total_peserta) || 0,
      totalMedals: Number(row.total_medals || row.total_medali) || 0,
      badge: row.badge || "Resmi",
      category: row.category || row.bidang || row.kategori || "General",
      mode: getAnnouncementMode(row),
    }));

    return dbDocs.length > 0 ? dbDocs : DUMMY_WINNER_ANNOUNCEMENTS;
  } catch {
    return DUMMY_WINNER_ANNOUNCEMENTS;
  }
}

export async function fetchWinnerStats(winnersList?: WinnerItem[]) {
  try {
    const winners = winnersList || (await fetchWinnersData());

    const totalWinners = winners.length;
    const distinctComps = new Set(winners.map((w) => w.competition).filter(Boolean)).size;
    const distinctSchools = new Set(winners.map((w) => w.school).filter(Boolean)).size;
    let distinctCountries = new Set(winners.map((w) => w.countryCode || w.country).filter(Boolean)).size;

    // Perkaya data statistik agregat langsung dari dashboard jika ada
    try {
      const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://dashboard.iyora.or.id";
      const statsRes = await fetch(`${dashboardUrl}/api/public/stats`, {
        cache: "no-store",
        next: { revalidate: 0 },
        signal: AbortSignal.timeout(3000),
      });
      if (statsRes.ok) {
        const statsJson = await statsRes.json();
        if (statsJson.ok && statsJson.data && statsJson.data.countries) {
          distinctCountries = Math.max(distinctCountries, Number(statsJson.data.countries));
        }
      }
    } catch {
      // Abaikan fallback jika dashboard stats lambat
    }

    return {
      totalWinners,
      totalCompetitions: distinctComps,
      totalSchools: distinctSchools,
      totalCountries: distinctCountries,
      simtCuratedPercent: totalWinners > 0 ? 100 : 0,
    };
  } catch {
    return {
      totalWinners: 0,
      totalCompetitions: 0,
      totalSchools: 0,
      totalCountries: 0,
      simtCuratedPercent: 0,
    };
  }
}

/* ───────────────────────────────────────────────
   NEWSLETTER / WARTA IYORA
   ─────────────────────────────────────────────── */

export interface NewsletterItem {
  id: string;
  slug: string;
  title: string;
  title_en?: string;
  edition: string;
  edition_en?: string;
  description: string;
  description_en?: string;
  cover_image: string;
  file_url: string;
  published_at: string;
  created_at?: string;
  author?: string;
  pages?: number | null;
  featured?: boolean;
  tags?: string[];
  read_time?: string;
  views?: number;
}

function mapRawToNewsletter(row: any, isEn: boolean = false): NewsletterItem {
  const rawTags = row.tags || row.tag || row.categories;
  const tags = Array.isArray(rawTags)
    ? rawTags
    : typeof rawTags === "string"
      ? rawTags.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [];

  const rawTitle = row.title || row.judul || row.name || "";
  const rawTitleEn = row.title_en || row.titleEn || row.judul_en || rawTitle;

  const rawEdition = row.edition || row.edisi || row.volume || row.issue || "Edisi Terbaru";
  const rawEditionEn = row.edition_en || row.editionEn || row.edisi_en || rawEdition;

  const rawDesc = row.description || row.deskripsi || row.summary || row.ringkasan || row.excerpt || "";
  const rawDescEn = row.description_en || row.descriptionEn || row.deskripsi_en || rawDesc;

  const rawCover =
    row.cover_image ||
    row.coverImage ||
    row.cover_url ||
    row.coverUrl ||
    row.cover ||
    row.image_url ||
    row.imageUrl ||
    row.image ||
    row.thumbnail ||
    row.thumbnail_url ||
    "/images/galeri/press.jpeg";

  const rawFileUrl =
    row.file_url ||
    row.fileUrl ||
    row.pdf_url ||
    row.pdfUrl ||
    row.download_url ||
    row.downloadUrl ||
    row.file ||
    row.document_url ||
    row.url ||
    "#";

  const rawPublishedAt =
    row.published_at ||
    row.publishedAt ||
    row.publish_date ||
    row.publishDate ||
    row.tanggal_terbit ||
    row.release_date ||
    row.created_at ||
    new Date().toISOString();

  return {
    id: String(row.id || row._id || row.slug || "newsletter"),
    slug: row.slug || String(row.id || "newsletter"),
    title: isEn && rawTitleEn ? rawTitleEn : rawTitle,
    title_en: rawTitleEn,
    edition: isEn && rawEditionEn ? rawEditionEn : rawEdition,
    edition_en: rawEditionEn,
    description: isEn && rawDescEn ? rawDescEn : rawDesc,
    description_en: rawDescEn,
    cover_image: rawCover,
    file_url: rawFileUrl,
    published_at: rawPublishedAt,
    created_at: row.created_at || rawPublishedAt,
    author: row.author || row.penulis || row.creator || "Redaksi IYORA Bulletin",
    pages: Number(row.pages || row.jumlah_halaman || row.page_count || row.totalPages) || null,
    featured: Boolean(row.featured ?? row.is_featured ?? row.isFeatured ?? false),
    tags,
    read_time: row.read_time || row.readTime || row.estimasi_baca || "5 min read",
    views: Number(row.views || row.view_count || row.viewCount || row.readers) || 1200,
  };
}

/**
 * Newsletter IYORA (2026-11-17): terbitan asli saja, tanpa data contoh.
 * Sumber digabung:
 *  1. Dashboard IYSA `GET /api/public/v1/_newsletter?lembaga=IYORA` — hanya baris
 *     yang lembaganya IYORA (filter API ikut memuat baris tanpa lembaga = IYSA).
 *  2. Tabel `newsletters` Supabase IYORA (sumber situs/dashboard IYORA lama),
 *     kolom tanggalnya `publish_date`.
 */
export async function fetchNewslettersData(locale?: string): Promise<NewsletterItem[]> {
  const isEn = locale === "en";
  const hasil: NewsletterItem[] = [];

  const apiV1 = (process.env.IYSA_PUBLIC_API || "https://api-dashboard.iysa.or.id/api/public/v1").replace(/\/$/, "");
  try {
    const res = await fetch(`${apiV1}/_newsletter?lembaga=IYORA`, { next: { revalidate: 900 }, signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const json = await res.json();
      const items = (json?.data?.newsletter ?? []) as any[];
      for (const n of items) {
        if (String(n.lembaga ?? "").toUpperCase() !== "IYORA" || !n.pdf) continue;
        hasil.push(mapRawToNewsletter({
          id: n.id,
          slug: n.id,
          title: n.nama,
          edition: n.nomor || n.nama,
          cover_image: n.sampul || undefined,
          file_url: n.pdf,
          published_at: n.tanggal_terbit || n.periode_mulai || undefined,
          pages: n.halaman,
        }, isEn));
      }
    }
  } catch (err) {
    console.warn("[Dashboard API] Failed fetching newsletters:", err);
  }

  try {
    const supabase = createSupabase();
    const { data, error } = await supabase
      .from("newsletters")
      .select("*")
      .eq("is_published", true)
      .order("publish_date", { ascending: false });
    if (!error && Array.isArray(data)) {
      for (const row of data) {
        hasil.push(mapRawToNewsletter({ ...row, published_at: row.publish_date || row.created_at, views: row.views_count }, isEn));
      }
    } else if (error) {
      console.warn("[Supabase] Failed fetching newsletters:", error.message);
    }
  } catch (err) {
    console.warn("[Supabase] Failed fetching newsletters:", err);
  }

  const terlihat = new Set<string>();
  return hasil
    .filter((n) => {
      const k = n.title.trim().toLowerCase();
      if (!n.file_url || n.file_url === "#" || terlihat.has(k)) return false;
      terlihat.add(k);
      return true;
    })
    .sort((a, b) => String(b.published_at).localeCompare(String(a.published_at)));
}

export async function fetchNewsletterBySlug(slug: string, locale?: string): Promise<NewsletterItem | null> {
  const all = await fetchNewslettersData(locale);
  return all.find((n) => n.slug === slug || n.id === slug) ?? null;
}


/**
 * Angka untuk blok statistik beranda.
 *
 * Dihitung di dashboard, bukan di sini: sebagian datanya berasal dari CBT lama
 * IYSA yang sudah tidak punya koneksi dari situs ini, dan sebagian lagi dari
 * tabel yang tertutup RLS untuk kunci anon.
 */
export async function fetchSiteStats(): Promise<StatistikSitus> {
  try {
    const dashboardUrl =
      process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://dashboard.iyora.or.id";
    const res = await fetch(`${dashboardUrl}/api/public/stats`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) {
      const json = await res.json();
      const d = json?.data;
      // Nol berarti hitungannya gagal, bukan pencapaian nol — pakai cadangan.
      if (json?.ok && d && d.students > 0 && d.disciplines > 0) {
        return {
          disciplines: Number(d.disciplines),
          countries:   Number(d.countries),
          students:    Number(d.students),
          medals:      Number(d.medals),
        };
      }
    }
  } catch {
    // jatuh ke cadangan
  }
  return STATISTIK_CADANGAN;
}
