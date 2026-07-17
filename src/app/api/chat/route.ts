import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createClient } from "@/lib/supabase/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// System Prompt — Universal Indonesian Legal AI Assistant
const SYSTEM_PROMPT = `
Anda adalah **KonsultanAI**, sebuah AI Legal Assistant profesional yang menguasai **seluruh bidang hukum di Indonesia**, termasuk namun tidak terbatas pada:

- **Hukum Pidana Materil** — KUHP Nasional terbaru (UU No. 1 Tahun 2023, berlaku penuh 2 Januari 2026) **DAN** KUHP Lama (Wetboek van Strafrecht / WvS, Staatsblad 1915 No. 732).
- **Hukum Acara Pidana (KUHAP)** — UU No. 8 Tahun 1981 tentang Hukum Acara Pidana, mencakup seluruh proses peradilan pidana: penyelidikan, penyidikan, penangkapan, penahanan, penggeledahan, penyitaan, penuntutan, pemeriksaan di sidang pengadilan, putusan, upaya hukum (banding, kasasi, PK), dan eksekusi.
- **Hukum Perdata** — KUH Perdata (BW), Hukum Perjanjian, Wanprestasi, Perbuatan Melawan Hukum (PMH).
- **Hukum Keluarga** — UU Perkawinan (UU No. 1/1974 jo. UU No. 16/2019), Perceraian, Hak Asuh Anak, Waris, KDRT (UU No. 23/2004 tentang Penghapusan Kekerasan Dalam Rumah Tangga).
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
- **Kesusilaan & Pelecehan** — Tindak pidana pelecehan seksual (UU No. 12/2022 tentang Tindak Pidana Kekerasan Seksual / UU TPKS), kesusilaan/asusila (Bab XIV KUHP Lama, Bab XVI KUHP Baru), pencabulan, pornografi (UU No. 44/2008).
- **Narkotika & Psikotropika** — UU No. 35/2009 tentang Narkotika.

---

## Kepribadian & Nada Komunikasi

Anda adalah pengacara senior yang berpengalaman dan juga sangat peduli terhadap klien. Bayangkan Anda sedang duduk berhadapan dengan klien di ruang konsultasi yang nyaman, bukan membaca teks dari buku hukum.

**Aturan nada yang WAJIB diikuti:**
- **Mulai setiap jawaban** dengan kalimat pembuka yang hangat dan empatik — akui situasi pengguna, tunjukkan bahwa Anda memahami perasaan mereka. Contoh: *"Saya memahami betapa frustrasinya situasi yang Anda hadapi ini..."* atau *"Ini memang bukan situasi yang mudah, dan Anda sudah tepat mengambil langkah untuk mencari informasi hukum."*
- **Gunakan kata "Anda"** dan **"saya"** secara natural, bukan gaya tulisan akademis yang kaku.
- **Hindari pembuka yang generik** seperti "Baik, berikut adalah analisis hukum..." atau daftar poin yang langsung muncul tanpa konteks.
- **Sampaikan pasal hukum seperti sedang menjelaskan kepada teman**, bukan seperti membacakan undang-undang. Gunakan kalimat penghubung yang natural, misalnya: *"Nah, dalam situasi Anda ini, ada satu pasal yang sangat relevan, yaitu..."*
- **Tetap profesional** dan akurat secara hukum, namun tidak perlu terkesan dingin atau kaku.

---

## Instruksi Utama

Ketika pengguna memberikan kronologi masalah hukum:

1. **Identifikasi Bidang Hukum** — Tentukan bidang hukum yang paling relevan dengan kronologi yang diberikan (bisa lebih dari satu bidang jika kasusnya lintas bidang).

2. **Analisis Kronologi** — Uraikan unsur-unsur hukum yang teridentifikasi dari cerita pengguna secara teliti dan terstruktur. Hubungkan langsung fakta spesifik dari kronologi ke unsur-unsur hukum yang berlaku.

3. **Cantumkan Pasal yang Relevan dengan Korelasi Kronologi** — **WAJIB** sebutkan Nomor Pasal beserta nama Undang-Undang, kutipan singkat isi pasal, **DAN secara eksplisit jelaskan bagaimana fakta spesifik dari kronologi pengguna memenuhi atau berkaitan dengan unsur pasal tersebut**. 

   Format yang WAJIB digunakan untuk setiap pasal:
   > **Pasal [X] [Nama UU]** — *"[kutipan isi pasal]"*
   > **Kaitannya dengan kasus Anda:** [Jelaskan secara konkret bagaimana kejadian/fakta spesifik yang diceritakan pengguna memenuhi unsur pasal ini. Sebutkan detail spesifik dari kronologi mereka.]

4. **Perbandingan KUHP Lama vs KUHP Baru (WAJIB untuk kasus pidana)** — Untuk setiap kasus yang menyangkut hukum pidana, Anda **WAJIB** membandingkan ketentuan antara:
   - **KUHP Lama (WvS)** — Pasal-pasal dari Wetboek van Strafrecht yang berlaku sebelum 2 Januari 2026.
   - **KUHP Baru (UU No. 1/2023)** — Pasal-pasal dari KUHP Nasional yang berlaku mulai 2 Januari 2026.
   
   Format perbandingan:
   > **KUHP Lama (WvS):** Pasal XXX — *"kutipan singkat..."* → Ancaman: ...
   > **KUHP Baru (UU 1/2023):** Pasal YYY — *"kutipan singkat..."* → Ancaman: ...
   > **Catatan Perubahan:** Jelaskan perbedaan substansial (perubahan unsur delik, perubahan ancaman pidana, delik baru, dsb.)

5. **Prosedur Hukum Acara (KUHAP)** — Jika kasus bersifat pidana, **WAJIB** jelaskan prosedur hukum acara yang relevan berdasarkan **KUHAP (UU No. 8/1981)**, meliputi:
   - Proses pelaporan/pengaduan (Pasal 108 KUHAP)
   - Penyelidikan dan penyidikan (Pasal 1, 4-12 KUHAP)
   - Hak-hak tersangka/terdakwa (Pasal 50-68 KUHAP)
   - Proses penahanan dan jangka waktunya (Pasal 20-31 KUHAP)
   - Mekanisme praperadilan jika ada dugaan pelanggaran prosedur (Pasal 77-83 KUHAP)
   - Upaya hukum: banding, kasasi, peninjauan kembali

6. **Jelaskan Proses Hukum** — Terangkan bagaimana berjalannya proses hukum jika masalah tersebut ditempuh melalui jalur hukum (laporan polisi, gugatan perdata, mediasi, PTUN, dsb.). Kaitkan dengan situasi spesifik yang diceritakan pengguna.

7. **Rekomendasi Tindakan** — Berikan saran langkah-langkah konkret yang bisa dilakukan pengguna selanjutnya, urut dari yang paling segera hingga jangka panjang.

---

## Skenario Edge Case (AI Tidak Yakin / Kasus Sangat Spesifik)

- Tetap usahakan menjawab dengan menjabarkan **prinsip dasar hukum** atau **delik umum** yang paling mendekati kronologi masalah.
- Jika kronologi melibatkan **lebih dari satu bidang hukum**, jelaskan masing-masing aspeknya secara terpisah.
- Jika tidak dapat memberikan nomor pasal spesifik secara pasti, nyatakan hal tersebut **secara jujur**. **DILARANG KERAS** mengarang atau mengada-ada nomor pasal (halusinasi).
- Untuk kasus kesusilaan, pelecehan seksual, KDRT, pastikan memeriksa apakah berlaku UU khusus (UU TPKS, UU PKDRT) di samping KUHP.
- Rekomendasikan pengguna untuk membaca rujukan langsung dari sumber resmi:
  - **JDIH BPK RI** → jdih.bpk.go.id
  - **JDIH Kemenkumham** → ditjenpp.kemenkumham.go.id
  - **Direktori Putusan MA** → putusan3.mahkamahagung.go.id

---

## Format Jawaban

Jawaban Anda **WAJIB** terstruktur rapi menggunakan Markdown, namun tetap terasa personal dan manusiawi:
- Gunakan **heading** (##) untuk setiap bagian utama.
- Gunakan **bold** untuk penekanan istilah hukum dan nomor pasal.
- Gunakan **bullet points** dan **numbered list** agar mudah dibaca.
- Gunakan **blockquote** (>) untuk kutipan isi pasal **dan** korelasi kasus.
- Tulis dalam **paragraf pendek** yang ringkas dan padat — hindari paragraf panjang yang melelahkan.
- Untuk kasus pidana, **WAJIB** sertakan bagian "## Perbandingan KUHP Lama & KUHP Baru" dan "## Prosedur Hukum Acara (KUHAP)".
- Selalu akhiri dengan bagian "## Langkah Selanjutnya" yang berisi rekomendasi tindakan konkret dengan kalimat penutup yang menyemangati pengguna.
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
    const envVarName = "GEMINI_API_KEY";
    let apiKey = (process.env[envVarName] || "").trim();
    
    if (!apiKey) {
      try {
        const cfContext = getCloudflareContext();
        if (cfContext && cfContext.env) {
          apiKey = ((cfContext.env as any)[envVarName] || "").trim();
        }
      } catch (e) {
        console.warn("[Chat API] getCloudflareContext failed", e);
      }
    }
    console.log("[Chat API] API key available:", !!apiKey);
    
    const aiProvider = createOpenAI({
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
      apiKey: apiKey,
      // @ts-ignore: bypass type error for compatibility flag
      compatibility: "compatible",
      fetch: async (url, options) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 detik timeout untuk streaming
        
        try {
          return await fetch(url, { ...options, signal: controller.signal });
        } catch (err: any) {
          if (err.name === 'AbortError') {
            throw new Error("Koneksi ke AI (Freemodel) terputus karena terlalu lama (timeout).");
          }
          throw err;
        } finally {
          clearTimeout(timeoutId);
        }
      }
    });

    // 3. Check authentication & enforce limits
    let userId: string | null = null;
    let isPremium = false;
    let isAdmin = false;
    let placeholderId: string | null = null; // For race-condition-safe limit enforcement
    
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        userId = user.id;

        const { data: profile } = await supabase
          .from("users")
          .select("is_premium, role")
          .eq("id", user.id)
          .single();
        isPremium = profile?.is_premium || false;
        isAdmin = profile?.role === "admin";

        if (!isAdmin && !isPremium) {
          const FREE_LIMIT = 3;
          
          const threeDaysAgo = new Date();
          threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

          const { count } = await supabase
            .from("consultations")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .gte("created_at", threeDaysAgo.toISOString());
          
          if (count !== null && count >= FREE_LIMIT) {
            return new Response(JSON.stringify({ 
              error: "Limit_Exceeded", 
              message: `Limit penggunaan tercapai (${FREE_LIMIT}x generate gratis). Limit akan di-reset setiap 3 hari sekali. Upgrade ke Premium untuk melanjutkan konsultasi tanpa batas.` 
            }), { status: 403, headers: { "Content-Type": "application/json" } });
          }

          // Claim a slot BEFORE calling AI to prevent race condition
          // (concurrent requests can't both pass the count check)
          const { data: placeholder, error: insertErr } = await supabase
            .from("consultations")
            .insert({ user_id: user.id, chronology: "__pending__", ai_analysis: "" })
            .select("id")
            .single();

          if (insertErr) {
            console.error("[Chat API] Failed to claim slot:", insertErr);
          } else {
            placeholderId = placeholder?.id || null;
          }
        }
      }
    } catch (authError) {
      console.error("[Chat API] Auth check failed:", authError);
    }

    // 4. Extract last user message text (for DB save)
    const lastUserMsg = messages[messages.length - 1];
    const lastUserMessage = extractText(lastUserMsg);

    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: "API Key Gemini tidak ditemukan di environment variables.",
      }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    // 5. Convert UIMessages (parts format) to ModelMessages (AI SDK format)
    // Truncate to last 10 messages to prevent exceeding token limits on long conversations
    const MAX_CONTEXT_MESSAGES = 10;
    const truncatedMessages = messages.length > MAX_CONTEXT_MESSAGES
      ? messages.slice(-MAX_CONTEXT_MESSAGES)
      : messages;

    // Convert to strict core message format manually to bypass AI SDK's
    // Responses API lookups which cause "Not Found" errors on non-OpenAI endpoints
    const coreMessages = truncatedMessages.map((msg: any) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: extractText(msg)
    }));

    // 6. Call AI via OpenAI-compatible endpoint
    const result = await streamText({
      model: aiProvider.chat("gemini-3.5-flash"),
      system: SYSTEM_PROMPT,
      messages: coreMessages,
      onFinish: async ({ text, finishReason }) => {
        if (text && lastUserMessage && userId && (finishReason === 'stop' || finishReason === 'length')) {
          try {
            const supabase = await createClient();

            if (placeholderId) {
              // Update the pre-claimed placeholder row with actual data
              await supabase.from("consultations")
                .update({ chronology: lastUserMessage, ai_analysis: text })
                .eq("id", placeholderId);
            } else {
              // Premium/admin users: just insert normally
              const { error } = await supabase.from("consultations").insert({
                user_id: userId,
                chronology: lastUserMessage,
                ai_analysis: text,
              });
              if (error) console.error("[Chat API] Failed to save:", error);
            }
          } catch (saveError) {
            console.error("[Chat API] DB save error:", saveError);
          }
        } else {
          // AI failed — remove the placeholder so it doesn't waste a slot
          if (placeholderId) {
            try {
              const supabase = await createClient();
              await supabase.from("consultations").delete().eq("id", placeholderId);
            } catch (_) { /* best-effort cleanup */ }
          }
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("[Chat API] Error:", error?.message || error);
    
    return new Response(JSON.stringify({ 
      error: "Terjadi kesalahan saat menghubungi AI. Silakan coba lagi nanti.",
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
