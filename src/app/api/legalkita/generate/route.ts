import { createClient } from "@/lib/supabase/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const SYSTEM_PROMPT = `Anda adalah AI Legal Document Generator khusus untuk UMKM Indonesia.
Tugas Anda: menghasilkan draft dokumen hukum yang lengkap, profesional, dan sesuai hukum Indonesia.

ATURAN PENTING:
1. Gunakan bahasa Indonesia formal dan hukum yang benar.
2. Selalu cantumkan referensi undang-undang yang relevan:
   - KUH Perdata (BW) untuk perjanjian umum
   - UU No. 13/2003 jo. UU No. 6/2023 (Cipta Kerja) untuk ketenagakerjaan
   - UU No. 20/2008 tentang UMKM
   - PP terkait untuk regulasi spesifik
3. Sertakan pasal-pasal standar: definisi, hak & kewajiban, durasi, pembayaran, force majeure, penyelesaian sengketa, penutup.
4. Format output menggunakan Markdown yang rapi dengan heading, bold, dan numbered list.
5. Gunakan placeholder [___] untuk data yang belum diisi user.
6. WAJIB akhiri dokumen dengan catatan: "Dokumen ini dibuat sebagai draft awal oleh AI LegalKita dan bukan merupakan nasihat hukum resmi. Konsultasikan dengan pengacara berlisensi untuk finalisasi."`;

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
    const { contract_type, jenis_usaha, nama_pihak_1, nama_pihak_2, detail, durasi, nilai } = body;

    if (!contract_type || !jenis_usaha || !nama_pihak_1 || !nama_pihak_2) {
      return Response.json({ error: "Semua field wajib harus diisi." }, { status: 400 });
    }

    // Auth check
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

    const contractLabels: Record<string, string> = {
      kontrak_kerja: "Kontrak Kerja Karyawan (PKWT/PKWTT)",
      sewa_menyewa: "Perjanjian Sewa Menyewa",
      jual_beli: "Perjanjian Jual Beli",
      kemitraan: "Perjanjian Kemitraan / Kerjasama",
      freelance: "Kontrak Kerja Freelance / Outsource",
      franchise: "Perjanjian Franchise / Waralaba",
    };

    const userPrompt = `Buatkan draft ${contractLabels[contract_type] || contract_type} dengan detail:
- Jenis Usaha: ${jenis_usaha}
- Pihak Pertama: ${nama_pihak_1}
- Pihak Kedua: ${nama_pihak_2}
${durasi ? `- Durasi / Jangka Waktu: ${durasi}` : ""}
${nilai ? `- Nilai Kontrak: ${nilai}` : ""}
${detail ? `- Detail / Ketentuan Khusus:\n${detail}` : ""}

Buatkan dokumen lengkap dengan semua pasal standar yang diperlukan.`;

    // Retry logic
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
        if (attempt === 2) {
          if (e.name === "AbortError") throw new Error("Koneksi ke AI timeout.");
          throw e;
        }
        continue;
      } finally {
        clearTimeout(timeoutId);
      }
      if (response.ok || ![502, 503, 429].includes(response.status)) break;
      if (attempt < 2) await new Promise(r => setTimeout(r, 2000));
    }

    if (!response?.ok) {
      const status = response?.status || 500;
      let errorDetail = "";
      try {
        const errData = await response?.json();
        errorDetail = errData?.error?.message || errData?.message || "";
      } catch (e) {
        errorDetail = response?.statusText || "";
      }
      console.error(`[LegalKita Generate] AI Error ${status}:`, errorDetail);
      throw new Error(status === 503 ? "Server AI sedang sibuk." : `Gagal menghubungi AI. Status: ${status}`);
    }

    const data = await response.json();
    const contract = data.choices[0]?.message?.content || "";

    // Save to DB (best effort)
    try {
      await supabase.from("consultations").insert({
        user_id: user.id,
        chronology: `[LegalKita Generator] ${contractLabels[contract_type] || contract_type} - ${jenis_usaha}`,
        ai_analysis: contract,
      });
    } catch {}

    return Response.json({ contract });
  } catch (error: any) {
    console.error("[LegalKita Generate]", error?.message);
    return Response.json({ error: error?.message || "Terjadi kesalahan." }, { status: 500 });
  }
}
