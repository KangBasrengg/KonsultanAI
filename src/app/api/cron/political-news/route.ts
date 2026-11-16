import { createClient } from "@supabase/supabase-js";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { revalidatePath } from "next/cache";
import dns from "node:dns";
import { ipv4Fetch, ipv4FetchWithRetry } from "@/lib/ipv4-fetch";

try {
  dns.setDefaultResultOrder("ipv4first");
} catch (e) {}

export const dynamic = "force-dynamic";

const POLITIK_CATEGORY_ID = "c1200000-0000-0000-0000-000000000012";
const CRON_SECRET = process.env.CRON_SECRET || "konsultanai_cron_2026";

function getSupabaseAdmin() {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  let key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  try {
    const cfContext = getCloudflareContext();
    if (cfContext?.env) {
      url = url || (cfContext.env as any).NEXT_PUBLIC_SUPABASE_URL;
      key = key || (cfContext.env as any).SUPABASE_SERVICE_ROLE_KEY || (cfContext.env as any).NEXT_PUBLIC_SUPABASE_ANON_KEY;
    }
  } catch {}
  return createClient(url, key, {
    global: { fetch: ipv4Fetch },
  });
}

function getApiKey() {
  let key = (process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "").trim();
  if (!key) {
    try {
      const cfContext = getCloudflareContext();
      if (cfContext?.env) {
        key = ((cfContext.env as any).GOOGLE_GEMINI_API_KEY || (cfContext.env as any).GEMINI_API_KEY || "").trim();
      }
    } catch {}
  }
  return key;
}

export async function GET(req: Request) {
  return handleFetchNews(req);
}

export async function POST(req: Request) {
  return handleFetchNews(req);
}

async function handleFetchNews(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret") || req.headers.get("x-cron-secret") || "";

    const authHeader = req.headers.get("authorization") || "";
    const isAuthorized =
      secret === CRON_SECRET ||
      authHeader === `Bearer ${CRON_SECRET}` ||
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1";

    if (!isAuthorized && process.env.NODE_ENV === "production") {
      return Response.json({ success: false, error: "Unauthorized cron access" }, { status: 401 });
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      return Response.json({ success: false, error: "Google Gemini API Key tidak ditemukan." }, { status: 500 });
    }

    const supabase = getSupabaseAdmin();

    // Ensure category exists
    const { error: catErr } = await supabase.from("legal_categories").upsert({
      id: POLITIK_CATEGORY_ID,
      name: "Berita Politik & Tata Negara",
      description: "Rangkuman berita politik terupdate, dinamika kebijakan publik, regulasi pemerintah, dan analisis hukum tata negara Indonesia."
    });
    if (catErr) {
      console.error("[Cron Political News] Category upsert error:", catErr.message);
    }

    // Fetch recent titles to avoid duplicate topics across days
    const { data: recentNews } = await supabase
      .from("legal_materials")
      .select("title")
      .eq("category_id", POLITIK_CATEGORY_ID)
      .order("created_at", { ascending: false })
      .limit(12);

    const existingTitlesList = (recentNews || []).map((r) => `- ${r.title}`).join("\n");

    const currentDateStr = new Date().toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const systemPrompt = `Anda adalah Jurnalis Ahli Hukum & Politik Tata Negara Indonesia untuk KonsultanAI.
Tugas Anda: Menghasilkan 4 artikel berita politik terupdate dan analisis mendalam seputar dinamika politik, regulasi pemerintah, DPR, Mahkamah Konstitusi, pilkada/pemilu, dan kebijakan publik Indonesia terkini untuk tanggal ${currentDateStr}.

Setiap artikel WAJIB memiliki:
1. "title": Judul berita yang menarik, faktual, objektif, dan bernuansa edukasi hukum politik.
2. "tag": Tag kategori (pilih dari: "Hukum Tata Negara", "Kebijakan Publik", "Pemilu & Pilkada", "Parlemen", "Etika Pejabat").
3. "excerpt": Ringkasan singkat 2-3 kalimat yang mudah dipahami masyarakat umum.
4. "content": Artikel lengkap berformat Markdown kaya (minimal 4-6 paragraf) yang memuat:
   - Fakta & Latar Belakang Peristiwa Politik Terkini
   - Landasan Regulasi & Pasal Hukum Terkait (UUD 1945, UU Pemilu, UU MD3, atau UU terkait lainnya)
   - Analisis Implikasi terhadap Masyarakat & Demokrasi Indonesia
   - Catatan Edukasi & Rekomendasi Sikap Kritis Warga Negara

Berikan output dalam format JSON murni dengan key "news" berisi array objek artikel.`;

    const userPrompt = `Tarik dan susunlah 4 rangkuman berita politik paling krusial, faktual, dan aktual di Indonesia per hari ini (${currentDateStr}) beserta telaah hukum tata negaranya.${
      existingTitlesList
        ? `\n\nPENTING: Jangan ulangi topik atau judul yang mirip dengan berita sebelumnya:\n${existingTitlesList}`
        : ""
    }`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 75000);

    let rawText = "";
    try {
      const response = await ipv4FetchWithRetry(
        "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gemini-3.5-flash-lite",
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ]
          }),
          signal: controller.signal
        },
        2,
        1500
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API Error (${response.status}): ${errText.slice(0, 300)}`);
      }

      const data = await response.json();
      rawText = data.choices[0]?.message?.content || "";
    } finally {
      clearTimeout(timeoutId);
    }

    let newsList: Array<{ title: string; tag: string; excerpt: string; content: string }> = [];

    try {
      const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      newsList = Array.isArray(parsed) ? parsed : (parsed.news || parsed.articles || []);
    } catch (parseError) {
      console.error("[Cron Political News] JSON Parse failed:", rawText);
      throw new Error("Gagal mem-parsing output berita politik dari model AI.");
    }

    const insertedTitles: string[] = [];

    for (let i = 0; i < newsList.length; i++) {
      const item = newsList[i];
      if (!item.title || !item.content) continue;

      const { data: existing } = await supabase
        .from("legal_materials")
        .select("id")
        .eq("category_id", POLITIK_CATEGORY_ID)
        .ilike("title", item.title.trim())
        .limit(1);

      if (existing && existing.length > 0) {
        continue;
      }

      const formattedContent = `${item.content}\n\n---\n*Kategori: ${item.tag || "Politik & Tata Negara"} • Diperbarui otomatis oleh KonsultanAI News Engine pada ${currentDateStr}.*`;

      const { error: insertError } = await supabase.from("legal_materials").insert({
        category_id: POLITIK_CATEGORY_ID,
        title: item.title.trim(),
        content: formattedContent,
        order_index: i + 1,
        is_premium: false,
        required_tier: "free"
      });

      if (!insertError) {
        insertedTitles.push(item.title.trim());
      } else {
        console.warn("[Cron Political News] Insert item error:", insertError);
      }
    }

    try {
      revalidatePath("/berita-politik");
    } catch {}

    return Response.json({
      success: true,
      message: `Berhasil menarik ${insertedTitles.length} berita politik terbaru.`,
      added_count: insertedTitles.length,
      news: insertedTitles,
      pulled_at: new Date().toISOString()
    });
  } catch (error: any) {
    const code = error?.cause?.code || error?.code;
    const rawMsg = error?.cause?.message || error?.message || "Internal server error";
    const detailedMsg = code ? `${rawMsg} (${code})` : rawMsg;
    console.error("[Cron Political News] Failed:", detailedMsg, error);
    return Response.json({
      success: false,
      error: detailedMsg
    }, { status: 500 });
  }
}
