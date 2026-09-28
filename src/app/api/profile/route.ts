import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401, headers: { "Content-Type": "application/json" } 
      });
    }

    const { data: profile } = await supabase
      .from("users")
      .select("email, full_name, is_premium, role, tier, created_at")
      .eq("id", user.id)
      .single();

    const { count } = await supabase
      .from("consultations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    return new Response(JSON.stringify({
      id: user.id,
      email: profile?.email || user.email,
      fullName: profile?.full_name || null,
      isPremium: profile?.is_premium || false,
      role: profile?.role || "user",
      tier: profile?.tier || "free",
      consultationCount: count || 0,
      createdAt: profile?.created_at || user.created_at,
    }), {
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, headers: { "Content-Type": "application/json" } 
    });
  }
}
