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
      // category is stored as text[] in DB — take first element
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
