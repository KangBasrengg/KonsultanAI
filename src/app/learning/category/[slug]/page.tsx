import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import LearningCategoryClient from "./LearningCategoryClient";

export const revalidate = 60;

const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAdminKey
);

type Props = {
  params: Promise<{ slug: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { data: allCategories } = await supabase.from("legal_categories").select("name, description");
    if (!allCategories) return {};

    const category = allCategories.find(cat => {
      const catSlug = cat.name
        .toLowerCase()
        .replace(/&/g, 'dan')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      return catSlug === slug;
    });

    if (!category) return {};

    return {
      title: `Kategori ${category.name} | KonsultanAI Learning`,
      description: category.description || `Pelajari materi hukum kategori ${category.name} bersama KonsultanAI.`,
      alternates: {
        canonical: `/learning/category/${slug}`,
      },
      openGraph: {
        title: `${category.name} - KonsultanAI Learning Center`,
        description: category.description || `Pelajari materi hukum kategori ${category.name}`,
        url: `https://konsultan-ai.com/learning/category/${slug}`,
      }
    };
  } catch {
    return {};
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  // Fetch all Categories to match the slug
  const { data: allCategories, error: catListError } = await supabase
    .from("legal_categories")
    .select("*");

  if (catListError || !allCategories) {
    notFound();
  }

  // Find the category that matches the slug
  const category = allCategories.find(cat => {
    const catSlug = cat.name
      .toLowerCase()
      .replace(/&/g, 'dan')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    return catSlug === slug;
  });

  if (!category) {
    notFound();
  }

  // Fetch Materials in this Category using the matched ID
  const { data: materials, error: matError } = await supabase
    .from("legal_materials")
    .select("id, title, content, is_premium, required_tier, order_index")
    .eq("category_id", category.id)
    .order("order_index", { ascending: true });

  if (matError) console.error("Error fetching materials:", matError);

  const formattedMaterials = (materials || []).map(mat => ({
    ...mat,
    slug: mat.title
      .toLowerCase()
      .replace(/&/g, 'dan')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
  }));

  return (
    <LearningCategoryClient 
      category={category} 
      materials={formattedMaterials} 
    />
  );
}
