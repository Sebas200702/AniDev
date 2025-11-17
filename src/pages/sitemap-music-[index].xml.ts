import { MusicService } from '@music/services'
import { baseUrl } from '@shared/utils/base-url'
import { normalizeString } from '@utils/normalize-string'
import type { APIRoute } from 'astro'

/**
 * Music Sitemap (Paginated)
 *
 * @description
 * Generates paginated sitemaps for music/theme pages. Each sitemap contains up to 5000 URLs
 * to comply with Google's sitemap best practices.
 *
 * Route: /sitemap-music-[index].xml
 * - sitemap-music-0.xml: Music 0-4999
 * - sitemap-music-1.xml: Music 5000-9999
 * - etc...
 */
export const GET: APIRoute = async ({ params }) => {
  const index = Number.parseInt(params.index || '0')
  const ITEMS_PER_SITEMAP = 5000
  const offset = index * ITEMS_PER_SITEMAP

  try {
    // Fetch music with pagination
    const musicList = await MusicService.getMusicForSitemap(
      offset,
      ITEMS_PER_SITEMAP
    )

    if (!musicList || musicList.length === 0) {
      return new Response('No music found for this index', { status: 404 })
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${musicList
    .map((music) => {
      const lastmod = new Date().toISOString()
      const slug = `${normalizeString(music.song_title)}_${music.theme_id}`
      return `
  <url>
    <loc>${baseUrl}/music/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    })
    .join('')}
</urlset>`

    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=7200, s-maxage=7200',
      },
    })
  } catch (error) {
    console.error('Error generating music sitemap:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
}

export async function getStaticPaths() {
  // Generate paths for music sitemaps (estimate: 10k music / 5k per sitemap = 2 sitemaps)
  const TOTAL_SITEMAPS = 4
  return Array.from({ length: TOTAL_SITEMAPS }, (_, i) => ({
    params: { index: i.toString() },
  }))
}
