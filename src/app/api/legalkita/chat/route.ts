import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createClient } from "@/lib/supabase/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import dns from "node:dns";

try {
  dns.setDefaultResultOrder("ipv4first");
} catch (e) {}

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

    let apiKey = (process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "").trim();
    if (!apiKey) {
      try {
        const cfContext = getCloudflareContext();
        if (cfContext?.env) apiKey = ((cfContext.env as any).GOOGLE_GEMINI_API_KEY || "").trim();
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
          const headers = { ...options?.headers, "Connection": "close" };
          return await fetch(url, { ...options, headers, signal: controller.signal });
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

        const { data: profile } = await supabase.from("users").select("tier, role, token_balance, subscription_expires_at").eq("id", userId).single();
        const isAdmin = profile?.role === "admin";
        let tier = (profile?.tier || "free").toLowerCase();
        const tokenBalance = profile?.token_balance || 0;

        if (profile?.subscription_expires_at && new Date(profile.subscription_expires_at) < new Date() && !isAdmin) {
          tier = "free";
          supabase.from("users").update({ tier: "free", is_premium: false, subscription_expires_at: null }).eq("id", userId).then();
        }

        if (!isAdmin && tier !== "pro" && tier !== "enterprise" && tier !== "professional") {
          const limit = 3;

          const { count } = await supabase
            .from("consultations")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId)
            .like("chronology", "[LegalKita%");
          
          if (count !== null && count >= limit && tokenBalance <= 0) {
            return new Response(JSON.stringify({ 
              error: "Limit_Exceeded", 
              message: `Kuota uji coba gratis Anda (${limit}x) telah habis. Silakan Top-Up Kuota atau Upgrade ke paket Premium.` 
            }), { status: 403, headers: { "Content-Type": "application/json" } });
          }

          if (count !== null && count >= limit) {
             await supabase.from("users").update({ token_balance: tokenBalance - 1 }).eq("id", userId);
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
      model: aiProvider.chat("gemini-3.1-flash-lite"),
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
