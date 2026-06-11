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
  params: Promise<{ id: string }>
};

export default async function CategoryPage({ params }: Props) {
  const { id } = await params;

  // Fetch Category
  const { data: category, error: catError } = await supabase
    .from("legal_categories")
    .select("*")
    .eq("id", id)
    .single();

  if (catError || !category) {
    notFound();
  }

  // Fetch Materials in this Category
  const { data: materials, error: matError } = await supabase
    .from("legal_materials")
    .select("id, title, content, is_premium, required_tier, order_index")
    .eq("category_id", id)
    .order("order_index", { ascending: true });

  if (matError) console.error("Error fetching materials:", matError);

  return (
    <LearningCategoryClient 
      category={category} 
      materials={materials || []} 
    />
  );
}
