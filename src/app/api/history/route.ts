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

    const { data: consultations, error } = await supabase
      .from("consultations")
      .select("id, chronology, ai_analysis, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500, headers: { "Content-Type": "application/json" } 
      });
    }

    const enrichedConsultations = await Promise.all(
      (consultations || []).map(async (item: any) => {
        if (!item.ai_analysis || item.ai_analysis.trim() === "") {
          try {
            const { data: fallbackMsg } = await supabase
              .from("chat_messages")
              .select("content")
              .eq("session_id", item.id)
              .eq("role", "assistant")
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();

            if (fallbackMsg?.content) {
              return { ...item, ai_analysis: fallbackMsg.content };
            }
          } catch (_) {}
        }
        return item;
      })
    );

    return new Response(JSON.stringify({ consultations: enrichedConsultations }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, headers: { "Content-Type": "application/json" } 
    });
  }
}
