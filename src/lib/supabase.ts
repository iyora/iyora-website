import { createClient } from "@supabase/supabase-js";
import { DUMMY_NEWS, getDummyNewsBySlug } from "@/data/dummyNews";
import {
  WinnerItem,
  WinnerMedal,
  WinnerLevel,
  WinnerAnnouncementDoc,
  DUMMY_WINNERS,
  DUMMY_WINNER_ANNOUNCEMENTS,
  WINNER_STATS,
} from "@/data/dummyWinners";

export type RegistrationStatus = "open" | "coming_soon" | "closed";

export interface CompetitionData {
  slug: string;
  shortName: string;
  name: string;
  level: "national" | "international" | "madrasah" | "world";
  category: string | null;   // first element of the DB array, or null
  websiteUrl: string | null;
  registrationStatus: RegistrationStatus;
  guidebookUrl: string | null;
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
  guidebookUrl: string | null;
  openAt: string | null;
  closeAt: string | null;
}

const RAW_DEFAULT_COMPETITIONS: RawDefaultCompetition[] = [
  { slug: "nygo", shortName: "NYGO", name: "National Youth Geography Olympiad", level: "national", category: "Geography", websiteUrl: "https://nygo.iyora.or.id", guidebookUrl: null, openAt: "2026-08-01", closeAt: "2026-08-16" },
  { slug: "iygo", shortName: "IYGO", name: "International Youth Geography Olympiad", level: "international", category: "Geography", websiteUrl: "https://iygo.iyora.or.id", guidebookUrl: null, openAt: "2026-08-01", closeAt: "2026-08-16" },
  { slug: "nyeo", shortName: "NYEO", name: "National Youth Economics Olympiad", level: "national", category: "Economics", websiteUrl: "https://nyeo.iyora.or.id", guidebookUrl: null, openAt: "2026-08-01", closeAt: "2026-08-16" },
  { slug: "iyeo", shortName: "IYEO", name: "International Youth Economics Olympiad", level: "international", category: "Economics", websiteUrl: "https://iyeo.iyora.or.id", guidebookUrl: null, openAt: "2026-08-01", closeAt: "2026-08-16" },
  { slug: "nymo", shortName: "NYMO", name: "National Youth Mathematics Olympiad", level: "national", category: "Mathematics", websiteUrl: "https://nymo.iyora.or.id", guidebookUrl: null, openAt: "2026-04-01", closeAt: "2026-05-02" },
  { slug: "iymo", shortName: "IYMO", name: "International Youth Mathematics Olympiad", level: "international", category: "Mathematics", websiteUrl: "https://iymo.iyora.or.id", guidebookUrl: null, openAt: "2026-06-01", closeAt: "2026-06-30" },
  { slug: "nybo", shortName: "NYBO", name: "National Youth Biology Olympiad", level: "national", category: "Biology", websiteUrl: "https://nybo.iyora.or.id", guidebookUrl: null, openAt: "2026-07-01", closeAt: "2026-07-31" },
  { slug: "iybo", shortName: "IYBO", name: "International Youth Biology Olympiad", level: "international", category: "Biology", websiteUrl: "https://iybo.iyora.or.id", guidebookUrl: null, openAt: "2026-07-01", closeAt: "2026-07-31" },
  { slug: "nypo", shortName: "NYPO", name: "National Youth Physics Olympiad", level: "national", category: "Physics", websiteUrl: "https://nypo.iyora.or.id", guidebookUrl: null, openAt: "2026-06-01", closeAt: "2026-06-30" },
  { slug: "iypo", shortName: "IYPO", name: "International Youth Physics Olympiad", level: "international", category: "Physics", websiteUrl: "https://iypo.iyora.or.id", guidebookUrl: null, openAt: "2026-06-01", closeAt: "2026-06-30" },
  { slug: "nyco", shortName: "NYCO", name: "National Youth Chemistry Olympiad", level: "national", category: "Chemistry", websiteUrl: "https://nyco.iyora.or.id", guidebookUrl: null, openAt: "2026-05-01", closeAt: "2026-05-31" },
  { slug: "iyco", shortName: "IYCO", name: "International Youth Chemistry Olympiad", level: "international", category: "Chemistry", websiteUrl: "https://iyco.iyora.or.id", guidebookUrl: null, openAt: "2026-05-01", closeAt: "2026-05-31" },
  { slug: "nyeno", shortName: "NYEnO", name: "National Youth Environment Olympiad", level: "national", category: "Environment", websiteUrl: "https://nyeno.iyora.or.id", guidebookUrl: null, openAt: "2026-04-01", closeAt: "2026-04-30" },
  { slug: "iyeno", shortName: "IYEnO", name: "International Youth Environment Olympiad", level: "international", category: "Environment", websiteUrl: "https://iyeno.iyora.or.id", guidebookUrl: null, openAt: "2026-04-01", closeAt: "2026-04-30" },
  { slug: "nyao", shortName: "NYAO", name: "National Youth Astronomy Olympiad", level: "national", category: "Astronomy", websiteUrl: "https://nyao.iyora.or.id", guidebookUrl: null, openAt: "2026-03-01", closeAt: "2026-03-31" },
  { slug: "iyao", shortName: "IYAO", name: "International Youth Astronomy Olympiad", level: "international", category: "Astronomy", websiteUrl: "https://iyao.iyora.or.id", guidebookUrl: null, openAt: "2026-03-01", closeAt: "2026-03-31" },
  { slug: "os2mn", shortName: "OS2MN", name: "Olimpiade Sains Madrasah Nasional", level: "national", category: "Madrasah", websiteUrl: "https://os2mn.iyora.or.id", guidebookUrl: null, openAt: "2026-02-01", closeAt: "2026-02-28" },
  { slug: "wso", shortName: "WSO", name: "World Science Olympiad", level: "international", category: "Science", websiteUrl: "https://wso.iyora.or.id", guidebookUrl: null, openAt: "2026-10-01", closeAt: "2026-11-30" },
  { slug: "nso", shortName: "NSO", name: "National Science Olympiad", level: "national", category: "Science", websiteUrl: "https://nso.iyora.or.id", guidebookUrl: null, openAt: "2026-09-28", closeAt: "2026-10-16" },
  { slug: "nsmo", shortName: "NSMO", name: "National Science and Math Olympiad", level: "national", category: "Science and Math", websiteUrl: "https://nsmo.iyora.or.id", guidebookUrl: null, openAt: "2026-10-01", closeAt: "2026-10-30" },
];

