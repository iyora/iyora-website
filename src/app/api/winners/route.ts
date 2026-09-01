import { NextResponse } from "next/server";
import { fetchWinnersData, fetchWinnerAnnouncements, fetchWinnerStats } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [winners, announcements] = await Promise.all([
      fetchWinnersData(),
      fetchWinnerAnnouncements(),
    ]);
    const stats = await fetchWinnerStats(winners);

    return NextResponse.json({
      ok: true,
      total: winners.length,
      stats,
      announcements,
      data: winners,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Failed to fetch winners",
      },
      { status: 500 }
    );
  }
}
