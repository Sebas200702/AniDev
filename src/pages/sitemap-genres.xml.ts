import { GenreService } from '@shared/services/genre-service'
import { baseUrl } from '@shared/utils/base-url'
import type { APIRoute } from 'astro'

/**
 * Genres Sitemap
 *
 * @description
 * Generates sitemap for genre listing pages.
 * Each genre has a dedicated page showing all animes in that category.
 */
export const GET: APIRoute = async () => {
  try {
    // Fetch all genres
    const genres = await GenreService.getAllGenresForSitemap()

    if (!genres || genres.length === 0) {
      return new Response('No genres found', { status: 404 })
    }

    const lastmod = new Date().toISOString()

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${genres
    .map(
      (genre) => `
  <url>
    <loc>${baseUrl}/search?genres=${genre.mal_id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
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
    console.error('Error generating genres sitemap:', error)
    return new Response('Error generating sitemap', { status: 500 })
  }
}
