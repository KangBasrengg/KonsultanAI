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
      .select("role, has_analytics_access, institution_type")
      .eq("id", user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "government" && !profile.has_analytics_access && profile.institution_type !== "pemerintah")) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const caseId = searchParams.get("case_id");

    if (!caseId) {
      return NextResponse.json({ error: "case_id is required" }, { status: 400 });
    }

    let { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", caseId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    // Fallback: if no direct messages with session_id = caseId, check consultation messages
    if (!messages || messages.length === 0) {
      const { data: caseData } = await supabase
        .from("cases")
        .select("user_id, created_at, kronologi")
        .eq("id", caseId)
        .single();

      if (caseData) {
        const minTime = new Date(new Date(caseData.created_at).getTime() - 120000).toISOString();
        const maxTime = new Date(new Date(caseData.created_at).getTime() + 1800000).toISOString();

        const { data: matchedConsultation } = await supabase
          .from("consultations")
          .select("id, chronology, ai_analysis, created_at")
          .eq("user_id", caseData.user_id)
          .gte("created_at", minTime)
          .lte("created_at", maxTime)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (matchedConsultation) {
          const { data: consultMessages } = await supabase
            .from("chat_messages")
            .select("*")
            .eq("session_id", matchedConsultation.id)
            .order("created_at", { ascending: true });

          if (consultMessages && consultMessages.length > 0) {
            messages = consultMessages;
          } else if (matchedConsultation.ai_analysis) {
            messages = [
              {
                id: `u-${matchedConsultation.id}`,
                session_id: caseId,
                user_id: caseData.user_id,
                role: "user",
                content: matchedConsultation.chronology,
                created_at: matchedConsultation.created_at
              },
              {
                id: `a-${matchedConsultation.id}`,
                session_id: caseId,
                user_id: caseData.user_id,
                role: "assistant",
                content: matchedConsultation.ai_analysis,
                created_at: matchedConsultation.created_at
              }
            ];
          }
        }
      }
    }

    return NextResponse.json({ messages: messages || [] });
  } catch (error: any) {
    console.error("[Analytics Chat API] Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
