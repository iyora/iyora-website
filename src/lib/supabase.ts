import { createClient } from "@supabase/supabase-js";

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

export async function fetchCompetitionsData(): Promise<CompetitionData[]> {
  try {
    const supabase = createSupabase();

    const { data: comps, error } = await supabase
      .from("competitions")
      .select("slug, short_name, name, level, category, website_url, active_edition_id")
      .eq("is_active", true)
      .order("level")
      .order("name");

    if (error || !comps || comps.length === 0) return [];

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

    return comps.map((comp: {
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
  } catch {
    return [];
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
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  created_at: string;
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

export async function fetchAllNews(): Promise<{
  news: NewsArticle[];
  announcements: NewsArticle[];
  documentation: NewsArticle[];
  gallery: GalleryItem[];
}> {
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

    return {
      news: (newsRes.data as NewsArticle[]) ?? [],
      announcements: (announcementsRes.data as NewsArticle[]) ?? [],
      documentation: (documentationRes.data as NewsArticle[]) ?? [],
      gallery: (galleryRes.data as GalleryItem[]) ?? [],
    };
  } catch {
    return { news: [], announcements: [], documentation: [], gallery: [] };
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
  image_url: string;
}

export interface NewsPreviewData {
  news: NewsPreviewItem[];
  announcements: NewsPreviewItem[];
  gallery: GalleryPreviewItem[];
}

export async function fetchNewsPreview(): Promise<NewsPreviewData> {
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
        .select("id, title, image_url")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(4),
    ]);

    return {
      news: (newsRes.data as NewsPreviewItem[]) ?? [],
      announcements: (announcementsRes.data as NewsPreviewItem[]) ?? [],
      gallery: (galleryRes.data as GalleryPreviewItem[]) ?? [],
    };
  } catch {
    return { news: [], announcements: [], gallery: [] };
  }
}
