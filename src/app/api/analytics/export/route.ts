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
      .select("role, tier, has_analytics_access, institution_type")
      .eq("id", user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "government" && !profile.has_analytics_access && profile.institution_type !== "pemerintah")) {
      return NextResponse.json({ error: "Access denied. Requires Government or Analytics Access." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const wilayah = searchParams.get("wilayah");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    // Build query for case_analytics
    let query = supabase.from("case_analytics").select("*").order("created_at", { ascending: false });
    
    if (wilayah && wilayah !== "all") {
      const safeWilayah = wilayah.replace(/[^a-zA-Z0-9\s-]/g, '');
      query = query.or(`wilayah_provinsi.ilike.%${safeWilayah}%,wilayah_kabupaten.ilike.%${safeWilayah}%`);
    }

    if (startDate) {
      query = query.gte("created_at", startDate);
    }
    
    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    query = query.eq("is_deleted", false);

    const { data, error } = await query;

    if (error) {
      console.error("[Analytics Export API] Error fetching data:", error);
      return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "No data found for the selected criteria" }, { status: 404 });
    }

    // Generate CSV
    const headers = [
      "ID Kasus",
      "Tanggal Laporan",
      "Kategori",
      "Sub Kategori",
      "Tingkat Keparahan (1-5)",
      "Tingkat Urgensi",
      "Wilayah (Kabupaten/Kota)",
      "Wilayah (Provinsi)",
      "Didampingi Advokat"
    ];

    const csvRows = [headers.join(",")];

    data.forEach((row) => {
      const values = [
        row.id,
        new Date(row.created_at).toLocaleDateString("id-ID"),
        `"${row.case_type || ""}"`,
        `"${row.sub_category || ""}"`,
        row.severity_level || "",
        `"${row.urgency_level || ""}"`,
        `"${row.wilayah_kabupaten || ""}"`,
        `"${row.wilayah_provinsi || ""}"`,
        row.has_advokat ? "Ya" : "Tidak"
      ];
      csvRows.push(values.join(","));
    });

    const csvString = csvRows.join("\n");

    const response = new NextResponse(csvString, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="KonsultanAI_Analytics_${wilayah || "Nasional"}_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });

    return response;
  } catch (error) {
    console.error("[Analytics Export API] Server error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
