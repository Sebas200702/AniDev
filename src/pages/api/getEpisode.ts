import { redis } from '@libs/redis'
import { supabase } from '@libs/supabase'
import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'
import type { APIRoute } from 'astro'

/**
 * getEpisode endpoint retrieves detailed information about a specific anime episode.
 *
 * @summary
 * An API endpoint that fetches episode data using anime slug and episode number.
 *
 * @description
 * This endpoint implements a caching mechanism using Redis to optimize performance
 * and reduce database load. It validates the provided slug format and episode number,
 * and returns detailed episode information from the database. The endpoint includes
 * rate limiting to prevent abuse and implements proper error handling for various scenarios.
 *
 * The endpoint uses Redis caching to store episode data and implements proper
 * validation of input parameters. It includes comprehensive error handling and
 * development mode logging for debugging purposes.
 *
 * @features
 * - Rate limiting: Prevents API abuse with configurable limits
 * - Caching: Redis-based caching for episode data
 * - Input validation: Slug and episode number validation
 * - Error handling: Comprehensive error handling with appropriate status codes
 * - Development logging: Detailed error logging in development mode
 * - Database optimization: Efficient database queries with proper indexing
 *
 * @param {APIRoute} context - The API context containing request information
 * @param {URL} context.url - The request URL containing query parameters
 * @param {string} context.url.searchParams.get('slug') - The anime slug in format 'title_id'
 * @param {string} context.url.searchParams.get('ep') - The episode number
 * @returns {Promise<Response>} A Response object containing the episode data or error message
 *
 * @example
 * // Request
 * GET /api/getEpisode?slug=one-piece_21&ep=1
 *
 * // Success Response (200)
 * {
 *   "episode": {
 *     "anime_mal_id": 21,
 *     "episode_id": 1,
 *     // ... other episode details
 *   }
 * }
 *
 * // Error Response (404)
 * {
 *   "error": "Episode not found"
 * }
 */

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
      const cachedData = await redis.get(
        `episode:${url.searchParams.toString()}`
      )

      if (cachedData) {
        return new Response(
          JSON.stringify({ episode: JSON.parse(cachedData) }),
          {
            status: 200,
            headers: {
              'content-type': 'application/json',
              'Cache-Control': 'public, max-age=7200, s-maxage=7200',
              Expires: new Date(Date.now() + 7200 * 1000).toUTCString(),
            },
          }
        )
      }

      const slug = url.searchParams.get('slug')
      const ep = url.searchParams.get('ep')

      if (!slug) {
        return new Response(
          JSON.stringify({ error: 'Missing slug parameter' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }

      if (!ep) {
        return new Response(
          JSON.stringify({ error: 'Missing episode parameter' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }

      const [, id] = slug.split('_')

      if (!id) {
        return new Response(JSON.stringify({ error: 'Invalid slug format' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const { data, error } = await supabase
        .from('anime_episodes')
        .select('*')
        .eq('anime_mal_id', id)
        .eq('episode_id', ep)
        .single()

      await redis.set(
        `episode:${url.searchParams.toString()}`,
        JSON.stringify(data)
      )

      if (error) {
        if (import.meta.env.MODE === 'development') {
          console.error('Supabase Error:', error.message)
        }
        return new Response(
          JSON.stringify({ error: 'Error retrieving episode data' }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }

      if (!data || data.length === 0) {
        return new Response(JSON.stringify({ error: 'Episode not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({ episode: data }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=7200, s-maxage=7200',
          Expires: new Date(Date.now() + 7200 * 1000).toUTCString(),
        },
      })
    } catch (err) {
      if (import.meta.env.MODE === 'development') {
        console.error('Unhandled Error:', err)
      }
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  })
)
