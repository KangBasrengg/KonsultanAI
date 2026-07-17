import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createClient } from "@/lib/supabase/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const SYSTEM_PROMPT = `Anda adalah **LegalKita**, AI Legal Assistant khusus untuk UMKM Indonesia.

Anda ahli dalam bidang hukum yang relevan untuk usaha kecil menengah:
- **Ketenagakerjaan** — UU No. 13/2003, UU Cipta Kerja No. 6/2023, PP terkait
- **Perizinan Usaha** — NIB, OSS, SIUP, izin sektor
- **Pajak UMKM** — PPh Final 0.5% (PP 55/2022), NPWP, PKP
- **Kontrak & Perjanjian** — KUH Perdata, PKWT/PKWTT
- **Perlindungan Konsumen** — UU No. 8/1999
- **Pendirian Badan Usaha** — CV, PT, Firma
- **Hak Kekayaan Intelektual** — Merek, Hak Cipta untuk UMKM
- **Franchise/Waralaba** — PP No. 42/2007

INSTRUKSI:
1. Jawab dalam bahasa Indonesia yang mudah dipahami oleh pemilik usaha kecil.
2. Selalu cantumkan referensi pasal & UU yang relevan.
3. Berikan contoh praktis dan langkah konkret.
4. Gunakan format Markdown: heading, bold, bullet points.
5. SELALU akhiri jawaban dengan: "---\\n⚠️ *Ini adalah bantuan AI dan bukan pengganti konsultasi pengacara berlisensi.*"
6. Jika pertanyaan di luar bidang hukum UMKM, tetap jawab sebaik mungkin tapi arahkan ke sumber yang tepat.`;

function extractText(msg: any): string {
  if (Array.isArray(msg.parts)) {
    return msg.parts.filter((p: any) => p.type === "text").map((p: any) => p.text).join("");
  }
  if (typeof msg.content === "string") return msg.content;
  return "";
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    let apiKey = (process.env.GEMINI_API_KEY || "").trim();
    if (!apiKey) {
      try {
        const cfContext = getCloudflareContext();
        if (cfContext?.env) apiKey = ((cfContext.env as any).GEMINI_API_KEY || "").trim();
      } catch {}
    }

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API Key tidak ditemukan." }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    const aiProvider = createOpenAI({
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
      apiKey,
      // @ts-ignore: bypass type error for compatibility flag
      compatibility: "compatible",
      fetch: async (url, options) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);
        try {
          return await fetch(url, { ...options, signal: controller.signal });
        } catch (err: any) {
          if (err.name === "AbortError") throw new Error("Koneksi AI timeout.");
          throw err;
        } finally {
          clearTimeout(timeoutId);
        }
      },
    });

    // Auth check & Tier Limits
    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;

        const { data: profile } = await supabase.from("users").select("tier, role").eq("id", userId).single();
        const isAdmin = profile?.role === "admin";
        const tier = profile?.tier || "free";

        if (!isAdmin && tier !== "pro" && tier !== "enterprise") {
          const limit = tier === "basic" ? 10 : 3;
          const startOfMonth = new Date();
          startOfMonth.setDate(1);
          startOfMonth.setHours(0, 0, 0, 0);

          const { count } = await supabase
            .from("consultations")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId)
            .like("chronology", "[LegalKita%")
            .gte("created_at", startOfMonth.toISOString());
          
          if (count !== null && count >= limit) {
            return new Response(JSON.stringify({ 
              error: "Limit_Exceeded", 
              message: `Limit ${limit} konsultasi/bulan untuk tier ${tier} telah tercapai. Silakan upgrade paket Anda.` 
            }), { status: 403, headers: { "Content-Type": "application/json" } });
          }
        }
      }
    } catch {}

    const MAX_MESSAGES = 10;
    const truncated = messages.length > MAX_MESSAGES ? messages.slice(-MAX_MESSAGES) : messages;
    const coreMessages = truncated.map((msg: any) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: extractText(msg),
    }));

    const result = await streamText({
      model: aiProvider.chat("gemini-3.5-flash"),
      system: SYSTEM_PROMPT,
      messages: coreMessages,
      onFinish: async ({ text, finishReason }) => {
        if (text && userId && (finishReason === "stop" || finishReason === "length")) {
          try {
            const supabase = await createClient();
            const lastUserMsg = extractText(messages[messages.length - 1]);
            await supabase.from("consultations").insert({
              user_id: userId,
              chronology: `[LegalKita Chat] ${lastUserMsg.substring(0, 200)}`,
              ai_analysis: text,
            });
          } catch {}
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("[LegalKita Chat]", error?.message);
    return new Response(JSON.stringify({ error: "Terjadi kesalahan." }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
