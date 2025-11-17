import { CharacterService } from '@character/services'
import { baseUrl } from '@shared/utils/base-url'
import type { APIRoute } from 'astro'

/**
 * Characters Sitemap
 * 
 * @description
 * Generates sitemap for top character pages.
 * Includes the most popular characters to avoid excessive URLs.
 */
export const GET: APIRoute = async () => {

	try {
		// Fetch top 1000 characters by favorites
		const characters = await CharacterService.getCharactersForSitemap(1000)

		if (!characters || characters.length === 0) {
			return new Response('No characters found', { status: 404 })
		}

		const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${characters.map(character => {
		const lastmod = character.updated_at
			? new Date(character.updated_at).toISOString()
			: new Date().toISOString()
		return `
  <url>
    <loc>${baseUrl}/character/${character.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
	}).join('')}
</urlset>`

		return new Response(sitemap, {
			status: 200,
			headers: {
				'Content-Type': 'application/xml; charset=utf-8',
				'Cache-Control': 'public, max-age=7200, s-maxage=7200',
			},
		})
	} catch (error) {
		console.error('Error generating characters sitemap:', error)
		return new Response('Error generating sitemap', { status: 500 })
	}
}
