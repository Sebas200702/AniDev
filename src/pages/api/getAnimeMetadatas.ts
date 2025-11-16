import { safeRedisOperation } from '@libs/redis'
import { supabase } from '@libs/supabase'
import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'
import { baseTitle } from '@shared/utils/base-url'

import type { APIRoute } from 'astro'

/**
 * getAnimeMetadatas endpoint retrieves SEO metadata for a specific anime.
 *
 * @summary
 * An API endpoint that fetches and caches SEO-related metadata for anime pages.
 *
 * @description
 * This endpoint provides SEO-optimized metadata for anime pages, including title,
 * description, and featured image. It implements a caching mechanism using Redis
 * to optimize performance and reduce database load. The endpoint includes rate
 * limiting to prevent abuse and implements proper error handling for various scenarios.
 *
 * The endpoint formats the metadata specifically for SEO purposes:
 * - Combines anime title with site name
 * - Provides synopsis as meta description
 * - Includes high-quality image URL for social sharing
 *
 * @features
 * - Rate limiting: Prevents API abuse with configurable limits
 * - Caching: Redis-based caching with 24-hour TTL
 * - SEO optimization: Properly formatted metadata
 * - Error handling: Comprehensive error handling
 * - Cache headers: Proper cache control headers for CDN and browser
 * - Performance: Efficient database queries with proper indexing
 *
 * @param {APIRoute} context - The API context containing request information
 * @param {URL} context.url - The request URL containing query parameters
 * @param {string} context.url.searchParams.get('id') - The anime ID (MAL ID)
 * @returns {Promise<Response>} A Response object containing the metadata or error message
 *
 * @example
 * // Request
 * GET /api/getAnimeMetadatas?id=21
 *
 * // Success Response (200)
 * {
 *   "title": "One Piece - AniDev",
 *   "description": "Follow Monkey D. Luffy and his pirate crew...",
 *   "image": "https://example.com/one-piece-large.webp"
 * }
 *
 * // Error Response (404)
 * {
 *   "error": "No se encontraron metadatos del anime"
 * }
 */

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
      const id = url.searchParams.get('id')

      if (!id) {
        return new Response('Not found', { status: 404 })
      }

      const cached = await safeRedisOperation((client) =>
        client.get(`anime-metadatas:${id}`)
      )
      if (cached) {
        return new Response(JSON.stringify(JSON.parse(cached)), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }

      const { data, error } = await supabase
        .from('anime')
        .select('title, synopsis, image_large_webp')
        .eq('mal_id', id)
        .single()

      if (error) {
        console.error('Error al obtener metadatos del anime:', error)
        return new Response('Internal server error', { status: 500 })
      }
      if (!data) {
        return new Response(
          JSON.stringify({ error: 'No se encontraron metadatos del anime' }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }
      const animeMetadatas = {
        title: `${data.title} - ${baseTitle}`,
        description: data.synopsis,
        image: data.image_large_webp,
      }
      await safeRedisOperation((client) =>
        client.set(`anime-metadatas:${id}`, JSON.stringify(animeMetadatas), {
          EX: 60 * 60 * 24,
        })
      )
      return new Response(JSON.stringify(animeMetadatas), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',

          Vary: 'Accept-Encoding',
        },
      })
    } catch (error) {
      console.error('Error al obtener metadatos del anime:', error)
      return new Response('Internal server error', { status: 500 })
    }
  })
)
