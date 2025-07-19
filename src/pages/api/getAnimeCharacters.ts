import { safeRedisOperation } from '@libs/redis'
import { rateLimit } from '@middlewares/rate-limit'
import { redisConnection } from '@middlewares/redis-connection'
import { getAnimeCharacters } from '@utils/get-anime-characters'
import type { APIRoute } from 'astro'

export const GET: APIRoute = rateLimit(
  redisConnection(async ({ url }) => {
    try {
      const animeId = url.searchParams.get('animeId')
      const language = url.searchParams.get('language')
      if (!animeId || !language) {
        return new Response(
          JSON.stringify({ error: 'Anime ID and language are required' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }
      const cacheKey = `anime-characters-${animeId}-${language}`
      const cachedCharacters = await safeRedisOperation((client) =>
        client.get(cacheKey)
      )

      if (cachedCharacters) {
        return new Response(JSON.stringify(JSON.parse(cachedCharacters)), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }

      const characters = await getAnimeCharacters(animeId, language)

      if (!characters) {
        return new Response(JSON.stringify({ error: 'No characters found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      await safeRedisOperation((client) =>
        client.set(cacheKey, JSON.stringify(characters), { EX: 60 * 60 * 24 })
      )

      return new Response(JSON.stringify(characters), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.error('Error fetching anime characters:', error)
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  })
)
