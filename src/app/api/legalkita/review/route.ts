import { createClient } from "@/lib/supabase/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import dns from "node:dns";

try {
  dns.setDefaultResultOrder("ipv4first");
} catch (e) {}

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

    const { data: profile } = await supabase.from("users").select("tier, role, token_balance, subscription_expires_at").eq("id", user.id).single();
    const isAdmin = profile?.role === "admin";
    let tier = (profile?.tier || "free").toLowerCase();
    const tokenBalance = profile?.token_balance || 0;

    if (profile?.subscription_expires_at && new Date(profile.subscription_expires_at) < new Date() && !isAdmin) {
      tier = "free";
      supabase.from("users").update({ tier: "free", is_premium: false, subscription_expires_at: null }).eq("id", user.id).then();
    }

    if (!isAdmin && tier !== "pro" && tier !== "enterprise" && tier !== "professional") {
      const limit = 3;

      const { count } = await supabase
        .from("consultations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .like("chronology", "[LegalKita%");
      
      if (count !== null && count >= limit && tokenBalance <= 0) {
        return Response.json({ 
          error: "Limit_Exceeded", 
          message: `Kuota uji coba gratis Anda (${limit}x) telah habis. Silakan Top-Up Kuota atau Upgrade ke paket Premium.` 
        }, { status: 403 });
      }

      if (count !== null && count >= limit) {
         await supabase.from("users").update({ token_balance: tokenBalance - 1 }).eq("id", user.id);
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
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}`, "Connection": "close" },
          body: JSON.stringify({
            model: "gemini-3.1-flash-lite",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: userPrompt },
            ],
          }),
          signal: controller.signal,
        });
      } catch (e: any) {
        clearTimeout(timeoutId);
        if (attempt === 2) {
          if (e.name === "AbortError") throw new Error("Koneksi AI timeout.");
          const reason = e?.cause?.code || e?.cause?.message || e?.message || "Network Error";
          throw new Error(`Gagal terhubung ke server AI (Alasan teknis server hosting: ${reason}). Mohon info ke CS Jagoan Hosting agar dibukakan koneksi Outbound/DNS ke Google.`);
        }
        await new Promise(r => setTimeout(r, 2000));
        continue;
      } finally {
        clearTimeout(timeoutId);
      }
      if (response && (response.ok || ![502, 503, 429].includes(response.status))) break;
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
    let msg = error?.message || "Terjadi kesalahan.";
    if (msg === "fetch failed" || msg.includes("ECONNRESET") || msg.includes("ENOTFOUND")) {
      msg = "Gagal terhubung ke server AI (gangguan koneksi/jaringan). Silakan coba kembali dalam beberapa saat.";
    }
    console.error("[LegalKita Review]", msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}
