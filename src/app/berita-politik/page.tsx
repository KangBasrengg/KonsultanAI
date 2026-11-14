import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import BeritaPolitikClient, { PoliticalNewsItem } from "./BeritaPolitikClient";

export const metadata: Metadata = {
  title: "Berita & Wawasan Politik Indonesia | KonsultanAI",
  description: "Rangkuman berita politik terupdate, analisis hukum tata negara, kebijakan publik, dan regulasi pemilu terkini di Indonesia yang diperbarui secara otomatis setiap hari.",
  openGraph: {
    title: "Berita & Wawasan Politik Terkini | KonsultanAI",
    description: "Analisis hukum tata negara dan kebijakan publik terupdate di Indonesia.",
    url: "https://konsultan-ai.com/berita-politik",
  },
};

export const revalidate = 60; // Revalidate cache every 60 seconds

const POLITIK_CATEGORY_ID = "c1200000-0000-0000-0000-000000000012";

function extractTag(content: string): string {
  const match = content.match(/Kategori:\s*([^•\n]+)/i);
  if (match) return match[1].trim();
  if (content.includes("Tata Negara")) return "Hukum Tata Negara";
  if (content.includes("Kebijakan")) return "Kebijakan Publik";
  if (content.includes("Pemilu") || content.includes("Pilkada")) return "Pemilu & Pilkada";
  if (content.includes("DPR") || content.includes("Parlemen")) return "Parlemen";
  return "Politik & Regulasi";
}

function extractExcerpt(content: string): string {
  const cleaned = content
    .replace(/^#+.*$/gm, "")
    .replace(/\*.*?\*/g, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .trim();
  const sentences = cleaned.split(/(?<=[.?!])\s+/);
  return sentences.slice(0, 2).join(" ").substring(0, 220) + "...";
}

export default async function BeritaPolitikPage() {
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, supabaseKey);

  const { data: rawMaterials } = await supabase
    .from("legal_materials")
    .select("id, title, content, created_at, order_index")
    .eq("category_id", POLITIK_CATEGORY_ID)
    .order("created_at", { ascending: false });

  const newsItems: PoliticalNewsItem[] = (rawMaterials || []).map((item) => {
    const slug = item.title
      .toLowerCase()
      .replace(/&/g, "dan")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    return {
      id: item.id,
      title: item.title,
      slug,
      tag: extractTag(item.content || ""),
      excerpt: extractExcerpt(item.content || ""),
      createdAt: item.created_at,
    };
  });

  return <BeritaPolitikClient initialNews={newsItems} />;
}

