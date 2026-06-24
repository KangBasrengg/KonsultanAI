import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user role
    const { data: profile } = await supabase
      .from("users")
      .select("role, tier")
      .eq("id", user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "government" && profile.role !== "enterprise")) {
      return NextResponse.json({ error: "Access denied. Requires Government or Enterprise Business Tier." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const wilayah = searchParams.get("wilayah");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    // Build query for case_analytics
    let query = supabase.from("case_analytics").select("*");
    
    if (wilayah && wilayah !== "all") {
      // Allow searching by province or kabupaten and sanitize to prevent PostgREST injection
      const safeWilayah = wilayah.replace(/[^a-zA-Z0-9\s-]/g, '');
      query = query.or(`wilayah_provinsi.ilike.%${safeWilayah}%,wilayah_kabupaten.ilike.%${safeWilayah}%`);
    }

    if (startDate) {
      query = query.gte("created_at", startDate);
    }
    
    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    // Must not be deleted
    query = query.eq("is_deleted", false);

    const { data, error } = await query;

    if (error) {
      console.error("[Analytics API] Error fetching data:", error);
      return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 });
    }

    // Process data to generate metrics
    const totalCases = data.length;
    
    const caseTypeDist: Record<string, number> = {};
    const severityDist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    data.forEach((row) => {
      const type = row.case_type || "Unknown";
      caseTypeDist[type] = (caseTypeDist[type] || 0) + 1;
      
      const severity = row.severity_level || 1;
      severityDist[severity] = (severityDist[severity] || 0) + 1;
    });

    // Format distribution for charting
    const distributionArray = Object.keys(caseTypeDist).map((key) => ({
      name: key,
      value: caseTypeDist[key],
    }));

    return NextResponse.json({
      kpi: {
        total_cases: totalCases,
      },
      distribution: distributionArray,
      severity: severityDist,
      rawData: data.slice(0, 100), // Return max 100 recent cases for table view
    });

  } catch (error) {
    console.error("[Analytics API] Server error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
