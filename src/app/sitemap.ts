import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { templates } from '@/lib/templates-data'

const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://konsultan-ai.com'

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/legalkita`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/legalkita/generator`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/legalkita/chat`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/legalkita/review`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/intake`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/marketplace`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/learning`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  // Add all static document template detail pages for high SEO organic search value
  const templateRoutes: MetadataRoute.Sitemap = templates.map((tmpl) => ({
    url: `${baseUrl}/templates/${tmpl.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  if (!supabaseUrl || !supabaseAdminKey) {
    return [...staticRoutes, ...templateRoutes]
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAdminKey)

    // Fetch categories for sitemap
    const { data: categories } = await supabase.from('legal_categories').select('name')
    const categoryRoutes: MetadataRoute.Sitemap = (categories || []).map((cat) => ({
      url: `${baseUrl}/learning/category/${cat.name
        .toLowerCase()
        .replace(/&/g, 'dan')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    // Fetch materials for sitemap
    const { data: materials } = await supabase.from('legal_materials').select('title')
    const materialRoutes: MetadataRoute.Sitemap = (materials || []).map((mat) => ({
      url: `${baseUrl}/learning/material/${mat.title
        .toLowerCase()
        .replace(/&/g, 'dan')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    return [...staticRoutes, ...templateRoutes, ...categoryRoutes, ...materialRoutes]
  } catch (err) {
    console.error('Error fetching sitemap routes from Supabase:', err)
    return [...staticRoutes, ...templateRoutes]
  }
}
