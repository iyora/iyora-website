import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { fetchCompetitionsData } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Revalidate relevant pages
    revalidatePath("/", "layout");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/[locale]/competitions", "page");

    // Pre-fetch fresh data from dashboard
    const competitions = await fetchCompetitionsData();

    return NextResponse.json({
      ok: true,
      message: "Competitions synchronized successfully",
      count: competitions.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Failed to trigger sync",
      },
      { status: 500 }
    );
  }
}
