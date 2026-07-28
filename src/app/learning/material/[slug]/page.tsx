import type { Metadata } from "next";
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
  params: Promise<{ slug: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  try {
    const { data: allMaterials } = await supabaseAdmin.from("legal_materials").select("title, content");
    if (!allMaterials) return {};

    const matchedMat = allMaterials.find(m => {
      const matSlug = m.title
        .toLowerCase()
        .replace(/&/g, 'dan')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      return matSlug === decodedSlug;
    });

    if (!matchedMat) return {};

    const shortDesc = matchedMat.content ? matchedMat.content.substring(0, 160).replace(/[#*`]/g, '') : "Materi pembelajaran hukum KonsultanAI";

    return {
      title: `${matchedMat.title} | KonsultanAI Learning`,
      description: shortDesc,
      alternates: {
        canonical: `/learning/material/${decodedSlug}`,
      },
      openGraph: {
        title: `${matchedMat.title} - KonsultanAI`,
        description: shortDesc,
        url: `https://konsultan-ai.com/learning/material/${decodedSlug}`,
      }
    };
  } catch {
    return {};
  }
}

export default async function MaterialPage({ params }: Props) {
  const { slug } = await params;

  // 1. Fetch all materials to match the slug
  const { data: allMaterials, error: matListError } = await supabaseAdmin
    .from("legal_materials")
    .select("id, title");

  if (matListError || !allMaterials) {
    notFound();
  }

  const decodedSlug = decodeURIComponent(slug);

  // Find the material that matches the slug
  const matchedMat = allMaterials.find(m => {
    const matSlug = m.title
      .toLowerCase()
      .replace(/&/g, 'dan')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    return matSlug === decodedSlug;
  });

  if (!matchedMat) {
    console.error("Material not found for slug:", decodedSlug, "Available slugs:", allMaterials.map(m => m.title.toLowerCase().replace(/&/g, 'dan').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')));
    notFound();
  }

  // Fetch the full material details
  const { data: material, error: matError } = await supabaseAdmin
    .from("legal_materials")
    .select("*, legal_categories(name)")
    .eq("id", matchedMat.id)
    .single();

  if (matError || !material) {
    notFound();
  }

  // 2. Fetch Quizzes (Bypass RLS)
  const { data: quizzes } = await supabaseAdmin
    .from("legal_quizzes")
    .select("*")
    .eq("material_id", matchedMat.id);

  // 3. Check User Session & Tier
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let hasAccess = false;
  let userTier = "free";
  let isAdmin = false;

  if (user) {
    // Fetch user tier and role using their authenticated session
    const { data: userData } = await supabase
      .from("users")
      .select("tier, role")
      .eq("id", user.id)
      .single();
      
    if (userData) {
      userTier = userData.tier;
      isAdmin = userData.role === "admin";
    }
  }

  // Tier logic
  if (isAdmin || !material.is_premium) {
    hasAccess = true; // Admins see everything, Free material is free
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
