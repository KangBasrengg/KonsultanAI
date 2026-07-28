import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { createClient } from "@/lib/supabase/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { IntakeFormData, TriageResult, TriageRecommendation } from "@/types/cases";

const TRIAGE_SYSTEM_PROMPT = `Anda adalah AI Legal Case Classifier yang ahli dalam hukum Indonesia. 
Tugas Anda: menganalisis kasus hukum berdasarkan intake form dan memberikan triage yang akurat.

Anda WAJIB merespons dalam format JSON yang valid (tanpa markdown code block) dengan struktur berikut:
{
  "severity": <number 1-5>,
  "recommendation": "<AI_ANALYSIS | LEARNING_FIRST | ADVOKAT_URGENT | TEMPLATES>",
  "analysis": "<string - analisis awal kasus dalam bahasa Indonesia yang mudah dipahami, 2-3 paragraf>",
  "recommended_modules": ["<module_id_1>", "<module_id_2>"],
  "recommended_templates": ["<template_id_1>", "<template_id_2>"],
  "follow_up_questions": ["<pertanyaan lanjutan 1>", "<pertanyaan lanjutan 2>"]
}

Panduan Severity:
- 1 (Very Low): Pertanyaan umum, edukasi dasar hukum
- 2 (Low): Kasus ringan, bisa diselesaikan dengan pemahaman hukum dasar
- 3 (Medium): Kasus perlu analisis mendalam, potensi litigasi
- 4 (High): Kasus serius, butuh advokat segera (kerugian besar, kekerasan)
- 5 (Critical): Kasus mendesak, ancaman keselamatan, penahanan

Panduan Recommendation:
- LEARNING_FIRST: Severity 1-2, urgency normal/planning → Sarankan belajar dulu
- AI_ANALYSIS: Severity 2-3, urgency normal → Analisis AI mendalam
- ADVOKAT_URGENT: Severity 3-5, urgency immediate → Langsung hubungkan ke advokat
- TEMPLATES: Severity 1-2, kasus bersifat administratif → Sarankan template dokumen

Module IDs yang tersedia:
- hukum_pidana, hukum_perdata, hukum_keluarga, hukum_bisnis, hukum_konsumen, hukum_ite, hukum_teknologi

Template IDs yang tersedia:
- somasi_penipuan, somasi_wanprestasi, somasi_generic
- perjanjian_pinjam, perjanjian_sewa, perjanjian_kerjasama
- kuasa_litigasi, kuasa_administrasi, kuasa_generic
- perceraian_gugat, perceraian_dokumen
- kerja_perjanjian, kerja_phk`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const formData: IntakeFormData = body;

    // Validate required fields
    if (!formData.case_type || !formData.sub_category || !formData.kronologi || !formData.wilayah || !formData.urgency_level) {
      return Response.json({ error: "Semua field wajib harus diisi." }, { status: 400 });
    }

    if (formData.kronologi.length < 100) {
      return Response.json({ error: "Kronologi minimal 100 karakter." }, { status: 400 });
    }

    // Check authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Anda harus login terlebih dahulu." }, { status: 401 });
    }

    // Check free trial limit (3 intake form for free users)
    const { data: profile } = await supabase
      .from("users")
      .select("is_premium, role, tier")
      .eq("id", user.id)
      .single();

    const isAdmin = profile?.role === "admin";

    if (!isAdmin && profile?.tier !== "premium" && profile?.tier !== "pro" && profile?.tier !== "enterprise") {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const { count } = await supabase
        .from("cases")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", threeDaysAgo.toISOString());

      if (count !== null && count >= 3) {
        return Response.json({
          error: "Limit_Exceeded",
          message: "Limit uji coba gratis Anda telah habis (3x). Limit akan di-reset setiap 3 hari sekali. Silakan upgrade paket untuk akses tanpa batas."
        }, { status: 403 });
      }
    }

    // Initialize AI provider
    const envVarName = "GOOGLE_GEMINI_API_KEY";
    let apiKey = (process.env[envVarName] || process.env.GEMINI_API_KEY || "").trim();
    
    if (!apiKey) {
      try {
        const cfContext = getCloudflareContext();
        if (cfContext && cfContext.env) {
          apiKey = ((cfContext.env as any)[envVarName] || "").trim();
        }
      } catch (e) {
        console.warn("[Cases API] getCloudflareContext failed", e);
      }
    }

    if (!apiKey) {
      return Response.json({ error: "API Key tidak ditemukan." }, { status: 500 });
    }

    const triagePrompt = `
Analisis kasus berikut:
- Jenis Kasus: ${formData.case_type} (${formData.sub_category})
- Wilayah: ${formData.wilayah}
- Tingkat Urgensi: ${formData.urgency_level}
- Sudah punya advokat: ${formData.sudah_advokat ? 'Ya' : 'Tidak'}
- Sudah lapor polisi: ${formData.sudah_lapor_polisi ? 'Ya' : 'Tidak'}
${formData.jumlah_nilai ? `- Nilai kerugian: Rp ${formData.jumlah_nilai.toLocaleString('id-ID')}` : ''}

Kronologi:
${formData.kronologi}

Berikan triage dalam format JSON sesuai instruksi.`;

    // Retry logic for transient API errors (503, 502, 429)
    const MAX_RETRIES = 2;
    const RETRY_DELAY_MS = 2000;
    let response: Response | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000);

      try {
        response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gemini-2.0-flash",
            messages: [
              { role: "system", content: TRIAGE_SYSTEM_PROMPT },
              { role: "user", content: triagePrompt }
            ]
          }),
          signal: controller.signal
        });
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (attempt === MAX_RETRIES) {
          if (fetchError.name === 'AbortError') {
            throw new Error("Koneksi ke AI terputus karena terlalu lama (timeout). Silakan coba lagi.");
          }
          console.error("[Cases API] Final fetch error:", fetchError?.message || fetchError);
          throw new Error("Gagal terhubung ke server Google AI (masalah koneksi atau jaringan). Silakan coba kembali dalam beberapa saat.");
        }
        console.warn(`[Cases API] Fetch error attempt ${attempt + 1}/${MAX_RETRIES + 1}, retrying...`, fetchError?.message);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        continue;
      } finally {
        clearTimeout(timeoutId);
      }

      // If success or non-retryable error, break
      if (response && (response.ok || ![502, 503, 429].includes(response.status))) {
        break;
      }

      // Retryable error — log and wait before retry
      console.warn(`[Cases API] AI API returned ${response.status}, attempt ${attempt + 1}/${MAX_RETRIES + 1}`);
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }

    if (!response || !response.ok) {
      const status = response?.status || 500;
      const errText = response ? await response.text() : 'No response';
      console.error("[Cases API] AI API Error after retries:", status, errText);
      throw new Error(
        status === 503
          ? "Server AI sedang sibuk (overloaded). Silakan tunggu 1-2 menit lalu coba lagi."
          : status === 429
          ? "Terlalu banyak permintaan ke AI. Silakan tunggu beberapa saat lalu coba lagi."
          : "Gagal menghubungi server AI. Silakan coba lagi nanti."
      );
    }

    const data = await response.json();
    const triageText = data.choices[0]?.message?.content || "";
    console.log("[Cases API] Triage response:", triageText.substring(0, 200));

    // Parse triage result
    let triageData: any;
    try {
      // Clean possible markdown code block wrapping
      const cleaned = triageText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      triageData = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("[Cases API] Failed to parse triage JSON:", parseError);
      // Fallback triage
      triageData = {
        severity: 3,
        recommendation: "AI_ANALYSIS",
        analysis: triageText,
        recommended_modules: [],
        recommended_templates: [],
        follow_up_questions: [],
      };
    }

    // Insert case into database
    const { data: caseRecord, error: insertError } = await supabase
      .from("cases")
      .insert({
        user_id: user.id,
        case_type: formData.case_type,
        sub_category: formData.sub_category,
        kronologi: formData.kronologi,
        wilayah: formData.wilayah,
        jumlah_nilai: formData.jumlah_nilai || 0,
        urgency_level: formData.urgency_level,
        sudah_advokat: formData.sudah_advokat,
        sudah_lapor_polisi: formData.sudah_lapor_polisi,
        triage_severity: triageData.severity,
        triage_recommendation: triageData.recommendation,
        triage_result: triageData.analysis,
        recommended_modules: triageData.recommended_modules || [],
        status: "open",
      })
      .select()
      .single();

    if (insertError) {
      console.error("[Cases API] Insert error:", insertError);
      return Response.json({ error: "Gagal menyimpan kasus." }, { status: 500 });
    }

    // Also insert anonymized record into case_analytics (best-effort)
    try {
      // Determine province from wilayah (simplified mapping)
      const provinceMap: Record<string, string> = {
        'Jakarta Pusat': 'DKI Jakarta', 'Jakarta Barat': 'DKI Jakarta',
        'Jakarta Timur': 'DKI Jakarta', 'Jakarta Selatan': 'DKI Jakarta',
        'Jakarta Utara': 'DKI Jakarta', 'Bandung': 'Jawa Barat',
        'Bekasi': 'Jawa Barat', 'Bogor': 'Jawa Barat', 'Depok': 'Jawa Barat',
        'Surabaya': 'Jawa Timur', 'Malang': 'Jawa Timur',
        'Semarang': 'Jawa Tengah', 'Solo': 'Jawa Tengah',
        'Yogyakarta': 'DI Yogyakarta', 'Medan': 'Sumatera Utara',
        'Makassar': 'Sulawesi Selatan', 'Denpasar': 'Bali',
        'Tangerang': 'Banten', 'Tangerang Selatan': 'Banten',
      };

      await supabase
        .from("case_analytics")
        .insert({
          case_type: formData.case_type,
          sub_category: formData.sub_category,
          severity_level: triageData.severity,
          urgency_level: formData.urgency_level,
          wilayah_kabupaten: formData.wilayah,
          wilayah_provinsi: provinceMap[formData.wilayah] || 'Lainnya',
          has_advokat: formData.sudah_advokat,
        });
    } catch (analyticsError) {
      console.warn("[Cases API] Analytics insert failed (non-critical):", analyticsError);
    }

    // Build response
    const triageResult: TriageResult = {
      case_id: caseRecord.id,
      severity: triageData.severity,
      recommendation: triageData.recommendation as TriageRecommendation,
      analysis: triageData.analysis,
      recommended_modules: triageData.recommended_modules || [],
      recommended_templates: triageData.recommended_templates || [],
      follow_up_questions: triageData.follow_up_questions || [],
    };

    return Response.json(triageResult);
  } catch (error: any) {
    let msg = error?.message || "Terjadi kesalahan saat memproses kasus Anda.";
    if (msg === "fetch failed" || msg.includes("ECONNRESET") || msg.includes("ENOTFOUND")) {
      msg = "Gagal terhubung ke server AI (gangguan koneksi atau jaringan). Silakan coba lagi dalam beberapa saat.";
    }
    console.error("[Cases API] Error:", msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}
