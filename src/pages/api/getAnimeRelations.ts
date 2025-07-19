import { safeRedisOperation } from '@libs/redis'
import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'
import { getAnimeRelations } from '@utils/get-anime-relations'
import type { APIRoute } from 'astro'

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
      const animeId = url.searchParams.get('animeId')
      if (!animeId) {
        return new Response(JSON.stringify({ error: 'Anime ID is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      const cacheKey = `anime-relations-${animeId}`
      const cachedRelations = await safeRedisOperation((client) =>
        client.get(cacheKey)
      )

      if (cachedRelations) {
        return new Response(
          JSON.stringify({ data: JSON.parse(cachedRelations) }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      }

      const relations = await getAnimeRelations(animeId)
      

      await safeRedisOperation((client) =>
        client.set(cacheKey, JSON.stringify(relations), { EX: 60 * 60 * 24 })
      )

      return new Response(JSON.stringify({ data: relations }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.error(error)
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  })
)
