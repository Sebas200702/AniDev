import type { APIRoute } from 'astro'
import { baseUrl } from '@shared/utils/base-url'

/**
 * Sitemap Index endpoint - Entry point for all sitemaps
 *
 * @description
 * This endpoint generates the main sitemap index that references all sub-sitemaps.
 * It's the entry point for search engines and should be referenced in robots.txt.
 *
 * Sub-sitemaps included:
 * - sitemap-static.xml: Static pages (home, search, schedule, etc.)
 * - sitemap-anime-[index].xml: Anime pages divided in chunks of 5000
 * - sitemap-characters.xml: Top character pages
 * - sitemap-genres.xml: Genre listing pages
 * - sitemap-music.xml: Top music/theme pages
 *
 * @returns XML sitemap index following the sitemaps.org protocol
 */
export const GET: APIRoute = async () => {

	const lastmod = new Date().toISOString()

	// Calculate number of anime sitemaps needed (27k animes / 5k per sitemap = ~6 sitemaps)
	const ANIMES_PER_SITEMAP = 5000
	const TOTAL_ANIMES = 27000 // Approximate total
	const animeeSitemaps = Math.ceil(TOTAL_ANIMES / ANIMES_PER_SITEMAP)

	const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-static.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  ${Array.from({ length: animeeSitemaps }, (_, i) => `
  <sitemap>
    <loc>${baseUrl}/sitemap-anime-${i}.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`).join('')}
  <sitemap>
    <loc>${baseUrl}/sitemap-characters.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-genres.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-music.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`

	return new Response(sitemapIndex, {
		status: 200,
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, s-maxage=3600',
		},
	})
}
