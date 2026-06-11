import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import LearningMaterialClient from "./LearningMaterialClient";

export const revalidate = 0; // Dynamic component since it relies on user session

const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAdminKey
);

type Props = {
  params: Promise<{ id: string }>
};

export default async function MaterialPage({ params }: Props) {
  const { id } = await params;

  // 1. Fetch Material details (Bypass RLS to check existence and metadata)
  const { data: material, error: matError } = await supabaseAdmin
    .from("legal_materials")
    .select("*, legal_categories(name)")
    .eq("id", id)
    .single();

  if (matError || !material) {
    notFound();
  }

  // 2. Fetch Quizzes (Bypass RLS)
  const { data: quizzes } = await supabaseAdmin
    .from("legal_quizzes")
    .select("*")
    .eq("material_id", id);

  // 3. Check User Session & Tier
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let hasAccess = false;
  let userTier = "free";

  if (user) {
    // Fetch user tier using their authenticated session
    const { data: userData } = await supabase
      .from("users")
      .select("tier")
      .eq("id", user.id)
      .single();
      
    if (userData) {
      userTier = userData.tier;
    }
  }

  // Tier logic
  if (!material.is_premium) {
    hasAccess = true; // Free material
  } else if (user) {
    const tierLevels = { free: 0, basic: 1, professional: 2, business: 3 };
    const requiredLevel = tierLevels[material.required_tier as keyof typeof tierLevels] || 0;
    const userLevel = tierLevels[userTier as keyof typeof tierLevels] || 0;
    
    if (userLevel >= requiredLevel) {
      hasAccess = true;
    }
  }

  return (
    <LearningMaterialClient 
      material={material} 
      quizzes={quizzes || []} 
      hasAccess={hasAccess}
      isLoggedIn={!!user}
    />
  );
}
