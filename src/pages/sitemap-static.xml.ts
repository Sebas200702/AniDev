import { baseUrl } from '@shared/utils/base-url'
import type { APIRoute } from 'astro'

/**
 * Static Pages Sitemap
 *
 * @description
 * Contains all static pages with high priority for SEO:
 * - Homepage
 * - Search
 * - Schedule
 * - Music
 * - Auth pages
 *
 * These pages are updated frequently and have high priority for indexing.
 */
export const GET: APIRoute = async () => {
  const lastmod = new Date().toISOString()

  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' }, // Homepage
    { url: 'search', priority: '0.9', changefreq: 'daily' },
    { url: 'schedule', priority: '0.9', changefreq: 'daily' },
    { url: 'music', priority: '0.8', changefreq: 'weekly' },
    { url: 'signin', priority: '0.5', changefreq: 'monthly' },
    { url: 'signup', priority: '0.5', changefreq: 'monthly' },
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}/${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('')}
</urlset>`

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
