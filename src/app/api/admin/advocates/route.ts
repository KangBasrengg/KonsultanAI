import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET: List all advocates (for admin)
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check admin
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { data: advocates } = await supabase
      .from("advocates")
      .select(`
        *,
        specializations:advocate_specializations(*),
        documents:advocate_documents(*)
      `)
      .order("created_at", { ascending: false });

    return NextResponse.json({ advocates: advocates || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: Approve/Reject advocate
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { advocateId, action, reason } = await request.json();

    if (!advocateId || !action || !["approved", "rejected"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const updateData: Record<string, string> = {
      verification_status: action,
      updated_at: new Date().toISOString(),
    };

    if (action === "rejected" && reason) {
      updateData.rejection_reason = reason;
    }

    const { error: updateErr } = await supabase
      .from("advocates")
      .update(updateData)
      .eq("id", advocateId);

    if (updateErr) throw updateErr;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
