import { createClient } from "@supabase/supabase-js";

export type RegistrationStatus = "open" | "coming_soon" | "closed";

export interface CompetitionLiveData {
  registrationStatus: RegistrationStatus;
  guidebookUrl: string | null;
}

export async function fetchCompetitionsLiveData(): Promise<Record<string, CompetitionLiveData>> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: comps } = await supabase
    .from("competitions")
    .select("slug, active_edition_id")
    .eq("is_active", true);

  if (!comps || comps.length === 0) return {};

  const editionIds = comps
    .map((c: { slug: string; active_edition_id: string | null }) => c.active_edition_id)
    .filter(Boolean) as string[];

  if (editionIds.length === 0) return {};

  const [{ data: events }, { data: guidebooks }] = await Promise.all([
    supabase
      .from("events")
      .select("id, registration_open_at, registration_close_at")
      .in("id", editionIds),
    supabase
      .from("guidebooks")
      .select("event_id, file_url")
      .in("event_id", editionIds)
      .order("created_at", { ascending: false }),
  ]);

  const result: Record<string, CompetitionLiveData> = {};

  for (const comp of comps) {
    const event = events?.find((e: { id: string; registration_open_at: string | null; registration_close_at: string | null }) => e.id === comp.active_edition_id);
    const guidebook = guidebooks?.find((g: { event_id: string; file_url: string }) => g.event_id === comp.active_edition_id);

    let status: RegistrationStatus = "coming_soon";
    if (event?.registration_open_at && event?.registration_close_at) {
      const now = new Date();
      if (now < new Date(event.registration_open_at)) status = "coming_soon";
      else if (now > new Date(event.registration_close_at)) status = "closed";
      else status = "open";
    }

    result[comp.slug] = {
      registrationStatus: status,
      guidebookUrl: guidebook?.file_url ?? null,
    };
  }

  return result;
}
