import { MusicService } from '@music/services'
import { baseUrl } from '@shared/utils/base-url'
import { normalizeString } from '@utils/normalize-string'
import type { APIRoute } from 'astro'

/**
 * Music Sitemap
 * 
 * @description
 * Generates sitemap for top music/theme pages.
 * Includes the top 1000 most recently updated music themes.
 */
export const GET: APIRoute = async () => {

	try {
		// Fetch top 1000 music themes
		const musicList = await MusicService.getTopMusicForSitemap(1000)

		if (!musicList || musicList.length === 0) {
			return new Response('No music found', { status: 404 })
		}

		const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${musicList
		.map((music) => {
			const lastmod = music.updated_at
				? new Date(music.updated_at).toISOString()
				: new Date().toISOString()
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
