import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/konsultasi/',
        '/pengaturan/',
        '/chat/',
        '/konsultasi-advokat/',
        '/admin/',
        '/api/',
      ],
    },
    sitemap: 'https://konsultan-ai.com/sitemap.xml',
  }
}
