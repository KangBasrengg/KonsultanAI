import { createClient } from "@/lib/supabase/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const SYSTEM_PROMPT = `Anda adalah AI Legal Document Reviewer khusus untuk UMKM Indonesia.

Tugas Anda: menganalisis dokumen hukum yang diberikan user dan memberikan review komprehensif.

FORMAT OUTPUT (wajib Markdown):

## 📊 Ringkasan Dokumen
(Jenis dokumen, pihak terlibat, tujuan utama)

## ✅ Kekuatan Dokumen
(Poin-poin yang sudah baik dan sesuai hukum)

## ⚠️ Risiko & Celah Hukum
(Identifikasi risiko, pasal yang kurang, klausul bermasalah — beri nomor urut)

## 📋 Kepatuhan Hukum
(Cek kesesuaian dengan UU terkait: KUH Perdata, UU Ketenagakerjaan, UU UMKM, dll)

## 🔧 Rekomendasi Perbaikan
(Saran konkret perbaikan, pasal yang perlu ditambahkan)

## 📌 Kesimpulan
(Skor risiko: Rendah/Sedang/Tinggi dan langkah selanjutnya)

---
⚠️ *Ini adalah analisis AI dan bukan pengganti review pengacara berlisensi. Untuk dokumen bernilai tinggi, konsultasikan dengan profesional hukum.*

ATURAN:
1. Analisis secara detail dan profesional.
2. Selalu cantumkan referensi pasal & UU yang relevan.
3. Gunakan bahasa yang mudah dipahami pemilik UMKM.
4. Jika dokumen tidak jelas/terpotong, analisis sebaik mungkin dan catat keterbatasannya.`;

function getApiKey(): string {
  let apiKey = (process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "").trim();
  if (!apiKey) {
    try {
      const cfContext = getCloudflareContext();
      if (cfContext?.env) apiKey = ((cfContext.env as any).GOOGLE_GEMINI_API_KEY || "").trim();
    } catch {}
  }
  return apiKey;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { document: docText } = body;

    if (!docText || docText.length < 100) {
      return Response.json({ error: "Dokumen terlalu pendek (minimal 100 karakter)." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Login terlebih dahulu." }, { status: 401 });

    const apiKey = getApiKey();
    if (!apiKey) return Response.json({ error: "API Key tidak ditemukan." }, { status: 500 });

    const { data: profile } = await supabase.from("users").select("tier, role").eq("id", user.id).single();
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
        .eq("user_id", user.id)
        .like("chronology", "[LegalKita%")
        .gte("created_at", startOfMonth.toISOString());
      
      if (count !== null && count >= limit) {
        return Response.json({ 
          error: "Limit_Exceeded", 
          message: `Limit ${limit} dokumen/bulan untuk tier ${tier} telah tercapai. Silakan upgrade paket Anda.` 
        }, { status: 403 });
      }
    }

    const userPrompt = `Review dokumen hukum berikut dan berikan analisis komprehensif:\n\n---\n${docText}\n---`;

    let response: Response | null = null;
    for (let attempt = 0; attempt <= 2; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);
      try {
        response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: "gemini-2.0-flash",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: userPrompt },
            ],
          }),
          signal: controller.signal,
        });
      } catch (e: any) {
        clearTimeout(timeoutId);
        if (e.name === "AbortError") throw new Error("Koneksi AI timeout.");
        throw e;
      } finally {
        clearTimeout(timeoutId);
      }
      if (response.ok || ![502, 503, 429].includes(response.status)) break;
      if (attempt < 2) await new Promise(r => setTimeout(r, 2000));
    }

    if (!response?.ok) {
      throw new Error(response?.status === 503 ? "Server AI sedang sibuk." : "Gagal menghubungi AI.");
    }

    const data = await response.json();
    const review = data.choices[0]?.message?.content || "";

    // Save (best effort)
    try {
      await supabase.from("consultations").insert({
        user_id: user.id,
        chronology: `[LegalKita Review] Dokumen ${docText.substring(0, 100)}...`,
        ai_analysis: review,
      });
    } catch {}

    return Response.json({ review });
  } catch (error: any) {
    console.error("[LegalKita Review]", error?.message);
    return Response.json({ error: error?.message || "Terjadi kesalahan." }, { status: 500 });
  }
}
