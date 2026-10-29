import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { winners, announcements, apiKey } = body;

    // Optional simple security token check
    const syncSecret = process.env.SYNC_SECRET_KEY;
    if (syncSecret && apiKey !== syncSecret) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized sync request" },
        { status: 401 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey || supabaseKey === "placeholder-anon-key") {
      return NextResponse.json(
        {
          ok: false,
          error: "Supabase connection is not properly configured in environment.",
        },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    let insertedWinnersCount = 0;
    let insertedAnnouncementsCount = 0;

    // 1. Sync Winners
    if (Array.isArray(winners) && winners.length > 0) {
      const rows = winners.map((w: any) => ({
        event_id: w.event_id || w.eventId || null,
        registration_id: w.registration_id || w.registrationId || null,
        name: w.name || w.peserta || w.nama_peserta || w.full_name || "",
        school: w.school || w.sekolah || w.asal_sekolah || w.institution || "—",
        city: w.city || w.kota || w.kabupaten || "",
        province: w.province || w.provinsi || "",
        country: w.country || w.negara || "Indonesia",
        country_code: (w.country_code || w.countryCode || w.kode_negara || "ID").toUpperCase(),
        competition: (w.competition || w.kompetisi || w.code || "").toUpperCase(),
        competition_full_name: w.competition_full_name || w.competitionFullName || w.nama_kompetisi || w.competition || "",
        category: w.category || w.bidang || w.kategori || "General",
        level: w.level || w.jenjang || "SMA / MA / SMK",
        edition_year: Number(w.edition_year || w.editionYear || w.tahun) || new Date().getFullYear(),
        edition_name: w.edition_name || w.editionName || "",
        medal: w.medal || w.medali || w.kategori_juara || "Gold Medal",
        score: w.score !== undefined && w.score !== null ? String(w.score) : (w.nilai ? String(w.nilai) : null),
        photo: w.photo || w.foto || null,
        certificate_number: w.certificate_number || w.certificateNumber || w.nomor_sertifikat || null,
        simt_verified: w.simt_verified ?? w.simtVerified ?? true,
        special_note: w.special_note || w.specialNote || null,
        is_published: w.is_published ?? true,
        published_at: new Date().toISOString(),
      }));

      const { data, error } = await supabase
        .from("winners")
        .upsert(rows, { onConflict: "id" })
        .select();

      if (error) {
        return NextResponse.json(
          { ok: false, error: error.message },
          { status: 500 }
        );
      }
      insertedWinnersCount = data?.length || rows.length;
    }

    // 2. Sync Winner Announcements
    if (Array.isArray(announcements) && announcements.length > 0) {
      const annRows = announcements.map((a: any) => ({
        event_id: a.event_id || a.eventId || null,
        competition: (a.competition || a.kompetisi || "").toUpperCase(),
        competition_full_name: a.competition_full_name || a.competitionFullName || a.competition || "",
        title: a.title || a.judul || "",
        title_en: a.title_en || a.title || "",
        edition: a.edition || a.edisi || "Season 2026",
        publish_date: a.publish_date || a.tanggal_sk || new Date().toISOString().substring(0, 10),
        sk_number: a.sk_number || a.nomor_sk || "",
        download_url: a.download_url || a.file_url || "#",
        total_participants: Number(a.total_participants || a.total_peserta) || 0,
        total_medals: Number(a.total_medals || a.total_medali) || 0,
        badge: a.badge || "Resmi",
        category: a.category || a.bidang || "General",
        is_published: a.is_published ?? true,
      }));

      const { data, error } = await supabase
        .from("winner_announcements")
        .upsert(annRows, { onConflict: "id" })
        .select();

      if (error) {
        return NextResponse.json(
          { ok: false, error: error.message },
          { status: 500 }
        );
      }
      insertedAnnouncementsCount = data?.length || annRows.length;
    }

    return NextResponse.json({
      ok: true,
      message: "Data successfully synchronized to IYORA website database",
      syncedWinners: insertedWinnersCount,
      syncedAnnouncements: insertedAnnouncementsCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || "https://dashboard.iyora.or.id";
    const res = await fetch(`${dashboardUrl}/api/public/winners`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `Dashboard API responded with status ${res.status}` },
        { status: 502 }
      );
    }

    const json = await res.json();
    const count = json.count || (Array.isArray(json.data) ? json.data.length : 0);

    const compBreakdown: Record<string, number> = {};
    if (Array.isArray(json.data)) {
      json.data.forEach((w: any) => {
        const c = (w.competition || w.kompetisi || "OTHER").toUpperCase();
        compBreakdown[c] = (compBreakdown[c] || 0) + 1;
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Daftar pemenang dan nilai tersinkronisasi langsung dari Dashboard",
      source: dashboardUrl,
      totalWinners: count,
      competitions: compBreakdown,
      sampleWinnersWithScore: Array.isArray(json.data)
        ? json.data.slice(0, 3).map((w: any) => ({
            name: w.name,
            competition: w.competition,
            score: w.score,
            medal: w.medal,
          }))
        : [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "Sync check error" },
      { status: 500 }
    );
  }
}
