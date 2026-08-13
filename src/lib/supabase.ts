import { createClient } from "@supabase/supabase-js";
import { DUMMY_NEWS, getDummyNewsBySlug } from "@/data/dummyNews";

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
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function computeStatus(
  openAt: string | null,
  closeAt: string | null
): RegistrationStatus {
  if (!openAt || !closeAt) return "coming_soon";
  const now = new Date();
  if (now < new Date(openAt)) return "coming_soon";
  if (now > new Date(closeAt)) return "closed";
  return "open";
}

export const DEFAULT_COMPETITIONS: CompetitionData[] = [
  { slug: "nybo", shortName: "NYBO", name: "National Youth Biology Olympiad", level: "national", category: "Biology", websiteUrl: "https://nybo.iyora.or.id", registrationStatus: "open", guidebookUrl: null },
  { slug: "iybo", shortName: "IYBO", name: "International Youth Biology Olympiad", level: "international", category: "Biology", websiteUrl: "https://iybo.iyora.or.id", registrationStatus: "open", guidebookUrl: null },
  { slug: "nypo", shortName: "NYPO", name: "National Youth Physics Olympiad", level: "national", category: "Physics", websiteUrl: "https://nypo.iyora.or.id", registrationStatus: "open", guidebookUrl: null },
  { slug: "iypo", shortName: "IYPO", name: "International Youth Physics Olympiad", level: "international", category: "Physics", websiteUrl: "https://iypo.iyora.or.id", registrationStatus: "open", guidebookUrl: null },
  { slug: "nyco", shortName: "NYCO", name: "National Youth Chemistry Olympiad", level: "national", category: "Chemistry", websiteUrl: "https://nyco.iyora.or.id", registrationStatus: "open", guidebookUrl: null },
  { slug: "iyco", shortName: "IYCO", name: "International Youth Chemistry Olympiad", level: "international", category: "Chemistry", websiteUrl: "https://iyco.iyora.or.id", registrationStatus: "open", guidebookUrl: null },
  { slug: "nymo", shortName: "NYMO", name: "National Youth Mathematics Olympiad", level: "national", category: "Mathematics", websiteUrl: "https://nymo.iyora.or.id", registrationStatus: "open", guidebookUrl: null },
  { slug: "iymo", shortName: "IYMO", name: "International Youth Mathematics Olympiad", level: "international", category: "Mathematics", websiteUrl: "https://iymo.iyora.or.id", registrationStatus: "open", guidebookUrl: null },
  { slug: "nygo", shortName: "NYGO", name: "National Youth Geography Olympiad", level: "national", category: "Geography", websiteUrl: "https://nygo.iyora.or.id", registrationStatus: "open", guidebookUrl: null },
  { slug: "iygo", shortName: "IYGO", name: "International Youth Geography Olympiad", level: "international", category: "Geography", websiteUrl: "https://iygo.iyora.or.id", registrationStatus: "open", guidebookUrl: null },
  { slug: "nyeno", shortName: "NYEnO", name: "National Youth Environment Olympiad", level: "national", category: "Environment", websiteUrl: "https://nyeo.iyora.or.id", registrationStatus: "open", guidebookUrl: null },
  { slug: "iyeno", shortName: "IYEnO", name: "International Youth Environment Olympiad", level: "international", category: "Environment", websiteUrl: "https://iyeo.iyora.or.id", registrationStatus: "open", guidebookUrl: null },
  { slug: "nyeco", shortName: "NYEO", name: "National Youth Economics Olympiad", level: "national", category: "Economics", websiteUrl: "https://nyeo.iyora.or.id", registrationStatus: "open", guidebookUrl: null },
  { slug: "iyeco", shortName: "IYEO", name: "International Youth Economics Olympiad", level: "international", category: "Economics", websiteUrl: "https://iyeo.iyora.or.id", registrationStatus: "open", guidebookUrl: null },
  { slug: "nyao", shortName: "NYAO", name: "National Youth Astronomy Olympiad", level: "national", category: "Astronomy", websiteUrl: "https://nyao.iyora.or.id", registrationStatus: "open", guidebookUrl: null },
  { slug: "iyao", shortName: "IYAO", name: "International Youth Astronomy Olympiad", level: "international", category: "Astronomy", websiteUrl: "https://iyao.iyora.or.id", registrationStatus: "open", guidebookUrl: null },
  { slug: "os2mn", shortName: "OS2MN", name: "Olimpiade Sains Madrasah Nasional", level: "national", category: "Madrasah", websiteUrl: "https://os2mn.iyora.or.id", registrationStatus: "open", guidebookUrl: null },
  { slug: "wso", shortName: "WSO", name: "World Science Olympiad", level: "international", category: "Science", websiteUrl: "https://wso.iyora.or.id", registrationStatus: "open", guidebookUrl: null },
];

export async function fetchCompetitionsData(): Promise<CompetitionData[]> {
  try {
    const supabase = createSupabase();

    const { data: comps, error } = await supabase
      .from("competitions")
      .select("slug, short_name, name, level, category, website_url, active_edition_id")
      .eq("is_active", true)
      .order("level")
      .order("name");

    if (error || !comps || comps.length === 0) return DEFAULT_COMPETITIONS;

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

    return result.length > 0 ? result : DEFAULT_COMPETITIONS;
  } catch {
    return DEFAULT_COMPETITIONS;
  }
}

/* ───────────────────────────────────────────────
   NEWS / BERITA
   ─────────────────────────────────────────────── */

export type NewsCategory = "news" | "announcement" | "documentation" | "gallery";

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
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
  documentation: NewsArticle[];
  gallery: GalleryItem[];
}> {
  const isEn = locale === "en";
  try {
    const supabase = createSupabase();

    const [newsRes, announcementsRes, documentationRes, galleryRes] =
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

    return {
      news: (newsData.length > 0 ? newsData : defaultNews).sort((a, b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime()),
      announcements: (announcementsData.length > 0 ? announcementsData : defaultAnnouncements).sort((a, b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime()),
      documentation: documentationData,
      gallery: (formattedGalleryData.length > 0 ? formattedGalleryData : defaultGallery).sort((a, b) => new Date(b.published_at ?? b.created_at ?? 0).getTime() - new Date(a.published_at ?? a.created_at ?? 0).getTime()),
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

    return { news: defaultNews, announcements: defaultAnnouncements, documentation: [], gallery: defaultGallery };
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
  gallery: GalleryPreviewItem[];
}

export async function fetchNewsPreview(locale?: string): Promise<NewsPreviewData> {
  const isEn = locale === "en";
  try {
    const supabase = createSupabase();

    const [newsRes, announcementsRes, galleryRes] = await Promise.all([
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
        .from("gallery")
        .select("id, title, image_url, created_at")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

    const newsData = (newsRes.data as NewsPreviewItem[]) ?? [];
    const announcementsData = (announcementsRes.data as NewsPreviewItem[]) ?? [];
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

    return {
      news: newsData.length > 0 ? newsData : defaultNews,
      announcements: announcementsData.length > 0 ? announcementsData : defaultAnnouncements,
      gallery: formattedGalleryData.length > 0 ? formattedGalleryData : defaultGallery,
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

    const defaultGallery: GalleryPreviewItem[] = DUMMY_NEWS.filter((item) => item.category === "gallery").slice(0, 3).map((item) => ({
      id: item.id,
      title: (isEn && item.title_en) ? item.title_en : item.title,
      slug: item.slug,
      image_url: item.photo,
      created_at: item.publishedAt,
    }));

    return { news: defaultNews, announcements: defaultAnnouncements, gallery: defaultGallery };
  }
}
