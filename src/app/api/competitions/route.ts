import { NextResponse } from "next/server";
import { fetchCompetitionsData } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const competitions = await fetchCompetitionsData();
    return NextResponse.json({
      ok: true,
      count: competitions.length,
      data: competitions,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Failed to fetch synced competitions",
      },
      { status: 500 }
    );
  }
}
