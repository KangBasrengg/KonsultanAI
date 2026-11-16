import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { ipv4Fetch } from "@/lib/ipv4-fetch";
import {
  POLITIK_CATEGORY_ID,
  toNewsSlug,
  extractNewsTag,
  extractNewsExcerpt,
} from "@/lib/political-news";
import BeritaDetailClient from "./BeritaDetailClient";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

function getSupabaseAdmin() {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    global: { fetch: ipv4Fetch },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    const supabase = getSupabaseAdmin();
    const { data: allArticles } = await supabase
      .from("legal_materials")
      .select("title, content")
      .eq("category_id", POLITIK_CATEGORY_ID);

    const matched = (allArticles || []).find(
      (item) => toNewsSlug(item.title) === decodedSlug
    );

    if (!matched) return {};

    const shortDesc = extractNewsExcerpt(matched.content || "");
    return {
      title: `${matched.title} | Berita Politik KonsultanAI`,
      description: shortDesc,
      alternates: {
        canonical: `/berita-politik/${decodedSlug}`,
      },
      openGraph: {
        title: `${matched.title} - KonsultanAI`,
        description: shortDesc,
        url: `https://konsultan-ai.com/berita-politik/${decodedSlug}`,
      },
    };
  } catch {
    return {};
  }
}

export default async function BeritaPolitikDetailPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const supabase = getSupabaseAdmin();
  const { data: allArticles, error } = await supabase
    .from("legal_materials")
    .select("id, title, content, created_at")
    .eq("category_id", POLITIK_CATEGORY_ID)
    .order("created_at", { ascending: false });

  if (error || !allArticles) {
    notFound();
  }

  const matched = allArticles.find((item) => toNewsSlug(item.title) === decodedSlug);
  if (!matched) {
    notFound();
  }

  const relatedNews = allArticles
    .filter((item) => item.id !== matched.id)
    .slice(0, 3)
    .map((item) => ({
      id: item.id,
      title: item.title,
      slug: toNewsSlug(item.title),
      tag: extractNewsTag(item.content || ""),
      createdAt: item.created_at,
    }));

  return (
    <BeritaDetailClient
      article={{
        id: matched.id,
        title: matched.title,
        slug: decodedSlug,
        tag: extractNewsTag(matched.content || ""),
        content: matched.content || "",
        createdAt: matched.created_at,
      }}
      relatedNews={relatedNews}
    />
  );
}