export function getDefaultCompetitions(): CompetitionData[] {
  return RAW_DEFAULT_COMPETITIONS.map((c) => ({
    slug: c.slug,
    shortName: c.shortName,
    name: c.name,
    level: c.level,
    category: c.category,
    websiteUrl: c.websiteUrl,
    registrationStatus: computeStatus(c.openAt, c.closeAt),
    guidebookUrl: c.guidebookUrl,
  }));
}

export const DEFAULT_COMPETITIONS: CompetitionData[] = getDefaultCompetitions();

export async function fetchCompetitionsData(): Promise<CompetitionData[]> {
  try {
    const supabase = createSupabase();

    const { data: comps, error } = await supabase
      .from("competitions")
      .select("slug, short_name, name, level, category, website_url, active_edition_id")
      .eq("is_active", true)
      .order("level")
      .order("name");

    if (error || !comps || comps.length === 0) return sortCompetitionsByStatus(DEFAULT_COMPETITIONS);

    const editionIds = comps
      .map((c: { active_edition_id: string | null }) => c.active_edition_id)
      .filter(Boolean) as string[];

    const [eventsRes, guidebooksRes] = await Promise.all([
      editionIds.length > 0
        ? supabase
            .from("events")
            .select("id, registration_open_at, registration_close_at")
            .in("id", editionIds)
        : Promise.resolve({ data: [] as { id: string; registration_open_at: string | null; registration_close_at: string | null }[] }),
      editionIds.length > 0
        ? supabase
            .from("guidebooks")
            .select("event_id, file_url")
            .in("event_id", editionIds)
            .order("created_at", { ascending: false })
        : Promise.resolve({ data: [] as { event_id: string; file_url: string }[] }),
    ]);

    const events = eventsRes.data ?? [];
    const guidebooks = guidebooksRes.data ?? [];

    const result = comps.map((comp: {
      slug: string;
      short_name: string;
      name: string;
      level: string | null;
      category: string | null;
      website_url: string | null;
      active_edition_id: string | null;
    }) => {
      const event = events.find((e) => e.id === comp.active_edition_id);
      const guidebook = guidebooks.find((g) => g.event_id === comp.active_edition_id);
      const rawCat = comp.category;
      const category = Array.isArray(rawCat) ? (rawCat[0] ?? null) : (rawCat ?? null);

      return {
        slug: comp.slug,
        shortName: comp.short_name,
        name: comp.name,
        level: (comp.level ?? "national") as CompetitionData["level"],
        category,
        websiteUrl: comp.website_url ?? null,
        registrationStatus: computeStatus(
          event?.registration_open_at ?? null,
          event?.registration_close_at ?? null
        ),
        guidebookUrl: guidebook?.file_url ?? null,
      };
    });

    return sortCompetitionsByStatus(result.length > 0 ? result : DEFAULT_COMPETITIONS);
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

export async function fetchNewsByCategory(
  category: NewsCategory
): Promise<NewsArticle[]> {
  try {
    const supabase = createSupabase();

    const { data, error } = await supabase
      .from("news")
      .select("id, title, slug, excerpt, content, cover_image, category, published_at, created_at")
      .eq("category", category)
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (error || !data) return [];
    return data as NewsArticle[];
  } catch {
    return [];
  }
}

export async function fetchNewsBySlug(
  slug: string,
  locale?: string
): Promise<NewsArticle | null> {
  const isEn = locale === "en";
  try {
    const supabase = createSupabase();

    const { data, error } = await supabase
      .from("news")
      .select("id, title, slug, excerpt, content, cover_image, category, published_at, created_at")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error || !data) {
      const dummy = getDummyNewsBySlug(slug);
      if (!dummy) return null;
      return {
        id: dummy.id,
        title: (isEn && dummy.title_en) ? dummy.title_en : dummy.title,
        slug: dummy.slug,
        excerpt: (isEn && dummy.caption_en) ? dummy.caption_en : dummy.caption,
        content: (isEn && dummy.content_en) ? dummy.content_en : (dummy.content ?? null),
        cover_image: dummy.photo,
        photos: dummy.photos ?? null,
        category: (dummy.category as NewsCategory) || "news",
        published_at: dummy.publishedAt,
        created_at: dummy.publishedAt,
        external_link: dummy.link,
        external_link_label: (isEn && dummy.linkLabel_en) ? dummy.linkLabel_en : (dummy.linkLabel ?? null),
        external_link2: dummy.link2 ?? null,
        external_link2_label: (isEn && dummy.link2Label_en) ? dummy.link2Label_en : (dummy.link2Label ?? null),
        external_link3: dummy.link3 ?? null,
        external_link3_label: (isEn && dummy.link3Label_en) ? dummy.link3Label_en : (dummy.link3Label ?? null),
        external_link4: dummy.link4 ?? null,
        external_link4_label: (isEn && dummy.link4Label_en) ? dummy.link4Label_en : (dummy.link4Label ?? null),
        external_link5: dummy.link5 ?? null,
        external_link5_label: (isEn && dummy.link5Label_en) ? dummy.link5Label_en : (dummy.link5Label ?? null),
        author: dummy.author ?? "IyoraOlympiade",
      };
    }
    const dummy = getDummyNewsBySlug(slug);
    return {
      ...(data as NewsArticle),
      title: isEn && dummy?.title_en ? dummy.title_en : (data as NewsArticle).title,
      excerpt: isEn && dummy?.caption_en ? dummy.caption_en : (data as NewsArticle).excerpt,
      content: isEn && dummy?.content_en ? dummy.content_en : (data as NewsArticle).content,
      photos: dummy?.photos ?? null,
      external_link: dummy?.link ?? null,
      external_link_label: (isEn && dummy?.linkLabel_en) ? dummy.linkLabel_en : (dummy?.linkLabel ?? null),
      external_link2: dummy?.link2 ?? null,
      external_link2_label: (isEn && dummy?.link2Label_en) ? dummy.link2Label_en : (dummy?.link2Label ?? null),
      external_link3: dummy?.link3 ?? null,
      external_link3_label: (isEn && dummy?.link3Label_en) ? dummy.link3Label_en : (dummy?.link3Label ?? null),
      external_link4: dummy?.link4 ?? null,
      external_link4_label: (isEn && dummy?.link4Label_en) ? dummy.link4Label_en : (dummy?.link4Label ?? null),
      external_link5: dummy?.link5 ?? null,
      external_link5_label: (isEn && dummy?.link5Label_en) ? dummy.link5Label_en : (dummy?.link5Label ?? null),
      author: dummy?.author ?? "IyoraOlympiade",
    };
  } catch {
    const dummy = getDummyNewsBySlug(slug);
    if (!dummy) return null;
    return {
      id: dummy.id,
      title: (isEn && dummy.title_en) ? dummy.title_en : dummy.title,
      slug: dummy.slug,
      excerpt: (isEn && dummy.caption_en) ? dummy.caption_en : dummy.caption,
      content: (isEn && dummy.content_en) ? dummy.content_en : (dummy.content ?? null),
      cover_image: dummy.photo,
      photos: dummy.photos ?? null,
      category: (dummy.category as NewsCategory) || "news",
      published_at: dummy.publishedAt,
      created_at: dummy.publishedAt,
      external_link: dummy.link,
      external_link_label: (isEn && dummy.linkLabel_en) ? dummy.linkLabel_en : (dummy.linkLabel ?? null),
      external_link2: dummy.link2 ?? null,
      external_link2_label: (isEn && dummy.link2Label_en) ? dummy.link2Label_en : (dummy.link2Label ?? null),
      external_link3: dummy.link3 ?? null,
      external_link3_label: (isEn && dummy.link3Label_en) ? dummy.link3Label_en : (dummy.link3Label ?? null),
      external_link4: dummy.link4 ?? null,
      external_link4_label: (isEn && dummy.link4Label_en) ? dummy.link4Label_en : (dummy.link4Label ?? null),
      external_link5: dummy.link5 ?? null,
      external_link5_label: (isEn && dummy.link5Label_en) ? dummy.link5Label_en : (dummy.link5Label ?? null),
      author: dummy.author ?? "IyoraOlympiade",
    };
  }
}

export async function fetchAllNews(locale?: string): Promise<{
  news: NewsArticle[];
  announcements: NewsArticle[];
  pressRelease: NewsArticle[];
  documentation: NewsArticle[];
  gallery: GalleryItem[];
}> {
  const isEn = locale === "en";
  try {
    const supabase = createSupabase();

    const [newsRes, announcementsRes, pressReleaseRes, documentationRes, galleryRes] =
      await Promise.all([
        supabase
          .from("news")
          .select("id, title, slug, excerpt, content, cover_image, category, published_at, created_at")
          .eq("category", "news")
          .eq("is_published", true)
          .order("published_at", { ascending: false }),
        supabase
          .from("news")
          .select("id, title, slug, excerpt, content, cover_image, category, published_at, created_at")
          .eq("category", "announcement")
          .eq("is_published", true)
          .order("published_at", { ascending: false }),
        supabase
          .from("news")
          .select("id, title, slug, excerpt, content, cover_image, category, published_at, created_at")
          .eq("category", "press_release")
          .eq("is_published", true)
          .order("published_at", { ascending: false }),
        supabase
          .from("news")
          .select("id, title, slug, excerpt, content, cover_image, category, published_at, created_at")
          .eq("category", "documentation")
          .eq("is_published", true)
          .order("published_at", { ascending: false }),
        supabase
          .from("gallery")
          .select("id, title, description, image_url, category, created_at")
          .eq("is_published", true)
          .order("created_at", { ascending: false }),
      ]);

    const newsData = (newsRes.data as NewsArticle[]) ?? [];
    const announcementsData = (announcementsRes.data as NewsArticle[]) ?? [];
    const pressReleaseData = (pressReleaseRes.data as NewsArticle[]) ?? [];
    const documentationData = (documentationRes.data as NewsArticle[]) ?? [];
    const galleryData = (galleryRes.data as GalleryItem[]) ?? [];

    const defaultNews: NewsArticle[] = DUMMY_NEWS.filter((item) => item.category === "news")
      .map((item) => ({
        id: item.id,
        title: (isEn && item.title_en) ? item.title_en : item.title,
        slug: item.slug,
        excerpt: (isEn && item.caption_en) ? item.caption_en : item.caption,
        content: (isEn && item.content_en) ? item.content_en : (item.content ?? null),
        cover_image: item.photo,
        category: "news" as const,
        published_at: item.publishedAt,
        created_at: item.publishedAt,
        external_link: item.link,
        author: item.author ?? null,
      }))
      .sort((a, b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime());

    const defaultAnnouncements: NewsArticle[] = DUMMY_NEWS.filter((item) => item.category === "announcement")
      .map((item) => ({
        id: item.id,
        title: (isEn && item.title_en) ? item.title_en : item.title,
        slug: item.slug,
        excerpt: (isEn && item.caption_en) ? item.caption_en : item.caption,
        content: (isEn && item.content_en) ? item.content_en : (item.content ?? null),
        cover_image: item.photo,
        category: "announcement" as const,
        published_at: item.publishedAt,
        created_at: item.publishedAt,
        external_link: item.link,
        author: item.author ?? null,
      }))
      .sort((a, b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime());

    const defaultPressRelease: NewsArticle[] = DUMMY_NEWS.filter((item) => item.category === "press_release")
      .map((item) => ({
        id: item.id,
        title: (isEn && item.title_en) ? item.title_en : item.title,
        slug: item.slug,
        excerpt: (isEn && item.caption_en) ? item.caption_en : item.caption,
        content: (isEn && item.content_en) ? item.content_en : (item.content ?? null),
        cover_image: item.photo,
        category: "press_release" as const,
        published_at: item.publishedAt,
        created_at: item.publishedAt,
        external_link: item.link,
        author: item.author ?? null,
      }))
      .sort((a, b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime());

    const defaultGallery: GalleryItem[] = DUMMY_NEWS.filter((item) => item.category === "gallery").map((item) => ({
      id: item.id,
      title: (isEn && item.title_en) ? item.title_en : item.title,
      slug: item.slug,
      description: (isEn && item.caption_en) ? item.caption_en : item.caption,
      excerpt: (isEn && item.caption_en) ? item.caption_en : item.caption,
      content: (isEn && item.content_en) ? item.content_en : (item.content ?? null),
      image_url: item.photo,
      cover_image: item.photo,
      photos: item.photos ?? null,
      category: "gallery",
      created_at: item.publishedAt,
      published_at: item.publishedAt,
      external_link: item.link ?? null,
      external_link_label: (isEn && item.linkLabel_en) ? item.linkLabel_en : (item.linkLabel ?? null),
      author: item.author ?? "IyoraOlympiade",
    }));

    const formattedGalleryData: GalleryItem[] = galleryData.map((item) => {
      const dummy = getDummyNewsBySlug(item.slug || item.id);
      return {
        ...item,
        title: (isEn && dummy?.title_en) ? dummy.title_en : (item.title || dummy?.title || ""),
        slug: item.slug || dummy?.slug || item.id,
        description: (isEn && dummy?.caption_en) ? dummy.caption_en : (item.description || dummy?.caption || null),
        excerpt: (isEn && dummy?.caption_en) ? dummy.caption_en : (item.description || dummy?.caption || null),
        content: (isEn && dummy?.content_en) ? dummy.content_en : (dummy?.content ?? item.description ?? null),
        cover_image: item.image_url || dummy?.photo,
        image_url: item.image_url || dummy?.photo || "",
        published_at: item.created_at || dummy?.publishedAt,
        external_link: item.external_link || dummy?.link || null,
        external_link_label: (isEn && dummy?.linkLabel_en) ? dummy.linkLabel_en : (dummy?.linkLabel ?? null),
        author: dummy?.author ?? "IyoraOlympiade",
      };
    });

    const combinedNews = [...newsData, ...defaultNews.filter((d) => !newsData.some((n) => n.id === d.id))];
    const combinedAnnouncements = [...announcementsData, ...defaultAnnouncements.filter((d) => !announcementsData.some((n) => n.id === d.id))];
    const combinedPressRelease = [...pressReleaseData, ...defaultPressRelease.filter((d) => !pressReleaseData.some((n) => n.id === d.id))];
    const combinedGallery = [...formattedGalleryData, ...defaultGallery.filter((d) => !formattedGalleryData.some((n) => n.id === d.id))];

    return {
      news: combinedNews.sort((a, b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime()),
      announcements: combinedAnnouncements.sort((a, b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime()),
      pressRelease: combinedPressRelease.sort((a, b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime()),
      documentation: documentationData,
      gallery: combinedGallery.sort((a, b) => new Date(b.published_at ?? b.created_at ?? 0).getTime() - new Date(a.published_at ?? a.created_at ?? 0).getTime()),
    };
  } catch {
    const defaultNews: NewsArticle[] = DUMMY_NEWS.filter((item) => item.category === "news")
      .map((item) => ({
        id: item.id,
        title: (isEn && item.title_en) ? item.title_en : item.title,
        slug: item.slug,
        excerpt: (isEn && item.caption_en) ? item.caption_en : item.caption,
        content: (isEn && item.content_en) ? item.content_en : (item.content ?? null),
        cover_image: item.photo,
        category: "news" as const,
        published_at: item.publishedAt,
        created_at: item.publishedAt,
        external_link: item.link,
        author: item.author ?? null,
      }))
      .sort((a, b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime());

    const defaultAnnouncements: NewsArticle[] = DUMMY_NEWS.filter((item) => item.category === "announcement")
      .map((item) => ({
        id: item.id,
        title: (isEn && item.title_en) ? item.title_en : item.title,
        slug: item.slug,
        excerpt: (isEn && item.caption_en) ? item.caption_en : item.caption,
        content: (isEn && item.content_en) ? item.content_en : (item.content ?? null),
        cover_image: item.photo,
        category: "announcement" as const,
        published_at: item.publishedAt,
        created_at: item.publishedAt,
        external_link: item.link,
        author: item.author ?? null,
      }))
      .sort((a, b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime());

    const defaultPressRelease: NewsArticle[] = DUMMY_NEWS.filter((item) => item.category === "press_release")
      .map((item) => ({
        id: item.id,
        title: (isEn && item.title_en) ? item.title_en : item.title,
        slug: item.slug,
        excerpt: (isEn && item.caption_en) ? item.caption_en : item.caption,
        content: (isEn && item.content_en) ? item.content_en : (item.content ?? null),
        cover_image: item.photo,
        category: "press_release" as const,
        published_at: item.publishedAt,
        created_at: item.publishedAt,
        external_link: item.link,
        author: item.author ?? null,
      }))
      .sort((a, b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime());

    const defaultGallery: GalleryItem[] = DUMMY_NEWS.filter((item) => item.category === "gallery").map((item) => ({
      id: item.id,
      title: (isEn && item.title_en) ? item.title_en : item.title,
      slug: item.slug,
      description: (isEn && item.caption_en) ? item.caption_en : item.caption,
      excerpt: (isEn && item.caption_en) ? item.caption_en : item.caption,
      content: (isEn && item.content_en) ? item.content_en : (item.content ?? null),
      image_url: item.photo,
      cover_image: item.photo,
      category: "gallery",
      created_at: item.publishedAt,
      published_at: item.publishedAt,
      external_link: item.link ?? null,
      external_link_label: (isEn && item.linkLabel_en) ? item.linkLabel_en : (item.linkLabel ?? null),
      author: item.author ?? "IyoraOlympiade",
    }));

    return { news: defaultNews, announcements: defaultAnnouncements, pressRelease: defaultPressRelease, documentation: [], gallery: defaultGallery };
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
  const isEn = locale === "en";
  try {
    const supabase = createSupabase();

    const [newsRes, announcementsRes, pressReleaseRes, galleryRes] = await Promise.all([
      supabase
        .from("news")
        .select("id, title, slug, cover_image, published_at, created_at")
        .eq("category", "news")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(3),
      supabase
        .from("news")
        .select("id, title, slug, cover_image, published_at, created_at")
        .eq("category", "announcement")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(3),
      supabase
        .from("news")
        .select("id, title, slug, cover_image, published_at, created_at")
        .eq("category", "press_release")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(3),
      supabase
        .from("gallery")
        .select("id, title, image_url, created_at")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

    const newsData = (newsRes.data as NewsPreviewItem[]) ?? [];
    const announcementsData = (announcementsRes.data as NewsPreviewItem[]) ?? [];
    const pressReleaseData = (pressReleaseRes.data as NewsPreviewItem[]) ?? [];
    const galleryData = (galleryRes.data as GalleryPreviewItem[]) ?? [];

    const defaultNews: NewsPreviewItem[] = DUMMY_NEWS.filter((item) => item.category === "news").slice(0, 3).map((item) => ({
      id: item.id,
      title: (isEn && item.title_en) ? item.title_en : item.title,
      slug: item.slug,
      cover_image: item.photo,
      published_at: item.publishedAt,
      created_at: item.publishedAt,
    }));

    const defaultAnnouncements: NewsPreviewItem[] = DUMMY_NEWS.filter((item) => item.category === "announcement").slice(0, 3).map((item) => ({
      id: item.id,
      title: (isEn && item.title_en) ? item.title_en : item.title,
      slug: item.slug,
      cover_image: item.photo,
      published_at: item.publishedAt,
      created_at: item.publishedAt,
    }));

    const defaultPressRelease: NewsPreviewItem[] = DUMMY_NEWS.filter((item) => item.category === "press_release").slice(0, 3).map((item) => ({
      id: item.id,
      title: (isEn && item.title_en) ? item.title_en : item.title,
      slug: item.slug,
      cover_image: item.photo,
      published_at: item.publishedAt,
      created_at: item.publishedAt,
    }));

    const defaultGallery: GalleryPreviewItem[] = DUMMY_NEWS.filter((item) => item.category === "gallery").slice(0, 3).map((item) => ({
      id: item.id,
      title: (isEn && item.title_en) ? item.title_en : item.title,
      slug: item.slug,
      image_url: item.photo,
      created_at: item.publishedAt,
    }));

    const formattedGalleryData: GalleryPreviewItem[] = galleryData.map((item) => {
      const dummy = getDummyNewsBySlug(item.slug || item.id);
      return {
        id: item.id,
        title: (isEn && dummy?.title_en) ? dummy.title_en : (item.title || dummy?.title || ""),
        slug: item.slug || dummy?.slug || item.id,
        image_url: item.image_url || dummy?.photo || "",
        created_at: item.created_at || dummy?.publishedAt,
      };
    });

    const combinedNews = [...newsData, ...defaultNews.filter((d) => !newsData.some((n) => n.id === d.id))].slice(0, 3);
    const combinedAnnouncements = [...announcementsData, ...defaultAnnouncements.filter((d) => !announcementsData.some((n) => n.id === d.id))].slice(0, 3);
    const combinedPressRelease = [...pressReleaseData, ...defaultPressRelease.filter((d) => !pressReleaseData.some((n) => n.id === d.id))].slice(0, 3);
    const combinedGallery = [...formattedGalleryData, ...defaultGallery.filter((d) => !formattedGalleryData.some((n) => n.id === d.id))].slice(0, 3);

    return {
      news: combinedNews,
      announcements: combinedAnnouncements,
      pressRelease: combinedPressRelease,
      gallery: combinedGallery,
    };
  } catch {
    const defaultNews: NewsPreviewItem[] = DUMMY_NEWS.filter((item) => item.category === "news").slice(0, 3).map((item) => ({
      id: item.id,
      title: (isEn && item.title_en) ? item.title_en : item.title,
      slug: item.slug,
      cover_image: item.photo,
      published_at: item.publishedAt,
      created_at: item.publishedAt,
    }));

    const defaultAnnouncements: NewsPreviewItem[] = DUMMY_NEWS.filter((item) => item.category === "announcement").slice(0, 3).map((item) => ({
      id: item.id,
      title: (isEn && item.title_en) ? item.title_en : item.title,
      slug: item.slug,
      cover_image: item.photo,
      published_at: item.publishedAt,
      created_at: item.publishedAt,
    }));

    const defaultPressRelease: NewsPreviewItem[] = DUMMY_NEWS.filter((item) => item.category === "press_release").slice(0, 3).map((item) => ({
      id: item.id,
      title: (isEn && item.title_en) ? item.title_en : item.title,
      slug: item.slug,
      cover_image: item.photo,
      published_at: item.publishedAt,
      created_at: item.publishedAt,
    }));

    const defaultGallery: GalleryPreviewItem[] = DUMMY_NEWS.filter((item) => item.category === "gallery").slice(0, 3).map((item) => ({
      id: item.id,
      title: (isEn && item.title_en) ? item.title_en : item.title,
      slug: item.slug,
      image_url: item.photo,
      created_at: item.publishedAt,
    }));

    return { news: defaultNews, announcements: defaultAnnouncements, pressRelease: defaultPressRelease, gallery: defaultGallery };
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

function mapRawToWinnerItem(row: any): WinnerItem {
  const medal = normalizeMedal(row.medal || row.medali || row.kategori_juara || row.award || row.rank_label);
  const compCode = (row.competition || row.kompetisi || row.event_code || row.code || "").trim().toUpperCase();
  const compName = row.competition_full_name || row.competitionFullName || row.event_name || row.nama_kompetisi || compCode;

  return {
    id: String(row.id || Math.random().toString(36).substring(2, 9)),
    name: row.name || row.team_name || row.peserta || row.nama_peserta || row.full_name || "Peserta",
    school: row.school || row.sekolah || row.institusi || row.institution || row.asal_sekolah || "—",
    city: row.city || row.kota || row.kabupaten || "",
    province: row.province || row.provinsi || "",
    country: row.country || row.negara || "Indonesia",
    countryCode: (row.country_code || row.countryCode || row.kode_negara || "ID").toUpperCase(),
    competition: compCode,
    competitionFullName: compName,
    category: row.category || row.bidang || row.kategori || "General",
    level: (row.level || row.jenjang || "SMA / MA / SMK") as any,
    editionYear: Number(row.edition_year || row.editionYear || row.tahun || row.year) || new Date().getFullYear(),
    editionName: row.edition_name || row.editionName || `${compCode} ${row.edition_year || row.tahun || new Date().getFullYear()}`.trim(),
    medal,
    score: row.score !== undefined && row.score !== null ? String(row.score) : (row.nilai !== undefined && row.nilai !== null ? String(row.nilai) : undefined),
    photo: row.photo || row.foto || undefined,
    certificateNumber: row.certificate_number || row.certificateNumber || row.nomor_sertifikat || row.no_sertifikat || undefined,
    simtVerified: row.simt_verified ?? row.simtVerified ?? row.is_simt ?? true,
    specialNote: row.special_note || row.specialNote || row.catatan || undefined,
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
  // 1. Coba ambil langsung dari Endpoint Public API Dashboard (Opsi 2: Sinkronisasi API langsung)
  try {
    const dashboardUrl =
      process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://dashboard.iyora.or.id";
    const res = await fetch(`${dashboardUrl}/api/public/winners`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(4000),
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
  // 1. Coba ambil langsung dari Endpoint Public API Dashboard
  try {
    const dashboardUrl =
      process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://dashboard.iyora.or.id";
    const res = await fetch(`${dashboardUrl}/api/public/announcements`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(4000),
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
    const distinctCountries = new Set(winners.map((w) => w.countryCode || w.country).filter(Boolean)).size;

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
