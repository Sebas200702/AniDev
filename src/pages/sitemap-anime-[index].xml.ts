import { AnimeService } from '@anime/services'
import { baseUrl } from '@shared/utils/base-url'
import { normalizeString } from '@utils/normalize-string'
import type { APIRoute } from 'astro'

/**
 * Anime Pages Sitemap (Paginated)
 *
 * @description
 * Generates paginated sitemaps for anime pages. Each sitemap contains up to 5000 URLs
 * to comply with Google's sitemap best practices.
 *
 * Route: /sitemap-anime-[index].xml
 * - sitemap-anime-0.xml: Animes 0-4999
 * - sitemap-anime-1.xml: Animes 5000-9999
 * - etc...
 *
 * Animes are ordered by popularity/score to prioritize important content.
 */
export const GET: APIRoute = async ({ params }) => {
  const index = Number.parseInt(params.index || '0')
  const ITEMS_PER_SITEMAP = 5000
  const offset = index * ITEMS_PER_SITEMAP

  try {
    // Fetch animes with pagination and ordering by score/popularity
    const animes = await AnimeService.getAnimesForSitemap(
      offset,
      ITEMS_PER_SITEMAP
    )

    if (!animes || animes.length === 0) {
      return new Response('No animes found for this index', { status: 404 })
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${animes
    .map((anime) => {
      const lastmod = new Date().toISOString()
      return `
  <url>
    <loc>${baseUrl}/anime/${normalizeString(anime.title)}_${anime.mal_id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    })
    .join('')}
</urlset>`

    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=7200, s-maxage=7200', // 2 hours cache
      },
    })
  } catch (error) {
    console.error('Error generating anime sitemap:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
}

export async function getStaticPaths() {
  // Generate paths for 6 sitemaps (27k animes / 5k per sitemap)
  const TOTAL_SITEMAPS = 6
  return Array.from({ length: TOTAL_SITEMAPS }, (_, i) => ({
    params: { index: i.toString() },
  }))
}
