import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";
import { createClient } from "@/lib/supabase/server";

// The system prompt as defined in the PRD (Section 26 & 27)
const SYSTEM_PROMPT = `
Anda adalah AI Legal Assistant profesional yang berdedikasi dan ahli dalam Hukum Indonesia, khususnya KUHP Nasional terbaru.

Tugas Anda:
1. Analisis kronologi masalah yang diberikan oleh pengguna dengan teliti.
2. Identifikasi unsur-unsur pidana, perdata, atau administratif yang relevan.
3. WAJIB mencantumkan Nomor Pasal dari KUHP Terbaru (atau UU Sektoral terbaru lainnya) yang paling sesuai, beserta kutipan singkat isi pasalnya.
4. Jelaskan bagaimana berjalannya proses hukum apabila masalah tersebut dibawa ke ranah hukum.
5. Sampaikan penjelasan menggunakan bahasa sehari-hari yang sederhana dan menenangkan pengguna.

Skenario Jika Anda Tidak Yakin (Edge Case):
- Tetap usahakan menjawab dengan menjabarkan prinsip dasar hukum atau delik umum yang paling mendekati kronologi masalah.
- Jika tidak dapat memberikan nomor pasal spesifik secara pasti, nyatakan hal tersebut secara jujur (Jangan berhalusinasi/mengarang pasal).
- Rekomendasikan user untuk membaca rujukan langsung dari website resmi hukum pemerintah seperti JDIH BPK RI (jdih.bpk.go.id), JDIH Kemenkumham, atau Direktori Putusan Mahkamah Agung.

Penting: Jawaban Anda harus terstruktur dengan baik (gunakan markdown bullet points, bold untuk penekanan, dan paragraf pendek).
`;

// Helper: extract plain text from a UIMessage (which uses parts array)
function extractText(msg: any): string {
  if (Array.isArray(msg.parts)) {
    return msg.parts
      .filter((p: any) => p.type === "text")
      .map((p: any) => p.text)
      .join("");
  }
  if (typeof msg.content === "string") return msg.content;
  return "";
}

export async function POST(req: Request) {
  try {
    // 1. Parse request body
    const { messages } = await req.json();
    console.log("[Chat API] Received messages count:", messages?.length);

    // 2. Initialize AI provider INSIDE the handler (Cloudflare Workers needs this)
    const apiKey = process.env.FREEMODEL_API_KEY || "";
    console.log("[Chat API] API key available:", apiKey ? "yes (length: " + apiKey.length + ")" : "NO - MISSING");
    
    const freemodel = createOpenAI({
      baseURL: "https://api.freemodel.dev/v1",
      apiKey: apiKey,
    });

    // 3. Check authentication
    let userId: string | null = null;
    let isPremium = false;
    
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        userId = user.id;
        console.log("[Chat API] Authenticated user:", userId);

        const { data: profile } = await supabase
          .from("users")
          .select("is_premium")
          .eq("id", user.id)
          .single();
        isPremium = profile?.is_premium || false;

        if (!isPremium) {
          const { count } = await supabase
            .from("consultations")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id);
          
          if (count && count >= 1) {
            return new Response(JSON.stringify({ 
              error: "Limit_Exceeded", 
              message: "Anda telah menggunakan jatah 1x Free Trial. Silakan berlangganan untuk melanjutkan." 
            }), { status: 403, headers: { "Content-Type": "application/json" } });
          }
        }
      } else {
        console.log("[Chat API] No authenticated user, proceeding for dev");
      }
    } catch (authError) {
      console.error("[Chat API] Auth check failed (proceeding):", authError);
    }

    // 4. Extract last user message text (for DB save)
    const lastUserMsg = messages[messages.length - 1];
    const lastUserMessage = extractText(lastUserMsg);
    console.log("[Chat API] Calling AI with message:", lastUserMessage.substring(0, 100));

    // 5. Convert UIMessages (parts format) to ModelMessages (AI SDK format)
    const modelMessages = await convertToModelMessages(messages);
    console.log("[Chat API] Converted model messages count:", modelMessages.length);

    // 6. Call AI via OpenAI-compatible endpoint
    const result = await streamText({
      model: freemodel("gpt-5.4-mini"),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
      onFinish: async ({ text }) => {
        if (text && lastUserMessage && userId) {
          try {
            const supabase = await createClient();
            const { error } = await supabase.from("consultations").insert({
              user_id: userId,
              chronology: lastUserMessage,
              ai_analysis: text,
            });
            if (error) console.error("[Chat API] Failed to save:", error);
            else console.log("[Chat API] Saved consultation");
          } catch (saveError) {
            console.error("[Chat API] DB save error:", saveError);
          }
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("[Chat API] Error:", error?.message || error);
    
    // DEBUG INFO: let's check if the API key was actually read from process.env
    const apiKey = process.env.FREEMODEL_API_KEY || "";
    
    return new Response(JSON.stringify({ 
      error: "Terjadi kesalahan saat menghubungi AI.",
      details: error?.message || "Unknown error",
      debug: {
        hasApiKey: !!apiKey,
        keyLength: apiKey.length,
        isCloudflare: !!process.env.CF_PAGES,
      }
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
