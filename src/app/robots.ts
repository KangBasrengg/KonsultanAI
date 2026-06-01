import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/konsultasi/', '/api/'], // Sembunyikan halaman privat dan API
    },
    // Ganti dengan URL domain Cloudflare kamu nanti (contoh: https://konsultanai.pages.dev)
    sitemap: 'https://konsultanai.pages.dev/sitemap.xml',
  }
}
