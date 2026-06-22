import { createClient } from "@supabase/supabase-js";
import LearningCenterClient, { CategoryData, CourseData } from "./LearningCenterClient";
import { Shield, Scale, Briefcase, Monitor } from "lucide-react";

// Initialize Supabase Admin Client to bypass RLS and fetch catalog
// Fallback to anon key if service role key is missing (to prevent crash)
const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAdminKey
);

export const revalidate = 60; // Revalidate cache every 60 seconds

export default async function LearningCenterPage() {
  // Fetch Categories with their material counts
  const { data: categoriesData, error: catError } = await supabase
    .from("legal_categories")
    .select(`
      id, 
      name, 
      description,
      legal_materials ( id )
    `);

  if (catError) console.error("Error fetching categories:", catError);

  // Fetch Featured Courses (Top 3 materials)
  const { data: coursesData, error: courseError } = await supabase
    .from("legal_materials")
    .select(`
      id,
      title,
      is_premium,
      legal_categories ( name )
    `)
    .order("order_index", { ascending: true })
    .limit(3);

  if (courseError) console.error("Error fetching courses:", courseError);

  // Map category data to UI Format
  const getCategoryTheme = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("pidana")) return { icon: <Shield className="w-6 h-6 text-red-400" />, color: "from-red-500/20 to-red-900/20", border: "border-red-500/30" };
    if (lowerName.includes("perdata")) return { icon: <Scale className="w-6 h-6 text-blue-400" />, color: "from-blue-500/20 to-blue-900/20", border: "border-blue-500/30" };
    if (lowerName.includes("bisnis")) return { icon: <Briefcase className="w-6 h-6 text-gold" />, color: "from-gold/20 to-yellow-900/20", border: "border-gold/30" };
    return { icon: <Monitor className="w-6 h-6 text-purple-400" />, color: "from-purple-500/20 to-purple-900/20", border: "border-purple-500/30" };
  };

  const formattedCategories: CategoryData[] = (categoriesData || []).map((cat) => {
    // Generate slug from name
    const slug = cat.name
      .toLowerCase()
      .replace(/&/g, 'dan')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    return {
      id: cat.id,
      slug,
      title: cat.name,
      desc: cat.description || "",
      ...getCategoryTheme(cat.name),
      // @ts-ignore
      topics: cat.legal_materials ? cat.legal_materials.length : 0,
    };
  });

  // Map courses to UI format
  const formattedCourses: CourseData[] = (coursesData || []).map((course: any) => ({
    id: course.id,
    slug: course.title
      .toLowerCase()
      .replace(/&/g, 'dan')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, ''),
    title: course.title,
    category: course.legal_categories?.name || "Umum",
    duration: "45 Menit", // Dummy duration since we don't have it in schema yet
    premium: course.is_premium,
    image: "bg-gradient-to-br from-navy-light to-navy",
  }));

  return <LearningCenterClient categories={formattedCategories} featuredCourses={formattedCourses} />;
}
