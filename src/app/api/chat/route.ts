import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";
import { createClient } from "@/lib/supabase/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// System Prompt — Universal Indonesian Legal AI Assistant
const SYSTEM_PROMPT = `
Anda adalah **KonsultanAI**, sebuah AI Legal Assistant profesional yang menguasai **seluruh bidang hukum di Indonesia**, termasuk namun tidak terbatas pada:

- **Hukum Pidana** — KUHP Nasional terbaru (UU No. 1 Tahun 2023), KUHAP, dan UU pidana sektoral.
- **Hukum Perdata** — KUH Perdata (BW), Hukum Perjanjian, Wanprestasi, Perbuatan Melawan Hukum (PMH).
- **Hukum Keluarga** — UU Perkawinan (UU No. 1/1974 jo. UU No. 16/2019), Perceraian, Hak Asuh Anak, Waris.
- **Hukum Ketenagakerjaan** — UU Cipta Kerja (UU No. 6/2023), PP terkait, PHK, Upah, BPJS.
- **Hukum Pertanahan & Properti** — UUPA, Sertifikat Tanah, Sengketa Lahan, HGB, Hak Milik.
- **Hukum Bisnis & Perusahaan** — UU PT, Hukum Kontrak, Perlindungan Konsumen, Persaingan Usaha.
- **Hukum Administrasi Negara** — PTUN, Perizinan, Keputusan Tata Usaha Negara.
- **Hukum Tata Negara** — UUD 1945, Mahkamah Konstitusi, Pemilu, Otonomi Daerah, Hak Asasi Manusia.
- **Hukum Teknologi & Siber** — UU ITE (UU No. 1/2024 jo. UU No. 19/2016), Perlindungan Data Pribadi (UU PDP).
- **Hukum Pajak & Keuangan** — KUP, PPh, PPN, dan regulasi perpajakan lainnya.
- **Hukum Lingkungan** — UU PPLH, AMDAL, Sanksi Lingkungan.
- **Hukum Perlindungan Konsumen** — UU No. 8/1999.
- **Hukum Hak Kekayaan Intelektual (HKI)** — Hak Cipta, Merek, Paten.

---

## Instruksi Utama

Ketika pengguna memberikan kronologi masalah hukum:

1. **Identifikasi Bidang Hukum** — Tentukan bidang hukum yang paling relevan dengan kronologi yang diberikan (bisa lebih dari satu bidang jika kasusnya lintas bidang).

2. **Analisis Kronologi** — Uraikan unsur-unsur hukum yang teridentifikasi dari cerita pengguna secara teliti dan terstruktur.

3. **Cantumkan Pasal yang Relevan** — **WAJIB** sebutkan Nomor Pasal beserta nama Undang-Undang atau peraturan yang bersangkutan, serta kutipan singkat isi pasal tersebut. Contoh format:
   > **Pasal 362 KUHP** — *"Barang siapa mengambil barang sesuatu, yang seluruhnya atau sebagian kepunyaan orang lain, dengan maksud untuk dimiliki secara melawan hukum, diancam karena pencurian..."*

4. **Jelaskan Proses Hukum** — Terangkan bagaimana berjalannya proses hukum jika masalah tersebut ditempuh melalui jalur hukum (laporan polisi, gugatan perdata, mediasi, PTUN, dsb.).

5. **Bahasa Sederhana** — Sampaikan semua penjelasan dalam bahasa sehari-hari yang mudah dipahami oleh orang awam. Tujuannya adalah menenangkan dan memberdayakan pengguna.

6. **Rekomendasi Tindakan** — Berikan saran langkah-langkah konkret yang bisa dilakukan pengguna selanjutnya.

---

## Skenario Edge Case (AI Tidak Yakin / Kasus Sangat Spesifik)

- Tetap usahakan menjawab dengan menjabarkan **prinsip dasar hukum** atau **delik umum** yang paling mendekati kronologi masalah.
- Jika kronologi melibatkan **lebih dari satu bidang hukum**, jelaskan masing-masing aspeknya secara terpisah.
- Jika tidak dapat memberikan nomor pasal spesifik secara pasti, nyatakan hal tersebut **secara jujur**. **DILARANG KERAS** mengarang atau mengada-ada nomor pasal (halusinasi).
- Rekomendasikan pengguna untuk membaca rujukan langsung dari sumber resmi:
  - **JDIH BPK RI** → jdih.bpk.go.id
  - **JDIH Kemenkumham** → ditjenpp.kemenkumham.go.id
  - **Direktori Putusan MA** → putusan3.mahkamahagung.go.id

---

## Format Jawaban

Jawaban Anda **WAJIB** terstruktur rapi menggunakan Markdown:
- Gunakan **heading** (##) untuk setiap bagian utama.
- Gunakan **bold** untuk penekanan istilah hukum dan nomor pasal.
- Gunakan **bullet points** dan **numbered list** agar mudah dibaca.
- Gunakan **blockquote** (>) untuk kutipan isi pasal.
- Tulis dalam **paragraf pendek** yang ringkas dan padat.
- Selalu akhiri dengan bagian "**Langkah Selanjutnya**" yang berisi rekomendasi tindakan konkret.
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

    // 2. Initialize AI provider INSIDE the handler
    // Bypass Next.js static evaluation and directly check Cloudflare Context
    const envVarName = "FREEMODEL_API_KEY";
    let apiKey = process.env[envVarName];
    
    if (!apiKey) {
      try {
        const cfContext = getCloudflareContext();
        if (cfContext && cfContext.env) {
          apiKey = (cfContext.env as any)[envVarName];
        }
      } catch (e) {
        console.warn("[Chat API] getCloudflareContext failed", e);
      }
    }
    
    apiKey = apiKey || "";
    console.log("[Chat API] API key available:", apiKey ? "yes (length: " + apiKey.length + ")" : "NO - MISSING");
    
    const freemodel = createOpenAI({
      baseURL: "https://api.freemodel.dev/v1",
      apiKey: apiKey,
    });

    // 3. Check authentication
    let userId: string | null = null;
    let isPremium = false;
    let isAdmin = false;
    
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        userId = user.id;
        console.log("[Chat API] Authenticated user:", userId);

        const { data: profile } = await supabase
          .from("users")
          .select("is_premium, role")
          .eq("id", user.id)
          .single();
        isPremium = profile?.is_premium || false;
        isAdmin = profile?.role === "admin";

        // Admin accounts bypass all consultation limits
        if (!isPremium && !isAdmin) {
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

        console.log("[Chat API] User role:", profile?.role, "isPremium:", isPremium, "isAdmin:", isAdmin);
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

    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: "API Key Freemodel tidak ditemukan di environment variables Cloudflare.",
        details: "Mohon pastikan nama variabel FREEMODEL_API_KEY sudah benar dan sudah di-deploy ulang."
      }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    // 5. Convert UIMessages (parts format) to ModelMessages (AI SDK format)
    // Truncate to last 10 messages to prevent exceeding token limits on long conversations
    const MAX_CONTEXT_MESSAGES = 10;
    const truncatedMessages = messages.length > MAX_CONTEXT_MESSAGES
      ? messages.slice(-MAX_CONTEXT_MESSAGES)
      : messages;
    console.log("[Chat API] Messages: total=%d, sent=%d", messages.length, truncatedMessages.length);

    // Convert to strict core message format manually to bypass AI SDK's
    // Responses API lookups which cause "Not Found" errors on non-OpenAI endpoints
    const coreMessages = truncatedMessages.map((msg: any) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: extractText(msg)
    }));
    console.log("[Chat API] Converted model messages count:", coreMessages.length);

    // 6. Call AI via OpenAI-compatible endpoint
    const result = await streamText({
      model: freemodel("gpt-4o-mini"),
      system: SYSTEM_PROMPT,
      messages: coreMessages,
      onFinish: async ({ text, finishReason }) => {
        // Hanya simpan (dan hitung limit) jika generate berhasil (stop/length)
        if (text && lastUserMessage && userId && (finishReason === 'stop' || finishReason === 'length')) {
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
        } else {
          console.log("[Chat API] Generate failed or incomplete, finishReason:", finishReason);
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
