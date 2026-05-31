import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createClient } from "@/lib/supabase/server";

// Initialize Freemodel.dev using OpenAI provider (as shown in the user's dashboard)
const freemodel = createOpenAI({
  baseURL: "https://api.freemodel.dev/v1",
  apiKey: process.env.FREEMODEL_API_KEY || "",
});

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

export async function POST(req: Request) {
  try {
    // 1. Parse request body
    const { messages } = await req.json();
    console.log("[Chat API] Received messages count:", messages?.length);

    // 2. Check authentication
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

    // 3. Call AI via OpenAI-compatible endpoint
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    console.log("[Chat API] Calling AI with message:", lastUserMessage.substring(0, 100));

    const result = await streamText({
      model: freemodel("gpt-5.4-mini"),
      system: SYSTEM_PROMPT,
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
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
    console.error("[Chat API] Stack:", error?.stack);
    return new Response(JSON.stringify({ 
      error: "Terjadi kesalahan saat menghubungi AI.",
      details: error?.message || "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
