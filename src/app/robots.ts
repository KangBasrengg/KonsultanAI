import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/konsultasi/', '/api/'], // Sembunyikan halaman privat dan API
    },
    // Ganti dengan URL domain Vercel kamu nanti
    sitemap: 'https://konsultan-ai.com/sitemap.xml',
  }
}
