import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role, has_analytics_access, institution_type")
      .eq("id", user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "government" && !profile.has_analytics_access && profile.institution_type !== "pemerintah")) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const wilayah = searchParams.get("wilayah");

    let query = supabase.from("case_analytics").select("created_at, case_type").eq("is_deleted", false);

    if (wilayah && wilayah !== "all") {
      const safeWilayah = wilayah.replace(/[^a-zA-Z0-9\s-]/g, '');
      query = query.or(`wilayah_provinsi.ilike.%${safeWilayah}%,wilayah_kabupaten.ilike.%${safeWilayah}%`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: "Failed to fetch trends data" }, { status: 500 });
    }

    // Group by month
    const trends: Record<string, number> = {};
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Initialize last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const label = `${months[d.getMonth()]} ${d.getFullYear()}`;
      trends[label] = 0;
    }

    data.forEach((row) => {
      if (row.created_at) {
        const d = new Date(row.created_at);
        const label = `${months[d.getMonth()]} ${d.getFullYear()}`;
        if (trends[label] !== undefined) {
          trends[label] += 1;
        }
      }
    });

    const timelineArray = Object.keys(trends).map((key) => ({
      date: key,
      cases: trends[key],
    }));

    return NextResponse.json({ timeline: timelineArray });

  } catch (error) {
    console.error("[Analytics API] Trends error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
