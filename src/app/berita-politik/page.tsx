import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import BeritaPolitikClient, { PoliticalNewsItem } from "./BeritaPolitikClient";
import { ipv4Fetch } from "@/lib/ipv4-fetch";
import {
  POLITIK_CATEGORY_ID,
  toNewsSlug,
  extractNewsTag,
  extractNewsExcerpt,
} from "@/lib/political-news";

export const metadata: Metadata = {
  title: "Berita & Wawasan Politik Indonesia | KonsultanAI",
  description: "Rangkuman berita politik terupdate, analisis hukum tata negara, kebijakan publik, dan regulasi pemilu terkini di Indonesia yang diperbarui secara otomatis setiap hari.",
  openGraph: {
    title: "Berita & Wawasan Politik Terkini | KonsultanAI",
    description: "Analisis hukum tata negara dan kebijakan publik terupdate di Indonesia.",
    url: "https://konsultan-ai.com/berita-politik",
  },
};

export const dynamic = "force-dynamic";

export default async function BeritaPolitikPage() {
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, supabaseKey, {
    global: { fetch: ipv4Fetch },
  });

  const { data: rawMaterials } = await supabase
    .from("legal_materials")
    .select("id, title, content, created_at, order_index")
    .eq("category_id", POLITIK_CATEGORY_ID)
    .order("created_at", { ascending: false });

  const newsItems: PoliticalNewsItem[] = (rawMaterials || []).map((item) => ({
    id: item.id,
    title: item.title,
    slug: toNewsSlug(item.title),
    tag: extractNewsTag(item.content || ""),
    excerpt: extractNewsExcerpt(item.content || ""),
    createdAt: item.created_at,
  }));

  return <BeritaPolitikClient initialNews={newsItems} />;
}
